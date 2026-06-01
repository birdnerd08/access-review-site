"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { StadiumSummary } from "@/lib/types";

interface Props {
  stadium: StadiumSummary;
}

function getCoordinates(stadium: StadiumSummary) {
  const lat = Number(stadium.latitude);
  const lng = Number(stadium.longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
}

export default function StadiumDetailMap({ stadium }: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const coords = getCoordinates(stadium);

  if (!apiKey || !coords) return null;

  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${stadium.name}, ${stadium.city}, ${stadium.state}`
  )}`;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between gap-4 mb-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Plan your arrival</h2>
          <p className="text-sm text-gray-500">
            Stadium location and directions.
          </p>
        </div>

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline font-medium"
        >
          Open in Google Maps →
        </a>
      </div>

      <div
        style={{ height: "320px", width: "100%" }}
        className="rounded-xl overflow-hidden border border-gray-200"
      >
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={coords}
            defaultZoom={15}
            gestureHandling="greedy"
          >
            <Marker position={coords} />
          </Map>
        </APIProvider>
      </div>
    </section>
  );
}