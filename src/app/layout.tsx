import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Accessibly",
  description:
    "Reviews written by people with disabilities for people with disabilities. Plan your trip with confidence.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Navbar */}
        <header className="sticky top-0 z-50 border-b border-[#E5DED1] bg-[#FAF7F1]/95 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
            {/* Logo / home link */}
            <Link
              href="/"
              className="flex items-center min-w-0 hover:opacity-80 transition-opacity"
              aria-label="Accessibly home"
            >
              <Image
                src="/images/accessibly-logo.svg"
                alt="Accessibly"
                width={260}
                height={48}
                className="h-9 sm:h-10 w-auto max-w-[170px] sm:max-w-[220px]"
                priority
              />
            </Link>

            {/* Nav links */}
            <nav className="flex items-center gap-2 sm:gap-4 shrink-0">
              <Link
                href="/stadiums"
                className="text-sm font-medium text-gray-700 hover:text-gray-950 transition-colors whitespace-nowrap"
              >
                Browse Stadiums
              </Link>

              <Link
                href="/reviews/new"
                className="rounded-xl bg-[#1E3A5F] px-3 sm:px-4 py-2 text-sm font-semibold text-white hover:bg-[#162D49] transition-colors whitespace-nowrap"
              >
                Add a review
              </Link>
            </nav>
          </div>
        </header>

        {/* Page content */}
        {children}

        {/* Footer */}
        <footer className="border-t border-[#E5DED1] bg-[#FAF7F1] mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <Link
              href="/"
              className="flex items-center hover:opacity-80 transition-opacity"
              aria-label="Accessibly home"
            >
              <Image
                src="/images/accessibly-logo.svg"
                alt="Accessibly"
                width={260}
                height={48}
                className="h-8 w-auto max-w-[180px]"
              />
            </Link>

            <p>Created by Ryan Hume - a summer project</p>
          </div>
        </footer>
      </body>
    </html>
  );
}