import Image from "next/image";
import { getContentSections, getContentValue, type PageContent } from "@/lib/content/site-content";
import { getMediaUrl } from "@/lib/utils";

type ContentPageProps = {
  content: PageContent;
  title: string;
};

export default function ContentPage({ content, title }: ContentPageProps) {
  const pageTitle = getContentValue(content, "page", "title") || title;
  const sections = getContentSections(content, "section");
  const values = getContentSections(content, "value");

  return (
    <article className="bg-brand-cream">
      <header className="content-container py-16 text-center md:py-24">
        {content.page?.eyebrow?.value ? (
          <p className="eyebrow mb-4">{content.page.eyebrow.value}</p>
        ) : null}
        <div className="gold-divider mb-6" />
        <h1 className="section-heading">{pageTitle}</h1>
        {content.page?.description?.value ? (
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-brand-muted">
            {content.page.description.value}
          </p>
        ) : null}
      </header>

      {sections.length || values.length ? (
        <div className="content-container space-y-12 pb-16 md:space-y-16 md:pb-24">
          {sections.map(({ id, fields }) => {
            const body =
              fields.body?.value ?? fields.content?.value ?? fields.description?.value ?? "";
            const mediaAsset = fields.media?.mediaAsset;
            const mediaUrl = mediaAsset ? getMediaUrl(mediaAsset.id) : null;

            return (
              <section key={id} className="mx-auto max-w-4xl space-y-5">
                {fields.eyebrow?.value ? <p className="eyebrow">{fields.eyebrow.value}</p> : null}
                {fields.title?.value ? (
                  <h2 className="font-heading text-3xl font-semibold text-brand-primary">
                    {fields.title.value}
                  </h2>
                ) : null}
                {body
                  .split(/\n{2,}/)
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={`${id}-${index}`} className="text-base leading-relaxed text-brand-muted">
                      {paragraph}
                    </p>
                  ))}
                {mediaUrl && mediaAsset?.mediaType === "IMAGE" ? (
                  <Image
                    src={mediaUrl}
                    alt={mediaAsset.altText ?? ""}
                    width={1200}
                    height={800}
                    unoptimized
                    className="h-auto max-h-[40rem] w-full rounded-[var(--radius-image)] object-cover"
                  />
                ) : mediaUrl && mediaAsset?.mediaType === "VIDEO" ? (
                  <video src={mediaUrl} controls preload="metadata" className="w-full rounded-[var(--radius-image)]" />
                ) : mediaUrl && mediaAsset?.mediaType === "AUDIO" ? (
                  <audio src={mediaUrl} controls className="w-full" />
                ) : mediaUrl && mediaAsset?.mediaType === "DOCUMENT" ? (
                  <a href={mediaUrl} className="button-secondary inline-flex">
                    {fields.media.mediaAsset?.caption || fields.media.mediaAsset?.fileName || "Open document"}
                  </a>
                ) : null}
              </section>
            );
          })}

          {values.length ? (
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {values.map(({ id, fields }) => (
                <article key={id} className="card-programme p-6">
                  {fields.title?.value ? (
                    <h2 className="font-heading text-xl font-semibold text-brand-primary">
                      {fields.title.value}
                    </h2>
                  ) : null}
                  {fields.description?.value ? (
                    <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                      {fields.description.value}
                    </p>
                  ) : null}
                </article>
              ))}
            </section>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
