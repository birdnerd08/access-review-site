import { supabase } from "./supabase";
import { StadiumSummary, Review, AccessNeed, AccessMarker,ReviewPhotoModerationItem,
  ReviewPhotoStatus,ReviewPhoto, } from "./types";
export async function getAllStadiums(): Promise<StadiumSummary[]> {
  const { data, error } = await supabase
    .from("stadiums")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching stadiums:", error);
    return [];
  }
console.log(
  "stadium coordinate debug:",
  data.map((s) => ({
    slug: s.slug,
    latitude: s.latitude,
    longitude: s.longitude,
    latitudeType: typeof s.latitude,
    longitudeType: typeof s.longitude,
  }))
);
  return data.map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    city: s.city,
    state: s.state,
    venueType: s.venue_type,
    description: s.description,
    officialAccessibilityUrl: s.official_accessibility_url,
    averageRating: s.average_rating,
    reviewCount: s.review_count,
    summary: s.summary,
    tags: s.tags ?? [],
    strengths: s.strengths ?? [],
    concerns: s.concerns ?? [],
    reviewerContext: s.reviewer_context,
    seatArea: s.seat_area,
    bestFor: s.best_for,
    watchOut: s.watch_out,
    latitude: s.latitude,
    longitude: s.longitude,
  }));
}
export async function getApprovedReviewPhotosByStadiumId(
  stadiumId: string
): Promise<ReviewPhoto[]> {
  const { data, error } = await supabase
    .from("review_photos")
    .select("*")
    .eq("stadium_id", stadiumId)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching approved review photos:", error);
    return [];
  }

  return (data ?? []).map((p) => {
    const { data: publicUrlData } = supabase.storage
      .from("review-photos")
      .getPublicUrl(p.storage_path);

    return {
      id: p.id,
      reviewId: p.review_id,
      stadiumId: p.stadium_id,
      storagePath: p.storage_path,
      publicUrl: publicUrlData.publicUrl,
      caption: p.caption,
      status: p.status,
      createdAt: p.created_at,
      reviewedAt: p.reviewed_at,
      reviewedBy: p.reviewed_by,
    };
  });
}
export async function getPendingReviewPhotos(): Promise<
  ReviewPhotoModerationItem[]
> {
  const { data, error } = await supabase
    .from("review_photos")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending review photos:", error);
    return [];
  }

  return (data ?? []).map((p) => {
    const { data: publicUrlData } = supabase.storage
      .from("review-photos")
      .getPublicUrl(p.storage_path);

    return {
      id: p.id,
      reviewId: p.review_id,
      stadiumId: p.stadium_id,
      stadiumName: null,
      storagePath: p.storage_path,
      publicUrl: publicUrlData.publicUrl,
      caption: p.caption,
      status: p.status,
      createdAt: p.created_at,
    };
  });
}
export async function updateReviewPhotoStatus(
  photoId: string,
  status: ReviewPhotoStatus
): Promise<boolean> {
  const { error } = await supabase
    .from("review_photos")
    .update({
      status,
      reviewed_at: new Date().toISOString(),
      reviewed_by: "admin",
    })
    .eq("id", photoId);

  if (error) {
    console.error("Error updating review photo status:", error);
    return false;
  }

  return true;
}

export async function getStadiumBySlug(slug: string): Promise<StadiumSummary | null> {
  const { data, error } = await supabase
    .from("stadiums")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    console.error("Error fetching stadium:", error);
    return null;
  }

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    city: data.city,
    state: data.state,
    venueType: data.venue_type,
    description: data.description,
    officialAccessibilityUrl: data.official_accessibility_url,
    averageRating: data.average_rating,
    reviewCount: data.review_count,
    summary: data.summary,
    tags: data.tags ?? [],
    strengths: data.strengths ?? [],
    concerns: data.concerns ?? [],
    reviewerContext: data.reviewer_context,
    seatArea: data.seat_area,
    bestFor: data.best_for,
    watchOut: data.watch_out,
    latitude: data.latitude,
    longitude: data.longitude,
  };
}

export async function getAccessMarkersByStadiumId(
  stadiumId: string
): Promise<AccessMarker[]> {
  const { data, error } = await supabase
    .from("access_markers")
    .select("*")
    .eq("stadium_id", stadiumId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching access markers:", error);
    return [];
  }

  return (data ?? []).map((m) => ({
    id: m.id,
    stadiumId: m.stadium_id,
    reviewId: m.review_id,
    markerType: m.marker_type,
    label: m.label,
    notes: m.notes,
    latitude: m.latitude,
    longitude: m.longitude,
    createdAt: m.created_at,
  }));
}

export async function getReviewsByStadiumId(stadiumId: string): Promise<Review[]> {
  const { data: reviewData, error: reviewError } = await supabase
    .from("reviews")
    .select("*")
    .eq("stadium_id", stadiumId)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (reviewError) {
    console.error("Error fetching reviews:", reviewError);
    return [];
  }

  const { data: needsData, error: needsError } = await supabase
    .from("review_access_needs")
    .select("*")
    .in("review_id", reviewData.map((r) => r.id));

  if (needsError) {
    console.error("Error fetching access needs:", needsError);
    return [];
  }

  return reviewData.map((r) => ({
    id: r.id,
    stadiumId: r.stadium_id,
    eventType: r.event_type,
    accessNeeds: needsData
      .filter((n) => n.review_id === r.id)
      .map((n) => n.access_need as AccessNeed),
    overallUsabilityRating: r.overall_usability_rating,
    whatWorkedWell: r.what_worked_well,
    barriersOrHardMoments: r.barriers_or_hard_moments,
    specificDetailToKnow: r.specific_detail_to_know,
    whoItWorksFor: r.who_it_works_for,
    wouldRecommend: r.would_recommend,
    seatSection: r.seat_section,
    eventDate: r.event_date,
    status: r.status,
    outdatedFlagCount: r.outdated_flag_count,
    createdAt: r.created_at,
  }));
}

export async function submitReview(
  stadiumId: string,
  form: {
    eventType: string;
    accessNeeds: AccessNeed[];
    overallUsabilityRating: number;
    whatWorkedWell: string;
    barriersOrHardMoments: string;
    specificDetailToKnow: string;
    whoItWorksFor: string;
    wouldRecommend: string;
    seatSection?: string;
    accessMarker?: {
      markerType: string;
      label: string;
      notes?: string;
      latitude: number;
      longitude: number;
  };
}
): Promise<string |null> {
  const reviewId = crypto.randomUUID();

  const { error: reviewError } = await supabase.from("reviews").insert({
    id: reviewId,
    stadium_id: stadiumId,
    event_type: form.eventType,
    overall_usability_rating: form.overallUsabilityRating,
    what_worked_well: form.whatWorkedWell,
    barriers_or_hard_moments: form.barriersOrHardMoments,
    specific_detail_to_know: form.specificDetailToKnow,
    who_it_works_for: form.whoItWorksFor,
    would_recommend: form.wouldRecommend,
    seat_section: form.seatSection || null,
    status: "published",
    outdated_flag_count: 0,
  });

  if (reviewError) {
    console.error("Error inserting review:", reviewError);
    return null;
  }

  if (form.accessNeeds.length > 0) {
    const { error: needsError } = await supabase
      .from("review_access_needs")
      .insert(
        form.accessNeeds.map((need) => ({
          review_id: reviewId,
          access_need: need,
        }))
      );

    if (needsError) {
      console.error("Error inserting access needs:", needsError);
      return null;
    }

    if (form.accessMarker) {
  const { error: markerError } = await supabase
    .from("access_markers")
    .insert({
      stadium_id: stadiumId,
      review_id: reviewId,
      marker_type: form.accessMarker.markerType,
      label: form.accessMarker.label,
      notes: form.accessMarker.notes || null,
      latitude: form.accessMarker.latitude,
      longitude: form.accessMarker.longitude,
    });

  if (markerError) {
    console.error("Error inserting access marker:", markerError);
    return null;
  }
}
  }


  return reviewId;
}
export async function submitStadiumRequest(request: {
  name: string;
  city: string;
  state: string;
  venuetype: string;
}): Promise<boolean> {
  const { error } = await supabase.from("stadium_requests").insert({
    name: request.name,
    city: request.city,
    state: request.state,
    venue_type: request.venuetype,
    status: "pending",
  });

  if (error) {
    console.error("Error submitting stadium request:", error);
    return false;
  }

  return true;
}
export async function getStadiumByGooglePlaceId(
  googlePlaceId: string
): Promise<StadiumSummary | null> {
  const { data, error } = await supabase
    .from("stadiums")
    .select("*")
    .eq("google_place_id", googlePlaceId)
    .single();

  if (error) return null;

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    city: data.city,
    state: data.state,
    venueType: data.venue_type,
    description: data.description,
    officialAccessibilityUrl: data.official_accessibility_url,
    averageRating: data.average_rating,
    reviewCount: data.review_count,
    summary: data.summary ?? "",
    tags: data.tags ?? [],
    strengths: data.strengths ?? [],
    concerns: data.concerns ?? [],
    reviewerContext: data.reviewer_context ?? "",
    seatArea: data.seat_area,
    bestFor: data.best_for ?? "",
    watchOut: data.watch_out ?? "",
    latitude: data.latitude,
    longitude: data.longitude,
  };
}

export async function addStadiumFromGooglePlaces(place: {
  googlePlaceId: string;
  name: string;
  city: string;
  state: string;
  venueType: string;
  latitude?: number | null;
  longitude?: number | null;
}): Promise<string | null> {
  // Check if already exists by Google Place ID
  const existing = await getStadiumByGooglePlaceId(place.googlePlaceId);

if (existing) {
  if (
    (existing.latitude == null || existing.longitude == null) &&
    place.latitude != null &&
    place.longitude != null
  ) {
    await supabase
      .from("stadiums")
      .update({
        latitude: place.latitude,
        longitude: place.longitude,
      })
      .eq("slug", existing.slug);
  }

  return existing.slug;
}

  // Check if already exists by name match
  const { data: nameMatch } = await supabase
    .from("stadiums")
    .select("slug")
    .ilike("name", place.name)
    .single();

  if (nameMatch) {
  if (place.latitude != null && place.longitude != null) {
    await supabase
      .from("stadiums")
      .update({
        google_place_id: place.googlePlaceId,
        latitude: place.latitude,
        longitude: place.longitude,
      })
      .eq("slug", nameMatch.slug);
  }

  return nameMatch.slug;
}

  // Generate base slug
  const baseSlug = place.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Check for slug collision and add city suffix if needed
  let slug = baseSlug;
  const { data: slugMatch } = await supabase
    .from("stadiums")
    .select("slug")
    .eq("slug", slug)
    .single();

  if (slugMatch) {
    const citySlug = place.city
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    slug = `${baseSlug}-${citySlug}`;
  }

  const { error } = await supabase.from("stadiums").insert({
    id: slug,
    slug,
    name: place.name,
    city: place.city,
    state: place.state,
    state_name: "",
    venue_type: place.venueType,
    google_place_id: place.googlePlaceId,
    average_rating: 0,
    latitude: place.latitude ?? null,
    longitude: place.longitude ?? null,
    review_count: 0,
    summary: "",
    tags: [],
    strengths: [],
    concerns: [],
    best_for: "",
    watch_out: "",
    reviewer_context: "",
  });

  if (error) {
    console.error("Error adding stadium:", error);
    return null;
  }

  return slug;
}
export async function uploadReviewPhotos(params: {
  reviewId: string;
  stadiumId: string;
  files: File[];
}): Promise<boolean> {
  const { reviewId, stadiumId, files } = params;

  if (files.length === 0) return true;

  for (const file of files) {
    const fileExt = file.name.split(".").pop() || "jpg";
    const safeFileName = `${crypto.randomUUID()}.${fileExt}`;
    const storagePath = `${stadiumId}/${reviewId}/${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("review-photos")
      .upload(storagePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Error uploading review photo:", uploadError);
      return false;
    }

    const { error: dbError } = await supabase.from("review_photos").insert({
      review_id: reviewId,
      stadium_id: stadiumId,
      storage_path: storagePath,
      caption: null,
      status: "pending",
    });

    if (dbError) {
      console.error("Error inserting review photo row:", dbError);
      return false;
    }
  }

  return true;
}