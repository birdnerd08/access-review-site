"use client";

import { useState } from "react";
import { VenueType } from "@/lib/types";
import { submitStadiumRequest } from "@/lib/db";

const VENUE_TYPES: VenueType[] = [
  "Football Stadium",
  "Baseball Stadium",
  "Basketball / Concert Arena",
  "College Stadium",
  "Other",
];

interface Props {
  initialName?: string;
  onCancel: () => void;
}

export default function StadiumRequestForm({ initialName = "", onCancel }: Props) {
  const [form, setForm] = useState({
    name: initialName,
    city: "",
    state: "",
    venuetype: "" as VenueType | "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Enter the stadium name.";
    if (!form.city.trim()) newErrors.city = "Enter the city.";
    if (!form.state.trim()) newErrors.state = "Enter the state.";
    if (!form.venuetype) newErrors.venuetype = "Choose a venue type.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true);
    const success = await submitStadiumRequest({
      name: form.name,
      city: form.city,
      state: form.state,
      venuetype: form.venuetype as string,
    });
    setSubmitting(false);
    if (success) setSubmitted(true);
    else alert("Something went wrong. Please try again.");
  }

  if (submitted) {
    return (
      <div className="border border-green-200 bg-green-50 rounded-xl p-6 text-center">
        <p className="text-2xl mb-2">✓</p>
        <h3 className="font-bold text-gray-900 mb-1">Stadium submitted</h3>
        <p className="text-sm text-gray-600 mb-4">
          Thanks — we'll review and add {form.name} shortly. Check back soon to leave your review.
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-blue-600 hover:underline"
        >
          Back to stadium search
        </button>
      </div>
    );
  }

  return (
    <div className="border border-blue-100 bg-blue-50 rounded-xl p-6">
      <h3 className="font-bold text-gray-900 mb-1">Submit a stadium</h3>
      <p className="text-sm text-gray-500 mb-5">
        Can't find your stadium? Submit it and we'll add it shortly.
      </p>

      <div className="flex flex-col gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Stadium name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Yankee Stadium"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* City + State */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. New York"
            />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => setForm((p) => ({ ...p, state: e.target.value.toUpperCase().slice(0, 2) }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. NY"
              maxLength={2}
            />
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
          </div>
        </div>

        {/* Venue type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Venue type <span className="text-red-500">*</span>
          </label>
          <select
            value={form.venuetype}
            onChange={(e) => setForm((p) => ({ ...p, venuetype: e.target.value as VenueType }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select venue type</option>
            {VENUE_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {errors.venuetype && <p className="text-red-500 text-xs mt-1">{errors.venuetype}</p>}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            {submitting ? "Submitting..." : "Submit stadium"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}