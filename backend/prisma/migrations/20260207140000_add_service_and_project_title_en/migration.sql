-- Service EN columns
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "titleEn" TEXT;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "descriptionEn" TEXT;
ALTER TABLE "services" ADD COLUMN IF NOT EXISTS "shortDescriptionEn" TEXT;

-- Project titleEn
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "titleEn" TEXT;
