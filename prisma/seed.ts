import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const initialPageLabels = [
  { page: "home", section: "hero", field: "title", value: "Empowering the African Woman" },
  { page: "home", section: "about", field: "title", value: "Our mission" },
  { page: "home", section: "pillars", field: "title", value: "Programme pillars" },
  { page: "home", section: "programmes", field: "title", value: "Programmes" },
  { page: "home", section: "stories", field: "title", value: "Stories" },
  { page: "about", section: "page", field: "title", value: "About" },
  { page: "programmes", section: "page", field: "title", value: "Programmes" },
  { page: "impact", section: "page", field: "title", value: "Impact" },
  { page: "stories", section: "page", field: "title", value: "Stories" },
  { page: "locations", section: "page", field: "title", value: "Locations" },
  { page: "donate", section: "page", field: "title", value: "Donate" },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD before seeding the admin account, for example: ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=change-me",
    );
  }

  for (const entry of initialPageLabels) {
    await prisma.siteContent.upsert({
      where: {
        page_region_section_field: {
          page: entry.page,
          region: "global",
          section: entry.section,
          field: entry.field,
        },
      },
      create: { ...entry, region: "global" },
      update: {},
    });
  }

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

  console.log("Seeded initial CMS page labels and admin account without replacing existing content.");
}

main()
  .catch((error) => {
    console.error("Database seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
