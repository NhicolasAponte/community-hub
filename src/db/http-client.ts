import { drizzle as drizzleHTTP } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
// import the following to query over WebSockets
// import { drizzle as drizzleWebSocket } from "drizzle-orm/neon-serverless";
// import { Pool } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!); // connect to neon database
export const db = drizzleHTTP(sql, { schema, logger: true });
export type DB = typeof db;

// Export tables for easier imports
export {
  dbSchema,
  vendorTable,
  eventTable,
  newsletterTable,
  subscriberTable,
  emailQueueTable,
} from "./schema";

// use neon driver over WebSockets
// use if backend uses sessions/interactive transactions with multiple queries per connection
// const pool = new Pool({ connectionString: process.env.DATABASE_URL! }) // create a pool of connections to the database
// const db = drizzleWebSocket(pool); // create a drizzle instance using the pool of connections
