"use client";

import { useState } from "react";

import {
  getSavedViewNameError,
  SAVED_VIEWS,
  type ActiveSavedViewRef,
  type CustomSavedView,
} from "@/domain/saved-views";

type SavedViewActionsProps = {
  activeSavedView: ActiveSavedViewRef;
  customSavedViews: readonly CustomSavedView[];
  isLoaded?: boolean;
  onSave: (name: string) => void;
  onDelete: (id: string) => void;
};

export function SavedViewActions({
  activeSavedView,
  customSavedViews,
  isLoaded = true,
  onSave,
  onDelete,
}: SavedViewActionsProps) {
  const [isSaveFormOpen, setIsSaveFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const activeCustomView =
    activeSavedView?.type === "custom"
      ? customSavedViews.find((view) => view.id === activeSavedView.id) ?? null
      : null;

  function closeSaveForm() {
    setIsSaveFormOpen(false);
    setName("");
    setNameError(null);
  }

  function handleSave() {
    const error = getSavedViewNameError(name, [
      ...SAVED_VIEWS.map((view) => view.name),
      ...customSavedViews.map((view) => view.name),
    ]);

    if (error) {
      setNameError(error);
      return;
    }

    onSave(name);
    closeSaveForm();
  }

  if (isSaveFormOpen) {
    return (
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          <span>View name</span>
          <input
            type="text"
            autoFocus
            aria-invalid={nameError ? true : undefined}
            aria-describedby={nameError ? "saved-view-name-error" : undefined}
            className="h-10 min-w-56 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setNameError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSave();
              }
              if (event.key === "Escape") {
                closeSaveForm();
              }
            }}
          />
          {nameError ? (
            <span id="saved-view-name-error" className="text-red-700">
              {nameError}
            </span>
          ) : null}
        </label>
        <button
          type="button"
          className="h-10 rounded-lg bg-blue-700 px-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          type="button"
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          onClick={closeSaveForm}
        >
          Cancel
        </button>
      </div>
    );
  }

  if (isDeleteConfirmationOpen && activeCustomView) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="max-w-52 text-slate-700">
          Delete “{activeCustomView.name}”?
        </span>
        <button
          type="button"
          className="h-10 rounded-lg border border-red-700 bg-white px-3 font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700"
          onClick={() => {
            onDelete(activeCustomView.id);
            setIsDeleteConfirmationOpen(false);
          }}
        >
          Delete
        </button>
        <button
          type="button"
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          onClick={() => setIsDeleteConfirmationOpen(false)}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={!isLoaded}
        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={() => setIsSaveFormOpen(true)}
      >
        Save current view
      </button>
      {activeCustomView ? (
        <button
          type="button"
          disabled={!isLoaded}
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setIsDeleteConfirmationOpen(true)}
        >
          Delete view
        </button>
      ) : null}
    </div>
  );
}
