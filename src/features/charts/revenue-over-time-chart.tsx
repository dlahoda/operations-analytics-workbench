"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { RevenueByMonthDatum } from "@/domain/revenue-by-month";
import { formatCalendarMonth, formatUsd } from "@/lib/formatters";

type RevenueOverTimeChartProps = {
  data: RevenueByMonthDatum[];
};

export function RevenueOverTimeChart({ data }: RevenueOverTimeChartProps) {
  const hasData = data.length > 0;

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="font-semibold text-slate-950">Revenue over Time</h2>
        <p className="mt-1 text-xs text-slate-500">
          Monthly revenue across the active filtered dataset
        </p>
      </div>

      {hasData ? (
        <>
          <div
            className="mt-5 h-64 w-full"
            role="img"
            aria-label="Line chart of monthly revenue in chronological order"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 8, right: 12, bottom: 0, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickFormatter={formatCalendarMonth}
                  minTickGap={32}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  width={76}
                  tickFormatter={formatUsd}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [formatUsd(Number(value)), "Revenue"]}
                  labelFormatter={(label) => formatCalendarMonth(String(label))}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#2563eb" }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-200 pt-4 text-xs sm:grid-cols-3 xl:grid-cols-4">
            {data.map((datum) => (
              <div key={datum.month} className="rounded-md bg-slate-50 px-3 py-2">
                <dt className="text-slate-500">{formatCalendarMonth(datum.month)}</dt>
                <dd className="mt-1 font-semibold text-slate-900">
                  {formatUsd(datum.revenue)}
                </dd>
              </div>
            ))}
          </dl>
        </>
      ) : (
        <div className="mt-5 flex min-h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 text-center">
          <div>
            <p className="font-medium text-slate-700">
              No revenue data for the active filters
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Adjust or reset the filters above to restore the revenue trend.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
