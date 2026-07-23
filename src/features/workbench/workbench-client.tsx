"use client";

import { useCallback, useMemo, useState } from "react";

import {
  filterOrders,
  getOrderDateBounds,
  hasInvalidDateRange,
} from "@/domain/filters";
import { calculateMetrics } from "@/domain/metrics";
import type { Order } from "@/domain/orders";
import { calculateOrdersByStatus } from "@/domain/orders-by-status";
import { calculateRevenueByMonth } from "@/domain/revenue-by-month";
import {
  calculateAovScenario,
  DEFAULT_AOV_ADJUSTMENT,
} from "@/domain/scenarios";
import { OrdersByStatusChart } from "@/features/charts/orders-by-status-chart";
import { RevenueOverTimeChart } from "@/features/charts/revenue-over-time-chart";
import { MetricCards } from "@/features/metrics/metric-cards";
import { OrderDetailDrawer } from "@/features/order-details/order-detail-drawer";
import { OrdersTable } from "@/features/orders-table/orders-table";
import { SavedViewSwitcher } from "@/features/saved-views/saved-view-switcher";
import { ScenarioPanel } from "@/features/scenario-mode/scenario-panel";
import { useWorkbenchViewState } from "@/features/workbench/use-workbench-view-state";
import { WorkbenchFiltersPanel } from "@/features/workbench/workbench-filters-panel";

type WorkbenchClientProps = {
  initialOrders: Order[];
};

export function WorkbenchClient({ initialOrders }: WorkbenchClientProps) {
  const {
    filters,
    activeSavedViewId,
    activeViewName,
    hasActiveFilters,
    applySavedView,
    updateDateFrom,
    updateDateTo,
    updateRegion,
    updateCategory,
    updateStatus,
    resetFilters,
  } = useWorkbenchViewState();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isScenarioModeEnabled, setIsScenarioModeEnabled] = useState(false);
  const [aovAdjustment, setAovAdjustment] = useState(DEFAULT_AOV_ADJUSTMENT);
  const dateBounds = useMemo(() => getOrderDateBounds(initialOrders), [initialOrders]);
  const hasInvalidDates = hasInvalidDateRange(filters);
  const filteredOrders = useMemo(
    () => filterOrders(initialOrders, filters),
    [filters, initialOrders],
  );
  const metrics = useMemo(() => calculateMetrics(filteredOrders), [filteredOrders]);
  const scenarioProjection = useMemo(
    () => calculateAovScenario(metrics, aovAdjustment),
    [aovAdjustment, metrics],
  );
  const ordersByStatus = useMemo(
    () => calculateOrdersByStatus(filteredOrders),
    [filteredOrders],
  );
  const revenueByMonth = useMemo(
    () => calculateRevenueByMonth(filteredOrders),
    [filteredOrders],
  );
  function toggleScenarioMode() {
    if (isScenarioModeEnabled) {
      setAovAdjustment(DEFAULT_AOV_ADJUSTMENT);
    }

    setIsScenarioModeEnabled(!isScenarioModeEnabled);
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
            <div className="flex flex-wrap items-end gap-3">
              <SavedViewSwitcher
                activeSavedViewId={activeSavedViewId}
                onChange={applySavedView}
              />
              <button
                type="button"
                aria-pressed={isScenarioModeEnabled}
                className={`h-10 rounded-lg border px-4 text-sm font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
                  isScenarioModeEnabled
                    ? "border-blue-700 bg-blue-700 text-white hover:bg-blue-800"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                }`}
                onClick={toggleScenarioMode}
              >
                Scenario Mode {isScenarioModeEnabled ? "On" : "Off"}
              </button>
            </div>
          </header>

          <WorkbenchFiltersPanel
            filters={filters}
            dateBounds={dateBounds}
            hasActiveFilters={hasActiveFilters}
            hasInvalidDates={hasInvalidDates}
            onDateFromChange={updateDateFrom}
            onDateToChange={updateDateTo}
            onRegionChange={updateRegion}
            onCategoryChange={updateCategory}
            onStatusChange={updateStatus}
            onReset={resetFilters}
          />

          {isScenarioModeEnabled ? (
            <ScenarioPanel
              activeViewName={activeViewName}
              adjustmentPercent={aovAdjustment}
              filters={filters}
              orderCount={filteredOrders.length}
              projection={scenarioProjection}
              onAdjustmentChange={setAovAdjustment}
            />
          ) : null}

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
