import Link from "next/link";
import { getAllStadiums } from "@/lib/db";
import StadiumCard from "@/components/StadiumCard";
import StadiumMap from "@/components/StadiumMap";

const QUESTIONS = [
  "Where is accessible parking?",
  "How difficult is it to get to my seats? Where are they?",
  "Where is the accessible entrance, if there is one?",
  "How far away are the bathrooms from my seat?",
  "What ticket sections work best for different access needs?",
  "What should I know before buying tickets?",
];

const ACCESS_MEANS = [
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
];

export default async function HomePage() {
  const stadiums = await getAllStadiums();
  const featured = stadiums.slice(0, 2);

  return (
    <main className="min-h-screen bg-[#FAF7F1] text-gray-900">
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div>
            <p className="text-sm font-semibold tracking-wide uppercase text-[#8A6A2F] mb-4">
              Accessibly
            </p>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-950 mb-5 leading-tight">
              Helping people with disabilities navigate with more clarity
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl">
              Reviews written by people with disabilities for people with
              disabilities. Plan your trip with confidence.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/stadiums"
                className="inline-flex items-center justify-center rounded-xl bg-[#1E3A5F] px-6 py-3 text-sm font-semibold text-white hover:bg-[#162D49] transition-colors"
              >
                Browse Stadiums
              </Link>

              <Link
                href="/reviews/new"
                className="inline-flex items-center justify-center rounded-xl border border-[#C9A66B] bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-[#F1E7D2] transition-colors"
              >
                Add a review
              </Link>
            </div>
          </div>

          <div className="bg-white border border-[#E5DED1] rounded-3xl p-5 shadow-sm">
            <p className="text-sm font-semibold text-gray-900 mb-2">
              What this site helps with
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Find practical details about parking, entrances, seating,
              bathrooms, elevators, staff, crowds, heat, and exit routes before
              you go.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                "Parking",
                "Entrances",
                "Seating",
                "Bathrooms",
                "Elevators",
                "Crowds",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl bg-[#FAF7F1] border border-[#E5DED1] px-3 py-2 text-gray-700"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Explanation */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white border border-[#E5DED1] rounded-3xl p-6 md:p-10 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-950 mb-4">
            More than minimum requirements
          </h2>

          <p className="text-gray-600 leading-relaxed max-w-4xl">
            An ADA standard is just that - a standard. Accessibility can mean
            very different things to different people, and general requirements
            do not mean that a venue is usable by everyone. This site is
            designed to give insights into the usability of different
            facilities, written by people who understand what is needed to make
            an experience positive. This site collects practical details from
            fans who have been there.
          </p>
        </div>
      </section>

      {/* Questions */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-6">
          <p className="text-sm font-semibold tracking-wide uppercase text-[#8A6A2F] mb-2">
            Planning questions
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-950">
            Questions reviews can help answer
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {QUESTIONS.map((question) => (
            <div
              key={question}
              className="bg-white border border-[#E5DED1] rounded-2xl p-5 shadow-sm"
            >
              <p className="text-sm md:text-base text-gray-800 font-medium leading-relaxed">
                {question}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* What accessible should mean */}
      <section className="bg-[#F1E7D2] border-y border-[#E5DED1] px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-950 mb-3">
            What accessible should actually mean
          </h2>

          <p className="text-gray-700 max-w-3xl mb-8 leading-relaxed">
            A stadium can meet ADA requirements and still be a difficult,
            exhausting, or unusable experience. Reviews here focus on the
            practical reality — not legal compliance.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ACCESS_MEANS.map(({ title, body }) => (
              <div
                key={title}
                className="bg-white border border-[#E5DED1] rounded-2xl p-5 shadow-sm"
              >
                <h3 className="font-semibold text-gray-950 mb-2">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Review guidance */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white border border-[#E5DED1] rounded-3xl p-6 md:p-10 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-950 mb-4">
            Writing a review
          </h2>

          <p className="text-gray-600 leading-relaxed max-w-4xl mb-6">
            When writing reviews, please write them with as much detail as
            possible. Your review could help others plan their experience. Be as
            thorough as you want, photos and map pins help as much as written
            reviews. Photos may take some time to upload and be approved.
          </p>

          <Link
            href="/reviews/new"
            className="inline-flex items-center justify-center rounded-xl bg-[#1E3A5F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#162D49] transition-colors"
          >
            Have you been? Write a review
          </Link>
        </div>
      </section>

      {/* Stadium map */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-950">
              Stadium Map
            </h2>
            <p className="text-gray-600 mt-2">
              Browse stadiums by location and compare what fans have reported
              so far.
            </p>
          </div>

          <Link
            href="/stadiums"
            className="text-sm font-semibold text-[#1E3A5F] hover:underline"
          >
            Browse all stadiums →
          </Link>
        </div>

        <div className="bg-white border border-[#E5DED1] rounded-3xl p-4 md:p-6 shadow-sm">
          <StadiumMap stadiums={stadiums} />
        </div>
      </section>

      {/* Recent reviews */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-950">
                Recent Stadium reviews
              </h2>
              <p className="text-gray-600 mt-2">
                See what disabled fans are saying about stadiums, seating,
                bathrooms, entrances, parking, and other details.
              </p>
            </div>

            <Link
              href="/stadiums"
              className="text-sm font-semibold text-[#1E3A5F] hover:underline"
            >
              See all →
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featured.map((stadium) => (
              <StadiumCard key={stadium.id} stadium={stadium} />
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white border border-[#E5DED1] rounded-3xl p-6 md:p-10 shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-950 mb-4">
            Contact form
          </h2>

          <p className="text-gray-600 leading-relaxed max-w-4xl mb-6">
            For a feature you would like to be added, bugs, information, or
            anything else, please use the contact form provided. Thank you!
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl border border-[#C9A66B] bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-[#F1E7D2] transition-colors"
          >
            Contact
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5DED1] mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-gray-500">
          <p>Credits</p>
          <p>Created by Ryan Hume - a summer project</p>
        </div>
      </footer>
    </main>
  );
}