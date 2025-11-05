import { Calendar, Mail, User } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getUserInfo } from "@/entities/user/api/server";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { Container } from "@/shared/components/container";
import { TransitionContainer } from "@/shared/components/transition-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Separator } from "@/shared/components/ui/separator";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

  const user = await getUserInfo(id);

  if (!user) {
    notFound();
  }

  const formatDate = (date: Date | string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Suspense fallback={<p>loading...</p>}>
      <Container.Body>
        <TransitionContainer.FadeIn>
          <Container.Title title="프로필" description="사용자 정보를 확인하세요" />

      {/* Profile Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <UserAvatar
              avatarUrl={user.avatarUrl || undefined}
              fallback={user.userName}
              size="lg"
            />
            <div className="flex-1 space-y-1">
              <CardTitle className="text-2xl">{user.userName}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Mail className="size-4" />
                {user.email}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* About Me Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-5" />
            소개
          </CardTitle>
        </CardHeader>
        <CardContent>
          {user.aboutMe ? (
            <p className="text-sm leading-relaxed">{user.aboutMe}</p>
          ) : (
            <p className="text-muted-foreground text-sm">
              아직 소개가 작성되지 않았습니다.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="size-5" />
            계정 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">가입일</span>
            <span className="font-medium">{formatDate(user.createdAt)}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">마지막 업데이트</span>
            <span className="font-medium">{formatDate(user.updatedAt)}</span>
          </div>
        </CardContent>
      </Card>
        </TransitionContainer.FadeIn>
      </Container.Body>
    </Suspense>
  );
};

export default Page;
