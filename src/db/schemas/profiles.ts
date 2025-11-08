import { sql } from "drizzle-orm";
import {
  foreignKey,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authenticatedRole, authUsers } from "drizzle-orm/supabase";

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").primaryKey().notNull(),
    email: text("email").notNull(),
    userName: text("user_name").notNull(),
    avatarUrl: text("avatar_url"),
    aboutMe: text("about_me"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.id],
      foreignColumns: [authUsers.id],
      name: "user_info_id_fk",
    }).onDelete("cascade"),
    pgPolicy("authenticated can select profiles", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("authenticated can insert own profiles", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`id = auth.uid()`,
    }),
    pgPolicy("authenticated can update own profiles", {
      for: "update",
      to: authenticatedRole,
      using: sql`id = auth.uid()`,
      withCheck: sql`id = auth.uid()`,
    }),
    pgPolicy("authenticated can delete own profiles", {
      for: "delete",
      to: authenticatedRole,
      using: sql`id = auth.uid()`,
    }),
  ],
);
