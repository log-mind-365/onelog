import { sql } from "drizzle-orm";
import {
  integer,
  pgPolicy,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authenticatedRole, authUsers } from "drizzle-orm/supabase";
import { articles } from "@/db/schemas/articles";

export const articleLikes = pgTable(
  "article_likes",
  {
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.articleId, table.userId] }),
    pgPolicy("anyone can select article likes", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("authenticated can insert article likes", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`user_id = auth.uid()`,
    }),
    pgPolicy("authenticated can delete own article likes", {
      for: "delete",
      to: authenticatedRole,
      using: sql`user_id = auth.uid()`,
    }),
  ],
);
