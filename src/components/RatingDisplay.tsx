import { getRatingLabel, getRatingColor } from "@/lib/utils";

interface RatingDisplayProps {
  rating: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function RatingDisplay({
  rating,
  showLabel = true,
  size = "md",
}: RatingDisplayProps) {
  const numericSize = size === "lg" ? "text-4xl" : size === "md" ? "text-2xl" : "text-lg";
  const labelSize = size === "lg" ? "text-base" : "text-xs";

  return (
    <div className="flex items-baseline gap-2">
      <span className={`${numericSize} font-bold ${getRatingColor(rating)}`}>
        {rating}
        <span className="text-gray-300 font-normal">/5</span>
      </span>
      {showLabel && (
        <span className={`${labelSize} text-gray-500`}>
          {getRatingLabel(rating)}
        </span>
      )}
    </div>
  );
}