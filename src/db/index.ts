export * from "./schema";
export * from "./http-client";

// Export specific tables for easier imports
export {
  db,
  dbSchema,
  vendorTable,
  eventTable,
  newsletterTable,
  subscriberTable,
  emailQueueTable,
  // Auth tables
  usersTable,
  accountsTable,
  sessionsTable,
  verificationTokensTable,
} from "./http-client";
export type { DB } from "./http-client";
