import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wishlistTable = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  year: integer("year"),
  series: text("series"),
  notes: text("notes"),
  dateAdded: timestamp("date_added", { withTimezone: true }).notNull().defaultNow(),
});

export const insertWishlistSchema = createInsertSchema(wishlistTable).omit({ id: true, dateAdded: true });
export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type WishlistItem = typeof wishlistTable.$inferSelect;
