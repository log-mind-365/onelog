"use client";

import { useState } from "react";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";

type CommentFormProps = {
  currentUserName?: string;
  currentUserAvatar?: string | null;
  onSubmit: (content: string) => void;
  placeholder?: string;
};

export const CommentForm = ({
  currentUserName,
  currentUserAvatar,
  onSubmit,
  placeholder = "댓글을 입력하세요...",
}: CommentFormProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-3">
      <UserAvatar
        avatarUrl={currentUserAvatar}
        fallback={currentUserName?.[0] || "U"}
      />
      <div className="flex flex-1 flex-col gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[80px] bg-card"
        />
        <div className="flex justify-end">
          <Button size="sm" onClick={handleSubmit} disabled={!content.trim()}>
            댓글 작성
          </Button>
        </div>
      </div>
    </div>
  );
};
