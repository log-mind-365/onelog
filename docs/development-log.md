# OneLog 개발 로그

최근 한 달간의 주요 업데이트 내역을 주차별로 정리한 문서입니다.

---

## 1주차 (2025.10.30 ~ 2025.11.05)

### 1. 프로젝트 초기 설정 및 인증 시스템 구축
- Next.js 16 (App Router) + React 19 기반 프로젝트 초기화
- Supabase Auth를 활용한 회원가입/로그인 시스템 구현
- Feature-Sliced Design (FSD) 아키텍처 적용
- 인증 관련 UI 컴포넌트 및 모달 시스템 구현

### 2. 게시글 작성 및 감정 레벨 시스템
- 게시글 CRUD 기능 구현 (작성, 조회, 수정, 삭제)
- 감정 레벨(Emotion Level) 선택 기능 추가
- 게시글 공개/비공개 설정 (`accessType` 필드)
- TipTap 리치 텍스트 에디터 통합

### 3. 무한 스크롤 기반 피드 시스템
- TanStack Query를 활용한 무한 스크롤 구현
- IntersectionObserver 기반 최적화된 스크롤 로직
- 게시글 카드 컴포넌트 UI 구현
- 실시간 데이터 업데이트 및 캐싱 전략

### 4. 게시글 좋아요 기능
- 좋아요/좋아요 취소 기능 구현
- 낙관적 업데이트(Optimistic Update)로 즉각적인 UI 반응
- 좋아요 수 실시간 동기화
- 데이터베이스 스키마 및 RLS 정책 설정

---

## 2주차 (2025.11.06 ~ 2025.11.09)

### 1. 댓글 시스템 구현
- 댓글 작성, 수정, 삭제 기능 구현
- 댓글 수 실시간 표시 및 업데이트
- 댓글 Entity 및 Feature 레이어 구조화
- 데이터베이스 cascade 삭제 정책 설정

### 2. 게시글 신고 기능
- 게시글 신고 다이얼로그 UI 구현
- 신고 유형 선택 (스팸, 부적절한 콘텐츠, 괴롭힘, 기타)
- 중복 신고 방지 로직
- 신고 데이터베이스 스키마 및 RLS 정책

### 3. 프로필 및 이미지 업로드 시스템
- Supabase Storage를 활용한 아바타 업로드 기능
- 프로필 커버 이미지 업로드 기능
- 이미지 비율 유지 및 최적화
- 사이드바 아바타 실시간 동기화

### 4. UI/UX 개선 및 리팩토링
- 게시글 제목(Title) 필드 추가
- 다크 모드 테마 토글 기능 구현
- 툴팁 컴포넌트 통합 및 접근성 개선
- FSD 아키텍처 준수를 위한 전반적인 코드 구조 개선
- 불필요한 컴포넌트 제거 및 코드 정리

---

## 기술 스택

- **Frontend**: Next.js 16, React 19, TailwindCSS, Radix UI, shadcn/ui
- **Backend**: Supabase (Auth, Database, Storage)
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: Zustand, TanStack Query
- **Editor**: TipTap
- **Forms**: React Hook Form + Zod
- **Package Manager**: Bun

---

## 주요 아키텍처 특징

- **Feature-Sliced Design**: 레이어별 명확한 관심사 분리
- **Server Actions**: Next.js App Router의 서버 액션 활용
- **Optimistic Updates**: 즉각적인 사용자 경험 제공
- **Type Safety**: TypeScript + Zod를 통한 완전한 타입 안전성
