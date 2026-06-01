import { Review, StadiumSummary } from "./types";

// Get reviews for a specific stadium
export function getReviewsByStadiumId(reviews: Review[], stadiumId: string): Review[] {
  return reviews.filter(
    (r) => r.stadiumId === stadiumId && r.status === "published"
  );
}

// Get a single stadium by slug
export function getStadiumBySlug(
  stadiums: StadiumSummary[],
  slug: string
): StadiumSummary | undefined {
  return stadiums.find((s) => s.slug === slug);
}

// Calculate average rating from a set of reviews
export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, r) => acc + r.overallUsabilityRating, 0);
  return Math.round((sum / reviews.length) * 10) / 10;
}

// Return a human-readable label for a numeric rating
export function getRatingLabel(rating: number): string {
  if (rating >= 4.5) return "Very usable";
  if (rating >= 3.5) return "Mostly usable";
  if (rating >= 2.5) return "Usable with issues";
  if (rating >= 1.5) return "Difficult";
  return "Not usable";
}

// Return a Tailwind color class based on rating
export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return "text-green-600";
  if (rating >= 3.5) return "text-lime-600";
  if (rating >= 2.5) return "text-yellow-600";
  if (rating >= 1.5) return "text-orange-500";
  return "text-red-600";
}

// Format a date string for display
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function truncate(text: string | null | undefined, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}