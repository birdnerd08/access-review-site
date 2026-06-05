"use client";

import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function AdminGate({ children }: Props) {
  const [password, setPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [checkedStorage, setCheckedStorage] = useState(false);

  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  useEffect(() => {
    const saved = window.localStorage.getItem("accessReviewAdmin");
    if (saved === "true") {
      setAuthorized(true);
    }
    setCheckedStorage(true);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!adminPassword) {
      alert("Admin password is not configured.");
      return;
    }

    if (password === adminPassword) {
      window.localStorage.setItem("accessReviewAdmin", "true");
      setAuthorized(true);
    } else {
      alert("Incorrect password.");
    }
  }

  function handleLogout() {
    window.localStorage.removeItem("accessReviewAdmin");
    setAuthorized(false);
    setPassword("");
  }

  if (!checkedStorage) {
    return (
      <main className="max-w-md mx-auto px-4 py-10">
        <p className="text-gray-500">Checking admin access...</p>
      </main>
    );
  }

  if (!authorized) {
    return (
      <main className="max-w-md mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Admin access
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter the admin password to review pending photos.
        </p>

        <form onSubmit={handleSubmit} className="border border-gray-200 rounded-xl p-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Admin password"
          />

          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg"
          >
            Continue
          </button>
        </form>
      </main>
    );
  }

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 pt-4 flex justify-end">
        <button
          type="button"
          onClick={handleLogout}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Log out admin
        </button>
      </div>
      {children}
    </div>
  );
}