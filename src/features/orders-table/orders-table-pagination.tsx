import type { Table } from "@tanstack/react-table";

import type { Order } from "@/domain/orders";

type OrdersTablePaginationProps = {
  table: Table<Order>;
  hasOrders: boolean;
};

export function OrdersTablePagination({
  table,
  hasOrders,
}: OrdersTablePaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 text-sm text-slate-600">
      <span>
        {hasOrders
          ? `Page ${table.getState().pagination.pageIndex + 1} of ${table.getPageCount()}`
          : "No pages"}
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
  );
}
