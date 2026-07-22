import type { Category, Order, Region } from "./orders";

export type WorkbenchFilters = {
  region: Region | null;
  category: Category | null;
};

export const DEFAULT_WORKBENCH_FILTERS: WorkbenchFilters = {
  region: null,
  category: null,
};

export function filterOrders(
  orders: readonly Order[],
  filters: WorkbenchFilters,
): Order[] {
  return orders.filter(
    (order) =>
      (filters.region === null || order.region === filters.region) &&
      (filters.category === null || order.category === filters.category),
  );
}
