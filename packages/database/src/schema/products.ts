import { pgTable, uuid, varchar, text, decimal, boolean, timestamp } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  basePrice: decimal("base_price", { precision: 10, scale: 2 }).notNull(),
  // Fundamental para separar catálogo de consumidor final vs. catálogo de mayoristas
  isB2bEligible: boolean("is_b2b_eligible").default(true).notNull(), 
  createdAt: timestamp("created_at").defaultNow().notNull(),
});