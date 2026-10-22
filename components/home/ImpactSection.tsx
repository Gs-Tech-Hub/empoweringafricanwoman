import Image from "next/image";
import Link from "next/link";
import { getContentSections, type PageContent } from "@/lib/content/site-content";
import { getMediaUrl, getYouTubeEmbedUrl } from "@/lib/utils";

export function ImpactSection({
  content,
  highlightContent,
  variant = "detail",
}: {
  content: PageContent;
  highlightContent?: PageContent;
  variant?: "summary" | "detail";
}) {
  const targets = (variant === "detail" ? getContentSections(content, "target") : [])
    .map(({ id, fields }) => ({
      id,
      label: fields.label?.value ?? "",
      value: fields.value?.value ?? "",
      description: fields.description?.value ?? "",
      status: fields.status?.value ?? "target",
    }))
    .filter((target) => target.label || target.value || target.description);

  const featuredPost =
    variant === "summary"
      ? getContentSections(highlightContent ?? {}, "impact-event")
          .map(({ id, fields }) => ({
            id,
            title: fields.title?.value ?? "",
            date: fields.date?.value ?? "",
            location: fields.location?.value ?? "",
            details: fields.details?.value ?? "",
            status: fields.status?.value ?? "draft",
            order: Number.isFinite(Number(fields.order?.value))
              ? Number(fields.order?.value)
              : 0,
            media: fields.media?.mediaAsset,
            youtubeUrl: getYouTubeEmbedUrl(fields.youtubeUrl?.value),
          }))
          .filter((post) => post.status === "published" && post.title)
          .sort((left, right) => left.order - right.order || left.id.localeCompare(right.id))[0]
      : undefined;

  if (
    !content.impact?.title?.value &&
    !content.impact?.description?.value &&
    targets.length === 0 &&
    !featuredPost
  ) {
    return null;
  }

  const mediaUrl = featuredPost?.media ? getMediaUrl(featuredPost.media) : null;
  const hasFeaturedMedia = Boolean(
    featuredPost?.youtubeUrl ||
      (mediaUrl &&
        (featuredPost?.media?.mediaType === "IMAGE" ||
          featuredPost?.media?.mediaType === "VIDEO")),
  );
  const formattedDate = featuredPost?.date
    ? (() => {
        const date = new Date(`${featuredPost.date}T00:00:00`);
        return Number.isNaN(date.getTime())
          ? featuredPost.date
          : new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(date);
      })()
    : "";

  return (
    <section className="bg-brand-primary py-16 text-brand-ivory md:py-24">
      <div className="content-container">
        <div className="mb-12 max-w-2xl" data-aos="fade-up">
          {content.impact?.eyebrow?.value ? (
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-brand-secondary">
              {content.impact.eyebrow.value}
            </p>
          ) : null}
          {content.impact?.title?.value ? (
            <h2 className="font-heading text-3xl font-semibold md:text-4xl">
              {content.impact.title.value}
            </h2>
          ) : null}
          {content.impact?.description?.value ? (
            <p className="mt-4 text-sm text-brand-ivory/80">
              {content.impact.description.value}
            </p>
          ) : null}
        </div>

        {targets.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {targets.map((item, index) => (
            <article
              key={item.id}
              className="rounded-[var(--radius-luxury)] border border-brand-secondary/30 bg-brand-primary/80 p-6"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              <p className="font-heading text-4xl font-semibold text-brand-secondary">{item.value}</p>
              <h3 className="mt-2 text-sm font-semibold">
                {item.label}
                {item.status.toLowerCase() !== "verified" ? " (target)" : ""}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-brand-ivory/75">{item.description}</p>
            </article>
            ))}
          </div>
        ) : null}
        {featuredPost ? (
          <article
            className={`mt-8 grid overflow-hidden rounded-[var(--radius-luxury)] border border-brand-secondary/30 bg-brand-primary/80 ${
              hasFeaturedMedia ? "md:grid-cols-2" : ""
            }`}
          >
            {featuredPost.youtubeUrl ? (
              <iframe
                src={featuredPost.youtubeUrl}
                title={`${featuredPost.title} video`}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="aspect-video h-full min-h-56 w-full self-center border-0"
              />
            ) : mediaUrl && featuredPost.media?.mediaType === "IMAGE" ? (
              <Image
                src={mediaUrl}
                alt={featuredPost.media.altText || featuredPost.title}
                width={960}
                height={720}
                unoptimized
                className="aspect-video h-full min-h-56 w-full object-cover"
              />
            ) : mediaUrl && featuredPost.media?.mediaType === "VIDEO" ? (
              <video
                src={mediaUrl}
                controls
                preload="metadata"
                className="aspect-video h-full min-h-56 w-full bg-black object-contain"
              />
            ) : null}
            <div className="flex flex-col items-start p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-secondary">
                Impact highlight
              </p>
              <h3 className="mt-2 font-heading text-2xl font-semibold">
                {featuredPost.title}
              </h3>
              {formattedDate || featuredPost.location ? (
                <p className="mt-3 text-sm text-brand-ivory/70">
                  {[formattedDate, featuredPost.location].filter(Boolean).join(" · ")}
                </p>
              ) : null}
              {featuredPost.details ? (
                <p className="mt-4 line-clamp-3 whitespace-pre-line text-sm leading-relaxed text-brand-ivory/80">
                  {featuredPost.details}
                </p>
              ) : null}
              <Link href="/impact" className="button-secondary mt-6 inline-flex">
                View impact
              </Link>
            </div>
          </article>
        ) : null}
        {variant === "summary" && !featuredPost ? (
          <Link href="/impact" className="button-secondary mt-8 inline-flex">
            Explore our impact
          </Link>
        ) : null}
      </div>
    </section>
  );
}
