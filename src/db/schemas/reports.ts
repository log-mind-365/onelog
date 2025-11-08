import { sql } from "drizzle-orm";
import {
  pgEnum,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authenticatedRole, authUsers } from "drizzle-orm/supabase";
import { articles } from "@/db/schemas/articles";

export const reportTypes = pgEnum("report_types", [
  "spam",
  "inappropriate",
  "harassment",
  "other",
]);

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    articleId: uuid("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    reporterId: uuid("reporter_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    reportType: reportTypes("report_type").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    pgPolicy("authenticated can select own reports", {
      for: "select",
      to: authenticatedRole,
      using: sql`reporter_id = auth.uid()`,
    }),
    pgPolicy("authenticated can insert reports", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`reporter_id = auth.uid()`,
    }),
  ],
);
