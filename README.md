# Operations Analytics Workbench

A front-end operations workbench building on the completed `v0.0.0` prototype
with the `v0.1.0` view-configuration packages. The table, KPI cards, and charts
share one active filtered and searched dataset, while Scenario Mode adds a
temporary projection without mutating source records.

## Main features

- Predefined operational saved views with coordinated filters, search, sorting,
  and visible columns
- Named custom saved views with application, confirmed deletion, and validated
  browser-local persistence
- Revenue, order count, refund rate, and average order value KPIs
- Revenue-over-time and refund-rate-by-category charts
- Sortable, paginated orders table with basic column visibility and accessible
  row selection
- Responsive order detail drawer with financial, operational, and activity data
- Temporary selectable Average Order Value and Gross Margin scenarios with one
  active adjustment and baseline-to-projected impact
- Empty-result and invalid-date-range handling

## Stack

- Next.js App Router
- React and strict TypeScript
- Tailwind CSS
- TanStack Table
- Recharts
- Generated local mock data; no backend, database, or authentication

## Setup

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000/workbench](http://localhost:3000/workbench).

## Validation

```bash
npm run test
npm run lint
npm run build
```
