import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgPolicy,
  pgTable,
  serial,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authenticatedRole, authUsers } from "drizzle-orm/supabase";
import { articles } from "@/db/schemas/articles";

export const notificationTypes = pgEnum("notification_types", [
  "like",
  "comment",
  "follow",
]);

export const notifications = pgTable(
  "notifications",
  {
    id: serial().primaryKey(),
    receiverId: uuid("receiver_id")
      .notNull()
      .references(() => authUsers.id),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => authUsers.id),
    type: notificationTypes().notNull(),
    articleId: integer("article_id").references(() => articles.id, {
      onDelete: "cascade",
    }),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    pgPolicy("authenticated can select own notifications", {
      for: "select",
      to: authenticatedRole,
      using: sql`receiver_id = auth.uid()`,
    }),
    pgPolicy("authenticated can insert notification", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`sender_id = auth.uid()`,
    }),
    pgPolicy("authenticated can update own notifications", {
      for: "update",
      to: authenticatedRole,
      using: sql`receiver_id = auth.uid()`,
      withCheck: sql`receiver_id = auth.uid()`,
    }),
    pgPolicy("authenticated can delete own notifications", {
      for: "delete",
      to: authenticatedRole,
      using: sql`receiver_id = auth.uid()`,
    }),
  ],
);
