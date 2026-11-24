import { pgTable, uuid, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { products } from "./products";

export const inventory = pgTable("inventory", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id").references(() => products.id).notNull(),
  // Sucursal (ej: 'BODEGA_CENTRAL', 'CLINICA_POLANCO', 'LABORATORIO')
  branchId: varchar("branch_id", { length: 100 }).notNull(), 
  quantity: integer("quantity").notNull().default(0),
  lastUpdated: timestamp("last_updated").defaultNow().notNull(),
});