# Operations Analytics Workbench

A completed `v0.0.0` front-end prototype for exploring a generated dataset of
2,500 operational orders. The table, KPI cards, and charts share one active
filtered dataset, while Scenario Mode adds a temporary projection without
mutating source records.

## Main features

- Predefined operational saved views and coordinated date, region, category,
  and status filters
- Revenue, order count, refund rate, and average order value KPIs
- Revenue-over-time and orders-by-status charts
- Sortable, paginated orders table with accessible row selection
- Responsive order detail drawer with financial, operational, and activity data
- Temporary Average Order Value scenario with baseline and projected impact
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
npm run lint
npm run build
```
