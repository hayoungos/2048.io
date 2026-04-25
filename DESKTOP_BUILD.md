# 데스크탑 앱(.app / .exe)로 빌드하기 (Electron)

웹앱을 그대로 감싸서 “다운로드/설치 가능한 앱”으로 만듭니다.

## 준비물

- Node.js + npm

## 로컬 실행

```bash
cd desktop
npm install
npm run dev
```

기본으로 `https://2048-io.vercel.app/`을 띄웁니다.

다른 URL로 실행:

```bash
APP_URL="https://your-domain.example" npm run dev
```

## 빌드

macOS:

```bash
cd desktop
npm install
npm run build:mac
```

Windows(윈도우 PC에서 실행):

```bash
cd desktop
npm install
npm run build:win
```

결과물은 `desktop/dist/`에 생성됩니다.

## 배포(다운로드 링크)

만든 `.dmg` / `.exe`를 GitHub Releases에 업로드하면 됩니다.

