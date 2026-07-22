"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import type { Order } from "@/domain/orders";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type OrdersTableProps = {
  orders: Order[];
};

export function OrdersTable({ orders }: OrdersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "orderDate", desc: true },
  ]);
  const columns = useMemo<ColumnDef<Order>[]>(
    () => [
      { accessorKey: "orderId", header: "Order ID" },
      { accessorKey: "orderDate", header: "Date" },
      { accessorKey: "region", header: "Region" },
      { accessorKey: "category", header: "Category" },
      { accessorKey: "status", header: "Status" },
      {
        accessorKey: "revenue",
        header: "Revenue",
        cell: ({ getValue }) => currencyFormatter.format(getValue<number>()),
      },
      {
        accessorKey: "refundAmount",
        header: "Refund",
        cell: ({ getValue }) => currencyFormatter.format(getValue<number>()),
      },
      {
        accessorKey: "margin",
        header: "Margin",
        cell: ({ getValue }) => currencyFormatter.format(getValue<number>()),
      },
      { accessorKey: "channel", header: "Channel" },
    ],
    [],
  );
  // TanStack Table intentionally returns stateful callbacks that React Compiler skips.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: orders,
    columns,
    getRowId: (order) => order.orderId,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="font-semibold text-slate-950">Orders</h2>
          <p className="mt-1 text-xs text-slate-500">
            {orders.length.toLocaleString("en-US")} records in the active view
          </p>
        </div>
        <span className="text-xs font-medium text-slate-500">Select a column to sort</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-5xl border-collapse text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="border-b border-slate-200 px-4 py-3 font-semibold">
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <span aria-hidden="true">
                          {{ asc: "↑", desc: "↓" }[header.column.getIsSorted() as string] ?? "↕"}
                        </span>
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="text-slate-700 transition hover:bg-blue-50/50">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="whitespace-nowrap px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm text-slate-600">
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1.5 font-medium disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            Previous
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1.5 font-medium disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
