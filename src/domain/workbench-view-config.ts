import {
  DEFAULT_WORKBENCH_FILTERS,
  type WorkbenchFilters,
} from "./filters";

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
