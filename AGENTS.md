# AGENTS.md — DevPower

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc && vite build` (type-check then bundle to `dist/`) |
| `npm run lint` | ESLint on `.ts`/`.tsx` (zero warnings tolerated) |
| `npm run preview` | Serve production build locally |

**No test framework is installed.** There are no test files, no vitest/jest, and no test script. Do not attempt to run tests.

**Order matters for verification:** `npm run lint` then `npm run build` (build includes `tsc`).

## Architecture

- **Single-package React app** (Vite 5 + TypeScript 5 strict + React 18 + Tailwind 3)
- **State:** Zustand 4 with `persist` (localStorage) — `src/store/index.ts`
- **Routing:** React Router 6 with `HashRouter` (required for GitHub Pages)
- **Base path:** `/dev-power/` (set in `vite.config.ts` — do not change without updating deploy config)
- **Entry:** `index.html` → `src/main.tsx` → `src/app/App.tsx`

### Tool system

Every tool is a folder under `src/tools/<id>/` with three files:
- `logic.ts` — pure functions, no React imports. Export processing functions and result types.
- `types.ts` — interfaces/types for the tool
- `index.tsx` — React component (default export, lazy-loaded)

Tools are registered in `src/core/registry/index.ts` in the `tools` array with a `lazy(() => import(...))` import. **Tool components must be default-exported** for `React.lazy()` to work.

Adding a tool: create folder → register in `src/core/registry/index.ts` → add category color in `src/core/types/index.ts` and `src/components/WelcomePage.tsx`.

### Path alias

`@/*` maps to `src/*` (configured in `tsconfig.json`). Use it for imports.

## Code style

- **TypeScript strict mode** with `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- `interface` for component props; `type` for unions/aliases. No enums.
- Tailwind utility classes only (no CSS modules, no styled-components)
- Custom `cn()` utility at `src/core/utils/cn.ts` — do not install clsx or tailwind-merge
- Dark mode default. Color palette: violet primary, zinc neutrals, JetBrains Mono font.
- Consistent result shapes: `{ success: boolean; output: string; error?: string }` (or tool-specific variants)
- `import type` for type-only imports
- ESLint config is embedded in the `lint` script flags, not a config file

## Gotchas

- `.github/workflows/` is empty — CLAUDE.md references a deploy workflow that does not exist yet
- No README exists
- No `.env` files — app is entirely client-side with no env vars
- `dist/` is the build output directory (gitignored)
- Tailwind dark mode uses `class` strategy; `<html>` gets `dark`/`light` class toggled by Zustand store
