"use client";

import { ArrowUpRightIcon, TriangleAlertIcon } from "lucide-react";
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
    <div className="!mx-auto mt-18 w-full sm:mt-0 sm:w-lg md:w-xl lg:w-2xl">
      <PageContainer>
        <Empty className="relative border bg-card shadow-md">
          <BackButton className="absolute top-4 left-4" />
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <TriangleAlertIcon />
            </EmptyMedia>
          </EmptyHeader>
          <EmptyContent>
            <EmptyTitle>404</EmptyTitle>
            <EmptyDescription>
              요청하신 페이지는 없는 페이지입니다.
            </EmptyDescription>
            <Button asChild>
              <Link href={ROUTES.HOME}>
                홈으로 이동하기 <ArrowUpRightIcon />
              </Link>
            </Button>
          </EmptyContent>
        </Empty>
      </PageContainer>
    </div>
  );
};

export default NotFound;
