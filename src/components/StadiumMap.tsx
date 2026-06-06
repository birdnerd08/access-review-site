"use client";

import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { StadiumSummary } from "@/lib/types";
import Link from "next/link";

interface Props {
  stadiums: StadiumSummary[];
}

function getCoordinates(stadium: StadiumSummary) {
  const lat = Number(stadium.latitude);
  const lng = Number(stadium.longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
}

function getRatingColor(stadium: StadiumSummary) {
  if (!stadium.reviewCount || stadium.reviewCount === 0) {
    return "#6B7280"; // gray
  }

  if (stadium.averageRating >= 4) {
    return "#15803D"; // green
  }

  if (stadium.averageRating >= 3) {
    return "#CA8A04"; // amber
  }

  return "#DC2626"; // red
}

function getRatingLabel(stadium: StadiumSummary) {
  if (!stadium.reviewCount || stadium.reviewCount === 0) {
    return "–";
  }

  return stadium.averageRating.toFixed(1);
}

export default function StadiumMap({ stadiums }: Props) {
  const [selected, setSelected] = useState<StadiumSummary | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="border border-red-200 bg-red-50 text-red-700 p-4 rounded-xl mb-6">
        Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      </div>
    );
  }

  const mappableStadiums = stadiums.filter((stadium) => {
    return getCoordinates(stadium) !== null;
  });

  if (mappableStadiums.length === 0) {
    return (
      <div className="border border-gray-200 bg-gray-50 text-gray-600 p-4 rounded-xl mb-6">
        No stadium coordinates available yet.
      </div>
    );
  }

  return (
    <div>
      <APIProvider apiKey={apiKey}>
        <div
          style={{ height: "400px", width: "100%" }}
          className="rounded-xl overflow-hidden border border-gray-200 mb-3"
        >
          <Map
            defaultCenter={{ lat: 39.5, lng: -98.35 }}
            defaultZoom={4}
            gestureHandling="greedy"
          >
            {mappableStadiums.map((stadium) => {
              const coords = getCoordinates(stadium);
              if (!coords) return null;

              return (
                <Marker
                  key={stadium.slug}
                  position={coords}
                  onClick={() => setSelected(stadium)}
                  label={{
                    text: getRatingLabel(stadium),
                    color: "#FFFFFF",
                    fontSize: "11px",
                    fontWeight: "700",
                  }}
                  icon={{
                    path: "M 0,0 m -12,0 a 12,12 0 1,0 24,0 a 12,12 0 1,0 -24,0",
                    fillColor: getRatingColor(stadium),
                    fillOpacity: 1,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 3,
                    scale: 1,
                  }}
                />
              );
            })}

            {selected && getCoordinates(selected) && (
              <InfoWindow
                position={getCoordinates(selected)!}
                onCloseClick={() => setSelected(null)}
              >
                <div className="p-1 min-w-48">
                  <p className="font-bold text-gray-900 text-sm">
                    {selected.name}
                  </p>

                  <p className="text-xs text-gray-500 mb-2">
                    {selected.city}, {selected.state}
                  </p>

                  <p className="text-xs text-gray-500 mb-2">
                    {selected.reviewCount > 0
                      ? `${selected.averageRating.toFixed(1)} / 5 · ${
                          selected.reviewCount
                        } ${selected.reviewCount === 1 ? "review" : "reviews"}`
                      : "No reviews yet"}
                  </p>

                  <Link
                    href={`/stadiums/${selected.slug}`}
                    className="text-xs text-blue-600 hover:underline font-medium"
                  >
                    View stadium →
                  </Link>
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>
      </APIProvider>

      <div className="flex flex-wrap gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#15803D]" />
          <span>4.0–5.0</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#CA8A04]" />
          <span>3.0–3.9</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#DC2626]" />
          <span>Below 3.0</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#6B7280]" />
          <span>No reviews yet</span>
        </div>
      </div>
    </div>
  );
}