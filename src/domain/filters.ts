import type { Category, Order, OrderStatus, Region } from "./orders";

export type WorkbenchFilters = {
  dateFrom: string | null;
  dateTo: string | null;
  region: Region | null;
  category: Category | null;
  status: OrderStatus | null;
};

export const DEFAULT_WORKBENCH_FILTERS: WorkbenchFilters = {
  dateFrom: null,
  dateTo: null,
  region: null,
  category: null,
  status: null,
};

export type OrderDateBounds = {
  minimum: string;
  maximum: string;
};

export const SEARCHABLE_ORDER_FIELDS = [
  "orderId",
  "region",
  "country",
  "category",
  "subcategory",
  "status",
  "customerSegment",
  "channel",
  "refundStatus",
  "paymentMethod",
] as const satisfies readonly (keyof Order)[];

export function hasInvalidDateRange(
  filters: Pick<WorkbenchFilters, "dateFrom" | "dateTo">,
): boolean {
  return (
    filters.dateFrom !== null &&
    filters.dateTo !== null &&
    filters.dateFrom > filters.dateTo
  );
}

export function getOrderDateBounds(
  orders: readonly Order[],
): OrderDateBounds | null {
  if (orders.length === 0) {
    return null;
  }

  let minimum = orders[0].orderDate.slice(0, 10);
  let maximum = minimum;

  for (const order of orders.slice(1)) {
    const date = order.orderDate.slice(0, 10);
    if (date < minimum) minimum = date;
    if (date > maximum) maximum = date;
  }

  return { minimum, maximum };
}

export function filterOrders(
  orders: readonly Order[],
  filters: WorkbenchFilters,
): Order[] {
  if (hasInvalidDateRange(filters)) {
    return [];
  }

  return orders.filter((order) => {
    const orderDate = order.orderDate.slice(0, 10);

    return (
      (filters.dateFrom === null || orderDate >= filters.dateFrom) &&
      (filters.dateTo === null || orderDate <= filters.dateTo) &&
      (filters.region === null || order.region === filters.region) &&
      (filters.category === null || order.category === filters.category) &&
      (filters.status === null || order.status === filters.status)
    );
  });
}

export function searchOrders(
  orders: readonly Order[],
  searchQuery: string,
): Order[] {
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();

  if (normalizedQuery === "") {
    return [...orders];
  }

  return orders.filter((order) =>
    SEARCHABLE_ORDER_FIELDS.some((field) =>
      order[field].toLocaleLowerCase().includes(normalizedQuery),
    ),
  );
}

export function applyWorkbenchFiltersAndSearch(
  orders: readonly Order[],
  filters: WorkbenchFilters,
  searchQuery: string,
): Order[] {
  return searchOrders(filterOrders(orders, filters), searchQuery);
}
