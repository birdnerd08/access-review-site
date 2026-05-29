import { supabase } from "./supabase";
import { StadiumSummary, Review, AccessNeed } from "./types";

export async function getAllStadiums(): Promise<StadiumSummary[]> {
  const { data, error } = await supabase
    .from("stadiums")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching stadiums:", error);
    return [];
  }

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
  }));
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
  };
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
  }
): Promise<boolean> {
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
    return false;
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
      return false;
    }
  }

  return true;
}