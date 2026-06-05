import { notFound } from "next/navigation";
import Link from "next/link";
import { getStadiumBySlug, getReviewsByStadiumId,   getApprovedReviewPhotosByStadiumId, getAccessMarkersByStadiumId,} from "@/lib/db";
import ReviewCard from "@/components/ReviewCard";
import AccessNeedTags from "@/components/AccessNeedTags";
import RatingDisplay from "@/components/RatingDisplay";
import StadiumDetailMap from "@/components/StadiumDetailMap";

interface PageProps {
  params: Promise<{ stadiumId: string }>;
}

export default async function StadiumDetailPage({ params }: PageProps) {
  const { stadiumId } = await params;
  const stadium = await getStadiumBySlug(stadiumId);

  if (!stadium) notFound();

  const stadiumReviews = await getReviewsByStadiumId(stadium.id);

  const accessMarkers = await getAccessMarkersByStadiumId(stadium.id);

  const reviewPhotos = await getApprovedReviewPhotosByStadiumId(stadium.id);

  const allAccessNeeds = [
    ...new Set(stadiumReviews.flatMap((r) => r.accessNeeds)),
  ];

  const hasReviews = stadiumReviews.length > 0;

 


  return (
    <main className="max-w-4xl mx-auto px-4 py-10">

      <Link
        href="/stadiums"
        className="text-sm text-blue-600 hover:underline mb-6 inline-block"
      >
        ← All stadiums
      </Link>

      {/* Stadium header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{stadium.name}</h1>
            <p className="text-gray-500 mt-1">
              {stadium.city}, {stadium.state} · {stadium.venueType}
            </p>
          </div>
          {hasReviews ? (
            <RatingDisplay rating={stadium.averageRating} size="lg" />
          ) : (
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-300">—</p>
              <p className="text-xs text-gray-400">No ratings yet</p>
            </div>
          )}
        </div>
        {stadium.description && (
          <p className="text-gray-600 mt-4">{stadium.description}</p>
        )}
      </div>
      <StadiumDetailMap stadium={stadium} markers={accessMarkers ?? []} />

      {/* No reviews yet — new stadium state */}
      {!hasReviews && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 text-center">
          <p className="text-gray-700 font-medium mb-1">
            No accessibility reviews yet for {stadium.name}.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Be the first to share your experience and help other disabled fans plan their visit.
          </p>
          <Link
            href={`/stadiums/${stadium.slug}/reviews/new`}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors inline-block"
          >
            Write the first review
          </Link>
        </div>
      )}

      {/* Best for / Plan around — only show if populated */}
      {hasReviews && (stadium.bestFor || stadium.watchOut) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {stadium.bestFor && (
            <div className="bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-green-700 mb-1">Best for</p>
              <p className="text-sm text-green-900">{stadium.bestFor}</p>
            </div>
          )}
          {stadium.watchOut && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-amber-700 mb-1">Plan around</p>
              <p className="text-sm text-amber-900">{stadium.watchOut}</p>
            </div>
          )}
        </div>
      )}

      {/* Access needs — only show if there are reviews */}
      {allAccessNeeds.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Access needs covered in reviews
          </h2>
          <AccessNeedTags needs={allAccessNeeds} size="md" />
        </div>
      )}

      {/* Strengths — only show if populated */}
      {stadium.strengths.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Commonly works well
          </h2>
          <ul className="space-y-2">
            {stadium.strengths.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-green-500 mt-0.5">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Concerns — only show if populated */}
      {stadium.concerns.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">
            Common barriers
          </h2>
          <ul className="space-y-2">
            {stadium.concerns.map((c) => (
              <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-amber-500 mt-0.5">⚠</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reviews */}
      {hasReviews && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Reviews ({stadiumReviews.length})
            </h2>
            <Link
              href={`/stadiums/${stadium.slug}/reviews/new`}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Add a review
            </Link>
          </div>
          <div className="flex flex-col gap-4">
            {stadiumReviews.map((review) => (
  <ReviewCard
    key={review.id}
    review={review}
    photos={reviewPhotos.filter((photo) => photo.reviewId === review.id)}
  />
))}
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="border border-blue-100 bg-blue-50 rounded-xl p-6 text-center">
        <p className="text-gray-700 font-medium mb-1">
          Have you been to {stadium.name}?
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Your review helps other disabled fans plan their visit.
        </p>
        <Link
          href={`/stadiums/${stadium.slug}/reviews/new`}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors inline-block"
        >
          Write a review
        </Link>
      </div>

    </main>
  );
}