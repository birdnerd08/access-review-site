"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import AccessMarkerPicker from "@/components/AccessMarkerPicker";
import { getStadiumBySlug, submitReview, uploadReviewPhotos } from "@/lib/db";
import {
  AccessNeed,
  EventType,
  Recommendation,
  StadiumSummary,
} from "@/lib/types";

const ACCESS_NEEDS: AccessNeed[] = [
  "Power wheelchair",
  "Manual wheelchair",
  "Limited stamina / fatigue",
  "Chronic pain / sitting tolerance",
  "Heat sensitivity",
  "Mobility aid",
  "Companion / caregiver",
  "Sensory sensitivity",
  "Service animal",
];

const EVENT_TYPES: EventType[] = [
  "Football game",
  "Baseball game",
  "Basketball game",
  "Concert",
  "College sports",
  "Other stadium event",
];

const RATING_LABELS: Record<number, string> = {
  1: "Not accessible",
  2: "Slightly accessible",
  3: "Moderately accessible",
  4: "Very accessible",
  5: "Fully accessible",
};

interface FormData {
  eventType: EventType | "";
  accessNeeds: AccessNeed[];
  overallUsabilityRating: number;
  whatWorkedWell: string;
  barriersOrHardMoments: string;
  specificDetailToKnow: string;
  whoItWorksFor: string;
  wouldRecommend: Recommendation | "";
  seatSection: string;
}

interface FormErrors {
  eventType?: string;
  accessNeeds?: string;
  overallUsabilityRating?: string;
  whatWorkedWell?: string;
  barriersOrHardMoments?: string;
  specificDetailToKnow?: string;
  whoItWorksFor?: string;
  wouldRecommend?: string;
}

const emptyForm: FormData = {
  eventType: "",
  accessNeeds: [],
  overallUsabilityRating: 0,
  whatWorkedWell: "",
  barriersOrHardMoments: "",
  specificDetailToKnow: "",
  whoItWorksFor: "",
  wouldRecommend: "",
  seatSection: "",
};

const questionClass =
  "block text-lg sm:text-xl font-semibold leading-snug text-[#111827]";

const helpTextClass = "mt-2 text-base leading-6 text-[#4B5563]";

const inputClass =
  "w-full rounded-xl border border-[#CFC7B8] bg-white px-4 py-3 text-base text-[#111827] placeholder:text-[#6B7280] focus:border-[#1E3A5F] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]/30";

const errorClass = "mt-2 text-sm font-medium text-red-700";

function getDefaultMarkerLabel(type: string) {
  switch (type) {
    case "accessible_entrance":
      return "Accessible entrance";
    case "accessible_parking":
      return "Accessible parking";
    case "dropoff_zone":
      return "Drop-off zone";
    case "elevator":
      return "Elevator";
    case "accessible_restroom":
      return "Accessible restroom";
    case "problem_area":
      return "Problem area";
    default:
      return "Access marker";
  }
}

export default function NewReviewPage() {
  const params = useParams();
  const stadiumId = params.stadiumId as string;

  const [stadium, setStadium] = useState<StadiumSummary | null>(null);
  const [loadingStadium, setLoadingStadium] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const [includeAccessMarker, setIncludeAccessMarker] = useState(false);
  const [markerType, setMarkerType] = useState("accessible_entrance");
  const [markerLabel, setMarkerLabel] = useState("");
  const [markerNotes, setMarkerNotes] = useState("");
  const [markerLocation, setMarkerLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  useEffect(() => {
    let active = true;

    async function loadStadium() {
      try {
        const data = await getStadiumBySlug(stadiumId);

        if (active) {
          setStadium(data);
        }
      } finally {
        if (active) {
          setLoadingStadium(false);
        }
      }
    }

    loadStadium();

    return () => {
      active = false;
    };
  }, [stadiumId]);

  function toggleAccessNeed(need: AccessNeed) {
    setForm((previous) => ({
      ...previous,
      accessNeeds: previous.accessNeeds.includes(need)
        ? previous.accessNeeds.filter((item) => item !== need)
        : [...previous.accessNeeds, need],
    }));

    setErrors((previous) => ({
      ...previous,
      accessNeeds: undefined,
    }));
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.eventType) {
      newErrors.eventType = "Choose an event type.";
    }

    if (form.accessNeeds.length === 0) {
      newErrors.accessNeeds = "Choose at least one relevant access need.";
    }

    if (form.overallUsabilityRating === 0) {
      newErrors.overallUsabilityRating = "Choose an accessibility rating.";
    }

    if (!form.whatWorkedWell.trim()) {
      newErrors.whatWorkedWell = "Add a short note about what worked well.";
    }

    if (!form.barriersOrHardMoments.trim()) {
      newErrors.barriersOrHardMoments =
        "Add a note about barriers or difficult moments.";
    }

    if (!form.specificDetailToKnow.trim()) {
      newErrors.specificDetailToKnow =
        "Add one detail that would help another visitor plan.";
    }

    if (!form.whoItWorksFor.trim()) {
      newErrors.whoItWorksFor =
        "Describe who this venue may work well for and who may struggle.";
    }

    if (!form.wouldRecommend) {
      newErrors.wouldRecommend = "Choose a recommendation.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) {
      return;
    }

    if (includeAccessMarker && !markerLocation) {
      alert("Please click the map to place your access marker.");
      return;
    }

    setSubmitting(true);

    try {
      const reviewId = await submitReview(stadiumId, {
        eventType: form.eventType as string,
        accessNeeds: form.accessNeeds,
        overallUsabilityRating: form.overallUsabilityRating,
        whatWorkedWell: form.whatWorkedWell,
        barriersOrHardMoments: form.barriersOrHardMoments,
        specificDetailToKnow: form.specificDetailToKnow,
        whoItWorksFor: form.whoItWorksFor,
        wouldRecommend: form.wouldRecommend as string,
        seatSection: form.seatSection,
        accessMarker:
          includeAccessMarker && markerLocation
            ? {
                markerType,
                label: markerLabel.trim() || getDefaultMarkerLabel(markerType),
                notes: markerNotes,
                latitude: markerLocation.latitude,
                longitude: markerLocation.longitude,
              }
            : undefined,
      });

      if (!reviewId) {
        alert("Something went wrong submitting your review. Please try again.");
        return;
      }

      if (photoFiles.length > 0) {
        const photosUploaded = await uploadReviewPhotos({
          reviewId,
          stadiumId,
          files: photoFiles,
        });

        if (!photosUploaded) {
          alert(
            "Your review was submitted, but the photos did not upload. Your review was still saved."
          );

          setSubmitted(true);
          return;
        }
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Review submission error:", error);

      alert("Something went wrong submitting your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingStadium) {
    return (
      <main className="min-h-screen bg-[#FAF7F1] px-4 py-10 text-[#111827]">
        <div className="mx-auto max-w-2xl">
          <p className="text-base text-[#4B5563]">Loading venue...</p>
        </div>
      </main>
    );
  }

  if (!stadium) {
    return (
      <main className="min-h-screen bg-[#FAF7F1] px-4 py-10 text-[#111827]">
        <div className="mx-auto max-w-2xl">
          <p className="mb-4 text-base text-[#4B5563]">Venue not found.</p>

          <Link
            href="/stadiums"
            className="text-base font-semibold text-[#1E3A5F] underline-offset-4 hover:underline"
          >
            ← Back to stadiums
          </Link>
        </div>
      </main>
    );
  }

  const currentStadium = stadium;

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#FAF7F1] px-4 py-10 text-[#111827]">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-2xl border border-green-300 bg-green-50 p-8 shadow-sm">
            <p
              className="mb-4 text-4xl text-green-800"
              aria-hidden="true"
            >
              ✓
            </p>

            <h1 className="mb-3 text-2xl font-bold text-[#111827]">
              Thanks for your review
            </h1>

            <p className="mb-6 text-base leading-7 text-[#374151]">
              Your experience helps other disabled fans plan their visit to{" "}
              {currentStadium.name}.
            </p>

            <Link
              href={`/stadiums/${stadiumId}`}
              className="inline-block rounded-xl bg-[#1E3A5F] px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-[#162D49] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2"
            >
              Back to {currentStadium.name}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF7F1] px-4 py-10 text-[#111827]">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/stadiums/${stadiumId}`}
          className="mb-6 inline-block text-base font-semibold text-[#1E3A5F] underline-offset-4 hover:underline"
        >
          ← Back to {currentStadium.name}
        </Link>

        <div className="mb-10">
          <h1 className="mb-2 text-3xl font-bold leading-tight text-[#111827] sm:text-4xl">
            Review {currentStadium.name}
          </h1>

          <p className="text-base leading-7 text-[#4B5563]">
            Help the next fan plan their visit. This form usually takes about
            3–5 minutes.
          </p>

          <p className="mt-2 text-sm font-medium text-[#4B5563]">
            Questions marked with an asterisk are required.
          </p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-10"
          noValidate
        >
          {/* Q1 — Event type */}
          <section>
            <label htmlFor="event-type" className={questionClass}>
              1. What kind of event did you attend?
              <span className="ml-1 text-red-700" aria-hidden="true">
                *
              </span>
            </label>

            <select
              id="event-type"
              value={form.eventType}
              onChange={(event) => {
                setForm((previous) => ({
                  ...previous,
                  eventType: event.target.value as EventType,
                }));

                setErrors((previous) => ({
                  ...previous,
                  eventType: undefined,
                }));
              }}
              className={`${inputClass} mt-3`}
              aria-invalid={Boolean(errors.eventType)}
              aria-describedby={
                errors.eventType ? "event-type-error" : undefined
              }
            >
              <option value="">Select event type</option>

              {EVENT_TYPES.map((eventType) => (
                <option key={eventType} value={eventType}>
                  {eventType}
                </option>
              ))}
            </select>

            {errors.eventType && (
              <p id="event-type-error" className={errorClass}>
                {errors.eventType}
              </p>
            )}
          </section>

          {/* Q2 — Access needs */}
          <fieldset>
            <legend className={questionClass}>
              2. Which access needs are relevant to your experience?
              <span className="ml-1 text-red-700" aria-hidden="true">
                *
              </span>
            </legend>

            <p className={helpTextClass}>
              Select all that apply. This helps readers understand the
              perspective behind your review.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              {ACCESS_NEEDS.map((need) => {
                const selected = form.accessNeeds.includes(need);

                return (
                  <button
                    key={need}
                    type="button"
                    onClick={() => toggleAccessNeed(need)}
                    aria-pressed={selected}
                    className={`min-h-11 rounded-full border-2 px-4 py-2 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2 ${
                      selected
                        ? "border-[#1E3A5F] bg-[#1E3A5F] text-white"
                        : "border-[#B9B09F] bg-white text-[#111827] hover:border-[#1E3A5F]"
                    }`}
                  >
                    {need}
                  </button>
                );
              })}
            </div>

            {errors.accessNeeds && (
              <p className={errorClass}>{errors.accessNeeds}</p>
            )}
          </fieldset>

          {/* Q3 — Rating */}
          <fieldset>
            <legend className={questionClass}>
              3. How accessible was this venue for your needs?
              <span className="ml-1 text-red-700" aria-hidden="true">
                *
              </span>
            </legend>

            <p className={helpTextClass}>
              Choose the option that best reflects your overall experience.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-5">
              {[1, 2, 3, 4, 5].map((rating) => {
                const selected = form.overallUsabilityRating === rating;

                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => {
                      setForm((previous) => ({
                        ...previous,
                        overallUsabilityRating: rating,
                      }));

                      setErrors((previous) => ({
                        ...previous,
                        overallUsabilityRating: undefined,
                      }));
                    }}
                    aria-pressed={selected}
                    className={`flex min-h-24 flex-col items-center justify-center rounded-xl border-2 px-3 py-3 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2 ${
                      selected
                        ? "border-[#1E3A5F] bg-[#1E3A5F] text-white"
                        : "border-[#B9B09F] bg-white text-[#111827] hover:border-[#1E3A5F]"
                    }`}
                  >
                    <span className="text-xl font-bold">{rating}</span>

                    <span className="mt-1 text-sm font-medium leading-tight">
                      {RATING_LABELS[rating]}
                    </span>
                  </button>
                );
              })}
            </div>

            {errors.overallUsabilityRating && (
              <p className={errorClass}>
                {errors.overallUsabilityRating}
              </p>
            )}
          </fieldset>

          {/* Q4 — What worked well */}
          <section>
            <label htmlFor="worked-well" className={questionClass}>
              4. What worked well?
              <span className="ml-1 text-red-700" aria-hidden="true">
                *
              </span>
            </label>

            <p className={helpTextClass}>
              For example: accessible parking, entrances, staff assistance,
              seating views, companion seating, bathrooms, elevators, or shade.
            </p>

            <textarea
              id="worked-well"
              value={form.whatWorkedWell}
              onChange={(event) => {
                setForm((previous) => ({
                  ...previous,
                  whatWorkedWell: event.target.value,
                }));

                setErrors((previous) => ({
                  ...previous,
                  whatWorkedWell: undefined,
                }));
              }}
              rows={4}
              className={`${inputClass} mt-3 resize-y`}
              placeholder="What made the experience work well for you?"
              aria-invalid={Boolean(errors.whatWorkedWell)}
              aria-describedby={
                errors.whatWorkedWell ? "worked-well-error" : undefined
              }
            />

            {errors.whatWorkedWell && (
              <p id="worked-well-error" className={errorClass}>
                {errors.whatWorkedWell}
              </p>
            )}
          </section>

          {/* Q5 — Barriers */}
          <section>
            <label htmlFor="barriers" className={questionClass}>
              5. What barriers or difficult moments did you encounter?
              <span className="ml-1 text-red-700" aria-hidden="true">
                *
              </span>
            </label>

            <p className={helpTextClass}>
              For example: long routes, elevator waits, blocked sightlines,
              steep ramps, crowding, heat, or distant bathrooms.
            </p>

            <textarea
              id="barriers"
              value={form.barriersOrHardMoments}
              onChange={(event) => {
                setForm((previous) => ({
                  ...previous,
                  barriersOrHardMoments: event.target.value,
                }));

                setErrors((previous) => ({
                  ...previous,
                  barriersOrHardMoments: undefined,
                }));
              }}
              rows={4}
              className={`${inputClass} mt-3 resize-y`}
              placeholder="What was difficult, inaccessible, or unexpected?"
              aria-invalid={Boolean(errors.barriersOrHardMoments)}
              aria-describedby={
                errors.barriersOrHardMoments
                  ? "barriers-error"
                  : undefined
              }
            />

            {errors.barriersOrHardMoments && (
              <p id="barriers-error" className={errorClass}>
                {errors.barriersOrHardMoments}
              </p>
            )}
          </section>

          {/* Q6 — Specific detail */}
          <section>
            <label htmlFor="specific-detail" className={questionClass}>
              6. What do you wish you had known about this venue&apos;s
              accessibility before buying tickets?
              <span className="ml-1 text-red-700" aria-hidden="true">
                *
              </span>
            </label>

            <p className={helpTextClass}>
              Please be as specific as possible. You might mention a seating
              section, entrance route, parking timing, bathroom distance,
              elevator wait, shade, or crowd timing.
            </p>

            <div className="mt-3 rounded-xl border border-[#B8C8D8] bg-[#EEF3F8] p-4">
              <p className="text-base leading-6 text-[#1E3A5F]">
                This is one of the most useful details you can share with
                another visitor deciding whether to buy tickets.
              </p>
            </div>

            <textarea
              id="specific-detail"
              value={form.specificDetailToKnow}
              onChange={(event) => {
                setForm((previous) => ({
                  ...previous,
                  specificDetailToKnow: event.target.value,
                }));

                setErrors((previous) => ({
                  ...previous,
                  specificDetailToKnow: undefined,
                }));
              }}
              rows={4}
              className={`${inputClass} mt-3 resize-y`}
              placeholder="What is the most important thing someone should know before buying tickets here?"
              aria-invalid={Boolean(errors.specificDetailToKnow)}
              aria-describedby={
                errors.specificDetailToKnow
                  ? "specific-detail-error"
                  : undefined
              }
            />

            {errors.specificDetailToKnow && (
              <p id="specific-detail-error" className={errorClass}>
                {errors.specificDetailToKnow}
              </p>
            )}
          </section>

          {/* Q7 — Who it works for */}
          <section>
            <label htmlFor="who-it-works-for" className={questionClass}>
              7. Who might this venue work well for, and who might need to plan
              more carefully?
              <span className="ml-1 text-red-700" aria-hidden="true">
                *
              </span>
            </label>

            <p className={helpTextClass}>
              For example: it may work well for power wheelchair users who
              arrive early, but be difficult for people with fatigue after the
              final whistle.
            </p>

            <textarea
              id="who-it-works-for"
              value={form.whoItWorksFor}
              onChange={(event) => {
                setForm((previous) => ({
                  ...previous,
                  whoItWorksFor: event.target.value,
                }));

                setErrors((previous) => ({
                  ...previous,
                  whoItWorksFor: undefined,
                }));
              }}
              rows={4}
              className={`${inputClass} mt-3 resize-y`}
              placeholder="Who may have a good experience here? Who may encounter difficulties?"
              aria-invalid={Boolean(errors.whoItWorksFor)}
              aria-describedby={
                errors.whoItWorksFor ? "who-it-works-for-error" : undefined
              }
            />

            {errors.whoItWorksFor && (
              <p id="who-it-works-for-error" className={errorClass}>
                {errors.whoItWorksFor}
              </p>
            )}
          </section>

          {/* Q8 — Would recommend */}
          <fieldset>
            <legend className={questionClass}>
              8. Would you buy tickets here again or recommend this venue to
              someone with similar access needs?
              <span className="ml-1 text-red-700" aria-hidden="true">
                *
              </span>
            </legend>

            <div className="mt-4 flex flex-wrap gap-3">
              {(
                [
                  "Yes",
                  "Maybe, with preparation",
                  "No",
                  "Not sure",
                ] as Recommendation[]
              ).map((option) => {
                const selected = form.wouldRecommend === option;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setForm((previous) => ({
                        ...previous,
                        wouldRecommend: option,
                      }));

                      setErrors((previous) => ({
                        ...previous,
                        wouldRecommend: undefined,
                      }));
                    }}
                    aria-pressed={selected}
                    className={`min-h-11 rounded-xl border-2 px-4 py-2 text-base font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2 ${
                      selected
                        ? "border-[#1E3A5F] bg-[#1E3A5F] text-white"
                        : "border-[#B9B09F] bg-white text-[#111827] hover:border-[#1E3A5F]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {errors.wouldRecommend && (
              <p className={errorClass}>{errors.wouldRecommend}</p>
            )}
          </fieldset>

          {/* Optional — Seat section */}
          <section>
            <label htmlFor="seat-section" className={questionClass}>
              Seat section{" "}
              <span className="font-normal text-[#4B5563]">(optional)</span>
            </label>

            <p className={helpTextClass}>
              Include the section, row, platform, or seating area if you know
              it.
            </p>

            <input
              id="seat-section"
              type="text"
              value={form.seatSection}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  seatSection: event.target.value,
                }))
              }
              className={`${inputClass} mt-3`}
              placeholder="For example: Section 118, ADA platform"
            />
          </section>

          {/* Optional — Access marker */}
          <section className="rounded-2xl border border-[#D8D0C2] bg-white p-5 shadow-sm">
            <label className="flex cursor-pointer items-start gap-4">
              <input
                type="checkbox"
                checked={includeAccessMarker}
                onChange={(event) =>
                  setIncludeAccessMarker(event.target.checked)
                }
                className="mt-1 h-6 w-6 shrink-0 cursor-pointer rounded border-2 border-[#4B5563] accent-[#1E3A5F] focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2"
              />

              <span>
                <span className="block text-lg font-semibold text-[#111827]">
                  Add a location to the accessibility map
                </span>

                <span className="mt-1 block text-base leading-6 text-[#4B5563]">
                  Mark a specific entrance, bathroom, elevator, parking area,
                  seating section, drop-off point, or problem spot. This is
                  optional, but it can help other visitors plan their trip.
                </span>
              </span>
            </label>

            {includeAccessMarker && (
              <div className="mt-6 grid grid-cols-1 gap-5 border-t border-[#E5DED1] pt-6">
                <div>
                  <label htmlFor="marker-type" className={questionClass}>
                    Marker type
                  </label>

                  <select
                    id="marker-type"
                    value={markerType}
                    onChange={(event) => setMarkerType(event.target.value)}
                    className={`${inputClass} mt-3`}
                  >
                    <option value="accessible_entrance">
                      Accessible entrance
                    </option>
                    <option value="accessible_parking">
                      Accessible parking
                    </option>
                    <option value="dropoff_zone">Drop-off zone</option>
                    <option value="elevator">Elevator</option>
                    <option value="accessible_restroom">
                      Accessible restroom
                    </option>
                    <option value="problem_area">Problem area</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="marker-label" className={questionClass}>
                    Label{" "}
                    <span className="font-normal text-[#4B5563]">
                      (optional)
                    </span>
                  </label>

                  <input
                    id="marker-label"
                    value={markerLabel}
                    onChange={(event) => setMarkerLabel(event.target.value)}
                    placeholder="Add a specific name if helpful"
                    className={`${inputClass} mt-3`}
                  />
                </div>

                <div>
                  <label htmlFor="marker-notes" className={questionClass}>
                    Notes
                  </label>

                  <textarea
                    id="marker-notes"
                    value={markerNotes}
                    onChange={(event) => setMarkerNotes(event.target.value)}
                    placeholder="What should someone know about this location?"
                    rows={3}
                    className={`${inputClass} mt-3 resize-y`}
                  />
                </div>

                <div>
                  <p className={questionClass}>Marker location</p>

                  <p className={helpTextClass}>
                    Select the exact location on the map.
                  </p>

                  <div className="mt-3 overflow-hidden rounded-xl border border-[#CFC7B8]">
                    <AccessMarkerPicker
                      stadium={currentStadium}
                      value={markerLocation}
                      onChange={setMarkerLocation}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Optional — Photos */}
          <section className="rounded-2xl border border-[#D8D0C2] bg-white p-5 shadow-sm">
            <label htmlFor="review-photos" className={questionClass}>
              Add photos{" "}
              <span className="font-normal text-[#4B5563]">(optional)</span>
            </label>

            <p className={helpTextClass}>
              Upload up to three photos that help another disabled fan plan
              their visit, such as entrances, ramps, seating views, bathrooms,
              elevators, signs, parking, or problem areas. Photos will be
              reviewed before appearing publicly.
            </p>

            <input
              id="review-photos"
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []).slice(0, 3);
                setPhotoFiles(files);
              }}
              className="mt-4 block w-full cursor-pointer rounded-xl border border-[#CFC7B8] bg-[#FAF7F1] p-3 text-base text-[#111827] file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#1E3A5F] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#162D49]"
            />

            {photoFiles.length > 0 && (
              <div
                className="mt-4 rounded-xl bg-[#FAF7F1] p-4"
                aria-live="polite"
              >
                <p className="mb-2 text-sm font-semibold text-[#111827]">
                  Selected photos:
                </p>

                <ul className="space-y-1 text-sm text-[#4B5563]">
                  {photoFiles.map((file) => (
                    <li key={`${file.name}-${file.lastModified}`}>
                      • {file.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-[#1E3A5F] px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-[#162D49] focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#6B7280]"
            >
              {submitting ? "Submitting..." : "Submit review"}
            </button>

            <p className="mt-4 text-center text-base leading-6 text-[#4B5563]">
              Your review helps other disabled fans make informed decisions.
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}