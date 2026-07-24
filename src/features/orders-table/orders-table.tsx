"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type Updater,
  type VisibilityState,
} from "@tanstack/react-table";

import type { Order } from "@/domain/orders";
import {
  isOrderColumnId,
  ORDER_COLUMN_IDS,
  type OrderColumnId,
  type WorkbenchSort,
} from "@/domain/workbench-view-config";
import { OrdersTableColumnControl } from "@/features/orders-table/orders-table-column-control";
import { ordersTableColumns } from "@/features/orders-table/orders-table-columns";
import { OrdersTablePagination } from "@/features/orders-table/orders-table-pagination";
import { formatNumber } from "@/lib/formatters";

type OrdersTableProps = {
  orders: Order[];
  sorting: WorkbenchSort[];
  visibleColumns: OrderColumnId[];
  selectedOrderId: string | null;
  onSortingChange: (sorting: WorkbenchSort[]) => void;
  onVisibleColumnsChange: (visibleColumns: OrderColumnId[]) => void;
  onOrderSelect: (order: Order) => void;
};

export function OrdersTable({
  orders,
  sorting,
  visibleColumns,
  selectedOrderId,
  onSortingChange,
  onVisibleColumnsChange,
  onOrderSelect,
}: OrdersTableProps) {
  function handleSortingChange(updater: Updater<SortingState>) {
    const nextSorting =
      typeof updater === "function" ? updater(sorting) : updater;

    onSortingChange(
      nextSorting.flatMap((sort) =>
        isOrderColumnId(sort.id)
          ? [{ id: sort.id, desc: sort.desc }]
          : [],
      ),
    );
  }
  const columnVisibility = Object.fromEntries(
    ORDER_COLUMN_IDS.map((columnId) => [
      columnId,
      visibleColumns.includes(columnId),
    ]),
  );

  function handleColumnVisibilityChange(updater: Updater<VisibilityState>) {
    const nextVisibility =
      typeof updater === "function" ? updater(columnVisibility) : updater;

    onVisibleColumnsChange(
      ORDER_COLUMN_IDS.filter(
        (columnId) =>
          columnId === "orderId" || nextVisibility[columnId] !== false,
      ),
    );
  }
  // TanStack Table intentionally returns stateful callbacks that React Compiler skips.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: orders,
    columns: ordersTableColumns,
    getRowId: (order) => order.orderId,
    state: { sorting, columnVisibility },
    onSortingChange: handleSortingChange,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: true,
    initialState: { pagination: { pageSize: 20 } },
  });

  const hasOrders = orders.length > 0;

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="font-semibold text-slate-950">Orders</h2>
          <p className="mt-1 text-xs text-slate-500">
            {formatNumber(orders.length)} records in the active view
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs font-medium text-slate-500 sm:inline">
            Select a column to sort
          </span>
          <OrdersTableColumnControl
            visibleColumns={visibleColumns}
            onVisibleColumnsChange={onVisibleColumnsChange}
          />
        </div>
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
                        className="inline-flex cursor-pointer items-center gap-1.5 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
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
            {hasOrders ? (
              table.getRowModel().rows.map((row) => {
                const isSelected = row.original.orderId === selectedOrderId;

                return (
                  <tr
                    key={row.id}
                    tabIndex={0}
                    aria-selected={isSelected}
                    className={`cursor-pointer text-slate-700 transition outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 ${
                      isSelected
                        ? "bg-blue-100 text-slate-950 hover:bg-blue-100"
                        : "hover:bg-blue-50/50"
                    }`}
                    onClick={() => onOrderSelect(row.original)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onOrderSelect(row.original);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="whitespace-nowrap px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={table.getVisibleLeafColumns().length}
                  className="px-5 py-12 text-center"
                >
                  <p className="font-medium text-slate-700">
                    No orders match the active filters or search
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Reset the view above to return to the full dataset.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <OrdersTablePagination table={table} hasOrders={hasOrders} />
    </section>
  );
}
