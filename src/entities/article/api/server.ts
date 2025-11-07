"use server";

import { and, count, desc, eq, getTableColumns, gt, sql } from "drizzle-orm";
import { db } from "@/db";
import { articleLikes, articles, comments, userInfo } from "@/db/schema";
import { PAGE_LIMIT } from "@/entities/article/model/constants";
import type {
  Article,
  ArticleInsertSchema,
  ArticleWithAuthorInfo,
  InfiniteArticleList,
} from "@/entities/article/model/types";

export const getInfinitePublicArticleList = async (
  pageParam?: string,
  userId?: string | null,
): Promise<InfiniteArticleList> => {
  const result = await db
    .select({
      ...getTableColumns(articles),
      author: userInfo,
      likeCount: count(articleLikes.id).as("likeCount"),
      commentCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM ${comments}
        WHERE ${comments.articleId} = ${articles.id}
      )`,
      isLiked: userId
        ? sql<boolean>`EXISTS(
            SELECT 1 FROM ${articleLikes}
            WHERE ${articleLikes.articleId} = ${articles.id}
            AND ${articleLikes.userId} = ${userId}
          )`
        : sql<boolean>`false`,
    })
    .from(articles)
    .leftJoin(userInfo, eq(articles.userId, userInfo.id))
    .leftJoin(articleLikes, eq(articles.id, articleLikes.articleId))
    .where(pageParam ? gt(articles.id, pageParam) : undefined)
    .groupBy(articles.id, userInfo.id)
    .limit(PAGE_LIMIT)
    .orderBy(desc(articles.createdAt))
    .then((rows) =>
      rows.map((row) => ({
        ...row,
        author: row.author?.id ? row.author : null,
        likeCount: Number(row.likeCount) || 0,
        commentCount: Number(row.commentCount) || 0,
      })),
    );

  const nextId =
    result.length === PAGE_LIMIT ? result[PAGE_LIMIT - 1].id : undefined;
  const previousId = result.length > 0 ? result[0].id : undefined;

  return {
    nextId,
    previousId,
    data: result,
  };
};

export const getArticleDetail = async (
  id: string,
  userId?: string | null,
): Promise<ArticleWithAuthorInfo> => {
  return db
    .select({
      ...getTableColumns(articles),
      author: userInfo,
      likeCount: count(articleLikes.id).as("likeCount"),
      commentCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM ${comments}
        WHERE ${comments.articleId} = ${articles.id}
      )`,
      isLiked: userId
        ? sql<boolean>`EXISTS(
            SELECT 1 FROM ${articleLikes}
            WHERE ${articleLikes.articleId} = ${articles.id}
            AND ${articleLikes.userId} = ${userId}
          )`
        : sql<boolean>`false`,
    })
    .from(articles)
    .where(eq(articles.id, id))
    .leftJoin(userInfo, eq(articles.userId, userInfo.id))
    .leftJoin(articleLikes, eq(articles.id, articleLikes.articleId))
    .groupBy(articles.id, userInfo.id)
    .then((rows) => {
      const [row] = rows;
      return {
        ...row,
        author: row.author?.id ? row.author : null,
        likeCount: Number(row.likeCount) || 0,
        commentCount: Number(row.commentCount) || 0,
      };
    });
};

export const postArticle = async (
  params: ArticleInsertSchema,
): Promise<Article> => {
  return db
    .insert(articles)
    .values(params)
    .returning()
    .then((rows) => rows[0]);
};

export const deleteArticle = async (id: string) => {
  return db.delete(articles).where(eq(articles.id, id));
};

// 좋아요 관련 함수들
export const toggleArticleLike = async (
  articleId: string,
  userId: string,
): Promise<{ isLiked: boolean; likeCount: number }> => {
  // 현재 좋아요 상태 확인
  const existingLike = await db
    .select()
    .from(articleLikes)
    .where(
      and(
        eq(articleLikes.articleId, articleId),
        eq(articleLikes.userId, userId),
      ),
    )
    .then((rows) => rows[0]);

  if (existingLike) {
    // 좋아요 취소
    await db
      .delete(articleLikes)
      .where(
        and(
          eq(articleLikes.articleId, articleId),
          eq(articleLikes.userId, userId),
        ),
      );
  } else {
    // 좋아요 추가
    await db.insert(articleLikes).values({
      articleId,
      userId,
    });
  }

  // 좋아요 개수 조회
  const likeCount = await getArticleLikeCount(articleId);

  return {
    isLiked: !existingLike,
    likeCount,
  };
};

export const getArticleLikeCount = async (
  articleId: string,
): Promise<number> => {
  const result = await db
    .select({ count: count() })
    .from(articleLikes)
    .where(eq(articleLikes.articleId, articleId))
    .then((rows) => rows[0]);

  return result?.count ?? 0;
};

export const checkUserLiked = async (
  articleId: string,
  userId: string | null,
): Promise<boolean> => {
  if (!userId) return false;

  const result = await db
    .select()
    .from(articleLikes)
    .where(
      and(
        eq(articleLikes.articleId, articleId),
        eq(articleLikes.userId, userId),
      ),
    )
    .then((rows) => rows[0]);

  return !!result;
};
