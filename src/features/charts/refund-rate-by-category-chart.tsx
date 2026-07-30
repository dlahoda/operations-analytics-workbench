"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
  XAxis,
  YAxis,
} from "recharts";

import type { RefundRateByCategoryDatum } from "@/domain/refund-rate-by-category";
import { formatNumber, formatPercentage } from "@/lib/formatters";

type RefundRateByCategoryChartProps = {
  data: RefundRateByCategoryDatum[];
  hasOrders: boolean;
};

function RefundRateTooltip({
  active,
  payload,
}: TooltipContentProps) {
  const datum = payload[0]?.payload as
    | RefundRateByCategoryDatum
    | undefined;

  if (!active || !datum) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 text-xs shadow-lg">
      <p className="font-semibold text-slate-950">{datum.category}</p>
      <dl className="mt-2 grid grid-cols-[auto_auto] gap-x-4 gap-y-1">
        <dt className="text-slate-500">Refund rate</dt>
        <dd className="text-right font-medium text-slate-900">
          {formatPercentage(datum.refundRate)}
        </dd>
        <dt className="text-slate-500">Refunded orders</dt>
        <dd className="text-right font-medium text-slate-900">
          {formatNumber(datum.refundedOrders)}
        </dd>
        <dt className="text-slate-500">Total orders</dt>
        <dd className="text-right font-medium text-slate-900">
          {formatNumber(datum.totalOrders)}
        </dd>
      </dl>
    </div>
  );
}

export function RefundRateByCategoryChart({
  data,
  hasOrders,
}: RefundRateByCategoryChartProps) {
  const maximumRefundRate = Math.max(...data.map(({ refundRate }) => refundRate));
  const yAxisMaximum = Math.max(
    0.15,
    Math.ceil(maximumRefundRate / 0.05) * 0.05,
  );

  return (
    <section
      aria-labelledby="refund-rate-by-category-title"
      aria-describedby="refund-rate-by-category-description"
      className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div>
        <h2
          id="refund-rate-by-category-title"
          className="font-semibold text-slate-950"
        >
          Refund Rate by Category
        </h2>
        <p
          id="refund-rate-by-category-description"
          className="mt-1 text-xs text-slate-500"
        >
          Compare category refund pressure in the active filtered and searched
          orders
        </p>
      </div>

      {hasOrders ? (
        <>
          <div
            className="mt-5 h-64 w-full"
            role="img"
            aria-label="Vertical bar chart comparing refund rates across all product categories"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 24, right: 12, bottom: 0, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, yAxisMaximum]}
                  tickFormatter={formatPercentage}
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  width={52}
                />
                <Tooltip content={RefundRateTooltip} />
                <Bar
                  dataKey="refundRate"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                  isAnimationActive={false}
                >
                  <LabelList
                    dataKey="refundRate"
                    position="top"
                    formatter={(value) =>
                      formatPercentage(Number(value ?? 0))
                    }
                    className="fill-slate-700 text-xs font-medium"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="sr-only">
            {data.map((datum) => (
              <li key={datum.category}>
                {datum.category}: {formatPercentage(datum.refundRate)} refund
                rate, {formatNumber(datum.refundedOrders)} refunded of{" "}
                {formatNumber(datum.totalOrders)} total orders.
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-5 flex min-h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-5 text-center">
          <div>
            <p className="font-medium text-slate-700">
              No category refund data for the active filters and search
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Adjust or reset the filters and search to restore the comparison.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
