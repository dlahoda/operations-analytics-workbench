type DateRangeFilterProps = {
  dateFrom: string | null;
  dateTo: string | null;
  minimumDate?: string;
  maximumDate?: string;
  error?: string;
  onDateFromChange: (date: string | null) => void;
  onDateToChange: (date: string | null) => void;
};

export function DateRangeFilter({
  dateFrom,
  dateTo,
  minimumDate,
  maximumDate,
  error,
  onDateFromChange,
  onDateToChange,
}: DateRangeFilterProps) {
  const errorId = "date-range-error";
  const inputClassName =
    "h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

  return (
    <fieldset className="min-w-0 sm:min-w-[22rem]">
      <legend className="text-sm font-medium text-slate-700">Date range</legend>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-500">
          From
          <input
            type="date"
            className={inputClassName}
            value={dateFrom ?? ""}
            min={minimumDate}
            max={maximumDate}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => onDateFromChange(event.target.value || null)}
          />
        </label>
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-500">
          To
          <input
            type="date"
            className={inputClassName}
            value={dateTo ?? ""}
            min={minimumDate}
            max={maximumDate}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => onDateToChange(event.target.value || null)}
          />
        </label>
      </div>
      {error ? (
        <p id={errorId} role="alert" className="mt-2 text-xs font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
