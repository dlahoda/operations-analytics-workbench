import { describe, expect, it } from "vitest";

import {
  CUSTOM_SAVED_VIEWS_STORAGE_VERSION,
  parseCustomSavedViews,
  serializeCustomSavedViews,
} from "./custom-saved-views-storage";
import { createCustomSavedView } from "./saved-views";
import {
  createWorkbenchViewConfig,
  DEFAULT_WORKBENCH_VIEW_CONFIG,
} from "./workbench-view-config";

function createValidView(id = "view-1", name = "Europe Daily") {
  return createCustomSavedView(
    id,
    name,
    createWorkbenchViewConfig({
      ...DEFAULT_WORKBENCH_VIEW_CONFIG,
      filters: {
        ...DEFAULT_WORKBENCH_VIEW_CONFIG.filters,
        region: "Europe",
      },
    }),
  );
}

function createPayload(views: unknown[]): string {
  return JSON.stringify({
    version: CUSTOM_SAVED_VIEWS_STORAGE_VERSION,
    views,
  });
}

function withConfigChange(
  change: (config: Record<string, unknown>) => void,
): string {
  const view = JSON.parse(JSON.stringify(createValidView())) as {
    config: Record<string, unknown>;
  };
  change(view.config);
  return createPayload([view]);
}

describe("custom saved-view storage", () => {
  it("round-trips a valid versioned payload with defensive clones", () => {
    const sourceView = createValidView();
    const serialized = serializeCustomSavedViews([sourceView]);
    const restoredViews = parseCustomSavedViews(serialized);

    expect(restoredViews).toEqual([sourceView]);
    expect(restoredViews[0]).not.toBe(sourceView);
    expect(restoredViews[0].config).not.toBe(sourceView.config);

    restoredViews[0].config.filters.region = "APAC";
    restoredViews[0].config.sorting[0].desc = false;

    expect(sourceView.config.filters.region).toBe("Europe");
    expect(sourceView.config.sorting[0].desc).toBe(true);
  });

  it("returns an empty collection for malformed JSON", () => {
    expect(parseCustomSavedViews("{not-json")).toEqual([]);
  });

  it("returns an empty collection for unsupported payload versions", () => {
    expect(
      parseCustomSavedViews(JSON.stringify({ version: 2, views: [] })),
    ).toEqual([]);
  });

  it("skips invalid saved-view entries", () => {
    const validView = createValidView();

    expect(
      parseCustomSavedViews(
        createPayload([
          null,
          {},
          { ...validView, id: "" },
          { ...validView, name: "   " },
          validView,
        ]),
      ),
    ).toEqual([validView]);
  });

  it.each([
    [
      "region",
      (config: Record<string, unknown>) => {
        (config.filters as Record<string, unknown>).region = "Atlantis";
      },
    ],
    [
      "category",
      (config: Record<string, unknown>) => {
        (config.filters as Record<string, unknown>).category = "Furniture";
      },
    ],
    [
      "status",
      (config: Record<string, unknown>) => {
        (config.filters as Record<string, unknown>).status = "Archived";
      },
    ],
    [
      "sort ID",
      (config: Record<string, unknown>) => {
        config.sorting = [{ id: "country", desc: false }];
      },
    ],
    [
      "column ID",
      (config: Record<string, unknown>) => {
        config.visibleColumns = ["orderId", "country"];
      },
    ],
  ])("rejects an unsupported %s", (_label, change) => {
    expect(parseCustomSavedViews(withConfigChange(change))).toEqual([]);
  });

  it("rejects sorting without boolean directions", () => {
    expect(
      parseCustomSavedViews(
        withConfigChange((config) => {
          config.sorting = [{ id: "orderDate", desc: "yes" }];
        }),
      ),
    ).toEqual([]);
  });

  it("rejects visible columns missing the permanent orderId column", () => {
    expect(
      parseCustomSavedViews(
        withConfigChange((config) => {
          config.visibleColumns = ["orderDate", "region"];
        }),
      ),
    ).toEqual([]);
  });

  it("rejects duplicate visible column IDs", () => {
    expect(
      parseCustomSavedViews(
        withConfigChange((config) => {
          config.visibleColumns = ["orderId", "region", "region"];
        }),
      ),
    ).toEqual([]);
  });

  it("de-duplicates custom IDs deterministically", () => {
    const firstView = createValidView("duplicate-id", "First View");
    const secondView = createValidView("duplicate-id", "Second View");

    expect(
      parseCustomSavedViews(createPayload([firstView, secondView])),
    ).toEqual([firstView]);
  });
});
