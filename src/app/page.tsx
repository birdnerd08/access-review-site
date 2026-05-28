import Link from "next/link";
import { stadiums } from "@/lib/sample-data";
import StadiumCard from "@/components/StadiumCard";

export default function HomePage() {
  const featured = stadiums.slice(0, 2);

  return (
    <main>

      {/* Hero */}
      <section className="bg-blue-700 text-white px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 max-w-3xl mx-auto leading-tight">
          Know the stadium experience before you buy accessible seats.
        </h1>
        <p className="text-blue-100 text-lg max-w-2xl mx-auto mb-8">
          Real reviews from wheelchair users and disabled fans — seat views,
          companion seating, entrances, bathrooms, elevators, parking, crowds,
          heat, and exit routes.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/stadiums"
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Browse stadiums
          </Link>
          <Link
            href="/stadiums"
            className="border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add a review
          </Link>
        </div>
      </section>

      {/* Who this is for */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Built for fans who need more than "ADA accessible"
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Official venue pages tell you accessible seating exists. They don't
          tell you whether the experience actually works. This site collects
          real, practical details from disabled fans who have been there.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              q: "Can I buy accessible seats without calling multiple times?",
              icon: "🎟️",
            },
            {
              q: "Will the sightline still work when everyone stands?",
              icon: "👁️",
            },
            {
              q: "How far is the bathroom from my seat?",
              icon: "🚻",
            },
            {
              q: "How bad are elevators and exits after the event?",
              icon: "🛗",
            },
            {
              q: "Is there shade, cooling, or a lower-crowd route?",
              icon: "🌤️",
            },
            {
              q: "Is a companion seat directly next to me, not a row away?",
              icon: "🤝",
            },
          ].map(({ q, icon }) => (
            <div
              key={q}
              className="flex items-start gap-3 bg-gray-50 rounded-xl p-4"
            >
              <span className="text-2xl">{icon}</span>
              <p className="text-sm text-gray-700">{q}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What accessible should mean */}
      <section className="bg-indigo-50 px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            What "accessible" should actually mean
          </h2>
          <p className="text-gray-600 max-w-2xl mb-8">
            A stadium can meet ADA requirements and still be a difficult,
            exhausting, or unusable experience. Reviews here focus on the
            practical reality — not legal compliance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "Route to your seat",
                body: "Parking, drop-off, entrance, distance, ramps, and elevators — before you even sit down.",
              },
              {
                title: "During the event",
                body: "Sightlines, companion seating, bathroom distance, heat exposure, concourse crowding.",
              },
              {
                title: "Getting out",
                body: "Elevator waits, exit routes, fatigue from the return trip, and timing strategies.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured reviews */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Recent stadium reviews
          </h2>
          <Link
            href="/stadiums"
            className="text-sm text-blue-600 hover:underline"
          >
            See all →
          </Link>
        </div>
        <div className="flex flex-col gap-6">
          {featured.map((stadium) => (
            <StadiumCard key={stadium.id} stadium={stadium} />
          ))}
        </div>
      </section>

      {/* Contribute CTA */}
      <section className="bg-blue-700 text-white px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-3">
          Have you been to an accessible stadium?
        </h2>
        <p className="text-blue-100 mb-6 max-w-xl mx-auto">
          Your experience helps other disabled fans decide whether to buy
          tickets. Reviews take about 3–5 minutes.
        </p>
        <Link
          href="/stadiums"
          className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors inline-block"
        >
          Write a review
        </Link>
      </section>

    </main>
  );
}