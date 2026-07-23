"use client";

import { useEffect, useRef } from "react";

import type { Order, OrderStatus } from "@/domain/orders";
import {
  formatCalendarDate,
  formatNumber,
  formatTimestamp,
  formatUsd,
} from "@/lib/formatters";

type OrderDetailDrawerProps = {
  order: Order | null;
  onClose: () => void;
};

const statusStyles: Record<OrderStatus, string> = {
  Completed: "bg-emerald-100 text-emerald-800",
  Processing: "bg-amber-100 text-amber-800",
  Shipped: "bg-blue-100 text-blue-800",
  Delayed: "bg-orange-100 text-orange-800",
  Cancelled: "bg-rose-100 text-rose-800",
};

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

export function OrderDetailDrawer({
  order,
  onClose,
}: OrderDetailDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!order) return;

    const previouslyFocused = document.activeElement;
    const previousBodyOverflow = document.body.style.overflow;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, [onClose, order]);

  if (!order) return null;

  const activity = [
    {
      label: "Order created",
      detail: `${order.channel} order placed for ${formatUsd(order.orderValue)}.`,
      timestamp: order.createdAt,
    },
    {
      label: `Payment by ${order.paymentMethod}`,
      detail: `${formatNumber(order.units)} unit${order.units === 1 ? "" : "s"} recorded.`,
      timestamp: order.createdAt,
    },
    ...(order.refundStatus === "Refunded"
      ? [
          {
            label: "Refund recorded",
            detail: `${formatUsd(order.refundAmount)} returned to the customer.`,
            timestamp: order.updatedAt,
          },
        ]
      : []),
    {
      label: `Status: ${order.status}`,
      detail: "Latest order state.",
      timestamp: order.updatedAt,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close order details"
        className="absolute inset-0 cursor-default bg-slate-950/40"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-detail-title"
        className="relative z-10 flex h-full w-full flex-col bg-white shadow-2xl sm:max-w-xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
              Order details
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h2
                id="order-detail-title"
                className="text-xl font-semibold tracking-tight text-slate-950"
              >
                {order.orderId}
              </h2>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[order.status]}`}
              >
                {order.status}
              </span>
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close order details"
            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 outline-none hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-600"
            onClick={onClose}
          >
            Close
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
          <section aria-labelledby="order-information-title">
            <h3
              id="order-information-title"
              className="text-sm font-semibold text-slate-950"
            >
              Order information
            </h3>
            <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <DetailItem label="Date" value={formatCalendarDate(order.orderDate)} />
              <DetailItem label="Region" value={order.region} />
              <DetailItem label="Country" value={order.country} />
              <DetailItem label="Category" value={order.category} />
              <DetailItem label="Subcategory" value={order.subcategory} />
              <DetailItem label="Customer segment" value={order.customerSegment} />
              <DetailItem label="Channel" value={order.channel} />
              <DetailItem label="Payment method" value={order.paymentMethod} />
              <DetailItem label="Units" value={formatNumber(order.units)} />
              <DetailItem label="Refund status" value={order.refundStatus} />
            </dl>
          </section>

          <section className="mt-7" aria-labelledby="financials-title">
            <h3 id="financials-title" className="text-sm font-semibold text-slate-950">
              Financials
            </h3>
            <dl className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200">
              {[
                ["Revenue", formatUsd(order.revenue)],
                ["Order value", formatUsd(order.orderValue)],
                ["Refund amount", formatUsd(order.refundAmount)],
                ["Cost", formatUsd(order.cost)],
                ["Margin", formatUsd(order.margin)],
              ].map(([label, value]) => (
                <div key={label} className="bg-white p-4">
                  <DetailItem label={label} value={value} />
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-7" aria-labelledby="activity-title">
            <h3 id="activity-title" className="text-sm font-semibold text-slate-950">
              Activity
            </h3>
            <ol className="mt-4 space-y-4">
              {activity.map((item, index) => (
                <li key={`${item.label}-${index}`} className="relative pl-6">
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-blue-600 ring-4 ring-blue-50"
                  />
                  <p className="text-sm font-medium text-slate-900">{item.label}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{item.detail}</p>
                  <time
                    dateTime={item.timestamp}
                    className="mt-1 block text-xs text-slate-500"
                  >
                    {formatTimestamp(item.timestamp)}
                  </time>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-7 border-t border-slate-200 pt-5" aria-label="Record timestamps">
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailItem label="Created" value={formatTimestamp(order.createdAt)} />
              <DetailItem label="Updated" value={formatTimestamp(order.updatedAt)} />
            </dl>
          </section>
        </div>
      </aside>
    </div>
  );
}
