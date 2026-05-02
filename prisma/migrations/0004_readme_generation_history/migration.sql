-- Store generated README versions for dashboard/history workflows.

CREATE TABLE "ReadmeGeneration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "goal" TEXT,
    "structure" TEXT,
    "tone" TEXT,
    "style" TEXT,
    "theme" TEXT,
    "score" INTEGER,
    "markdown" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReadmeGeneration_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ReadmeGeneration_userId_createdAt_idx" ON "ReadmeGeneration"("userId", "createdAt");

ALTER TABLE "ReadmeGeneration" ADD CONSTRAINT "ReadmeGeneration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
