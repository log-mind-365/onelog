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
    id: uuid("id")
      .primaryKey()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    userName: text("user_name").notNull(),
    avatarUrl: text("avatar_url"),
    aboutMe: text("about_me"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
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
