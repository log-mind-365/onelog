# OneLog 프로젝트 주요 기술 스택 문서

## 목차
1. [Next.js 16 App Router](#1-nextjs-16-app-router)
2. [TanStack Query (React Query v5)](#2-tanstack-query-react-query-v5)
3. [Drizzle ORM](#3-drizzle-orm)
4. [Supabase](#4-supabase)
5. [Feature-Sliced Design (FSD) 아키텍처](#5-feature-sliced-design-fsd-아키텍처)
6. [React 19 & Zustand](#6-react-19--zustand)
7. [아키텍처 시너지](#7-아키텍처-시너지)

---

## 1. Next.js 16 App Router

### 어떻게 사용되고 있나?

#### 라우트 구조
```
src/app/
├── (auth)/              # 인증 페이지 그룹
│   ├── sign_in/
│   └── sign_up/
└── (home)/              # 메인 페이지 그룹
    ├── page.tsx         # 홈 피드
    ├── write/           # 게시글 작성
    ├── article/[id]/    # 게시글 상세
    └── [id]/            # 프로필 페이지
```

**Route Groups 활용:**
- `(auth)`: 인증 전용 레이아웃 (중앙 정렬 폼)
- `(home)`: 사이드바가 있는 메인 레이아웃

#### Server Components 패턴

**예시: `src/app/(home)/page.tsx:7`**
```typescript
const HomePage = async () => {
  const queryClient = getQueryClient();
  const user = await getCurrentUser();

  // 서버에서 데이터 프리페칭
  void Promise.all([
    queryClient.prefetchQuery(userQueries.getUserInfo(user?.id ?? null)),
    queryClient.prefetchInfiniteQuery(articleQueries.infinite(user?.id ?? null)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<Spinner />}>
        <HomePageView />
      </Suspense>
    </HydrationBoundary>
  );
};
```

#### Dynamic Routes (Next.js 16 패턴)
```typescript
// src/app/(home)/article/[id]/page.tsx:9
type PageProps = {
  params: Promise<{ id: string }>;  // Next.js 16: params는 Promise
};

const ArticlePage = async ({ params }: PageProps) => {
  const { id } = await params;  // await 필수!
  // ...
};
```

### 누리고 있는 이점

1. **서버 우선 렌더링**: 초기 페이지 로드 시 완전한 데이터와 함께 렌더링
2. **자동 코드 스플리팅**: 각 라우트별로 자동 번들 분할
3. **레이아웃 조합**: Route Groups로 서로 다른 UI 패턴 쉽게 구현
4. **Streaming SSR**: Suspense와 함께 점진적 렌더링
5. **SEO 최적화**: 서버 렌더링으로 검색 엔진 최적화
6. **타입 안전성**: TypeScript와 완벽한 통합

**성능 지표:**
- 초기 로딩 시간 단축 (서버 프리페칭)
- Time to Interactive 개선
- 불필요한 JavaScript 번들 최소화

---

## 2. TanStack Query (React Query v5)

### 어떻게 사용되고 있나?

#### Query Client 설정

**`src/shared/lib/tanstack/get-query-client.ts:6`**
```typescript
const makeQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,  // 60초간 신선한 상태 유지
        retry: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
};

export const getQueryClient = () => {
  if (isServer) {
    return makeQueryClient();  // 서버: 매 요청마다 새 인스턴스
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;  // 브라우저: 싱글톤
  }
};
```

#### Query 정의 패턴

**`src/entities/article/api/queries.ts:7`**
```typescript
export const articleQueries = {
  infinite: (userId: string | null) =>
    infiniteQueryOptions({
      queryKey: ARTICLE_QUERY_KEY.PUBLIC,
      queryFn: async ({ pageParam }): Promise<InfiniteArticleList> =>
        getInfinitePublicArticleList(pageParam, userId),
      initialPageParam: "",
      getNextPageParam: (lastPage) => lastPage.nextId ?? undefined,
    }),

  detail: (id: string, userId: string | null) =>
    queryOptions({
      queryKey: ARTICLE_QUERY_KEY.DETAIL(id, userId),
      queryFn: async () => getArticleDetail(id, userId),
    }),
};
```

#### 무한 스크롤 구현

**`src/widgets/article-list/ui/infinite-article-list.tsx:20`**
```typescript
export const InfiniteArticleList = ({
  data,
  onFetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: InfiniteArticleListProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const allArticles = data?.pages.flatMap((page) => page.data) ?? [];

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onFetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasNextPage, isFetchingNextPage, onFetchNextPage]);

  return (
    <div className="flex flex-col gap-8">
      {allArticles.map((article) => (
        <ArticleCard key={article.id} {...article} />
      ))}
      {hasNextPage && <div ref={loadMoreRef}>로딩 중...</div>}
    </div>
  );
};
```

#### Optimistic Updates

**`src/features/article/lib/use-like-article.ts:8`**
```typescript
export const useLikeArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ articleId, userId }) => {
      return toggleArticleLike(articleId, userId);
    },

    // 1. 즉시 UI 업데이트 (낙관적 업데이트)
    onMutate: async ({ articleId, userId }) => {
      await queryClient.cancelQueries({ queryKey: ARTICLE_QUERY_KEY.PUBLIC });

      // 이전 데이터 스냅샷 저장 (롤백용)
      const previousData = queryClient.getQueryData(ARTICLE_QUERY_KEY.PUBLIC);

      // UI 즉시 업데이트
      queryClient.setQueryData(ARTICLE_QUERY_KEY.PUBLIC, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((article) =>
              article.id === articleId
                ? {
                    ...article,
                    isLiked: !article.isLiked,
                    likeCount: article.isLiked
                      ? article.likeCount - 1
                      : article.likeCount + 1,
                  }
                : article,
            ),
          })),
        };
      });

      return { previousData };
    },

    // 2. 성공 시 토스트 알림
    onSuccess: (data) => {
      toast.success(data.isLiked ? "좋아요!" : "좋아요 취소");
    },

    // 3. 실패 시 롤백
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(ARTICLE_QUERY_KEY.PUBLIC, context.previousData);
      }
      toast.error("오류가 발생했습니다.");
    },

    // 4. 항상 최신 데이터로 재검증
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ARTICLE_QUERY_KEY.PUBLIC });
    },
  });
};
```

### 누리고 있는 이점

1. **서버 상태 관리 자동화**
   - 캐싱, 리페칭, 동기화 자동 처리
   - 수동 상태 관리 코드 불필요

2. **성능 최적화**
   - 중복 요청 자동 제거
   - 백그라운드 리페칭으로 항상 최신 데이터
   - Stale-While-Revalidate 패턴

3. **사용자 경험 개선**
   - Optimistic Updates로 즉각적인 피드백
   - 무한 스크롤 간편 구현
   - 로딩/에러 상태 자동 관리

4. **개발 경험**
   - React Query DevTools로 디버깅 용이
   - 타입 안전성 (queryOptions)
   - 일관된 데이터 페칭 패턴

**데이터 흐름:**
```
서버 프리페치 → HydrationBoundary → 클라이언트 컴포넌트
                                    ↓
                          useSuspenseInfiniteQuery
                                    ↓
                         자동 캐싱 & 백그라운드 업데이트
```

---

## 3. Drizzle ORM

### 어떻게 사용되고 있나?

#### 스키마 정의

**`src/db/schemas/articles.ts:10`**
```typescript
export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id),
    title: text("title").notNull(),
    content: text("content").notNull(),
    emotionLevel: integer("emotion_level").notNull(),
    accessType: accessTypes("access_type").default("public").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    pgPolicy("anyone can select public articles", {
      for: "select",
      to: "public",
      using: sql`access_type = 'public'`,
    }),
    // ... 더 많은 RLS 정책들
  ],
);
```

#### 타입 추론

**`src/entities/article/model/types.ts:6`**
```typescript
import type { articles } from "@/db/schemas/articles";

// 자동 타입 추론
export type Article = typeof articles.$inferSelect;
export type ArticleInsertSchema = typeof articles.$inferInsert;

// 확장 타입
export type ArticleWithAuthorInfo = Article & {
  author: UserInfo | null;
  likeCount: number;
  isLiked: boolean;
};
```

#### 복잡한 쿼리

**`src/entities/article/api/client.ts:65`**
```typescript
export const getInfinitePublicArticleList = async (
  pageParam: string,
  userId: string | null,
): Promise<InfiniteArticleList> => {
  const result = await db
    .select({
      ...getTableColumns(articles),  // 모든 컬럼 자동 선택
      author: profiles,               // 조인 결과를 중첩 객체로
      likeCount: count(articleLikes.id).as("likeCount"),
      commentCount: sql<number>`(
        SELECT COUNT(*)::int
        FROM ${comments}
        WHERE ${comments.articleId} = ${articles.id}
      )`,
      isLiked: userId
        ? sql<boolean>`EXISTS(
            SELECT 1 FROM ${articleLikes}
            WHERE ${articleLikes.articleId} = ${articles.id}
            AND ${articleLikes.userId} = ${userId}
          )`
        : sql<boolean>`false`,
    })
    .from(articles)
    .leftJoin(profiles, eq(articles.userId, profiles.id))
    .leftJoin(articleLikes, eq(articles.id, articleLikes.articleId))
    .where(
      and(
        pageParam ? gt(articles.id, pageParam) : undefined,
        or(
          eq(articles.accessType, "public"),
          userId ? eq(articles.userId, userId) : undefined,
        ),
      ),
    )
    .groupBy(articles.id, profiles.id)
    .limit(PAGE_LIMIT)
    .orderBy(desc(articles.createdAt));

  return {
    nextId: result.length === PAGE_LIMIT ? result[PAGE_LIMIT - 1].id : undefined,
    data: result,
  };
};
```

#### CRUD 패턴

```typescript
// CREATE
export const postArticle = async (
  params: ArticleInsertSchema,
): Promise<Article> => {
  return db
    .insert(articles)
    .values(params)
    .returning()
    .then((rows) => rows[0]);
};

// UPDATE
export const updateArticle = async (
  id: string,
  params: Partial<ArticleInsertSchema>,
): Promise<Article> => {
  return db
    .update(articles)
    .set({ ...params, updatedAt: new Date() })
    .where(eq(articles.id, id))
    .returning()
    .then((rows) => rows[0]);
};

// DELETE
export const deleteArticle = async (id: string) => {
  return db.delete(articles).where(eq(articles.id, id));
};
```

### 누리고 있는 이점

1. **완벽한 타입 안전성**
   - `$inferSelect`, `$inferInsert`로 자동 타입 생성
   - 컴파일 타임에 오류 감지
   - SQL 쿼리도 타입 체크

2. **SQL-Like 문법**
   - 러닝 커브 낮음
   - 복잡한 쿼리도 직관적
   - TypeScript 자동 완성 지원

3. **마이그레이션 관리**
   - `bun db:generate`로 자동 마이그레이션 생성
   - SQL 마이그레이션 파일로 버전 관리
   - Rollback 지원

4. **성능**
   - 쿼리 빌더로 최적화된 SQL 생성
   - N+1 문제 방지 (JOIN 활용)
   - 인덱스, RLS 정책 통합 관리

5. **RLS 통합**
   - PostgreSQL Row Level Security를 스키마에서 관리
   - Supabase와 완벽한 통합

**타입 안전성 체인:**
```
Database Schema (schemas.ts)
       ↓ $inferSelect/$inferInsert
Entity Types (types.ts)
       ↓
Server Actions (client.ts)
       ↓
TanStack Query (queries.ts)
       ↓
React Components
```

---

## 4. Supabase

### 어떻게 사용되고 있나?

#### 서버 클라이언트

**`src/shared/lib/supabase/client.ts:4`**
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component에서 호출 시 무시
          }
        },
      },
    },
  );
}
```

#### 인증 플로우

**`src/features/auth/api/client.ts:5`**
```typescript
"use server";

export const signIn = async ({ email, password }: SignInParams) => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message || "로그인에 실패했습니다.");
  }
  return data.user;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
```

#### Zustand와 통합

**`src/features/auth/model/store.ts:10`**
```typescript
export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      me: null,
      isAuthenticated: false,
      setMe: (me) => set({ me, isAuthenticated: true }),
      clearMe: () => set({ me: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" },
  ),
);
```

#### 데이터 매핑

**`src/entities/user/lib/mappers.ts:5`**
```typescript
export const signInToEntity = (user: User): UserInfo => {
  return {
    id: user.id,
    email: user.email!,
    userName: user.user_metadata.username,
    avatarUrl: user.user_metadata.avatar,
    createdAt: new Date(user.created_at),
    updatedAt: new Date(user.updated_at || Date.now()),
  };
};
```

### 누리고 있는 이점

1. **관리형 인증**
   - 비밀번호 해싱, 세션 관리 자동
   - OAuth 쉽게 추가 가능
   - 이메일 인증, 비밀번호 재설정 기본 제공

2. **안전한 세션 관리**
   - HTTP-only 쿠키로 보안성 확보
   - SSR과 완벽한 통합
   - CSRF 보호 내장

3. **Row Level Security (RLS)**
   - 데이터베이스 레벨 권한 관리
   - `auth.uid()` 함수로 현재 사용자 확인
   - SQL 정책으로 세밀한 제어

4. **실시간 기능** (미래 확장 가능)
   - Realtime Subscriptions 지원
   - 채팅, 알림 등 실시간 기능 쉽게 추가

5. **Storage 통합**
   - 파일 업로드, 다운로드 API
   - 이미지 최적화 기본 제공

**인증 플로우:**
```
Sign In Form
    ↓
useSignIn Hook (useMutation)
    ↓
signIn Server Action
    ↓
Supabase Auth (쿠키 설정)
    ↓
Zustand Store (클라이언트 상태)
    ↓
PostgreSQL (프로필 데이터)
```

---

## 5. Feature-Sliced Design (FSD) 아키텍처

### 어떻게 사용되고 있나?

#### 디렉토리 구조

```
src/
├── app/              # Next.js 라우팅
├── entities/         # 비즈니스 엔티티
│   ├── article/
│   │   ├── api/      # Server Actions, Queries
│   │   ├── model/    # Types, Constants
│   │   └── ui/       # Presentational Components
│   ├── comment/
│   └── user/
├── features/         # 비즈니스 기능
│   ├── auth/
│   │   ├── api/      # 인증 서버 액션
│   │   ├── lib/      # use-sign-in.ts 등 커스텀 훅
│   │   ├── model/    # Auth Store, Schemas
│   │   └── ui/       # Auth 관련 UI
│   └── article/
│       ├── lib/      # use-like-article.ts
│       └── ui/       # Like Button 등
├── widgets/          # 복합 UI 블록
│   ├── article-card/
│   ├── article-form/
│   └── article-list/
├── views/            # 페이지 뷰 컴포넌트
│   ├── home/
│   └── article-detail/
└── shared/           # 공유 유틸리티
    ├── components/   # 재사용 가능한 UI
    ├── lib/          # Supabase, TanStack 설정
    └── hooks/        # 범용 훅
```

#### 레이어별 역할

**Entities (엔티티)**
- CRUD 작업 담당
- 데이터 모델 정의
- 기본 UI 컴포넌트

**Features (기능)**
- 엔티티를 조합한 비즈니스 로직
- 사용자 액션 처리 (좋아요, 댓글 등)
- 커스텀 훅으로 로직 캡슐화

**Widgets (위젯)**
- 여러 엔티티/기능을 조합
- 재사용 가능한 복합 컴포넌트
- ArticleCard, ArticleList 등

**Views (뷰)**
- 페이지 레벨 조합
- 기능과 위젯 오케스트레이션

**App (앱)**
- Next.js 라우팅
- 서버 데이터 프리페칭
- 레이아웃 구성

#### 데이터 흐름 예시: 좋아요 기능

```
1. ArticleCard (Widget)
   ↓ (onClick)
2. HomePageView (View) - callback 전달
   ↓
3. useLikeArticle (Feature Hook)
   ↓ (optimistic update + mutation)
4. toggleArticleLike (Entity Server Action)
   ↓
5. Database (Drizzle ORM)
   ↓ (response)
6. TanStack Query (cache invalidation)
   ↓
7. UI 자동 업데이트
```

### 누리고 있는 이점

1. **확장성**
   - 새 기능 추가 시 명확한 위치
   - 레이어 간 의존성 명확
   - 팀 협업 시 충돌 최소화

2. **유지보수성**
   - 기능별로 코드 격리
   - 변경 영향 범위 제한
   - 리팩토링 용이

3. **재사용성**
   - Widgets는 여러 페이지에서 사용
   - Shared는 프로젝트 전체에서 사용
   - 엔티티는 독립적으로 동작

4. **테스트 용이성**
   - 각 레이어 독립적 테스트
   - Mock 데이터 주입 쉬움
   - 단위 테스트 작성 간편

5. **명확한 의존성 방향**
   ```
   App → Views → Widgets → Features → Entities → Shared
   (상위 → 하위만 가능, 역방향 불가)
   ```

---

## 6. React 19 & Zustand

### React 19 사용

- **useSuspenseQuery**: Suspense와 통합된 데이터 페칭
- **useOptimistic**: 낙관적 업데이트 (TanStack Query로 구현)
- **Server Actions**: Next.js와 함께 사용

### Zustand 상태 관리

**`src/features/auth/model/store.ts:10`**
```typescript
export const useAuth = create<AuthStore>()(
  persist(
    (set) => ({
      me: null,
      isAuthenticated: false,
      setMe: (me) => set({ me, isAuthenticated: true }),
      clearMe: () => set({ me: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" },
  ),
);
```

**`src/app/_providers/modal-store.ts:10`**
```typescript
export const useModal = create<ModalStore>((set) => ({
  currentModal: null,
  openModal: (modal) => set({ currentModal: modal }),
  closeModal: () => set({ currentModal: null }),
}));
```

### 누리고 있는 이점

1. **단순함**
   - Boilerplate 최소화
   - Context API보다 간결
   - 러닝 커브 낮음

2. **성능**
   - 선택적 구독 (리렌더 최소화)
   - 작은 번들 사이즈
   - 미들웨어로 확장 가능

3. **개발 경험**
   - TypeScript 완벽 지원
   - DevTools 제공
   - Persist 미들웨어로 localStorage 자동 동기화

---

## 7. 아키텍처 시너지

### 전체 데이터 플로우

```
사용자 액션
    ↓
React Component (Client Component)
    ↓
Custom Hook (useLikeArticle)
    ↓
TanStack Query Mutation (optimistic update)
    ↓
Server Action (toggleArticleLike)
    ↓
Drizzle ORM Query
    ↓
PostgreSQL (Supabase)
    ↓
Response
    ↓
TanStack Query Cache Update
    ↓
React Re-render (자동)
```

### 기술 간 통합 이점

| 조합 | 시너지 |
|------|--------|
| **Next.js + TanStack Query** | 서버 프리페칭 + 클라이언트 캐싱으로 빠른 초기 로드 |
| **Drizzle + TanStack Query** | 타입 안전한 데이터 페칭 체인 |
| **Supabase + Drizzle** | 인증 + RLS로 보안 레이어 이중화 |
| **FSD + Entities** | 명확한 책임 분리, 재사용성 극대화 |
| **Zustand + TanStack Query** | 클라이언트 상태 + 서버 상태 명확한 분리 |

### 성능 최적화 포인트

1. **초기 로드**: 서버 컴포넌트에서 프리페칭
2. **인터랙션**: Optimistic Updates로 즉각 반응
3. **캐싱**: TanStack Query의 stale-while-revalidate
4. **코드 스플리팅**: Next.js 자동 처리
5. **데이터베이스**: Drizzle의 최적화된 쿼리

### 타입 안전성 체인

```
Database Schema (Drizzle)
       ↓ $inferSelect
Entity Types
       ↓
Server Action Return Types
       ↓
TanStack Query Types
       ↓
React Component Props
```

**전 과정에서 TypeScript가 타입 체크**

---

## 결론

OneLog 프로젝트는 현대적인 웹 개발의 베스트 프랙티스를 따르고 있습니다:

### 주요 강점

1. **개발 속도**: 각 기술의 자동화 기능으로 빠른 개발
2. **타입 안전성**: 엔드투엔드 타입 체크로 런타임 에러 최소화
3. **성능**: 서버 렌더링 + 클라이언트 캐싱 + 낙관적 업데이트
4. **확장성**: FSD 아키텍처로 기능 추가 용이
5. **유지보수성**: 명확한 레이어 분리와 일관된 패턴
6. **보안**: Supabase Auth + RLS로 다층 보안

### 기술 선택의 적합성

- **소셜 플랫폼 특성**: 실시간성, 인터랙티브한 UI에 최적화
- **스타트업 환경**: 빠른 개발과 안정성 동시 확보
- **확장 가능성**: 사용자 증가 시 수평 확장 용이

---

**작성일**: 2025-01-10
**작성자**: Claude Code
**버전**: 1.0