"use client";

import { ArrowUpRightIcon, FileXIcon } from "lucide-react";
import Link from "next/link";
import { BackButton } from "@/shared/components/back-button";
import { PageContainer } from "@/shared/components/page-container";
import { Button } from "@/shared/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/shared/components/ui/empty";
import { ROUTES } from "@/shared/model/routes";

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <PageContainer>
      <Empty className="relative border bg-card shadow-md">
        <BackButton className="absolute top-4 left-4" />
        <EmptyHeader>
          <EmptyMedia>
            <FileXIcon />
          </EmptyMedia>
        </EmptyHeader>
        <EmptyTitle className="text-xl">
          요청하신 게시물을 찾을 수 없습니다.
        </EmptyTitle>
        <EmptyDescription>{error.message}</EmptyDescription>
        <Button asChild>
          <Link href={ROUTES.HOME}>
            홈으로 이동하기
            <ArrowUpRightIcon />
          </Link>
        </Button>
      </Empty>
    </PageContainer>
  );
};

export default Error;
