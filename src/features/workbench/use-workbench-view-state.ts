"use client";

import { useState } from "react";

import type { WorkbenchFilters } from "@/domain/filters";
import type { Category, OrderStatus, Region } from "@/domain/orders";
import {
  DEFAULT_SAVED_VIEW_ID,
  getSavedView,
  type ActiveSavedViewRef,
  type CustomSavedView,
  type SavedViewId,
} from "@/domain/saved-views";
import {
  createWorkbenchViewConfig,
  type OrderColumnId,
  type WorkbenchSort,
  type WorkbenchViewConfig,
} from "@/domain/workbench-view-config";
import { useCustomSavedViews } from "@/features/saved-views/use-custom-saved-views";

export function useWorkbenchViewState() {
  const { customSavedViews, saveCustomView, deleteCustomView } =
    useCustomSavedViews();
  const [viewConfig, setViewConfig] = useState<WorkbenchViewConfig>(() =>
    createWorkbenchViewConfig(getSavedView(DEFAULT_SAVED_VIEW_ID).config),
  );
  const [activeSavedView, setActiveSavedView] =
    useState<ActiveSavedViewRef>({
      type: "predefined",
      id: DEFAULT_SAVED_VIEW_ID,
    });

  const hasActiveFilters = Object.values(viewConfig.filters).some(
    (filterValue) => filterValue !== null,
  );
  const activeViewName = getActiveViewName(
    activeSavedView,
    customSavedViews,
  );

  function applyPredefinedView(savedViewId: SavedViewId) {
    const savedView = getSavedView(savedViewId);
    setViewConfig(createWorkbenchViewConfig(savedView.config));
    setActiveSavedView({ type: "predefined", id: savedViewId });
  }

  function applyCustomView(savedViewId: string) {
    const savedView = customSavedViews.find(
      (customView) => customView.id === savedViewId,
    );

    if (!savedView) {
      return;
    }

    setViewConfig(createWorkbenchViewConfig(savedView.config));
    setActiveSavedView({ type: "custom", id: savedView.id });
  }

  function saveCurrentView(name: string) {
    const savedView = saveCustomView(name, viewConfig);
    setActiveSavedView({ type: "custom", id: savedView.id });
  }

  function deleteSavedCustomView(savedViewId: string) {
    deleteCustomView(savedViewId);
    setActiveSavedView((current) =>
      current?.type === "custom" && current.id === savedViewId ? null : current,
    );
  }

  function updateFilter<Key extends keyof WorkbenchFilters>(
    key: Key,
    value: WorkbenchFilters[Key],
  ) {
    setViewConfig((current) => ({
      ...current,
      filters: { ...current.filters, [key]: value },
    }));
    setActiveSavedView(null);
  }

  function updateDateFrom(dateFrom: string | null) {
    updateFilter("dateFrom", dateFrom);
  }

  function updateDateTo(dateTo: string | null) {
    updateFilter("dateTo", dateTo);
  }

  function updateRegion(region: Region | null) {
    updateFilter("region", region);
  }

  function updateCategory(category: Category | null) {
    updateFilter("category", category);
  }

  function updateStatus(status: OrderStatus | null) {
    updateFilter("status", status);
  }

  function updateSorting(sorting: WorkbenchSort[]) {
    setViewConfig((current) => ({
      ...current,
      sorting: sorting.map((sort) => ({ ...sort })),
    }));
    setActiveSavedView(null);
  }

  function updateSearchQuery(searchQuery: string) {
    setViewConfig((current) => ({ ...current, searchQuery }));
    setActiveSavedView(null);
  }

  function updateVisibleColumns(visibleColumns: OrderColumnId[]) {
    setViewConfig((current) => ({
      ...current,
      visibleColumns: [...visibleColumns],
    }));
    setActiveSavedView(null);
  }

  function resetView() {
    setViewConfig(
      createWorkbenchViewConfig(getSavedView(DEFAULT_SAVED_VIEW_ID).config),
    );
    setActiveSavedView({ type: "predefined", id: DEFAULT_SAVED_VIEW_ID });
  }

  return {
    viewConfig,
    filters: viewConfig.filters,
    activeSavedView,
    activeViewName,
    customSavedViews,
    hasActiveFilters,
    applyPredefinedView,
    applyCustomView,
    saveCurrentView,
    deleteSavedCustomView,
    updateDateFrom,
    updateDateTo,
    updateRegion,
    updateCategory,
    updateStatus,
    updateSearchQuery,
    updateSorting,
    updateVisibleColumns,
    resetView,
  };
}

function getActiveViewName(
  activeSavedView: ActiveSavedViewRef,
  customSavedViews: readonly CustomSavedView[],
): string {
  if (activeSavedView === null) {
    return "Custom view";
  }

  if (activeSavedView.type === "predefined") {
    return getSavedView(activeSavedView.id).name;
  }

  return (
    customSavedViews.find((savedView) => savedView.id === activeSavedView.id)
      ?.name ?? "Custom view"
  );
}
