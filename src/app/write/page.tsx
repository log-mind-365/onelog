"use client";

import { useRouter } from "next/navigation";
import { type ChangeEvent, Suspense, useState } from "react";
import type { AccessType, EmotionLevel } from "@/entities/article/model/types";
import { Container } from "@/shared/components/container";
import { Separator } from "@/shared/components/ui/separator";
import { Textarea } from "@/shared/components/ui/textarea";
import { useAuth } from "@/shared/store/use-auth";
import { WritePageBodyHeader } from "@/widgets/header/write-page-body-header.widget";
import { WritePageHeader } from "@/widgets/header/write-page-header.widget";
import { WritePageSidebar } from "@/widgets/sidebar/ui/write-page-sidebar";

const Page = () => {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [accessType, setAccessType] = useState<AccessType>("public");
  const [emotionLevel, setEmotionLevel] = useState<EmotionLevel>(50);
  const { me } = useAuth();

  const handleAccessTypeChange = (value: string) => {
    setAccessType(value as AccessType);
  };

  const handleEmotionChange = (value: string) => {
    setEmotionLevel(() => {
      switch (value) {
        case "0":
          return 0;
        case "25":
          return 25;
        case "50":
          return 50;
        case "75":
          return 75;
        case "100":
          return 100;
        default:
          return 50;
      }
    });
  };

  const handleValueChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  return (
    <Suspense fallback={<p>loading...</p>}>
      <WritePageSidebar
        content={content}
        userId={me?.id}
        emotionLevel={emotionLevel}
        accessType={accessType}
        onAccessTypeChange={handleAccessTypeChange}
        onEmotionChange={handleEmotionChange}
        onBack={() => router.back()}
      />
      <WritePageHeader
        emotionLevel={emotionLevel}
        accessType={accessType}
        content={content}
        userId={me?.id}
        onAccessTypeChange={handleAccessTypeChange}
        onEmotionChange={handleEmotionChange}
        onBack={() => router.back()}
      />
      <Container.Body variant="write">
        <WritePageBodyHeader
          avatarUrl={me?.avatarUrl}
          userName={me?.userName}
          email={me?.email}
          createdAt={me?.createdAt}
          emotionLevel={emotionLevel}
        />
        <Separator />
        <Textarea
          value={content}
          onChange={handleValueChange}
          className="h-full resize-none border-none shadow-none"
        />
      </Container.Body>
    </Suspense>
  );
};

export default Page;
