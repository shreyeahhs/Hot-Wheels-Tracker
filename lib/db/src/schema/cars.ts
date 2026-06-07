import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const carsTable = pgTable("cars", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  year: integer("year").notNull(),
  series: text("series").notNull(),
  color: text("color").notNull(),
  imageUrl: text("image_url"),
  description: text("description"),
  rarity: text("rarity").notNull().default("Common"),
  dateAdded: timestamp("date_added", { withTimezone: true }).notNull().defaultNow(),
});

export const insertCarSchema = createInsertSchema(carsTable).omit({ id: true, dateAdded: true });
export type InsertCar = z.infer<typeof insertCarSchema>;
export type Car = typeof carsTable.$inferSelect;
