import { MediaType, PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const initialPageLabels = [
  { page: "home", section: "hero", field: "eyebrow", value: "Women’s economic empowerment" },
  { page: "home", section: "hero", field: "title", value: "Empowering the African Woman" },
  { page: "home", section: "hero", field: "description", value: "We support women with the skills, capital, and community backing to grow sustainable futures and lead change in their families and communities." },
  { page: "home", section: "about", field: "eyebrow", value: "Our mission" },
  { page: "home", section: "about", field: "title", value: "Building confidence, opportunity, and resilience" },
  { page: "home", section: "about", field: "lead", value: "We work alongside women to strengthen livelihoods, expand education, and create healthy, connected communities rooted in dignity and participation." },
  { page: "home", section: "about", field: "description", value: "Regional programming is shaped with local partners and communities to keep support practical, relevant, and sustainable." },
  { page: "home", section: "pillars", field: "title", value: "Programme pillars" },
  { page: "home", section: "programmes", field: "title", value: "Programmes" },
  { page: "home", section: "programmes", field: "description", value: "Practical support across livelihoods, learning, health, and leadership." },
  { page: "home", section: "stories", field: "title", value: "Stories" },
  { page: "home", section: "donation", field: "eyebrow", value: "Support today" },
  { page: "home", section: "donation", field: "title", value: "Help women grow stronger futures" },
  { page: "home", section: "donation", field: "description", value: "Your support helps fund practical programmes that strengthen women’s skills, livelihoods, health, and leadership." },
  { page: "about", section: "page", field: "title", value: "About" },
  { page: "programmes", section: "page", field: "title", value: "Programmes" },
  { page: "impact", section: "page", field: "title", value: "Impact" },
  { page: "stories", section: "page", field: "title", value: "Stories" },
  { page: "locations", section: "page", field: "title", value: "Locations" },
  { page: "donate", section: "page", field: "title", value: "Donate" },
  { page: "home", section: "value", field: "education", value: "Skills and learning opportunities" },
  { page: "home", section: "value", field: "enterprise", value: "Economic resilience and enterprise support" },
  { page: "home", section: "value", field: "health", value: "Health, well-being, and safe communities" },
  { page: "home", section: "pillar:education", field: "title", value: "Education & skills" },
  { page: "home", section: "pillar:education", field: "description", value: "Equip women with practical training, mentoring, and learning pathways that unlock new opportunities." },
  { page: "home", section: "pillar:education", field: "icon", value: "graduation" },
  { page: "home", section: "pillar:enterprise", field: "title", value: "Enterprise support" },
  { page: "home", section: "pillar:enterprise", field: "description", value: "Strengthen small businesses and income opportunities through market access, business support, and capital." },
  { page: "home", section: "pillar:enterprise", field: "icon", value: "briefcase" },
  { page: "home", section: "pillar:health", field: "title", value: "Health & wellbeing" },
  { page: "home", section: "pillar:health", field: "description", value: "Create healthier environments so women can thrive with confidence, safety, and care." },
  { page: "home", section: "pillar:health", field: "icon", value: "heart" },
  { page: "home", section: "pillar:leadership", field: "title", value: "Leadership & voice" },
  { page: "home", section: "pillar:leadership", field: "description", value: "Build networks, confidence, and participation so women can lead change within their communities." },
  { page: "home", section: "pillar:leadership", field: "icon", value: "users" },
]
  .map((entry) => ({ ...entry, region: "global" }));

const localFallbackMedia: Array<{
  fileId: string;
  fileName: string;
  mimeType: string;
  mediaType: MediaType;
  altText: string;
  caption: string;
}> = [
  {
    fileId: "/images/woman-on-computer.jpg",
    fileName: "woman-on-computer.jpg",
    mimeType: "image/jpeg",
    mediaType: "IMAGE",
    altText: "Woman working on a laptop in a community learning space",
    caption: "Community learning and digital access",
  },
  {
    fileId: "/images/woman-in-shop.jpg",
    fileName: "woman-in-shop.jpg",
    mimeType: "image/jpeg",
    mediaType: "IMAGE",
    altText: "Woman standing in a small shop space",
    caption: "Enterprise support and small business growth",
  },
  {
    fileId: "/images/woman-in-local-market.jpg",
    fileName: "woman-in-local-market.jpg",
    mimeType: "image/jpeg",
    mediaType: "IMAGE",
    altText: "Woman in a local market environment",
    caption: "Local market participation and livelihoods",
  },
  {
    fileId: "/images/soil-with-plant.jpg",
    fileName: "soil-with-plant.jpg",
    mimeType: "image/jpeg",
    mediaType: "IMAGE",
    altText: "Soil with a growing plant symbolising social impact",
    caption: "Growth and resilience",
  },
  {
    fileId: "/images/Hopeful Artisan in Vibrant Headwrap.png",
    fileName: "Hopeful Artisan in Vibrant Headwrap.png",
    mimeType: "image/png",
    mediaType: "IMAGE",
    altText: "Woman in a vibrant headwrap with an artisan-inspired expression",
    caption: "Creative enterprise and dignity",
  },
];

async function upsertMediaAsset(asset: (typeof localFallbackMedia)[number]) {
  return prisma.mediaAsset.upsert({
    where: {
      storageProvider_fileId: {
        storageProvider: "GOOGLE_DRIVE",
        fileId: asset.fileId,
      },
    },
    create: {
      ...asset,
      storageProvider: "GOOGLE_DRIVE",
    },
    update: {
      fileName: asset.fileName,
      mimeType: asset.mimeType,
      mediaType: asset.mediaType,
      altText: asset.altText,
      caption: asset.caption,
    },
  });
}

async function ensureDefaultContent() {
  for (const entry of initialPageLabels) {
    await prisma.siteContent.upsert({
      where: {
        page_region_section_field: {
          page: entry.page,
          region: entry.region,
          section: entry.section,
          field: entry.field,
        },
      },
      create: entry,
      update: { value: entry.value },
    });
  }

  const [heroAsset, programmeAsset, marketAsset] = await Promise.all([
    upsertMediaAsset(localFallbackMedia[0]),
    upsertMediaAsset(localFallbackMedia[1]),
    upsertMediaAsset(localFallbackMedia[2]),
  ]);

  await prisma.siteContent.upsert({
    where: {
      page_region_section_field: {
        page: "home",
        region: "global",
        section: "hero",
        field: "media",
      },
    },
    create: {
      page: "home",
      region: "global",
      section: "hero",
      field: "media",
      mediaAssetId: heroAsset.id,
    },
    update: { mediaAssetId: heroAsset.id },
  });

  await prisma.siteContent.upsert({
    where: {
      page_region_section_field: {
        page: "home",
        region: "global",
        section: "programmes",
        field: "media",
      },
    },
    create: {
      page: "home",
      region: "global",
      section: "programmes",
      field: "media",
      mediaAssetId: programmeAsset.id,
    },
    update: { mediaAssetId: programmeAsset.id },
  });

  await prisma.siteContent.upsert({
    where: {
      page_region_section_field: {
        page: "home",
        region: "global",
        section: "stories",
        field: "media",
      },
    },
    create: {
      page: "home",
      region: "global",
      section: "stories",
      field: "media",
      mediaAssetId: marketAsset.id,
    },
    update: { mediaAssetId: marketAsset.id },
  });
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD before seeding the admin account, for example: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=change-me",
    );
  }

  await ensureDefaultContent();

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: "Administrator", password: hashedPassword },
    create: {
      email: adminEmail,
      name: "Administrator",
      password: hashedPassword,
    },
  });

  console.log("Seeded default CMS content, local media fallbacks, and admin account without replacing existing content.");
}

main()
  .catch((error) => {
    console.error("Database seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
