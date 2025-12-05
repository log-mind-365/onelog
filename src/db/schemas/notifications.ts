import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgPolicy,
  pgTable,
  serial,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authenticatedRole, authUsers } from "drizzle-orm/supabase";

export const notificationTypes = pgEnum("notification_types", [
  "like",
  "comment",
  "follow",
  "system",
]);

export const notifications = pgTable(
  "notifications",
  {
    id: serial().primaryKey(),
    receiverId: uuid("receiver_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    senderId: uuid("sender_id").references(() => authUsers.id, {
      onDelete: "cascade",
    }),
    type: notificationTypes().notNull(),
    metadata: jsonb("metadata").notNull(),
    isRead: boolean("is_read").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    index("notifications_receiver_id_idx").on(t.receiverId),
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
