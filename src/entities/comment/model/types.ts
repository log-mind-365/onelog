import type { comments } from "@/db/schema";
import type { UserInfo } from "@/entities/user/model/types";

export type Comment = typeof comments.$inferSelect;
export type CommentInsertSchema = typeof comments.$inferInsert;

export type CommentWithAuthor = Comment & {
  author: UserInfo | null;
};
