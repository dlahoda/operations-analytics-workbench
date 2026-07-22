import type { OrderMetrics } from "@/domain/metrics";
import { formatNumber, formatPercentage, formatUsd } from "@/lib/formatters";

type MetricCardsProps = {
  metrics: Pick<
    OrderMetrics,
    "revenue" | "orders" | "refundRate" | "averageOrderValue"
  >;
};

export function MetricCards({ metrics }: MetricCardsProps) {
  const cards = [
    {
      label: "Revenue",
      value: formatUsd(metrics.revenue),
      description: "Gross order value",
    },
    {
      label: "Orders",
      value: formatNumber(metrics.orders),
      description: "Records in active view",
    },
    {
      label: "Refund Rate",
      value: formatPercentage(metrics.refundRate),
      description: "Share of refunded orders",
    },
    {
      label: "Average Order Value",
      value: formatUsd(metrics.averageOrderValue),
      description: "Average value per order",
    },
  ];

  return (
    <section
      aria-label="Key metrics"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-slate-500">{card.label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {card.value}
          </p>
          <p className="mt-2 text-xs text-slate-500">{card.description}</p>
        </article>
      ))}
    </section>
  );
}
