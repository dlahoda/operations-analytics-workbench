import { ORDER_STATUSES, type Order, type OrderStatus } from "./orders";

export type OrdersByStatusDatum = {
  status: OrderStatus;
  orders: number;
};

export function calculateOrdersByStatus(
  orders: readonly Order[],
): OrdersByStatusDatum[] {
  const counts = new Map<OrderStatus, number>(
    ORDER_STATUSES.map((status) => [status, 0]),
  );

  for (const order of orders) {
    counts.set(order.status, (counts.get(order.status) ?? 0) + 1);
  }

  return ORDER_STATUSES.map((status) => ({
    status,
    orders: counts.get(status) ?? 0,
  }));
}
