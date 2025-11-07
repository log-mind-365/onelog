import { UserX } from "lucide-react";
import { PageContainer } from "@/shared/components/page-container";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/shared/components/ui/card";

export default function NotFound() {
  return (
    <PageContainer>
      <Card className="shadow-none">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16">
          <UserX className="size-16 text-muted-foreground" />
          <div className="space-y-2 text-center">
            <CardTitle className="text-xl">존재하지 않는 계정입니다</CardTitle>
            <CardDescription>
              요청하신 사용자 정보를 찾을 수 없습니다.
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}
