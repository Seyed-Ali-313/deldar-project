# AGENTS.md — deldar-project

## Commands
```bash
npm install
npm run dev        # Vite dev server, proxies /api → https://ipcphotos.com
npm run build      # production build to dist/
npm run lint       # ESLint (flat config, eslint.config.js)
npm run preview    # Vite preview of built output
```

No tests or typecheck exist — JSX only despite `@types/react` in deps.

## Stack
- **React 19 + Vite 8** — JSX only, no TypeScript
- **Tailwind CSS ^4.3.2** — but uses v3-style `tailwind.config.js`; no postcss.config.js
- **react-router-dom v7** — `createBrowserRouter` + `PrivateRoute` guard
- **framer-motion** — `AnimatePresence` page transitions
- **Axios** — base URL `/api`, JWT + draft token auth interceptors, auto 401 refresh
- **react-hook-form** — form validation with custom validators in `src/utils/validators.js`
- **react-toastify** — Persian-styled toasts

## Auth model
- **JWT**: `access_token` + `refresh_token` in localStorage for logged-in users
- **Draft token**: `draft_token` in localStorage for pre-registration onboarding
- Auto-refresh on 401; clears tokens + redirects `/login` on failure
- `PrivateRoute.jsx` guards `/dashboard`, `/upload-success`; redirects logged-in users away from `/login`, `/register`, `/rules`

## Project wiring
- **Entry**: `index.html` → `src/main.jsx` (wraps AuthProvider + RegisterDataProvider + RouterProvider)
- **Routes**: `src/routes/AppRouter.jsx` — all routes with animated page wrappers
- **Layout**: `src/components/layout/Layout.jsx` — Header + Outlet + ToastContainer (rtl, dark theme)
- **Register flow**: 3 steps (PersonalInfoForm → AdditionalInfoForm → WorksForm) via `RegisterDataContext`, backed by `onboardingService`
- **Dashboard**: profile mgmt, work CRUD via `dashboardService`
- **Services**: `api.js` (base axios instance + interceptors), `authService.js`, `dashboardService.js`, `onboardingService.js`
- **`uploadService.js` and `userService.js` are empty** — not yet implemented

## Non-obvious constraints
- **Image rules** (hardcoded in `src/utils/constants.js`): JPG only, ≤5MB, 1000–1500px, max 50 works
- **Campaign end date** hardcoded at `src/utils/constants.js:8` — `"2026-07-08T23:59:59"`
- Dev API at `https://ipcphotos.com` proxied via `/api` (see `vite.config.js`)
- Custom Persian fonts: `w_Lotus` (body), `w_Nian` (headings) — `@font-face` in `src/assets/styles/style.css`
- RTL layout (`dir="rtl"`), Persian UI text throughout
- No `.env.example` exists despite `.env` being gitignored
- Toast and error messages are fully Persian — use existing helpers in `src/utils/toast.js` and `src/utils/errorHandler.js`
