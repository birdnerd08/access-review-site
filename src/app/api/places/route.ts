import { NextRequest, NextResponse } from "next/server";

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
      city: extractCity(p.address_components ?? []),
      state: extractState(p.address_components ?? []),
    }));

    return NextResponse.json({ places });
  } catch (err) {
    console.error("Places API error:", err);
    return NextResponse.json({ places: [] });
  }
}

function extractCity(components: any[]): string {
  const city = components.find((c) =>
    c.types.includes("locality")
  );
  return city?.long_name ?? "";
}

function extractState(components: any[]): string {
  const state = components.find((c) =>
    c.types.includes("administrative_area_level_1")
  );
  return state?.short_name ?? "";
}