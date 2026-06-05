import { Review, ReviewPhoto} from "@/lib/types";
import AccessNeedTags from "./AccessNeedTags";
import RatingDisplay from "./RatingDisplay";
import { formatDate, truncate } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
  photos?: ReviewPhoto[];
  expanded?: boolean;
}

export default function ReviewCard({ review,photos = [],  expanded = false }: ReviewCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-6 bg-white">

      {/* Header row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-gray-500">
            {review.eventType}
          </span>
          <AccessNeedTags needs={review.accessNeeds} size="sm" />
        </div>
        <div className="shrink-0">
          <RatingDisplay rating={review.overallUsabilityRating} size="md" />
        </div>
      </div>

      {/* Q6 highlight — most important field */}
      <div className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg px-4 py-3 mb-4">
        <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
          What to know before you buy tickets
        </p>
        <p className="text-sm text-blue-900">
          {review.specificDetailToKnow}
        </p>
      </div>

      {/* What worked / barriers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs font-semibold text-green-700 mb-1">What worked well</p>
          <p className="text-sm text-green-900">
            {expanded ? review.whatWorkedWell : truncate(review.whatWorkedWell, 120)}
          </p>
        </div>
        <div className="bg-amber-50 rounded-lg p-3">
          <p className="text-xs font-semibold text-amber-700 mb-1">Barriers</p>
          <p className="text-sm text-amber-900">
            {expanded ? review.barriersOrHardMoments : truncate(review.barriersOrHardMoments, 120)}
          </p>
        </div>
      </div>

      {/* Who it works for */}
      <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <p className="text-xs font-semibold text-gray-600 mb-1">Who this works for</p>
        <p className="text-sm text-gray-700">
          {expanded ? review.whoItWorksFor : truncate(review.whoItWorksFor, 140)}
        </p>
      </div>

      {/* Footer row */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          {/* Recommendation badge */}
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            review.wouldRecommend === "Yes"
              ? "bg-green-100 text-green-700"
              : review.wouldRecommend === "Maybe, with preparation"
              ? "bg-yellow-100 text-yellow-700"
              : review.wouldRecommend === "No"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-600"
          }`}>
            {review.wouldRecommend === "Yes" && "✓ Would return"}
            {review.wouldRecommend === "Maybe, with preparation" && "⚠ Maybe, with prep"}
            {review.wouldRecommend === "No" && "✕ Would not return"}
            {review.wouldRecommend === "Not sure" && "? Not sure"}
          </span>

          {/* Seat section */}
          {review.seatSection && (
            <span className="text-xs text-gray-400">
              {review.seatSection}
            </span>
          )}
        </div>
        {photos.length > 0 && (
  <div className="mt-4">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
      Photos
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {photos.map((photo) => (
        <a
          key={photo.id}
          href={photo.publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={photo.publicUrl}
            alt={photo.caption || "Accessibility review photo"}
            className="w-full h-32 object-cover rounded-lg border border-gray-200 bg-gray-100"
          />
        </a>
      ))}
    </div>
  </div>
)}

        <div className="flex items-center gap-3">
          {/* Outdated flag */}
          {review.outdatedFlagCount > 0 && (
            <span className="text-xs text-orange-500">
              ⚠ {review.outdatedFlagCount} flagged as outdated
            </span>
          )}
          <span className="text-xs text-gray-400">
            {formatDate(review.createdAt)}
          </span>
        </div>
      </div>

    </div>
  );
}