import { describe, expect, it } from "vitest";

import {
  createCustomSavedView,
  DEFAULT_SAVED_VIEW_ID,
  getCustomSavedViewNameError,
  getSavedViewDisplayName,
  getSavedViewNameError,
  getSavedViewRefAfterManualChange,
  MAX_SAVED_VIEW_NAME_LENGTH,
  renameCustomSavedView,
  SAVED_VIEWS,
  updateCustomSavedViewConfig,
} from "./saved-views";
import {
  areWorkbenchViewConfigsEqual,
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

  it("renames only the target name while preserving ID, config, and order", () => {
    const firstView = createCustomSavedView(
      "view-1",
      "Europe Daily",
      createWorkbenchViewConfig(),
    );
    const secondView = createCustomSavedView(
      "view-2",
      "APAC Daily",
      createWorkbenchViewConfig(),
    );

    const renamedViews = renameCustomSavedView(
      [firstView, secondView],
      firstView.id,
      "  Europe Review  ",
    );

    expect(renamedViews.map((view) => view.id)).toEqual(["view-1", "view-2"]);
    expect(renamedViews[0]).toEqual({
      ...firstView,
      name: "Europe Review",
    });
    expect(renamedViews[0].config).toBe(firstView.config);
    expect(renamedViews[1]).toBe(secondView);
  });

  it("allows an unchanged own name but rejects invalid and duplicate renames", () => {
    const views = [
      createCustomSavedView(
        "view-1",
        "Europe Daily",
        createWorkbenchViewConfig(),
      ),
      createCustomSavedView(
        "view-2",
        "APAC Daily",
        createWorkbenchViewConfig(),
      ),
    ];

    expect(
      getCustomSavedViewNameError(" EUROPE DAILY ", views, "view-1"),
    ).toBeNull();
    expect(
      getCustomSavedViewNameError("apac daily", views, "view-1"),
    ).toBe("A saved view with this name already exists.");
    expect(
      getCustomSavedViewNameError("default overview", views, "view-1"),
    ).toBe("A saved view with this name already exists.");
    expect(getCustomSavedViewNameError("   ", views, "view-1")).toBe(
      "Enter a name for this view.",
    );
    expect(() =>
      renameCustomSavedView(views, "view-1", "APAC DAILY"),
    ).toThrow("A saved view with this name already exists.");
  });

  it("updates only the target config with a defensive clone", () => {
    const firstView = createCustomSavedView(
      "view-1",
      "Europe Daily",
      createWorkbenchViewConfig(),
    );
    const secondView = createCustomSavedView(
      "view-2",
      "APAC Daily",
      createWorkbenchViewConfig(),
    );
    const updatedConfig = createWorkbenchViewConfig({
      ...DEFAULT_WORKBENCH_VIEW_CONFIG,
      filters: {
        ...DEFAULT_WORKBENCH_VIEW_CONFIG.filters,
        region: "Europe",
      },
      searchQuery: "priority",
    });

    const updatedViews = updateCustomSavedViewConfig(
      [firstView, secondView],
      firstView.id,
      updatedConfig,
    );

    expect(updatedViews.map((view) => view.id)).toEqual(["view-1", "view-2"]);
    expect(updatedViews[0].id).toBe(firstView.id);
    expect(updatedViews[0].name).toBe(firstView.name);
    expect(updatedViews[0].config).toEqual(updatedConfig);
    expect(updatedViews[0].config).not.toBe(updatedConfig);
    expect(updatedViews[0].config.filters).not.toBe(updatedConfig.filters);
    expect(updatedViews[1]).toBe(secondView);

    updatedConfig.filters.region = "APAC";
    expect(updatedViews[0].config.filters.region).toBe("Europe");
  });

  it("compares complete configs for update dirty state", () => {
    const storedConfig = createWorkbenchViewConfig();
    const currentConfig = createWorkbenchViewConfig(storedConfig);

    expect(areWorkbenchViewConfigsEqual(currentConfig, storedConfig)).toBe(true);

    currentConfig.visibleColumns = currentConfig.visibleColumns.slice(0, -1);
    expect(areWorkbenchViewConfigsEqual(currentConfig, storedConfig)).toBe(
      false,
    );
  });

  it("retains custom selection after manual changes but clears predefined selection", () => {
    const customSelection = { type: "custom" as const, id: "view-1" };
    const predefinedSelection = {
      type: "predefined" as const,
      id: DEFAULT_SAVED_VIEW_ID,
    };

    expect(getSavedViewRefAfterManualChange(customSelection)).toBe(
      customSelection,
    );
    expect(getSavedViewRefAfterManualChange(predefinedSelection)).toBeNull();
    expect(getSavedViewRefAfterManualChange(null)).toBeNull();
  });

  it("marks only a dirty selected custom view as modified", () => {
    const customView = createCustomSavedView(
      "view-1",
      "Europe Daily",
      createWorkbenchViewConfig(),
    );

    expect(
      getSavedViewDisplayName(
        { type: "custom", id: customView.id },
        [customView],
        false,
      ),
    ).toBe("Europe Daily");
    expect(
      getSavedViewDisplayName(
        { type: "custom", id: customView.id },
        [customView],
        true,
      ),
    ).toBe("Europe Daily (modified)");
    expect(
      getSavedViewDisplayName(
        { type: "predefined", id: DEFAULT_SAVED_VIEW_ID },
        [customView],
        true,
      ),
    ).toBe("Default Overview");
    expect(getSavedViewDisplayName(null, [customView], true)).toBe(
      "Custom view",
    );
  });
});
