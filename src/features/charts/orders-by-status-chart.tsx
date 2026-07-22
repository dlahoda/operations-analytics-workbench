"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import type { OrdersByStatusDatum } from "@/domain/orders-by-status";
import { formatNumber } from "@/lib/formatters";

type OrdersByStatusChartProps = {
  data: OrdersByStatusDatum[];
  hasOrders: boolean;
};

export function OrdersByStatusChart({
  data,
  hasOrders,
}: OrdersByStatusChartProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="font-semibold text-slate-950">Orders by Status</h2>
        <p className="mt-1 text-xs text-slate-500">
          Distribution across the active filtered dataset
        </p>
      </div>

      {hasOrders ? (
        <>
          <div
            className="mt-5 h-64 w-full"
            role="img"
            aria-label="Bar chart of order counts by fulfillment status"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 0, right: 42, bottom: 0, left: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="status"
                  width={82}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <Bar dataKey="orders" fill="#2563eb" radius={[0, 4, 4, 0]}>
                  <LabelList
                    dataKey="orders"
                    position="right"
                    className="fill-slate-700 text-xs font-medium"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-200 pt-4 text-xs sm:grid-cols-5">
            {data.map((datum) => (
              <div key={datum.status} className="rounded-md bg-slate-50 px-3 py-2">
                <dt className="text-slate-500">{datum.status}</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {formatNumber(datum.orders)} orders
                </dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <div className="mt-5 flex min-h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 text-center">
          <div>
            <p className="font-medium text-slate-700">
              No status data for the active filters
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Reset the filters above to restore the full distribution.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
