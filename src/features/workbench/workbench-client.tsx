"use client";

import { useMemo, useState } from "react";

import { DEFAULT_WORKBENCH_FILTERS, filterOrders } from "@/domain/filters";
import { calculateMetrics } from "@/domain/metrics";
import type { Order } from "@/domain/orders";
import { RegionFilter } from "@/features/filters/region-filter";
import { MetricCards } from "@/features/metrics/metric-cards";
import { OrdersTable } from "@/features/orders-table/orders-table";

type WorkbenchClientProps = {
  initialOrders: Order[];
};

export function WorkbenchClient({ initialOrders }: WorkbenchClientProps) {
  const [filters, setFilters] = useState(DEFAULT_WORKBENCH_FILTERS);
  const filteredOrders = useMemo(
    () => filterOrders(initialOrders, filters),
    [filters, initialOrders],
  );
  const metrics = useMemo(() => calculateMetrics(filteredOrders), [filteredOrders]);

  return (
    <main className="min-h-screen bg-slate-100 text-slate-950">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
              Operations Analytics
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
              Workbench
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Inspect operational performance across the active data slice.
            </p>
          </div>
          <div className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
            Default overview
          </div>
        </header>

        <section
          aria-label="Workbench filters"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <RegionFilter
            value={filters.region}
            onChange={(region) => setFilters({ region })}
          />
        </section>

        <MetricCards metrics={metrics} />
        <OrdersTable orders={filteredOrders} />
      </div>
    </main>
  );
}
