import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

type ArticleUserInfoProps = {
  userName: string;
  email: string;
  createdAt: Date;
};

export const ArticleUserInfo = ({
  userName,
  email,
  createdAt,
}: ArticleUserInfoProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-end gap-1">
        <h3 className="font-medium text-sm">{userName}</h3>
        <span className="text-muted-foreground text-xs">
          · @{email?.split("@")[0]}
        </span>
      </div>
      <time className="text-muted-foreground text-sm">
        {formatDistanceToNow(createdAt, {
          addSuffix: true,
          locale: ko,
        })}
      </time>
    </div>
  );
};
