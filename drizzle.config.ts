// import * as dotenv from "dotenv";
import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// dotenv.config();
// TODO: create dev and prod schema 
export default defineConfig({
    dialect: "postgresql",
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",// + new Date().toISOString().replace(/:/g, "-"),
    dbCredentials: {
        url: process.env.DATABASE_URL as string,
    },
    verbose: true,
    strict: true,
})