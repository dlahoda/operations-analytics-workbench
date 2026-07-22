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
import { CategoryFilter } from "@/features/filters/category-filter";
import { DateRangeFilter } from "@/features/filters/date-range-filter";
import { RegionFilter } from "@/features/filters/region-filter";
import { StatusFilter } from "@/features/filters/status-filter";
import { MetricCards } from "@/features/metrics/metric-cards";
import { OrdersTable } from "@/features/orders-table/orders-table";
import { formatCalendarDate } from "@/lib/formatters";

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

        <section
          aria-label="Workbench filters"
          className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(22rem,1.5fr)_repeat(3,minmax(0,1fr))]">
            <DateRangeFilter
              dateFrom={filters.dateFrom}
              dateTo={filters.dateTo}
              minimumDate={dateBounds?.minimum}
              maximumDate={dateBounds?.maximum}
              error={
                hasInvalidDates
                  ? "From date must be on or before the To date. No results are shown until the range is valid."
                  : undefined
              }
              onDateFromChange={(dateFrom) =>
                setFilters((current) => ({ ...current, dateFrom }))
              }
              onDateToChange={(dateTo) =>
                setFilters((current) => ({ ...current, dateTo }))
              }
            />
            <RegionFilter
              value={filters.region}
              onChange={(region) => setFilters((current) => ({ ...current, region }))}
            />
            <CategoryFilter
              value={filters.category}
              onChange={(category) =>
                setFilters((current) => ({ ...current, category }))
              }
            />
            <StatusFilter
              value={filters.status}
              onChange={(status) => setFilters((current) => ({ ...current, status }))}
            />
          </div>

          {hasActiveFilters ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
              <span className="mr-1 text-xs font-medium text-slate-500">
                Active filters
              </span>
              {filters.dateFrom ? (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                  From: {formatCalendarDate(filters.dateFrom)}
                </span>
              ) : null}
              {filters.dateTo ? (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                  To: {formatCalendarDate(filters.dateTo)}
                </span>
              ) : null}
              {filters.region ? (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                  Region: {filters.region}
                </span>
              ) : null}
              {filters.category ? (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                  Category: {filters.category}
                </span>
              ) : null}
              {filters.status ? (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
                  Status: {filters.status}
                </span>
              ) : null}
              <button
                type="button"
                className="ml-auto rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                onClick={() => setFilters(DEFAULT_WORKBENCH_FILTERS)}
              >
                Reset filters
              </button>
            </div>
          ) : (
            <p className="mt-4 border-t border-slate-200 pt-4 text-xs text-slate-500">
              No active filters
            </p>
          )}
        </section>

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
