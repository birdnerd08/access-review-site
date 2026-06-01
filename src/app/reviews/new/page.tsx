"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAllStadiums, addStadiumFromGooglePlaces } from "@/lib/db";
import { StadiumSummary, VenueType } from "@/lib/types";

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

interface GooglePlace {
  googlePlaceId: string;
  name: string;
  address: string;
  city: string;
  state: string;
}

export default function SelectStadiumPage() {
  const router = useRouter();
  const [stadiums, setStadiums] = useState<StadiumSummary[]>([]);
  const [loadingStadiums, setLoadingStadiums] = useState(true);
  const [search, setSearch] = useState("");
  const [googleResults, setGoogleResults] = useState<GooglePlace[]>([]);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getAllStadiums().then((data) => {
      setStadiums(data);
      setLoadingStadiums(false);
    });
  }, []);

  const searchGoogle = useCallback(async (query: string) => {
    if (query.length < 3) {
      setGoogleResults([]);
      return;
    }
    setLoadingGoogle(true);
    try {
      const res = await fetch(
        `/api/places?query=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setGoogleResults(data.places ?? []);
    } catch {
      setGoogleResults([]);
    } finally {
      setLoadingGoogle(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchGoogle(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, searchGoogle]);

  const localFiltered = stadiums.filter((s) => {
    if (!search) return true;
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

  // Filter out Google results already in our database
  const newGoogleResults = googleResults.filter(
    (g) => !stadiums.some((s) => s.name.toLowerCase() === g.name.toLowerCase())
  );

  async function handleSelectGoogle(place: GooglePlace) {
    setAdding(true);
    const slug = await addStadiumFromGooglePlaces({
      googlePlaceId: place.googlePlaceId,
      name: place.name,
      city: place.city,
      state: place.state,
      venueType: "Other",
    });
    setAdding(false);
    if (slug) {
      router.push(`/stadiums/${slug}/reviews/new`);
    } else {
      alert("Something went wrong. Please try again.");
    }
  }

  function handleSelectLocal(slug: string) {
    router.push(`/stadiums/${slug}/reviews/new`);
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Write a review
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Search for the stadium you visited to get started.
      </p>

      {/* Search */}
      <div className="relative mb-4">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          🔍
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by stadium name, city, or state..."
          className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {adding && (
        <div className="text-center py-6 text-sm text-gray-500 animate-pulse">
          Adding stadium...
        </div>
      )}

      {!adding && (
        <div className="flex flex-col gap-6">

          {/* Local results */}
          {loadingStadiums ? (
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
          ) : localFiltered.length > 0 ? (
            <div>
              {search && (
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                  Reviewed stadiums
                </p>
              )}
              <div className="flex flex-col gap-3">
                {localFiltered.map((stadium) => (
                  <button
                    key={stadium.slug}
                    type="button"
                    onClick={() => handleSelectLocal(stadium.slug)}
                    className="text-left border border-gray-200 bg-white rounded-xl px-5 py-4 hover:border-blue-300 transition-colors"
                  >
                    <p className="font-semibold text-gray-900">{stadium.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {stadium.city}, {stadium.state} · {stadium.venueType}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {stadium.reviewCount}{" "}
                      {stadium.reviewCount === 1 ? "review" : "reviews"}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Google Places results */}
          {search.length >= 3 && (
            <div>
              {loadingGoogle ? (
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Searching for more stadiums...
                  </p>
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="border border-gray-200 rounded-xl px-5 py-4 animate-pulse"
                    >
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : newGoogleResults.length > 0 ? (
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Add a new stadium
                  </p>
                  <div className="flex flex-col gap-3">
                    {newGoogleResults.map((place) => (
                      <button
                        key={place.googlePlaceId}
                        type="button"
                        onClick={() => handleSelectGoogle(place)}
                        className="text-left border border-dashed border-gray-300 bg-white rounded-xl px-5 py-4 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                      >
                        <p className="font-semibold text-gray-900">
                          {place.name}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {place.address}
                        </p>
                        <p className="text-xs text-blue-600 mt-1">
                          + Add and review this stadium
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              ) : localFiltered.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
                  <p className="text-gray-500 text-sm">
                    No stadiums found for &quot;{search}&quot;.
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try a different name, city, or state.
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Initial state — no search yet */}
          {!search && !loadingStadiums && localFiltered.length === 0 && (
            <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl">
              <p className="text-gray-500 text-sm">
                Start typing to search for a stadium.
              </p>
            </div>
          )}

        </div>
      )}
    </main>
  );
}