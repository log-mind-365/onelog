# useLikeArticle 훅 상세 분석

## 목차
1. [전체 코드 구조](#전체-코드-구조)
2. [단계별 실행 흐름](#단계별-실행-흐름)
3. [Optimistic Update 패턴](#optimistic-update-패턴)
4. [에러 처리 및 롤백](#에러-처리-및-롤백)
5. [캐시 업데이트 전략](#캐시-업데이트-전략)
6. [실전 시나리오](#실전-시나리오)

---

## 전체 코드 구조

**파일**: `src/features/article/lib/use-like-article.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleArticleLike } from "@/entities/article/api/server";
import type { ArticleWithAuthorInfo } from "@/entities/article/model/types";
import { QUERY_KEY, TOAST_MESSAGE } from "@/shared/model/constants";

type UseLikeArticleParams = {
  articleId: string;
  userId: string;
};

export const useLikeArticle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ articleId, userId }: UseLikeArticleParams) => {
      return toggleArticleLike(articleId, userId);
    },

    onMutate: async ({ articleId, userId }) => {
      // ... Optimistic Update 로직
    },

    onSuccess: (data) => {
      // ... 성공 처리
    },

    onError: (error, variables, context) => {
      // ... 에러 처리 및 롤백
    },

    onSettled: (data, error, variables) => {
      // ... 최종 정리 작업
    },
  });
};
```

---

## 단계별 실행 흐름

### 타임라인 다이어그램

```
사용자가 좋아요 버튼 클릭
    │
    ├─ [0ms] onMutate 시작
    │   ├─ 진행 중인 쿼리 취소
    │   ├─ 현재 캐시 데이터 스냅샷 저장
    │   └─ 캐시 데이터 즉시 업데이트 (UI 즉각 반응)
    │
    ├─ [1ms] mutationFn 실행 (서버 요청 시작)
    │   │
    │   └─ [200ms] 서버 응답 대기...
    │
    ├─ [201ms] 서버 응답 도착
    │
    └─ [202ms] 성공/실패에 따라 분기
        │
        ├─ 성공 케이스
        │   ├─ onSuccess: 토스트 알림 표시
        │   └─ onSettled: 쿼리 무효화 (최신 데이터 페치)
        │
        └─ 실패 케이스
            ├─ onError: 캐시 롤백 + 에러 토스트
            └─ onSettled: 쿼리 무효화
```

---

## Optimistic Update 패턴

### onMutate: 요청 전 처리

이 단계는 **사용자가 버튼을 클릭한 직후 즉시 실행**됩니다.

```typescript
onMutate: async ({ articleId, userId }) => {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Step 1: 진행 중인 쿼리 취소
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  await queryClient.cancelQueries({
    queryKey: QUERY_KEY.ARTICLE.PUBLIC,
  });
  await queryClient.cancelQueries({
    queryKey: QUERY_KEY.ARTICLE.DETAIL(articleId),
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Step 2: 현재 캐시 데이터 스냅샷 저장 (롤백용)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const previousInfiniteData = queryClient.getQueryData(
    QUERY_KEY.ARTICLE.PUBLIC,
  );
  const previousDetailData = queryClient.getQueryData(
    QUERY_KEY.ARTICLE.DETAIL(articleId),
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Step 3: Optimistic Update - 무한 스크롤 목록
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  queryClient.setQueryData<{
    pages: Array<{ data: ArticleWithAuthorInfo[] }>;
    pageParams: unknown[];
  }>(QUERY_KEY.ARTICLE.PUBLIC, (old) => {
    if (!old) return old;

    return {
      ...old,
      pages: old.pages.map((page) => ({
        ...page,
        data: page.data.map((article) =>
          article.id === articleId
            ? {
                ...article,
                // 좋아요 상태 토글
                isLiked: !article.isLiked,
                // 좋아요 개수 증감
                likeCount: article.isLiked
                  ? article.likeCount - 1  // 취소
                  : article.likeCount + 1, // 추가
              }
            : article,
        ),
      })),
    };
  });

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Step 4: Optimistic Update - 상세 페이지
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  queryClient.setQueryData<ArticleWithAuthorInfo>(
    QUERY_KEY.ARTICLE.DETAIL(articleId),
    (old) => {
      if (!old) return old;

      return {
        ...old,
        isLiked: !old.isLiked,
        likeCount: old.isLiked ? old.likeCount - 1 : old.likeCount + 1,
      };
    },
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Step 5: 롤백용 데이터 반환 (context로 전달됨)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  return { previousInfiniteData, previousDetailData };
},
```

### 각 Step의 역할

#### Step 1: 진행 중인 쿼리 취소

```typescript
await queryClient.cancelQueries({
  queryKey: QUERY_KEY.ARTICLE.PUBLIC,
});
```

**왜 필요한가?**
- 사용자가 버튼을 빠르게 연타하는 경우 대비
- 이전 요청이 완료되기 전에 새 요청이 들어오면 충돌 방지
- 네트워크 리소스 절약

**실제 시나리오:**
```
사용자가 0.1초 간격으로 3번 클릭
  ├─ 1번째 클릭: 요청 시작
  ├─ 2번째 클릭: 1번째 요청 취소 + 새 요청 시작
  └─ 3번째 클릭: 2번째 요청 취소 + 새 요청 시작
  → 최종적으로 3번째 요청만 서버에 도달
```

#### Step 2: 스냅샷 저장

```typescript
const previousInfiniteData = queryClient.getQueryData(
  QUERY_KEY.ARTICLE.PUBLIC,
);
```

**저장되는 데이터 구조:**
```typescript
{
  pages: [
    {
      data: [
        {
          id: "article-1",
          content: "...",
          likeCount: 10,    // 현재 값
          isLiked: false,   // 현재 상태
          // ...
        }
      ],
      nextId: "...",
    }
  ],
  pageParams: [""]
}
```

**왜 필요한가?**
- 서버 요청이 실패했을 때 원래 상태로 복구
- `onError`에서 이 데이터를 사용해 롤백

#### Step 3 & 4: Optimistic Update

**무한 스크롤 데이터 구조 이해:**

```typescript
// React Query의 Infinite Query 구조
{
  pages: [        // 각 페이지 배열
    {
      data: [...],   // 게시물 목록
      nextId: "...", // 다음 페이지 커서
    },
    {
      data: [...],
      nextId: "...",
    }
  ],
  pageParams: [...] // 페이지 파라미터
}
```

**업데이트 로직:**

```typescript
old.pages.map((page) => ({
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
      : article,  // 다른 게시물은 그대로 유지
  ),
}))
```

**단계별 변환:**

```typescript
// Before (좋아요 전)
{
  id: "article-123",
  likeCount: 10,
  isLiked: false,
}

// After (좋아요 후)
{
  id: "article-123",
  likeCount: 11,     // +1
  isLiked: true,     // 토글
}
```

---

## 에러 처리 및 롤백

### onError: 실패 시 복구

```typescript
onError: (error, variables, context) => {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Step 1: 무한 스크롤 목록 롤백
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (context?.previousInfiniteData) {
    queryClient.setQueryData(
      QUERY_KEY.ARTICLE.PUBLIC,
      context.previousInfiniteData,  // onMutate에서 저장한 스냅샷
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Step 2: 상세 페이지 롤백
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (context?.previousDetailData) {
    queryClient.setQueryData(
      QUERY_KEY.ARTICLE.DETAIL(variables.articleId),
      context.previousDetailData,
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Step 3: 사용자에게 에러 알림
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  console.error(error);
  toast.error(TOAST_MESSAGE.ARTICLE.LIKE.EXCEPTION, {
    description: error.message,
  });
},
```

### 롤백 플로우

```
에러 발생
    │
    ├─ [1] context에서 previousInfiniteData 가져오기
    │      (onMutate에서 저장한 스냅샷)
    │
    ├─ [2] setQueryData로 캐시 복원
    │      likeCount: 11 → 10
    │      isLiked: true → false
    │
    ├─ [3] UI가 자동으로 재렌더링 (원래 상태로 돌아감)
    │
    └─ [4] 사용자에게 에러 토스트 표시
           "좋아요 처리 중 오류가 발생했습니다."
```

**실제 예시:**

```typescript
// onMutate에서 저장된 스냅샷
context = {
  previousInfiniteData: {
    pages: [{
      data: [{ id: "123", likeCount: 10, isLiked: false }]
    }]
  }
}

// 에러 발생 시
// → likeCount: 11, isLiked: true (잘못된 상태)
// → 롤백
// → likeCount: 10, isLiked: false (원래 상태 복구)
```

---

## 캐시 업데이트 전략

### onSettled: 최종 동기화

```typescript
onSettled: (data, error, variables) => {
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // 성공/실패 무관하게 항상 실행
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // 무한 스크롤 목록 무효화
  void queryClient.invalidateQueries({
    queryKey: QUERY_KEY.ARTICLE.PUBLIC,
  });

  // 해당 게시물 상세 페이지 무효화
  void queryClient.invalidateQueries({
    queryKey: QUERY_KEY.ARTICLE.DETAIL(variables.articleId),
  });

  // 좋아요 상태 쿼리 무효화
  void queryClient.invalidateQueries({
    queryKey: QUERY_KEY.ARTICLE.CHECK_LIKED(
      Number(variables.articleId),
      variables.userId,
    ),
  });
},
```

### invalidateQueries의 역할

```typescript
queryClient.invalidateQueries({
  queryKey: QUERY_KEY.ARTICLE.PUBLIC,
});
```

**동작 원리:**

1. **캐시를 "stale" (오래됨) 상태로 마킹**
2. **해당 쿼리를 사용 중인 컴포넌트가 있으면 자동으로 리페치**
3. **서버에서 최신 데이터를 가져와 캐시 갱신**

**왜 필요한가?**

- Optimistic Update는 **예상값**일 뿐
- 서버의 **실제값**과 동기화 필요
- 다른 사용자가 좋아요를 눌렀을 수도 있음

### 캐시 동기화 타임라인

```
[0ms] 사용자 클릭
  ├─ Optimistic Update: likeCount = 11 (예상)
  │
[200ms] 서버 응답
  ├─ onSuccess 실행
  ├─ onSettled 실행
  │   └─ invalidateQueries 호출
  │
[250ms] 리페치 시작
  │
[450ms] 서버에서 최신 데이터 도착
  └─ 캐시 업데이트: likeCount = 11 (실제)
      └─ UI 재렌더링 (대부분의 경우 변화 없음)
```

---

## 실전 시나리오

### 시나리오 1: 정상 플로우

```typescript
// 초기 상태
article = { id: "123", likeCount: 10, isLiked: false }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. 사용자가 좋아요 버튼 클릭
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
likeArticle({ articleId: "123", userId: "user-1" });

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. onMutate 실행 (즉시)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// - 스냅샷 저장: { likeCount: 10, isLiked: false }
// - Optimistic Update: { likeCount: 11, isLiked: true }
// → UI가 즉시 업데이트됨 ✨

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. mutationFn 실행 (서버 요청)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// → 200ms 대기...
// → 서버 응답: { isLiked: true, likeCount: 11 }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. onSuccess 실행
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
toast.success("좋아요를 눌렀습니다.");

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. onSettled 실행
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// - invalidateQueries 호출
// - 리페치 후 최신 데이터로 동기화
// → 최종 상태: { likeCount: 11, isLiked: true } ✅
```

### 시나리오 2: 네트워크 에러

```typescript
// 초기 상태
article = { id: "123", likeCount: 10, isLiked: false }

// 사용자 클릭
likeArticle({ articleId: "123", userId: "user-1" });

// onMutate 실행
// → Optimistic Update: { likeCount: 11, isLiked: true }
// → UI가 즉시 업데이트됨 ✨

// mutationFn 실행
// → 네트워크 타임아웃 ❌
// → Error: "Failed to fetch"

// onError 실행
// → 롤백: { likeCount: 10, isLiked: false }
// → UI가 원래 상태로 돌아감
toast.error("좋아요 처리 중 오류가 발생했습니다.");

// onSettled 실행
// → invalidateQueries 호출
// → 리페치로 서버 상태 확인
// → 최종 상태: { likeCount: 10, isLiked: false } ✅
```

### 시나리오 3: 빠른 연타 (토글)

```typescript
// 초기 상태
article = { id: "123", likeCount: 10, isLiked: false }

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1번째 클릭 (좋아요)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
likeArticle({ articleId: "123", userId: "user-1" });
// → onMutate: { likeCount: 11, isLiked: true }
// → mutationFn 시작...

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2번째 클릭 (좋아요 취소) - 0.1초 후
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
likeArticle({ articleId: "123", userId: "user-1" });
// → cancelQueries: 1번째 요청 취소 ✋
// → onMutate: { likeCount: 10, isLiked: false }
// → mutationFn 시작...

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 서버 응답 (2번째 요청만)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// → { isLiked: false, likeCount: 10 }
// → onSuccess 실행
toast.success("좋아요를 취소했습니다.");
// → 최종 상태: { likeCount: 10, isLiked: false } ✅
```

### 시나리오 4: 동시 다발적 좋아요 (여러 게시물)

```typescript
// 사용자가 3개 게시물에 거의 동시에 좋아요
likeArticle({ articleId: "123", userId: "user-1" });  // 0ms
likeArticle({ articleId: "456", userId: "user-1" });  // 10ms
likeArticle({ articleId: "789", userId: "user-1" });  // 20ms

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 각각 독립적으로 처리됨
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// 게시물 123
// → onMutate: Optimistic Update
// → mutationFn: 서버 요청
// → onSuccess: 토스트 알림 (좋아요를 눌렀습니다.)

// 게시물 456
// → onMutate: Optimistic Update
// → mutationFn: 서버 요청
// → onSuccess: 토스트 알림 (좋아요를 눌렀습니다.)

// 게시물 789
// → onMutate: Optimistic Update
// → mutationFn: 서버 요청
// → onSuccess: 토스트 알림 (좋아요를 눌렀습니다.)

// 모두 성공 ✅
```

---

## 핵심 개념 정리

### 1. Optimistic Update란?

**사용자 경험 비교:**

#### ❌ Optimistic Update 없이
```
사용자 클릭 → 서버 응답 대기 (200ms) → UI 업데이트
         └─ 사용자는 200ms 동안 아무 반응 없음 😢
```

#### ✅ Optimistic Update 사용
```
사용자 클릭 → 즉시 UI 업데이트 → 백그라운드 서버 요청
         └─ 사용자는 즉각적인 반응 체감 😊
```

### 2. Context의 역할

```typescript
// onMutate에서 반환
return { previousInfiniteData, previousDetailData };

// onError에서 사용
onError: (error, variables, context) => {
  // context = { previousInfiniteData, previousDetailData }
  queryClient.setQueryData(..., context.previousInfiniteData);
}
```

**Context는 onMutate와 onError/onSuccess/onSettled를 연결하는 다리**

### 3. 쿼리 무효화 vs 직접 업데이트

```typescript
// 직접 업데이트 (Optimistic Update)
queryClient.setQueryData(key, newData);
// → 즉시 캐시 변경, 서버 요청 없음

// 쿼리 무효화 (Invalidation)
queryClient.invalidateQueries({ queryKey: key });
// → 캐시를 stale로 마킹, 자동 리페치
```

---

## 성능 최적화 팁

### 1. 불필요한 리렌더링 방지

```typescript
// ❌ 나쁜 예: 매번 새 함수 생성
{articles.map(article => (
  <ArticleCard
    onLike={() => likeArticle({ articleId: article.id, userId: me.id })}
  />
))}

// ✅ 좋은 예: 함수를 미리 정의
{articles.map(article => {
  const handleLike = () => {
    likeArticle({ articleId: article.id, userId: me.id });
  };
  return <ArticleCard onLike={handleLike} />;
})}
```

### 2. 조건부 실행

```typescript
const handleLike = () => {
  // 로그인 확인 먼저
  if (!me?.id) {
    toast.info("로그인이 필요합니다.");
    return;
  }
  likeArticle({ articleId, userId: me.id });
};
```

### 3. 디바운싱 (선택적)

빠른 연타를 막고 싶다면:

```typescript
const debouncedLike = useMemo(
  () => debounce((articleId, userId) => {
    likeArticle({ articleId, userId });
  }, 300),
  [likeArticle]
);
```

---

## 요약

### useLikeArticle의 핵심 동작

1. **즉각 반응**: 버튼 클릭 시 0.001초 내 UI 업데이트
2. **백그라운드 동기화**: 서버 요청은 뒤에서 처리
3. **자동 복구**: 실패 시 원래 상태로 롤백
4. **최종 동기화**: 서버 응답 후 실제 데이터로 갱신

### 사용자가 체감하는 것

- ✨ 버튼이 즉시 반응함
- ⚡ 앱이 빠르다고 느낌
- 🛡️ 에러가 발생해도 안정적으로 복구
- 🔄 항상 최신 상태 유지

이것이 **Optimistic Update 패턴의 힘**입니다! 🚀
