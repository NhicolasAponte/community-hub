CREATE SCHEMA IF NOT EXISTS "dev-schema";
--> statement-breakpoint
CREATE TABLE "dev-schema"."email_queue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"newsletter_id" uuid NOT NULL,
	"recipient_email" varchar(255) NOT NULL,
	"recipient_name" varchar(255),
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"scheduled_for" timestamp DEFAULT now() NOT NULL,
	"sent_at" timestamp,
	"attempts" integer DEFAULT 0 NOT NULL,
	"error_message" varchar(500),
	"batch_number" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dev-schema"."event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar(255) NOT NULL,
	"date" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dev-schema"."newsletter" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"date" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dev-schema"."subscriber" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"subscribed" boolean DEFAULT true NOT NULL,
	"subscribed_at" timestamp DEFAULT now() NOT NULL,
	"unsubscribe_token" varchar(255) NOT NULL,
	CONSTRAINT "subscriber_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "dev-schema"."vendor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(255),
	"address" varchar(255),
	"services" varchar(255),
	"links" varchar(255)
);
--> statement-breakpoint
ALTER TABLE "dev-schema"."email_queue" ADD CONSTRAINT "email_queue_newsletter_id_newsletter_id_fk" FOREIGN KEY ("newsletter_id") REFERENCES "dev-schema"."newsletter"("id") ON DELETE no action ON UPDATE no action;