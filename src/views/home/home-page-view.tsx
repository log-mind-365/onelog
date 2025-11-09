"use client";

import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useModal } from "@/app/_providers/modal-store";
import { articleQueries } from "@/entities/article/api/queries";
import { useLikeArticle } from "@/features/article/lib/use-like-article";
import { useAuth } from "@/features/auth/model/store";
import { PageContainer } from "@/shared/components/page-container";
import { TransitionContainer } from "@/shared/components/transition-container";
import { InfiniteArticleList } from "@/widgets/card/infinite-article-list";
import { FakeForm } from "@/widgets/form/fake-form.ui";

export const HomePageView = () => {
  const { me } = useAuth();
  const { openModal } = useModal();
  const { mutate: likeArticle } = useLikeArticle();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(articleQueries.infinite(me?.id ?? null));

  const handleLike = (articleId: string, userId: string) => {
    likeArticle({ articleId, userId });
  };

  const handleReport =
    (articleId: string, reporterId: string) =>
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (!reporterId) {
        openModal("auth-guard");
      } else {
        openModal("report-article", {
          articleId,
          reporterId,
        });
      }
    };

  return (
    <PageContainer
      title="안녕하세요"
      description="오늘 사람들이 기록한 문장을 확인하세요."
      banner={
        <TransitionContainer.SlideIn type="spring" className="w-full">
          <FakeForm />
        </TransitionContainer.SlideIn>
      }
    >
      <InfiniteArticleList
        data={data}
        currentUserId={me?.id ?? null}
        onLike={handleLike}
        onReport={handleReport}
        onFetchNextPage={() => void fetchNextPage()}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </PageContainer>
  );
};
