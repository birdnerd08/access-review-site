"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  AccessNeed,
  EventType,
  Recommendation,
  StadiumSummary,
} from "@/lib/types";
import { getStadiumBySlug, submitReview, uploadReviewPhotos } from "@/lib/db";
import AccessMarkerPicker from "@/components/AccessMarkerPicker";

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
  1: "Not usable",
  2: "Difficult",
  3: "Usable with issues",
  4: "Mostly usable",
  5: "Very usable",
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
  const router = useRouter();
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
    getStadiumBySlug(stadiumId).then((data) => {
      setStadium(data);
      setLoadingStadium(false);
    });
  }, [stadiumId]);

  if (loadingStadium) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10">
        <p className="text-gray-500">Loading stadium...</p>
      </main>
    );
  }

  if (!stadium) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10">
        <p className="text-gray-500">Stadium not found.</p>
        <Link href="/stadiums" className="text-blue-600 hover:underline text-sm">
          ← Back to stadiums
        </Link>
      </main>
    );
  }

  const currentStadium = stadium;

  function toggleAccessNeed(need: AccessNeed) {
    setForm((prev) => ({
      ...prev,
      accessNeeds: prev.accessNeeds.includes(need)
        ? prev.accessNeeds.filter((n) => n !== need)
        : [...prev.accessNeeds, need],
    }));
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!form.eventType) newErrors.eventType = "Choose an event type.";

    if (form.accessNeeds.length === 0) {
      newErrors.accessNeeds = "Choose at least one access need.";
    }

    if (form.overallUsabilityRating === 0) {
      newErrors.overallUsabilityRating = "Choose a rating.";
    }

    if (!form.whatWorkedWell.trim()) {
      newErrors.whatWorkedWell = "Add a short note about what worked well.";
    }

    if (!form.barriersOrHardMoments.trim()) {
      newErrors.barriersOrHardMoments =
        "Add a note about barriers or hard moments.";
    }

    if (!form.specificDetailToKnow.trim()) {
      newErrors.specificDetailToKnow =
        "Add one detail that would help another fan plan.";
    }

    if (!form.whoItWorksFor.trim()) {
      newErrors.whoItWorksFor =
        "Describe who this stadium works for and who might struggle.";
    }

    if (!form.wouldRecommend) {
      newErrors.wouldRecommend = "Choose a recommendation.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;

    if (includeAccessMarker && !markerLocation) {
      alert("Please click the map to place your access marker.");
      return;
    }

    setSubmitting(true);

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
      setSubmitting(false);
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
        setSubmitting(false);
        alert(
          "Your review was submitted, but the photos did not upload. You can continue for now."
        );
        setSubmitted(true);
        return;
      }
    }

    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-10 text-center">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8">
          <p className="text-4xl mb-4">✓</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Thanks for your review
          </h2>
          <p className="text-gray-600 mb-6">
            Your experience helps other disabled fans plan their visit to{" "}
            {currentStadium.name}.
          </p>
          <Link
            href={`/stadiums/${stadiumId}`}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors inline-block"
          >
            Back to {currentStadium.name}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <Link
        href={`/stadiums/${stadiumId}`}
        className="text-sm text-blue-600 hover:underline mb-6 inline-block"
      >
        ← Back to {currentStadium.name}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Review {currentStadium.name}
      </h1>

      <p className="text-gray-500 text-sm mb-8">
        Help the next fan plan their visit. Takes about 3–5 minutes.
      </p>

      <div className="flex flex-col gap-8">
        {/* Q1 — Event type */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            1. What kind of event did you attend?
            <span className="text-red-500 ml-1">*</span>
          </label>
          <select
            value={form.eventType}
            onChange={(e) =>
              setForm((p) => ({ ...p, eventType: e.target.value as EventType }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select event type</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.eventType && (
            <p className="text-red-500 text-xs mt-1">{errors.eventType}</p>
          )}
        </div>

        {/* Q2 — Access needs */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            2. What access needs should your review be understood through?
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {ACCESS_NEEDS.map((need) => {
              const selected = form.accessNeeds.includes(need);
              return (
                <button
                  key={need}
                  type="button"
                  onClick={() => toggleAccessNeed(need)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
                    selected
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-indigo-400"
                  }`}
                >
                  {need}
                </button>
              );
            })}
          </div>
          {errors.accessNeeds && (
            <p className="text-red-500 text-xs mt-2">{errors.accessNeeds}</p>
          )}
        </div>

        {/* Q3 — Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            3. Overall, how usable was the stadium for your needs?
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex gap-3 flex-wrap">
            {[1, 2, 3, 4, 5].map((n) => {
              const selected = form.overallUsabilityRating === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() =>
                    setForm((p) => ({ ...p, overallUsabilityRating: n }))
                  }
                  className={`flex flex-col items-center px-4 py-2 rounded-lg border transition-colors ${
                    selected
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  }`}
                >
                  <span className="text-lg font-bold">{n}</span>
                  <span className="text-xs">{RATING_LABELS[n]}</span>
                </button>
              );
            })}
          </div>
          {errors.overallUsabilityRating && (
            <p className="text-red-500 text-xs mt-2">
              {errors.overallUsabilityRating}
            </p>
          )}
        </div>

        {/* Q4 — What worked well */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            4. What worked well?
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            e.g. accessible parking, entrance, staff, seating view, companion
            seat, bathroom, elevator, shade
          </p>
          <textarea
            value={form.whatWorkedWell}
            onChange={(e) =>
              setForm((p) => ({ ...p, whatWorkedWell: e.target.value }))
            }
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What made the experience work for you?"
          />
          {errors.whatWorkedWell && (
            <p className="text-red-500 text-xs mt-1">{errors.whatWorkedWell}</p>
          )}
        </div>

        {/* Q5 — Barriers */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            5. What barriers or hard moments did you run into?
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            e.g. long routes, elevator waits, blocked sightlines, steep ramps,
            crowding, heat, bathroom distance
          </p>
          <textarea
            value={form.barriersOrHardMoments}
            onChange={(e) =>
              setForm((p) => ({ ...p, barriersOrHardMoments: e.target.value }))
            }
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What was difficult or unexpected?"
          />
          {errors.barriersOrHardMoments && (
            <p className="text-red-500 text-xs mt-1">
              {errors.barriersOrHardMoments}
            </p>
          )}
        </div>

        {/* Q6 — Specific detail */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            6. What specific detail would have helped you know before buying
            tickets?
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            e.g. seat section, entrance route, parking timing, bathroom
            distance, elevator wait, shade, crowd timing
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-2">
            <p className="text-xs text-blue-700">
              This is the most useful thing you can share — one specific detail
              that would help another fan decide whether to buy tickets.
            </p>
          </div>
          <textarea
            value={form.specificDetailToKnow}
            onChange={(e) =>
              setForm((p) => ({ ...p, specificDetailToKnow: e.target.value }))
            }
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="What's the one thing someone should know before buying tickets here?"
          />
          {errors.specificDetailToKnow && (
            <p className="text-red-500 text-xs mt-1">
              {errors.specificDetailToKnow}
            </p>
          )}
        </div>

        {/* Q7 — Who it works for */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            7. Who would this stadium work well for, and who might struggle?
            <span className="text-red-500 ml-1">*</span>
          </label>
          <p className="text-xs text-gray-400 mb-2">
            e.g. Good for power wheelchair users if they arrive early; difficult
            for people with fatigue after the final whistle
          </p>
          <textarea
            value={form.whoItWorksFor}
            onChange={(e) =>
              setForm((p) => ({ ...p, whoItWorksFor: e.target.value }))
            }
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Who is this a good experience for? Who should plan carefully or avoid?"
          />
          {errors.whoItWorksFor && (
            <p className="text-red-500 text-xs mt-1">{errors.whoItWorksFor}</p>
          )}
        </div>

        {/* Q8 — Would recommend */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            8. Would you buy tickets here again or recommend it to someone with
            similar access needs?
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            {(["Yes", "Maybe, with preparation", "No", "Not sure"] as Recommendation[]).map(
              (option) => {
                const selected = form.wouldRecommend === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      setForm((p) => ({ ...p, wouldRecommend: option }))
                    }
                    className={`text-sm px-4 py-2 rounded-lg border transition-colors ${
                      selected
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {option}
                  </button>
                );
              }
            )}
          </div>
          {errors.wouldRecommend && (
            <p className="text-red-500 text-xs mt-2">{errors.wouldRecommend}</p>
          )}
        </div>

        {/* Optional — Seat section */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">
            Seat section{" "}
            <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <input
            type="text"
            value={form.seatSection}
            onChange={(e) =>
              setForm((p) => ({ ...p, seatSection: e.target.value }))
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Section 118, ADA platform"
          />
        </div>

        {/* Optional — Access marker */}
        <div className="border border-gray-200 rounded-xl p-4">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-3">
            <input
              type="checkbox"
              checked={includeAccessMarker}
              onChange={(e) => setIncludeAccessMarker(e.target.checked)}
            />
            Add an access map marker
          </label>

          {includeAccessMarker && (
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marker type
                </label>
                <select
                  value={markerType}
                  onChange={(e) => setMarkerType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="accessible_entrance">Accessible entrance</option>
                  <option value="accessible_parking">Accessible parking</option>
                  <option value="dropoff_zone">Drop-off zone</option>
                  <option value="elevator">Elevator</option>
                  <option value="accessible_restroom">Accessible restroom</option>
                  <option value="problem_area">Problem area</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  value={markerLabel}
                  onChange={(e) => setMarkerLabel(e.target.value)}
                  placeholder="Add a specific name if helpful"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={markerNotes}
                  onChange={(e) => setMarkerNotes(e.target.value)}
                  placeholder="What should someone know about this spot?"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marker location
                </label>
                <AccessMarkerPicker
                  stadium={currentStadium}
                  value={markerLocation}
                  onChange={setMarkerLocation}
                />
              </div>
            </div>
          )}
        </div>
{/* Optional — Photos */}
<div className="border border-gray-200 rounded-xl p-4">
  <label className="block text-sm font-semibold text-gray-800 mb-1">
    Add photos <span className="text-gray-400 font-normal">(optional)</span>
  </label>

  <p className="text-xs text-gray-400 mb-3">
    Upload up to 3 photos that help another disabled fan plan their visit, such
    as entrances, ramps, seating views, bathrooms, elevators, signage, parking,
    or problem areas. Photos will be reviewed before appearing publicly.
  </p>

  <input
    type="file"
    accept="image/*"
    multiple
    onChange={(e) => {
      const files = Array.from(e.target.files ?? []).slice(0, 3);
      setPhotoFiles(files);
    }}
    className="block w-full text-sm text-gray-600"
  />

  {photoFiles.length > 0 && (
    <div className="mt-3 text-xs text-gray-500">
      {photoFiles.map((file) => (
        <p key={file.name}>• {file.name}</p>
      ))}
    </div>
  )}
</div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm"
          >
            {submitting ? "Submitting..." : "Submit review"}
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Your review helps other disabled fans make informed decisions.
          </p>
        </div>
      </div>
    </main>
  );
}