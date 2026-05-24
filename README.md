# graeseo-web

> 그래서 — "그래서 그게 내 종목에 어쨌다는 거야?"를 해결하는 주식 이벤트 인사이트 앱

메인피드 웹 앱. Android/iOS WebView에서 로드되는 React 기반 콘텐츠 레이어.

## 기술 스택

- React 18 + Vite
- Vitest (단위 테스트)
- React Testing Library (컴포넌트 테스트)
- Playwright (E2E)

## 브랜치 전략 (Git Flow)

```
main      ← 프로덕션 배포
develop   ← 통합 브랜치
feature/* ← 기능 개발
release/* ← 릴리즈 준비
hotfix/*  ← 긴급 수정
```

## 시작하기

```bash
npm install
npm run dev
```

## 테스트

```bash
npm test
```
