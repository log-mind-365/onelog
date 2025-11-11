import { Button } from "@/shared/components/ui/button";

type ProfileEditButtonProps = {
  isMe: boolean;
  onNavigate: () => void;
};

export const ProfileEditButton = ({
  isMe,
  onNavigate,
}: ProfileEditButtonProps) => {
  if (!isMe) return null;
  return <Button onClick={onNavigate}>프로필 수정</Button>;
};
