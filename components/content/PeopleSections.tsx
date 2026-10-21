import Image from "next/image";
import {
  getContentSections,
  getContentValue,
  type PageContent,
} from "@/lib/content/site-content";
import { getMediaUrl } from "@/lib/utils";

type PeopleSectionsProps = {
  content: PageContent;
};

export default function PeopleSections({ content }: PeopleSectionsProps) {
  const founder = content.founder ?? {};
  const founderName = founder.name?.value ?? "";
  const founderBio = founder.bio?.value ?? "";
  const founderMedia = founder.media?.mediaAsset;
  const founderImageUrl =
    founderMedia?.mediaType === "IMAGE" ? getMediaUrl(founderMedia) : null;
  const teamMembers = getContentSections(content, "team").filter(
    ({ fields }) => Boolean(fields.name?.value),
  );

  return (
    <>
      {founderName || founderBio ? (
        <section className="bg-brand-ivory py-16 md:py-24">
          <div className="content-container">
            <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-16">
              {founderImageUrl && founderMedia ? (
                <Image
                  src={founderImageUrl}
                  alt={founderMedia.altText || founderName}
                  width={720}
                  height={900}
                  unoptimized
                  className="aspect-[4/5] w-full rounded-[var(--radius-image)] object-cover"
                />
              ) : null}
              <div className={founderImageUrl ? "" : "md:col-span-2"}>
                {founder.eyebrow?.value ? (
                  <p className="eyebrow mb-4">{founder.eyebrow.value}</p>
                ) : null}
                <div className="gold-divider mb-6" />
                <h2 className="section-heading mb-3">
                  {founder.title?.value || "A note from our founder"}
                </h2>
                {founderName ? (
                  <p className="font-heading text-xl font-semibold text-brand-primary">
                    {founderName}
                    {founder.role?.value ? (
                      <span className="mt-1 block font-body text-sm font-medium text-brand-muted">
                        {founder.role.value}
                      </span>
                    ) : null}
                  </p>
                ) : null}
                {founderBio ? (
                  <div className="mt-5 space-y-4 text-base leading-relaxed text-brand-muted">
                    {founderBio.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => (
                      <p key={`founder-${index}`}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {teamMembers.length > 0 ? (
        <section className="bg-brand-cream py-16 md:py-24">
          <div className="content-container">
            <div className="mx-auto max-w-3xl text-center">
              {getContentValue(content, "team", "eyebrow") ? (
                <p className="eyebrow mb-4">{getContentValue(content, "team", "eyebrow")}</p>
              ) : null}
              <div className="gold-divider mb-6" />
              <h2 className="section-heading">
                {getContentValue(content, "team", "title") || "Meet our team"}
              </h2>
              {getContentValue(content, "team", "description") ? (
                <p className="mt-5 text-lg leading-relaxed text-brand-muted">
                  {getContentValue(content, "team", "description")}
                </p>
              ) : null}
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map(({ id, fields }) => {
                const mediaAsset = fields.media?.mediaAsset;
                const imageUrl =
                  mediaAsset?.mediaType === "IMAGE" ? getMediaUrl(mediaAsset) : null;

                return (
                  <article key={id} className="card-luxury overflow-hidden">
                    {imageUrl && mediaAsset ? (
                      <Image
                        src={imageUrl}
                        alt={mediaAsset.altText || fields.name?.value || ""}
                        width={720}
                        height={720}
                        unoptimized
                        className="aspect-square w-full object-cover"
                      />
                    ) : null}
                    <div className="p-6">
                      <h3 className="font-heading text-xl font-semibold text-brand-primary">
                        {fields.name?.value}
                      </h3>
                      {fields.role?.value ? (
                        <p className="mt-1 text-sm font-medium text-brand-accent">
                          {fields.role.value}
                        </p>
                      ) : null}
                      {fields.bio?.value ? (
                        <p className="mt-4 text-sm leading-relaxed text-brand-muted">
                          {fields.bio.value}
                        </p>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
