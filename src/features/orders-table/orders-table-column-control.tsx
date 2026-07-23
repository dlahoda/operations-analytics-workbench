"use client";

import { useState } from "react";

import {
  ORDER_COLUMN_IDS,
  type OrderColumnId,
} from "@/domain/workbench-view-config";
import { ORDER_COLUMN_LABELS } from "@/features/orders-table/orders-table-columns";

type OrdersTableColumnControlProps = {
  visibleColumns: OrderColumnId[];
  onVisibleColumnsChange: (visibleColumns: OrderColumnId[]) => void;
};

export function OrdersTableColumnControl({
  visibleColumns,
  onVisibleColumnsChange,
}: OrdersTableColumnControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hideableColumns = ORDER_COLUMN_IDS.filter(
    (columnId) => columnId !== "orderId",
  );

  function toggleColumn(columnId: OrderColumnId, isVisible: boolean) {
    const nextColumns = isVisible
      ? ORDER_COLUMN_IDS.filter(
          (supportedColumnId) =>
            visibleColumns.includes(supportedColumnId) ||
            supportedColumnId === columnId,
        )
      : visibleColumns.filter(
          (visibleColumnId) => visibleColumnId !== columnId,
        );

    onVisibleColumnsChange(nextColumns);
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls="orders-column-options"
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        onClick={() => setIsExpanded((current) => !current)}
      >
        Columns
      </button>
      {isExpanded ? (
        <fieldset
          id="orders-column-options"
          className="absolute right-0 z-10 mt-2 min-w-52 rounded-lg border border-slate-200 bg-white p-3 shadow-lg"
        >
          <legend className="sr-only">Visible order columns</legend>
          <div className="flex flex-col gap-2">
            {hideableColumns.map((columnId) => (
              <label
                key={columnId}
                className="flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-sm text-slate-700 focus-within:ring-2 focus-within:ring-blue-600"
              >
                <input
                  type="checkbox"
                  className="size-4 accent-blue-700"
                  checked={visibleColumns.includes(columnId)}
                  onChange={(event) =>
                    toggleColumn(columnId, event.target.checked)
                  }
                />
                {ORDER_COLUMN_LABELS[columnId]}
              </label>
            ))}
          </div>
          <p className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-500">
            Order ID is always visible.
          </p>
        </fieldset>
      ) : null}
    </div>
  );
}
