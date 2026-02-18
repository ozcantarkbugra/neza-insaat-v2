-- Use only isActive, remove isDeleted from all tables
-- ContactMessage: add isActive, migrate from isDeleted, drop isDeleted
ALTER TABLE "contact_messages" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
UPDATE "contact_messages" SET "isActive" = NOT COALESCE("isDeleted", false);
ALTER TABLE "contact_messages" DROP COLUMN IF EXISTS "isDeleted";

-- MediaFile: add isActive, migrate from isDeleted, drop isDeleted
ALTER TABLE "media_files" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
UPDATE "media_files" SET "isActive" = NOT COALESCE("isDeleted", false);
ALTER TABLE "media_files" DROP COLUMN IF EXISTS "isDeleted";

-- Users: migrate isDeleted to isActive, drop isDeleted (if column exists)
UPDATE "users" SET "isActive" = false WHERE "isDeleted" = true;
ALTER TABLE "users" DROP COLUMN IF EXISTS "isDeleted";

-- Roles: add isActive if missing, migrate from isDeleted, drop isDeleted
ALTER TABLE "roles" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
UPDATE "roles" SET "isActive" = false WHERE "isDeleted" = true;
ALTER TABLE "roles" DROP COLUMN IF EXISTS "isDeleted";

-- Projects, Services, Blogs, BlogCategories: migrate and drop
UPDATE "projects" SET "isActive" = false WHERE "isDeleted" = true;
ALTER TABLE "projects" DROP COLUMN IF EXISTS "isDeleted";

UPDATE "services" SET "isActive" = false WHERE "isDeleted" = true;
ALTER TABLE "services" DROP COLUMN IF EXISTS "isDeleted";

UPDATE "blogs" SET "isActive" = false WHERE "isDeleted" = true;
ALTER TABLE "blogs" DROP COLUMN IF EXISTS "isDeleted";

UPDATE "blog_categories" SET "isActive" = false WHERE "isDeleted" = true;
ALTER TABLE "blog_categories" DROP COLUMN IF EXISTS "isDeleted";
