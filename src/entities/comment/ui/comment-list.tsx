import type { CommentWithAuthor } from "@/entities/comment/model/types";
import { CommentItem } from "@/entities/comment/ui/comment-item";
import { Separator } from "@/shared/components/ui/separator";

type CommentListProps = {
  comments: CommentWithAuthor[];
  currentUserId: string | null;
  onUpdate: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
};

export const CommentList = ({
  comments,
  currentUserId,
  onUpdate,
  onDelete,
}: CommentListProps) => {
  if (comments.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground text-sm">
          첫 번째 댓글을 작성해보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment, index) => (
        <div key={comment.id}>
          <CommentItem
            comment={comment}
            currentUserId={currentUserId}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
          {index < comments.length - 1 && <Separator className="mt-4" />}
        </div>
      ))}
    </div>
  );
};
