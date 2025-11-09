import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { Button } from "@/shared/components/ui/button";

type UserDetailInfoProps = {
  userName: string;
  email: string;
  aboutMe: string;
  avatarUrl: string | null;
  onProfile: () => void;
};

export const UserDetailInfo = ({
  userName,
  aboutMe,
  email,
  avatarUrl,
  onProfile,
}: UserDetailInfoProps) => {
  return (
    <div className="flex w-full flex-row justify-between rounded-lg bg-background p-4">
      <div className="flex items-center gap-4">
        <UserAvatar fallback={userName} avatarUrl={avatarUrl} size="xl" />
        <div>
          <h1 className="font-bold text-lg">{userName}</h1>
          <p className="text-muted-foreground text-sm">{email}</p>
          <p className="text-sm">{aboutMe}</p>
        </div>
      </div>
      <div className="flex flex-col items-stretch justify-evenly">
        <Button
          variant="outline"
          size="sm"
          className="bg-card"
          onClick={onProfile}
        >
          프로필 페이지
        </Button>
      </div>
    </div>
  );
};
