import type { OrderMetrics } from "@/domain/metrics";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

type MetricCardsProps = {
  metrics: Pick<OrderMetrics, "revenue" | "orders">;
};

export function MetricCards({ metrics }: MetricCardsProps) {
  const cards = [
    {
      label: "Revenue",
      value: currencyFormatter.format(metrics.revenue),
      description: "Gross order value",
    },
    {
      label: "Orders",
      value: numberFormatter.format(metrics.orders),
      description: "Records in active view",
    },
  ];

  return (
    <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2">
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
