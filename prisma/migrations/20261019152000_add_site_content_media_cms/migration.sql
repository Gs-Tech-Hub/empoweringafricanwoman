CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT');

CREATE TYPE "MediaStorageProvider" AS ENUM ('SUPABASE', 'GOOGLE_DRIVE');

CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL,
    "storageProvider" "MediaStorageProvider" NOT NULL,
    "altText" TEXT,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SiteContent" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'global',
    "section" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "value" TEXT,
    "mediaAssetId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MediaAsset_storageProvider_fileId_key"
    ON "MediaAsset"("storageProvider", "fileId");

CREATE INDEX "MediaAsset_mediaType_createdAt_idx"
    ON "MediaAsset"("mediaType", "createdAt");

CREATE UNIQUE INDEX "SiteContent_page_region_section_field_key"
    ON "SiteContent"("page", "region", "section", "field");

CREATE INDEX "SiteContent_page_region_idx"
    ON "SiteContent"("page", "region");

ALTER TABLE "SiteContent"
    ADD CONSTRAINT "SiteContent_mediaAssetId_fkey"
    FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
