import { redirect } from "next/navigation";
import StoryManager from "@/components/admin/story-manager";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Manage Participant Stories",
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
      where: { mediaType: "IMAGE" },
      select: { id: true, fileName: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <p className="section-subtitle">Manage</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-brand-primary">
          Participant stories
        </h1>
        <p className="mt-2 text-brand-muted">
          Add, review and publish stories only when participant consent and copy are confirmed.
        </p>
      </div>
      <StoryManager initialStories={stories} media={media} />
    </div>
  );
}
