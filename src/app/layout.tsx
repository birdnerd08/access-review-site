import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

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
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            {/* Logo / home link */}
            <Link
              href="/"
              className="flex items-center gap-3 text-gray-950 hover:text-[#1E3A5F] transition-colors"
            >
              <span className="h-9 w-9 rounded-xl bg-[#1E3A5F] text-white flex items-center justify-center font-bold text-sm">
                A
              </span>
              <span className="font-bold text-lg sm:text-xl tracking-tight">
                Accessibly
              </span>
            </Link>

            {/* Nav links */}
            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/stadiums"
                className="text-sm font-medium text-gray-700 hover:text-gray-950 transition-colors"
              >
                Browse Stadiums
              </Link>

              <Link
                href="/reviews/new"
                className="rounded-xl bg-[#1E3A5F] px-4 py-2 text-sm font-semibold text-white hover:bg-[#162D49] transition-colors"
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
            <p>Accessibly</p>
            <p>Created by Ryan Hume - a summer project</p>
          </div>
        </footer>
      </body>
    </html>
  );
}