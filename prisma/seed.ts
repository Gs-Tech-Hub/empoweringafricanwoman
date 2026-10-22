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
  { page: "home", section: "pillars", field: "eyebrow", value: "Programme pillars" },
  { page: "home", section: "pillars", field: "title", value: "Our focus" },
  { page: "home", section: "impact", field: "eyebrow", value: "Impact" },
  { page: "home", section: "impact", field: "title", value: "Progress rooted in community needs" },
  { page: "home", section: "impact", field: "description", value: "We measure progress by the strength of local participation, livelihood gains, and women’s increased access to opportunity." },
  { page: "home", section: "programmes", field: "eyebrow", value: "What we support" },
  { page: "home", section: "programmes", field: "title", value: "Programmes" },
  { page: "home", section: "programmes", field: "description", value: "Practical support across livelihoods, learning, health, and leadership." },
  { page: "home", section: "activities", field: "eyebrow", value: "In focus" },
  { page: "home", section: "activities", field: "title", value: "Activities & community work" },
  { page: "home", section: "activities", field: "description", value: "Explore programme areas through the images and stories shared by our team." },
  { page: "home", section: "stories", field: "eyebrow", value: "Voices" },
  { page: "home", section: "stories", field: "title", value: "Stories" },
  { page: "home", section: "stories", field: "description", value: "Personal stories and community experiences show how support translates into lasting change." },
  { page: "home", section: "donation", field: "eyebrow", value: "Support today" },
  { page: "home", section: "donation", field: "title", value: "Help women grow stronger futures" },
  { page: "home", section: "donation", field: "description", value: "Your support helps fund practical programmes that strengthen women’s skills, livelihoods, health, and leadership." },
  { page: "home", section: "activity:learning", field: "title", value: "Learning & digital skills" },
  { page: "home", section: "activity:learning", field: "description", value: "Training, digital access, and learning opportunities." },
  { page: "home", section: "activity:enterprise", field: "title", value: "Enterprise & livelihoods" },
  { page: "home", section: "activity:enterprise", field: "description", value: "Business support and sustainable livelihood opportunities." },
  { page: "home", section: "activity:community", field: "title", value: "Community connection" },
  { page: "home", section: "activity:community", field: "description", value: "Community-led activities that bring people together and strengthen local support." },
  { page: "home", section: "activity:skills", field: "title", value: "Practical skills" },
  { page: "home", section: "activity:skills", field: "description", value: "Learning and practical skills that support women’s goals and livelihoods." },
  { page: "home", section: "activity:markets", field: "title", value: "Local markets" },
  { page: "home", section: "activity:markets", field: "description", value: "Women-led enterprise and participation in local markets." },
  { page: "home", section: "value:education", field: "title", value: "Education & skills" },
  { page: "home", section: "value:education", field: "description", value: "Skills and learning opportunities" },
  { page: "home", section: "value:enterprise", field: "title", value: "Enterprise support" },
  { page: "home", section: "value:enterprise", field: "description", value: "Economic resilience and enterprise support" },
  { page: "home", section: "value:health", field: "title", value: "Health & wellbeing" },
  { page: "home", section: "value:health", field: "description", value: "Health, well-being, and safe communities" },
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
  { page: "home", section: "founder", field: "eyebrow", value: "Founder’s note" },
  { page: "home", section: "founder", field: "title", value: "A note from our founder" },
  { page: "home", section: "founder", field: "name", value: "Christine M. Adebayo" },
  { page: "home", section: "founder", field: "role", value: "Founder & Executive Director" },
  { page: "home", section: "founder", field: "bio", value: "We believe every woman deserves the chance to build a secure future for herself and her family. Our work is rooted in dignity, practical support, and community-led progress." },
  { page: "home", section: "team", field: "eyebrow", value: "The people behind the work" },
  { page: "home", section: "team", field: "title", value: "Meet our team" },
  { page: "home", section: "team", field: "description", value: "Our team works closely with communities, partners, and local leaders to keep programmes relevant, accessible, and grounded in lived experience." },
  { page: "home", section: "team:person-one", field: "name", value: "Aisha Okafor" },
  { page: "home", section: "team:person-one", field: "role", value: "Programme Manager" },
  { page: "home", section: "team:person-one", field: "bio", value: "Aisha supports community partnerships and practical programme delivery that strengthens local women’s agency and opportunity." },
  { page: "home", section: "team:person-two", field: "name", value: "Nadia Diallo" },
  { page: "home", section: "team:person-two", field: "role", value: "Learning & Skills Lead" },
  { page: "home", section: "team:person-two", field: "bio", value: "Nadia oversees learning pathways and community-based skill-building programmes that help women grow confidence and income." },
  { page: "home", section: "target:participants", field: "label", value: "Women reached" },
  { page: "home", section: "target:participants", field: "value", value: "2,500" },
  { page: "home", section: "target:participants", field: "description", value: "People supported through skills, leadership, and livelihood-focused programmes." },
  { page: "home", section: "target:participants", field: "status", value: "target" },
  { page: "home", section: "target:communities", field: "label", value: "Communities engaged" },
  { page: "home", section: "target:communities", field: "value", value: "18" },
  { page: "home", section: "target:communities", field: "description", value: "Local partnerships and outreach activities supporting women-led progress." },
  { page: "home", section: "target:communities", field: "status", value: "target" },
  { page: "home", section: "target:skills", field: "label", value: "Skills programmes" },
  { page: "home", section: "target:skills", field: "value", value: "9" },
  { page: "home", section: "target:skills", field: "description", value: "Learning and enterprise activities designed around practical, local priorities." },
  { page: "home", section: "target:skills", field: "status", value: "target" },
  { page: "about", section: "page", field: "title", value: "About" },
  { page: "about", section: "page", field: "description", value: "We support women with dignity, practical opportunity, and connected communities that help them thrive." },
  { page: "about", section: "section:story", field: "eyebrow", value: "Our story" },
  { page: "about", section: "section:story", field: "title", value: "A community-first approach to change" },
  { page: "about", section: "section:story", field: "body", value: "Empowering African Women began with a simple conviction: women’s progress grows strongest when it is practical, local, and rooted in lived need. We partner with communities to shape programmes that help women earn, learn, lead, and recover with dignity." },
  { page: "about", section: "founder", field: "eyebrow", value: "Founder’s note" },
  { page: "about", section: "founder", field: "title", value: "A note from our founder" },
  { page: "about", section: "founder", field: "name", value: "Joyce S. Edopkolo" },
  { page: "about", section: "founder", field: "role", value: "Founder & Executive Director" },
  { page: "about", section: "founder", field: "bio", value: "Our work is grounded in respect for women’s knowledge, leadership, and lived experience. We bring programmes and partnerships together to create lasting opportunities for families and communities." },
  { page: "about", section: "team", field: "eyebrow", value: "The people behind the work" },
  { page: "about", section: "team", field: "title", value: "Meet our team" },
  { page: "about", section: "team", field: "description", value: "Our team is committed to equitable, practical support for women across every stage of growth." },
  { page: "about", section: "team:person-one", field: "name", value: "Aisha Okafor" },
  { page: "about", section: "team:person-one", field: "role", value: "Programme Manager" },
  { page: "about", section: "team:person-one", field: "bio", value: "Aisha works with partners and community leaders to make programmes more responsive and effective." },
  { page: "about", section: "team:person-two", field: "name", value: "Nadia Diallo" },
  { page: "about", section: "team:person-two", field: "role", value: "Learning & Skills Lead" },
  { page: "about", section: "team:person-two", field: "bio", value: "Nadia supports women’s practical skill-building and the confidence to realise new opportunities." },
  { page: "programmes", section: "page", field: "title", value: "Programmes" },
  { page: "programmes", section: "page", field: "description", value: "Support that helps women strengthen skills, livelihoods, health, and leadership across their communities." },
  { page: "programmes", section: "section:overview", field: "eyebrow", value: "How we work" },
  { page: "programmes", section: "section:overview", field: "title", value: "Responsive, practical support" },
  { page: "programmes", section: "section:overview", field: "body", value: "Each programme is shaped around local needs, partnership opportunities, and the realities women face in everyday life. We focus on support that is useful, sustainable, and rooted in community trust." },
  { page: "programmes", section: "planned-events", field: "eyebrow", value: "Coming up" },
  { page: "programmes", section: "planned-events", field: "title", value: "Planned events" },
  { page: "programmes", section: "planned-events", field: "description", value: "Browse upcoming programme events, including dates, times, locations, and participation details." },
  { page: "programmes", section: "planned-event:sample", field: "title", value: "SAMPLE — Replace with a confirmed planned event" },
  { page: "programmes", section: "planned-event:sample", field: "date", value: "2027-01-15" },
  { page: "programmes", section: "planned-event:sample", field: "time", value: "Add confirmed start and end time" },
  { page: "programmes", section: "planned-event:sample", field: "location", value: "Add confirmed venue or online access details" },
  { page: "programmes", section: "planned-event:sample", field: "details", value: "Sample only. Replace with the confirmed event purpose, audience, agenda, accessibility information, and any preparation participants need. Keep this event as a draft until details are verified." },
  { page: "programmes", section: "planned-event:sample", field: "status", value: "draft" },
  { page: "programmes", section: "planned-event:sample", field: "order", value: "1" },
  { page: "impact", section: "page", field: "title", value: "Impact" },
  { page: "impact", section: "page", field: "description", value: "Impact is measured through meaningful progress in women’s opportunity, wellbeing, and connectedness." },
  { page: "impact", section: "impact", field: "eyebrow", value: "Impact" },
  { page: "impact", section: "impact", field: "title", value: "Progress rooted in community needs" },
  { page: "impact", section: "impact", field: "description", value: "Our work strengthens local capacity, peer support, and practical opportunity for women and their families." },
  { page: "impact", section: "completed-events", field: "eyebrow", value: "What we have done" },
  { page: "impact", section: "completed-events", field: "title", value: "Completed events" },
  { page: "impact", section: "completed-events", field: "description", value: "Read about completed activities and confirmed outcomes. Add a YouTube video or event photos where available." },
  { page: "impact", section: "impact-event:sample", field: "title", value: "SAMPLE — Replace with a completed event" },
  { page: "impact", section: "impact-event:sample", field: "date", value: "2025-01-15" },
  { page: "impact", section: "impact-event:sample", field: "location", value: "Add confirmed venue or community location" },
  { page: "impact", section: "impact-event:sample", field: "details", value: "Sample only. Replace with a factual summary of the activity and verified outcomes. Do not publish unverified participant counts, quotes, or claims." },
  { page: "impact", section: "impact-event:sample", field: "status", value: "draft" },
  { page: "impact", section: "impact-event:sample", field: "order", value: "1" },
  { page: "impact", section: "target:participants", field: "label", value: "Women reached" },
  { page: "impact", section: "target:participants", field: "value", value: "2,500" },
  { page: "impact", section: "target:participants", field: "description", value: "Women supported through skills, leadership, and livelihood programmes." },
  { page: "impact", section: "target:participants", field: "status", value: "target" },
  { page: "impact", section: "target:communities", field: "label", value: "Communities engaged" },
  { page: "impact", section: "target:communities", field: "value", value: "18" },
  { page: "impact", section: "target:communities", field: "description", value: "Local communities reached through outreach, partnerships, and programme delivery." },
  { page: "impact", section: "target:communities", field: "status", value: "target" },
  { page: "stories", section: "page", field: "title", value: "Stories" },
  { page: "stories", section: "page", field: "description", value: "Stories help us understand the everyday realities women face and the difference practical support can make." },
  { page: "stories", section: "section:stories", field: "eyebrow", value: "Voices" },
  { page: "stories", section: "section:stories", field: "title", value: "Real stories, real change" },
  { page: "stories", section: "section:stories", field: "body", value: "From learning and enterprise support to leadership and community participation, each story reflects the value of a trusted support network." },
  { page: "locations", section: "page", field: "title", value: "Locations" },
  { page: "locations", section: "page", field: "description", value: "We work alongside communities and partners across the regions where our programmes are rooted." },
  { page: "locations", section: "section:network", field: "eyebrow", value: "Regional reach" },
  { page: "locations", section: "section:network", field: "title", value: "Where we work" },
  { page: "locations", section: "section:network", field: "body", value: "Our regional presence helps us stay close to the realities of the communities we serve while strengthening local partnerships and programme relevance." },
  { page: "donate", section: "page", field: "title", value: "Donate" },
  { page: "donate", section: "page", field: "description", value: "Your support helps women access skills, opportunity, and the kind of community support that leads to lasting change." },
  { page: "donate", section: "section:donate", field: "eyebrow", value: "Give with purpose" },
  { page: "donate", section: "section:donate", field: "title", value: "Support women-led progress" },
  { page: "donate", section: "section:donate", field: "body", value: "Each donation helps fund programmes that build skills, improve economic resilience, and strengthen the systems women rely on to thrive." },
  { page: "site", section: "contact", field: "email", value: "hello@empoweringafricanwomen.org" },
  { page: "site", section: "contact", field: "phone", value: "+1 (555) 123-4567" },
  { page: "site", section: "contact", field: "address", value: "Empowering African Women\n123 Community Lane\nLondon, United Kingdom" },
  { page: "site", section: "social", field: "facebook", value: "https://facebook.com" },
  { page: "site", section: "social", field: "instagram", value: "https://instagram.com" },
  { page: "site", section: "social", field: "x", value: "https://x.com" },
  { page: "site", section: "social", field: "linkedin", value: "https://linkedin.com" },
  { page: "site", section: "social", field: "youtube", value: "https://youtube.com" },
  { page: "site", section: "footer", field: "email", value: "hello@empoweringafricanwomen.org" },
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
  {
    fileId: "/images/founder.png",
    fileName: "founder.png",
    mimeType: "image/png",
    mediaType: "IMAGE",
    altText: "Founder of the organisation smiling in a community setting",
    caption: "Leadership and community engagement",
  },
  {
    fileId: "/images/team.png",
    fileName: "team.png",
    mimeType: "image/png",
    mediaType: "IMAGE",
    altText: "The organisation's team",
    caption: "Meet our team",
  },
  {
    fileId: "/images/team.png",
    fileName: "team.png",
    mimeType: "image/png",
    mediaType: "IMAGE",
    altText: "Team members collaborating in a community space",
    caption: "Teamwork and community collaboration",
  },
  {
    fileId: "/images/aged-woman-with-gifts.jpg",
    fileName: "aged-woman-with-gifts.jpg",
    mimeType: "image/jpeg",
    mediaType: "IMAGE",
    altText: "Elderly woman receiving gifts in a community setting",
    caption: "Community support and care",
  },
  {
    fileId: "/images/amina-tailor.jpg",
    fileName: "amina-tailor.jpg",
    mimeType: "image/jpeg",
    mediaType: "IMAGE",
    altText: "Amina, a tailor, working on her sewing machine",
    caption: "Empowering women through skill development",
  },
  {
    fileId: "/images/blessing-vegetable-seller.jpg",
    fileName: "blessing-vegetable-seller.jpg",
    mimeType: "image/jpeg",
    mediaType: "IMAGE",
    altText: "Blessing, a vegetable seller, arranging her produce",
    caption: "Supporting women entrepreneurs in local markets",
  },
  {
    fileId: "/images/empowering-women-through-community-meals.png",
    fileName: "empowering-women-through-community-meals.png",
    mimeType: "image/png",
    mediaType: "IMAGE",
    altText: "Women participating in a community meal program",
    caption: "Fostering community engagement and support",
  },
  {
    fileId: "/images/grace-two-kids-rural.jpg",
    fileName: "grace-two-kids-rural.jpg",
    mimeType: "image/jpeg",
    mediaType: "IMAGE",
    altText: "A woman with her children in a rural setting",
    caption: "Family and community life",
  },
  {
    fileId: "/images/kid-with-books.jpg",
    fileName: "kid-with-books.jpg",
    mimeType: "image/jpeg",
    mediaType: "IMAGE",
    altText: "Child holding books in a learning environment",
    caption: "Learning and literacy",
  },
  {
    fileId: "/images/woman-in-local-market.jpg",
    fileName: "woman-in-local-market.jpg",
    mimeType: "image/jpeg",
    mediaType: "IMAGE",
    altText: "Woman working at a local market",
    caption: "Women-led local enterprise",
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
      update: {},
    });
  }

  const mediaAssets = await Promise.all(localFallbackMedia.map(upsertMediaAsset));
  const assetIdFor = (fileName: string) => {
    const asset = mediaAssets.find((candidate) => candidate.fileName === fileName);
    if (!asset) {
      throw new Error(`Seed media asset not found: ${fileName}`);
    }
    return asset.id;
  };

  const mediaAssignments = [
    { page: "home", section: "hero", field: "media", mediaAssetId: assetIdFor("woman-on-computer.jpg") },
    { page: "home", section: "programmes", field: "media", mediaAssetId: assetIdFor("woman-in-shop.jpg") },
    { page: "home", section: "stories", field: "media", mediaAssetId: assetIdFor("soil-with-plant.jpg") },
    { page: "home", section: "activity:learning", field: "media", mediaAssetId: assetIdFor("woman-on-computer.jpg") },
    { page: "home", section: "activity:enterprise", field: "media", mediaAssetId: assetIdFor("woman-in-shop.jpg") },
    { page: "home", section: "activity:community", field: "media", mediaAssetId: assetIdFor("empowering-women-through-community-meals.png") },
    { page: "home", section: "activity:skills", field: "media", mediaAssetId: assetIdFor("amina-tailor.jpg") },
    { page: "home", section: "activity:markets", field: "media", mediaAssetId: assetIdFor("woman-in-local-market.jpg") },
    { page: "home", section: "founder", field: "media", mediaAssetId: assetIdFor("founder.png") },
    { page: "about", section: "founder", field: "media", mediaAssetId: assetIdFor("founder.png") },
    { page: "home", section: "team", field: "media", mediaAssetId: assetIdFor("team.png") },
    { page: "about", section: "team", field: "media", mediaAssetId: assetIdFor("team.png") },
    { page: "programmes", section: "planned-event:sample", field: "media", mediaAssetId: assetIdFor("woman-in-shop.jpg") },
    { page: "impact", section: "impact-event:sample", field: "media", mediaAssetId: assetIdFor("soil-with-plant.jpg") },
    { page: "about", section: "section:story", field: "media", mediaAssetId: assetIdFor("Hopeful Artisan in Vibrant Headwrap.png") },
    { page: "stories", section: "section:stories", field: "media", mediaAssetId: assetIdFor("grace-two-kids-rural.jpg") },
    { page: "locations", section: "section:network", field: "media", mediaAssetId: assetIdFor("aged-woman-with-gifts.jpg") },
  ] as const;

  for (const assignment of mediaAssignments) {
    await prisma.siteContent.upsert({
      where: {
        page_region_section_field: {
          page: assignment.page,
          region: "global",
          section: assignment.section,
          field: assignment.field,
        },
      },
      create: {
        page: assignment.page,
        region: "global",
        section: assignment.section,
        field: assignment.field,
        mediaAssetId: assignment.mediaAssetId,
      },
      update: {},
    });
  }
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
