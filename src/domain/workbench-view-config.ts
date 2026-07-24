import {
  DEFAULT_WORKBENCH_FILTERS,
  type WorkbenchFilters,
} from "./filters";
import {
  CATEGORIES,
  ORDER_STATUSES,
  REGIONS,
  type Category,
  type OrderStatus,
  type Region,
} from "./orders";

export const ORDER_COLUMN_IDS = [
  "orderId",
  "orderDate",
  "region",
  "category",
  "status",
  "revenue",
  "refundAmount",
  "margin",
  "channel",
] as const;

export type OrderColumnId = (typeof ORDER_COLUMN_IDS)[number];

export type WorkbenchSort = {
  id: OrderColumnId;
  desc: boolean;
};

export type WorkbenchViewConfig = {
  filters: WorkbenchFilters;
  searchQuery: string;
  sorting: WorkbenchSort[];
  visibleColumns: OrderColumnId[];
};

export const DEFAULT_SEARCH_QUERY = "";
export const DEFAULT_WORKBENCH_SORTING: readonly WorkbenchSort[] = [
  { id: "orderDate", desc: true },
];
export const DEFAULT_VISIBLE_COLUMNS: readonly OrderColumnId[] = [
  ...ORDER_COLUMN_IDS,
];
export const DEFAULT_WORKBENCH_VIEW_CONFIG: Readonly<WorkbenchViewConfig> = {
  filters: DEFAULT_WORKBENCH_FILTERS,
  searchQuery: DEFAULT_SEARCH_QUERY,
  sorting: DEFAULT_WORKBENCH_SORTING.map((sort) => ({ ...sort })),
  visibleColumns: [...DEFAULT_VISIBLE_COLUMNS],
};

export function createWorkbenchViewConfig(
  config: WorkbenchViewConfig = DEFAULT_WORKBENCH_VIEW_CONFIG,
): WorkbenchViewConfig {
  return {
    filters: { ...config.filters },
    searchQuery: config.searchQuery,
    sorting: config.sorting.map((sort) => ({ ...sort })),
    visibleColumns: [...config.visibleColumns],
  };
}

export function areWorkbenchViewConfigsEqual(
  first: WorkbenchViewConfig,
  second: WorkbenchViewConfig,
): boolean {
  return JSON.stringify(first) === JSON.stringify(second);
}

export function isOrderColumnId(value: string): value is OrderColumnId {
  return (ORDER_COLUMN_IDS as readonly string[]).includes(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === "string";
}

function isSupportedValue<Value extends string>(
  value: unknown,
  supportedValues: readonly Value[],
): value is Value | null {
  return (
    value === null ||
    (typeof value === "string" && supportedValues.includes(value as Value))
  );
}

export function isWorkbenchViewConfig(
  value: unknown,
): value is WorkbenchViewConfig {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const config = value as Record<string, unknown>;
  const filters = config.filters;

  if (typeof filters !== "object" || filters === null) {
    return false;
  }

  const filterValues = filters as Record<string, unknown>;
  const sorting = config.sorting;
  const visibleColumns = config.visibleColumns;

  return (
    isNullableString(filterValues.dateFrom) &&
    isNullableString(filterValues.dateTo) &&
    isSupportedValue<Region>(filterValues.region, REGIONS) &&
    isSupportedValue<Category>(filterValues.category, CATEGORIES) &&
    isSupportedValue<OrderStatus>(filterValues.status, ORDER_STATUSES) &&
    typeof config.searchQuery === "string" &&
    Array.isArray(sorting) &&
    sorting.every(
      (sort) =>
        typeof sort === "object" &&
        sort !== null &&
        typeof (sort as Record<string, unknown>).id === "string" &&
        isOrderColumnId((sort as Record<string, unknown>).id as string) &&
        typeof (sort as Record<string, unknown>).desc === "boolean",
    ) &&
    Array.isArray(visibleColumns) &&
    visibleColumns.every(
      (columnId) =>
        typeof columnId === "string" && isOrderColumnId(columnId),
    ) &&
    visibleColumns.includes("orderId") &&
    new Set(visibleColumns).size === visibleColumns.length
  );
}
