import { describe, expect, it } from "vitest";

import {
  createCustomSavedView,
  getSavedViewNameError,
  MAX_SAVED_VIEW_NAME_LENGTH,
  SAVED_VIEWS,
} from "./saved-views";
import {
  createWorkbenchViewConfig,
  DEFAULT_WORKBENCH_VIEW_CONFIG,
} from "./workbench-view-config";

describe("custom saved views", () => {
  it("trims names and defensively clones the complete config", () => {
    const sourceConfig = createWorkbenchViewConfig({
      ...DEFAULT_WORKBENCH_VIEW_CONFIG,
      filters: {
        ...DEFAULT_WORKBENCH_VIEW_CONFIG.filters,
        region: "Europe",
      },
    });

    const savedView = createCustomSavedView(
      "view-1",
      "  Europe Daily  ",
      sourceConfig,
    );

    expect(savedView.name).toBe("Europe Daily");
    expect(savedView.config).toEqual(sourceConfig);
    expect(savedView.config).not.toBe(sourceConfig);
    expect(savedView.config.filters).not.toBe(sourceConfig.filters);
    expect(savedView.config.sorting).not.toBe(sourceConfig.sorting);
    expect(savedView.config.visibleColumns).not.toBe(sourceConfig.visibleColumns);

    sourceConfig.filters.region = "APAC";
    sourceConfig.sorting[0].desc = false;
    sourceConfig.visibleColumns.pop();

    expect(savedView.config.filters.region).toBe("Europe");
    expect(savedView.config.sorting[0].desc).toBe(true);
    expect(savedView.config.visibleColumns).toContain("channel");
  });

  it("rejects blank names", () => {
    expect(getSavedViewNameError("   ")).toBe(
      "Enter a name for this view.",
    );
    expect(() =>
      createCustomSavedView("view-1", "   ", createWorkbenchViewConfig()),
    ).toThrow("Enter a name for this view.");
  });

  it("rejects names longer than 60 characters", () => {
    const longName = "x".repeat(MAX_SAVED_VIEW_NAME_LENGTH + 1);

    expect(getSavedViewNameError(longName)).toBe(
      "Use 60 characters or fewer.",
    );
  });

  it("rejects case-insensitive duplicate names", () => {
    expect(
      getSavedViewNameError(" default overview ", [
        SAVED_VIEWS[0].name,
        "Europe Daily",
      ]),
    ).toBe("A saved view with this name already exists.");
    expect(getSavedViewNameError("EUROPE DAILY", ["Europe Daily"])).toBe(
      "A saved view with this name already exists.",
    );
  });

  it("does not let stored configs mutate defaults or predefined views", () => {
    const customView = createCustomSavedView(
      "view-1",
      "Default Copy",
      SAVED_VIEWS[0].config,
    );

    customView.config.filters.region = "Europe";
    customView.config.sorting[0].desc = false;
    customView.config.visibleColumns.pop();

    expect(DEFAULT_WORKBENCH_VIEW_CONFIG.filters.region).toBeNull();
    expect(DEFAULT_WORKBENCH_VIEW_CONFIG.sorting[0].desc).toBe(true);
    expect(DEFAULT_WORKBENCH_VIEW_CONFIG.visibleColumns).toContain("channel");
    expect(SAVED_VIEWS[0].config.filters.region).toBeNull();
    expect(SAVED_VIEWS[0].config.sorting[0].desc).toBe(true);
    expect(SAVED_VIEWS[0].config.visibleColumns).toContain("channel");
  });
});
