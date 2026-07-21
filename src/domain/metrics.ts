import type { Order } from "./orders";

export type OrderMetrics = {
  revenue: number;
  orders: number;
  refundAmount: number;
  refundRate: number;
  averageOrderValue: number;
  grossMargin: number;
  marginPercentage: number;
  openOrders: number;
  cancelledOrders: number;
};

const EMPTY_METRICS: OrderMetrics = {
  revenue: 0,
  orders: 0,
  refundAmount: 0,
  refundRate: 0,
  averageOrderValue: 0,
  grossMargin: 0,
  marginPercentage: 0,
  openOrders: 0,
  cancelledOrders: 0,
};

export function calculateMetrics(orders: readonly Order[]): OrderMetrics {
  if (orders.length === 0) {
    return { ...EMPTY_METRICS };
  }

  const totals = orders.reduce(
    (result, order) => {
      result.revenue += order.revenue;
      result.orderValue += order.orderValue;
      result.refundAmount += order.refundAmount;
      result.grossMargin += order.margin;
      result.refundedOrders += order.refundStatus === "Refunded" ? 1 : 0;
      result.openOrders +=
        order.status === "Processing" || order.status === "Delayed" ? 1 : 0;
      result.cancelledOrders += order.status === "Cancelled" ? 1 : 0;
      return result;
    },
    {
      revenue: 0,
      orderValue: 0,
      refundAmount: 0,
      grossMargin: 0,
      refundedOrders: 0,
      openOrders: 0,
      cancelledOrders: 0,
    },
  );

  return {
    revenue: totals.revenue,
    orders: orders.length,
    refundAmount: totals.refundAmount,
    refundRate: totals.refundedOrders / orders.length,
    averageOrderValue: totals.orderValue / orders.length,
    grossMargin: totals.grossMargin,
    marginPercentage: totals.revenue === 0 ? 0 : totals.grossMargin / totals.revenue,
    openOrders: totals.openOrders,
    cancelledOrders: totals.cancelledOrders,
  };
}
