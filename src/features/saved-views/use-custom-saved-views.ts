"use client";

import { useState } from "react";

import {
  createCustomSavedView,
  SAVED_VIEWS,
  type CustomSavedView,
} from "@/domain/saved-views";
import type { WorkbenchViewConfig } from "@/domain/workbench-view-config";

export function useCustomSavedViews() {
  const [customSavedViews, setCustomSavedViews] = useState<CustomSavedView[]>(
    [],
  );

  function saveCustomView(
    name: string,
    config: WorkbenchViewConfig,
  ): CustomSavedView {
    const savedView = createCustomSavedView(
      crypto.randomUUID(),
      name,
      config,
      [
        ...SAVED_VIEWS.map((view) => view.name),
        ...customSavedViews.map((view) => view.name),
      ],
    );

    setCustomSavedViews((current) => [...current, savedView]);
    return savedView;
  }

  function deleteCustomView(id: string) {
    setCustomSavedViews((current) =>
      current.filter((savedView) => savedView.id !== id),
    );
  }

  return {
    customSavedViews,
    saveCustomView,
    deleteCustomView,
  };
}
