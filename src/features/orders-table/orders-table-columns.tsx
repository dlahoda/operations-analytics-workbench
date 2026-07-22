import type { ColumnDef } from "@tanstack/react-table";

import type { Order } from "@/domain/orders";
import { formatUsd } from "@/lib/formatters";

export const ordersTableColumns: ColumnDef<Order>[] = [
  { accessorKey: "orderId", header: "Order ID" },
  { accessorKey: "orderDate", header: "Date" },
  { accessorKey: "region", header: "Region" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "status", header: "Status" },
  {
    accessorKey: "revenue",
    header: "Revenue",
    cell: ({ getValue }) => formatUsd(getValue<number>()),
  },
  {
    accessorKey: "refundAmount",
    header: "Refund",
    cell: ({ getValue }) => formatUsd(getValue<number>()),
  },
  {
    accessorKey: "margin",
    header: "Margin",
    cell: ({ getValue }) => formatUsd(getValue<number>()),
  },
  { accessorKey: "channel", header: "Channel" },
];
