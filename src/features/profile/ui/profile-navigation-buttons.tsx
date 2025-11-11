import { Button } from "@/shared/components/ui/button";

type ProfileEditButtonProps = {
  isMe: boolean;
  onViewProfile: () => void;
  onEditProfile?: () => void;
};

export const ProfileNavigationButtons = ({
  isMe,
  onViewProfile,
  onEditProfile,
}: ProfileEditButtonProps) => {
  return (
    <>
      {isMe && onEditProfile && (
        <Button variant="outline" onClick={onEditProfile}>
          프로필 수정
        </Button>
      )}
      <Button onClick={onViewProfile}>프로필 페이지</Button>
    </>
  );
};
