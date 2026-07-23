# Operations Analytics Workbench

A front-end operations workbench building on the completed `v0.0.0` prototype
with the first `v0.1.0` view-configuration package. The table, KPI cards, and
charts share one active filtered and searched dataset, while Scenario Mode adds
a temporary projection without mutating source records.

## Main features

- Predefined operational saved views with coordinated filters, search, sorting,
  and visible columns
- Revenue, order count, refund rate, and average order value KPIs
- Revenue-over-time and orders-by-status charts
- Sortable, paginated orders table with basic column visibility and accessible
  row selection
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
