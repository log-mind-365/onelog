import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import type { CommentWithAuthor } from "@/entities/comment/model/types";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import {
  UserInfoCard,
  UserInfoCardAboutMe,
  UserInfoCardActions,
  UserInfoCardAvatar,
  UserInfoCardContent,
  UserInfoCardDetails,
  UserInfoCardEmail,
  UserInfoCardName,
} from "@/entities/user/ui/user-info-card";
import { ArticleAuthorProfileActionBar } from "@/features/article/ui/article-author-profile-action-bar";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/shared/components/ui/hover-card";
import { Textarea } from "@/shared/components/ui/textarea";

type CommentItemProps = {
  comment: CommentWithAuthor;
  currentUserId: string | null;
  onUpdate: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
};

export const CommentItem = ({
  comment,
  currentUserId,
  onUpdate,
  onDelete,
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleUpdate = () => {
    if (editContent.trim()) {
      onUpdate(comment.id, editContent);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const viewMode = currentUserId === comment.author?.id ? "author" : "viewer";

  return (
    <div className="flex gap-3">
      <HoverCard openDelay={0}>
        <HoverCardTrigger>
          <UserAvatar
            avatarUrl={comment.author?.avatarUrl}
            fallback={comment.author?.userName?.[0] || "U"}
          />
        </HoverCardTrigger>
        <HoverCardContent asChild>
          <UserInfoCard className="flex-col items-center">
            <UserInfoCardContent className="itmes-center flex-1 flex-col">
              <UserInfoCardAvatar
                userName={comment.author?.userName ?? ""}
                avatarUrl={comment.author?.avatarUrl ?? null}
                className="flex justify-center"
              />
              <UserInfoCardDetails className="flex flex-col items-center">
                <UserInfoCardName userName={comment.author?.userName ?? ""} />
                <UserInfoCardEmail email={comment.author?.email ?? ""} />
                <UserInfoCardAboutMe aboutMe={comment.author?.aboutMe ?? ""} />
              </UserInfoCardDetails>
            </UserInfoCardContent>
            <UserInfoCardActions className="flex-row">
              <ArticleAuthorProfileActionBar
                viewMode={viewMode}
                articleId={comment.articleId}
                authorId={comment.author?.id ?? ""}
                currentUserId={currentUserId}
                isFollowing={false}
              />
            </UserInfoCardActions>
          </UserInfoCard>
        </HoverCardContent>
      </HoverCard>
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold text-sm">
              {comment.author?.userName}
            </span>
            <span className="text-muted-foreground text-xs">
              {formatDistanceToNow(comment.createdAt, {
                addSuffix: true,
                locale: ko,
              })}
            </span>
          </div>
          {viewMode === "author" && !isEditing && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  수정
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete(comment.id)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  삭제
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isEditing ? (
          <div className="flex flex-col gap-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[80px]"
              placeholder="댓글을 입력하세요..."
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={handleCancel}>
                취소
              </Button>
              <Button size="sm" onClick={handleUpdate}>
                수정
              </Button>
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
        )}
      </div>
    </div>
  );
};
