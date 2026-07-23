"use client";

import { useCallback, useMemo, useState } from "react";

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
import {
  DEFAULT_SAVED_VIEW_ID,
  getSavedView,
  type SavedViewId,
} from "@/domain/saved-views";
import { OrdersByStatusChart } from "@/features/charts/orders-by-status-chart";
import { RevenueOverTimeChart } from "@/features/charts/revenue-over-time-chart";
import { MetricCards } from "@/features/metrics/metric-cards";
import { OrderDetailDrawer } from "@/features/order-details/order-detail-drawer";
import { OrdersTable } from "@/features/orders-table/orders-table";
import { SavedViewSwitcher } from "@/features/saved-views/saved-view-switcher";
import { WorkbenchFiltersPanel } from "@/features/workbench/workbench-filters-panel";

type WorkbenchClientProps = {
  initialOrders: Order[];
};

export function WorkbenchClient({ initialOrders }: WorkbenchClientProps) {
  const [filters, setFilters] = useState(DEFAULT_WORKBENCH_FILTERS);
  const [activeSavedViewId, setActiveSavedViewId] =
    useState<SavedViewId | null>(DEFAULT_SAVED_VIEW_ID);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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

  function applySavedView(savedViewId: SavedViewId) {
    const savedView = getSavedView(savedViewId);
    setFilters({ ...savedView.filters });
    setActiveSavedViewId(savedViewId);
  }

  function updateFilters(
    update: (current: typeof filters) => typeof filters,
  ) {
    setFilters(update);
    setActiveSavedViewId(null);
  }

  function resetFilters() {
    setFilters({ ...DEFAULT_WORKBENCH_FILTERS });
    setActiveSavedViewId(DEFAULT_SAVED_VIEW_ID);
  }

  const closeOrderDetails = useCallback(() => {
    setSelectedOrder(null);
  }, []);

  return (
    <>
      <main
        inert={selectedOrder ? true : undefined}
        className="min-h-screen bg-slate-100 text-slate-950"
      >
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
            <SavedViewSwitcher
              activeSavedViewId={activeSavedViewId}
              onChange={applySavedView}
            />
          </header>

          <WorkbenchFiltersPanel
            filters={filters}
            dateBounds={dateBounds}
            hasActiveFilters={hasActiveFilters}
            hasInvalidDates={hasInvalidDates}
            onDateFromChange={(dateFrom) =>
              updateFilters((current) => ({ ...current, dateFrom }))
            }
            onDateToChange={(dateTo) =>
              updateFilters((current) => ({ ...current, dateTo }))
            }
            onRegionChange={(region) =>
              updateFilters((current) => ({ ...current, region }))
            }
            onCategoryChange={(category) =>
              updateFilters((current) => ({ ...current, category }))
            }
            onStatusChange={(status) =>
              updateFilters((current) => ({ ...current, status }))
            }
            onReset={resetFilters}
          />

          <MetricCards metrics={metrics} />
          <div className="grid items-start gap-6 xl:grid-cols-2">
            <RevenueOverTimeChart data={revenueByMonth} />
            <OrdersByStatusChart
              data={ordersByStatus}
              hasOrders={filteredOrders.length > 0}
            />
          </div>
          <OrdersTable
            orders={filteredOrders}
            selectedOrderId={selectedOrder?.orderId ?? null}
            onOrderSelect={setSelectedOrder}
          />
        </div>
      </main>
      <OrderDetailDrawer order={selectedOrder} onClose={closeOrderDetails} />
    </>
  );
}
