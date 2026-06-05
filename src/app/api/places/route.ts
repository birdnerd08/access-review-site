import { NextRequest, NextResponse } from "next/server";

function mapGoogleTypeToVenueType(types: string[] = [], name?: string | null): string {
  const lowerName = (name ?? "").toLowerCase();

  if (
    lowerName.includes("arena") ||
    lowerName.includes("center") ||
    lowerName.includes("centre") ||
    lowerName.includes("coliseum") ||
    lowerName.includes("pavilion")
  ) {
    return "Basketball / Concert Arena";
  }

  if (
    lowerName.includes("park") ||
    lowerName.includes("baseball") ||
    lowerName.includes("field") ||
    lowerName.includes("yankee stadium") ||
    lowerName.includes("fenway") ||
    lowerName.includes("dodger stadium") ||
    lowerName.includes("citi field") ||
    lowerName.includes("wrigley")
  ) {
    return "Baseball Stadium";
  }

  if (
    lowerName.includes("university") ||
    lowerName.includes("college") ||
    lowerName.includes("campus") ||
    lowerName.includes("michigan stadium") ||
    lowerName.includes("spartan stadium") ||
    lowerName.includes("ohio stadium") ||
    lowerName.includes("beaver stadium")
  ) {
    return "College Stadium";
  }

  if (types.includes("stadium")) {
    return "Football Stadium";
  }

  return "Other";
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");

  if (!query || query.length < 2) {
    return NextResponse.json({ places: [] });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.error("Missing GOOGLE_PLACES_API_KEY");
    return NextResponse.json({ places: [] }, { status: 500 });
  }

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    query + " stadium arena"
  )}&type=stadium&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("Places API returned error:", data.status, data.error_message);
      return NextResponse.json({ places: [] });
    }

    const places = (data.results ?? []).slice(0, 5).map((p: any) => ({
      googlePlaceId: p.place_id,
      name: p.name,
      address: p.formatted_address,
      city: extractCity(p.address_components ?? [], p.formatted_address),
      state: extractState(p.address_components ?? [], p.formatted_address),
      venueType: mapGoogleTypeToVenueType(p.types ?? [], p.name ?? ""),
      latitude: p.geometry?.location?.lat ?? null,
      longitude: p.geometry?.location?.lng ?? null,
    }));

    console.log(
      "Google Places results:",
      places.map((p: any) => ({
        name: p.name,
        latitude: p.latitude,
        longitude: p.longitude,
      }))
    );

    return NextResponse.json({ places });
  } catch (err) {
    console.error("Places API error:", err);
    return NextResponse.json({ places: [] });
  }
}

function extractCity(components: any[], formattedAddress = ""): string {
  const city = components.find((c) => c.types.includes("locality"));
  if (city) return city.long_name;

  const parts = formattedAddress.split(",");
  if (parts.length >= 2) return parts[1].trim();

  return "";
}

function extractState(components: any[], formattedAddress = ""): string {
  const state = components.find((c) =>
    c.types.includes("administrative_area_level_1")
  );

  if (state) return state.short_name;

  const parts = formattedAddress.split(",");
  if (parts.length >= 3) {
    const stateZip = parts[parts.length - 2].trim();
    const stateCode = stateZip.split(" ")[0];
    if (stateCode.length === 2) return stateCode;
  }

  return "";
}