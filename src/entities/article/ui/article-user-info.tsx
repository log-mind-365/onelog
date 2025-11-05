import { format } from "date-fns";
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
  const formattedDate = format(new Date(createdAt), "M월 d일 y년", {
    locale: ko,
  });
  const formattedTime = format(new Date(createdAt), "HH:mm");
  return (
    <div className="flex flex-col">
      <div className="flex items-end gap-1">
        <h3 className="font-medium text-sm">{userName}</h3>
        <span className="text-muted-foreground text-xs">
          · @{email?.split("@")[0]}
        </span>
      </div>
      <p className="text-muted-foreground text-sm">
        {formattedDate} · {formattedTime}
      </p>
    </div>
  );
};
