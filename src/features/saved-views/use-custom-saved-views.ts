"use client";

import { useEffect, useState } from "react";

import {
  CUSTOM_SAVED_VIEWS_STORAGE_KEY,
  parseCustomSavedViews,
  serializeCustomSavedViews,
} from "@/domain/custom-saved-views-storage";
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
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    queueMicrotask(() => {
      if (isCancelled) {
        return;
      }

      try {
        const storedViews = localStorage.getItem(CUSTOM_SAVED_VIEWS_STORAGE_KEY);
        setCustomSavedViews(
          storedViews === null ? [] : parseCustomSavedViews(storedViews),
        );
      } catch {
        setCustomSavedViews([]);
      } finally {
        setIsLoaded(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    try {
      localStorage.setItem(
        CUSTOM_SAVED_VIEWS_STORAGE_KEY,
        serializeCustomSavedViews(customSavedViews),
      );
    } catch {
      // Storage failures must not interrupt the active workbench session.
    }
  }, [customSavedViews, isLoaded]);

  function saveCustomView(
    name: string,
    config: WorkbenchViewConfig,
  ): CustomSavedView {
    if (!isLoaded) {
      throw new Error("Custom saved views have not finished loading.");
    }

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
    if (!isLoaded) {
      return;
    }

    setCustomSavedViews((current) =>
      current.filter((savedView) => savedView.id !== id),
    );
  }

  return {
    customSavedViews,
    isLoaded,
    saveCustomView,
    deleteCustomView,
  };
}
