"use client";

import { ArrowUpRightIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
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
    <Empty className="h-screen">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlertIcon />
        </EmptyMedia>
        <EmptyTitle>404</EmptyTitle>
        <EmptyDescription>
          요청하신 페이지는 없는 페이지입니다.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="link" className="text-muted-foreground" asChild>
          <Link href={ROUTES.HOME}>
            홈으로 이동하기 <ArrowUpRightIcon />
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
};

export default NotFound;
