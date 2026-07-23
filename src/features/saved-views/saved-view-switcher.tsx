import {
  SAVED_VIEWS,
  type SavedViewId,
} from "@/domain/saved-views";

type SavedViewSwitcherProps = {
  activeSavedViewId: SavedViewId | null;
  onChange: (savedViewId: SavedViewId) => void;
};

export function SavedViewSwitcher({
  activeSavedViewId,
  onChange,
}: SavedViewSwitcherProps) {
  return (
    <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
      <span>Saved view</span>
      <select
        aria-label="Active saved view"
        className="h-10 min-w-56 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        value={activeSavedViewId ?? "custom"}
        onChange={(event) => onChange(event.target.value as SavedViewId)}
      >
        {activeSavedViewId === null ? (
          <option value="custom" disabled>
            Custom view
          </option>
        ) : null}
        {SAVED_VIEWS.map((savedView) => (
          <option key={savedView.id} value={savedView.id}>
            {savedView.name}
          </option>
        ))}
      </select>
    </label>
  );
}
