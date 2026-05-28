import StadiumCard from "@/components/StadiumCard";
import { stadiums } from "@/lib/sample-data";

export default function StadiumsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Stadium Accessibility Reviews
      </h1>
      <p className="text-gray-500 mb-8">
        Real reviews from wheelchair users and disabled fans.
      </p>
      <div className="flex flex-col gap-6">
        {stadiums.map((stadium) => (
          <StadiumCard key={stadium.id} stadium={stadium} />
        ))}
      </div>
    </main>
  );
}