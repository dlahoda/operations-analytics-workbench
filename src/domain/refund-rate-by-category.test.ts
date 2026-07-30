import { describe, expect, it } from "vitest";

import { CATEGORIES, type Order } from "./orders";
import { calculateRefundRateByCategory } from "./refund-rate-by-category";

function createOrder(overrides: Partial<Order>): Order {
  return {
    orderId: "ORD-100001",
    orderDate: "2026-01-01",
    region: "North America",
    country: "United States",
    category: "Apparel",
    subcategory: "Outerwear",
    status: "Completed",
    customerSegment: "Consumer",
    channel: "Online",
    revenue: 100,
    orderValue: 100,
    refundAmount: 0,
    refundStatus: "None",
    cost: 60,
    margin: 40,
    units: 1,
    paymentMethod: "Card",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-02T00:00:00.000Z",
    ...overrides,
  };
}

describe("calculateRefundRateByCategory", () => {
  it("calculates category totals, refunded counts, and refund rates", () => {
    const result = calculateRefundRateByCategory([
      createOrder({ orderId: "ORD-1", category: "Apparel" }),
      createOrder({
        orderId: "ORD-2",
        category: "Apparel",
        refundStatus: "Refunded",
        refundAmount: 75,
      }),
      createOrder({
        orderId: "ORD-3",
        category: "Electronics",
        refundStatus: "Refunded",
        refundAmount: 100,
      }),
    ]);

    expect(result[0]).toEqual({
      category: "Apparel",
      totalOrders: 2,
      refundedOrders: 1,
      refundRate: 0.5,
    });
    expect(result[1]).toEqual({
      category: "Electronics",
      totalOrders: 1,
      refundedOrders: 1,
      refundRate: 1,
    });
  });

  it("preserves canonical category order and zeroes categories without orders", () => {
    const result = calculateRefundRateByCategory([
      createOrder({ category: "Home" }),
    ]);

    expect(result.map(({ category }) => category)).toEqual([...CATEGORIES]);
    expect(result.filter(({ category }) => category !== "Home")).toEqual(
      expect.arrayContaining([
        {
          category: "Apparel",
          totalOrders: 0,
          refundedOrders: 0,
          refundRate: 0,
        },
        {
          category: "Electronics",
          totalOrders: 0,
          refundedOrders: 0,
          refundRate: 0,
        },
        {
          category: "Accessories",
          totalOrders: 0,
          refundedOrders: 0,
          refundRate: 0,
        },
      ]),
    );
  });

  it("returns safe zero values for empty input", () => {
    const result = calculateRefundRateByCategory([]);

    expect(result).toHaveLength(CATEGORIES.length);
    expect(result.every((datum) => datum.totalOrders === 0)).toBe(true);
    expect(result.every((datum) => datum.refundedOrders === 0)).toBe(true);
    expect(result.every((datum) => datum.refundRate === 0)).toBe(true);
    expect(result.every((datum) => Number.isNaN(datum.refundRate))).toBe(false);
  });

  it("does not mutate the input collection or orders", () => {
    const orders = [
      createOrder({ orderId: "ORD-1", category: "Accessories" }),
      createOrder({
        orderId: "ORD-2",
        category: "Accessories",
        refundStatus: "Refunded",
      }),
    ];
    const original = structuredClone(orders);

    calculateRefundRateByCategory(orders);

    expect(orders).toEqual(original);
  });
});
