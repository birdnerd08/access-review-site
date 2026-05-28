import { AccessNeed } from "@/lib/types";

interface AccessNeedTagsProps {
  needs: AccessNeed[];
  size?: "sm" | "md";
}

const needIcons: Record<AccessNeed, string> = {
  "Power wheelchair": "⚡",
  "Manual wheelchair": "♿",
  "Limited stamina / fatigue": "🔋",
  "Chronic pain / sitting tolerance": "💊",
  "Heat sensitivity": "🌡️",
  "Mobility aid": "🦯",
  "Companion / caregiver": "🤝",
  "Sensory sensitivity": "👂",
  "Service animal": "🐕",
};

export default function AccessNeedTags({ needs, size = "md" }: AccessNeedTagsProps) {
  const baseClass = size === "sm"
    ? "text-xs px-2 py-0.5"
    : "text-sm px-3 py-1";

  return (
    <div className="flex flex-wrap gap-2">
      {needs.map((need) => (
        <span
          key={need}
          className={`${baseClass} bg-indigo-50 text-indigo-700 rounded-full font-medium inline-flex items-center gap-1`}
        >
          <span aria-hidden="true">{needIcons[need]}</span>
          {need}
        </span>
      ))}
    </div>
  );
}