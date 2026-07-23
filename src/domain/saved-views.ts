import {
  createWorkbenchViewConfig,
  DEFAULT_WORKBENCH_VIEW_CONFIG,
  type WorkbenchViewConfig,
} from "./workbench-view-config";

export const SAVED_VIEW_IDS = [
  "default-overview",
  "europe-electronics-watch",
  "apac-fulfillment-watch",
  "apparel-refund-watch",
  "accessories-volume",
] as const;

export type SavedViewId = (typeof SAVED_VIEW_IDS)[number];

export type SavedView = {
  id: SavedViewId;
  name: string;
  config: WorkbenchViewConfig;
};

export const DEFAULT_SAVED_VIEW_ID: SavedViewId = "default-overview";

export const SAVED_VIEWS: readonly SavedView[] = [
  {
    id: DEFAULT_SAVED_VIEW_ID,
    name: "Default Overview",
    config: createWorkbenchViewConfig(),
  },
  {
    id: "europe-electronics-watch",
    name: "Europe Electronics Watch",
    config: createWorkbenchViewConfig({
      ...DEFAULT_WORKBENCH_VIEW_CONFIG,
      filters: {
        dateFrom: null,
        dateTo: null,
        region: "Europe",
        category: "Electronics",
        status: null,
      },
    }),
  },
  {
    id: "apac-fulfillment-watch",
    name: "APAC Fulfillment Watch",
    config: createWorkbenchViewConfig({
      ...DEFAULT_WORKBENCH_VIEW_CONFIG,
      filters: {
        dateFrom: null,
        dateTo: null,
        region: "APAC",
        category: null,
        status: null,
      },
    }),
  },
  {
    id: "apparel-refund-watch",
    name: "Apparel Refund Watch",
    config: createWorkbenchViewConfig({
      ...DEFAULT_WORKBENCH_VIEW_CONFIG,
      filters: {
        dateFrom: null,
        dateTo: null,
        region: null,
        category: "Apparel",
        status: null,
      },
    }),
  },
  {
    id: "accessories-volume",
    name: "Accessories Volume",
    config: createWorkbenchViewConfig({
      ...DEFAULT_WORKBENCH_VIEW_CONFIG,
      filters: {
        dateFrom: null,
        dateTo: null,
        region: null,
        category: "Accessories",
        status: null,
      },
    }),
  },
];

export function getSavedView(savedViewId: SavedViewId): SavedView {
  const savedView = SAVED_VIEWS.find((view) => view.id === savedViewId);

  if (!savedView) {
    throw new Error(`Unknown saved view: ${savedViewId}`);
  }

  return savedView;
}
