"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Category = {
  id: string;
  name: string;
};

export default function CollectionForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [instagramReelUrl, setInstagramReelUrl] = useState("");
  const [tiktokReelUrl, setTiktokReelUrl] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    let imageFileId: string | undefined;
    let imageFileName: string | undefined;

    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      let uploadResponse: Response;
      try {
        uploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
      } catch (fetchError) {
        console.error("[client upload] fetch failed", fetchError);
        setError(
          fetchError instanceof Error
            ? `Upload fetch failed: ${fetchError.message}`
            : "Upload fetch failed",
        );
        setLoading(false);
        return;
      }

      if (!uploadResponse.ok) {
        let data: { error?: string } | null = null;
        try {
          data = await uploadResponse.json();
        } catch (parseError) {
          console.error("[client upload] invalid JSON response", parseError);
        }

        console.error("[client upload] server error", {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText,
          body: data,
        });

        setError(data?.error ?? `Failed to upload image (${uploadResponse.status})`);
        setLoading(false);
        return;
      }

      const uploadData = await uploadResponse.json();
      imageFileId = uploadData.fileId;
      imageFileName = uploadData.fileName;
    }

    const response = await fetch("/api/admin/collections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        description: description || undefined,
        price: price || undefined,
        categoryId,
        imageFileId,
        imageFileName,
        instagramReelUrl: instagramReelUrl || undefined,
        tiktokReelUrl: tiktokReelUrl || undefined,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Failed to create collection item");
      setLoading(false);
      return;
    }

    setName("");
    setDescription("");
    setPrice("");
    setInstagramReelUrl("");
    setTiktokReelUrl("");
    setImage(null);
    setLoading(false);
    router.refresh();
  }

  if (categories.length === 0) {
    return (
      <p className="card-luxury border-brand-secondary/30 bg-brand-secondary/5 p-6 text-brand-charcoal">
        Create at least one category before adding collection items.{" "}
        <Link href="/admin/categories" className="text-brand-primary underline">
          Go to Categories
        </Link>
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-luxury p-6">
      <h2 className="font-heading text-lg font-light uppercase tracking-wider text-brand-charcoal">
        Add Collection Item
      </h2>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="item-name" className="mb-1 block text-sm text-brand-muted">
            Name
          </label>
          <input
            id="item-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="form-input w-full"
            required
          />
        </div>
        <div>
          <label htmlFor="item-category" className="mb-1 block text-sm text-brand-muted">
            Category
          </label>
          <select
            id="item-category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="form-select w-full"
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="item-price" className="mb-1 block text-sm text-brand-muted">
            Price (optional)
          </label>
          <input
            id="item-price"
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(event) => setPrice(event.target.value)}
            className="form-input w-full"
            placeholder="99.00"
          />
        </div>
        <div>
          <label htmlFor="item-image" className="mb-1 block text-sm text-brand-muted">
            Image
          </label>
          <input
            id="item-image"
            type="file"
            accept="image/*"
            onChange={(event) => setImage(event.target.files?.[0] ?? null)}
            className="form-input w-full"
          />
        </div>
        <div>
          <label htmlFor="item-instagram" className="mb-1 block text-sm text-brand-muted">
            Instagram Reel URL (optional)
          </label>
          <input
            id="item-instagram"
            type="url"
            value={instagramReelUrl}
            onChange={(event) => setInstagramReelUrl(event.target.value)}
            className="form-input w-full"
            placeholder="https://www.instagram.com/reel/..."
          />
        </div>
        <div>
          <label htmlFor="item-tiktok" className="mb-1 block text-sm text-brand-muted">
            TikTok Reel URL (optional)
          </label>
          <input
            id="item-tiktok"
            type="url"
            value={tiktokReelUrl}
            onChange={(event) => setTiktokReelUrl(event.target.value)}
            className="form-input w-full"
            placeholder="https://www.tiktok.com/@.../video/..."
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="item-description" className="mb-1 block text-sm text-brand-muted">
            Description
          </label>
          <textarea
            id="item-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="form-textarea w-full"
            rows={3}
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-brand-primary">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary mt-4 disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Item"}
      </button>
    </form>
  );
}
