"use client";

import { useState } from "react";

import type { WorkbenchFilters } from "@/domain/filters";
import type { Category, OrderStatus, Region } from "@/domain/orders";
import {
  DEFAULT_SAVED_VIEW_ID,
  getSavedView,
  getSavedViewDisplayName,
  getSavedViewRefAfterManualChange,
  type ActiveSavedViewRef,
  type SavedViewId,
} from "@/domain/saved-views";
import {
  areWorkbenchViewConfigsEqual,
  createWorkbenchViewConfig,
  type OrderColumnId,
  type WorkbenchSort,
  type WorkbenchViewConfig,
} from "@/domain/workbench-view-config";
import { useCustomSavedViews } from "@/features/saved-views/use-custom-saved-views";

export function useWorkbenchViewState() {
  const {
    customSavedViews,
    isLoaded: areCustomSavedViewsLoaded,
    saveCustomView,
    deleteCustomView,
    renameCustomView,
    updateCustomView,
  } = useCustomSavedViews();
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
  const activeCustomView =
    activeSavedView?.type === "custom"
      ? customSavedViews.find((view) => view.id === activeSavedView.id) ?? null
      : null;
  const isActiveCustomViewDirty =
    activeCustomView !== null &&
    !areWorkbenchViewConfigsEqual(viewConfig, activeCustomView.config);
  const activeViewName = getSavedViewDisplayName(
    activeSavedView,
    customSavedViews,
    isActiveCustomViewDirty,
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

  function renameSavedCustomView(savedViewId: string, name: string) {
    renameCustomView(savedViewId, name);
  }

  function updateSavedCustomView(savedViewId: string) {
    updateCustomView(savedViewId, viewConfig);
  }

  function updateFilter<Key extends keyof WorkbenchFilters>(
    key: Key,
    value: WorkbenchFilters[Key],
  ) {
    setViewConfig((current) => ({
      ...current,
      filters: { ...current.filters, [key]: value },
    }));
    setActiveSavedView(getSavedViewRefAfterManualChange);
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
    setActiveSavedView(getSavedViewRefAfterManualChange);
  }

  function updateSearchQuery(searchQuery: string) {
    setViewConfig((current) => ({ ...current, searchQuery }));
    setActiveSavedView(getSavedViewRefAfterManualChange);
  }

  function updateVisibleColumns(visibleColumns: OrderColumnId[]) {
    setViewConfig((current) => ({
      ...current,
      visibleColumns: [...visibleColumns],
    }));
    setActiveSavedView(getSavedViewRefAfterManualChange);
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
    isActiveCustomViewDirty,
    areCustomSavedViewsLoaded,
    hasActiveFilters,
    applyPredefinedView,
    applyCustomView,
    saveCurrentView,
    deleteSavedCustomView,
    renameSavedCustomView,
    updateSavedCustomView,
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
