import { sql } from "drizzle-orm";
import {
  index,
  pgPolicy,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const userFollows = pgTable(
  "user_follows",
  {
    followerId: uuid("follower_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    followingId: uuid("following_id").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.followerId, t.followingId] }),
    pgPolicy("anyone can select user follows", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("authenticated can insert user follows", {
      for: "insert",
      to: "authenticated",
      withCheck: sql`follower_id = auth.uid()`,
    }),
    pgPolicy("authenticated can delete own user follows", {
      for: "delete",
      to: "authenticated",
      using: sql`follower_id = auth.uid()`,
    }),
    // Performance indexes for EXISTS subqueries
    index("idx_user_follows_follower_following").on(
      t.followerId,
      t.followingId,
    ),
    index("idx_user_follows_following").on(t.followingId),
  ],
);
