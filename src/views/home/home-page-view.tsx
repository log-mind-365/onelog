import { PageContainer } from "@/shared/components/page-container";
import { TransitionContainer } from "@/shared/components/transition-container";
import { InfiniteArticleList } from "@/widgets/card/infinite-article-list";
import { FakeForm } from "@/widgets/form/fake-form.ui";

export const HomePageView = () => {
  return (
    <PageContainer
      title="안녕하세요."
      description="오늘 사람들이 기록한 문장을 확인하세요."
    >
      <TransitionContainer.SlideIn type="spring">
        <FakeForm />
      </TransitionContainer.SlideIn>
      <InfiniteArticleList />
    </PageContainer>
  );
};
