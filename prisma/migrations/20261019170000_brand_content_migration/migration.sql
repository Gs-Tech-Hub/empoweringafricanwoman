ALTER TABLE "CollectionItem"
    ADD COLUMN "mediaAssetId" TEXT,
    ADD COLUMN "sortOrder" INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN "region" TEXT NOT NULL DEFAULT 'global';

ALTER TABLE "Branch"
    ADD COLUMN "mediaAssetId" TEXT,
    ADD COLUMN "region" TEXT NOT NULL DEFAULT 'global';

ALTER TABLE "Review"
    ADD COLUMN "consentConfirmed" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "mediaAssetId" TEXT,
    ADD COLUMN "title" TEXT,
    ADD COLUMN "region" TEXT NOT NULL DEFAULT 'global',
    ALTER COLUMN "rating" DROP NOT NULL;

ALTER TABLE "CollectionItem"
    ADD CONSTRAINT "CollectionItem_mediaAssetId_fkey"
    FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Branch"
    ADD CONSTRAINT "Branch_mediaAssetId_fkey"
    FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Review"
    ADD CONSTRAINT "Review_mediaAssetId_fkey"
    FOREIGN KEY ("mediaAssetId") REFERENCES "MediaAsset"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CollectionItem"
    DROP CONSTRAINT "CollectionItem_categoryId_fkey",
    ADD CONSTRAINT "CollectionItem_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE INDEX "CollectionItem_mediaAssetId_idx" ON "CollectionItem"("mediaAssetId");
CREATE INDEX "Branch_mediaAssetId_idx" ON "Branch"("mediaAssetId");
CREATE INDEX "Review_mediaAssetId_idx" ON "Review"("mediaAssetId");
CREATE INDEX "CollectionItem_region_published_sortOrder_idx"
    ON "CollectionItem"("region", "published", "sortOrder");
CREATE INDEX "Branch_region_published_sortOrder_idx"
    ON "Branch"("region", "published", "sortOrder");
CREATE INDEX "Review_region_published_consentConfirmed_sortOrder_idx"
    ON "Review"("region", "published", "consentConfirmed", "sortOrder");

UPDATE "CollectionItem" SET "published" = false;
UPDATE "Branch" SET "published" = false;
UPDATE "Review" SET "published" = false;
