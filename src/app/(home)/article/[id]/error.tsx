"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
const Error = () => {
  return (
    <div className="flex min-h-[calc(100vh-110px)] flex-col items-center justify-center">
      <h2 className="mb-4 text-[20px] text-bold">
        예상치 못한 오류가 발생했습니다.
      </h2>
      <Button>
        <Link href={"/"}>홈으로 이동하기</Link>
      </Button>
    </div>
  );
};

export default Error;
