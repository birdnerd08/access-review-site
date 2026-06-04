"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { StadiumSummary } from "@/lib/types";

interface MarkerLocation {
  latitude: number;
  longitude: number;
}

interface Props {
  stadium: StadiumSummary;
  value: MarkerLocation | null;
  onChange: (location: MarkerLocation) => void;
}

function getCoordinates(stadium: StadiumSummary) {
  const lat = Number(stadium.latitude);
  const lng = Number(stadium.longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return { lat, lng };
}

export default function AccessMarkerPicker({
  stadium,
  value,
  onChange,
}: Props) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const stadiumCoords = getCoordinates(stadium);

  if (!apiKey || !stadiumCoords) {
    return (
      <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
        Map picker unavailable for this stadium.
      </div>
    );
  }

  const selectedCoords = value
    ? { lat: value.latitude, lng: value.longitude }
    : null;

  return (
    <div>
      <div
        style={{ height: "260px", width: "100%" }}
        className="rounded-lg overflow-hidden border border-gray-200"
      >
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={stadiumCoords}
            defaultZoom={17}
            gestureHandling="greedy"
            onClick={(event) => {
              const lat = event.detail.latLng?.lat;
              const lng = event.detail.latLng?.lng;

              if (typeof lat !== "number" || typeof lng !== "number") return;

              onChange({
                latitude: lat,
                longitude: lng,
              });
            }}
          >
            {/* Stadium location */}
            <Marker position={stadiumCoords} />

            {/* Selected access marker */}
            {selectedCoords && (
              <Marker
                position={selectedCoords}
                icon={{
                  path: "M 0,0 m -5,0 a 5,5 0 1,0 10,0 a 5,5 0 1,0 -10,0",
                  fillColor: "#2563EB",
                  fillOpacity: 1,
                  strokeColor: "#FFFFFF",
                  strokeWeight: 2,
                  scale: 1.4,
                }}
              />
            )}
          </Map>
        </APIProvider>
      </div>

      <p className="text-xs text-gray-400 mt-2">
        Click the map to place the access marker. The red pin is the stadium;
        the blue dot is the access point you are adding.
      </p>

      {value && (
        <p className="text-xs text-gray-500 mt-1">
          Selected: {value.latitude.toFixed(6)}, {value.longitude.toFixed(6)}
        </p>
      )}
    </div>
  );
}