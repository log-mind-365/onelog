"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { commentQueries } from "@/entities/comment/api/queries";
import { CommentForm } from "@/entities/comment/ui/comment-form";
import { CommentList } from "@/entities/comment/ui/comment-list";
import { useDeleteComment } from "@/features/comment/lib/use-delete-comment";
import { usePostComment } from "@/features/comment/lib/use-post-comment";
import { useUpdateComment } from "@/features/comment/lib/use-update-comment";
import { Separator } from "@/shared/components/ui/separator";

type ArticleCommentSectionProps = {
  articleId: string;
  userId: string | null;
  userName?: string;
  userAvatar?: string | null;
};

export const ArticleCommentSection = ({
  articleId,
  userId,
  userName,
  userAvatar,
}: ArticleCommentSectionProps) => {
  const { data: comments } = useSuspenseQuery(commentQueries.list(articleId));
  const { mutate: postComment } = usePostComment();
  const { mutate: updateComment } = useUpdateComment();
  const { mutate: deleteComment } = useDeleteComment();

  const handlePostComment = (content: string) => {
    if (!userId) return;

    postComment({
      articleId,
      userId,
      content,
    });
  };

  const handleUpdateComment = (commentId: string, content: string) => {
    updateComment({
      commentId,
      articleId,
      content,
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (!userId) return;

    deleteComment({
      commentId,
      articleId,
      userId,
    });
  };

  return (
    <div className="flex flex-col gap-8 rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg">댓글 {comments.length}</h3>
        {userId ? (
          <CommentForm
            currentUserName={userName}
            currentUserAvatar={userAvatar}
            onSubmit={handlePostComment}
          />
        ) : (
          <div className="flex items-center justify-center rounded-lg border border-dashed py-8">
            <p className="text-muted-foreground text-sm">
              댓글을 작성하려면 로그인이 필요합니다.
            </p>
          </div>
        )}
      </div>

      <CommentList
        comments={comments}
        currentUserId={userId}
        onUpdate={handleUpdateComment}
        onDelete={handleDeleteComment}
      />
    </div>
  );
};
