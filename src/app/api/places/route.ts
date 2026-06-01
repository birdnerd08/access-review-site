import { NextRequest, NextResponse } from "next/server";

function mapGoogleTypeToVenueType(types: string[]): string {
  if (types.includes("stadium")) {
    return "Football Stadium";
  }
  if (types.includes("baseball_stadium")) {
    return "Baseball Stadium";
  }
  if (types.includes("basketball_arena")) {
    return "Basketball / Concert Arena";
  }
  if (
    types.includes("university") ||
    types.includes("school") ||
    types.includes("college")
  ) {
    return "College Stadium";
  }
  return "Other";
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");

  if (!query || query.length < 2) {
    return NextResponse.json({ places: [] });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    query + " stadium arena"
  )}&type=stadium&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const places = (data.results ?? []).slice(0, 5).map((p: any) => ({
  googlePlaceId: p.place_id,
  name: p.name,
  address: p.formatted_address,
  city: extractCity(p.address_components ?? [], p.formatted_address),
  state: extractState(p.address_components ?? [], p.formatted_address),
  venueType: mapGoogleTypeToVenueType(p.types ?? []),
}));

    return NextResponse.json({ places });
  } catch (err) {
    console.error("Places API error:", err);
    return NextResponse.json({ places: [] });
  }
}

function extractCity(components: any[], formattedAddress: string): string {
  const city = components.find((c) => c.types.includes("locality"));
  if (city) return city.long_name;

  // Fallback: parse from formatted address "Name, City, State ZIP, Country"
  const parts = formattedAddress.split(",");
  if (parts.length >= 2) return parts[1].trim();
  return "";
}

function extractState(components: any[], formattedAddress: string): string {
  const state = components.find((c) =>
    c.types.includes("administrative_area_level_1")
  );
  if (state) return state.short_name;

  // Fallback: parse state abbreviation from formatted address
  const parts = formattedAddress.split(",");
  if (parts.length >= 3) {
    const stateZip = parts[parts.length - 2].trim();
    const stateCode = stateZip.split(" ")[0];
    if (stateCode.length === 2) return stateCode;
  }
  return "";
}