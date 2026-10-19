import Image from "next/image";
import {
  getImageUrl,
  getInstagramReelEmbedUrl,
  getTikTokEmbedUrl,
} from "@/lib/utils";

type CollectionMediaProps = {
  name: string;
  imageFileId?: string | null;
  instagramReelUrl?: string | null;
  tiktokReelUrl?: string | null;
};

export default function CollectionMedia({
  name,
  imageFileId,
  instagramReelUrl,
  tiktokReelUrl,
}: CollectionMediaProps) {
  const instagramEmbedUrl = getInstagramReelEmbedUrl(instagramReelUrl);
  const tiktokEmbedUrl = getTikTokEmbedUrl(tiktokReelUrl);

  if (instagramEmbedUrl) {
    return (
      <iframe
        src={instagramEmbedUrl}
        title={`${name} Instagram Reel`}
        className="pointer-events-none h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }

  if (tiktokEmbedUrl) {
    return (
      <iframe
        src={tiktokEmbedUrl}
        title={`${name} TikTok Reel`}
        className="pointer-events-none h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer"
      />
    );
  }

  const imageUrl = getImageUrl(imageFileId);
  return imageUrl ? (
    <Image
      src={imageUrl}
      alt={name}
      fill
      className="object-cover transition duration-500 group-hover:scale-100 scale-95"
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  ) : (
    <div className="flex h-full items-center justify-center text-sm text-brand-muted">
      No image
    </div>
  );
}