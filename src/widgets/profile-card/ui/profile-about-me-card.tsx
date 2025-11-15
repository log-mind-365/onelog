import { User } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

type ProfileAboutMeCardProps = {
  aboutMe: string | null;
};

export const ProfileAboutMeCard = ({ aboutMe }: ProfileAboutMeCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="size-5" />
          소개
        </CardTitle>
      </CardHeader>
      <CardContent>
        {aboutMe ? (
          <p className="text-sm leading-relaxed">{aboutMe}</p>
        ) : (
          <p className="text-muted-foreground text-sm">
            아직 소개가 작성되지 않았습니다.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
