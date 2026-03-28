# Phase 0: Clean Slate Initialization — Code Review & Kanban Tasks

> **Project**: Mindchain — Unified Workspace for Documentation & Project Management  
> **Timeline**: Week 1–2  
> **Priority**: Critical — all subsequent development phases depend on these findings being addressed  
> **Tech Stack**: Next.js 14 (App Router), TypeScript 5, Tailwind CSS 3.4, TipTap 2.27, Supabase (PostgreSQL + Auth + Realtime), TanStack Query 5  
> **Repository**: `Artificial-Ledger-Technology/ALT-Mindchain`

---

## Overview

Phase 0 performs a comprehensive code review of the **Mindchain** codebase in its current state — a production-targeted, open-source alternative to Jira and Confluence. This review establishes the quality baseline, identifies technical debt, security concerns, and architectural gaps that must be resolved before the project can safely proceed to its next development phase.

Every finding in this review is a **hard prerequisite** for Phase 1 (Feature Expansion) and Phase 2 (Performance & Scale). No new features should be built until these foundational issues are assessed and triaged.

---

## Review Scope

| Layer | Files Reviewed |
|-------|---------------|
| **Root Config** | `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.js`, `postcss.config.js`, `.env`, `.gitignore` |
| **Database** | `supabase_schema.sql` |
| **App Router** | `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/auth/callback/route.ts` |
| **Components** | `src/components/LandingPage.tsx`, `src/components/Sidebar.tsx`, `src/components/editor/Editor.tsx`, `src/components/auth/AuthUI.tsx` |
| **Services** | `src/services/pages.ts`, `src/services/issues.ts` |
| **Hooks** | `src/hooks/useRealtime.ts` |
| **Context** | `src/context/AuthContext.tsx` |
| **Providers** | `src/providers/QueryProvider.tsx` |
| **Lib** | `src/lib/supabase.ts` |

---

## Task Breakdown

---

### P0-CR-001: Security — Committed `.env` with Live Supabase Credentials

**Title**: Remove exposed Supabase credentials from version-controlled `.env` file

| Field | Value |
|-------|-------|
| Priority | P0 — Critical (Security) |
| Severity | 🔴 BLOCKER |
| Estimated Hours | 0.5 |
| Dependencies | None |
| Labels | `security`, `credentials`, `env` |
| Files | `.env`, `.gitignore` |

**Description**:  
The `.env` file at the repository root contains **live Supabase project credentials** (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) and is tracked by Git. While `NEXT_PUBLIC_*` variables are client-exposed by design, committing them to the repository means credential rotation becomes a multi-step process and the project URL is permanently embedded in git history. The `.gitignore` only excludes `.env*.local` but **not** `.env` itself.

**Findings**:
- `.env` contains a live Supabase URL (`rityyzcycnqlpenqpsqd.supabase.co`) and a valid anon key JWT
- `.gitignore` has `.env*.local` but `.env` is **not** gitignored
- This `.env` file is committed to the repository history

**Acceptance Criteria**:
- [ ] Add `.env` to `.gitignore` (not just `.env*.local`)
- [ ] Remove `.env` from Git tracking: `git rm --cached .env`
- [ ] Create `.env.example` with placeholder values for onboarding documentation
- [ ] Consider rotating the Supabase anon key if this repo has been public
- [ ] Verify `.env` no longer appears in `git status`

---

### P0-CR-002: Architecture — Monolithic 519-Line Page Component

**Title**: Decompose `src/app/page.tsx` (519 lines) into focused sub-components

| Field | Value |
|-------|-------|
| Priority | P0 — High |
| Severity | 🟡 ISSUE |
| Estimated Hours | 4 |
| Dependencies | None |
| Labels | `architecture`, `refactor`, `components` |
| Files | `src/app/page.tsx` |

**Description**:  
The main `page.tsx` is a single 519-line "god component" containing: all mutation definitions (6 mutations), the full Kanban board UI, 2 modal dialogs (Create Issue + Edit Issue), the header bar, the pages/editor view, and application state management. This violates separation of concerns and makes the codebase difficult to maintain, test, and extend.

**Findings**:
- 6 TanStack Query mutations defined inline (lines 47–109)
- 2 full modal components inlined (Create Modal: lines 362–441, Edit Modal: lines 443–515)
- Kanban board logic inlined (lines 230–357)
- 8 `useState` hooks for UI and form state (lines 18–24)
- The `editingIssue` state uses `any` type (line 23)
- The `status` parameter on mutations uses `as any` type assertions (lines 81–82)

**Acceptance Criteria**:
- [ ] Extract `<KanbanBoard />` component to `src/components/KanbanBoard.tsx`
- [ ] Extract `<IssueCard />` component to `src/components/issues/IssueCard.tsx`
- [ ] Extract `<CreateIssueModal />` to `src/components/issues/CreateIssueModal.tsx`
- [ ] Extract `<EditIssueModal />` to `src/components/issues/EditIssueModal.tsx`
- [ ] Extract `<DashboardHeader />` to `src/components/DashboardHeader.tsx`
- [ ] Create a custom `useIssues()` hook in `src/hooks/` to encapsulate all issue mutations
- [ ] `page.tsx` should be under 100 lines after refactoring

---

### P0-CR-003: Type Safety — Pervasive `any` Types Across the Codebase

**Title**: Replace all `any` types with proper TypeScript interfaces

| Field | Value |
|-------|-------|
| Priority | P0 — High |
| Severity | 🟡 ISSUE |
| Estimated Hours | 3 |
| Dependencies | None |
| Labels | `typescript`, `type-safety`, `quality` |
| Files | `src/app/page.tsx`, `src/components/Sidebar.tsx`, `src/components/editor/Editor.tsx`, `src/services/pages.ts`, `src/services/issues.ts` |

**Description**:  
Despite `tsconfig.json` having `"strict": true`, multiple files use `any` types — defeating the purpose of TypeScript strict mode. This creates runtime risk and prevents the compiler from catching bugs.

**Findings**:

| File | Line | Issue |
|------|------|-------|
| `page.tsx` | 23 | `useState<any \| null>(null)` for `editingIssue` |
| `page.tsx` | 48 | `content?: any` in mutation parameter |
| `page.tsx` | 70 | `status: any` in mutation parameter |
| `page.tsx` | 81–82 | `as any` type assertions for status and priority |
| `page.tsx` | 96 | `updates: any` in mutation parameter |
| `page.tsx` | 248 | `issue: any` in array map callback |
| `Sidebar.tsx` | 21 | `pages?: any[]` in props interface |
| `Editor.tsx` | 16 | `editor: any` in MenuBar component |
| `pages.ts` | 26 | `content: any` in createPage parameter |
| `pages.ts` | 37 | `content?: any` in updatePage parameter |
| `AuthUI.tsx` | 35 | `catch (error: any)` |

**Acceptance Criteria**:
- [ ] Create `src/types/index.ts` with shared interfaces: `Workspace`, `Page`, `Issue`, `IssueStatus`, `IssuePriority`
- [ ] Define `IssueStatus = 'Backlog' | 'Todo' | 'In Progress' | 'Done'`
- [ ] Define `IssuePriority = 'Low' | 'Med' | 'High'`
- [ ] Define `Page` interface with `content: Record<string, unknown>` (matching JSONB)
- [ ] Replace all `any` usages with proper typed interfaces
- [ ] Remove all `as any` assertions
- [ ] Zero `any` grep hits across the codebase (excluding `node_modules`)

---

### P0-CR-004: Data Integrity — Hardcoded Mock Workspace ID

**Title**: Replace hardcoded workspace UUID with dynamic workspace resolution

| Field | Value |
|-------|-------|
| Priority | P0 — High |
| Severity | 🟡 ISSUE |
| Estimated Hours | 3 |
| Dependencies | P0-CR-003 |
| Labels | `data-integrity`, `multi-tenancy`, `architecture` |
| Files | `src/app/page.tsx` |

**Description**:  
The main `page.tsx` uses a hardcoded zero-value UUID (`"00000000-0000-0000-0000-000000000000"`) as the workspace ID for all data operations. This means all authenticated users share the same workspace, which defeats the multi-tenancy architecture designed in the database schema with RLS policies.

**Findings**:
- Line 27: `const workspaceId = "00000000-0000-0000-0000-000000000000";`
- Comment on line 26: `// Mock workspace ID for MVP`
- The `workspaces` table exists in `supabase_schema.sql` with proper `owner_id` FK and RLS
- No workspace CRUD service exists in `src/services/`
- No workspace creation flow exists in the UI

**Acceptance Criteria**:
- [ ] Create `src/services/workspaces.ts` with CRUD operations
- [ ] Implement workspace resolution: on login, fetch or auto-create the user's default workspace
- [ ] Replace the hardcoded UUID with the resolved workspace ID
- [ ] Store the active workspace in context or URL params
- [ ] Remove the `// Mock workspace ID` comment and code

---

### P0-CR-005: Security — Hardcoded User Display Name in Sidebar

**Title**: Replace hardcoded user name with dynamic auth-sourced display name

| Field | Value |
|-------|-------|
| Priority | P1 — Medium |
| Severity | 🔵 SUGGESTION |
| Estimated Hours | 0.5 |
| Dependencies | None |
| Labels | `auth`, `ui`, `hardcoded` |
| Files | `src/components/Sidebar.tsx` |

**Description**:  
The sidebar footer displays a hardcoded username `"Jay Arre"` (line 163) instead of the authenticated user's name or email. This creates a misleading display for any other user who signs in.

**Findings**:
- Line 163: `<span className="text-glow">Jay Arre</span>`
- The `useAuth()` hook provides `user.email` which is already used in the header (page.tsx line 175)
- The sidebar does not import or consume `useAuth()`

**Acceptance Criteria**:
- [ ] Import `useAuth` from `@/context/AuthContext` in `Sidebar.tsx`
- [ ] Replace `"Jay Arre"` with `user?.email?.split('@')[0]` or `user?.user_metadata?.full_name`
- [ ] Handle the case where user data is unavailable (loading/null state)

---

### P0-CR-006: Quality — Missing Error Boundaries and Error Handling

**Title**: Implement error boundaries and user-facing error states

| Field | Value |
|-------|-------|
| Priority | P0 — High |
| Severity | 🟡 ISSUE |
| Estimated Hours | 3 |
| Dependencies | None |
| Labels | `error-handling`, `ux`, `resilience` |
| Files | Multiple |

**Description**:  
The application has no React Error Boundaries and minimal user-facing error handling. Services throw errors, but the consuming components do not consistently catch or display them. Failed mutations silently fail with no feedback to the user.

**Findings**:
- No `error.tsx` file exists in `src/app/` (Next.js App Router error boundary)
- No `not-found.tsx` exists for 404 handling
- No `loading.tsx` exists for suspense-based loading states
- Mutation errors in `page.tsx` are not surfaced to the user (no `onError` callbacks)
- The auth callback redirects to `/auth/auth-code-error` (line 37 of `route.ts`) but that page doesn't exist
- `AuthContext.tsx` throws errors on failed `getSession()` (line 27) with no catch block

**Acceptance Criteria**:
- [ ] Create `src/app/error.tsx` — global error boundary component
- [ ] Create `src/app/not-found.tsx` — custom 404 page
- [ ] Create `src/app/loading.tsx` — global loading state
- [ ] Add `onError` callbacks to all mutations in `page.tsx` with toast/alert feedback
- [ ] Create the `/auth/auth-code-error` page that the callback redirects to
- [ ] Wrap `getSession()` in AuthContext with proper try-catch and user feedback

---

### P0-CR-007: Quality — Search Bar is Non-Functional

**Title**: Implement or remove the non-functional search input

| Field | Value |
|-------|-------|
| Priority | P1 — Medium |
| Severity | 🔵 SUGGESTION |
| Estimated Hours | 2 |
| Dependencies | P0-CR-002 |
| Labels | `feature`, `ui`, `search` |
| Files | `src/app/page.tsx` |

**Description**:  
The header contains a search input (lines 148–155) that is purely decorative. It has no `onChange` handler, no state, and no filtering logic. This creates a misleading UX where users expect search functionality that doesn't exist.

**Findings**:
- Search input on line 150–154: no event handlers, no state, no functionality
- The search bar is visually prominent in the header

**Acceptance Criteria**:
- [ ] **Option A**: Implement client-side search/filtering for pages and issues
- [ ] **Option B**: Remove the search bar and add it back when search is properly implemented
- [ ] If kept, add a visual indicator that search is "Coming Soon"

---

### P0-CR-008: Performance — Editor Content Type Mismatch

**Title**: Fix content serialization mismatch between Editor (HTML) and Database (JSONB)

| Field | Value |
|-------|-------|
| Priority | P0 — High |
| Severity | 🟡 ISSUE |
| Estimated Hours | 2 |
| Dependencies | None |
| Labels | `editor`, `data`, `bug` |
| Files | `src/components/editor/Editor.tsx`, `src/services/pages.ts` |

**Description**:  
The TipTap Editor exports content as HTML via `editor.getHTML()` (Editor.tsx line 63), but the database schema stores content as `JSONB` (supabase_schema.sql line 20). The Editor's `content` prop type is `string` (line 13), but TipTap expects either HTML string or JSON content. There's a type and serialization mismatch that could cause data loss or rendering issues.

**Findings**:
- Editor.tsx line 12–13: `content: string` prop type
- Editor.tsx line 63: `onChange(editor.getHTML())` — outputs HTML
- `supabase_schema.sql` line 20: `content JSONB DEFAULT '{}'::jsonb` — expects JSON
- page.tsx line 58: `content: {}` — creates page with empty JSON object
- page.tsx line 210: Passes `selectedPage.content` (JSONB from DB) to Editor expecting string

**Acceptance Criteria**:
- [ ] Decide on a single serialization format: TipTap JSON (`editor.getJSON()`) or HTML
- [ ] If using JSON: change `onChange` to `editor.getJSON()` and update the prop type
- [ ] If using HTML: change the DB column type from JSONB to TEXT
- [ ] Ensure the Editor's `content` prop type matches what's stored in the database
- [ ] Test round-trip: create page → edit → save → reload → content intact

---

### P0-CR-009: Configuration — TypeScript Config Issues

**Title**: Fix potential issues in `tsconfig.json`

| Field | Value |
|-------|-------|
| Priority | P1 — Medium |
| Severity | 🔵 SUGGESTION |
| Estimated Hours | 0.5 |
| Dependencies | None |
| Labels | `config`, `typescript` |
| Files | `tsconfig.json` |

**Description**:  
The `tsconfig.json` has a typo in the `exclude` array and uses a potentially outdated target.

**Findings**:
- Line 38: `"node-modules"` should be `"node_modules"` (hyphen vs underscore)
- Line 3: `"target": "es5"` — unnecessarily conservative for a Next.js 14 project targeting modern browsers. Consider `"es2017"` or `"esnext"`.

**Acceptance Criteria**:
- [ ] Fix `"node-modules"` → `"node_modules"` in the `exclude` array
- [ ] Evaluate updating `target` to `"es2017"` or later for modern browser support
- [ ] Verify the build still passes after changes

---

### P0-CR-010: Testing — Zero Test Coverage

**Title**: Establish testing infrastructure and baseline test coverage

| Field | Value |
|-------|-------|
| Priority | P0 — High |
| Severity | 🟡 ISSUE |
| Estimated Hours | 6 |
| Dependencies | P0-CR-002, P0-CR-003 |
| Labels | `testing`, `quality`, `infrastructure` |
| Files | New files |

**Description**:  
The project has **zero tests** — no test runner, no test configuration, no test files. For a project aiming to be a production alternative to Jira/Confluence, this is a fundamental gap that must be addressed at the foundation level.

**Acceptance Criteria**:
- [ ] Install testing dependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`
- [ ] Create `vitest.config.ts` with proper Next.js/React configuration
- [ ] Add `"test"` script to `package.json`
- [ ] Write unit tests for service functions (`pages.ts`, `issues.ts`)
- [ ] Write component tests for at least: `AuthUI`, `Sidebar`, `Editor`
- [ ] Establish minimum coverage target (suggest: 60% for Phase 0, 80% for Phase 2)

---

### P0-CR-011: CSS — Duplicate Tailwind Class in Sidebar

**Title**: Fix duplicate CSS class on LogOut icon

| Field | Value |
|-------|-------|
| Priority | P2 — Low |
| Severity | 💡 NIT |
| Estimated Hours | 0.1 |
| Dependencies | None |
| Labels | `css`, `bug`, `cleanup` |
| Files | `src/app/page.tsx` |

**Description**:  
Line 181 of `page.tsx` has a duplicate Tailwind class on the `<LogOut>` icon component.

**Finding**:
```tsx
<LogOut className="w-3 w-3.5 h-3 h-3.5" />
```
Both `w-3` and `w-3.5` are applied (same for height). Tailwind will apply the last one, but this is likely unintentional and creates confusion.

**Acceptance Criteria**:
- [ ] Decide intended size: `w-3 h-3` (12px) or `w-3.5 h-3.5` (14px)
- [ ] Remove the duplicate class

---

### P0-CR-012: DevOps — Missing CI/CD Pipeline

**Title**: Establish GitHub Actions CI pipeline for build validation

| Field | Value |
|-------|-------|
| Priority | P0 — High |
| Severity | 🟡 ISSUE |
| Estimated Hours | 2 |
| Dependencies | P0-CR-010 |
| Labels | `devops`, `ci-cd`, `infrastructure` |
| Files | New: `.github/workflows/ci.yml` |

**Description**:  
The project has no CI/CD pipeline. PRs can be merged without any automated quality checks — no lint, no type checking, no build validation, and no tests.

**Acceptance Criteria**:
- [ ] Create `.github/workflows/ci.yml` with: lint, type-check (`tsc --noEmit`), build, and test stages
- [ ] Pipeline should run on: push to `main`/`develop`, and all PRs targeting `main`
- [ ] Add branch protection rule requiring CI to pass before merge
- [ ] Add `"typecheck"` script to `package.json`: `"tsc --noEmit"`

---

## Summary Matrix

| Task ID | Title | Severity | Priority | Hours | Status |
|---------|-------|----------|----------|-------|--------|
| P0-CR-001 | Committed `.env` with live credentials | 🔴 BLOCKER | P0 | 0.5 | `TODO` |
| P0-CR-002 | Monolithic 519-line page component | 🟡 ISSUE | P0 | 4 | `TODO` |
| P0-CR-003 | Pervasive `any` types | 🟡 ISSUE | P0 | 3 | `TODO` |
| P0-CR-004 | Hardcoded mock workspace ID | 🟡 ISSUE | P0 | 3 | `TODO` |
| P0-CR-005 | Hardcoded user display name | 🔵 SUGGESTION | P1 | 0.5 | `TODO` |
| P0-CR-006 | Missing error boundaries | 🟡 ISSUE | P0 | 3 | `TODO` |
| P0-CR-007 | Non-functional search bar | 🔵 SUGGESTION | P1 | 2 | `TODO` |
| P0-CR-008 | Editor content type mismatch | 🟡 ISSUE | P0 | 2 | `TODO` |
| P0-CR-009 | TypeScript config issues | 🔵 SUGGESTION | P1 | 0.5 | `TODO` |
| P0-CR-010 | Zero test coverage | 🟡 ISSUE | P0 | 6 | `TODO` |
| P0-CR-011 | Duplicate Tailwind class | 💡 NIT | P2 | 0.1 | `TODO` |
| P0-CR-012 | Missing CI/CD pipeline | 🟡 ISSUE | P0 | 2 | `TODO` |

**Total Estimated Hours**: ~26.6  
**Critical Blockers (P0)**: 8 tasks  
**Medium (P1)**: 3 tasks  
**Low (P2)**: 1 task

---

## Recommended Execution Order

```
1. P0-CR-001  (Security — env credentials)          ← IMMEDIATE
2. P0-CR-009  (Config — tsconfig typo)               ← Quick win
3. P0-CR-011  (CSS — duplicate class)                ← Quick win
4. P0-CR-005  (Hardcoded username)                   ← Quick win
5. P0-CR-003  (Type safety — create types)           ← Foundation for everything
6. P0-CR-008  (Editor content mismatch)              ← Data integrity
7. P0-CR-002  (Decompose page.tsx)                   ← Enables maintainability
8. P0-CR-006  (Error boundaries)                     ← Resilience
9. P0-CR-004  (Workspace resolution)                 ← Multi-tenancy
10. P0-CR-007 (Search bar)                           ← UX polish
11. P0-CR-010 (Testing infrastructure)               ← Quality gate
12. P0-CR-012 (CI/CD pipeline)                       ← Automation
```
