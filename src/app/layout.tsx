import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessible Stadium Reviews",
  description:
    "Real accessibility reviews from wheelchair users and disabled fans. Know the stadium experience before you buy accessible seats.",
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
        <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            {/* Logo / home link */}
            <Link
              href="/"
              className="font-bold text-gray-900 hover:text-blue-700 transition-colors text-sm sm:text-base"
            >
              ♿ Accessible Stadium Reviews
            </Link>

            {/* Nav links */}
            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/stadiums"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Browse stadiums
              </Link>
              <Link
                href="/reviews/new"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
              >
                Write a review
              </Link>
            </nav>
          </div>
        </header>

        {/* Page content */}
        {children}

        {/* Footer */}
        <footer className="border-t border-gray-200 mt-16 py-8 px-4">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p>♿ Accessible Stadium Reviews</p>
            <p>Helping disabled fans make informed decisions.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}