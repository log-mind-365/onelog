import { ArticleContent } from "@/entities/article/ui/article-content";
import { ArticleHeader } from "@/entities/article/ui/article-header";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";

type ArticleDetailProps = {
  userId: string;
  userName: string;
  avatarUrl: string | null;
  email: string;
  emotionLevel: number;
  isMe: boolean;
  title: string;
  content: string;
  createdAt: Date;
  onClick: () => void;
};

export const ArticleDetail = ({
  userId,
  userName,
  avatarUrl,
  email,
  emotionLevel,
  isMe,
  title,
  content,
  createdAt,
}: ArticleDetailProps) => {
  return (
    <Card>
      <CardHeader>
        <ArticleHeader
          userId={userId}
          userName={userName}
          email={email}
          avatarUrl={avatarUrl}
          emotionLevel={emotionLevel}
          isMe={isMe}
          createdAt={createdAt}
        />
      </CardHeader>
      <CardContent>
        <ArticleContent title={title} content={content} />
      </CardContent>
    </Card>
  );
};
