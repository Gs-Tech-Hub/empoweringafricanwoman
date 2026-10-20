"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Failed to create category");
      setLoading(false);
      return;
    }

    setName("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card-luxury p-6">
      <h2 className="font-heading text-lg font-light uppercase tracking-wider text-brand-charcoal">
        Add programme category
      </h2>
      <div className="mt-4">
        <label htmlFor="category-name" className="mb-1 block text-sm text-brand-muted">
          Programme category name
        </label>
        <input
          id="category-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="form-input w-full"
          placeholder="e.g. Education"
          required
        />
      </div>
      {error && <p className="mt-3 text-sm text-brand-primary">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary mt-4 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add category"}
      </button>
    </form>
  );
}
