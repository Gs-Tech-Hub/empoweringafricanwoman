"use client";

import { useState } from "react";

type ContentEntry = {
  id: string;
  section: string;
  field: string;
  value: string;
  mediaAssetId: string;
};

type MediaOption = {
  id: string;
  fileName: string;
  mediaType: string;
};

type ContentEditorProps = {
  page: string;
  region: string;
  initialEntries: ContentEntry[];
  media: MediaOption[];
};

export default function ContentEditor({
  page,
  region,
  initialEntries,
  media,
}: ContentEditorProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  function updateEntry(id: string, patch: Partial<ContentEntry>) {
    setEntries((current) =>
      current.map((entry) => (entry.id === id ? { ...entry, ...patch } : entry)),
    );
  }

  function addEntry() {
    setEntries((current) => [
      ...current,
      {
        id: `new-${Date.now()}-${current.length}`,
        section: "",
        field: "",
        value: "",
        mediaAssetId: "",
      },
    ]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    const invalidEntry = entries.find(
      (entry) => Boolean(entry.section.trim()) !== Boolean(entry.field.trim()),
    );
    if (invalidEntry) {
      setError("Each entry needs both a section and a field name.");
      setSaving(false);
      return;
    }

    const cleaned = entries
      .filter((entry) => entry.section.trim() && entry.field.trim())
      .map(({ section, field, value, mediaAssetId }) => ({
        section: section.trim(),
        field: field.trim(),
        value: value || undefined,
        mediaAssetId: mediaAssetId || undefined,
      }));

    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, region, entries: cleaned }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to save content.");
        return;
      }

      window.location.reload();
    } catch (saveError) {
      console.error("[content editor] Save failed", saveError);
      setError("Content could not be saved. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-brand-border bg-brand-ivory p-4 text-sm leading-relaxed text-brand-muted">
        Use a section name for a group, then a field name for its value. For repeatable homepage
        cards, use sections such as <code>pillar:education</code> or <code>target:example</code>;
        available fields include <code>title</code>, <code>description</code>, <code>value</code>,
        <code>order</code>, and <code>icon</code>. Content and media are stored per selected region.
      </div>

      {entries.length === 0 ? (
        <p className="card-luxury p-6 text-sm text-brand-muted">
          No content entries exist for this page and region yet.
        </p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <fieldset
              key={entry.id}
              className="card-luxury grid gap-4 p-5 md:grid-cols-2"
            >
              <legend className="sr-only">Content entry {index + 1}</legend>
              <div>
                <label htmlFor={`section-${entry.id}`} className="mb-1 block text-sm text-brand-muted">
                  Section
                </label>
                <input
                  id={`section-${entry.id}`}
                  value={entry.section}
                  onChange={(event) => updateEntry(entry.id, { section: event.target.value })}
                  maxLength={80}
                  className="form-input w-full"
                  placeholder="hero or pillar:education"
                />
              </div>
              <div>
                <label htmlFor={`field-${entry.id}`} className="mb-1 block text-sm text-brand-muted">
                  Field
                </label>
                <input
                  id={`field-${entry.id}`}
                  value={entry.field}
                  onChange={(event) => updateEntry(entry.id, { field: event.target.value })}
                  maxLength={80}
                  className="form-input w-full"
                  placeholder="title, description, media..."
                />
              </div>
              <div>
                <label htmlFor={`value-${entry.id}`} className="mb-1 block text-sm text-brand-muted">
                  Text / value
                </label>
                <textarea
                  id={`value-${entry.id}`}
                  value={entry.value}
                  onChange={(event) => updateEntry(entry.id, { value: event.target.value })}
                  maxLength={10000}
                  rows={3}
                  className="form-textarea w-full"
                />
              </div>
              <div className="space-y-3">
                <div>
                  <label htmlFor={`media-${entry.id}`} className="mb-1 block text-sm text-brand-muted">
                    Media asset
                  </label>
                  <select
                    id={`media-${entry.id}`}
                    value={entry.mediaAssetId}
                    onChange={(event) => updateEntry(entry.id, { mediaAssetId: event.target.value })}
                    className="form-select w-full"
                  >
                    <option value="">No media</option>
                    {media.map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.mediaType}: {asset.fileName}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => setEntries((current) => current.filter((item) => item.id !== entry.id))}
                  className="text-sm font-medium text-brand-accent underline underline-offset-2"
                >
                  Remove entry
                </button>
              </div>
            </fieldset>
          ))}
        </div>
      )}

      {error ? <p role="alert" className="text-sm text-brand-accent">{error}</p> : null}
      {saved ? <p role="status" className="text-sm text-green-800">Content saved.</p> : null}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={addEntry} className="button-secondary">
          Add content field
        </button>
        <button type="submit" disabled={saving} className="button-primary disabled:opacity-50">
          {saving ? "Saving..." : "Save page content"}
        </button>
      </div>
    </form>
  );
}
