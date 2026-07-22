import type { Order } from "./orders";

export type RevenueByMonthDatum = {
  month: string;
  revenue: number;
};

function nextMonth(month: string): string {
  const year = Number(month.slice(0, 4));
  const monthIndex = Number(month.slice(5, 7)) - 1;
  const next = new Date(Date.UTC(year, monthIndex + 1, 1));

  return next.toISOString().slice(0, 7);
}

export function calculateRevenueByMonth(
  orders: readonly Order[],
): RevenueByMonthDatum[] {
  if (orders.length === 0) {
    return [];
  }

  const revenueByMonth = new Map<string, number>();
  let earliestMonth = orders[0].orderDate.slice(0, 7);
  let latestMonth = earliestMonth;

  for (const order of orders) {
    const month = order.orderDate.slice(0, 7);
    revenueByMonth.set(month, (revenueByMonth.get(month) ?? 0) + order.revenue);
    if (month < earliestMonth) earliestMonth = month;
    if (month > latestMonth) latestMonth = month;
  }

  const result: RevenueByMonthDatum[] = [];
  let month = earliestMonth;

  while (month <= latestMonth) {
    result.push({ month, revenue: revenueByMonth.get(month) ?? 0 });
    month = nextMonth(month);
  }

  return result;
}
