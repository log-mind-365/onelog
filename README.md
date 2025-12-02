# OneLog 프로젝트

## 실행 방법
```bash
# install dependencies
bun install

# run server
bun run dev
```

## 폴더 구조 (FSD Architecture)
`src/` 디렉토리는 기능 단위로 분리된 FSD 패턴을 따릅니다.

```
src/
├── app/          # Next.js App Router (페이지 라우팅)
├── widgets/      # 페이지를 구성하는 독립적인 UI 블록 (DataTable, DashboardStats 등)
├── entities/     # 비즈니스 도메인 로직 (Merchant, Payment 모델 및 API)
├── shared/       # 재사용 가능한 공통 컴포넌트(UI Kit), 유틸리티, 훅
```

## 커밋 컨벤션

| 태그       | 설명            | 예시                                     |
|----------|---------------|----------------------------------------|
| feat     | 새로운 기능 추가     | `feat: 결제 리스트 api 연동`                  |
| fix      | 버그 수정         | `fix: 날짜 포맷팅 오류 수정`                    |
| refactor | 코드 리팩토링       | `refactor: 결제 내역 훅을 api 폴더로 이동`        |
| style    | 코드 포맷팅 오타 수정  | `style: 코드 포맷팅 및 세미콜론 추가`              |
| docs     | 문서 수정         | `docs: README 실행 방법 업데이트`              |
| chore    | 설정 변경/빌드      | `chore: 패키지 의존성 설치 및 .github 폴더 생성`    |
| rename   | 파일,컴포넌트 이름 변경 | `rename: Button -> AppButton 컴포넌트명 수정` |
| remove   | 파일, 코드 구문 삭제  | `remove: 미사용 임포트 구문 삭제`                 |
