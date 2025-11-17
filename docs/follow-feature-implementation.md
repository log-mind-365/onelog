# 팔로우 기능 구현 가이드

## 목차
1. [개요](#개요)
2. [아키텍처 설계](#아키텍처-설계)
3. [데이터베이스 스키마](#데이터베이스-스키마)
4. [구현 단계](#구현-단계)
5. [파일 구조](#파일-구조)
6. [코드 구현](#코드-구현)
7. [UI 통합](#ui-통합)
8. [테스트 포인트](#테스트-포인트)

---

## 개요

### 기능 요구사항
- 사용자 간 팔로우/언팔로우
- 팔로워/팔로잉 목록 조회
- 팔로워/팔로잉 수 표시
- 실시간 UI 업데이트 (Optimistic Updates)
- 자기 자신 팔로우 방지

### 기술 스택
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **State Management**: TanStack Query v5
- **Architecture**: Feature-Sliced Design (FSD)

---

## 아키텍처 설계

### FSD 레이어 구조
```
src/
├── db/
│   └── schemas/
│       └── user-follows.ts          # DB 스키마
├── entities/
│   └── follow/
│       ├── api/
│       │   ├── client.ts            # Server Actions
│       │   └── queries.ts           # TanStack Query 정의
│       ├── model/
│       │   ├── types.ts             # 타입 정의
│       │   └── constants.ts         # 상수 (쿼리 키, 메시지)
│       └── ui/
│           └── follow-button.tsx    # 팔로우 버튼 컴포넌트
├── features/
│   └── follow/
│       ├── lib/
│       │   └── use-follow-user.ts   # Custom Hook (mutation)
│       └── ui/
│           ├── followers-modal.tsx  # 팔로워 목록 모달
│           └── following-modal.tsx  # 팔로잉 목록 모달
└── entities/user/
    ├── model/types.ts               # UserInfoWithStats 추가
    └── api/
        ├── client.ts                # getUserInfoWithStats 추가
        └── queries.ts               # 쿼리 정의 추가
```

### 데이터 흐름
```
User Action → useFollowUser Hook → toggleFollow Server Action
                ↓
        Optimistic Update (즉시 UI 반영)
                ↓
        Server Response
                ↓
   Success: Toast / Error: Rollback
                ↓
        Query Invalidation (최신 데이터 fetch)
```

---

## 데이터베이스 스키마

### 1. user_follows 테이블 스키마

**파일**: `src/db/schemas/user-follows.ts`

```typescript
import { sql } from "drizzle-orm";
import {
  pgPolicy,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authenticatedRole, authUsers } from "drizzle-orm/supabase";

export const userFollows = pgTable(
  "user_follows",
  {
    id: uuid("id").defaultRandom().notNull(),
    followerId: uuid("follower_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    followingId: uuid("following_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    // Composite Primary Key: 동일한 팔로우 관계 중복 방지
    primaryKey({ columns: [table.followerId, table.followingId] }),

    // RLS Policies
    pgPolicy("anyone can select user follows", {
      for: "select",
      to: "public",
      using: sql`true`,
    }),
    pgPolicy("authenticated can insert user follows", {
      for: "insert",
      to: authenticatedRole,
      withCheck: sql`follower_id = auth.uid()`,
    }),
    pgPolicy("authenticated can delete own user follows", {
      for: "delete",
      to: authenticatedRole,
      using: sql`follower_id = auth.uid()`,
    }),
  ],
);
```

**핵심 포인트**:
- `composite primary key`: (followerId, followingId) 조합으로 중복 방지
- `cascade delete`: 사용자 삭제 시 관련 팔로우 관계도 자동 삭제
- `RLS policies`: 누구나 읽기 가능, 본인만 생성/삭제 가능

---

## 구현 단계

### Phase 1: Database Layer

#### 1-1. 스키마 파일 생성
위의 `user-follows.ts` 파일을 생성합니다.

#### 1-2. 마이그레이션
```bash
# 마이그레이션 파일 생성
bun db:generate

# 마이그레이션 적용
bun db:migrate
```

---

### Phase 2: Follow Entity - Model

#### 2-1. 타입 정의

**파일**: `src/entities/follow/model/types.ts`

```typescript
import type { userFollows } from "@/db/schemas/user-follows";
import type { profiles } from "@/db/schemas/profiles";

// 기본 타입
export type UserFollow = typeof userFollows.$inferSelect;

// 팔로워 정보 (프로필 포함)
export type FollowerWithProfile = {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
  follower: typeof profiles.$inferSelect;
};

// 팔로잉 정보 (프로필 포함)
export type FollowingWithProfile = {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: Date;
  following: typeof profiles.$inferSelect;
};

// 팔로우 통계
export type FollowStats = {
  followerCount: number;
  followingCount: number;
};

// toggleFollow 반환 타입
export type ToggleFollowResult = {
  isFollowing: boolean;
  followerCount: number;
};
```

#### 2-2. 상수 정의

**파일**: `src/entities/follow/model/constants.ts`

```typescript
export const FOLLOW_QUERY_KEY = {
  FOLLOWER_COUNT: (userId: string) => ["follow", "follower-count", userId],
  FOLLOWING_COUNT: (userId: string) => ["follow", "following-count", userId],
  IS_FOLLOWING: (followerId: string | null, followingId: string) => [
    "follow",
    "status",
    followerId,
    followingId,
  ],
  FOLLOWERS: (userId: string) => ["follow", "followers", userId],
  FOLLOWING: (userId: string) => ["follow", "following", userId],
  STATS: (userId: string) => ["follow", "stats", userId],
} as const;

export const FOLLOW_TOAST_MESSAGE = {
  FOLLOW: {
    SUCCESS: "팔로우했습니다.",
    EXCEPTION: "팔로우 처리 중 오류가 발생했습니다.",
  },
  UNFOLLOW: {
    SUCCESS: "언팔로우했습니다.",
    EXCEPTION: "언팔로우 처리 중 오류가 발생했습니다.",
  },
} as const;
```

---

### Phase 3: Follow Entity - API (Server Actions)

**파일**: `src/entities/follow/api/client.ts`

```typescript
"use server";

import { and, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { userFollows } from "@/db/schemas/user-follows";
import { profiles } from "@/db/schemas/profiles";
import type {
  FollowerWithProfile,
  FollowingWithProfile,
  FollowStats,
  ToggleFollowResult,
} from "@/entities/follow/model/types";

/**
 * 팔로우/언팔로우 토글
 */
export const toggleFollow = async (
  followerId: string,
  followingId: string,
): Promise<ToggleFollowResult> => {
  // 자기 자신 팔로우 방지
  if (followerId === followingId) {
    throw new Error("자기 자신을 팔로우할 수 없습니다.");
  }

  // 기존 팔로우 관계 확인
  const existingFollow = await db
    .select()
    .from(userFollows)
    .where(
      and(
        eq(userFollows.followerId, followerId),
        eq(userFollows.followingId, followingId),
      ),
    )
    .then((rows) => rows[0]);

  if (existingFollow) {
    // 언팔로우
    await db
      .delete(userFollows)
      .where(
        and(
          eq(userFollows.followerId, followerId),
          eq(userFollows.followingId, followingId),
        ),
      );
  } else {
    // 팔로우
    await db.insert(userFollows).values({
      followerId,
      followingId,
    });
  }

  // 업데이트된 팔로워 수 조회
  const followerCount = await getFollowerCount(followingId);

  return {
    isFollowing: !existingFollow,
    followerCount,
  };
};

/**
 * 특정 사용자의 팔로워 수 조회
 */
export const getFollowerCount = async (userId: string): Promise<number> => {
  const result = await db
    .select({ count: count() })
    .from(userFollows)
    .where(eq(userFollows.followingId, userId))
    .then((rows) => rows[0]);

  return result?.count ?? 0;
};

/**
 * 특정 사용자의 팔로잉 수 조회
 */
export const getFollowingCount = async (userId: string): Promise<number> => {
  const result = await db
    .select({ count: count() })
    .from(userFollows)
    .where(eq(userFollows.followerId, userId))
    .then((rows) => rows[0]);

  return result?.count ?? 0;
};

/**
 * 팔로우 상태 확인
 */
export const checkIsFollowing = async (
  followerId: string | null,
  followingId: string,
): Promise<boolean> => {
  if (!followerId) return false;
  if (followerId === followingId) return false;

  const result = await db
    .select()
    .from(userFollows)
    .where(
      and(
        eq(userFollows.followerId, followerId),
        eq(userFollows.followingId, followingId),
      ),
    )
    .then((rows) => rows[0]);

  return !!result;
};

/**
 * 팔로워/팔로잉 통계 조회
 */
export const getFollowStats = async (userId: string): Promise<FollowStats> => {
  const [followerCount, followingCount] = await Promise.all([
    getFollowerCount(userId),
    getFollowingCount(userId),
  ]);

  return {
    followerCount,
    followingCount,
  };
};

/**
 * 팔로워 목록 조회 (프로필 정보 포함)
 */
export const getFollowers = async (
  userId: string,
): Promise<FollowerWithProfile[]> => {
  return db
    .select({
      id: userFollows.id,
      followerId: userFollows.followerId,
      followingId: userFollows.followingId,
      createdAt: userFollows.createdAt,
      follower: profiles,
    })
    .from(userFollows)
    .leftJoin(profiles, eq(userFollows.followerId, profiles.id))
    .where(eq(userFollows.followingId, userId))
    .orderBy(desc(userFollows.createdAt));
};

/**
 * 팔로잉 목록 조회 (프로필 정보 포함)
 */
export const getFollowing = async (
  userId: string,
): Promise<FollowingWithProfile[]> => {
  return db
    .select({
      id: userFollows.id,
      followerId: userFollows.followerId,
      followingId: userFollows.followingId,
      createdAt: userFollows.createdAt,
      following: profiles,
    })
    .from(userFollows)
    .leftJoin(profiles, eq(userFollows.followingId, profiles.id))
    .where(eq(userFollows.followerId, userId))
    .orderBy(desc(userFollows.createdAt));
};
```

**핵심 패턴**:
- `toggleFollow`: 기존 관계 확인 → 있으면 삭제, 없으면 생성
- `LEFT JOIN`: 프로필 정보와 함께 조회
- 자기 자신 팔로우 방지 로직

---

### Phase 4: Follow Entity - Queries

**파일**: `src/entities/follow/api/queries.ts`

```typescript
import { queryOptions } from "@tanstack/react-query";
import {
  checkIsFollowing,
  getFollowerCount,
  getFollowers,
  getFollowing,
  getFollowingCount,
  getFollowStats,
} from "@/entities/follow/api/server";
import { FOLLOW_QUERY_KEY } from "@/entities/follow/model/constants";

export const followQueries = {
  followerCount: (userId: string) =>
    queryOptions({
      queryKey: FOLLOW_QUERY_KEY.FOLLOWER_COUNT(userId),
      queryFn: async () => getFollowerCount(userId),
    }),

  followingCount: (userId: string) =>
    queryOptions({
      queryKey: FOLLOW_QUERY_KEY.FOLLOWING_COUNT(userId),
      queryFn: async () => getFollowingCount(userId),
    }),

  isFollowing: (followerId: string | null, followingId: string) =>
    queryOptions({
      queryKey: FOLLOW_QUERY_KEY.IS_FOLLOWING(followerId, followingId),
      queryFn: async () => checkIsFollowing(followerId, followingId),
      enabled: !!followerId && followerId !== followingId,
    }),

  stats: (userId: string) =>
    queryOptions({
      queryKey: FOLLOW_QUERY_KEY.STATS(userId),
      queryFn: async () => getFollowStats(userId),
    }),

  followers: (userId: string) =>
    queryOptions({
      queryKey: FOLLOW_QUERY_KEY.FOLLOWERS(userId),
      queryFn: async () => getFollowers(userId),
    }),

  following: (userId: string) =>
    queryOptions({
      queryKey: FOLLOW_QUERY_KEY.FOLLOWING(userId),
      queryFn: async () => getFollowing(userId),
    }),
};
```

---

### Phase 5: Follow Entity - UI (Button)

**파일**: `src/entities/follow/ui/follow-button.tsx`

```typescript
import { UserCheck, UserPlus } from "lucide-react";
import type { MouseEvent } from "react";
import { Button, type buttonVariants } from "@/shared/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";
import type { VariantProps } from "class-variance-authority";

type FollowButtonProps = {
  isFollowing: boolean;
  onClick: (e: MouseEvent) => void;
  showLabel?: boolean;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
  className?: string;
};

export const FollowButton = ({
  isFollowing,
  onClick,
  showLabel = true,
  size = "sm",
  variant = "outline",
  className,
}: FollowButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          onClick={onClick}
          className={cn(
            "transition-colors",
            isFollowing && "border-primary text-primary hover:bg-primary/10",
            className,
          )}
        >
          {isFollowing ? (
            <>
              <UserCheck className="size-4" />
              {showLabel && <span>팔로잉</span>}
            </>
          ) : (
            <>
              <UserPlus className="size-4" />
              {showLabel && <span>팔로우</span>}
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isFollowing ? "언팔로우" : "팔로우"}
      </TooltipContent>
    </Tooltip>
  );
};
```

**디자인 특징**:
- 아이콘 + 레이블 (옵션)
- 팔로잉 상태에 따른 색상 변화
- Tooltip으로 액션 힌트 제공

---

### Phase 6: Follow Feature - Custom Hook (핵심!)

**파일**: `src/features/follow/lib/use-follow-user.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleFollow } from "@/entities/follow/api/server";
import {
  FOLLOW_QUERY_KEY,
  FOLLOW_TOAST_MESSAGE,
} from "@/entities/follow/model/constants";
import type { FollowStats } from "@/entities/follow/model/types";

type UseFollowUserParams = {
  followerId: string;
  followingId: string;
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      followerId,
      followingId,
    }: UseFollowUserParams): Promise<{
      isFollowing: boolean;
      followerCount: number;
    }> => {
      return toggleFollow(followerId, followingId);
    },

    // 1. Optimistic Update: 즉시 UI 반영
    onMutate: async ({ followerId, followingId }) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({
        queryKey: FOLLOW_QUERY_KEY.IS_FOLLOWING(followerId, followingId),
      });
      await queryClient.cancelQueries({
        queryKey: FOLLOW_QUERY_KEY.FOLLOWER_COUNT(followingId),
      });
      await queryClient.cancelQueries({
        queryKey: FOLLOW_QUERY_KEY.FOLLOWING_COUNT(followerId),
      });
      await queryClient.cancelQueries({
        queryKey: FOLLOW_QUERY_KEY.STATS(followingId),
      });

      // 이전 데이터 스냅샷 (롤백용)
      const previousIsFollowing = queryClient.getQueryData(
        FOLLOW_QUERY_KEY.IS_FOLLOWING(followerId, followingId),
      );
      const previousFollowerCount = queryClient.getQueryData(
        FOLLOW_QUERY_KEY.FOLLOWER_COUNT(followingId),
      );
      const previousFollowingCount = queryClient.getQueryData(
        FOLLOW_QUERY_KEY.FOLLOWING_COUNT(followerId),
      );
      const previousStats = queryClient.getQueryData(
        FOLLOW_QUERY_KEY.STATS(followingId),
      );

      // Optimistic Update - 팔로우 상태 토글
      queryClient.setQueryData<boolean>(
        FOLLOW_QUERY_KEY.IS_FOLLOWING(followerId, followingId),
        (old) => !old,
      );

      // Optimistic Update - 팔로워 수
      queryClient.setQueryData<number>(
        FOLLOW_QUERY_KEY.FOLLOWER_COUNT(followingId),
        (old) => {
          if (typeof old !== "number") return old;
          const isCurrentlyFollowing = previousIsFollowing ?? false;
          return isCurrentlyFollowing ? old - 1 : old + 1;
        },
      );

      // Optimistic Update - 팔로잉 수
      queryClient.setQueryData<number>(
        FOLLOW_QUERY_KEY.FOLLOWING_COUNT(followerId),
        (old) => {
          if (typeof old !== "number") return old;
          const isCurrentlyFollowing = previousIsFollowing ?? false;
          return isCurrentlyFollowing ? old - 1 : old + 1;
        },
      );

      // Optimistic Update - 통계
      queryClient.setQueryData<FollowStats>(
        FOLLOW_QUERY_KEY.STATS(followingId),
        (old) => {
          if (!old) return old;
          const isCurrentlyFollowing = previousIsFollowing ?? false;
          return {
            ...old,
            followerCount: isCurrentlyFollowing
              ? old.followerCount - 1
              : old.followerCount + 1,
          };
        },
      );

      return {
        previousIsFollowing,
        previousFollowerCount,
        previousFollowingCount,
        previousStats,
      };
    },

    // 2. 성공 시 토스트 표시
    onSuccess: (data) => {
      toast.success(
        data.isFollowing
          ? FOLLOW_TOAST_MESSAGE.FOLLOW.SUCCESS
          : FOLLOW_TOAST_MESSAGE.UNFOLLOW.SUCCESS,
      );
    },

    // 3. 에러 시 롤백
    onError: (error, variables, context) => {
      if (context?.previousIsFollowing !== undefined) {
        queryClient.setQueryData(
          FOLLOW_QUERY_KEY.IS_FOLLOWING(
            variables.followerId,
            variables.followingId,
          ),
          context.previousIsFollowing,
        );
      }
      if (context?.previousFollowerCount !== undefined) {
        queryClient.setQueryData(
          FOLLOW_QUERY_KEY.FOLLOWER_COUNT(variables.followingId),
          context.previousFollowerCount,
        );
      }
      if (context?.previousFollowingCount !== undefined) {
        queryClient.setQueryData(
          FOLLOW_QUERY_KEY.FOLLOWING_COUNT(variables.followerId),
          context.previousFollowingCount,
        );
      }
      if (context?.previousStats) {
        queryClient.setQueryData(
          FOLLOW_QUERY_KEY.STATS(variables.followingId),
          context.previousStats,
        );
      }

      console.error(error);
      toast.error(FOLLOW_TOAST_MESSAGE.FOLLOW.EXCEPTION, {
        description: error.message,
      });
    },

    // 4. 완료 후 쿼리 무효화 (최신 데이터 fetch)
    onSettled: (data, error, variables) => {
      void queryClient.invalidateQueries({
        queryKey: FOLLOW_QUERY_KEY.IS_FOLLOWING(
          variables.followerId,
          variables.followingId,
        ),
      });
      void queryClient.invalidateQueries({
        queryKey: FOLLOW_QUERY_KEY.FOLLOWER_COUNT(variables.followingId),
      });
      void queryClient.invalidateQueries({
        queryKey: FOLLOW_QUERY_KEY.FOLLOWING_COUNT(variables.followerId),
      });
      void queryClient.invalidateQueries({
        queryKey: FOLLOW_QUERY_KEY.STATS(variables.followingId),
      });
      void queryClient.invalidateQueries({
        queryKey: FOLLOW_QUERY_KEY.FOLLOWERS(variables.followingId),
      });
      void queryClient.invalidateQueries({
        queryKey: FOLLOW_QUERY_KEY.FOLLOWING(variables.followerId),
      });
    },
  });
};
```

**Optimistic Updates 패턴**:
1. **onMutate**: 즉시 UI 업데이트 (스냅샷 저장)
2. **onSuccess**: 성공 메시지 표시
3. **onError**: 실패 시 스냅샷으로 롤백
4. **onSettled**: 무조건 최신 데이터로 갱신

---

### Phase 7: Follow Feature - Modals

#### 7-1. Followers Modal

**파일**: `src/features/follow/ui/followers-modal.tsx`

```typescript
"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import Link from "next/link";
import { followQueries } from "@/entities/follow/api/queries";
import { FollowButton } from "@/entities/follow/ui/follow-button";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { UserBaseInfo } from "@/entities/user/ui/user-base-info";
import { useAuth } from "@/features/auth/model/store";
import { useFollowUser } from "@/features/follow/lib/use-follow-user";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

type FollowersModalProps = {
  userId: string;
};

type FollowerItemProps = {
  followerId: string;
  follower: {
    id: string;
    email: string;
    userName: string;
    avatarUrl: string | null;
    aboutMe: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
};

const FollowerItem = ({ followerId, follower }: FollowerItemProps) => {
  const { me } = useAuth();
  const { mutate: toggleFollow } = useFollowUser();

  const { data: isFollowing } = useQuery(
    followQueries.isFollowing(me?.id ?? null, followerId),
  );

  const isCurrentUser = me?.id === followerId;

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!me?.id) return;

    toggleFollow({
      followerId: me.id,
      followingId: followerId,
    });
  };

  return (
    <Link
      href={`/profile/${followerId}`}
      className="flex items-center justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
    >
      <div className="flex items-center gap-3">
        <UserAvatar
          avatarUrl={follower.avatarUrl}
          fallback={follower.userName}
          size="md"
        />
        <UserBaseInfo userName={follower.userName} email={follower.email} />
      </div>
      {!isCurrentUser && me?.id && (
        <FollowButton
          isFollowing={isFollowing ?? false}
          onClick={handleFollowClick}
          showLabel={false}
          size="sm"
        />
      )}
    </Link>
  );
};

export const FollowersModal = ({ userId }: FollowersModalProps) => {
  const { data: followers } = useSuspenseQuery(followQueries.followers(userId));

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Users className="size-5" />
          팔로워
        </DialogTitle>
        <DialogDescription>
          {followers.length > 0
            ? `${followers.length}명의 팔로워`
            : "아직 팔로워가 없습니다"}
        </DialogDescription>
      </DialogHeader>
      <div className="max-h-[400px] space-y-3 overflow-y-auto pr-2">
        {followers.map(({ followerId, follower }) => {
          if (!follower) return null;
          return (
            <FollowerItem
              key={followerId}
              followerId={followerId}
              follower={follower}
            />
          );
        })}
      </div>
    </DialogContent>
  );
};
```

#### 7-2. Following Modal

**파일**: `src/features/follow/ui/following-modal.tsx`

```typescript
"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import Link from "next/link";
import { followQueries } from "@/entities/follow/api/queries";
import { FollowButton } from "@/entities/follow/ui/follow-button";
import { UserAvatar } from "@/entities/user/ui/user-avatar";
import { SummaryUserInfo } from "@/entities/user/ui/user-base-info";
import { useAuth } from "@/features/auth/model/store";
import { useFollowUser } from "@/features/follow/lib/use-follow-user";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

type FollowingModalProps = {
  userId: string;
};

type FollowingItemProps = {
  viewerUserId: string;
  followingId: string;
  followingUser: {
    id: string;
    email: string;
    userName: string;
    avatarUrl: string | null;
    aboutMe: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
};

const FollowingItem = ({
  viewerUserId,
  followingId,
  followingUser,
}: FollowingItemProps) => {
  const { me } = useAuth();
  const { mutate: toggleFollow } = useFollowUser();

  const { data: isFollowing } = useQuery(
    followQueries.isFollowing(me?.id ?? null, followingId),
  );

  const isCurrentUser = me?.id === followingId;
  const isViewingOwnList = me?.id === viewerUserId;

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!me?.id) return;

    toggleFollow({
      followerId: me.id,
      followingId,
    });
  };

  return (
    <Link
      href={`/profile/${followingId}`}
      className="flex items-center justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
    >
      <div className="flex items-center gap-3">
        <UserAvatar
          avatarUrl={followingUser.avatarUrl}
          fallback={followingUser.userName}
          size="md"
        />
        <SummaryUserInfo
          userName={followingUser.userName}
          email={followingUser.email}
        />
      </div>
      {!isCurrentUser && me?.id && (
        <FollowButton
          isFollowing={isViewingOwnList ? true : isFollowing ?? false}
          onClick={handleFollowClick}
          showLabel={false}
          size="sm"
        />
      )}
    </Link>
  );
};

export const FollowingModal = ({ userId }: FollowingModalProps) => {
  const { data: following } = useSuspenseQuery(
    followQueries.following(userId),
  );

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <UserPlus className="size-5" />
          팔로잉
        </DialogTitle>
        <DialogDescription>
          {following.length > 0
            ? `${following.length}명을 팔로우 중`
            : "아직 팔로우하는 사용자가 없습니다"}
        </DialogDescription>
      </DialogHeader>
      <div className="max-h-[400px] space-y-3 overflow-y-auto pr-2">
        {following.map(({ following: followingUser, followingId }) => {
          if (!followingUser) return null;
          return (
            <FollowingItem
              key={followingId}
              viewerUserId={userId}
              followingId={followingId}
              followingUser={followingUser}
            />
          );
        })}
      </div>
    </DialogContent>
  );
};
```

---

### Phase 8: User Entity 확장

#### 8-1. 타입 확장

**파일**: `src/entities/user/model/types.ts`에 추가

```typescript
import type { FollowStats } from "@/entities/follow/model/types";

// 기존 타입...

export type UserInfoWithStats = UserInfo & {
  stats: FollowStats;
};
```

#### 8-2. Server Action 추가

**파일**: `src/entities/user/api/client.ts`에 추가

```typescript
import { getFollowStats } from "@/entities/follow/api/server";
import type { UserInfoWithStats } from "@/entities/user/model/types";

/**
 * 사용자 정보와 팔로우 통계를 함께 조회
 */
export const getUserInfoWithStats = async (
  id: string | null,
): Promise<UserInfoWithStats | null> => {
  if (!id) return null;

  const [userInfo, stats] = await Promise.all([
    getUserInfo(id),
    getFollowStats(id),
  ]);

  if (!userInfo) return null;

  return {
    ...userInfo,
    stats,
  };
};
```

#### 8-3. Query 정의 추가

**파일**: `src/entities/user/api/queries.ts`에 추가

```typescript
import { getUserInfoWithStats } from "@/entities/user/api/server";

export const userQueries = {
  // 기존 쿼리...

  getUserInfoWithStats: (id: string | null) =>
    queryOptions({
      queryKey: USER_QUERY_KEY.INFO_WITH_STATS(id),
      queryFn: async () => getUserInfoWithStats(id),
    }),
};
```

**파일**: `src/entities/user/model/constants.ts`에 추가

```typescript
export const USER_QUERY_KEY = {
  INFO: (userId: string | null) => ["user", "info", userId],
  INFO_WITH_STATS: (userId: string | null) => [
    "user",
    "info-with-stats",
    userId,
  ],
};
```

---

### Phase 9: Modal Store 확장

#### 9-1. Modal Types 추가

**파일**: `src/app/_store/modal-store.ts`

```typescript
export type ModalType =
  | "sign-in"
  | "sign-up"
  | "auth-guard"
  | "submit-article"
  | "update-article"
  | "report-article"
  | "sign-out"
  | "followers"      // 추가
  | "following"      // 추가
  | null;

export type ModalProps =
  | SubmitArticleDialogProps
  | UpdateArticleDialogProps
  | ReportArticleDialogProps
  | FollowersDialogProps    // 추가
  | FollowingDialogProps    // 추가
  | null;

// 기존 Props 타입들...

export type FollowersDialogProps = {
  userId: string;
};

export type FollowingDialogProps = {
  userId: string;
};
```

#### 9-2. Modal Provider 업데이트

**파일**: `src/shared/provider/modal-provider.tsx`

```typescript
"use client";

import { Suspense } from "react";
import type {
  FollowersDialogProps,
  FollowingDialogProps,
} from "@/app/_store/modal-store";
import { useModal } from "@/app/_store/modal-store";
// ... 기존 imports
import { FollowersModal } from "@/features/follow/ui/followers-modal";
import { FollowingModal } from "@/features/follow/ui/following-modal";
import { Spinner } from "@/shared/components/ui/spinner";

export const Modal = () => {
  const { currentModal, closeModal, props } = useModal();

  if (currentModal === null) return null;

  return (
    <Dialog
      open={!!currentModal}
      onOpenChange={(open) => !open && closeModal()}
    >
      {/* 기존 모달들... */}

      {currentModal === "followers" && (
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-8">
              <Spinner />
            </div>
          }
        >
          <FollowersModal userId={(props as FollowersDialogProps)?.userId} />
        </Suspense>
      )}

      {currentModal === "following" && (
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-8">
              <Spinner />
            </div>
          }
        >
          <FollowingModal userId={(props as FollowingDialogProps)?.userId} />
        </Suspense>
      )}
    </Dialog>
  );
};
```

---

## UI 통합

### 1. Profile Page

**파일**: `src/views/profile/profile-page-view.tsx`

```typescript
"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useModal } from "@/app/_store/modal-store";
import { followQueries } from "@/entities/follow/api/queries";
import { FollowButton } from "@/entities/follow/ui/follow-button";
import { userQueries } from "@/entities/user/api/queries";
import { useAuth } from "@/features/auth/model/store";
import { useFollowUser } from "@/features/follow/lib/use-follow-user";

export const ProfilePageView = ({ id }: ProfilePageViewProps) => {
  const { me } = useAuth();
  const { openModal } = useModal();
  const { data: userWithStats } = useSuspenseQuery(
    userQueries.getUserInfoWithStats(id),
  );
  const { data: isFollowing } = useQuery(
    followQueries.isFollowing(me?.id ?? null, id),
  );
  const { mutate: toggleFollow } = useFollowUser();

  if (!userWithStats) return null;

  const { stats, ...user } = userWithStats;
  const isOwnProfile = me?.id === id;

  const handleFollowClick = () => {
    if (!me?.id) return;
    toggleFollow({
      followerId: me.id,
      followingId: id,
    });
  };

  return (
    <PageContainer>
      <Card>
        <CardContent>
          {/* Avatar & User Info */}

          {/* Follow Button */}
          {!isOwnProfile && me?.id && (
            <FollowButton
              isFollowing={isFollowing ?? false}
              onClick={handleFollowClick}
              showLabel={true}
              size="default"
            />
          )}

          {/* Follow Stats */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => openModal("followers", { userId: id })}
            >
              <span className="font-bold text-lg">{stats.followerCount}</span>
              <span className="text-muted-foreground text-sm">팔로워</span>
            </button>

            <button
              type="button"
              onClick={() => openModal("following", { userId: id })}
            >
              <span className="font-bold text-lg">{stats.followingCount}</span>
              <span className="text-muted-foreground text-sm">팔로잉</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};
```

**파일**: `src/app/(home)/(profile)/[id]/page.tsx` (Server Component)

```typescript
import { followQueries } from "@/entities/follow/api/queries";
import { userQueries } from "@/entities/user/api/queries";
import { getCurrentUser } from "@/features/auth/api/server";

const Page = async ({ params }: PageProps) => {
  const { id } = await params;
  const queryClient = getQueryClient();
  const currentUser = await getCurrentUser();

  // Prefetch user info with stats
  await queryClient.prefetchQuery(userQueries.getUserInfoWithStats(id));

  // Prefetch follow status if logged in
  if (currentUser?.id && currentUser.id !== id) {
    await queryClient.prefetchQuery(
      followQueries.isFollowing(currentUser.id, id),
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfilePageView id={id} />
    </HydrationBoundary>
  );
};
```

---

### 2. Article Card (HoverCard)

**파일**: `src/entities/article/ui/article-header.tsx`

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { followQueries } from "@/entities/follow/api/queries";
import { FollowButton } from "@/entities/follow/ui/follow-button";
import { useAuth } from "@/features/auth/model/store";
import { useFollowUser } from "@/features/follow/lib/use-follow-user";

export const ArticleHeader = ({ userId, isMe, ...props }) => {
  const { me: currentUser } = useAuth();
  const { data: isFollowing } = useQuery(
    followQueries.isFollowing(currentUser?.id ?? null, userId),
  );
  const { mutate: toggleFollow } = useFollowUser();

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser?.id) return;

    toggleFollow({
      followerId: currentUser.id,
      followingId: userId,
    });
  };

  return (
    <header>
      <HoverCard>
        <HoverCardTrigger asChild>
          <UserAvatar {...props} />
        </HoverCardTrigger>
        <HoverCardContent>
          {/* User Info */}

          {/* Follow Button - only if not own profile */}
          {!isMe && currentUser?.id && (
            <FollowButton
              isFollowing={isFollowing ?? false}
              onClick={handleFollowClick}
              showLabel={true}
              size="sm"
            />
          )}

          {/* Profile Link Button */}
        </HoverCardContent>
      </HoverCard>
    </header>
  );
};
```

---

### 3. Comment Item (HoverCard)

**파일**: `src/entities/comment/ui/comment-item.tsx`

```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { followQueries } from "@/entities/follow/api/queries";
import { FollowButton } from "@/entities/follow/ui/follow-button";
import { useAuth } from "@/features/auth/model/store";
import { useFollowUser } from "@/features/follow/lib/use-follow-user";

export const CommentItem = ({ comment, isAuthor, ...props }) => {
  const { me } = useAuth();
  const { data: isFollowing } = useQuery(
    followQueries.isFollowing(me?.id ?? null, comment.authorId),
  );
  const { mutate: toggleFollow } = useFollowUser();

  const handleFollowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!me?.id) return;

    toggleFollow({
      followerId: me.id,
      followingId: comment.authorId,
    });
  };

  return (
    <div className="flex gap-3">
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="cursor-pointer">
            <UserAvatar {...comment.author} />
          </div>
        </HoverCardTrigger>
        <HoverCardContent>
          {/* User Info */}

          {/* Follow Button - only if not own comment */}
          {!isAuthor && me?.id && (
            <FollowButton
              isFollowing={isFollowing ?? false}
              onClick={handleFollowClick}
              showLabel={true}
              size="sm"
            />
          )}

          {/* Profile Link Button */}
        </HoverCardContent>
      </HoverCard>

      {/* Comment Content */}
    </div>
  );
};
```

---

## 테스트 포인트

### 기능 테스트
1. **팔로우/언팔로우**
   - [ ] 버튼 클릭 시 즉시 UI 변경 확인
   - [ ] 팔로워/팔로잉 수 증감 확인
   - [ ] 토스트 메시지 표시 확인

2. **자기 자신 팔로우 방지**
   - [ ] 본인 프로필에서 팔로우 버튼 미표시
   - [ ] 본인 게시글/댓글에서 팔로우 버튼 미표시

3. **팔로워/팔로잉 목록**
   - [ ] 모달 오픈 확인
   - [ ] 목록 데이터 정확성
   - [ ] 각 사용자별 팔로우 버튼 동작

4. **에러 핸들링**
   - [ ] 네트워크 에러 시 롤백
   - [ ] 에러 토스트 표시

### 성능 테스트
1. **Optimistic Updates**
   - [ ] 버튼 클릭 즉시 UI 반응
   - [ ] 네트워크 지연 시에도 빠른 반응

2. **쿼리 캐싱**
   - [ ] 동일 페이지 재방문 시 캐시 활용
   - [ ] 불필요한 리패치 없음

---

## 참고 자료

### 핵심 패턴
- **article-likes**: 동일한 패턴 참고 (`src/features/article/lib/use-like-article.ts`)
- **Optimistic Updates**: TanStack Query 공식 문서
- **FSD Architecture**: Feature-Sliced Design 공식 사이트

### 주의사항
1. **useAuth 사용**: `@/features/auth/model/store`에서 import, `me` 속성 사용
2. **Composite Primary Key**: 중복 팔로우 방지를 위한 필수 설정
3. **RLS Policies**: 보안을 위한 데이터베이스 레벨 권한 설정
4. **Query Invalidation**: 모든 관련 쿼리를 무효화하여 일관성 유지

---

## 마이그레이션 문제 해결

### 문제 상황
- 중복 마이그레이션 파일 생성
- `user_follows` 테이블이 이미 존재한다는 에러

### 해결 방법
1. Supabase SQL Editor에서 확인:
```sql
SELECT EXISTS (
  SELECT FROM pg_tables
  WHERE schemaname = 'public'
  AND tablename = 'user_follows'
);
```

2. 테이블이 없는 경우:
```sql
-- 마이그레이션 히스토리 정리
DELETE FROM drizzle.__drizzle_migrations
WHERE tag = '0003_skinny_medusa';
```

3. 로컬에서 재실행:
```bash
bun db:migrate
```

---

이 문서를 참고하여 팔로우 기능을 단계별로 구현하시면 됩니다. 각 단계는 독립적으로 테스트 가능하도록 구성되어 있습니다.
