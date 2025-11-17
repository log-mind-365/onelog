"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { commentQueries } from "@/entities/comment/api/queries";
import { CommentForm } from "@/entities/comment/ui/comment-form";
import { CommentList } from "@/entities/comment/ui/comment-list";
import { useAuth } from "@/features/auth/model/store";
import { useDeleteComment } from "@/features/comment/lib/use-delete-comment";
import { usePostComment } from "@/features/comment/lib/use-post-comment";
import { useUpdateComment } from "@/features/comment/lib/use-update-comment";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";

type ArticleCommentSectionProps = {
  articleId: number;
  currentUserId: string | null;
};

export const ArticleCommentSection = ({
  articleId,
  currentUserId,
}: ArticleCommentSectionProps) => {
  const { data: comments } = useSuspenseQuery(commentQueries.list(articleId));
  const { me } = useAuth();
  const { mutate: postComment } = usePostComment();
  const { mutate: updateComment } = useUpdateComment();
  const { mutate: deleteComment } = useDeleteComment();

  const handlePostComment = (content: string) => {
    if (!currentUserId) return;

    postComment({
      articleId,
      userId: currentUserId,
      content,
    });
  };

  const handleUpdateComment = (commentId: number, content: string) => {
    updateComment({
      commentId,
      articleId,
      content,
    });
  };

  const handleDeleteComment = (commentId: number) => {
    if (!currentUserId) return;

    deleteComment({
      commentId,
      articleId,
      userId: currentUserId,
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg">댓글 {comments.length}</h3>
          {currentUserId ? (
            <CommentForm
              currentUserName={me?.userName ?? ""}
              currentUserAvatar={me?.avatarUrl ?? null}
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
      </CardHeader>

      <CardContent>
        <CommentList
          comments={comments}
          currentUserId={currentUserId}
          onUpdate={handleUpdateComment}
          onDelete={handleDeleteComment}
        />
      </CardContent>
    </Card>
  );
};
