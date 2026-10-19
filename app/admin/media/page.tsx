import { redirect } from "next/navigation";
import MediaLibrary from "@/components/admin/media-library";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Manage Media",
};

export default async function AdminMediaPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fileName: true,
      mimeType: true,
      mediaType: true,
      altText: true,
      caption: true,
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="section-subtitle">Manage</p>
        <h1 className="mt-2 font-heading text-3xl font-light uppercase tracking-widest text-brand-charcoal">
          Media Library
        </h1>
        <p className="mt-2 text-brand-muted">
          Upload and maintain image, video, audio, and document assets for the website.
        </p>
      </div>
      <MediaLibrary initialAssets={assets} />
    </div>
  );
}
