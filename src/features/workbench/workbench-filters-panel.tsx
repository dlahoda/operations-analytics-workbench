import type { OrderDateBounds, WorkbenchFilters } from "@/domain/filters";
import type { Category, OrderStatus, Region } from "@/domain/orders";
import { CategoryFilter } from "@/features/filters/category-filter";
import { DateRangeFilter } from "@/features/filters/date-range-filter";
import { RegionFilter } from "@/features/filters/region-filter";
import { StatusFilter } from "@/features/filters/status-filter";
import { formatCalendarDate } from "@/lib/formatters";

type WorkbenchFiltersPanelProps = {
  filters: WorkbenchFilters;
  dateBounds: OrderDateBounds | null;
  hasActiveFilters: boolean;
  hasInvalidDates: boolean;
  onDateFromChange: (dateFrom: string | null) => void;
  onDateToChange: (dateTo: string | null) => void;
  onRegionChange: (region: Region | null) => void;
  onCategoryChange: (category: Category | null) => void;
  onStatusChange: (status: OrderStatus | null) => void;
  onReset: () => void;
};

export function WorkbenchFiltersPanel({
  filters,
  dateBounds,
  hasActiveFilters,
  hasInvalidDates,
  onDateFromChange,
  onDateToChange,
  onRegionChange,
  onCategoryChange,
  onStatusChange,
  onReset,
}: WorkbenchFiltersPanelProps) {
  return (
    <section
      aria-label="Workbench filters"
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(22rem,1.5fr)_repeat(3,minmax(0,1fr))]">
        <DateRangeFilter
          dateFrom={filters.dateFrom}
          dateTo={filters.dateTo}
          minimumDate={dateBounds?.minimum}
          maximumDate={dateBounds?.maximum}
          error={
            hasInvalidDates
              ? "From date must be on or before the To date. No results are shown until the range is valid."
              : undefined
          }
          onDateFromChange={onDateFromChange}
          onDateToChange={onDateToChange}
        />
        <RegionFilter value={filters.region} onChange={onRegionChange} />
        <CategoryFilter value={filters.category} onChange={onCategoryChange} />
        <StatusFilter value={filters.status} onChange={onStatusChange} />
      </div>

      {hasActiveFilters ? (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-200 pt-4">
          <span className="mr-1 text-xs font-medium text-slate-500">
            Active filters
          </span>
          {filters.dateFrom ? (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
              From: {formatCalendarDate(filters.dateFrom)}
            </span>
          ) : null}
          {filters.dateTo ? (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
              To: {formatCalendarDate(filters.dateTo)}
            </span>
          ) : null}
          {filters.region ? (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
              Region: {filters.region}
            </span>
          ) : null}
          {filters.category ? (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
              Category: {filters.category}
            </span>
          ) : null}
          {filters.status ? (
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-800">
              Status: {filters.status}
            </span>
          ) : null}
          <button
            type="button"
            className="ml-auto rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            onClick={onReset}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <p className="mt-4 border-t border-slate-200 pt-4 text-xs text-slate-500">
          No active filters
        </p>
      )}
    </section>
  );
}
