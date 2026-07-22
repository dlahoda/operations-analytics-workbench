import type { Order, Region } from "./orders";

export type WorkbenchFilters = {
  region: Region | null;
};

export const DEFAULT_WORKBENCH_FILTERS: WorkbenchFilters = {
  region: null,
};

export function filterOrders(
  orders: readonly Order[],
  filters: WorkbenchFilters,
): Order[] {
  if (filters.region === null) {
    return [...orders];
  }

  return orders.filter((order) => order.region === filters.region);
}
