import { drizzle } from "drizzle-orm/postgres-js";
import { seed } from "drizzle-seed";
import postgres from "postgres";
import { articles } from "@/db/schemas/articles";
import { profiles } from "@/db/schemas/profiles";

const main = async () => {
  const client = postgres(process.env.DATABASE_URL!, { prepare: false });
  const db = drizzle(client);

  await seed(db, { userInfo: profiles, articles }).refine((f) => ({
    userInfo: {
      count: 10,
      columns: {
        id: f.uuid(),
      },
    },
    articles: {
      count: 100,
    },
  }));
};

main().catch((error) => {
  console.error("❌ Seeding failed:", error);
});
