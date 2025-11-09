# 아티클 신고 기능

## 개요

OneLog의 아티클 신고 기능은 사용자가 부적절한 게시물을 신고할 수 있도록 하는 기능입니다. 이 문서는 신고 기능의 전체 작동 로직과 데이터 흐름을 설명합니다.

## 데이터베이스 스키마

### reports 테이블

위치: `src/db/schemas/reports.ts`

```typescript
{
  id: uuid (Primary Key, Auto-generated)
  articleId: uuid (Foreign Key → articles.id, CASCADE DELETE)
  reporterId: uuid (Foreign Key → auth.users.id, CASCADE DELETE)
  reportType: enum('spam', 'inappropriate', 'harassment', 'other')
  reason: text (Optional)
  createdAt: timestamp (Auto-generated)
}
```

### RLS (Row Level Security) 정책

1. **Select 정책**: 인증된 사용자는 자신이 신고한 내역만 조회 가능
   - `reporter_id = auth.uid()`

2. **Insert 정책**: 인증된 사용자는 자신의 ID로만 신고 생성 가능
   - `reporter_id = auth.uid()`

## 아키텍처 구조

### 1. 서버 액션 (Server Action)

**파일**: `src/entities/article/api/server.ts`

```typescript
reportArticle(params: {
  articleId: string;
  reporterId: string;
  reportType: "spam" | "inappropriate" | "harassment" | "other";
  reason?: string;
}): Promise<void>
```

**로직**:
1. 중복 신고 체크: 같은 사용자가 같은 게시물을 이미 신고했는지 확인
2. 중복이면 "이미 신고한 게시물입니다." 에러 발생
3. 중복이 아니면 reports 테이블에 신고 내역 삽입

### 2. Mutation Hook

**파일**: `src/features/article/lib/use-report-article.ts`

```typescript
useReportArticle(): UseMutationResult
```

**기능**:
- TanStack Query의 `useMutation` 사용
- 서버 액션 `reportArticle` 호출
- 성공 시: "신고가 접수되었습니다." 토스트 메시지 표시
- 실패 시: 에러 메시지와 함께 토스트 표시

### 3. UI 컴포넌트

#### 3.1 신고 버튼 (ArticleReportButton)

**파일**: `src/entities/article/ui/article-report-button.tsx`

- 깃발(Flag) 아이콘 표시
- 클릭 시 신고 다이얼로그 오픈
- hover 시 빨간색으로 변경되어 경고 표시

#### 3.2 신고 다이얼로그 (ReportArticleDialog)

**파일**: `src/features/article/ui/report-article-dialog.tsx`

**구성 요소**:
1. **신고 유형 선택** (Select)
   - 스팸
   - 부적절한 콘텐츠
   - 괴롭힘
   - 기타

2. **상세 사유 입력** (Textarea, Optional)
   - 사용자가 추가 설명 작성 가능

3. **액션 버튼**
   - 취소: 다이얼로그 닫기
   - 신고하기: mutation 실행

## 데이터 흐름

### 전체 흐름도

```
User Click (ArticleReportButton)
    ↓
Event Handler (handleReport)
    ↓
Authentication Check
    ├─ Not Authenticated → Open "auth-guard" modal
    └─ Authenticated → Open "report-article" modal
        ↓
    User fills report form
        ↓
    Submit button click
        ↓
    useReportArticle mutation
        ↓
    Server Action: reportArticle
        ↓
    Database Operation
        ├─ Check duplicate
        │   ├─ Duplicate → Throw Error
        │   └─ Not Duplicate → Insert report
        ↓
    Success/Error Handling
        ├─ Success → Close modal + Success toast
        └─ Error → Error toast with message
```

### 상세 구현별 데이터 흐름

#### A. 홈 피드에서 신고하기

**흐름**:
1. `HomePageView` → `InfiniteArticleList` → `ArticleCard` → `ArticleCardContent` → `ArticleReportButton`

**이벤트 핸들러**:
```typescript
// src/views/home/home-page-view.tsx
const handleReport = (articleId, reporterId) => (e) => {
  e.stopPropagation(); // 카드 클릭 이벤트 전파 방지
  if (!reporterId) {
    openModal("auth-guard");
  } else {
    openModal("report-article", { articleId, reporterId });
  }
};
```

**Props 전달 체인**:
- `HomePageView`: `handleReport` 정의
- `InfiniteArticleList`: `onReport` prop으로 전달
- `ArticleCard`: `onReport` prop 전달
- `ArticleCardContent`: `onReport` prop 전달
- `ArticleReportButton`: `onClick` prop으로 연결

#### B. 아티클 상세 페이지에서 신고하기

**흐름**:
1. `ArticleDetailPageView` → `ArticleDetailPageActionbar` → `ArticleReportButton`

**이벤트 핸들러**:
```typescript
// src/views/article/article-article-detail-page-view.tsx
const handleReport = (e) => {
  e.stopPropagation();
  if (!userId) {
    openModal("auth-guard");
  } else {
    openModal("report-article", { articleId: id, reporterId: userId });
  }
};
```

**Props 전달**:
- `ArticleDetailPageView`: `handleReport` 정의
- `ArticleDetailPageActionbar`: `onReport` prop으로 전달
- `ArticleReportButton`: `onClick` prop으로 연결

## 모달 관리

### Modal Store

**파일**: `src/app/_providers/modal-store.ts`

**타입 정의**:
```typescript
type ModalType = "report-article" | ...;

type ReportArticleDialogProps = {
  articleId: string;
  reporterId: string;
};
```

**상태 관리**:
- Zustand를 사용한 전역 모달 상태 관리
- `openModal("report-article", props)`: 모달 열기
- `closeModal()`: 모달 닫기

### Modal Provider

**파일**: `src/shared/provider/modal-provider.tsx`

```tsx
{currentModal === "report-article" && <ReportArticleDialog />}
```

- 현재 열린 모달 타입에 따라 해당 다이얼로그 렌더링
- Dialog 컴포넌트로 래핑하여 오버레이 및 애니메이션 제공

## 인증 가드

신고 기능은 로그인한 사용자만 사용할 수 있습니다:

1. **버튼 클릭 시**: `userId` 또는 `reporterId` 체크
2. **미인증 상태**: `auth-guard` 모달 표시
   - 로그인 유도 메시지
   - 로그인 페이지로 이동 버튼 제공
3. **인증 상태**: `report-article` 모달 표시

## 에러 처리

### 1. 중복 신고
- **발생 시점**: 서버 액션 실행 시
- **에러 메시지**: "이미 신고한 게시물입니다."
- **처리**: Toast 에러 메시지 표시

### 2. 네트워크 에러
- **발생 시점**: mutation 실행 중
- **처리**: `onError` 콜백에서 에러 메시지 표시

### 3. 인증 에러
- **발생 시점**: RLS 정책 위반 시
- **처리**: 데이터베이스 레벨에서 차단, 에러 메시지 표시

## 사용 예시

### 사용자 관점

1. 사용자가 홈 피드나 아티클 상세 페이지에서 신고 버튼 클릭
2. 로그인 상태 확인
   - 미로그인: 로그인 유도 모달 표시
   - 로그인: 신고 다이얼로그 표시
3. 신고 유형 선택 (필수)
4. 상세 사유 입력 (선택)
5. "신고하기" 버튼 클릭
6. 성공 메시지 확인 또는 에러 처리

### 개발자 관점

신고 버튼을 추가하려면:

```tsx
import { ArticleReportButton } from "@/entities/article/ui/article-report-button";
import { useModal } from "@/app/_providers/modal-store";

const MyComponent = () => {
  const { openModal } = useModal();
  const userId = "..."; // 현재 사용자 ID
  const articleId = "..."; // 신고할 아티클 ID

  const handleReport = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 필요한 경우
    if (!userId) {
      openModal("auth-guard");
    } else {
      openModal("report-article", {
        articleId,
        reporterId: userId,
      });
    }
  };

  return <ArticleReportButton onClick={handleReport} />;
};
```

## 향후 개선 사항

1. **관리자 대시보드**: 신고 내역 조회 및 관리 기능
2. **신고 통계**: 게시물별 신고 횟수 표시
3. **자동 조치**: 일정 신고 횟수 초과 시 자동 숨김 처리
4. **신고자 보호**: 신고자 정보 익명화
5. **신고 철회**: 잘못 신고한 경우 취소 기능
6. **신고 결과 알림**: 신고 처리 결과 사용자에게 알림

## 관련 파일

### Database
- `src/db/schemas/reports.ts` - reports 테이블 스키마

### Server Actions
- `src/entities/article/api/server.ts` - reportArticle 함수

### Hooks
- `src/features/article/lib/use-report-article.ts` - useReportArticle mutation

### UI Components
- `src/entities/article/ui/article-report-button.tsx` - 신고 버튼
- `src/features/article/ui/report-article-dialog.tsx` - 신고 다이얼로그

### State Management
- `src/app/_providers/modal-store.ts` - 모달 상태 관리
- `src/shared/provider/modal-provider.tsx` - 모달 프로바이더

### Views
- `src/views/home/home-page-view.tsx` - 홈 피드 신고
- `src/views/article/article-detail-page-view.tsx` - 상세 페이지 신고
- `src/views/article/article-detail-page-actionbar.tsx` - 액션바
- `src/widgets/card/article-card.tsx` - 아티클 카드
- `src/widgets/card/article-card-content.tsx` - 카드 콘텐츠
- `src/widgets/card/infinite-article-list.tsx` - 무한 스크롤 리스트

## 테스트 시나리오

### 1. 정상 케이스
- [ ] 로그인 상태에서 신고 버튼 클릭 → 다이얼로그 표시
- [ ] 신고 유형 선택 → 선택 값 반영
- [ ] 상세 사유 입력 → 입력 값 저장
- [ ] 신고하기 클릭 → 성공 메시지 표시
- [ ] 취소 버튼 클릭 → 다이얼로그 닫힘

### 2. 에러 케이스
- [ ] 미로그인 상태에서 신고 버튼 클릭 → 로그인 유도 모달 표시
- [ ] 동일 게시물 재신고 → "이미 신고한 게시물입니다." 에러 표시
- [ ] 네트워크 에러 발생 → 에러 메시지 표시

### 3. UI/UX 케이스
- [ ] 카드에서 신고 버튼 클릭 → 카드 클릭 이벤트 전파 방지 (stopPropagation)
- [ ] 신고 다이얼로그 오픈 중 → 로딩 스피너 표시
- [ ] 신고 완료 후 → 다이얼로그 자동 닫힘 및 폼 초기화
