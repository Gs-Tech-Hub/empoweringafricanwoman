"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
  _count: { items: number };
};

export default function CategoryList({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleDelete(id: string) {
    if (!confirm("Delete this programme category? It must not contain any programmes.")) {
      return;
    }

    setDeletingId(id);
    setError("");

    const response = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Failed to delete category");
      setDeletingId(null);
      return;
    }

    setDeletingId(null);
    router.refresh();
  }

  if (categories.length === 0) {
    return (
      <p className="card-luxury p-6 text-brand-muted">
        No programme categories yet. Add one above.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-brand-primary">{error}</p>}
      {categories.map((category) => (
        <div
          key={category.id}
          className="card-luxury flex items-center justify-between px-4 py-3"
        >
          <div>
            <p className="font-medium text-brand-charcoal">{category.name}</p>
            <p className="text-xs text-brand-muted">
              {category.slug} · {category._count.items} items
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleDelete(category.id)}
            disabled={deletingId === category.id}
            className="text-sm text-brand-primary transition hover:text-red-800 disabled:opacity-50"
          >
            {deletingId === category.id ? "Deleting..." : "Delete"}
          </button>
        </div>
      ))}
    </div>
  );
}
