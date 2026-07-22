import { CATEGORIES, type Category } from "@/domain/orders";

type CategoryFilterProps = {
  value: Category | null;
  onChange: (category: Category | null) => void;
};

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <label className="flex min-w-52 flex-col text-sm font-medium text-slate-700">
      <span>Category</span>
      <span aria-hidden="true" className="mt-2 h-4" />
      <select
        className="mt-1 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        value={value ?? "all"}
        onChange={(event) =>
          onChange(
            event.target.value === "all"
              ? null
              : (event.target.value as Category),
          )
        }
      >
        <option value="all">All categories</option>
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </label>
  );
}
