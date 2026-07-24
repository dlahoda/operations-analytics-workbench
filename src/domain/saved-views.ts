import {
  createWorkbenchViewConfig,
  DEFAULT_WORKBENCH_VIEW_CONFIG,
  isWorkbenchViewConfig,
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

export type CustomSavedView = {
  id: string;
  name: string;
  config: WorkbenchViewConfig;
};

export type ActiveSavedViewRef =
  | { type: "predefined"; id: SavedViewId }
  | { type: "custom"; id: string }
  | null;

export const MAX_SAVED_VIEW_NAME_LENGTH = 60;
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

export function getSavedViewNameError(
  name: string,
  existingNames: readonly string[] = [],
): string | null {
  const normalizedName = name.trim();

  if (normalizedName === "") {
    return "Enter a name for this view.";
  }

  if (normalizedName.length > MAX_SAVED_VIEW_NAME_LENGTH) {
    return `Use ${MAX_SAVED_VIEW_NAME_LENGTH} characters or fewer.`;
  }

  const comparableName = normalizedName.toLocaleLowerCase();
  if (
    existingNames.some(
      (existingName) =>
        existingName.trim().toLocaleLowerCase() === comparableName,
    )
  ) {
    return "A saved view with this name already exists.";
  }

  return null;
}

export function createCustomSavedView(
  id: string,
  name: string,
  config: WorkbenchViewConfig,
  existingNames: readonly string[] = [],
): CustomSavedView {
  const normalizedId = id.trim();
  const normalizedName = name.trim();
  const nameError = getSavedViewNameError(normalizedName, existingNames);

  if (normalizedId === "") {
    throw new Error("Custom saved view ID must not be empty.");
  }

  if (nameError) {
    throw new Error(nameError);
  }

  return {
    id: normalizedId,
    name: normalizedName,
    config: createWorkbenchViewConfig(config),
  };
}

export function cloneCustomSavedView(
  savedView: CustomSavedView,
): CustomSavedView {
  return createCustomSavedView(savedView.id, savedView.name, savedView.config);
}

export function isCustomSavedView(value: unknown): value is CustomSavedView {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const savedView = value as Record<string, unknown>;

  return (
    typeof savedView.id === "string" &&
    savedView.id.trim() !== "" &&
    typeof savedView.name === "string" &&
    savedView.name === savedView.name.trim() &&
    getSavedViewNameError(savedView.name) === null &&
    isWorkbenchViewConfig(savedView.config)
  );
}
