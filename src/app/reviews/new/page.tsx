"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { stadiums } from "@/lib/sample-data";

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

export default function SelectStadiumPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("");
  const [search, setSearch] = useState("");

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
        {filtered.length === 0 ? (
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