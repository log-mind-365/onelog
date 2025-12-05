import { ArrowUpRightIcon, UserXIcon } from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/shared/components/back-button";
import { PageContainer } from "@/shared/components/page-container";
import { Button } from "@/shared/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { ROUTES } from "@/shared/model/routes";

const NotFound = () => {
  return (
    <PageContainer>
      <Empty className="relative border bg-card shadow-md">
        <BackButton className="absolute top-4 left-4" />
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UserXIcon />
          </EmptyMedia>
          <EmptyTitle className="text-xl">존재하지 않는 계정입니다</EmptyTitle>
          <EmptyDescription>
            요청하신 사용자 정보를 찾을 수 없습니다.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href={ROUTES.HOME} replace>
              홈으로 돌아가기 <ArrowUpRightIcon />
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </PageContainer>
  );
};

export default NotFound;
