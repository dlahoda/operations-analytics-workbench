import { ORDER_STATUSES, type OrderStatus } from "@/domain/orders";

type StatusFilterProps = {
  value: OrderStatus | null;
  onChange: (status: OrderStatus | null) => void;
};

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <label className="flex min-w-52 flex-col text-sm font-medium text-slate-700">
      <span>Status</span>
      <span aria-hidden="true" className="mt-2 h-4" />
      <select
        className="mt-1 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        value={value ?? "all"}
        onChange={(event) =>
          onChange(
            event.target.value === "all"
              ? null
              : (event.target.value as OrderStatus),
          )
        }
      >
        <option value="all">All statuses</option>
        {ORDER_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </label>
  );
}
