import type { comments } from "@/db/schemas/comments";
import type { UserInfo } from "@/entities/user/model/types";

export type Comment = typeof comments.$inferSelect;
export type CommentInsertSchema = typeof comments.$inferInsert;

export type CommentWithAuthor = Comment & {
  author: UserInfo | null;
};
