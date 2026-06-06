"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Feature idea");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setStatus("sending");
    setErrorMessage("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setErrorMessage(data.error || "Something went wrong.");
      return;
    }

    setStatus("sent");
    setName("");
    setEmail("");
    setSubject("Feature idea");
    setMessage("");
  }

  return (
    <main className="min-h-screen bg-[#FAF7F1] text-gray-900">
      <section className="max-w-3xl mx-auto px-4 py-14 md:py-20">
        <p className="text-sm font-semibold tracking-wide uppercase text-[#8A6A2F] mb-3">
          Contact
        </p>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-950 mb-4">
          Contact form
        </h1>

        <p className="text-gray-600 leading-relaxed mb-8">
          For a feature you would like to be added, bugs, information, or
          anything else, please use the contact form provided. Thank you!
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E5DED1] rounded-3xl p-6 md:p-8 shadow-sm"
        >
          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-[#E5DED1] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[#E5DED1] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-[#E5DED1] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] bg-white"
              >
                <option>Feature idea</option>
                <option>Bug report</option>
                <option>Venue information</option>
                <option>Accessibility concern</option>
                <option>Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={7}
                className="w-full border border-[#E5DED1] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
                placeholder="Write your message here."
              />
            </div>

            {status === "error" && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {status === "sent" && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                Message sent. Thank you.
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-xl bg-[#1E3A5F] px-5 py-3 text-sm font-semibold text-white hover:bg-[#162D49] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {status === "sending" ? "Sending..." : "Send message"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}