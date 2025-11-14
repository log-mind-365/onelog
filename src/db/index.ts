import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  max: 10, // Maximum number of connections
  idle_timeout: 20, // Close idle connections after 20s
  connect_timeout: 10, // Timeout for new connections
  max_lifetime: 60 * 30, // Close connections after 30 minutes
});

export const db = drizzle(client);
