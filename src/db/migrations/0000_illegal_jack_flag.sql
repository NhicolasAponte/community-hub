CREATE TABLE "event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar(255) NOT NULL,
	"date" varchar(255) NOT NULL,
	"location" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"date" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vendor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(255),
	"address" varchar(255),
	"services" varchar(255),
	"links" varchar(255)
);
