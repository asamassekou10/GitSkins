-- AlterTable
ALTER TABLE "PortfolioBuild" ADD COLUMN "publishedSlug" TEXT;
ALTER TABLE "PortfolioBuild" ADD COLUMN "publishedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioBuild_publishedSlug_key" ON "PortfolioBuild"("publishedSlug");

-- CreateIndex
CREATE INDEX "PortfolioBuild_publishedSlug_idx" ON "PortfolioBuild"("publishedSlug");
