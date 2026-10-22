import Image from "next/image";
import { getContentSections, getContentValue, type PageContent } from "@/lib/content/site-content";
import { getMediaUrl, getYouTubeEmbedUrl } from "@/lib/utils";

type EventSectionsProps = {
  content: PageContent;
  kind: "planned" | "completed";
};

function formatEventDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(date);
}

function getSecureExternalUrl(value?: string | null) {
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

export default function EventSections({ content, kind }: EventSectionsProps) {
  const planned = kind === "planned";
  const prefix = planned ? "planned-event" : "impact-event";
  const sectionKey = planned ? "planned-events" : "completed-events";
  const events = getContentSections(content, prefix)
    .map(({ id, fields }) => ({
      id,
      title: fields.title?.value ?? "",
      date: fields.date?.value ?? "",
      time: fields.time?.value ?? "",
      location: fields.location?.value ?? "",
      details: fields.details?.value ?? "",
      registrationUrl: getSecureExternalUrl(fields.registrationUrl?.value),
      youtubeUrl: getYouTubeEmbedUrl(fields.youtubeUrl?.value),
      media: fields.media?.mediaAsset,
      status: fields.status?.value || "draft",
      order: Number.isFinite(Number(fields.order?.value))
        ? Number(fields.order?.value)
        : 0,
    }))
    .filter(
      (event) =>
        event.status === "published" &&
        event.title &&
        (planned ? event.date : true),
    )
    .sort((left, right) => {
      if (planned && left.date !== right.date) {
        return left.date.localeCompare(right.date);
      }
      return left.order - right.order || left.id.localeCompare(right.id);
    });

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="bg-brand-ivory py-16 md:py-24">
      <div className="content-container">
        <header className="mb-10 max-w-3xl">
          {getContentValue(content, sectionKey, "eyebrow") ? (
            <p className="eyebrow mb-4">
              {getContentValue(content, sectionKey, "eyebrow")}
            </p>
          ) : null}
          <div className="gold-divider mb-6 !mx-0" />
          <h2 className="section-heading">
            {getContentValue(content, sectionKey, "title") ||
              (planned ? "Planned events" : "Completed events")}
          </h2>
          {getContentValue(content, sectionKey, "description") ? (
            <p className="mt-4 leading-relaxed text-brand-muted">
              {getContentValue(content, sectionKey, "description")}
            </p>
          ) : null}
        </header>

        <div className="grid gap-8">
          {events.map((event) => {
            const mediaUrl = event.media ? getMediaUrl(event.media) : null;
            const image =
              mediaUrl && event.media?.mediaType === "IMAGE" ? mediaUrl : null;
            const video =
              mediaUrl && event.media?.mediaType === "VIDEO" ? mediaUrl : null;
            const hasMedia = Boolean(event.youtubeUrl || image || video);

            return (
              <article
                key={event.id}
                className={`card-luxury grid overflow-hidden ${
                  hasMedia ? "md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.85fr)]" : ""
                }`}
              >
                <div className="p-6 md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent">
                    {planned ? "Planned event" : "Completed event"}
                  </p>
                  <h3 className="mt-2 font-heading text-2xl font-semibold text-brand-primary">
                    {event.title}
                  </h3>
                  <dl className="mt-5 grid gap-3 text-sm text-brand-muted sm:grid-cols-2">
                    {event.date ? (
                      <div>
                        <dt className="font-semibold text-brand-charcoal">Date</dt>
                        <dd>
                          <time dateTime={event.date}>{formatEventDate(event.date)}</time>
                        </dd>
                      </div>
                    ) : null}
                    {event.time ? (
                      <div>
                        <dt className="font-semibold text-brand-charcoal">Time</dt>
                        <dd>{event.time}</dd>
                      </div>
                    ) : null}
                    {event.location ? (
                      <div className="sm:col-span-2">
                        <dt className="font-semibold text-brand-charcoal">Location</dt>
                        <dd>{event.location}</dd>
                      </div>
                    ) : null}
                  </dl>
                  {event.details ? (
                    <p className="mt-5 whitespace-pre-line leading-relaxed text-brand-muted">
                      {event.details}
                    </p>
                  ) : null}
                  {event.registrationUrl ? (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="button-secondary mt-6 inline-flex"
                    >
                      Event information and registration
                    </a>
                  ) : null}
                </div>

                {event.youtubeUrl ? (
                  <iframe
                    src={event.youtubeUrl}
                    title={`${event.title} video`}
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="aspect-video h-full min-h-56 w-full self-center border-0"
                  />
                ) : image && event.media ? (
                  <Image
                    src={image}
                    alt={event.media.altText || event.title}
                    width={960}
                    height={720}
                    unoptimized
                    className="aspect-video h-full min-h-56 w-full self-center object-cover"
                  />
                ) : video ? (
                  <video
                    src={video}
                    controls
                    preload="metadata"
                    className="aspect-video h-full min-h-56 w-full self-center bg-black object-contain"
                  />
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
