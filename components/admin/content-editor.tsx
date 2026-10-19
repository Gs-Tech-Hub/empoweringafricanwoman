"use client";

import Link from "next/link";
import { useState } from "react";

type EditableMedia = {
  id: string;
  fileName: string;
  mediaType: string;
  altText: string | null;
};

type ContentEditorProps = {
  region: string;
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroMediaId: string;
  aboutLead: string;
  media: EditableMedia[];
};

export default function ContentEditor({
  region,
  heroEyebrow: initialEyebrow,
  heroTitle: initialTitle,
  heroDescription: initialDescription,
  heroMediaId: initialMediaId,
  aboutLead: initialAboutLead,
  media,
}: ContentEditorProps) {
  const [heroEyebrow, setHeroEyebrow] = useState(initialEyebrow);
  const [heroTitle, setHeroTitle] = useState(initialTitle);
  const [heroDescription, setHeroDescription] = useState(initialDescription);
  const [heroMediaId, setHeroMediaId] = useState(initialMediaId);
  const [aboutLead, setAboutLead] = useState(initialAboutLead);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          region,
          heroEyebrow,
          heroTitle,
          heroDescription,
          heroMediaId,
          aboutLead,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to save content.");
        return;
      }

      setSaved(true);
    } catch (saveError) {
      console.error("[content editor] Save failed", saveError);
      setError("Content could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="card-luxury space-y-4 p-6" aria-labelledby="hero-content-heading">
        <div>
          <h2 id="hero-content-heading" className="font-heading text-xl text-brand-charcoal">
            Homepage hero
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            Leave the media selection empty to use the configured regional fallback.
          </p>
        </div>
        <div>
          <label htmlFor="hero-eyebrow" className="mb-1 block text-sm text-brand-muted">
            Eyebrow
          </label>
          <input
            id="hero-eyebrow"
            value={heroEyebrow}
            onChange={(event) => setHeroEyebrow(event.target.value)}
            className="form-input w-full"
            maxLength={120}
          />
        </div>
        <div>
          <label htmlFor="hero-title" className="mb-1 block text-sm text-brand-muted">
            Heading
          </label>
          <input
            id="hero-title"
            value={heroTitle}
            onChange={(event) => setHeroTitle(event.target.value)}
            className="form-input w-full"
            maxLength={240}
            required
          />
        </div>
        <div>
          <label htmlFor="hero-description" className="mb-1 block text-sm text-brand-muted">
            Description
          </label>
          <textarea
            id="hero-description"
            value={heroDescription}
            onChange={(event) => setHeroDescription(event.target.value)}
            className="form-textarea w-full"
            rows={4}
            maxLength={2000}
          />
        </div>
        <div>
          <label htmlFor="hero-media" className="mb-1 block text-sm text-brand-muted">
            Hero image or video
          </label>
          <select
            id="hero-media"
            value={heroMediaId}
            onChange={(event) => setHeroMediaId(event.target.value)}
            className="form-select w-full"
          >
            <option value="">Use regional fallback image</option>
            {media.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.mediaType}: {asset.fileName}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-brand-muted">
            Need another image or video?{" "}
            <Link href="/admin/media" className="underline">
              Manage media
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="card-luxury space-y-4 p-6" aria-labelledby="about-content-heading">
        <div>
          <h2 id="about-content-heading" className="font-heading text-xl text-brand-charcoal">
            Homepage about section
          </h2>
          <p className="mt-1 text-sm text-brand-muted">
            Use approved organizational copy; do not add unverified impact claims.
          </p>
        </div>
        <div>
          <label htmlFor="about-lead" className="mb-1 block text-sm text-brand-muted">
            Mission lead
          </label>
          <textarea
            id="about-lead"
            value={aboutLead}
            onChange={(event) => setAboutLead(event.target.value)}
            className="form-textarea w-full"
            rows={5}
            maxLength={2000}
          />
        </div>
      </section>

      {error && <p role="alert" className="text-sm text-brand-primary">{error}</p>}
      {saved && <p role="status" className="text-sm text-green-800">Content saved.</p>}
      <button type="submit" disabled={saving} className="btn btn-primary disabled:opacity-50">
        {saving ? "Saving..." : "Save content"}
      </button>
    </form>
  );
}
