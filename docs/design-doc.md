# Operations Analytics Workbench

*Product and Architecture Design Document*

**Status:** Draft  
**Target milestone:** `v0.1.0` workbench view configuration
**Product direction:** Variant 2.5 - an operations analytics workbench with a constrained Scenario Mode  
**Last reviewed:** July 23, 2026

## 1. Executive Summary

Operations Analytics Workbench is a front-end portfolio project for exploring operational business data through a dense, stateful, and usable data interface.

The product is inspired by real reporting and operations workflows, but it is not a clone of a specific commercial product. Its purpose is to demonstrate product thinking and front-end engineering for complex data interfaces rather than to reproduce a complete business intelligence platform.

The core experience is an analytical workbench where a user can:

- inspect mock operational data;
- filter and search records;
- switch between recurring saved views;
- review KPIs and charts derived from the active data slice;
- inspect an individual order without losing analytical context;
- apply one controlled what-if adjustment and compare baseline with projected impact.

The table is the center of the product. KPI cards and charts support the same analytical state rather than functioning as decorative dashboard elements.

> **Core product rule:** The table, KPI cards, and charts always derive from the same active filtered and searched dataset. Scenario Mode is a temporary projection layer on top of that baseline.

## 2. Product Goal

The goal is to create a credible front-end case study for a complex data-heavy product.

The project should demonstrate competence in:

- dense table interfaces;
- coordinated filtering and view state;
- derived KPI calculations;
- chart and table synchronization;
- URL-backed analytical context;
- row-level inspection;
- clear loading, empty, and edge states;
- constrained scenario comparison;
- realistic solo-project scope management.

A reviewer should understand the product quickly, then discover additional depth through interaction.

## 3. Target User

### 3.1 Primary User

The primary user is an operations analyst or operations manager who reviews business performance across orders, revenue, refunds, regions, categories, channels, and statuses.

Typical questions include:

- Which region is underperforming?
- Which category has the highest refund pressure?
- Are revenue and order volume moving in the same direction?
- Which recurring business slice needs daily attention?
- Which records explain a KPI change?
- How would a small change in refund rate affect net revenue?

### 3.2 User Skill Level

The user is comfortable with tables, filters, and common business metrics. They do not need a tutorial-heavy interface.

They do need the UI to make the following explicit:

- which data slice is active;
- which filters are applied;
- whether values are baseline or projected;
- which assumptions a scenario uses;
- whether an action changes source data or only the current view.

## 4. Product Positioning

This product is an **analytics workbench**, not a static dashboard.

A dashboard mostly answers predefined questions. A workbench lets the user change the analytical lens, inspect the underlying records, and return to recurring views.

The portfolio value comes from coordinated state and analytical interaction, not from chart decoration.

### 4.1 Variant Positioning

The project targets **Variant 2.5**:

- Variant 2.0 provides the operational workbench: table, filters, KPIs, charts, saved views, and record inspection.
- Variant 2.5 adds one small and controlled Scenario Mode.
- Variant 3.0 would add multi-variable scenario planning, scenario persistence, comparison, and forecasting behavior.

Variant 3.0 is not part of the MVP. It is considered only as architectural awareness.

## 5. Product Principles

### 5.1 Table First

The table is the main analytical surface. Charts summarize the active data slice but do not replace record-level exploration.

### 5.2 One Analytical State

Filters, saved views, KPIs, charts, and table rows must agree because they are derived from the same active filtered dataset.

### 5.3 Repeated Workflows Matter

Saved views represent recurring operational questions, not cosmetic presets.

Examples:

- Default Overview;
- EU Refund Watch;
- Electronics Performance;
- Pending Orders.

### 5.4 Projection Is Not Mutation

Scenario Mode never modifies the raw dataset. It compares projected metrics with the current filtered baseline.

### 5.5 Scope Is a Product Feature

The project should prove a coherent front-end product pattern. It should not attempt to become a complete BI, forecasting, or enterprise operations platform.

## 6. Core User Flows

### 6.1 Review Operational Performance

**What happens:** The user opens the workbench and sees the active saved view, filters, KPI cards, charts, and a data table.

**Why it matters:** The first screen should establish a credible analytical product and make the current business state understandable.

### 6.2 Narrow the Business Slice

**What happens:** The user changes date range, region, category, or status. The table, KPI cards, and charts update from the same filtered dataset.

**Why it matters:** This is the central proof that the product is a coordinated tool rather than a collection of static widgets.

### 6.3 Apply a Saved View

**What happens:** The user selects a recurring view such as EU Refund Watch. The relevant filters, metrics, charts, and table state are applied together.

**Why it matters:** Saved views support repeated operational workflows and create a clear analytical context.

### 6.4 Inspect an Individual Record

**What happens:** The user selects an order and opens a detail drawer containing operational and financial information.

**Why it matters:** This connects summary-level analytics to the records that explain them without forcing the user to leave the workbench.

### 6.5 Run a Small Scenario

**What happens:** The user enables Scenario Mode, applies one numeric adjustment, and compares baseline metrics with projected metrics.

**Why it matters:** This creates a memorable portfolio interaction while preserving a realistic solo-project boundary.

## 7. Scope

### 7.1 Completed `v0.0.0` Prototype Scope

Version `0.0.0` is not the full MVP. It is the first visible vertical slice of the product.

It should answer one question:

> Does this feel like a credible operations analytics workbench worth building further?

#### Product Promise

The user can open one workspace, inspect mock operational data, change the analytical lens, inspect a record, and view one projected scenario impact.

#### Included in `v0.0.0`

- one generated mock operational dataset containing 2,500 orders;
- one `/workbench` route;
- predefined saved views;
- filters for date range, region, category, and status;
- four KPI cards;
- two supporting charts;
- a credible operations table;
- table sorting;
- row selection;
- an order detail drawer;
- one temporary scenario adjustment;
- baseline versus projected KPI comparison;
- URL-backed analytical context where practical.

#### Recommended KPI Cards

- Revenue;
- Orders;
- Refund Rate;
- Average Order Value.

#### Recommended Table Columns

- Order ID;
- Date;
- Region;
- Category;
- Status;
- Revenue;
- Refund Amount;
- Margin;
- Channel.

#### First Scenario

The initial scenario is an **Average Order Value percentage adjustment** from `-10%` to `+10%`.

The interface should show:

- the current active view;
- baseline Average Order Value;
- projected Average Order Value;
- baseline revenue;
- projected revenue;
- projected revenue impact;
- clear delta labels.

The scenario applies only to the current filtered dataset. It does not persist and does not mutate the source records.

#### Explicit `v0.0.0` Non-Goals

- authentication;
- backend or database;
- real data import;
- editable source records;
- custom saved-view creation;
- full saved-view CRUD;
- custom scenario builder;
- multiple simultaneous scenario assumptions;
- scenario persistence;
- scenario comparison;
- advanced forecasting logic;
- export workflows;
- complex table personalization;
- server-side filtering or pagination.

### 7.2 Active `v0.1.0` Package

The first `v0.1.0` package makes analytical and table state one coordinated,
serializable configuration.

Included:

- a framework-independent `WorkbenchViewConfig` containing filters, search,
  sorting, and visible columns;
- case-insensitive substring search across explicit useful order fields;
- basic table column visibility with Order ID permanently visible;
- complete predefined-view application and Default Overview reset behavior;
- custom-view labeling after any manual filter, search, sorting, or visibility
  change.

Filters and search determine the shared active order collection used by KPI
cards, charts, the table, and the Scenario Mode baseline. Sorting, pagination,
and visible columns configure table presentation without changing that shared
collection.

Custom saved-view creation and browser persistence remain deferred. This
package does not add local storage or saved-view CRUD.

### 7.3 MVP Scope

The MVP extends the first prototype into a small but coherent product.

#### Data Exploration

- mock operational dataset with intentional patterns;
- table sorting and pagination;
- search across useful record fields;
- basic column visibility or configuration;
- filters for date range, region, category, and status;
- KPIs and charts derived from the active filtered dataset.

#### Saved Views

- switch between predefined views;
- save a current filter and table configuration as a named local view;
- reset to the default view;
- persist local custom views in browser storage.

#### Detail Inspection

- open a row detail drawer;
- show order metadata, status, financial values, refund information, and a short activity timeline.

#### Scenario Mode

- enable or disable Scenario Mode;
- choose one scenario type;
- adjust one numeric value;
- show baseline versus projected metrics;
- label projected values clearly;
- preserve the raw dataset.

### 7.4 Out of Scope for the MVP

- user accounts;
- backend database;
- real external API integration;
- permissions and roles;
- collaboration;
- comments and annotations;
- PDF or CSV export;
- multi-variable scenario planning;
- forecasting models;
- confidence intervals;
- drag-and-drop dashboard building;
- cross-workspace organization;
- enterprise audit history.

### 7.5 Future Expansion Awareness

Possible future directions include:

- API-backed data loading;
- persisted user accounts;
- richer scenario planning;
- comparison between saved views;
- export workflows;
- alerts;
- shared workspaces.

These possibilities must not increase the current MVP scope.

## 8. Conceptual Data Model

### 8.1 Operational Record

Each row represents an order or operational transaction.

Suggested fields:

```ts
type Order = {
  orderId: string;
  orderDate: string;
  region: string;
  country: string;
  category: string;
  subcategory: string;
  status: string;
  customerSegment: string;
  channel: string;
  revenue: number;
  orderValue: number;
  refundAmount: number;
  refundStatus: string;
  cost: number;
  margin: number;
  units: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
};
```

The exact TypeScript shape may change during implementation, but the business concepts should remain stable.

### 8.2 Derived Metrics

Suggested derived metrics:

- total revenue;
- order count;
- refund amount;
- refund rate;
- average order value;
- gross margin;
- margin percentage;
- open order count;
- cancelled order count.

Metric definitions must be centralized in domain logic so the table, KPI cards, charts, and Scenario Mode cannot silently use different formulas.

### 8.3 Saved View

A saved view stores UI state, not copied operational data.

Conceptual fields:

```ts
type SavedView = {
  id: string;
  name: string;
  config: WorkbenchViewConfig;
};
```

`WorkbenchViewConfig` contains filters, search query, supported order-column
sorting, and supported visible columns as plain serializable values. Predefined
views resolve a complete config. Custom saved views and local persistence remain
future MVP work.

### 8.4 Scenario State

A scenario represents one temporary what-if adjustment.

Conceptual fields:

```ts
type ScenarioState = {
  enabled: boolean;
  type: "average-order-value";
  adjustmentPercent: number;
};
```

Only one scenario adjustment is active at a time.

### 8.5 Mock Data Requirements

The generated dataset encodes intentional patterns rather than uniformly random values:

- a refund hotspot;
- a regional fulfillment problem;
- a high-volume, low-AOV segment;
- a mixed anomaly where a strong-revenue segment also has elevated refunds.

These patterns make saved views, filters, and charts tell a coherent story.

## 9. Metrics and Scenario Logic

### 9.1 Baseline

The baseline is calculated from the active filtered and searched dataset.

The sequence is:

1. load raw mock records;
2. resolve the active saved view;
3. apply active filters;
4. apply active search;
5. use the resulting shared active orders for baseline metrics and charts;
6. apply table sorting and pagination for presentation.

Column visibility and sorting do not alter KPI, chart, or Scenario Mode
calculations.

### 9.2 Projection

Scenario Mode applies a pure transformation to the baseline context.

The sequence is:

1. take the active filtered dataset or its baseline metrics;
2. apply one scenario assumption;
3. calculate projected metrics;
4. compare projected values with baseline values;
5. display the delta without mutating source records.

The initial AOV scenario uses:

```text
projectedAOV = baselineAOV × (1 + adjustment / 100)
projectedRevenue = projectedAOV × baselineOrderCount
```

The calculation holds `baselineOrderCount` constant. Scenario calculations must remain explicit, testable, and outside presentation components.

## 10. UI Information Architecture

The workbench should feel like a practical internal tool with restrained visual hierarchy.

### 10.1 Main Areas

#### Header and Saved View Bar

- product name;
- active saved view;
- saved-view switcher;
- reset action;
- Scenario Mode entry point.

#### Filter Area

- date range;
- region;
- category;
- status;
- visible active-filter chips;
- clear or reset action.

#### KPI Area

- Revenue;
- Orders;
- Refund Rate;
- Average Order Value.

#### Chart Area

Recommended first charts:

- revenue over time;
- refund rate by category or orders by status.

Charts should support the analytical story but remain secondary to the table.

#### Table Area

The table is the main product surface. It should be dense, credible, readable, and clearly interactive.

#### Order Detail Drawer

The drawer should support quick inspection without replacing the workbench route.

Suggested content:

- order ID and status;
- date;
- region and category;
- channel;
- revenue;
- refund amount;
- margin;
- payment method;
- short event timeline.

#### Scenario Panel

When enabled, Scenario Mode appears as an inline panel above the KPI cards.

The panel should show:

- scenario type;
- adjustment value;
- active analytical context;
- baseline values;
- projected values;
- deltas;
- a reminder that the projection applies only to the current filtered view.

## 11. Visual Prototype States

The prototype set contains four states of the same product rather than four independent pages.

### 11.1 Workbench Overview

Shows the product at rest:

- default saved view;
- filters;
- KPI cards;
- two charts;
- data table.

### 11.2 Saved View Applied

Shows EU Refund Watch or another meaningful recurring slice:

- active saved-view label;
- applied filter chips;
- changed KPI values;
- refund-focused chart;
- filtered table.

### 11.3 Order Detail Drawer

Shows a selected table row and a right-side record drawer while preserving the workbench context.

### 11.4 Scenario Mode Impact

Shows the signature interaction:

- Scenario Mode enabled;
- one AOV percentage adjustment;
- baseline and projected KPI comparison;
- clear impact summary.

Visual prototypes belong in `docs/assets/` and are **visual direction only, not pixel-perfect implementation specifications**. Generated mockups may contain controls that are outside the current scope, such as export actions, full saved-view creation, scenario saving, or an oversized navigation sidebar.

Expected asset names:

- `docs/assets/workbench-overview.png`;
- `docs/assets/saved-view-applied.png`;
- `docs/assets/order-detail-drawer.png`;
- `docs/assets/scenario-mode-impact.png`.

## 12. Technical Direction

### 12.1 Current Stack

- Next.js with the App Router;
- React;
- TypeScript;
- Tailwind CSS;
- TanStack Table;
- Recharts.

### 12.2 Role of Next.js

Next.js provides:

- the application shell;
- routing;
- metadata;
- initial URL parsing;
- initial mock-data loading;
- a future server-side data boundary.

Next.js is not the center of the product logic. The workbench remains an interactive client-side application after the initial render.

## 13. Server and Client Component Boundary

### 13.1 Decision

The `/workbench` route remains a Server Component. It prepares the initial snapshot and renders one coherent client-side workbench subtree.

The interactive session is coordinated across focused Client Components within the workbench.

Pure TypeScript modules own filtering, metrics, saved-view resolution, and scenario calculations.

> **Architecture principle:** Next.js creates the product boundary. React manages the work session. Pure TypeScript manages domain logic.

### 13.2 Server Responsibilities

The server layer is responsible for:

- root HTML and layout;
- global styles and fonts;
- route metadata;
- reading initial URL search parameters;
- resolving the initial saved view;
- loading mock records;
- passing serializable initial props into the client boundary.

The server does not manage interactive workbench changes after the initial render.

### 13.3 Client Responsibilities

The client workbench owns:

- active filters;
- active saved view;
- search query;
- sorting;
- visible columns;
- selected order;
- detail drawer state;
- temporary scenario state;
- KPI and chart updates;
- URL updates for shareable analytical context.

Client boundaries should share coordinated workbench state without requiring one monolithic component.

### 13.4 URL-Backed State

State that defines the analytical context and should survive refresh may be stored in the URL:

- active saved view;
- date range;
- region;
- category;
- status.

Example:

```text
/workbench?view=eu-refund-watch&region=europe&status=refunded
```

### 13.5 Local-Only State

State that is temporary or purely presentational remains local:

- drawer open or closed;
- selected order;
- table density;
- temporary scenario adjustment;
- hover state;
- expanded UI sections.

### 13.6 Data Flow

```text
Mock orders
    |
    v
Server route loads initial data
    |
    v
WorkbenchClient receives serializable records
    |
    v
Active view filters and search produce activeOrders
    |
    +--> KPI calculations
    +--> charts
    +--> table
    |
    v
Scenario transformation uses the filtered baseline
    |
    v
Projected metrics are compared with baseline metrics
```

### 13.7 Domain Logic

Domain functions should be framework-independent and testable:

```ts
applyWorkbenchFiltersAndSearch(orders, filters, searchQuery);
calculateMetrics(orders);
resolveSavedView(view);
applyScenario(metrics, scenario);
```

Benefits:

- clear business logic;
- simple unit tests;
- independence from table and chart libraries;
- future ability to move calculations to the server if required.

### 13.8 Route Handlers and Server Actions

Route Handlers and Server Actions are not used in `v0.0.0`.

The project should not create artificial API endpoints that only return local JSON. They should appear only when a concrete need exists, such as:

- server-side pagination;
- simulated network latency;
- an API contract demonstration;
- an external data source;
- persisted saved views.

### 13.9 Proposed Project Structure

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── workbench/
│       ├── page.tsx
│       ├── loading.tsx
│       └── _components/
│           └── workbench-client.tsx
├── features/
│   ├── filters/
│   ├── metrics/
│   ├── orders-table/
│   ├── saved-views/
│   ├── order-details/
│   └── scenario-mode/
├── domain/
│   ├── orders.ts
│   ├── filters.ts
│   ├── metrics.ts
│   ├── saved-views.ts
│   └── scenarios.ts
└── data/
    ├── mock-orders.ts
    └── mock-saved-views.ts
```

This is a direction, not a requirement to create every folder before it is needed.

## 14. Interaction Priorities

### Highest Priority

- filters update all visible analytical regions;
- the table feels credible and useful;
- KPI cards and charts agree with the table;
- active saved-view state is obvious;
- Scenario Mode is clearly scoped and labeled.

### Medium Priority

- saved views feel operational;
- the detail drawer is polished;
- charts support real questions;
- URL state behaves predictably.

### Lower Priority

- advanced table personalization;
- complex animations;
- export workflows;
- sophisticated scenario modeling.

## 15. Quality Requirements

### 15.1 Correctness

- metric formulas are centralized;
- filter semantics are explicit;
- baseline and projected values cannot be confused;
- the same data slice drives the table, KPIs, and charts.

### 15.2 Usability

- active filters are visible;
- empty results are understandable;
- reset actions are available;
- dense data remains readable;
- row selection and drawer behavior are obvious.

### 15.3 Accessibility

- keyboard access for filters and table interactions;
- visible focus states;
- semantic controls and labels;
- color is not the only indicator of status or delta;
- charts have textual values or accessible summaries where practical.

### 15.4 Performance

`v0.0.0` uses a local dataset, so premature server optimization is unnecessary. The interface should still avoid repeated full-data calculations when derived state can be memoized cleanly.

No virtualization, server-side pagination, or global state library should be added without a demonstrated need.

## 16. Key Risks and Mitigations

### Risk 1: The Product Becomes a Generic Dashboard

**Mitigation:** Keep the table central and ensure charts support table-driven investigation.

### Risk 2: Scenario Mode Expands into a Forecasting Platform

**Mitigation:** Allow one explicit adjustment at a time. Keep projection formulas simple, visible, and scoped to the active filtered view.

### Risk 3: Mock Data Feels Artificial

**Mitigation:** Generate intentional business patterns and ensure saved views reveal them.

### Risk 4: Saved Views Feel Superficial

**Mitigation:** Each predefined view should represent a meaningful recurring operational question.

### Risk 5: Data Density Becomes Visual Noise

**Mitigation:** Use restrained visual hierarchy, readable spacing, clear labels, and a limited chart count.

### Risk 6: Architecture Is Built Ahead of Product Needs

**Mitigation:** Build vertical slices. Add abstractions, dependencies, routes, and folders only when the current slice needs them.

### Risk 7: Documentation Drifts from the Implementation

**Mitigation:** Update this document in the same change when product boundaries, data definitions, or architectural decisions change.

## 17. Success Criteria

### 17.1 `v0.0.0` Success

The prototype succeeds when a reviewer can say:

- this looks like a real data-heavy operations tool;
- the table matters;
- filters visibly affect the whole page;
- saved views represent meaningful business slices;
- an individual record can be inspected without losing context;
- Scenario Mode is small but memorable;
- the product has enough depth to justify further development.

### 17.2 MVP Success

A strong review path should be possible:

1. open the workbench and understand the current operational state;
2. change filters and see the full interface respond;
3. apply a saved view and understand the new business slice;
4. inspect an individual order;
5. apply a scenario and compare projected impact.

The intended portfolio story is:

> This developer can build complex, stateful front-end products with realistic data workflows and disciplined scope.

## 18. Open Questions

No open product or architecture questions are currently recorded. New unresolved choices belong in `./docs/backlog.md` until decided.

## 19. Delivery Strategy

Development should proceed through vertical slices rather than independent component construction.

Recommended sequence:

1. mock orders, one region filter, two KPIs, and a basic table;
2. complete Workbench Overview state;
3. predefined saved views and URL-backed context;
4. order detail drawer;
5. constrained Scenario Mode;
6. empty, loading, and edge states;
7. polish and portfolio presentation.

The first meaningful technical milestone is:

> One filter changes the table and two KPI values from the same dataset.

This proves the central architecture before additional interface depth is added.
