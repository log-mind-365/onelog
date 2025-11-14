"use client";

import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex min-h-[calc(100vh-110px)] flex-col items-center justify-center">
      <h2 className="mb-4 text-[20px] text-bold">
        요청하신 페이지는 없는 페이지입니다.
      </h2>
      <Link
        className="rounded-full bg-brand px-[20px] py-[10px] text-[15px] text-white"
        href={"/"}
      >
        홈으로 이동하기
      </Link>
    </div>
  );
};

export default NotFound;
