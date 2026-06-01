import Link from "next/link";
import { StadiumSummary } from "@/lib/types";
import { getRatingLabel, getRatingColor, truncate } from "@/lib/utils";

interface StadiumCardProps {
  stadium: StadiumSummary;
}

export default function StadiumCard({ stadium }: StadiumCardProps) {
  return (
    <Link href={`/stadiums/${stadium.slug}`}>
      <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white cursor-pointer">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{stadium.name}</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {stadium.city}, {stadium.state} · {stadium.venueType}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className={`text-2xl font-bold ${getRatingColor(stadium.averageRating)}`}>
              {stadium.averageRating > 0 ? stadium.averageRating : "—"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {stadium.averageRating > 0 ? getRatingLabel(stadium.averageRating) : "No ratings yet"}
            </p>
          </div>
        </div>

        {/* Review count */}
        <p className="text-xs text-gray-400 mb-3">
          {stadium.reviewCount === 0
            ? "No reviews yet"
            : `${stadium.reviewCount} ${stadium.reviewCount === 1 ? "review" : "reviews"}`}
        </p>

        {/* Summary */}
        {stadium.summary ? (
          <p className="text-sm text-gray-700 mb-4">
            {truncate(stadium.summary, 160)}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic mb-4">
            No summary yet — be the first to leave a review.
          </p>
        )}

        {/* Tags */}
        {stadium.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {stadium.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Works well / Watch out */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-green-700 mb-1">Works well</p>
            <p className="text-xs text-green-800">
              {stadium.strengths.length > 0
                ? truncate(stadium.strengths[0], 80)
                : "No reviews yet"}
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-amber-700 mb-1">Watch out</p>
            <p className="text-xs text-amber-800">
              {stadium.watchOut
                ? truncate(stadium.watchOut, 80)
                : "No reviews yet"}
            </p>
          </div>
        </div>

        {/* Reviewer context */}
        {stadium.reviewerContext && (
          <p className="text-xs text-gray-400 italic">
            From a review by: {stadium.reviewerContext}
          </p>
        )}

      </div>
    </Link>
  );
}