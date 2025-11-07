"use server";

import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { comments, userInfo } from "@/db/schema";
import type { CommentInsertSchema, CommentWithAuthor } from "@/entities/comment/model/types";

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
        id: userInfo.id,
        email: userInfo.email,
        userName: userInfo.userName,
        avatarUrl: userInfo.avatarUrl,
        aboutMe: userInfo.aboutMe,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
      },
    })
    .from(comments)
    .leftJoin(userInfo, eq(comments.userId, userInfo.id))
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
  const commentWithAuthor = await db
    .select({
      id: comments.id,
      articleId: comments.articleId,
      userId: comments.userId,
      content: comments.content,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
      author: {
        id: userInfo.id,
        email: userInfo.email,
        userName: userInfo.userName,
        avatarUrl: userInfo.avatarUrl,
        aboutMe: userInfo.aboutMe,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
      },
    })
    .from(comments)
    .leftJoin(userInfo, eq(comments.userId, userInfo.id))
    .where(eq(comments.id, comment.id))
    .then((rows) => rows[0]);

  return commentWithAuthor;
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

  // 수정된 댓글과 작성자 정보 반환
  const updatedComment = await db
    .select({
      id: comments.id,
      articleId: comments.articleId,
      userId: comments.userId,
      content: comments.content,
      createdAt: comments.createdAt,
      updatedAt: comments.updatedAt,
      author: {
        id: userInfo.id,
        email: userInfo.email,
        userName: userInfo.userName,
        avatarUrl: userInfo.avatarUrl,
        aboutMe: userInfo.aboutMe,
        createdAt: userInfo.createdAt,
        updatedAt: userInfo.updatedAt,
      },
    })
    .from(comments)
    .leftJoin(userInfo, eq(comments.userId, userInfo.id))
    .where(eq(comments.id, commentId))
    .then((rows) => rows[0]);

  return updatedComment;
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
