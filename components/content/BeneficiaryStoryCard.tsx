import Image from "next/image";
import { getMediaUrl } from "@/lib/utils";

export type BeneficiaryStory = {
  id: string;
  title: string | null;
  authorName: string;
  content: string;
  mediaAsset: {
    id: string;
    altText: string | null;
    mediaType: "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT";
  } | null;
};

export default function BeneficiaryStoryCard({
  story,
  compact = false,
}: {
  story: BeneficiaryStory;
  compact?: boolean;
}) {
  const mediaUrl = story.mediaAsset ? getMediaUrl(story.mediaAsset) : null;
  const imageAlt = story.mediaAsset?.altText || story.title || "Beneficiary story";

  return (
    <article className="card-programme flex h-full flex-col overflow-hidden">
      {mediaUrl && story.mediaAsset?.mediaType === "IMAGE" ? (
        <Image
          src={mediaUrl}
          alt={imageAlt}
          width={720}
          height={540}
          unoptimized
          className="aspect-[4/3] w-full object-cover"
        />
      ) : mediaUrl && story.mediaAsset?.mediaType === "VIDEO" ? (
        <video
          src={mediaUrl}
          controls
          playsInline
          preload="metadata"
          aria-label={`${story.title || "Beneficiary story"} video`}
          className="aspect-video w-full bg-brand-charcoal object-contain"
        />
      ) : null}
      <div className={`flex flex-1 flex-col ${compact ? "p-5" : "p-6"}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-accent">
          Beneficiary story
        </p>
        {story.title ? (
          <h3 className="mt-2 font-heading text-xl font-semibold text-brand-primary">
            {story.title}
          </h3>
        ) : null}
        <blockquote className="mt-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-brand-muted">
          {story.content}
        </blockquote>
        <footer className="mt-5 border-t border-brand-border pt-4 text-sm font-semibold text-brand-charcoal">
          {story.authorName}
        </footer>
      </div>
    </article>
  );
}
