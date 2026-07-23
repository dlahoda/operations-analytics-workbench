"use client";

import { useState } from "react";

import type { WorkbenchFilters } from "@/domain/filters";
import type { Category, OrderStatus, Region } from "@/domain/orders";
import {
  DEFAULT_SAVED_VIEW_ID,
  getSavedView,
  type SavedViewId,
} from "@/domain/saved-views";
import {
  createWorkbenchViewConfig,
  type WorkbenchSort,
  type WorkbenchViewConfig,
} from "@/domain/workbench-view-config";

export function useWorkbenchViewState() {
  const [viewConfig, setViewConfig] = useState<WorkbenchViewConfig>(() =>
    createWorkbenchViewConfig(getSavedView(DEFAULT_SAVED_VIEW_ID).config),
  );
  const [activeSavedViewId, setActiveSavedViewId] =
    useState<SavedViewId | null>(DEFAULT_SAVED_VIEW_ID);

  const hasActiveFilters = Object.values(viewConfig.filters).some(
    (filterValue) => filterValue !== null,
  );
  const activeViewName =
    activeSavedViewId === null
      ? "Custom view"
      : getSavedView(activeSavedViewId).name;

  function applySavedView(savedViewId: SavedViewId) {
    const savedView = getSavedView(savedViewId);
    setViewConfig(createWorkbenchViewConfig(savedView.config));
    setActiveSavedViewId(savedViewId);
  }

  function updateFilter<Key extends keyof WorkbenchFilters>(
    key: Key,
    value: WorkbenchFilters[Key],
  ) {
    setViewConfig((current) => ({
      ...current,
      filters: { ...current.filters, [key]: value },
    }));
    setActiveSavedViewId(null);
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
    setActiveSavedViewId(null);
  }

  function resetView() {
    setViewConfig(
      createWorkbenchViewConfig(getSavedView(DEFAULT_SAVED_VIEW_ID).config),
    );
    setActiveSavedViewId(DEFAULT_SAVED_VIEW_ID);
  }

  return {
    viewConfig,
    filters: viewConfig.filters,
    activeSavedViewId,
    activeViewName,
    hasActiveFilters,
    applySavedView,
    updateDateFrom,
    updateDateTo,
    updateRegion,
    updateCategory,
    updateStatus,
    updateSorting,
    resetView,
  };
}
