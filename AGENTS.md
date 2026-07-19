# AGENTS.md — deldar-project

## Core commands
```bash
npm install
npm run dev        # Vite dev, proxies /api → https://ipcphotos.com
npm run build      # dist/ output
npm run lint       # ESLint (0 errors, 0 warnings)
npm run preview    # Preview built output
```
No tests exist.

## Stack (no TypeScript, no Tailwind v4)
- **React 19 + Vite 8** — JSX only, no TypeScript
- **Tailwind ^4.3.2** — installed but **NOT configured** (no plugin/import). All styling via `src/assets/styles/style.css`.
- **react-router-dom v7** — `createBrowserRouter` + `PrivateRoute` guard
- **Axios** — `/api` base URL, JWT + draft token interceptors, auto 401 refresh clears tokens + redirects

## Auth
- `access_token` + `refresh_token` in localStorage
- `draft_token` in localStorage for pre-registration
- Auto-refresh on 401; fails → clear all tokens → `/login`
- `PrivateRoute.jsx` guards `/dashboard`, redirects logged-in users from `/login`, `/register`

## Project structure
- Entry: `index.html` → `src/main.jsx` (wraps AuthProvider + RegisterDataProvider + RouterProvider)
- Main files:
  - `src/services/api.js` — axios + interceptors
  - `src/context/AuthContext.jsx` / `RegisterDataContext.jsx`
  - `src/routes/AppRouter.jsx`
  - `src/utils/constants.js` — MAX_WORKS=50, MAX_IMAGE_SIZE_MB=5, ALLOWED_IMAGE_TYPES=["image/jpeg"], CAMPAIGN_END_DATE="2026-07-08T23:59:59"
- Empty services: `uploadService.js`, `userService.js`

## Persian-specific
- RTL layout (`dir="rtl"`), Persian UI text throughout
- Persian fonts: `w_Lotus` (body), `w_Nian` (headings) — `@font-face` in `src/assets/styles/style.css`
- Error messages use `src/utils/toast.js`, `src/utils/errorHandler.js`, `src/utils/validators.js`
- RTL date handling via `toPersianDate.js`

## Quirks
- `eslint.config.js` uses flat config with `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh`
- Tailwind 4 installed but unused; `tailwind.config.js` exists but ignored
- `react-hook-form` uses `watch()` with `eslint-disable-line react-hooks/incompatible-library` in 3 places (checkform.jsx, PersonalInfoForm.jsx, PersonalInfo.jsx)
- Empty: no tests, no `.env.example`, no TypeScript
