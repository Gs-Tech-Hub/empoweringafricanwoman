"use client";

import { useState } from "react";

type Story = {
  id: string;
  title: string | null;
  authorName: string;
  content: string;
  region: string;
  consentConfirmed: boolean;
  published: boolean;
  mediaAssetId: string | null;
};

type Media = { id: string; fileName: string };

type StoryDraft = Omit<Story, "id" | "published">;

const blankStory: StoryDraft = {
  title: "",
  authorName: "",
  content: "",
  region: "global",
  consentConfirmed: false,
  mediaAssetId: null,
};

export default function StoryManager({
  initialStories,
  media,
}: {
  initialStories: Story[];
  media: Media[];
}) {
  const [stories, setStories] = useState(initialStories);
  const [newStory, setNewStory] = useState<StoryDraft>(blankStory);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  function updateStory(id: string, patch: Partial<Story>) {
    setStories((current) =>
      current.map((story) => (story.id === id ? { ...story, ...patch } : story)),
    );
  }

  async function createStory(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSavingId("new");

    try {
      const response = await fetch("/api/admin/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStory),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Failed to save story.");
        return;
      }
      setStories((current) => [data, ...current]);
      setNewStory(blankStory);
      setMessage("Story saved as a draft.");
    } catch (saveError) {
      console.error("[story manager] Create failed", saveError);
      setError("Story could not be saved. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  async function saveStory(story: Story) {
    setError("");
    setMessage("");
    setSavingId(story.id);

    try {
      const response = await fetch(`/api/admin/stories/${story.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(story),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Failed to update story.");
        return;
      }
      setStories((current) => current.map((item) => (item.id === story.id ? data : item)));
      setMessage("Story updated.");
    } catch (saveError) {
      console.error("[story manager] Update failed", saveError);
      setError("Story could not be updated. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  function storyFields(
    story: Pick<Story, "title" | "authorName" | "content" | "region" | "consentConfirmed" | "mediaAssetId">,
    update: (patch: Partial<Story>) => void,
    prefix: string,
  ) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor={`${prefix}-title`} className="mb-1 block text-sm text-brand-muted">
            Story title (optional)
          </label>
          <input
            id={`${prefix}-title`}
            value={story.title ?? ""}
            onChange={(event) => update({ title: event.target.value })}
            maxLength={240}
            className="form-input w-full"
          />
        </div>
        <div>
          <label htmlFor={`${prefix}-author`} className="mb-1 block text-sm text-brand-muted">
            Public name or approved alias
          </label>
          <input
            id={`${prefix}-author`}
            value={story.authorName}
            onChange={(event) => update({ authorName: event.target.value })}
            maxLength={120}
            required
            className="form-input w-full"
          />
        </div>
        <div>
          <label htmlFor={`${prefix}-region`} className="mb-1 block text-sm text-brand-muted">
            Region
          </label>
          <select
            id={`${prefix}-region`}
            value={story.region}
            onChange={(event) => update({ region: event.target.value })}
            className="form-select w-full"
          >
            <option value="global">Global</option>
            <option value="africa">Africa</option>
            <option value="canada">Canada</option>
            <option value="us">United States</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${prefix}-media`} className="mb-1 block text-sm text-brand-muted">
            Participant image
          </label>
          <select
            id={`${prefix}-media`}
            value={story.mediaAssetId ?? ""}
            onChange={(event) => update({ mediaAssetId: event.target.value || null })}
            className="form-select w-full"
          >
            <option value="">No image</option>
            {media.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.fileName}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label htmlFor={`${prefix}-content`} className="mb-1 block text-sm text-brand-muted">
            Story text
          </label>
          <textarea
            id={`${prefix}-content`}
            value={story.content}
            onChange={(event) => update({ content: event.target.value })}
            maxLength={10000}
            rows={5}
            required
            className="form-textarea w-full"
          />
        </div>
        <label className="flex items-start gap-3 text-sm text-brand-charcoal md:col-span-2">
          <input
            type="checkbox"
            checked={story.consentConfirmed}
            onChange={(event) => update({ consentConfirmed: event.target.checked })}
            className="form-checkbox mt-0.5"
          />
          I confirm this participant has consented to publication of this story and the selected media.
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={createStory} className="card-luxury space-y-4 p-6">
        <div>
          <h2 className="font-heading text-xl font-semibold text-brand-primary">Add story</h2>
          <p className="mt-1 text-sm text-brand-muted">
            New stories are drafts. Verify consent and accuracy before publishing.
          </p>
        </div>
        {storyFields(
          newStory,
          (patch) => setNewStory((current) => ({ ...current, ...patch })),
          "new-story",
        )}
        {error ? <p role="alert" className="text-sm text-brand-accent">{error}</p> : null}
        <button type="submit" disabled={savingId === "new"} className="button-primary disabled:opacity-50">
          {savingId === "new" ? "Saving..." : "Save story draft"}
        </button>
      </form>

      <section className="space-y-4" aria-labelledby="existing-stories-heading">
        <h2 id="existing-stories-heading" className="font-heading text-2xl font-semibold text-brand-primary">
          Existing stories
        </h2>
        {stories.length ? (
          stories.map((story) => (
            <form
              key={story.id}
              onSubmit={(event) => {
                event.preventDefault();
                void saveStory(story);
              }}
              className="card-luxury space-y-4 p-6"
            >
              {storyFields(story, (patch) => updateStory(story.id, patch), story.id)}
              <label className="flex items-center gap-3 text-sm text-brand-charcoal">
                <input
                  type="checkbox"
                  checked={story.published}
                  disabled={!story.consentConfirmed}
                  onChange={(event) => updateStory(story.id, { published: event.target.checked })}
                  className="form-checkbox"
                />
                Published
              </label>
              {!story.consentConfirmed ? (
                <p className="text-xs text-brand-accent">
                  This story cannot be published until participant consent is confirmed.
                </p>
              ) : null}
              <button
                type="submit"
                disabled={savingId === story.id}
                className="button-secondary disabled:opacity-50"
              >
                {savingId === story.id ? "Saving..." : "Save story"}
              </button>
            </form>
          ))
        ) : (
          <p className="card-luxury p-6 text-sm text-brand-muted">No stories have been added.</p>
        )}
      </section>
      {message ? <p role="status" className="text-sm text-green-800">{message}</p> : null}
      {error ? <p role="alert" className="text-sm text-brand-accent">{error}</p> : null}
    </div>
  );
}
