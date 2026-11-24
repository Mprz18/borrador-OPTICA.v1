import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Importación del esquema modular
import * as usersSchema from "./schema/users";
import * as productsSchema from "./schema/products";
import * as inventorySchema from "./schema/inventory";
import * as prescriptionsSchema from "./schema/prescriptions";

// Consolidamos todos los esquemas en un solo objeto para Drizzle
export const schema = {
  ...usersSchema,
  ...productsSchema,
  ...inventorySchema,
  ...prescriptionsSchema,
};

// La conexión espera la variable de entorno DATABASE_URL (definida en el docker-compose o .env)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// Exportamos los esquemas para que las apps (api-core) puedan usarlos para tipado e inserciones
export * from "./schema/users";
export * from "./schema/products";
export * from "./schema/inventory";
export * from "./schema/prescriptions";