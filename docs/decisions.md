# Decision Record

This file records durable product and architecture decisions already established for the Operations Analytics Workbench. Unresolved choices remain in `./docs/design-doc.md`.

## 001 — Analytics workbench, with the table as the primary surface

- **Status:** Accepted
- **Decision:** Position the product as an operations analytics workbench rather than a static dashboard. Keep the table as the primary analytical surface; KPIs and charts support record-level exploration.
- **Rationale:** The product is intended to demonstrate coordinated, stateful analysis of operational data rather than a collection of decorative summaries.
- **Consequences:** Table usability and analytical interactions take priority over chart decoration, dashboard building, and advanced visualization features.

## 002 — One active filtered dataset

- **Status:** Accepted
- **Decision:** The table, KPI cards, and charts must consume the same active filtered dataset.
- **Rationale:** Every visible analytical region must describe the same business slice so users can trust changes caused by filters, search, and saved views.
- **Consequences:** Filtering happens before metrics and chart series are derived. Independent filtering or metric formulas inside presentation components are not allowed.

## 003 — Front-end-only prototype boundary

- **Status:** Accepted
- **Decision:** Build `v0.0.0` as a front-end prototype using local mock data. Do not add a backend, database, authentication, Route Handlers, Server Actions, or artificial local-JSON API endpoints.
- **Rationale:** The active milestone is meant to prove the product interaction and front-end architecture without infrastructure that has no concrete product need.
- **Consequences:** Data loads locally, source records are not persisted or edited, and server-side filtering and pagination are out of scope. A backend or server-side data-access boundary may be added later only for a demonstrated need.

## 004 — Constrained Scenario Mode is a temporary projection

- **Status:** Accepted
- **Decision:** Scenario Mode applies one numeric what-if adjustment at a time to the current filtered baseline. It calculates clearly labeled projected metrics without mutating or persisting source records.
- **Rationale:** A small scenario interaction adds analytical depth while preventing the prototype from expanding into a forecasting platform.
- **Consequences:** Baseline and projected values remain distinct; scenario calculations are explicit, testable, and scoped to the active filtered view. Multiple assumptions, persistence, comparison, and advanced forecasting remain out of scope.

## 005 — Saved views store analytical UI state, not data copies

- **Status:** Accepted
- **Decision:** A saved view represents a recurring operational question by storing filters and applicable table configuration, not copied operational records. `v0.0.0` uses predefined views.
- **Rationale:** Saved views should restore a meaningful analytical context while preserving one source dataset.
- **Consequences:** Applying a view resolves UI state and then derives the active dataset. Full saved-view CRUD and server persistence are outside the prototype boundary.

## 006 — Server route boundary with a coordinated client workbench

- **Status:** Accepted
- **Decision:** Keep `/workbench` as a Server Component that prepares the initial serializable snapshot and renders a coordinated client-side workbench. Client components own the interactive session after initial render.
- **Rationale:** Next.js should provide routing, metadata, initial URL parsing, and initial data loading while React manages the stateful work session.
- **Consequences:** Initial saved-view resolution and mock-data loading may occur at the route boundary. Filters, table state, selection, drawer state, scenario state, KPI updates, chart updates, and URL updates remain coordinated across focused client components.

## 007 — Business calculations live in framework-independent domain modules

- **Status:** Accepted
- **Decision:** Keep filtering, metrics, saved-view resolution, and scenario calculations as pure TypeScript functions outside React components.
- **Rationale:** Centralized domain logic keeps formulas consistent, independently testable, and portable across presentation or future data-loading changes.
- **Consequences:** React components orchestrate and render results but do not contain business calculations. Framework concerns live under `./src/app/`, UI modules under `./src/features/`, domain logic under `./src/domain/`, and mock data under `./src/data/` as those areas are needed.

## 008 — Persist analytical context in the URL; keep transient UI state local

- **Status:** Accepted
- **Decision:** Store shareable analytical context in the URL where practical, including the active saved view and filters. Keep temporary or presentational state local, including selection, drawer visibility, density, and scenario adjustment.
- **Rationale:** Refreshable and shareable analysis should survive navigation, while transient interaction state should not create noisy or misleading URLs.
- **Consequences:** The server can resolve initial analytical context from search parameters, and the client updates relevant parameters during the session. Temporary Scenario Mode does not persist through the URL.
