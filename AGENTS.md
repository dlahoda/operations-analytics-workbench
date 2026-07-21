# Operations Analytics Workbench — Agent Instructions

## Source of Truth & Docs
Primary spec: `./docs/design-doc.md` (Product scope, active milestone, architecture, non-goals).
* Read `./docs/design-doc.md` first for product/architecture tasks.
* Read only relevant files for narrow implementation tasks.
* Visual prototypes in `./docs/assets/` are direction only—not pixel-perfect specs.
* Supporting: `./docs/decisions.md` (durable decisions), `./docs/backlog.md` (deferred work), `./CHANGELOG.md` (release notes), `./README.md` (setup).

## Architecture & Code Boundaries
* **Framework Concerns:** `./src/app/`
* **UI Modules:** `./src/features/`
* **Pure Domain Logic:** `./src/domain/` (Filtering, metrics, saved views, scenario calculations)
* **Mock Data:** `./src/data/`

### Domain Separation Rule

Keep filtering, metrics, saved-view resolution, and scenario calculations outside React components as pure TypeScript functions.

React components may orchestrate and display results, but should not contain business calculations.

## Stack & Dependency Constraints
* **Stack:** Next.js App Router, React, strict TypeScript, npm (use existing `./package-lock.json`).
* **Hard Limits:** No backend, database, auth, Route Handlers, Server Actions, or global state libraries unless explicitly requested.
* **Dependencies:** Do not add external packages or switch package managers without explicit need.
* **Single Data Source:** Table, KPI cards, and charts MUST consume the same active filtered dataset.

## Scope & Decision Policy
* Implement **only** the active milestone in `./docs/design-doc.md`. Do not implement mockup-only features or deferred work.
* You may make small local implementation choices. For missing project-level decisions, present trade-offs to the user instead of guessing.
* Update documentation in the same task when practical:
  * `./docs/design-doc.md` for scope, behavior, or architecture changes;
  * `./docs/decisions.md` for durable decisions;
  * `./README.md` for setup or command changes;
  * `./CHANGELOG.md` for meaningful product or release changes.

## Verification Protocol
Run before handing off code changes:
```bash
npm run lint
npm run build
```
*(Also run relevant test suites if present. Never claim a check passed unless actually executed.)*

**Handoff Report Structure:**
1. Project-relative files changed (e.g., `./src/domain/metrics.ts`)
2. Implemented behavior
3. Commands executed & results (Passed/Failed)
4. Relevant manual checks, known limitations, and deferred work. 

For UI changes, manually verify the affected flow.

## Communication & Safety Rules
* **User Reports:** Be extremely concise; sentence fragments are fine. (Does not apply to code comments, PRs, or docs).
* **Pathing:** Always use project-relative paths (`./src/app/...`). Avoid vague references like "the file".
* **Git Safety:** Inspect working tree before edits. Preserve unrelated uncommitted changes. Do not reset, clean, discard, commit, or push unless explicitly asked.
* **Edits:** Make minimal patches over full-file rewrites. Never recreate unreadable files from memory.