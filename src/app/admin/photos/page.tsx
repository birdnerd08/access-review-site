"use client";

import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";
import {
  getPendingReviewPhotos,
  updateReviewPhotoStatus,
} from "@/lib/db";
import { ReviewPhotoModerationItem } from "@/lib/types";

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<ReviewPhotoModerationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadPhotos() {
    setLoading(true);
    const data = await getPendingReviewPhotos();
    setPhotos(data);
    setLoading(false);
  }

  useEffect(() => {
    loadPhotos();
  }, []);

  async function handleStatus(
    photoId: string,
    status: "approved" | "rejected"
  ) {
    setUpdatingId(photoId);

    const success = await updateReviewPhotoStatus(photoId, status);

    if (success) {
      setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
    } else {
      alert("Could not update photo status.");
    }

    setUpdatingId(null);
  }

  return (
    <AdminGate>
      <main className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Photo moderation
        </h1>

        <p className="text-sm text-gray-500 mb-8">
          Review pending photos before they appear publicly.
        </p>

        {loading ? (
          <p className="text-gray-500">Loading photos...</p>
        ) : photos.length === 0 ? (
          <div className="border border-gray-200 rounded-xl p-8 text-center">
            <p className="text-gray-500">No pending photos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="border border-gray-200 rounded-xl overflow-hidden bg-white"
              >
                <img
                  src={photo.publicUrl}
                  alt={photo.caption || "Pending review photo"}
                  className="w-full h-72 object-cover bg-gray-100"
                />

                <div className="p-4">
                  <p className="font-semibold text-gray-900">
                    {photo.stadiumName || photo.stadiumId}
                  </p>

                  {photo.caption && (
                    <p className="text-sm text-gray-600 mt-1">
                      {photo.caption}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    Uploaded {new Date(photo.createdAt).toLocaleString()}
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      type="button"
                      disabled={updatingId === photo.id}
                      onClick={() => handleStatus(photo.id, "approved")}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg"
                    >
                      {updatingId === photo.id ? "Updating..." : "Approve"}
                    </button>

                    <button
                      type="button"
                      disabled={updatingId === photo.id}
                      onClick={() => handleStatus(photo.id, "rejected")}
                      className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium px-4 py-2 rounded-lg"
                    >
                      {updatingId === photo.id ? "Updating..." : "Reject"}
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 mt-3 break-all">
                    {photo.storagePath}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AdminGate>
  );
}