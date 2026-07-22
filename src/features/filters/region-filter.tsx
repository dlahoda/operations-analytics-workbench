import { REGIONS, type Region } from "@/domain/orders";

type RegionFilterProps = {
  value: Region | null;
  onChange: (region: Region | null) => void;
};

export function RegionFilter({ value, onChange }: RegionFilterProps) {
  return (
    <label className="flex min-w-52 flex-col text-sm font-medium text-slate-700">
      <span>Region</span>
      <span aria-hidden="true" className="mt-2 h-4" />
      <select
        className="mt-1 h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-950 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        value={value ?? "all"}
        onChange={(event) =>
          onChange(event.target.value === "all" ? null : (event.target.value as Region))
        }
      >
        <option value="all">All regions</option>
        {REGIONS.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </label>
  );
}
