import type { ColumnDef } from "@tanstack/react-table";

import type { Order } from "@/domain/orders";
import type { OrderColumnId } from "@/domain/workbench-view-config";
import { formatUsd } from "@/lib/formatters";

export const ORDER_COLUMN_LABELS: Record<OrderColumnId, string> = {
  orderId: "Order ID",
  orderDate: "Date",
  region: "Region",
  category: "Category",
  status: "Status",
  revenue: "Revenue",
  refundAmount: "Refund",
  margin: "Margin",
  channel: "Channel",
};

export const ordersTableColumns: ColumnDef<Order>[] = [
  { accessorKey: "orderId", header: ORDER_COLUMN_LABELS.orderId },
  { accessorKey: "orderDate", header: ORDER_COLUMN_LABELS.orderDate },
  { accessorKey: "region", header: ORDER_COLUMN_LABELS.region },
  { accessorKey: "category", header: ORDER_COLUMN_LABELS.category },
  { accessorKey: "status", header: ORDER_COLUMN_LABELS.status },
  {
    accessorKey: "revenue",
    header: ORDER_COLUMN_LABELS.revenue,
    cell: ({ getValue }) => formatUsd(getValue<number>()),
  },
  {
    accessorKey: "refundAmount",
    header: ORDER_COLUMN_LABELS.refundAmount,
    cell: ({ getValue }) => formatUsd(getValue<number>()),
  },
  {
    accessorKey: "margin",
    header: ORDER_COLUMN_LABELS.margin,
    cell: ({ getValue }) => formatUsd(getValue<number>()),
  },
  { accessorKey: "channel", header: ORDER_COLUMN_LABELS.channel },
];
