"use client";

import { useState } from "react";
import { APIProvider, Map, Marker, InfoWindow } from "@vis.gl/react-google-maps";
import { StadiumSummary, AccessMarker } from "@/lib/types";

interface Props {
  stadium: StadiumSummary;
  markers?: AccessMarker[];
}

function getCoordinates(stadium: StadiumSummary) {
  const lat = Number(stadium.latitude);
  const lng = Number(stadium.longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
}

function getMarkerColor(type: string) {
  switch (type) {
    case "accessible_entrance":
      return "#2563EB"; // blue
    case "accessible_parking":
      return "#16A34A"; // green
    case "dropoff_zone":
      return "#9333EA"; // purple
    case "elevator":
      return "#0D9488"; // teal
    case "accessible_restroom":
      return "#CA8A04"; // amber
    case "problem_area":
      return "#DC2626"; // red
    default:
      return "#6B7280"; // gray
  }
}

function getMarkerLabel(type: string) {
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
      return "Other";
  }
}

export default function StadiumDetailMap({ stadium, markers = [] }: Props) {
  const [selectedMarker, setSelectedMarker] = useState<AccessMarker | null>(
    null
  );

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
            {/* Main stadium marker */}
            <Marker position={coords} />

            {/* Accessibility markers */}
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={{
                  lat: marker.latitude,
                  lng: marker.longitude,
                }}
                onClick={() => setSelectedMarker(marker)}
                icon={{
                  path: "M 0,0 m -5,0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0",
                  fillColor: getMarkerColor(marker.markerType),
                  fillOpacity: 1,
                  strokeColor: "#FFFFFF",
                  strokeWeight: 2,
                  scale: 1.2,
                }}
              />
            ))}

            {selectedMarker && (
              <InfoWindow
                position={{
                  lat: selectedMarker.latitude,
                  lng: selectedMarker.longitude,
                }}
                onCloseClick={() => setSelectedMarker(null)}
              >
                <div className="p-1 min-w-48">
                  <p className="font-bold text-gray-900 text-sm">
                    {selectedMarker.label}
                  </p>

                  <p className="text-xs text-gray-500 mb-2">
                    {getMarkerLabel(selectedMarker.markerType)}
                  </p>

                  {selectedMarker.notes && (
                    <p className="text-xs text-gray-700">
                      {selectedMarker.notes}
                    </p>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Marker legend */}
      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-600">
        {[
          ["accessible_entrance", "Entrance"],
          ["accessible_parking", "Parking"],
          ["dropoff_zone", "Drop-off"],
          ["elevator", "Elevator"],
          ["accessible_restroom", "Restroom"],
          ["problem_area", "Problem area"],
          ["other", "Other"],
        ].map(([type, label]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2.5 h-2.5 rounded-full border border-white shadow-sm"
              style={{ backgroundColor: getMarkerColor(type) }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}