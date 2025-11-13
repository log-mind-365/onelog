import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/model/routes";

type ProfileSummaryOwnerActionsProps = {
  currentUserId: string;
};

export const ProfileSummaryOwnerActions = ({
  currentUserId,
}: ProfileSummaryOwnerActionsProps) => {
  return (
    <>
      <Button asChild>
        <Link href={ROUTES.SETTINGS.PROFILE}>프로필 수정</Link>
      </Button>
      <Button asChild>
        <Link href={ROUTES.PROFILE.VIEW(currentUserId)}>프로필 페이지</Link>
      </Button>
    </>
  );
};
