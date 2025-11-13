import type { profiles } from "@/db/schemas/profiles";

export type UserInfo = typeof profiles.$inferSelect;
export type UserInfoInsertSchema = typeof profiles.$inferInsert;
export type ProfileViewMode = "visitor" | "owner";
