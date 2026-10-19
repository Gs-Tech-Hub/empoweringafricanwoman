"use client";

import Image from "next/image";
import { useState } from "react";
import { getMediaUrl } from "@/lib/utils";

type MediaAsset = {
  id: string;
  fileName: string;
  mimeType: string;
  mediaType: "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";
  altText: string | null;
  caption: string | null;
};

export default function MediaLibrary({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const [assets, setAssets] = useState(initialAssets);
  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function uploadMedia(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!file) {
      setError("Choose a media file to upload.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("altText", altText);
    formData.append("caption", caption);

    try {
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to upload media.");
        return;
      }

      setAssets((current) => [data.asset as MediaAsset, ...current]);
      setFile(null);
      setAltText("");
      setCaption("");
      form.reset();
      setMessage("Media uploaded.");
    } catch (uploadError) {
      console.error("[media library] Upload failed", uploadError);
      setError("The upload could not be completed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function saveAsset(asset: MediaAsset) {
    setSavingId(asset.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`/api/admin/media/${asset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          altText: asset.altText ?? "",
          caption: asset.caption ?? "",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? `Failed to save ${asset.fileName}.`);
        return;
      }

      setAssets((current) =>
        current.map((currentAsset) => (currentAsset.id === asset.id ? data : currentAsset)),
      );
      setMessage("Media details saved.");
    } catch (saveError) {
      console.error("[media library] Metadata update failed", saveError);
      setError(`Could not save ${asset.fileName}. Please try again.`);
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={uploadMedia} className="card-luxury space-y-4 p-6">
        <h2 className="font-heading text-xl text-brand-charcoal">Upload media</h2>
        <p className="text-sm text-brand-muted">
          Images, video, audio, and PDF files are stored in your configured media provider.
          Videos may be up to 100 MB; other files may be up to 25 MB.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="media-file" className="mb-1 block text-sm text-brand-muted">
              File
            </label>
            <input
              id="media-file"
              type="file"
              accept="image/*,video/*,audio/*,application/pdf"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="form-input w-full"
              required
            />
          </div>
          <div>
            <label htmlFor="media-alt" className="mb-1 block text-sm text-brand-muted">
              Alternative text
            </label>
            <input
              id="media-alt"
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              className="form-input w-full"
              maxLength={500}
            />
          </div>
          <div>
            <label htmlFor="media-caption" className="mb-1 block text-sm text-brand-muted">
              Caption / internal note
            </label>
            <input
              id="media-caption"
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              className="form-input w-full"
              maxLength={1000}
            />
          </div>
        </div>
        {error && <p role="alert" className="text-sm text-brand-primary">{error}</p>}
        {message && <p role="status" className="text-sm text-green-800">{message}</p>}
        <button type="submit" disabled={uploading} className="btn btn-primary disabled:opacity-50">
          {uploading ? "Uploading..." : "Upload media"}
        </button>
      </form>

      <section aria-labelledby="media-assets-heading" className="space-y-4">
        <h2 id="media-assets-heading" className="font-heading text-2xl text-brand-charcoal">
          Media library ({assets.length})
        </h2>
        {assets.length === 0 ? (
          <p className="card-luxury p-6 text-sm text-brand-muted">No media has been uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {assets.map((asset) => (
              <li key={asset.id} className="card-luxury grid gap-5 p-5 md:grid-cols-[12rem_1fr]">
                <div className="flex min-h-36 items-center justify-center overflow-hidden rounded-lg bg-brand-ivory">
                  {asset.mediaType === "IMAGE" ? (
                    <Image
                      src={getMediaUrl(asset.id)!}
                      alt={asset.altText ?? ""}
                      width={240}
                      height={180}
                      unoptimized
                      className="h-36 w-full object-cover"
                    />
                  ) : asset.mediaType === "VIDEO" ? (
                    <video
                      src={getMediaUrl(asset.id)!}
                      controls
                      preload="metadata"
                      className="max-h-48 w-full"
                    >
                    </video>
                  ) : asset.mediaType === "AUDIO" ? (
                    <audio src={getMediaUrl(asset.id)!} controls className="w-full px-3" />
                  ) : (
                    <a
                      href={getMediaUrl(asset.id)!}
                      className="text-sm font-medium text-brand-primary underline"
                    >
                      Open PDF
                    </a>
                  )}
                </div>
                <form
                  className="space-y-3"
                  onSubmit={(event) => {
                    event.preventDefault();
                    void saveAsset(asset);
                  }}
                >
                  <div>
                    <p className="font-medium text-brand-charcoal">{asset.fileName}</p>
                    <p className="text-xs uppercase tracking-wide text-brand-muted">
                      {asset.mediaType} · {asset.mimeType}
                    </p>
                  </div>
                  <label className="block text-sm text-brand-muted">
                    Alternative text
                    <input
                      value={asset.altText ?? ""}
                      onChange={(event) =>
                        setAssets((current) =>
                          current.map((item) =>
                            item.id === asset.id ? { ...item, altText: event.target.value } : item,
                          ),
                        )
                      }
                      className="form-input mt-1 w-full"
                      maxLength={500}
                    />
                  </label>
                  <label className="block text-sm text-brand-muted">
                    Caption / internal note
                    <input
                      value={asset.caption ?? ""}
                      onChange={(event) =>
                        setAssets((current) =>
                          current.map((item) =>
                            item.id === asset.id ? { ...item, caption: event.target.value } : item,
                          ),
                        )
                      }
                      className="form-input mt-1 w-full"
                      maxLength={1000}
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={savingId === asset.id}
                    className="btn btn-primary disabled:opacity-50"
                  >
                    {savingId === asset.id ? "Saving..." : "Save details"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
