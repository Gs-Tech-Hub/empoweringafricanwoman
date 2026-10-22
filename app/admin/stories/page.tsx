import { redirect } from "next/navigation";
import StoryManager from "@/components/admin/story-manager";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Manage Beneficiary Stories",
};

export default async function AdminStoriesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  const [stories, media] = await Promise.all([
    prisma.review.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
      select: {
        id: true,
        title: true,
        authorName: true,
        content: true,
        region: true,
        consentConfirmed: true,
        published: true,
        mediaAssetId: true,
      },
    }),
    prisma.mediaAsset.findMany({
      where: { mediaType: { in: ["IMAGE", "VIDEO"] } },
      select: { id: true, fileName: true, mediaType: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  const storyMedia: Array<{
    id: string;
    fileName: string;
    mediaType: "IMAGE" | "VIDEO";
  }> = [];
  for (const asset of media) {
    if (asset.mediaType === "IMAGE" || asset.mediaType === "VIDEO") {
      storyMedia.push({
        id: asset.id,
        fileName: asset.fileName,
        mediaType: asset.mediaType,
      });
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="section-subtitle">Manage</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-brand-primary">
          Beneficiary stories
        </h1>
        <p className="mt-2 text-brand-muted">
          Create written or video stories, select an image or video from the media library, and
          publish only after the story and participant consent are confirmed.
        </p>
      </div>
      <StoryManager initialStories={stories} media={storyMedia} />
    </div>
  );
}
