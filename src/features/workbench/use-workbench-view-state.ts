"use client";

import { useState } from "react";

import {
  DEFAULT_WORKBENCH_FILTERS,
  type WorkbenchFilters,
} from "@/domain/filters";
import type { Category, OrderStatus, Region } from "@/domain/orders";
import {
  DEFAULT_SAVED_VIEW_ID,
  getSavedView,
  type SavedViewId,
} from "@/domain/saved-views";

export function useWorkbenchViewState() {
  const [filters, setFilters] = useState<WorkbenchFilters>({
    ...DEFAULT_WORKBENCH_FILTERS,
  });
  const [activeSavedViewId, setActiveSavedViewId] =
    useState<SavedViewId | null>(DEFAULT_SAVED_VIEW_ID);

  const hasActiveFilters = Object.values(filters).some(
    (filterValue) => filterValue !== null,
  );
  const activeViewName =
    activeSavedViewId === null
      ? "Custom view"
      : getSavedView(activeSavedViewId).name;

  function applySavedView(savedViewId: SavedViewId) {
    const savedView = getSavedView(savedViewId);
    setFilters({ ...savedView.filters });
    setActiveSavedViewId(savedViewId);
  }

  function updateFilter<Key extends keyof WorkbenchFilters>(
    key: Key,
    value: WorkbenchFilters[Key],
  ) {
    setFilters((current) => ({ ...current, [key]: value }));
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

  function resetFilters() {
    setFilters({ ...DEFAULT_WORKBENCH_FILTERS });
    setActiveSavedViewId(DEFAULT_SAVED_VIEW_ID);
  }

  return {
    filters,
    activeSavedViewId,
    activeViewName,
    hasActiveFilters,
    applySavedView,
    updateDateFrom,
    updateDateTo,
    updateRegion,
    updateCategory,
    updateStatus,
    resetFilters,
  };
}
