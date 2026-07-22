import type { Category, Order, OrderStatus, Region } from "./orders";

export type WorkbenchFilters = {
  region: Region | null;
  category: Category | null;
  status: OrderStatus | null;
};

export const DEFAULT_WORKBENCH_FILTERS: WorkbenchFilters = {
  region: null,
  category: null,
  status: null,
};

export function filterOrders(
  orders: readonly Order[],
  filters: WorkbenchFilters,
): Order[] {
  return orders.filter(
    (order) =>
      (filters.region === null || order.region === filters.region) &&
      (filters.category === null || order.category === filters.category) &&
      (filters.status === null || order.status === filters.status),
  );
}
