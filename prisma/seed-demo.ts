import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const demoStories = [
  {
    id: "demo-story-text-only",
    title: "DEMO ONLY — Written story example",
    authorName: "Fictional demo participant",
    content:
      "This is fictional placeholder copy to demonstrate a written beneficiary story. Replace it with an approved story only after confirming its accuracy and obtaining the participant's consent.",
    mediaType: null,
  },
  {
    id: "demo-story-image",
    title: "DEMO ONLY — Story with an image",
    authorName: "Fictional demo participant",
    content:
      "This fictional draft demonstrates how an approved image and written story will appear together. Do not publish this placeholder or use an identifiable participant image without consent.",
    mediaType: "IMAGE" as const,
  },
  {
    id: "demo-story-video",
    title: "DEMO ONLY — Story with a video",
    authorName: "Fictional demo participant",
    content:
      "This fictional draft demonstrates the video-story workflow. Select an approved video from the media library, replace this placeholder with verified story content, and confirm consent before publishing.",
    mediaType: "VIDEO" as const,
  },
];

async function main() {
  const [image, video] = await Promise.all([
    prisma.mediaAsset.findFirst({
      where: { mediaType: "IMAGE" },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    }),
    prisma.mediaAsset.findFirst({
      where: { mediaType: "VIDEO" },
      orderBy: { createdAt: "desc" },
      select: { id: true },
    }),
  ]);

  for (let index = 0; index < demoStories.length; index += 1) {
    const demoStory = demoStories[index];
    const mediaAssetId =
      demoStory.mediaType === "IMAGE"
        ? image?.id ?? null
        : demoStory.mediaType === "VIDEO"
          ? video?.id ?? null
          : null;

    await prisma.review.upsert({
      where: { id: demoStory.id },
      create: {
        id: demoStory.id,
        title: demoStory.title,
        authorName: demoStory.authorName,
        content: demoStory.content,
        region: "global",
        consentConfirmed: false,
        published: false,
        sortOrder: 9000 + index,
        mediaAssetId,
        rating: null,
      },
      update: {
        title: demoStory.title,
        authorName: demoStory.authorName,
        content: demoStory.content,
        region: "global",
        consentConfirmed: false,
        published: false,
        sortOrder: 9000 + index,
        mediaAssetId,
        rating: null,
      },
    });
  }

  console.log(
    `Seeded ${demoStories.length} fictional, unpublished story drafts. ` +
      `Image example media: ${image ? "available" : "not available"}; ` +
      `video example media: ${video ? "available" : "not available"}.`,
  );
}

main()
  .catch((error) => {
    console.error("Demo story seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
