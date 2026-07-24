import {
  cloneCustomSavedView,
  isCustomSavedView,
  SAVED_VIEWS,
  type CustomSavedView,
} from "./saved-views";

export const CUSTOM_SAVED_VIEWS_STORAGE_KEY =
  "operations-analytics-workbench.custom-saved-views.v1";
export const CUSTOM_SAVED_VIEWS_STORAGE_VERSION = 1;

export type CustomSavedViewsStoragePayload = {
  version: typeof CUSTOM_SAVED_VIEWS_STORAGE_VERSION;
  views: CustomSavedView[];
};

export function serializeCustomSavedViews(
  views: readonly CustomSavedView[],
): string {
  const payload: CustomSavedViewsStoragePayload = {
    version: CUSTOM_SAVED_VIEWS_STORAGE_VERSION,
    views: views.map(cloneCustomSavedView),
  };

  return JSON.stringify(payload);
}

export function parseCustomSavedViews(serialized: string): CustomSavedView[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(serialized);
  } catch {
    return [];
  }

  if (typeof parsed !== "object" || parsed === null) {
    return [];
  }

  const payload = parsed as Record<string, unknown>;
  if (
    payload.version !== CUSTOM_SAVED_VIEWS_STORAGE_VERSION ||
    !Array.isArray(payload.views)
  ) {
    return [];
  }

  const customSavedViews: CustomSavedView[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set(
    SAVED_VIEWS.map((savedView) => savedView.name.toLocaleLowerCase()),
  );

  for (const candidate of payload.views) {
    if (!isCustomSavedView(candidate)) {
      continue;
    }

    const normalizedId = candidate.id.trim();
    if (seenIds.has(normalizedId)) {
      continue;
    }

    const comparableName = candidate.name.toLocaleLowerCase();
    if (seenNames.has(comparableName)) {
      continue;
    }

    seenIds.add(normalizedId);
    seenNames.add(comparableName);
    customSavedViews.push(cloneCustomSavedView(candidate));
  }

  return customSavedViews;
}
