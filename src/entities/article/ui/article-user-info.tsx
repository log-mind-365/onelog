type ArticleUserInfoProps = {
  userName: string;
  email: string;
  createdAt?: Date;
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
        {createdAt
          ? new Date(createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : new Date(Date.now()).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
      </time>
    </div>
  );
};
