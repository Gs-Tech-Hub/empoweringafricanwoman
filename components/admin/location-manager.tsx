"use client";

import { useState } from "react";

type Location = {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  region: string;
  mediaAssetId: string | null;
  latitude: number | null;
  longitude: number | null;
  mapEmbedUrl: string | null;
  sortOrder: number;
  published: boolean;
};

type LocationDraft = Omit<Location, "id" | "published">;
type Media = { id: string; fileName: string };

const blankLocation: LocationDraft = {
  name: "",
  address: "",
  phone: null,
  email: null,
  region: "global",
  mediaAssetId: null,
  latitude: null,
  longitude: null,
  mapEmbedUrl: null,
  sortOrder: 0,
};

export default function LocationManager({
  initialLocations,
  media,
}: {
  initialLocations: Location[];
  media: Media[];
}) {
  const [locations, setLocations] = useState(initialLocations);
  const [newLocation, setNewLocation] = useState<LocationDraft>(blankLocation);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  function updateLocation(id: string, patch: Partial<Location>) {
    setLocations((current) =>
      current.map((location) =>
        location.id === id ? { ...location, ...patch } : location,
      ),
    );
  }

  async function submit(
    url: string,
    method: "POST" | "PATCH",
    body: object,
  ) {
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Location could not be saved.");
    return data as Location;
  }

  async function createLocation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSavingId("new");
    try {
      const created = await submit("/api/admin/locations", "POST", newLocation);
      setLocations((current) => [created, ...current]);
      setNewLocation(blankLocation);
      setMessage("Location saved as a draft.");
    } catch (saveError) {
      console.error("[location manager] Create failed", saveError);
      setError(saveError instanceof Error ? saveError.message : "Location could not be saved.");
    } finally {
      setSavingId(null);
    }
  }

  async function saveLocation(location: Location) {
    setError("");
    setMessage("");
    setSavingId(location.id);
    try {
      const updated = await submit(
        `/api/admin/locations/${location.id}`,
        "PATCH",
        location,
      );
      setLocations((current) =>
        current.map((item) => (item.id === location.id ? updated : item)),
      );
      setMessage("Location updated.");
    } catch (saveError) {
      console.error("[location manager] Update failed", saveError);
      setError(saveError instanceof Error ? saveError.message : "Location could not be updated.");
    } finally {
      setSavingId(null);
    }
  }

  function fields(
    location: LocationDraft | Location,
    update: (patch: Partial<LocationDraft>) => void,
    prefix: string,
  ) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm text-brand-muted">
          Name
          <input
            id={`${prefix}-name`}
            value={location.name}
            onChange={(event) => update({ name: event.target.value })}
            maxLength={160}
            required
            className="form-input mt-1 w-full"
          />
        </label>
        <label className="text-sm text-brand-muted">
          Region
          <select
            id={`${prefix}-region`}
            value={location.region}
            onChange={(event) => update({ region: event.target.value })}
            className="form-select mt-1 w-full"
          >
            <option value="global">Global</option>
            <option value="africa">Africa</option>
            <option value="canada">Canada</option>
            <option value="us">United States</option>
          </select>
        </label>
        <label className="text-sm text-brand-muted md:col-span-2">
          Address
          <textarea
            id={`${prefix}-address`}
            value={location.address}
            onChange={(event) => update({ address: event.target.value })}
            maxLength={1000}
            required
            rows={3}
            className="form-textarea mt-1 w-full"
          />
        </label>
        <label className="text-sm text-brand-muted">
          Phone (optional)
          <input
            id={`${prefix}-phone`}
            type="tel"
            value={location.phone ?? ""}
            onChange={(event) => update({ phone: event.target.value || null })}
            maxLength={80}
            className="form-input mt-1 w-full"
          />
        </label>
        <label className="text-sm text-brand-muted">
          Email (optional)
          <input
            id={`${prefix}-email`}
            type="email"
            value={location.email ?? ""}
            onChange={(event) => update({ email: event.target.value || null })}
            maxLength={320}
            className="form-input mt-1 w-full"
          />
        </label>
        <label className="text-sm text-brand-muted">
          Sort order
          <input
            id={`${prefix}-sort-order`}
            type="number"
            min={0}
            max={10000}
            value={location.sortOrder}
            onChange={(event) => update({ sortOrder: Number(event.target.value) })}
            className="form-input mt-1 w-full"
          />
        </label>
        <label className="text-sm text-brand-muted">
          Map embed URL (optional)
          <input
            id={`${prefix}-map`}
            type="url"
            value={location.mapEmbedUrl ?? ""}
            onChange={(event) => update({ mapEmbedUrl: event.target.value || null })}
            maxLength={2000}
            className="form-input mt-1 w-full"
          />
        </label>
        <label className="text-sm text-brand-muted">
          Latitude (optional)
          <input
            id={`${prefix}-latitude`}
            type="number"
            min={-90}
            max={90}
            step="any"
            value={location.latitude ?? ""}
            onChange={(event) => update({ latitude: event.target.value ? Number(event.target.value) : null })}
            className="form-input mt-1 w-full"
          />
        </label>
        <label className="text-sm text-brand-muted">
          Longitude (optional)
          <input
            id={`${prefix}-longitude`}
            type="number"
            min={-180}
            max={180}
            step="any"
            value={location.longitude ?? ""}
            onChange={(event) => update({ longitude: event.target.value ? Number(event.target.value) : null })}
            className="form-input mt-1 w-full"
          />
        </label>
        <label className="text-sm text-brand-muted">
          Image
          <select
            id={`${prefix}-media`}
            value={location.mediaAssetId ?? ""}
            onChange={(event) => update({ mediaAssetId: event.target.value || null })}
            className="form-select mt-1 w-full"
          >
            <option value="">No image</option>
            {media.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.fileName}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form onSubmit={createLocation} className="card-luxury space-y-4 p-6">
        <div>
          <h2 className="font-heading text-xl font-semibold text-brand-primary">Add location</h2>
          <p className="mt-1 text-sm text-brand-muted">
            New locations are drafts and will not appear publicly until published.
          </p>
        </div>
        {fields(
          newLocation,
          (patch) => setNewLocation((current) => ({ ...current, ...patch })),
          "new-location",
        )}
        <button type="submit" disabled={savingId === "new"} className="button-primary disabled:opacity-50">
          {savingId === "new" ? "Saving..." : "Save location draft"}
        </button>
      </form>

      <section className="space-y-4" aria-labelledby="locations-heading">
        <h2 id="locations-heading" className="font-heading text-2xl font-semibold text-brand-primary">
          Existing locations
        </h2>
        {locations.length ? locations.map((location) => (
          <form
            key={location.id}
            onSubmit={(event) => {
              event.preventDefault();
              void saveLocation(location);
            }}
            className="card-luxury space-y-4 p-6"
          >
            {fields(location, (patch) => updateLocation(location.id, patch), location.id)}
            <label className="flex items-center gap-3 text-sm text-brand-charcoal">
              <input
                type="checkbox"
                checked={location.published}
                onChange={(event) => updateLocation(location.id, { published: event.target.checked })}
                className="form-checkbox"
              />
              Published
            </label>
            <button type="submit" disabled={savingId === location.id} className="button-secondary disabled:opacity-50">
              {savingId === location.id ? "Saving..." : "Save location"}
            </button>
          </form>
        )) : (
          <p className="card-luxury p-6 text-sm text-brand-muted">No locations have been added.</p>
        )}
      </section>
      {message ? <p role="status" className="text-sm text-green-800">{message}</p> : null}
      {error ? <p role="alert" className="text-sm text-brand-accent">{error}</p> : null}
    </div>
  );
}
