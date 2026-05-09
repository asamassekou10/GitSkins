-- CreateTable
CREATE TABLE "PortfolioBuild" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "username" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "template" TEXT NOT NULL,
  "goal" TEXT NOT NULL,
  "tone" TEXT NOT NULL,
  "html" TEXT NOT NULL,
  "css" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "PortfolioBuild_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PortfolioBuild_userId_createdAt_idx" ON "PortfolioBuild"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PortfolioBuild_userId_username_idx" ON "PortfolioBuild"("userId", "username");

-- AddForeignKey
ALTER TABLE "PortfolioBuild" ADD CONSTRAINT "PortfolioBuild_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
