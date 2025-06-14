import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";


export const vendorTable = pgTable(
    "vendor", 
    {
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
})

export const eventTable = pgTable(
    "event", 
    {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name").notNull(),
    description: varchar("description", { length: 255 }).notNull(),
    date: varchar("date", { length: 255 }).notNull(),
    location: varchar("location", { length: 255 }).notNull(),
    }
)