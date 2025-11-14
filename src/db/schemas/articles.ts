import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgPolicy,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authenticatedRole, authUsers } from "drizzle-orm/supabase";

export const accessTypes = pgEnum("access_types", ["public", "private"]);

export const articles = pgTable(
  "articles",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id),
    title: text("title").notNull(),
    content: text("content").notNull(),
    emotionLevel: integer("emotion_level").notNull(),
    accessType: accessTypes("access_type").default("public").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    pgPolicy("anyone can select public articles", {
      for: "select",
      to: "public",
      using: sql`access_type = 'public'`,
    }),
    pgPolicy("authenticated can select own articles", {
      for: "select",
      to: authenticatedRole,
      using: sql`user_id = auth.uid()`,
    }),
    pgPolicy("authenticated can insert articles", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`user_id = auth.uid()`,
    }),
    pgPolicy("authenticated can update own articles", {
      for: "update",
      to: authenticatedRole,
      using: sql`user_id = auth.uid()`,
      withCheck: sql`user_id = auth.uid()`,
    }),
    pgPolicy("authenticated can delete own articles", {
      for: "delete",
      to: authenticatedRole,
      using: sql`user_id = auth.uid()`,
    }),
    // Performance indexes
    index("idx_articles_user_id").on(t.userId),
    index("idx_articles_created_at").on(t.createdAt.desc()),
    index("idx_articles_access_type_created_at").on(
      t.accessType,
      t.createdAt.desc(),
    ),
  ],
);
