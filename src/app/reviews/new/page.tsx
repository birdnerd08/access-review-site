"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllStadiums } from "@/lib/db";
import { StadiumSummary, AccessNeed, EventType, Recommendation } from "@/lib/types";

const stateNames: Record<string, string> = {
  AL: "alabama", AK: "alaska", AZ: "arizona", AR: "arkansas", CA: "california",
  CO: "colorado", CT: "connecticut", DE: "delaware", FL: "florida", GA: "georgia",
  HI: "hawaii", ID: "idaho", IL: "illinois", IN: "indiana", IA: "iowa",
  KS: "kansas", KY: "kentucky", LA: "louisiana", ME: "maine", MD: "maryland",
  MA: "massachusetts", MI: "michigan", MN: "minnesota", MS: "mississippi",
  MO: "missouri", MT: "montana", NE: "nebraska", NV: "nevada", NH: "new hampshire",
  NJ: "new jersey", NM: "new mexico", NY: "new york", NC: "north carolina",
  ND: "north dakota", OH: "ohio", OK: "oklahoma", OR: "oregon", PA: "pennsylvania",
  RI: "rhode island", SC: "south carolina", SD: "south dakota", TN: "tennessee",
  TX: "texas", UT: "utah", VT: "vermont", VA: "virginia", WA: "washington",
  WV: "west virginia", WI: "wisconsin", WY: "wyoming", DC: "district of columbia",
};

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

export default function SelectStadiumPage() {
  const router = useRouter();
  const [stadiums, setStadiums] = useState<StadiumSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");
  const [step, setStep] = useState<"select" | "form">("select");
  const [form, setForm] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getAllStadiums().then((data) => {
      setStadiums(data);
      setLoading(false);
    });
  }, []);

  const filtered = stadiums.filter((s) => {
    const q = search.toLowerCase();
    const fullStateName = stateNames[s.state] ?? "";
    return (
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q) ||
      fullStateName.includes(q) ||
      s.venueType.toLowerCase().includes(q)
    );
  });

  function handleContinue() {
    if (!selected) return;
    router.push(`/stadiums/${selected}/reviews/new`);
  }

  if (submitted) {
    const stadium = stadiums.find((s) => s.slug === selected);
    return (
      <main className="max-w-2xl mx-auto px-4 py-10 text-center">
        <div className="bg-green-50 border border-green-200 rounded-xl p-8">
          <p className="text-4xl mb-4">✓</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Thanks for your review
          </h2>
          <p className="text-gray-600 mb-6">
            Your experience helps other disabled fans plan their visit
            {stadium ? ` to ${stadium.name}` : ""}.
          </p>
          
            href="/stadiums"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors inline-block"
          >
            Browse all stadiums
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Write a review
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Select the stadium you visited to get started.
      </p>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          🔍
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelected("");
          }}
          placeholder="Search by stadium name, city, or state..."
          className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {search && (
          <button
            type="button"
            onClick={() => { setSearch(""); setSelected(""); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Stadium list */}
      <div className="flex flex-col gap-3 mb-6">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-xl px-5 py-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-500 text-sm">No stadiums found for "{search}".</p>
            <p className="text-xs text-gray-400 mt-1">
              Try a different name, city, or state.
            </p>
          </div>
        ) : (
          filtered.map((stadium) => {
            const isSelected = selected === stadium.slug;
            return (
              <button
                key={stadium.slug}
                type="button"
                onClick={() => setSelected(stadium.slug)}
                className={`text-left border rounded-xl px-5 py-4 transition-colors ${
                  isSelected
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-blue-300"
                }`}
              >
                <p className={`font-semibold ${isSelected ? "text-blue-700" : "text-gray-900"}`}>
                  {stadium.name}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {stadium.city}, {stadium.state} · {stadium.venueType}
                </p>
              </button>
            );
          })
        )}
      </div>

      <button
        type="button"
        onClick={handleContinue}
        disabled={!selected}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors text-sm"
      >
        Continue to review form
      </button>
    </main>
  );
}