# Decision Record

This file records durable product and architecture decisions already established for the Operations Analytics Workbench. Deferred and unresolved items belong in `./docs/backlog.md`.

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
- **Decision:** Initial Scenario Mode is an AOV percentage adjustment from `-10%` to `+10%`, shown in an inline panel above the KPI cards. It uses `projectedAOV = baselineAOV × (1 + adjustment / 100)` and `projectedRevenue = projectedAOV × baselineOrderCount`.
- **Rationale:** A small scenario interaction adds analytical depth while preventing the prototype from expanding into a forecasting platform.
- **Consequences:** The baseline order count remains constant. Baseline and projected values stay distinct, calculations are scoped to the active filtered view, and source records are neither mutated nor persisted. Multiple assumptions, persistence, comparison, and advanced forecasting remain out of scope.

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

## 009 — TanStack Table and Recharts for analytical UI

- **Status:** Accepted
- **Decision:** Use TanStack Table for the operations table and Recharts for supporting charts.
- **Rationale:** These are the selected implementation foundations for the product's core analytical surfaces.
- **Consequences:** Table and chart UI modules use these libraries while filtering, metrics, and scenario calculations remain framework-independent domain logic.

## 010 — Generated dataset size and analytical patterns

- **Status:** Accepted
- **Decision:** Generate 2,500 orders with a refund hotspot, a regional fulfillment problem, a high-volume low-AOV segment, and a mixed anomaly where a strong-revenue segment also has elevated refunds.
- **Rationale:** A fixed, intentionally patterned dataset supports credible recurring operational questions and coherent analytical stories.
- **Consequences:** Saved views, filters, KPIs, charts, and table records should expose these patterns rather than relying on uniformly random data.

## 011 — WorkbenchViewConfig is the canonical restorable view state

- **Status:** Accepted
- **Decision:** Use the framework-independent, JSON-serializable `WorkbenchViewConfig` as the canonical representation of restorable workbench analytical and table state. It contains filters, search query, supported-column sorting, and visible columns.
- **Rationale:** One explicit contract keeps predefined and future custom saved views complete and portable without coupling durable product state to TanStack Table or React.
- **Consequences:** Filters and search determine the shared active dataset used by KPIs, charts, the table, and Scenario Mode baseline calculations. Sorting and column visibility configure table presentation only. Predefined views resolve a complete config, and future custom saved views will use the same contract. Transient state such as selected orders, drawer state, pagination, and Scenario Mode remains outside the config.

## 012 — Custom saved views use validated browser persistence

- **Status:** Accepted
- **Decision:** Store each named custom saved view as stable identity, user-visible metadata, and a complete cloned `WorkbenchViewConfig`. Persist only the custom saved-view collection in one versioned browser local-storage payload.
- **Rationale:** Complete configs make predefined and custom view application consistent, while a versioned validation boundary safely supports front-end-only persistence without coupling saved views to operational data or framework state.
- **Consequences:** Persisted payloads are treated as untrusted input. Unsupported versions produce an empty collection, invalid entries are skipped, and returned configs are defensively cloned. Operational records, active selection, unsaved session state, pagination, selection, drawer state, and Scenario Mode are not persisted.
