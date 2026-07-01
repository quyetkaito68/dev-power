# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**DevPower** — A client-side developer utility toolbox built with Vite + React + TypeScript. Features include JSON formatting, Base64 encoding/decoding, Image↔Base64 conversion, QR code generation/scanning, and random data generation.

All tools run entirely in the browser — no server calls, no data leaves the user's machine.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Type-check (`tsc`) then production build (`vite build`) |
| `npm run lint` | Run ESLint on all `.ts`/`.tsx` files |
| `npm run preview` | Preview production build locally |

## Architecture

### Tech Stack
- **Build**: Vite 5 + TypeScript 5 (strict mode)
- **UI**: React 18 + Tailwind CSS 3 (dark mode by default, `class` strategy)
- **State**: Zustand 4 with `persist` middleware (localStorage)
- **Routing**: React Router 6 (`HashRouter` for GitHub Pages compatibility)
- **Icons**: lucide-react
- **Deploy**: GitHub Pages via Actions (`.github/workflows/deploy.yml`)

### Folder Structure
```
src/
├── app/
│   ├── App.tsx          # Root component, routes, theme sync
│   └── router.tsx       # Lazy-loaded tool routes, ToolLoader
├── components/
│   ├── layout/          # Header, Sidebar, MainLayout
│   ├── ui/              # Reusable primitives (Button, Textarea, Select, Tabs, OutputBox, Badge, CopyButton)
│   ├── ToolWrapper.tsx  # Common tool header wrapper
│   ├── CommandPalette.tsx  # Ctrl+K search modal
│   └── WelcomePage.tsx  # Landing page with tool grid
├── core/
│   ├── registry/        # Tool registry & search
│   ├── types/           # Shared types (Tool, ToolCategory)
│   └── utils/           # Helpers (cn, clipboard)
├── store/               # Zustand store (theme, recent tools, sidebar, palette)
├── tools/               # Each tool = folder with index.tsx, logic.ts, types.ts
└── styles/
    └── globals.css      # Tailwind imports + base styles
```

### Tool Registry Pattern
Tools are registered in `src/core/registry/index.ts`:
```typescript
export const tools: Tool[] = [
  { id: 'json', name: 'JSON Formatter', ..., component: lazy(() => import('../../tools/json')), ... },
  // ...
];
```
Each tool provides:
- `id`, `name`, `description`, `category` (`formatter` | `encoder` | `generator` | `media`)
- `icon` (lucide-react)
- `component` (lazy-loaded React component)
- `keywords` (for search)

Helpers: `getToolById(id)`, `searchTools(query)`, `groupByCategory(list)`

### Adding a New Tool
1. Create `src/tools/<tool-id>/` with `index.tsx`, `logic.ts`, `types.ts`
2. Export pure logic functions in `logic.ts` (testable, no React)
3. Build UI in `index.tsx` using `ToolWrapper` + UI primitives
4. Register in `src/core/registry/index.ts` (add to `tools` array with lazy import)
5. Category color defined in `WelcomePage.tsx` and `CATEGORIES` in `core/types/index.ts`

### State Management (`src/store/index.ts`)
Persisted keys: `isDark`, `recentTools` (max 5), `sidebarCollapsed`
- `toggleDark()` — syncs `dark`/`light` class on `<html>`
- `addRecentTool(id)` — prepends to recent list, dedupes, caps at 5
- `commandPaletteOpen` — not persisted

### Routing
- `/` → WelcomePage
- `/tool/:id` → ToolLoader (lazy loads tool component, tracks recent)
- HashRouter for GitHub Pages (no server config needed)

### Command Palette
- Global `Ctrl+K` opens/closes
- `Esc` closes
- Arrow keys navigate, `Enter` selects
- Searches name, description, keywords

### Build Config
- `vite.config.ts`: base `/dev-power/`, manual chunks for `react` + `qr` libs
- `tsconfig.json`: strict, path alias `@/*` → `src/*`
- ESLint: `@typescript-eslint` with `noUnusedLocals/Parameters` enforced

### Deployment
Push to `main` triggers GitHub Actions workflow:
1. `npm ci` → `npm run build`
2. Upload `dist/` as Pages artifact
3. Deploy to GitHub Pages environment

Live URL: `https://<user>.github.io/dev-power/`