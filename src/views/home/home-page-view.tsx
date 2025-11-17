import { PageContainer } from "@/shared/components/page-container";
import { SlideInTransition } from "@/shared/components/transition-container";
import { FakeForm } from "@/widgets/form/fake-form/ui/fake-form";
import { InfiniteArticleList } from "@/widgets/list/article-list/ui/infinite-article-list";

type HomePageProps = {
  currentUserId: string | null;
};
export const HomePageView = ({ currentUserId }: HomePageProps) => {
  return (
    <PageContainer
      title="안녕하세요"
      description="오늘 사람들이 기록한 문장을 확인하세요."
      banner={
        <SlideInTransition type="spring" className="w-full">
          <FakeForm />
        </SlideInTransition>
      }
    >
      <InfiniteArticleList currentUserId={currentUserId} />
    </PageContainer>
  );
};
