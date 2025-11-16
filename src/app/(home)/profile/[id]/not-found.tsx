import { ArrowUpRightIcon, UserX } from "lucide-react";
import Link from "next/link";
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
    <PageContainer title="프로필" description="사용자 정보를 확인하세요">
      <Empty className="border bg-card shadow-sm">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <UserX />
          </EmptyMedia>
          <EmptyTitle className="text-xl">존재하지 않는 계정입니다</EmptyTitle>
          <EmptyDescription>
            요청하신 사용자 정보를 찾을 수 없습니다.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="link" asChild>
            <Link href={ROUTES.HOME}>
              홈으로 돌아가기 <ArrowUpRightIcon />
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </PageContainer>
  );
};

export default NotFound;
