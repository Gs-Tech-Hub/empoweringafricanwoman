"use client";

import Image from "next/image";
import { useState } from "react";
import type {
  ContentFieldDefinition,
  FixedContentGroup,
  PageContentDefinition,
  RepeatableContentGroup,
} from "@/config/admin-content";

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
  url: string;
  altText: string | null;
};

type ContentEditorProps = {
  page: string;
  region: string;
  definition: PageContentDefinition;
  initialEntries: ContentEntry[];
  media: MediaOption[];
};

function entryKey(section: string, field: string) {
  return `${section}\u0000${field}`;
}

function newEntry(section: string, field: string): ContentEntry {
  return {
    id: `new-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    section,
    field,
    value: "",
    mediaAssetId: "",
  };
}

function getAllowedMediaTypes(page: string, section: string) {
  if (page === "home" && (section === "hero" || section.startsWith("activity:"))) {
    return ["IMAGE", "VIDEO"];
  }
  if (section.startsWith("planned-event:") || section.startsWith("impact-event:")) {
    return ["IMAGE", "VIDEO"];
  }
  if (section === "founder" || section.startsWith("team:")) {
    return ["IMAGE"];
  }
  return ["IMAGE", "VIDEO", "AUDIO", "DOCUMENT"];
}

export default function ContentEditor({
  page,
  region,
  definition,
  initialEntries,
  media,
}: ContentEditorProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [newGroups, setNewGroups] = useState<Record<string, string[]>>({});
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function getEntry(section: string, field: string) {
    return entries.find((entry) => entryKey(entry.section, entry.field) === entryKey(section, field));
  }

  function setField(section: string, field: string, patch: Partial<ContentEntry>) {
    setEntries((current) => {
      const existingIndex = current.findIndex(
        (entry) => entryKey(entry.section, entry.field) === entryKey(section, field),
      );
      if (existingIndex === -1) {
        return [...current, { ...newEntry(section, field), ...patch }];
      }
      return current.map((entry, index) =>
        index === existingIndex ? { ...entry, ...patch } : entry,
      );
    });
  }

  function groupSections(group: RepeatableContentGroup) {
    const prefix = `${group.prefix}:`;
    const savedSections = entries
      .filter((entry) => entry.section.startsWith(prefix))
      .map((entry) => entry.section);
    return Array.from(
      new Set([...savedSections, ...(newGroups[group.prefix] ?? []).map((id) => `${prefix}${id}`)]),
    );
  }

  function addGroup(group: RepeatableContentGroup) {
    const sections = groupSections(group);
    let index = sections.length + 1;
    let id = `${group.prefix}-${index}`;
    while (sections.includes(`${group.prefix}:${id}`)) {
      index += 1;
      id = `${group.prefix}-${index}`;
    }
    setNewGroups((current) => ({
      ...current,
      [group.prefix]: [...(current[group.prefix] ?? []), id],
    }));
  }

  function removeGroup(section: string, group: RepeatableContentGroup) {
    setEntries((current) => current.filter((entry) => entry.section !== section));
    setNewGroups((current) => ({
      ...current,
      [group.prefix]: (current[group.prefix] ?? []).filter(
        (id) => `${group.prefix}:${id}` !== section,
      ),
    }));
  }

  function isKnownEntry(entry: ContentEntry) {
    const isFixed = definition.fixed.some(
      (group) =>
        group.section === entry.section &&
        group.fields.some((field) => field.field === entry.field),
    );
    const repeatable = definition.repeatable.find((group) =>
      entry.section.startsWith(`${group.prefix}:`),
    );
    return (
      isFixed ||
      Boolean(repeatable?.fields.some((field) => field.field === entry.field))
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const keys = entries.map((entry) => entryKey(entry.section.trim(), entry.field.trim()));
    if (new Set(keys).size !== keys.length) {
      setError("A content field is repeated. Please review the page before saving.");
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

  function renderField(
    section: string,
    field: ContentFieldDefinition,
    idPrefix: string,
  ) {
    const entry = getEntry(section, field.field);
    const id = `${idPrefix}-${field.field}`;
    const value = entry?.value ?? "";

    if (field.kind === "media") {
      const allowedTypes = getAllowedMediaTypes(page, section);
      const selectedAsset = media.find((asset) => asset.id === (entry?.mediaAssetId ?? ""));
      const options = media.filter(
        (asset) =>
          allowedTypes.includes(asset.mediaType) || asset.id === selectedAsset?.id,
      );
      const selected = options.find((asset) => asset.id === (entry?.mediaAssetId ?? ""));

      return (
        <div className="space-y-3">
          <label htmlFor={id} className="mb-1 block text-sm font-medium text-brand-text">
            {field.label}
          </label>
          <select
            id={id}
            value={entry?.mediaAssetId ?? ""}
            onChange={(event) => setField(section, field.field, { mediaAssetId: event.target.value })}
            className="form-select w-full"
          >
            <option value="">No media selected</option>
            {options.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.mediaType.toLowerCase()}
                {allowedTypes.includes(asset.mediaType) ? "" : " (current selection)"}: {asset.fileName}
              </option>
            ))}
          </select>
          {field.help ? <p className="text-xs text-brand-muted">{field.help}</p> : null}
          {selected?.mediaType === "IMAGE" ? (
            <div className="flex items-center gap-4 rounded-lg border border-brand-border bg-brand-cream p-3">
              <Image
                src={selected.url}
                alt={selected.altText ?? ""}
                width={96}
                height={72}
                unoptimized
                className="h-18 w-24 rounded-md object-cover"
              />
              <p className="min-w-0 text-sm text-brand-muted">{selected.fileName}</p>
            </div>
          ) : selected?.mediaType === "VIDEO" ? (
            <video
              src={selected.url}
              controls
              preload="metadata"
              className="max-h-64 w-full rounded-lg bg-black"
            />
          ) : null}
        </div>
      );
    }

    if (field.kind === "icon" || field.kind === "status" || field.kind === "event-status") {
      const choices =
        field.kind === "icon"
          ? [
              ["book-open", "Book"],
              ["briefcase", "Briefcase"],
              ["graduation", "Graduation"],
              ["heart", "Heart"],
              ["health", "Health"],
              ["users", "People"],
            ]
          : field.kind === "event-status"
            ? [
                ["draft", "Draft — hidden from the public site"],
                ["published", "Published"],
              ]
            : [
              ["target", "Target — unverified / planned"],
              ["verified", "Verified"],
            ];
      const defaultChoice =
        field.kind === "event-status"
          ? "draft"
          : field.kind === "status"
            ? "target"
            : "book-open";
      return (
        <div>
          <label htmlFor={id} className="mb-1 block text-sm font-medium text-brand-text">
            {field.label}
          </label>
          <select
            id={id}
            value={value || defaultChoice}
            onChange={(event) => setField(section, field.field, { value: event.target.value })}
            className="form-select w-full"
          >
            {choices.map(([choice, label]) => (
              <option key={choice} value={choice}>
                {label}
              </option>
            ))}
          </select>
          {field.help ? <p className="mt-1 text-xs text-brand-muted">{field.help}</p> : null}
        </div>
      );
    }

    return (
      <div>
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-brand-text">
          {field.label}
        </label>
        {field.kind === "textarea" ? (
          <textarea
            id={id}
            value={value}
            onChange={(event) => setField(section, field.field, { value: event.target.value })}
            maxLength={10000}
            rows={4}
            className="form-textarea w-full"
          />
        ) : (
          <input
            id={id}
            type={field.kind === "date" || field.kind === "url" ? field.kind : "text"}
            value={value}
            onChange={(event) => setField(section, field.field, { value: event.target.value })}
            maxLength={10000}
            required={field.required}
            placeholder={field.kind === "url" ? "https://" : undefined}
            className="form-input w-full"
          />
        )}
        {field.help ? <p className="mt-1 text-xs text-brand-muted">{field.help}</p> : null}
      </div>
    );
  }

  function renderFixedGroup(group: FixedContentGroup) {
    return (
      <fieldset key={group.section} className="card-luxury space-y-5 p-5 sm:p-6">
        <legend className="sr-only">{group.title}</legend>
        <div>
          <h2 className="font-heading text-xl font-semibold text-brand-primary">{group.title}</h2>
          {group.description ? (
            <p className="mt-1 text-sm leading-relaxed text-brand-muted">{group.description}</p>
          ) : null}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {group.fields.map((field) => (
            <div
              key={field.field}
              className={
                field.kind === "textarea" || field.kind === "media" || field.kind === "url"
                  ? "md:col-span-2"
                  : ""
              }
            >
              {renderField(group.section, field, group.section)}
            </div>
          ))}
        </div>
      </fieldset>
    );
  }

  function renderRepeatableGroup(group: RepeatableContentGroup) {
    const sections = groupSections(group);
    return (
      <section key={group.prefix} className="space-y-4" aria-labelledby={`group-${group.prefix}`}>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id={`group-${group.prefix}`}
              className="font-heading text-xl font-semibold text-brand-primary"
            >
              {group.title}
            </h2>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-brand-muted">
              {group.description}
            </p>
          </div>
          <button type="button" onClick={() => addGroup(group)} className="button-secondary">
            Add {group.itemLabel.toLowerCase()}
          </button>
        </div>
        {sections.length === 0 ? (
          <p className="card-luxury p-5 text-sm text-brand-muted">
            No {group.itemLabel.toLowerCase()} content yet.
          </p>
        ) : (
          sections.map((section, index) => {
            const itemId = section.slice(group.prefix.length + 1);
            return (
              <fieldset key={section} className="card-luxury space-y-5 p-5 sm:p-6">
                <legend className="sr-only">
                  {group.itemLabel} {index + 1}
                </legend>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-heading text-lg font-semibold text-brand-charcoal">
                    {group.itemLabel} {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeGroup(section, group)}
                    className="text-sm font-medium text-brand-accent underline underline-offset-2"
                  >
                    Remove {group.itemLabel.toLowerCase()}
                  </button>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  {group.fields.map((field) => (
                    <div
                      key={field.field}
                      className={
                        field.kind === "textarea" || field.kind === "media" || field.kind === "url"
                          ? "md:col-span-2"
                          : ""
                      }
                    >
                      {renderField(section, field, `${group.prefix}-${itemId}`)}
                    </div>
                  ))}
                </div>
              </fieldset>
            );
          })
        )}
      </section>
    );
  }

  const unmappedEntries = entries.filter((entry) => !isKnownEntry(entry));

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-xl border border-brand-border bg-brand-ivory p-4 text-sm leading-relaxed text-brand-muted">
        Editing <strong className="font-semibold text-brand-text">{page}</strong> content for{" "}
        <strong className="font-semibold text-brand-text">{region}</strong>. Only the selected
        region is changed; global content is not overwritten.
      </div>

      {definition.fixed.map(renderFixedGroup)}
      {definition.repeatable.map(renderRepeatableGroup)}

      {unmappedEntries.length > 0 ? (
        <details className="rounded-xl border border-brand-border bg-white">
          <summary className="cursor-pointer p-5 font-medium text-brand-text">
            Existing fields not currently displayed on this page ({unmappedEntries.length})
          </summary>
          <div className="space-y-4 border-t border-brand-border p-5">
            <p className="text-sm leading-relaxed text-brand-muted">
              These saved records do not match a field rendered by this page. They are preserved
              when saving unless you remove them here.
            </p>
            {unmappedEntries.map((entry) => (
              <fieldset
                key={entry.id}
                className="grid gap-4 rounded-lg border border-brand-border p-4 md:grid-cols-2"
              >
                <legend className="px-1 text-xs text-brand-muted">
                  {entry.section} / {entry.field}
                </legend>
                <label className="text-sm text-brand-muted">
                  Section key
                  <input
                    value={entry.section}
                    onChange={(event) =>
                      setEntries((current) =>
                        current.map((item) =>
                          item.id === entry.id ? { ...item, section: event.target.value } : item,
                        ),
                      )
                    }
                    maxLength={80}
                    className="form-input mt-1 w-full"
                  />
                </label>
                <label className="text-sm text-brand-muted">
                  Field key
                  <input
                    value={entry.field}
                    onChange={(event) =>
                      setEntries((current) =>
                        current.map((item) =>
                          item.id === entry.id ? { ...item, field: event.target.value } : item,
                        ),
                      )
                    }
                    maxLength={80}
                    className="form-input mt-1 w-full"
                  />
                </label>
                <label className="text-sm text-brand-muted md:col-span-2">
                  Saved value
                  <textarea
                    value={entry.value}
                    onChange={(event) =>
                      setEntries((current) =>
                        current.map((item) =>
                          item.id === entry.id ? { ...item, value: event.target.value } : item,
                        ),
                      )
                    }
                    maxLength={10000}
                    rows={3}
                    className="form-textarea mt-1 w-full"
                  />
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setEntries((current) => current.filter((item) => item.id !== entry.id))
                  }
                  className="justify-self-start text-sm font-medium text-brand-accent underline underline-offset-2"
                >
                  Remove unused field
                </button>
              </fieldset>
            ))}
          </div>
        </details>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-brand-accent">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3 border-t border-brand-border pt-5">
        <button type="submit" disabled={saving} className="button-primary disabled:opacity-50">
          {saving ? "Saving..." : "Save page content"}
        </button>
      </div>
    </form>
  );
}
