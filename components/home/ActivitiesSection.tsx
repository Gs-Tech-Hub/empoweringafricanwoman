import Image from "next/image";
import Link from "next/link";
import { getContentSections, type PageContent } from "@/lib/content/site-content";
import { getMediaUrl } from "@/lib/utils";

export function ActivitiesSection({ content }: { content: PageContent }) {
  const activities = getContentSections(content, "activity")
    .map(({ id, fields }) => ({
      id,
      title: fields.title?.value ?? "",
      description: fields.description?.value ?? "",
      media: fields.media?.mediaAsset,
    }))
    .filter(
      (activity) =>
        (activity.title || activity.description) &&
        (activity.media?.mediaType === "IMAGE" || activity.media?.mediaType === "VIDEO"),
    );

  if (activities.length === 0) {
    return null;
  }

  return (
    <section className="bg-brand-ivory py-16 md:py-24" aria-labelledby="activities-heading">
      <div className="content-container">
        <div className="mb-12 max-w-2xl" data-aos="fade-up">
          {content.activities?.eyebrow?.value ? (
            <p className="eyebrow mb-4">{content.activities.eyebrow.value}</p>
          ) : null}
          <div className="gold-divider mb-6 !mx-0" />
          <h2 id="activities-heading" className="section-heading">
            {content.activities?.title?.value || "Our activities"}
          </h2>
          {content.activities?.description?.value ? (
            <p className="mt-4 leading-relaxed text-brand-muted">
              {content.activities.description.value}
            </p>
          ) : null}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {activities.map((activity, index) => {
            if (!activity.media) {
              return null;
            }

            const mediaUrl = getMediaUrl(activity.media);
            if (!mediaUrl) {
              return null;
            }

            return (
              <article
                key={activity.id}
                className="card-programme overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={index * 80}
              >
                <div className="relative aspect-[4/3] bg-brand-cream">
                  {activity.media.mediaType === "VIDEO" ? (
                    <video
                      src={mediaUrl}
                      controls
                      preload="metadata"
                      aria-label={activity.media.altText || activity.title || "Activity video"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={mediaUrl}
                      alt={activity.media.altText ?? ""}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  )}
                </div>
                {(activity.title || activity.description) ? (
                  <div className="p-6">
                    {activity.title ? (
                      <h3 className="font-heading text-xl font-semibold text-brand-primary">
                        {activity.title}
                      </h3>
                    ) : null}
                    {activity.description ? (
                      <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                        {activity.description}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/programmes" className="button-secondary">
            Explore our programmes
          </Link>
        </div>
      </div>
    </section>
  );
}
