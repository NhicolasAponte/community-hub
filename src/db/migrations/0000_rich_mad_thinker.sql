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
