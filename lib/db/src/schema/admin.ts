import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const adminTable = pgTable("admin", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Admin = typeof adminTable.$inferSelect;
