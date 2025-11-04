"use server";

import { desc, eq, getTableColumns, gt } from "drizzle-orm";
import { db } from "@/db";
import { articles, userInfo } from "@/db/schema";
import { PAGE_LIMIT } from "@/entities/article/model/constants";
import type {
  Article,
  ArticleInsertSchema,
  ArticleWithAuthorInfo,
  InfiniteArticleList,
} from "@/entities/article/model/types";

export const getInfinitePublicArticleList = async (
  pageParam?: string,
): Promise<InfiniteArticleList> => {
  const result = await db
    .select({
      ...getTableColumns(articles),
      author: userInfo,
    })
    .from(articles)
    .leftJoin(userInfo, eq(articles.userId, userInfo.id))
    .where(pageParam ? gt(articles.id, pageParam) : undefined)
    .limit(PAGE_LIMIT)
    .orderBy(desc(articles.createdAt))
    .then((rows) =>
      rows.map((row) => ({
        ...row,
        author: row.author?.id ? row.author : null,
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
): Promise<ArticleWithAuthorInfo> => {
  return db
    .select({
      ...getTableColumns(articles),
      author: userInfo,
    })
    .from(articles)
    .where(eq(articles.id, id))
    .leftJoin(userInfo, eq(articles.userId, userInfo.id))
    .then((rows) => {
      const [row] = rows;
      return {
        ...row,
        author: row.author?.id ? row.author : null,
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
