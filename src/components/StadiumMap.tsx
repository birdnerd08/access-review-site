"use client";

import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { StadiumSummary } from "@/lib/types";
import Link from "next/link";

interface Props {
  stadiums: StadiumSummary[];
}

function hasCoordinates(stadium: StadiumSummary): stadium is StadiumSummary & {
  latitude: number;
  longitude: number;
} {
  return (
    typeof stadium.latitude === "number" &&
    typeof stadium.longitude === "number"
  );
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

  const mappableStadiums = stadiums.filter(hasCoordinates);

  if (mappableStadiums.length === 0) {
    return (
      <div className="border border-gray-200 bg-gray-50 text-gray-600 p-4 rounded-xl mb-6">
        No stadium coordinates available yet.
      </div>
    );
  }

  return (
    <APIProvider apiKey={apiKey}>
      <div
        style={{ height: "400px", width: "100%" }}
        className="rounded-xl overflow-hidden border border-gray-200 mb-6"
      >
        <Map
          defaultCenter={{ lat: 39.5, lng: -98.35 }}
          defaultZoom={4}
          gestureHandling="greedy"
        >
          {mappableStadiums.map((stadium) => (
            <Marker
              key={stadium.slug}
              position={{
                lat: stadium.latitude,
                lng: stadium.longitude,
              }}
              onClick={() => setSelected(stadium)}
            />
          ))}

          {selected && hasCoordinates(selected) && (
            <InfoWindow
              position={{
                lat: selected.latitude,
                lng: selected.longitude,
              }}
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
                    ? `${selected.averageRating} / 5 · ${selected.reviewCount} ${
                        selected.reviewCount === 1 ? "review" : "reviews"
                      }`
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
  );
}