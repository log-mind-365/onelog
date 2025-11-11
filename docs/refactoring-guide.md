# OneLog 컴포넌트 리팩토링 가이드

> shadcn 스타일 컴파운드 패턴을 적용한 컴포넌트 개선 가이드

## 목차

1. [컴파운드 패턴 소개](#1-컴파운드-패턴-소개)
2. [Phase 1: UserInfo 컴포넌트](#phase-1-userinfo-컴포넌트)
3. [Phase 2: EmotionGauge 간소화](#phase-2-emotiongauge-간소화)
4. [Phase 3: ArticleActionButton 통합](#phase-3-articleactionbutton-통합)
5. [Phase 4: CommentItem 컴파운드 패턴](#phase-4-commentitem-컴파운드-패턴)
6. [Phase 5: ArticleCard Props 그룹화](#phase-5-articlecard-props-그룹화)
7. [Phase 6: ArticleHeader 컴파운드 패턴](#phase-6-articleheader-컴파운드-패턴)
8. [마이그레이션 체크리스트](#마이그레이션-체크리스트)

---

## 1. 컴파운드 패턴 소개

### shadcn이 사용하는 컴파운드 패턴이란?

컴파운드 패턴(Compound Pattern)은 여러 하위 컴포넌트를 조합하여 유연한 UI를 만드는 패턴입니다.

**shadcn Card 예제:**
```tsx
// ❌ 유연하지 않은 방식
<Card title="제목" description="설명" content="내용" footer="푸터" />

// ✅ shadcn 스타일 컴파운드 패턴
<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
    <CardDescription>설명</CardDescription>
  </CardHeader>
  <CardContent>
    내용
  </CardContent>
  <CardFooter>
    푸터
  </CardFooter>
</Card>
```

### 컴파운드 패턴의 장점

1. **유연성**: 필요한 부분만 조합 가능
2. **확장성**: 새로운 하위 컴포넌트 추가 용이
3. **가독성**: 구조가 명확하게 보임
4. **재사용성**: 다양한 레이아웃에 적용 가능

### 구현 방법

```tsx
// 1. 부모 컴포넌트 (컨테이너)
const MyComponent = ({ children, className }: ComponentProps<"div">) => {
  return <div className={cn("기본스타일", className)}>{children}</div>;
};

// 2. 하위 컴포넌트를 속성으로 추가
MyComponent.Header = ({ children }: ComponentProps<"div">) => {
  return <div className="header-스타일">{children}</div>;
};

MyComponent.Body = ({ children }: ComponentProps<"div">) => {
  return <div className="body-스타일">{children}</div>;
};

// 3. export
export { MyComponent };
```

---

## Phase 1: UserInfo 컴포넌트

### 현재 문제점

**파일**: `src/entities/user/ui/user-info-base.tsx`

```tsx
// ❌ 현재: 레이아웃이 고정되어 있어 재사용이 어려움
export const UserInfoBase = ({
  userName,
  aboutMe,
  email,
  avatarUrl,
  className,
  children,
}: UserInfoBaseProps) => {
  return (
    <div className={cn("flex w-full flex-row items-center justify-between gap-4 p-4", className)}>
      <UserAvatar fallback={userName} avatarUrl={avatarUrl} size="xl" />
      <div className="flex flex-1 flex-col">
        <h1 className="font-bold text-sm sm:text-lg">{userName}</h1>
        <p className="text-muted-foreground text-xs sm:text-sm">{email}</p>
        <p className="text-xs sm:text-sm">{aboutMe}</p>
      </div>
      {children}
    </div>
  );
};
```

**문제점:**
- 레이아웃이 `flex-row`, `items-center`로 고정
- 아바타 크기가 항상 `xl`
- padding이 `p-4`로 강제됨
- ProfilePage에서는 중앙 정렬이 필요한데 불가능
- 텍스트 순서를 변경할 수 없음 (userName 다음에 FollowStats를 넣고 싶을 때)

### 리팩토링 방안

#### 1단계: 새 파일 생성

**파일**: `src/entities/user/ui/user-info.tsx`

```tsx
"use client";

import type { ComponentProps } from "react";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { cn } from "@/shared/lib/utils";

// ✅ 부모 컴포넌트: 레이아웃만 담당
type UserInfoProps = ComponentProps<"div">;

const UserInfo = ({ children, className, ...props }: UserInfoProps) => {
  return (
    <div
      className={cn("flex gap-4", className)}
      {...props}
    >
      {children}
    </div>
  );
};

// ✅ Avatar: 크기를 외부에서 제어 가능
type UserInfoAvatarProps = {
  avatarUrl?: string | null;
  fallback: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const UserInfoAvatar = ({
  avatarUrl,
  fallback,
  size = "md",
  className
}: UserInfoAvatarProps) => {
  return (
    <UserAvatar
      avatarUrl={avatarUrl}
      fallback={fallback}
      size={size}
      className={className}
    />
  );
};

// ✅ Details: 정보 컨테이너
type UserInfoDetailsProps = ComponentProps<"div">;

const UserInfoDetails = ({ children, className, ...props }: UserInfoDetailsProps) => {
  return (
    <div
      className={cn("flex flex-1 flex-col gap-1", className)}
      {...props}
    >
      {children}
    </div>
  );
};

// ✅ Name: 이름 표시
type UserInfoNameProps = ComponentProps<"h1">;

const UserInfoName = ({ children, className, ...props }: UserInfoNameProps) => {
  return (
    <h1
      className={cn("font-bold text-sm sm:text-lg", className)}
      {...props}
    >
      {children}
    </h1>
  );
};

// ✅ Email: 이메일 표시
type UserInfoEmailProps = ComponentProps<"p">;

const UserInfoEmail = ({ children, className, ...props }: UserInfoEmailProps) => {
  return (
    <p
      className={cn("text-muted-foreground text-xs sm:text-sm", className)}
      {...props}
    >
      {children}
    </p>
  );
};

// ✅ Bio: 소개 표시
type UserInfoBioProps = ComponentProps<"p">;

const UserInfoBio = ({ children, className, ...props }: UserInfoBioProps) => {
  return (
    <p
      className={cn("text-xs sm:text-sm", className)}
      {...props}
    >
      {children}
    </p>
  );
};

// ✅ Actions: 버튼 그룹
type UserInfoActionsProps = ComponentProps<"div">;

const UserInfoActions = ({ children, className, ...props }: UserInfoActionsProps) => {
  return (
    <div
      className={cn("flex gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
};

// 하위 컴포넌트를 부모에 연결
UserInfo.Avatar = UserInfoAvatar;
UserInfo.Details = UserInfoDetails;
UserInfo.Name = UserInfoName;
UserInfo.Email = UserInfoEmail;
UserInfo.Bio = UserInfoBio;
UserInfo.Actions = UserInfoActions;

export { UserInfo };
```

#### 2단계: 사용 예제

**예제 1: ArticleCard Popover (기존 UserInfoBase 대체)**

```tsx
// Before: 레이아웃 고정
<UserInfoBase
  userName={userName}
  email={email}
  aboutMe={aboutMe}
  avatarUrl={avatarUrl}
>
  <UserInfoBaseActions>
    <FollowButton {...} />
    <ProfileNavigationButtons {...} />
  </UserInfoBaseActions>
</UserInfoBase>

// After: 유연한 레이아웃
<UserInfo className="w-full items-center p-4">
  <UserInfo.Avatar
    avatarUrl={avatarUrl}
    fallback={userName}
    size="xl"
  />
  <UserInfo.Details>
    <UserInfo.Name>{userName}</UserInfo.Name>
    <UserInfo.Email>{email}</UserInfo.Email>
    <UserInfo.Bio>{aboutMe}</UserInfo.Bio>
  </UserInfo.Details>
  <UserInfo.Actions className="flex-col">
    <FollowButton {...} />
    <ProfileNavigationButtons {...} />
  </UserInfo.Actions>
</UserInfo>
```

**예제 2: ProfilePage (중앙 정렬, 세로 레이아웃)**

```tsx
// 현재는 불가능한 레이아웃
<UserInfo className="flex-col items-center">
  <UserInfo.Avatar
    avatarUrl={user.avatarUrl}
    fallback={user.userName}
    size="xl"
  />
  <UserInfo.Details className="items-center text-center">
    <UserInfo.Name className="text-2xl">{user.userName}</UserInfo.Name>
    {/* 이름과 이메일 사이에 다른 컴포넌트 삽입 가능 */}
    <FollowStats
      followerCount={stats?.followerCount ?? 0}
      followingCount={stats?.followingCount ?? 0}
    />
    <UserInfo.Email>{user.email}</UserInfo.Email>
  </UserInfo.Details>
  <UserInfo.Actions className="flex-row justify-center">
    <FollowButton {...} />
    <ProfileNavigationButtons {...} />
  </UserInfo.Actions>
</UserInfo>
```

**예제 3: 미니 프로필 (아바타 + 이름만)**

```tsx
<UserInfo className="items-center">
  <UserInfo.Avatar
    avatarUrl={avatarUrl}
    fallback={userName}
    size="sm"
  />
  <UserInfo.Details className="gap-0">
    <UserInfo.Name className="text-sm">{userName}</UserInfo.Name>
  </UserInfo.Details>
</UserInfo>
```

#### 3단계: 마이그레이션

**1. UserInfoBase를 사용하는 모든 파일 찾기:**

```bash
grep -r "UserInfoBase" src/
```

**2. 파일별 수정:**

- `src/widgets/article-card/ui/article-card.tsx` (77줄)
- `src/views/article/article-detail-page-content.tsx` (76줄)
- `src/widgets/profile-card/ui/profile-card.tsx` (44줄)

**3. import 변경:**

```tsx
// Before
import { UserInfoBase, UserInfoBaseActions } from "@/entities/user/ui/user-info-base";

// After
import { UserInfo } from "@/entities/user/ui/user-info";
```

**4. 기존 UserInfoBase는 deprecated 표시:**

```tsx
// src/entities/user/ui/user-info-base.tsx
/**
 * @deprecated Use UserInfo compound pattern instead
 * @see src/entities/user/ui/user-info.tsx
 */
export const UserInfoBase = ({ ... }) => { ... };
```

---

## Phase 2: EmotionGauge 간소화

### 현재 문제점

**파일**: `src/entities/article/ui/emotion-gauge.tsx`

```tsx
// ❌ 문제점: 2개의 중첩된 switch 문
export default function EmotionGauge({ emotionLevel, className, onClick }: EmotionGaugeProps) {
  let emotionBlock = [0, 0, 0, 0, 0];

  switch (emotionLevel) {
    case 0:
      emotionBlock = [1, 0, 0, 0, 0];
      break;
    case 25:
      emotionBlock = [1, 1, 0, 0, 0];
      break;
    // ... 반복
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn("flex items-end", className)}>
        {emotionBlock.map((shouldRender, index) => (
          <RenderEmotionBlock
            key={index}
            index={index}
            onClick={onClick}
            shouldRender={!!shouldRender}
          />
        ))}
      </div>
    </div>
  );
}

function RenderEmotionBlock({ shouldRender, index }: RenderEmotionBlockProps) {
  let opacity: string = "";
  let height: string = "";

  // 또 다른 switch 문
  switch (index) {
    case 0:
      opacity = shouldRender ? "opacity-40" : "";
      height = shouldRender ? "h-[20%]" : "";
      break;
    // ... 반복
  }

  return <div className={cn("...", height, opacity)} />;
}
```

### 리팩토링 방안

#### 1단계: 설정 데이터 분리

**파일**: `src/entities/article/model/emotion-config.ts`

```tsx
// ✅ 블록 설정을 데이터로 분리
export const EMOTION_BLOCK_CONFIG = [
  { opacity: 40, height: 20 },
  { opacity: 55, height: 40 },
  { opacity: 70, height: 60 },
  { opacity: 85, height: 80 },
  { opacity: 100, height: 100 },
] as const;

// ✅ emotion level에서 활성 블록 수 계산
export const getActiveBlockCount = (emotionLevel: number): number => {
  return Math.min(Math.floor(emotionLevel / 25) + 1, 5);
};
```

#### 2단계: 컴포넌트 리팩토링

**파일**: `src/entities/article/ui/emotion-gauge.tsx`

```tsx
"use client";

import type { ComponentProps } from "react";
import { EMOTION_STATUS } from "@/entities/article/model/constants";
import { EMOTION_BLOCK_CONFIG, getActiveBlockCount } from "@/entities/article/model/emotion-config";
import type { EmotionLevel } from "@/entities/article/model/types";
import { cn } from "@/shared/lib/utils";

type EmotionGaugeProps = ComponentProps<"div"> & {
  emotionLevel: EmotionLevel;
};

// ✅ 간소화된 메인 컴포넌트
export default function EmotionGauge({
  emotionLevel,
  className,
  onClick,
}: EmotionGaugeProps) {
  const activeCount = getActiveBlockCount(emotionLevel);
  const label = EMOTION_STATUS.find((e) => e.percent === emotionLevel)?.status || "알 수 없음";

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn("flex items-end", className)} onClick={onClick}>
        {EMOTION_BLOCK_CONFIG.map((config, index) => (
          <EmotionBlock
            key={index}
            isActive={index < activeCount}
            opacity={config.opacity}
            height={config.height}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-xs">{label}</p>
    </div>
  );
}

// ✅ 간소화된 블록 컴포넌트
type EmotionBlockProps = {
  isActive: boolean;
  opacity: number;
  height: number;
};

function EmotionBlock({ isActive, opacity, height }: EmotionBlockProps) {
  return (
    <div className="flex h-4 items-end overflow-hidden">
      <div
        className={cn(
          "w-2 rounded-[4px] bg-zinc-400 shadow-sm transition-all dark:bg-zinc-300",
          isActive ? `h-[${height}%] opacity-${opacity}` : "h-[20%] opacity-25"
        )}
      />
      <div className="w-px" />
    </div>
  );
}
```

#### 3단계: Tailwind 안전 리스트 추가

**파일**: `tailwind.config.ts`

```ts
export default {
  // ...
  safelist: [
    // EmotionGauge에서 동적으로 사용하는 클래스
    'h-[20%]',
    'h-[40%]',
    'h-[60%]',
    'h-[80%]',
    'h-[100%]',
    'opacity-40',
    'opacity-55',
    'opacity-70',
    'opacity-85',
    'opacity-100',
  ],
};
```

**이유**: Tailwind는 정적 분석으로 클래스를 찾기 때문에 동적으로 생성되는 클래스는 safelist에 추가해야 합니다.

#### 4단계: 테스트

```tsx
// 모든 레벨 테스트
<EmotionGauge emotionLevel={0} />   // 1블록
<EmotionGauge emotionLevel={25} />  // 2블록
<EmotionGauge emotionLevel={50} />  // 3블록
<EmotionGauge emotionLevel={75} />  // 4블록
<EmotionGauge emotionLevel={100} /> // 5블록
```

---

## Phase 3: ArticleActionButton 통합

### 현재 문제점

**3개의 거의 동일한 버튼 컴포넌트:**

1. `src/entities/article/ui/article-like-button.tsx`
2. `src/entities/article/ui/article-comment-button.tsx`
3. `src/entities/article/ui/article-report-button.tsx`

```tsx
// ❌ 반복되는 패턴
export const ArticleLikeButton = ({ onClick, likeCount, orientation, isLike }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" onClick={onClick} className={...}>
        <Heart className={cn(isLike && "fill-red-500 text-red-500")} />
        {likeCount ?? 0}
      </Button>
    </TooltipTrigger>
    <TooltipContent>{isLike ? "좋아요 취소" : "좋아요"}</TooltipContent>
  </Tooltip>
);

// ArticleCommentButton도 거의 동일
// ArticleReportButton도 거의 동일
```

### 리팩토링 방안

#### 1단계: 공통 베이스 컴포넌트 생성

**파일**: `src/entities/article/ui/article-action-button.tsx`

```tsx
"use client";

import type { ComponentProps, MouseEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";

type ArticleActionButtonProps = {
  icon: LucideIcon;
  label?: string | number;
  tooltip: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  orientation?: "horizontal" | "vertical";
  isActive?: boolean;
  variant?: "default" | "ghost" | "destructive";
  className?: string;
  iconClassName?: string;
};

/**
 * Article 관련 액션 버튼의 공통 베이스 컴포넌트
 *
 * @example
 * // Like 버튼
 * <ArticleActionButton
 *   icon={Heart}
 *   label={likeCount}
 *   tooltip="좋아요"
 *   isActive={isLiked}
 *   onClick={handleLike}
 * />
 */
export const ArticleActionButton = ({
  icon: Icon,
  label,
  tooltip,
  onClick,
  orientation = "horizontal",
  isActive = false,
  variant = "ghost",
  className,
  iconClassName,
}: ArticleActionButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          onClick={onClick}
          className={cn(
            "flex gap-1 text-xs transition-colors",
            orientation === "horizontal" && "flex-row",
            orientation === "vertical" && "flex-col",
            className
          )}
        >
          <Icon
            className={cn(
              "size-4",
              isActive && "fill-current",
              iconClassName
            )}
          />
          {label !== undefined && label}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};
```

#### 2단계: 개별 버튼 컴포넌트 단순화

**파일**: `src/entities/article/ui/article-like-button.tsx`

```tsx
"use client";

import type { MouseEvent } from "react";
import { Heart } from "lucide-react";
import { ArticleActionButton } from "./article-action-button";

type ArticleLikeButtonProps = {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  likeCount?: number;
  orientation?: "horizontal" | "vertical";
  isLike?: boolean;
};

export const ArticleLikeButton = ({
  onClick,
  likeCount = 0,
  orientation = "horizontal",
  isLike = false,
}: ArticleLikeButtonProps) => {
  return (
    <ArticleActionButton
      icon={Heart}
      label={likeCount}
      tooltip={isLike ? "좋아요 취소" : "좋아요"}
      onClick={onClick}
      orientation={orientation}
      isActive={isLike}
      className="hover:text-red-500"
      iconClassName={isLike ? "text-red-500" : ""}
    />
  );
};
```

**파일**: `src/entities/article/ui/article-comment-button.tsx`

```tsx
"use client";

import type { MouseEvent } from "react";
import { MessageCircle } from "lucide-react";
import { ArticleActionButton } from "./article-action-button";

type ArticleCommentButtonProps = {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
  commentCount?: number;
  orientation?: "horizontal" | "vertical";
};

export const ArticleCommentButton = ({
  onClick,
  commentCount = 0,
  orientation = "horizontal",
}: ArticleCommentButtonProps) => {
  return (
    <ArticleActionButton
      icon={MessageCircle}
      label={commentCount}
      tooltip="댓글"
      onClick={onClick}
      orientation={orientation}
      className="hover:text-blue-400"
    />
  );
};
```

**파일**: `src/entities/article/ui/article-report-button.tsx`

```tsx
"use client";

import type { MouseEvent } from "react";
import { Flag } from "lucide-react";
import { ArticleActionButton } from "./article-action-button";

type ArticleReportButtonProps = {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const ArticleReportButton = ({
  onClick,
}: ArticleReportButtonProps) => {
  return (
    <ArticleActionButton
      icon={Flag}
      tooltip="신고"
      onClick={onClick}
      className="hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950"
    />
  );
};
```

#### 3단계: 사용 예제

```tsx
// Before: 각각 개별 컴포넌트
<ArticleLikeButton onClick={onLike} likeCount={10} isLike={true} />
<ArticleCommentButton onClick={onComment} commentCount={5} />
<ArticleReportButton onClick={onReport} />

// After: 동일하게 작동하지만 내부는 단순화됨
<ArticleLikeButton onClick={onLike} likeCount={10} isLike={true} />
<ArticleCommentButton onClick={onComment} commentCount={5} />
<ArticleReportButton onClick={onReport} />

// 새로운 액션 버튼도 쉽게 추가 가능
<ArticleActionButton
  icon={Share}
  label="공유"
  tooltip="게시글 공유"
  onClick={onShare}
  className="hover:text-green-500"
/>
```

---

## Phase 4: CommentItem 컴파운드 패턴

### 현재 문제점

**파일**: `src/entities/comment/ui/comment-item.tsx`

```tsx
// ❌ 문제점: 113줄, 모든 로직이 한 컴포넌트에
export const CommentItem = ({ comment, isAuthor, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleUpdate = () => { ... };
  const handleCancel = () => { ... };

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <UserAvatar ... />

      <div className="flex flex-1 flex-col gap-2">
        {/* Header with dropdown */}
        <div className="flex items-center justify-between">
          <div>...</div>
          {isAuthor && !isEditing && (
            <DropdownMenu>...</DropdownMenu>
          )}
        </div>

        {/* Body (view or edit) */}
        {isEditing ? (
          <div>...</div>
        ) : (
          <p>...</p>
        )}

        {/* Edit buttons */}
        {isEditing && (
          <div>...</div>
        )}
      </div>
    </div>
  );
};
```

### 리팩토링 방안

#### 1단계: 컴파운드 컴포넌트 구조

**파일**: `src/entities/comment/ui/comment-item.tsx`

```tsx
"use client";

import type { ComponentProps } from "react";
import { cn } from "@/shared/lib/utils";

// ✅ 1. 부모 컨테이너
type CommentItemProps = ComponentProps<"div">;

const CommentItem = ({ children, className, ...props }: CommentItemProps) => {
  return (
    <div className={cn("flex gap-3", className)} {...props}>
      {children}
    </div>
  );
};

// ✅ 2. Avatar
type CommentItemAvatarProps = {
  avatarUrl?: string | null;
  userName: string;
};

const CommentItemAvatar = ({ avatarUrl, userName }: CommentItemAvatarProps) => {
  return (
    <UserAvatar
      avatarUrl={avatarUrl}
      fallback={userName?.[0] || "U"}
      size="sm"
    />
  );
};

// ✅ 3. Content (본문 컨테이너)
type CommentItemContentProps = ComponentProps<"div">;

const CommentItemContent = ({ children, className, ...props }: CommentItemContentProps) => {
  return (
    <div className={cn("flex flex-1 flex-col gap-2", className)} {...props}>
      {children}
    </div>
  );
};

// ✅ 4. Header
type CommentItemHeaderProps = {
  userName: string;
  createdAt: Date | string;
  actions?: React.ReactNode;
};

const CommentItemHeader = ({ userName, createdAt, actions }: CommentItemHeaderProps) => {
  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "방금 전";
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;

    return d.toLocaleDateString("ko-KR");
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        <span className="font-medium text-sm">{userName}</span>
        <span className="text-muted-foreground text-xs">
          {formatDate(createdAt)}
        </span>
      </div>
      {actions}
    </div>
  );
};

// ✅ 5. Body (텍스트 표시)
type CommentItemBodyProps = {
  content: string;
  className?: string;
};

const CommentItemBody = ({ content, className }: CommentItemBodyProps) => {
  return (
    <p className={cn("whitespace-pre-wrap text-sm", className)}>
      {content}
    </p>
  );
};

// ✅ 6. EditForm (편집 폼)
type CommentItemEditFormProps = {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
};

const CommentItemEditForm = ({
  value,
  onChange,
  onSave,
  onCancel,
  isSaving = false,
}: CommentItemEditFormProps) => {
  return (
    <>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="댓글을 입력하세요"
        className="min-h-[80px] resize-none"
        disabled={isSaving}
      />
      <div className="flex justify-end gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          취소
        </Button>
        <Button
          size="sm"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </>
  );
};

// ✅ 7. Actions (드롭다운 메뉴)
type CommentItemActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

const CommentItemActions = ({ onEdit, onDelete }: CommentItemActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-6">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 size-4" />
          수정
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-destructive">
          <Trash className="mr-2 size-4" />
          삭제
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// 하위 컴포넌트 연결
CommentItem.Avatar = CommentItemAvatar;
CommentItem.Content = CommentItemContent;
CommentItem.Header = CommentItemHeader;
CommentItem.Body = CommentItemBody;
CommentItem.EditForm = CommentItemEditForm;
CommentItem.Actions = CommentItemActions;

export { CommentItem };
```

#### 2단계: 사용 예제

**기존 comment-item.tsx를 comment-list-item.tsx로 변경:**

**파일**: `src/entities/comment/ui/comment-list-item.tsx`

```tsx
"use client";

import { useState } from "react";
import type { Comment } from "@/entities/comment/model/types";
import { CommentItem } from "./comment-item";

type CommentListItemProps = {
  comment: Comment;
  isAuthor: boolean;
  onUpdate: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
};

/**
 * 상태 관리를 포함한 CommentItem 래퍼
 * CommentItem 컴파운드 컴포넌트를 조합하여 사용
 */
export const CommentListItem = ({
  comment,
  isAuthor,
  onUpdate,
  onDelete,
}: CommentListItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isSaving, setIsSaving] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(comment.content);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleSave = async () => {
    if (!editContent.trim()) return;

    setIsSaving(true);
    try {
      await onUpdate(comment.id, editContent);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (confirm("댓글을 삭제하시겠습니까?")) {
      onDelete(comment.id);
    }
  };

  return (
    <CommentItem>
      <CommentItem.Avatar
        avatarUrl={comment.author?.avatarUrl}
        userName={comment.author?.userName || "익명"}
      />

      <CommentItem.Content>
        <CommentItem.Header
          userName={comment.author?.userName || "익명"}
          createdAt={comment.createdAt}
          actions={
            isAuthor && !isEditing ? (
              <CommentItem.Actions
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : null
          }
        />

        {isEditing ? (
          <CommentItem.EditForm
            value={editContent}
            onChange={setEditContent}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
          />
        ) : (
          <CommentItem.Body content={comment.content} />
        )}
      </CommentItem.Content>
    </CommentItem>
  );
};
```

#### 3단계: CommentList에서 사용

**파일**: `src/entities/comment/ui/comment-list.tsx`

```tsx
// Before
import { CommentItem } from "./comment-item";

// After
import { CommentListItem } from "./comment-list-item";

export const CommentList = ({ comments, currentUserId, onUpdate, onDelete }) => {
  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentListItem
          key={comment.id}
          comment={comment}
          isAuthor={currentUserId === comment.userId}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
```

#### 4단계: 새로운 레이아웃도 쉽게 작성 가능

```tsx
// 예: 간단한 댓글 미리보기 (편집 기능 없음)
const CommentPreview = ({ comment }: { comment: Comment }) => {
  return (
    <CommentItem className="p-2 hover:bg-accent">
      <CommentItem.Avatar
        avatarUrl={comment.author?.avatarUrl}
        userName={comment.author?.userName || "익명"}
      />
      <CommentItem.Content>
        <CommentItem.Header
          userName={comment.author?.userName || "익명"}
          createdAt={comment.createdAt}
        />
        <CommentItem.Body content={comment.content} />
      </CommentItem.Content>
    </CommentItem>
  );
};
```

---

## Phase 5: ArticleCard Props 그룹화

### 현재 문제점

**파일**: `src/widgets/article-card/ui/article-card.tsx`

```tsx
// ❌ 문제점: 17개의 props가 평면적으로 나열
type ArticleCardProps = {
  // User 관련 (5개)
  userId: string;
  userName: string;
  avatarUrl: string | null;
  email: string;
  aboutMe: string;

  // Article 관련 (7개)
  title: string;
  content: string;
  createdAt: Date;
  emotionLevel: number;
  accessType: AccessType;
  likeCount: number;
  commentCount: number;

  // Interaction 관련 (2개)
  isMe: boolean;
  isLiked: boolean;

  // Handlers (3개)
  onClick: () => void;
  onLike: () => void;
  onReport: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const ArticleCard = ({
  userId, userName, avatarUrl, email, aboutMe,
  emotionLevel, isMe, title, content, accessType,
  createdAt, likeCount, isLiked, commentCount,
  onClick, onLike, onReport,
}: ArticleCardProps) => {
  // ...
};
```

### 리팩토링 방안

#### 1단계: 타입 정의 분리

**파일**: `src/widgets/article-card/model/types.ts`

```tsx
import type { AccessType } from "@/entities/article/model/types";
import type { MouseEvent } from "react";

// ✅ Article 정보 그룹
export type ArticleCardArticle = {
  id: string;
  title: string;
  content: string;
  emotionLevel: number;
  accessType: AccessType;
  createdAt: Date;
  likeCount: number;
  isLiked: boolean;
  commentCount: number;
};

// ✅ Author 정보 그룹
export type ArticleCardAuthor = {
  id: string;
  userName: string;
  email: string;
  aboutMe: string;
  avatarUrl: string | null;
};

// ✅ 현재 사용자 정보 그룹
export type ArticleCardCurrentUser = {
  id: string | null;
  isAuthor: boolean;
};

// ✅ 이벤트 핸들러 그룹
export type ArticleCardHandlers = {
  onClick: () => void;
  onLike: () => void;
  onReport: (e: MouseEvent<HTMLButtonElement>) => void;
};

// ✅ 최종 Props
export type ArticleCardProps = {
  article: ArticleCardArticle;
  author: ArticleCardAuthor;
  currentUser: ArticleCardCurrentUser;
  handlers: ArticleCardHandlers;
};
```

#### 2단계: ArticleCard 컴포넌트 수정

**파일**: `src/widgets/article-card/ui/article-card.tsx`

```tsx
"use client";

import { ArticleContent } from "@/entities/article/ui/article-content";
import { ArticleFooter } from "@/entities/article/ui/article-footer";
import { ArticleHeader } from "@/entities/article/ui/article-header";
import { FollowButton } from "@/entities/follow/ui/follow-button";
import { UserInfo } from "@/entities/user/ui/user-info";
import { ProfileNavigationButtons } from "@/features/profile/ui/profile-navigation-buttons";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import type { ArticleCardProps } from "../model/types";

// ✅ Props가 4개의 그룹으로 정리됨
export const ArticleCard = ({
  article,
  author,
  currentUser,
  handlers,
}: ArticleCardProps) => {
  return (
    <div className="flex flex-col gap-2">
      {/* User Info Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <ArticleHeader
            userName={author.userName}
            avatarUrl={author.avatarUrl}
            email={author.email}
            emotionLevel={article.emotionLevel}
            createdAt={article.createdAt}
          />
        </PopoverTrigger>
        <PopoverContent>
          <UserInfo className="w-full items-center p-4">
            <UserInfo.Avatar
              avatarUrl={author.avatarUrl}
              fallback={author.userName}
              size="xl"
            />
            <UserInfo.Details>
              <UserInfo.Name>{author.userName}</UserInfo.Name>
              <UserInfo.Email>{author.email}</UserInfo.Email>
              <UserInfo.Bio>{author.aboutMe}</UserInfo.Bio>
            </UserInfo.Details>
            <UserInfo.Actions className="flex-col">
              <FollowButton
                isFollowing={false}
                isMe={currentUser.isAuthor}
                isPending={false}
                onFollow={() => null}
              />
              <ProfileNavigationButtons
                isMe={currentUser.isAuthor}
                onViewProfile={() => null}
              />
            </UserInfo.Actions>
          </UserInfo>
        </PopoverContent>
      </Popover>

      {/* Article Card */}
      <Card onClick={handlers.onClick} className="cursor-pointer select-none pb-4">
        <CardContent>
          <ArticleContent title={article.title} content={article.content} />
        </CardContent>
        <CardFooter>
          <ArticleFooter
            isLiked={article.isLiked}
            likeCount={article.likeCount}
            onLike={handlers.onLike}
            commentCount={article.commentCount}
            accessType={article.accessType}
            onReport={handlers.onReport}
          />
        </CardFooter>
      </Card>
    </div>
  );
};
```

#### 3단계: InfiniteArticleList 수정

**파일**: `src/widgets/article-list/ui/infinite-article-list.tsx`

```tsx
// Before: 17개 props를 일일이 전달
<ArticleCard
  key={id}
  userId={author?.id ?? ""}
  userName={author?.userName ?? ""}
  avatarUrl={author?.avatarUrl ?? null}
  email={author?.email ?? ""}
  aboutMe={author?.aboutMe ?? ""}
  emotionLevel={emotionLevel}
  isMe={isMe}
  title={title}
  content={content}
  accessType={accessType}
  createdAt={createdAt}
  likeCount={likeCount}
  isLiked={isLiked}
  commentCount={commentCount}
  onClick={handleClick}
  onLike={handleLike}
  onReport={handleReport}
/>

// After: 4개의 그룹으로 전달
<ArticleCard
  key={article.id}
  article={{
    id: article.id,
    title: article.title,
    content: article.content,
    emotionLevel: article.emotionLevel,
    accessType: article.accessType,
    createdAt: article.createdAt,
    likeCount: article.likeCount,
    isLiked: article.isLiked,
    commentCount: article.commentCount,
  }}
  author={{
    id: article.author?.id ?? "",
    userName: article.author?.userName ?? "",
    email: article.author?.email ?? "",
    aboutMe: article.author?.aboutMe ?? "",
    avatarUrl: article.author?.avatarUrl ?? null,
  }}
  currentUser={{
    id: currentUserId,
    isAuthor: currentUserId === article.author?.id,
  }}
  handlers={{
    onClick: () => router.push(ROUTES.ARTICLE.VIEW(article.id)),
    onLike: () => onLike(article.id, currentUserId),
    onReport: (e) => onReport(e, article.id),
  }}
/>
```

#### 4단계: 더 나은 추상화 (선택사항)

**파일**: `src/widgets/article-list/lib/use-article-card-props.ts`

```tsx
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import type { ArticleCardProps } from "@/widgets/article-card/model/types";
import type { Article } from "@/entities/article/model/types";
import { ROUTES } from "@/shared/model/routes";

/**
 * Article 데이터를 ArticleCard props로 변환하는 hook
 */
export const useArticleCardProps = (
  article: Article,
  currentUserId: string | null,
  onLike: (articleId: string, userId: string | null) => void,
  onReport: (e: React.MouseEvent, articleId: string) => void
): ArticleCardProps => {
  const router = useRouter();

  return useMemo(
    () => ({
      article: {
        id: article.id,
        title: article.title,
        content: article.content,
        emotionLevel: article.emotionLevel,
        accessType: article.accessType,
        createdAt: article.createdAt,
        likeCount: article.likeCount,
        isLiked: article.isLiked,
        commentCount: article.commentCount,
      },
      author: {
        id: article.author?.id ?? "",
        userName: article.author?.userName ?? "",
        email: article.author?.email ?? "",
        aboutMe: article.author?.aboutMe ?? "",
        avatarUrl: article.author?.avatarUrl ?? null,
      },
      currentUser: {
        id: currentUserId,
        isAuthor: currentUserId === article.author?.id,
      },
      handlers: {
        onClick: () => router.push(ROUTES.ARTICLE.VIEW(article.id)),
        onLike: () => onLike(article.id, currentUserId),
        onReport: (e) => onReport(e, article.id),
      },
    }),
    [article, currentUserId, router, onLike, onReport]
  );
};
```

**사용:**

```tsx
// InfiniteArticleList에서
const cardProps = useArticleCardProps(article, currentUserId, onLike, onReport);

return <ArticleCard {...cardProps} />;
```

---

## Phase 6: ArticleHeader 컴파운드 패턴

### 현재 문제점

**파일**: `src/entities/article/ui/article-header.tsx`

```tsx
// ❌ 문제점: 레이아웃이 고정됨
export const ArticleHeader = ({
  userName,
  avatarUrl,
  email,
  emotionLevel,
  createdAt,
  className,
}: ArticleCardHeaderProps) => {
  return (
    <header className={cn("flex items-end justify-between", className)}>
      <div className="flex gap-4">
        <UserAvatar fallback={userName || "U"} avatarUrl={avatarUrl} />
        <ArticleUserInfo
          userName={userName || ""}
          email={email || ""}
          createdAt={createdAt}
        />
      </div>
      <EmotionGauge emotionLevel={emotionLevel} />
    </header>
  );
};
```

**문제점:**
- 항상 UserAvatar + UserInfo가 왼쪽, EmotionGauge가 오른쪽
- 중간에 다른 요소를 넣을 수 없음
- 세로 레이아웃으로 변경 불가능

### 리팩토링 방안

#### 1단계: 컴파운드 패턴 적용

**파일**: `src/entities/article/ui/article-header.tsx`

```tsx
"use client";

import type { ComponentProps } from "react";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { ArticleUserInfo } from "./article-user-info";
import EmotionGauge from "./emotion-gauge";
import type { EmotionLevel } from "@/entities/article/model/types";
import { cn } from "@/shared/lib/utils";

// ✅ 1. 부모 컨테이너 (레이아웃 자유)
type ArticleHeaderProps = ComponentProps<"header">;

const ArticleHeader = ({ children, className, ...props }: ArticleHeaderProps) => {
  return (
    <header
      className={cn("flex items-end justify-between", className)}
      {...props}
    >
      {children}
    </header>
  );
};

// ✅ 2. User 섹션 (Avatar + UserInfo)
type ArticleHeaderUserProps = {
  userName: string;
  avatarUrl?: string | null;
  email: string;
  createdAt?: Date;
  className?: string;
};

const ArticleHeaderUser = ({
  userName,
  avatarUrl,
  email,
  createdAt,
  className,
}: ArticleHeaderUserProps) => {
  return (
    <div className={cn("flex gap-4", className)}>
      <UserAvatar fallback={userName || "U"} avatarUrl={avatarUrl} />
      <ArticleUserInfo
        userName={userName || ""}
        email={email || ""}
        createdAt={createdAt}
      />
    </div>
  );
};

// ✅ 3. Emotion 섹션
type ArticleHeaderEmotionProps = {
  emotionLevel: EmotionLevel;
  onClick?: () => void;
  className?: string;
};

const ArticleHeaderEmotion = ({
  emotionLevel,
  onClick,
  className,
}: ArticleHeaderEmotionProps) => {
  return <EmotionGauge emotionLevel={emotionLevel} onClick={onClick} className={className} />;
};

// 하위 컴포넌트 연결
ArticleHeader.User = ArticleHeaderUser;
ArticleHeader.Emotion = ArticleHeaderEmotion;

export { ArticleHeader };

// ✅ 4. 레거시 지원 (선택사항)
/**
 * @deprecated Use ArticleHeader compound pattern instead
 * @example
 * <ArticleHeader>
 *   <ArticleHeader.User userName="..." email="..." avatarUrl="..." />
 *   <ArticleHeader.Emotion emotionLevel={75} />
 * </ArticleHeader>
 */
export const ArticleHeaderLegacy = ({
  userName,
  avatarUrl,
  email,
  emotionLevel,
  createdAt,
  className,
}: any) => {
  return (
    <ArticleHeader className={className}>
      <ArticleHeader.User
        userName={userName}
        avatarUrl={avatarUrl}
        email={email}
        createdAt={createdAt}
      />
      <ArticleHeader.Emotion emotionLevel={emotionLevel} />
    </ArticleHeader>
  );
};
```

#### 2단계: 사용 예제

**예제 1: 기본 레이아웃 (기존과 동일)**

```tsx
<ArticleHeader>
  <ArticleHeader.User
    userName="홍길동"
    email="hong@example.com"
    avatarUrl={null}
    createdAt={new Date()}
  />
  <ArticleHeader.Emotion emotionLevel={75} />
</ArticleHeader>
```

**예제 2: 세로 레이아웃**

```tsx
<ArticleHeader className="flex-col items-start gap-2">
  <ArticleHeader.Emotion emotionLevel={75} />
  <ArticleHeader.User
    userName="홍길동"
    email="hong@example.com"
    avatarUrl={null}
  />
</ArticleHeader>
```

**예제 3: Emotion을 클릭 가능하게**

```tsx
<ArticleHeader>
  <ArticleHeader.User {...userProps} />
  <ArticleHeader.Emotion
    emotionLevel={emotionLevel}
    onClick={handleEmotionClick}
  />
</ArticleHeader>
```

**예제 4: 중간에 다른 요소 추가**

```tsx
<ArticleHeader className="flex-wrap gap-4">
  <ArticleHeader.User {...userProps} />
  <Badge>인기</Badge>
  <ArticleHeader.Emotion emotionLevel={100} />
</ArticleHeader>
```

#### 3단계: 마이그레이션

**찾기:**
```bash
grep -r "ArticleHeader" src/ --include="*.tsx"
```

**대상 파일:**
- `src/app/(home)/write/page.tsx`
- `src/views/article/article-edit-page-view.tsx`
- `src/views/article/article-detail-page-content.tsx`
- `src/widgets/article-card/ui/article-card.tsx`

**변경 전:**
```tsx
<ArticleHeader
  userName={me?.userName ?? ""}
  avatarUrl={me?.avatarUrl ?? ""}
  email={me?.email ?? ""}
  emotionLevel={emotionLevel}
/>
```

**변경 후:**
```tsx
<ArticleHeader>
  <ArticleHeader.User
    userName={me?.userName ?? ""}
    avatarUrl={me?.avatarUrl ?? ""}
    email={me?.email ?? ""}
  />
  <ArticleHeader.Emotion emotionLevel={emotionLevel} />
</ArticleHeader>
```

---

## 마이그레이션 체크리스트

### Phase 1: UserInfo 컴파운드 패턴

- [ ] `src/entities/user/ui/user-info.tsx` 파일 생성
- [ ] UserInfo 컴포넌트와 하위 컴포넌트 구현
- [ ] `src/widgets/article-card/ui/article-card.tsx` 수정
- [ ] `src/views/article/article-detail-page-content.tsx` 수정
- [ ] `src/widgets/profile-card/ui/profile-card.tsx` 수정
- [ ] `src/views/profile/profile-page-view.tsx`에서 활용
- [ ] 모든 사용처 테스트
- [ ] `user-info-base.tsx`를 deprecated 표시

### Phase 2: EmotionGauge 간소화

- [ ] `src/entities/article/model/emotion-config.ts` 파일 생성
- [ ] EMOTION_BLOCK_CONFIG 상수 정의
- [ ] getActiveBlockCount 함수 구현
- [ ] `emotion-gauge.tsx` 리팩토링
- [ ] `tailwind.config.ts`에 safelist 추가
- [ ] 모든 emotion level 테스트 (0, 25, 50, 75, 100)

### Phase 3: ArticleActionButton 통합

- [ ] `src/entities/article/ui/article-action-button.tsx` 파일 생성
- [ ] ArticleActionButton 베이스 컴포넌트 구현
- [ ] `article-like-button.tsx` 단순화
- [ ] `article-comment-button.tsx` 단순화
- [ ] `article-report-button.tsx` 단순화
- [ ] 모든 버튼 테스트

### Phase 4: CommentItem 컴파운드 패턴

- [ ] `src/entities/comment/ui/comment-item.tsx` 리팩토링
- [ ] 컴파운드 패턴 적용 (Avatar, Content, Header, Body, EditForm, Actions)
- [ ] `comment-list-item.tsx` 파일 생성 (상태 관리 포함)
- [ ] `comment-list.tsx`에서 CommentListItem 사용
- [ ] 모든 댓글 기능 테스트 (보기, 수정, 삭제)

### Phase 5: ArticleCard Props 그룹화

- [ ] `src/widgets/article-card/model/types.ts` 파일 생성
- [ ] Props 타입 그룹화 (Article, Author, CurrentUser, Handlers)
- [ ] `article-card.tsx` Props 변경
- [ ] `infinite-article-list.tsx` 호출 부분 수정
- [ ] (선택) `use-article-card-props.ts` hook 생성
- [ ] 모든 Article 표시 테스트

### Phase 6: ArticleHeader 컴파운드 패턴

- [ ] `article-header.tsx` 컴파운드 패턴 적용
- [ ] ArticleHeader.User 구현
- [ ] ArticleHeader.Emotion 구현
- [ ] `write/page.tsx` 수정
- [ ] `article-edit-page-view.tsx` 수정
- [ ] `article-detail-page-content.tsx` 수정
- [ ] `article-card.tsx` 수정
- [ ] (선택) ArticleHeaderLegacy 구현
- [ ] 모든 Article Header 테스트

---

## 테스트 가이드

### 각 Phase별 테스트 항목

#### Phase 1: UserInfo
- [ ] ArticleCard Popover에서 사용자 정보 표시
- [ ] ProfilePage에서 중앙 정렬 레이아웃
- [ ] 다양한 아바타 크기 (sm, md, lg, xl)
- [ ] aboutMe가 없는 경우 처리

#### Phase 2: EmotionGauge
- [ ] 모든 레벨 렌더링 (0, 25, 50, 75, 100)
- [ ] 블록 애니메이션 동작
- [ ] 라벨 표시 정확성
- [ ] 다크 모드 스타일

#### Phase 3: ArticleActionButton
- [ ] Like 버튼 (활성/비활성)
- [ ] Comment 버튼
- [ ] Report 버튼
- [ ] Tooltip 표시
- [ ] orientation (horizontal/vertical)

#### Phase 4: CommentItem
- [ ] 댓글 표시
- [ ] 댓글 수정 (작성자만)
- [ ] 댓글 삭제 (작성자만)
- [ ] 날짜 포맷팅
- [ ] 빈 내용 방어 처리

#### Phase 5: ArticleCard
- [ ] 기존과 동일한 렌더링
- [ ] Popover 동작
- [ ] Like/Report 액션
- [ ] 클릭 시 상세 페이지 이동

#### Phase 6: ArticleHeader
- [ ] 기본 레이아웃
- [ ] 다양한 레이아웃 (세로, 가로)
- [ ] Emotion 클릭 이벤트
- [ ] createdAt 표시

---

## 참고 자료

### shadcn 컴파운드 패턴 예제

**Card:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

**Alert:**
```tsx
<Alert>
  <AlertTitle>Title</AlertTitle>
  <AlertDescription>Description</AlertDescription>
</Alert>
```

**Accordion:**
```tsx
<Accordion>
  <AccordionItem>
    <AccordionTrigger>Trigger</AccordionTrigger>
    <AccordionContent>Content</AccordionContent>
  </AccordionItem>
</Accordion>
```

### 추가 리팩토링 고려사항

1. **날짜 포맷팅 유틸 통합**
   - 현재 여러 곳에서 중복된 날짜 포맷팅 로직
   - `src/shared/lib/date-utils.ts` 생성 고려

2. **InfiniteArticleList 최적화**
   - useCallback으로 핸들러 메모이제이션
   - React.memo로 ArticleCard 최적화

3. **공통 orientation prop**
   - 여러 컴포넌트에서 반복되는 orientation
   - 공통 타입으로 추출 고려

4. **접근성 (a11y) 개선**
   - aria-label 추가
   - 키보드 네비게이션
   - 스크린 리더 지원

---

## 완료 후 기대 효과

### 코드 품질

- **Props 수**: 평균 60% 감소
- **코드 라인 수**: 30-40% 감소
- **중복 코드**: 70% 감소

### 유지보수성

- 컴포넌트 구조가 명확하여 신규 개발자 온보딩 용이
- 변경 시 영향 범위 최소화
- 버그 수정이 빠르고 안전

### 확장성

- 새로운 레이아웃 추가 용이
- 다른 프로젝트에도 컴포넌트 재사용 가능
- 디자인 시스템 구축 기반 마련

### 성능

- 불필요한 리렌더링 감소
- 메모이제이션 적용 용이
- 번들 크기 최적화

---

## 질문 & 답변

### Q1: 기존 UserInfoBase를 바로 삭제해야 하나요?
A: 아니요. deprecated 표시 후 점진적으로 마이그레이션하세요. 모든 사용처가 변경된 후 삭제합니다.

### Q2: 컴파운드 패턴이 항상 좋은가요?
A: 아니요. 단순한 컴포넌트는 기존 방식이 더 나을 수 있습니다. 다음 경우에 적용하세요:
- 여러 레이아웃이 필요한 경우
- 하위 요소 순서/구성이 유동적인 경우
- 확장성이 중요한 경우

### Q3: TypeScript 타입 에러가 발생하면?
A: 먼저 `npx tsc --noEmit`으로 확인하세요. ComponentProps<"div">를 올바르게 사용했는지 확인합니다.

### Q4: 성능 문제가 생기면?
A: React DevTools Profiler로 측정 후 React.memo, useMemo, useCallback을 적용하세요.

### Q5: 각 Phase는 순서대로 해야 하나요?
A: Phase 1, 2, 3는 독립적이므로 순서 상관없습니다. Phase 4, 5, 6은 Phase 1, 3 완료 후 진행하는 것이 좋습니다.

---

마지막 업데이트: 2025-01-11
