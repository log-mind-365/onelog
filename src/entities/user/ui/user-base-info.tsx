import { cn } from "@/shared/lib/utils";

type UserBaseInfoProps = {
  userName: string;
  email: string;
  align: "start" | "center" | "end";
};

export const UserBaseInfo = ({ userName, email, align }: UserBaseInfoProps) => {
  return (
    <div className={cn(`flex flex-col gap-1`)}>
      <h1 className="font-bold">{userName}</h1>
      <p className="text-muted-foreground text-sm">{email}</p>
    </div>
  );
};
