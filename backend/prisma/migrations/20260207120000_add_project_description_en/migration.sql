-- AlterTable
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "descriptionEn" TEXT;
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "shortDescriptionEn" TEXT;
