"use client";

import { useMemo, useState } from "react";

import {
  DEFAULT_WORKBENCH_FILTERS,
  filterOrders,
  getOrderDateBounds,
  hasInvalidDateRange,
} from "@/domain/filters";
import { calculateMetrics } from "@/domain/metrics";
import type { Order } from "@/domain/orders";
import { calculateOrdersByStatus } from "@/domain/orders-by-status";
import { calculateRevenueByMonth } from "@/domain/revenue-by-month";
import { OrdersByStatusChart } from "@/features/charts/orders-by-status-chart";
import { RevenueOverTimeChart } from "@/features/charts/revenue-over-time-chart";
import { MetricCards } from "@/features/metrics/metric-cards";
import { OrdersTable } from "@/features/orders-table/orders-table";
import { WorkbenchFiltersPanel } from "@/features/workbench/workbench-filters-panel";

type WorkbenchClientProps = {
  initialOrders: Order[];
};

export function WorkbenchClient({ initialOrders }: WorkbenchClientProps) {
  const [filters, setFilters] = useState(DEFAULT_WORKBENCH_FILTERS);
  const dateBounds = useMemo(() => getOrderDateBounds(initialOrders), [initialOrders]);
  const hasInvalidDates = hasInvalidDateRange(filters);
  const filteredOrders = useMemo(
    () => filterOrders(initialOrders, filters),
    [filters, initialOrders],
  );
  const metrics = useMemo(() => calculateMetrics(filteredOrders), [filteredOrders]);
  const ordersByStatus = useMemo(
    () => calculateOrdersByStatus(filteredOrders),
    [filteredOrders],
  );
  const revenueByMonth = useMemo(
    () => calculateRevenueByMonth(filteredOrders),
    [filteredOrders],
  );
  const hasActiveFilters =
    filters.dateFrom !== null ||
    filters.dateTo !== null ||
    filters.region !== null ||
    filters.category !== null ||
    filters.status !== null;

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

        <WorkbenchFiltersPanel
          filters={filters}
          dateBounds={dateBounds}
          hasActiveFilters={hasActiveFilters}
          hasInvalidDates={hasInvalidDates}
          onDateFromChange={(dateFrom) =>
            setFilters((current) => ({ ...current, dateFrom }))
          }
          onDateToChange={(dateTo) =>
            setFilters((current) => ({ ...current, dateTo }))
          }
          onRegionChange={(region) =>
            setFilters((current) => ({ ...current, region }))
          }
          onCategoryChange={(category) =>
            setFilters((current) => ({ ...current, category }))
          }
          onStatusChange={(status) =>
            setFilters((current) => ({ ...current, status }))
          }
          onReset={() => setFilters(DEFAULT_WORKBENCH_FILTERS)}
        />

        <MetricCards metrics={metrics} />
        <div className="grid items-start gap-6 xl:grid-cols-2">
          <RevenueOverTimeChart data={revenueByMonth} />
          <OrdersByStatusChart
            data={ordersByStatus}
            hasOrders={filteredOrders.length > 0}
          />
        </div>
        <OrdersTable orders={filteredOrders} />
      </div>
    </main>
  );
}
