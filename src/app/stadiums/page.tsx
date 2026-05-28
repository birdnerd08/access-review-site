"use client";

import { useState } from "react";
import StadiumCard from "@/components/StadiumCard";
import SearchFilters from "@/components/SearchFilters";
import { stadiums } from "@/lib/sample-data";
import { VenueType } from "@/lib/types";

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

export default function StadiumsPage() {
  const [search, setSearch] = useState("");
  const [venueType, setVenueType] = useState<VenueType | "">("");

  const filtered = stadiums.filter((s) => {
    const q = search.toLowerCase();
    const fullStateName = stateNames[s.state] ?? "";
    const matchesSearch =
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.state.toLowerCase().includes(q) ||
      fullStateName.includes(q) ||
      s.venueType.toLowerCase().includes(q);
    const matchesVenueType = venueType === "" || s.venueType === venueType;
    return matchesSearch && matchesVenueType;
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Stadium Accessibility Reviews
      </h1>
      <p className="text-gray-500 mb-8">
        Real reviews from wheelchair users and disabled fans.
      </p>

      <SearchFilters
        search={search}
        onSearchChange={setSearch}
        venueType={venueType}
        onVenueTypeChange={setVenueType}
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500 mb-1">No stadiums match your search.</p>
          <p className="text-sm text-gray-400">Try a different name, city, state, or venue type.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filtered.map((stadium) => (
            <StadiumCard key={stadium.id} stadium={stadium} />
          ))}
        </div>
      )}
    </main>
  );
}