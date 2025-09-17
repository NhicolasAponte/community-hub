import {
  text,
  uuid,
  varchar,
  boolean,
  timestamp,
  integer,
  pgSchema,
} from "drizzle-orm/pg-core";
import { UserRoles } from "@/lib/data-model/enum-types";

export const dbSchema = pgSchema("dev-schema");

export const vendorTable = dbSchema.table("vendor", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 255 }),
  address: varchar("address", { length: 255 }),
  services: varchar("services", { length: 255 }),
  links: varchar("links", { length: 255 }),
  // instagram: varchar("instagram", { length: 255 }),
  // twitter: varchar("twitter", { length: 255 }),
  // linkedin: varchar("linkedin", { length: 255 }),
  // facebook: varchar("facebook", { length: 255 }),
});

export const eventTable = dbSchema.table("event", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name").notNull(),
  description: varchar("description", { length: 255 }).notNull(),
  date: varchar("date", { length: 255 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  // badges: varchar("tags", { length: 255 }),
  // badges let you add a badge like "pride", "holiday", "alcohol-free", etc.
});

export const newsletterTable = dbSchema.table("newsletter", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  date: varchar("date", { length: 255 }).notNull(),
});

export const subscriberTable = dbSchema.table("subscriber", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  subscribed: boolean("subscribed").default(true).notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  unsubscribeToken: varchar("unsubscribe_token", { length: 255 }).notNull(),
});

export const emailQueueTable = dbSchema.table("email_queue", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  newsletterId: uuid("newsletter_id")
    .references(() => newsletterTable.id)
    .notNull(),
  recipientEmail: varchar("recipient_email", { length: 255 }).notNull(),
  recipientName: varchar("recipient_name", { length: 255 }),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, sent, failed
  scheduledFor: timestamp("scheduled_for").defaultNow().notNull(),
  sentAt: timestamp("sent_at"),
  attempts: integer("attempts").default(0).notNull(),
  errorMessage: varchar("error_message", { length: 500 }),
  batchNumber: integer("batch_number").notNull(), // Which day/batch this email belongs to
});

// Auth.js tables (for future use or if switching from JWT to database sessions)
export const usersTable = dbSchema.table("user", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: timestamp("emailVerified"),
  image: varchar("image", { length: 255 }),
  hashedPassword: varchar("hashed_password", { length: 255 }), // For credentials login
  role: varchar("role", { length: 50 }).default(UserRoles.USER).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accountsTable = dbSchema.table("account", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
});

// Optional: Database sessions (only needed if not using JWT)
export const sessionsTable = dbSchema.table("session", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().unique(),
  userId: uuid("userId")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  expires: timestamp("expires").notNull(),
});

// Optional: Email verification tokens (for magic link auth)
export const verificationTokensTable = dbSchema.table("verificationToken", {
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull(),
  expires: timestamp("expires").notNull(),
});

// Create composite indexes for better performance
export const accountsIndex = accountsTable;
export const sessionsIndex = sessionsTable;
export const verificationTokensIndex = verificationTokensTable;
