import { CATEGORIES, type Category, type Order } from "./orders";

export type RefundRateByCategoryDatum = {
  category: Category;
  totalOrders: number;
  refundedOrders: number;
  refundRate: number;
};

export function calculateRefundRateByCategory(
  orders: readonly Order[],
): RefundRateByCategoryDatum[] {
  const totals = new Map<Category, { totalOrders: number; refundedOrders: number }>(
    CATEGORIES.map((category) => [
      category,
      { totalOrders: 0, refundedOrders: 0 },
    ]),
  );

  for (const order of orders) {
    const categoryTotals = totals.get(order.category);

    if (categoryTotals) {
      categoryTotals.totalOrders += 1;
      categoryTotals.refundedOrders +=
        order.refundStatus === "Refunded" ? 1 : 0;
    }
  }

  return CATEGORIES.map((category) => {
    const categoryTotals = totals.get(category) ?? {
      totalOrders: 0,
      refundedOrders: 0,
    };

    return {
      category,
      ...categoryTotals,
      refundRate:
        categoryTotals.totalOrders === 0
          ? 0
          : categoryTotals.refundedOrders / categoryTotals.totalOrders,
    };
  });
}
