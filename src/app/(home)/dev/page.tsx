"use client";

import { Heart, MessageCircle, Share2, Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Progress } from "@/shared/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Separator } from "@/shared/components/ui/separator";
import EmotionGauge from "@/entities/article/ui/emotion-gauge";

export default function DevComponentsPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-12">
        {/* 헤더 */}
        <div className="space-y-2">
          <h1 className="font-bold text-4xl">컴포넌트 프리뷰</h1>
          <p className="text-muted-foreground">OneLog 프로젝트의 모든 UI 컴포넌트를 한눈에 확인할 수 있습니다.</p>
        </div>

        <Separator />

        {/* 1. Buttons */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-2xl">Buttons</h2>
            <p className="text-muted-foreground text-sm">다양한 버튼 variants와 sizes</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sizes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>With Icons</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button>
                <Heart />
                좋아요
              </Button>
              <Button variant="outline">
                <MessageCircle />
                댓글
              </Button>
              <Button variant="secondary">
                <Share2 />
                공유
              </Button>
              <Button size="icon">
                <Heart />
              </Button>
              <Button size="icon-sm" variant="ghost">
                <Eye />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>States</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button disabled>Disabled</Button>
              <Button variant="outline" disabled>Disabled Outline</Button>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* 2. Badges */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-2xl">Badges</h2>
            <p className="text-muted-foreground text-sm">상태 표시용 배지 컴포넌트</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Use Cases</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Badge variant="default">공개</Badge>
              <Badge variant="secondary">비공개</Badge>
              <Badge variant="destructive">신고됨</Badge>
              <Badge variant="outline">임시저장</Badge>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* 3. Emotion Gauge */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-2xl">Emotion Gauge</h2>
            <p className="text-muted-foreground text-sm">감정 레벨 시각화 컴포넌트</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>All Levels</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-8">
              <EmotionGauge emotionLevel={0} label="매우 나쁨" />
              <EmotionGauge emotionLevel={25} label="나쁨" />
              <EmotionGauge emotionLevel={50} label="보통" />
              <EmotionGauge emotionLevel={75} label="좋음" />
              <EmotionGauge emotionLevel={100} label="매우 좋음" />
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* 4. Form Inputs */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-2xl">Form Inputs</h2>
            <p className="text-muted-foreground text-sm">입력 폼 컴포넌트</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="기본 입력" />
              <Input type="email" placeholder="이메일 입력" />
              <Input type="password" placeholder="비밀번호 입력" />
              <Input disabled placeholder="비활성화된 입력" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Textarea</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea placeholder="내용을 입력하세요..." rows={4} />
              <Textarea disabled placeholder="비활성화된 텍스트영역" rows={3} />
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* 5. Progress */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-2xl">Progress</h2>
            <p className="text-muted-foreground text-sm">진행률 표시</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Progress Bars</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>0%</span>
                </div>
                <Progress value={0} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>25%</span>
                </div>
                <Progress value={25} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>50%</span>
                </div>
                <Progress value={50} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>75%</span>
                </div>
                <Progress value={75} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>100%</span>
                </div>
                <Progress value={100} />
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* 6. Avatars */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-2xl">Avatars</h2>
            <p className="text-muted-foreground text-sm">사용자 아바타 컴포넌트</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sizes & States</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <Avatar className="size-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground text-xs">Small</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground text-xs">Default</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar className="size-16">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground text-xs">Large</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground text-xs">Fallback</span>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* 7. Cards */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-2xl">Cards</h2>
            <p className="text-muted-foreground text-sm">카드 레이아웃 컴포넌트</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>기본 카드</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  카드 컴포넌트는 콘텐츠를 그룹화하는 데 사용됩니다.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <CardTitle>강조 카드</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  border-primary 클래스로 강조할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-secondary">
              <CardHeader>
                <CardTitle>Secondary 배경</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  배경색을 변경하여 다양한 스타일을 만들 수 있습니다.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>그림자 카드</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  shadow-lg로 더 강한 그림자 효과를 줄 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* 8. Article Card Example */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-2xl">Article Card Preview</h2>
            <p className="text-muted-foreground text-sm">실제 게시글 카드 프리뷰</p>
          </div>

          <Card>
            <CardHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">작성자 이름</p>
                    <p className="text-muted-foreground text-xs">2시간 전</p>
                  </div>
                </div>
                <EmotionGauge emotionLevel={75} label="좋음" />
              </div>
              <CardTitle className="text-xl">오늘은 좋은 일이 있었어요</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                오늘 오랜만에 친구를 만났어요. 함께 카페에 가서 이야기를 나누다 보니 시간 가는 줄 몰랐네요.
                역시 좋은 사람들과 함께하는 시간은 언제나 즐겁습니다.
              </p>
              <Separator />
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm">
                  <Heart className="size-4" />
                  <span>24</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="size-4" />
                  <span>8</span>
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="size-4" />
                </Button>
                <div className="ml-auto">
                  <Badge variant="default">공개</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* 9. Color Palette */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-2xl">Color Palette</h2>
            <p className="text-muted-foreground text-sm">프로젝트에서 사용하는 색상</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Primary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-primary" />
                  <p className="text-muted-foreground text-xs">주요 액션 색상</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Secondary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-secondary" />
                  <p className="text-muted-foreground text-xs">보조 색상</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Destructive</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-destructive" />
                  <p className="text-muted-foreground text-xs">위험 액션 색상</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Muted</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-muted" />
                  <p className="text-muted-foreground text-xs">배경 색상</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Accent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-12 rounded-md bg-accent" />
                  <p className="text-muted-foreground text-xs">강조 색상</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Border</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-12 rounded-md border-4 border-border bg-background" />
                  <p className="text-muted-foreground text-xs">테두리 색상</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator />

        {/* 10. Typography */}
        <section className="space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-2xl">Typography</h2>
            <p className="text-muted-foreground text-sm">텍스트 스타일</p>
          </div>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <div>
                <h1 className="font-bold text-4xl">Heading 1</h1>
                <p className="text-muted-foreground text-sm">font-bold text-4xl</p>
              </div>
              <div>
                <h2 className="font-semibold text-3xl">Heading 2</h2>
                <p className="text-muted-foreground text-sm">font-semibold text-3xl</p>
              </div>
              <div>
                <h3 className="font-semibold text-2xl">Heading 3</h3>
                <p className="text-muted-foreground text-sm">font-semibold text-2xl</p>
              </div>
              <div>
                <h4 className="font-semibold text-xl">Heading 4</h4>
                <p className="text-muted-foreground text-sm">font-semibold text-xl</p>
              </div>
              <div>
                <p className="font-medium text-base">Body Text (Medium)</p>
                <p className="text-muted-foreground text-sm">font-medium text-base</p>
              </div>
              <div>
                <p className="text-base">Body Text (Regular)</p>
                <p className="text-muted-foreground text-sm">text-base</p>
              </div>
              <div>
                <p className="text-sm">Small Text</p>
                <p className="text-muted-foreground text-xs">text-sm</p>
              </div>
              <div>
                <p className="text-xs">Extra Small Text</p>
                <p className="text-muted-foreground text-xs">text-xs</p>
              </div>
              <div>
                <p className="text-muted-foreground">Muted Text</p>
                <p className="text-muted-foreground text-xs">text-muted-foreground</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <div className="py-8 text-center text-muted-foreground text-sm">
          <p>OneLog Component Library - Development Preview</p>
        </div>
      </div>
    </div>
  );
}