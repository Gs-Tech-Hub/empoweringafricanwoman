export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function formatPrice(price: number | string | null | undefined) {
  if (price === null || price === undefined || price === "") {
    return null;
  }

  const amount = typeof price === "string" ? Number(price) : price;
  if (Number.isNaN(amount)) {
    return null;
  }

  // Format currency in Nigerian Naira with no decimal places
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getImageUrl(fileId?: string | null) {
  if (!fileId) return null;

  if (
    fileId.startsWith("/") ||
    fileId.startsWith("http://") ||
    fileId.startsWith("https://") ||
    fileId.startsWith("data:")
  ) {
    return fileId;
  }

  if (fileId.startsWith("images/")) {
    return `/${fileId}`;
  }

  // If Supabase public storage is configured, prefer the direct public URL
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseBucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET;
  if (supabaseUrl && supabaseBucket) {
    const base = supabaseUrl.replace(/\/$/, "");
    return `${base}/storage/v1/object/public/${supabaseBucket}/${fileId}`;
  }

  return `/api/images/${fileId}`;
}

type MediaUrlInput =
  | string
  | null
  | undefined
  | {
      id: string;
      fileId?: string | null;
    };

function isDirectMediaSource(fileId: string) {
  return (
    fileId.startsWith("/") ||
    fileId.startsWith("http://") ||
    fileId.startsWith("https://") ||
    fileId.startsWith("data:") ||
    fileId.startsWith("images/") ||
    fileId.startsWith("public/")
  );
}

export function getMediaUrl(media?: MediaUrlInput) {
  if (!media) {
    return null;
  }

  if (typeof media === "string") {
    if (isDirectMediaSource(media)) {
      return getImageUrl(media);
    }
    return `/api/media/${encodeURIComponent(media)}`;
  }

  const directSource = media.fileId ? getImageUrl(media.fileId) : null;
  if (media.fileId && isDirectMediaSource(media.fileId)) {
    return directSource;
  }

  return `/api/media/${encodeURIComponent(media.id)}`;
}

export function getInstagramReelEmbedUrl(url?: string | null) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (
      parsed.protocol !== "https:" ||
      !["instagram.com", "www.instagram.com"].includes(parsed.hostname)
    ) {
      return null;
    }

    const match = parsed.pathname.match(/^\/reels?\/([^/]+)/i);
    return match ? `https://www.instagram.com/reel/${match[1]}/embed` : null;
  } catch {
    return null;
  }
}

export function getTikTokEmbedUrl(url?: string | null) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (
      parsed.protocol !== "https:" ||
      !["tiktok.com", "www.tiktok.com"].includes(parsed.hostname)
    ) {
      return null;
    }

    const match = parsed.pathname.match(/\/video\/(\d+)/i);
    return match ? `https://www.tiktok.com/player/v1/${match[1]}` : null;
  } catch {
    return null;
  }
}
