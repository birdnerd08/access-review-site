"use client";

import { VenueType } from "@/lib/types";

const VENUE_TYPES: VenueType[] = [
  "Football Stadium",
  "Baseball Stadium",
  "Basketball / Concert Arena",
  "College Stadium",
  "Other",
];

interface SearchFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  venueType: VenueType | "";
  onVenueTypeChange: (value: VenueType | "") => void;
}

export default function SearchFilters({
  search,
  onSearchChange,
  venueType,
  onVenueTypeChange,
}: SearchFiltersProps) {
  const hasFilters = search !== "" || venueType !== "";

  function clearAll() {
    onSearchChange("");
    onVenueTypeChange("");
  }

  return (
    <div className="flex flex-col gap-3 mb-8">
      {/* Search input */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          🔍
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by stadium name, city, or state..."
          className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* Venue type filters */}
      <div className="flex flex-wrap gap-2">
        {VENUE_TYPES.map((type) => {
          const selected = venueType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onVenueTypeChange(selected ? "" : type)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                selected
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-blue-600 hover:underline self-start"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}