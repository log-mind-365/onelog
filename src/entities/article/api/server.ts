"use server";

import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  lt,
  or,
  sql,
} from "drizzle-orm";
import { db } from "@/db";
import { articleLikes } from "@/db/schemas/article-likes";
import { articles } from "@/db/schemas/articles";
import { comments } from "@/db/schemas/comments";
import { profiles } from "@/db/schemas/profiles";
import { reports } from "@/db/schemas/reports";
import { userFollows } from "@/db/schemas/user-follows";
import { ARTICLE_PAGE_LIMIT } from "@/entities/article/model/constants";
import type {
  Article,
  ArticleWithAuthorInfo,
  InfiniteArticleList,
} from "@/entities/article/model/types";
import { articleFormSchema } from "@/features/write-article/model/schemas";
import type { ArticleInsertSchema } from "@/features/write-article/model/types";
import { getUserIdFromProxy } from "@/shared/lib/helpers/server-helper";

export const getInfinitePrivateArticleList = async (
  pageParam: number,
  currentUserId: string | null,
) => {
  const result = await db
    .select({
      ...getTableColumns(articles),
      author: profiles,
      likeCount: count(articleLikes.articleId).as("likeCount"),
      commentCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM ${comments}
        WHERE ${comments.articleId} = ${articles.id}
      )`,
      isLiked: currentUserId
        ? sql<boolean>`
            EXISTS(
                SELECT 1 FROM ${articleLikes}
                WHERE ${articleLikes.articleId} = ${articles.id}
                AND ${articleLikes.userId} = ${currentUserId}
            )`
        : sql<boolean>`false`,
      isFollowing: currentUserId
        ? sql<boolean>`
            EXISTS(
                SELECT 1 FROM ${userFollows}
                WHERE ${userFollows.followerId} = ${currentUserId}
                AND ${userFollows.followingId} = ${articles.userId}
            )`
        : sql<boolean>`false`,
    })
    .from(articles)
    .leftJoin(profiles, eq(articles.userId, profiles.id))
    .leftJoin(articleLikes, eq(articles.id, articleLikes.articleId))
    .where(
      and(
        pageParam ? lt(articles.id, pageParam) : undefined,
        or(
          eq(articles.accessType, "public"),
          currentUserId ? eq(articles.userId, currentUserId) : undefined,
        ),
      ),
    )
    .groupBy(articles.id, profiles.id)
    .limit(ARTICLE_PAGE_LIMIT)
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
    result.length === ARTICLE_PAGE_LIMIT
      ? result[ARTICLE_PAGE_LIMIT - 1].id
      : undefined;
  const previousId = result.length > 0 ? result[0].id : undefined;

  return {
    nextId,
    previousId,
    data: result,
  };
};

export const getInfinitePublicArticleList = async (
  pageParam: number | undefined,
  currentUserId: string | null,
): Promise<InfiniteArticleList> => {
  // Optimize: Skip expensive subqueries for non-authenticated users
  const result = await db
    .select({
      ...getTableColumns(articles),
      author: profiles,
      likeCount: count(articleLikes.articleId).as("likeCount"),
      commentCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM ${comments}
        WHERE ${comments.articleId} = ${articles.id}
      )`,
      isLiked: currentUserId
        ? sql<boolean>`
            EXISTS(
                SELECT 1 FROM ${articleLikes}
                WHERE ${articleLikes.articleId} = ${articles.id}
                AND ${articleLikes.userId} = ${currentUserId}
            )`
        : sql<boolean>`false`,
      isFollowing: currentUserId
        ? sql<boolean>`
            EXISTS(
                SELECT 1 FROM ${userFollows}
                WHERE ${userFollows.followerId} = ${currentUserId}
                AND ${userFollows.followingId} = ${articles.userId}
            )`
        : sql<boolean>`false`,
    })
    .from(articles)
    .leftJoin(profiles, eq(articles.userId, profiles.id))
    .leftJoin(articleLikes, eq(articles.id, articleLikes.articleId))
    .where(
      and(
        pageParam ? lt(articles.id, pageParam) : undefined,
        eq(articles.accessType, "public"),
      ),
    )
    .groupBy(articles.id, profiles.id)
    .limit(ARTICLE_PAGE_LIMIT)
    .orderBy(desc(articles.createdAt), desc(articles.id))
    .then((rows) =>
      rows.map((row) => ({
        ...row,
        author: row.author?.id ? row.author : null,
        likeCount: Number(row.likeCount) || 0,
        commentCount: Number(row.commentCount) || 0,
      })),
    );

  const nextId =
    result.length === ARTICLE_PAGE_LIMIT
      ? result[ARTICLE_PAGE_LIMIT - 1].id
      : undefined;
  const previousId = result.length > 0 ? result[0].id : undefined;

  return {
    nextId,
    previousId,
    data: result,
  };
};

export const getArticleDetail = async (
  id: number,
  currentUserId?: string | null,
): Promise<ArticleWithAuthorInfo> => {
  const result = await db
    .select({
      ...getTableColumns(articles),
      author: profiles,
      likeCount: count(articleLikes.articleId).as("likeCount"),
      commentCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM ${comments}
        WHERE ${comments.articleId} = ${articles.id}
      )`,
      isLiked: currentUserId
        ? sql<boolean>`EXISTS(
            SELECT 1 FROM ${articleLikes}
            WHERE ${articleLikes.articleId} = ${articles.id}
            AND ${articleLikes.userId} = ${currentUserId}
          )`
        : sql<boolean>`false`,
      isFollowing: currentUserId
        ? sql<boolean>`
            EXISTS(
                SELECT 1 FROM ${userFollows}
                WHERE ${userFollows.followerId} = ${currentUserId}
                AND ${userFollows.followingId} = ${articles.userId}
            )`
        : sql<boolean>`false`,
    })
    .from(articles)
    .where(
      and(
        eq(articles.id, id),
        // public이거나 자신의 게시물만 조회
        or(
          eq(articles.accessType, "public"),
          currentUserId ? eq(articles.userId, currentUserId) : undefined,
        ),
      ),
    )
    .leftJoin(profiles, eq(articles.userId, profiles.id))
    .leftJoin(articleLikes, eq(articles.id, articleLikes.articleId))
    .groupBy(articles.id, profiles.id)
    .then((rows) => {
      const [row] = rows;
      return {
        ...row,
        author: row.author?.id ? row.author : null,
        likeCount: Number(row.likeCount) || 0,
        commentCount: Number(row.commentCount) || 0,
      };
    });

  return result;
};

export const postArticle = async (
  params: ArticleInsertSchema,
): Promise<Article> => {
  const userId = await getUserIdFromProxy();
  const parsed = articleFormSchema.safeParse(params);

  if (!parsed.success) {
    throw new Error("제목이나 내용이 비어있습니다.");
  }

  if (!userId) {
    throw new Error("로그인이 필요합니다.");
  }

  return db
    .insert(articles)
    .values({ ...parsed.data, userId })
    .returning()
    .then((rows) => rows[0]);
};

export const updateArticle = async (
  id: number,
  params: Partial<ArticleInsertSchema>,
): Promise<Article> => {
  const userId = await getUserIdFromProxy();
  const parsed = articleFormSchema.safeParse(params);

  if (parsed.error) {
    throw new Error(parsed.error.message);
  }

  return db
    .update(articles)
    .set({ ...params, updatedAt: new Date() })
    .where(eq(articles.id, id))
    .returning()
    .then((rows) => rows[0]);
};

export const deleteArticle = async (id: number) => {
  return db.delete(articles).where(eq(articles.id, id));
};

// 좋아요 관련 함수들
export const toggleArticleLike = async (
  articleId: number,
  currentUserId: string,
): Promise<{ isLiked: boolean; likeCount: number }> => {
  // 현재 좋아요 상태 확인
  const existingLike = await db
    .select()
    .from(articleLikes)
    .where(
      and(
        eq(articleLikes.articleId, articleId),
        eq(articleLikes.userId, currentUserId),
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
          eq(articleLikes.userId, currentUserId),
        ),
      );
  } else {
    // 좋아요 추가
    await db.insert(articleLikes).values({
      articleId,
      userId: currentUserId,
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
  articleId: number,
): Promise<number> => {
  const result = await db
    .select({ count: count() })
    .from(articleLikes)
    .where(eq(articleLikes.articleId, articleId))
    .then((rows) => rows[0]);

  return result?.count ?? 0;
};

export const checkUserLiked = async (
  articleId: number,
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

// 신고 관련 함수들
export const reportArticle = async (params: {
  articleId: number;
  reporterId: string;
  reportType: "spam" | "inappropriate" | "harassment" | "other";
  reason?: string;
}): Promise<void> => {
  // 이미 신고했는지 확인
  const existingReport = await db
    .select()
    .from(reports)
    .where(
      and(
        eq(reports.articleId, params.articleId),
        eq(reports.reporterId, params.reporterId),
      ),
    )
    .then((rows) => rows[0]);

  if (existingReport) {
    throw new Error("이미 신고한 게시물입니다.");
  }

  // 신고 추가
  await db.insert(reports).values({
    articleId: params.articleId,
    reporterId: params.reporterId,
    reportType: params.reportType,
    reason: params.reason,
  });
};

// 감정 통계 관련 함수들
export type EmotionActivity = {
  date: string;
  emotionLevel: number;
  count: number;
};

export const getUserEmotionActivity = async (
  userId: string,
): Promise<EmotionActivity[]> => {
  // 최근 1년간의 데이터
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const result = await db
    .select({
      date: sql<string>`DATE(${articles.createdAt})`,
      emotionLevel: sql<number>`AVG(${articles.emotionLevel})::int`,
      count: count(articles.id),
    })
    .from(articles)
    .where(
      and(
        eq(articles.userId, userId),
        sql`${articles.createdAt} >= ${oneYearAgo.toISOString()}`,
      ),
    )
    .groupBy(sql`DATE(${articles.createdAt})`)
    .orderBy(sql`DATE(${articles.createdAt})`);

  return result.map((row) => ({
    date: row.date,
    emotionLevel: Number(row.emotionLevel),
    count: Number(row.count),
  }));
};

// 사용자별 아티클 목록 조회
export const getUserArticles = async (
  userId: string,
  pageParam: number | undefined,
  currentUserId: string | null,
  accessType?: "public" | "private",
): Promise<InfiniteArticleList> => {
  const result = await db
    .select({
      ...getTableColumns(articles),
      author: profiles,
      likeCount: count(articleLikes.articleId).as("likeCount"),
      commentCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM ${comments}
        WHERE ${comments.articleId} = ${articles.id}
      )`,
      isLiked: currentUserId
        ? sql<boolean>`
            EXISTS(
                SELECT 1 FROM ${articleLikes}
                WHERE ${articleLikes.articleId} = ${articles.id}
                AND ${articleLikes.userId} = ${currentUserId}
            )`
        : sql<boolean>`false`,
      isFollowing: currentUserId
        ? sql<boolean>`
            EXISTS(
                SELECT 1 FROM ${userFollows}
                WHERE ${userFollows.followerId} = ${currentUserId}
                AND ${userFollows.followingId} = ${articles.userId}
            )`
        : sql<boolean>`false`,
    })
    .from(articles)
    .leftJoin(profiles, eq(articles.userId, profiles.id))
    .leftJoin(articleLikes, eq(articles.id, articleLikes.articleId))
    .where(
      and(
        eq(articles.userId, userId),
        pageParam ? lt(articles.id, pageParam) : undefined,
        accessType ? eq(articles.accessType, accessType) : undefined,
      ),
    )
    .groupBy(articles.id, profiles.id)
    .limit(ARTICLE_PAGE_LIMIT)
    .orderBy(desc(articles.createdAt), desc(articles.id))
    .then((rows) =>
      rows.map((row) => ({
        ...row,
        author: row.author?.id ? row.author : null,
        likeCount: Number(row.likeCount) || 0,
        commentCount: Number(row.commentCount) || 0,
      })),
    );

  const nextId =
    result.length === ARTICLE_PAGE_LIMIT
      ? result[ARTICLE_PAGE_LIMIT - 1].id
      : undefined;
  const previousId = result.length > 0 ? result[0].id : undefined;

  return {
    nextId,
    previousId,
    data: result,
  };
};

// 좋아요한 게시글 목록 조회
export const getUserLikedArticles = async (
  userId: string,
  pageParam: number | undefined,
  currentUserId: string | null,
): Promise<InfiniteArticleList> => {
  const result = await db
    .select({
      ...getTableColumns(articles),
      author: profiles,
      likeCount: count(articleLikes.articleId).as("likeCount"),
      commentCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM ${comments}
        WHERE ${comments.articleId} = ${articles.id}
      )`,
      isLiked: sql<boolean>`true`,
      isFollowing: currentUserId
        ? sql<boolean>`
            EXISTS(
                SELECT 1 FROM ${userFollows}
                WHERE ${userFollows.followerId} = ${currentUserId}
                AND ${userFollows.followingId} = ${articles.userId}
            )`
        : sql<boolean>`false`,
    })
    .from(articleLikes)
    .innerJoin(articles, eq(articleLikes.articleId, articles.id))
    .leftJoin(profiles, eq(articles.userId, profiles.id))
    .where(
      and(
        eq(articleLikes.userId, userId),
        pageParam ? lt(articles.id, pageParam) : undefined,
        eq(articles.accessType, "public"),
      ),
    )
    .groupBy(articles.id, profiles.id)
    .limit(ARTICLE_PAGE_LIMIT)
    .orderBy(desc(articles.createdAt), desc(articles.id))
    .then((rows) =>
      rows.map((row) => ({
        ...row,
        author: row.author?.id ? row.author : null,
        likeCount: Number(row.likeCount) || 0,
        commentCount: Number(row.commentCount) || 0,
      })),
    );

  const nextId =
    result.length === ARTICLE_PAGE_LIMIT
      ? result[ARTICLE_PAGE_LIMIT - 1].id
      : undefined;
  const previousId = result.length > 0 ? result[0].id : undefined;

  return {
    nextId,
    previousId,
    data: result,
  };
};
