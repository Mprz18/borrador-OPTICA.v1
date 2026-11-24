import { pgTable, uuid, decimal, boolean, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const prescriptions = pgTable("prescriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  
  // Ojo Derecho (OD)
  sphereOd: decimal("sphere_od", { precision: 4, scale: 2 }), 
  cylinderOd: decimal("cylinder_od", { precision: 4, scale: 2 }),
  axisOd: decimal("axis_od", { precision: 3, scale: 0 }),
  
  // Ojo Izquierdo (OI)
  sphereOi: decimal("sphere_oi", { precision: 4, scale: 2 }), 
  cylinderOi: decimal("cylinder_oi", { precision: 4, scale: 2 }),
  axisOi: decimal("axis_oi", { precision: 3, scale: 0 }),
  
  // Biometría (Calculada en el FaceTracker o ingresada manual)
  pupillaryDistance: decimal("pupillary_distance", { precision: 4, scale: 1 }), 
  
  // Flag legal: Determina si un Optometrista del ERP ya validó esta receta
  verifiedByDoctor: boolean("verified_by_doctor").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});