ALTER TABLE "dev-schema"."user" ALTER COLUMN "role" SET DEFAULT 'USER';--> statement-breakpoint
ALTER TABLE "dev-schema"."user" ADD COLUMN "hashed_password" varchar(255);