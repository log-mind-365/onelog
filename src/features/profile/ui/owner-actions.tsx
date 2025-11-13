import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/model/routes";

export const OwnerActions = () => {
  const router = useRouter();

  return (
    <Button onClick={() => router.push(ROUTES.SETTINGS.PROFILE)}>
      프로필 수정
    </Button>
  );
};
