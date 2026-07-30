import {
  SAVED_VIEWS,
  type ActiveSavedViewRef,
  type CustomSavedView,
  type SavedViewId,
} from "@/domain/saved-views";

type SavedViewSwitcherProps = {
  activeSavedView: ActiveSavedViewRef;
  customSavedViews: readonly CustomSavedView[];
  isActiveCustomViewDirty: boolean;
  onPredefinedViewChange: (savedViewId: SavedViewId) => void;
  onCustomViewChange: (savedViewId: string) => void;
};

export function SavedViewSwitcher({
  activeSavedView,
  customSavedViews,
  isActiveCustomViewDirty,
  onPredefinedViewChange,
  onCustomViewChange,
}: SavedViewSwitcherProps) {
  const selectedValue = activeSavedView
    ? `${activeSavedView.type}:${activeSavedView.id}`
    : "unsaved";

  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
      <span>Saved view</span>
      <select
        aria-label="Active saved view"
        className="h-10 min-w-56 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        value={selectedValue}
        onChange={(event) => {
          const [type, id] = event.target.value.split(":", 2);
          if (type === "predefined") {
            onPredefinedViewChange(id as SavedViewId);
          } else if (type === "custom") {
            onCustomViewChange(id);
          }
        }}
      >
        {activeSavedView === null ? (
          <option value="unsaved" disabled>
            Custom view
          </option>
        ) : null}
        <optgroup label="Predefined views">
          {SAVED_VIEWS.map((savedView) => (
            <option
              key={savedView.id}
              value={`predefined:${savedView.id}`}
            >
              {savedView.name}
            </option>
          ))}
        </optgroup>
        {customSavedViews.length > 0 ? (
          <optgroup label="Custom views">
            {customSavedViews.map((savedView) => (
              <option key={savedView.id} value={`custom:${savedView.id}`}>
                {savedView.name}
                {activeSavedView?.type === "custom" &&
                activeSavedView.id === savedView.id &&
                isActiveCustomViewDirty
                  ? " (modified)"
                  : ""}
              </option>
            ))}
          </optgroup>
        ) : null}
      </select>
    </label>
  );
}
