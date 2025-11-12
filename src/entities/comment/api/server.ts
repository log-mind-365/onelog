"use server";

import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { comments } from "@/db/schemas/comments";
import { profiles } from "@/db/schemas/profiles";
import type {
  CommentInsertSchema,
  CommentWithAuthor,
} from "@/entities/comment/model/types";

/**
 * 댓글 목록 조회 (작성자 정보 포함)
 */
export const getComments = async (
  articleId: string,
): Promise<CommentWithAuthor[]> => {
  return db
    .select({
      id: comments.id,
      articleId: comments.articleId,
      userId: comments.userId,
      content: comments.content,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
      author: {
        id: profiles.id,
        email: profiles.email,
        userName: profiles.userName,
        avatarUrl: profiles.avatarUrl,
        aboutMe: profiles.aboutMe,
        createdAt: profiles.createdAt,
        updatedAt: profiles.updatedAt,
      },
    })
    .from(comments)
    .leftJoin(profiles, eq(comments.userId, profiles.id))
    .where(eq(comments.articleId, articleId))
    .orderBy(desc(comments.createdAt));
};

/**
 * 댓글 개수 조회
 */
export const getCommentCount = async (articleId: string): Promise<number> => {
  const result = await db
    .select({ count: count() })
    .from(comments)
    .where(eq(comments.articleId, articleId))
    .then((rows) => rows[0]);

  return result?.count ?? 0;
};

/**
 * 댓글 작성
 */
export const postComment = async (
  data: CommentInsertSchema,
): Promise<CommentWithAuthor> => {
  const [comment] = await db.insert(comments).values(data).returning();

  // 작성자 정보와 함께 반환
  return await db
    .select({
      id: comments.id,
      articleId: comments.articleId,
      userId: comments.userId,
      content: comments.content,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
      author: {
        id: profiles.id,
        email: profiles.email,
        userName: profiles.userName,
        avatarUrl: profiles.avatarUrl,
        aboutMe: profiles.aboutMe,
        createdAt: profiles.createdAt,
        updatedAt: profiles.updatedAt,
      },
    })
    .from(comments)
    .leftJoin(profiles, eq(comments.userId, profiles.id))
    .where(eq(comments.id, comment.id))
    .then((rows) => rows[0]);
};

/**
 * 댓글 수정
 */
export const updateComment = async (
  commentId: string,
  content: string,
): Promise<CommentWithAuthor> => {
  await db
    .update(comments)
    .set({
      content,
      updatedAt: new Date(),
    })
    .where(eq(comments.id, commentId));

  return await db
    .select({
      id: comments.id,
      articleId: comments.articleId,
      userId: comments.userId,
      content: comments.content,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
      author: {
        id: profiles.id,
        email: profiles.email,
        userName: profiles.userName,
        avatarUrl: profiles.avatarUrl,
        aboutMe: profiles.aboutMe,
        createdAt: profiles.createdAt,
        updatedAt: profiles.updatedAt,
      },
    })
    .from(comments)
    .leftJoin(profiles, eq(comments.userId, profiles.id))
    .where(eq(comments.id, commentId))
    .then((rows) => rows[0]);
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (
  commentId: string,
  userId: string,
): Promise<void> => {
  await db
    .delete(comments)
    .where(and(eq(comments.id, commentId), eq(comments.userId, userId)));
};
