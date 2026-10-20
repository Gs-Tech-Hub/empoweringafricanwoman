"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getMediaUrl } from "@/lib/utils";

type CollectionItem = {
  id: string;
  name: string;
  description: string | null;
  published: boolean;
  mediaAsset: { id: string; altText: string | null } | null;
  category: { name: string };
};

export default function CollectionList({ items }: { items: CollectionItem[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(id: string) {
    if (!confirm("Delete this programme?")) return;

    setDeletingId(id);
    setError("");

    const response = await fetch(`/api/admin/collections/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Failed to delete programme");
      setDeletingId(null);
      return;
    }

    setDeletingId(null);
    router.refresh();
  }

  async function setPublished(id: string, published: boolean) {
    setUpdatingId(id);
    setError("");

    try {
      const response = await fetch(`/api/admin/collections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Failed to update programme status");
        return;
      }
      router.refresh();
    } catch (updateError) {
      console.error("[programme admin] Status update failed", updateError);
      setError("Could not update programme status.");
    } finally {
      setUpdatingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <p className="card-luxury p-6 text-brand-muted">
        No programme records yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-brand-primary">{error}</p>}
      {items.map((item) => {
        const imageUrl = item.mediaAsset ? getMediaUrl(item.mediaAsset) : null;

        return (
          <div
            key={item.id}
            className="card-luxury flex items-center gap-4 p-4"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-brand-marble">
              {imageUrl && item.mediaAsset ? (
                <Image src={imageUrl} alt={item.mediaAsset.altText ?? ""} fill unoptimized className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-brand-muted">
                  —
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-brand-charcoal">{item.name}</p>
              <p className="text-xs text-brand-muted">
                {item.category.name} · {item.published ? "Published" : "Draft"}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={() => void setPublished(item.id, !item.published)}
                disabled={updatingId === item.id}
                className="text-sm font-medium text-brand-primary underline underline-offset-2 disabled:opacity-50"
              >
                {updatingId === item.id ? "Saving..." : item.published ? "Unpublish" : "Publish"}
              </button>
              <button
                type="button"
                onClick={() => void handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="text-sm text-brand-accent transition hover:text-red-800 disabled:opacity-50"
              >
                {deletingId === item.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
