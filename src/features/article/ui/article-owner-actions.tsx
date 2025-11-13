import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/model/routes";

type ArticleOwnerActionsProps = {
  currentUserId: string;
};

export const ArticleOwnerActions = ({
  currentUserId,
}: ArticleOwnerActionsProps) => {
  return (
    <>
      <Button variant="outline" className="flex-1 bg-card" asChild>
        <Link href={ROUTES.SETTINGS.PROFILE}>프로필 수정</Link>
      </Button>
      <Button className="flex-1" asChild>
        <Link href={ROUTES.PROFILE.VIEW(currentUserId)}>프로필 페이지</Link>
      </Button>
    </>
  );
};
