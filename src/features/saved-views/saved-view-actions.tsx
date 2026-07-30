"use client";

import { useState } from "react";

import {
  getCustomSavedViewNameError,
  getSavedViewNameError,
  SAVED_VIEWS,
  type CustomSavedView,
} from "@/domain/saved-views";

type SavedViewActionsProps = {
  customSourceViewId: string | null;
  customSavedViews: readonly CustomSavedView[];
  canUpdate: boolean;
  isLoaded?: boolean;
  onSave: (name: string) => void;
  onRename: (id: string, name: string) => void;
  onUpdate: (id: string) => void;
  onDelete: (id: string) => void;
};

export function SavedViewActions({
  customSourceViewId,
  customSavedViews,
  canUpdate,
  isLoaded = true,
  onSave,
  onRename,
  onUpdate,
  onDelete,
}: SavedViewActionsProps) {
  const [isSaveFormOpen, setIsSaveFormOpen] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [saveNameError, setSaveNameError] = useState<string | null>(null);
  const [isRenameFormOpen, setIsRenameFormOpen] = useState(false);
  const [renameName, setRenameName] = useState("");
  const [renameNameError, setRenameNameError] = useState<string | null>(null);
  const [isUpdateConfirmationOpen, setIsUpdateConfirmationOpen] =
    useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const customSourceView =
    customSavedViews.find((view) => view.id === customSourceViewId) ?? null;
  const activeCustomView = customSourceView;

  function closeSaveForm() {
    setIsSaveFormOpen(false);
    setSaveName("");
    setSaveNameError(null);
  }

  function handleSave() {
    const error = getSavedViewNameError(saveName, [
      ...SAVED_VIEWS.map((view) => view.name),
      ...customSavedViews.map((view) => view.name),
    ]);

    if (error) {
      setSaveNameError(error);
      return;
    }

    onSave(saveName);
    closeSaveForm();
  }

  function closeRenameForm() {
    setIsRenameFormOpen(false);
    setRenameName("");
    setRenameNameError(null);
  }

  function handleRename() {
    if (!customSourceView) {
      return;
    }

    const error = getCustomSavedViewNameError(
      renameName,
      customSavedViews,
      customSourceView.id,
    );

    if (error) {
      setRenameNameError(error);
      return;
    }

    onRename(customSourceView.id, renameName);
    closeRenameForm();
  }

  if (isSaveFormOpen) {
    return (
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          <span>View name</span>
          <input
            type="text"
            autoFocus
            aria-invalid={saveNameError ? true : undefined}
            aria-describedby={
              saveNameError ? "saved-view-name-error" : undefined
            }
            className="h-10 min-w-56 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            value={saveName}
            onChange={(event) => {
              setSaveName(event.target.value);
              setSaveNameError(null);
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
          {saveNameError ? (
            <span id="saved-view-name-error" className="text-red-700">
              {saveNameError}
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

  if (isRenameFormOpen && customSourceView) {
    return (
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 text-xs font-medium text-slate-600">
          <span>View name</span>
          <input
            type="text"
            autoFocus
            aria-invalid={renameNameError ? true : undefined}
            aria-describedby={
              renameNameError ? "renamed-view-name-error" : undefined
            }
            className="h-10 min-w-56 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            value={renameName}
            onChange={(event) => {
              setRenameName(event.target.value);
              setRenameNameError(null);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleRename();
              }
              if (event.key === "Escape") {
                closeRenameForm();
              }
            }}
          />
          {renameNameError ? (
            <span id="renamed-view-name-error" className="text-red-700">
              {renameNameError}
            </span>
          ) : null}
        </label>
        <button
          type="button"
          className="h-10 rounded-lg bg-blue-700 px-3 text-sm font-semibold text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          onClick={handleRename}
        >
          Rename
        </button>
        <button
          type="button"
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          onClick={closeRenameForm}
        >
          Cancel
        </button>
      </div>
    );
  }

  if (isUpdateConfirmationOpen && customSourceView) {
    return (
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="max-w-64 text-slate-700">
          Overwrite &ldquo;{customSourceView.name}&rdquo; with the current view?
        </span>
        <button
          type="button"
          className="h-10 rounded-lg border border-blue-700 bg-white px-3 font-semibold text-blue-700 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700"
          onClick={() => {
            onUpdate(customSourceView.id);
            setIsUpdateConfirmationOpen(false);
          }}
        >
          Update
        </button>
        <button
          type="button"
          className="h-10 rounded-lg border border-slate-300 bg-white px-3 font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          onClick={() => setIsUpdateConfirmationOpen(false)}
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
      {customSourceView ? (
        <>
          <button
            type="button"
            disabled={!isLoaded}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => {
              setRenameName(customSourceView.name);
              setIsRenameFormOpen(true);
            }}
          >
            Rename
          </button>
          <button
            type="button"
            disabled={!isLoaded || !canUpdate}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setIsUpdateConfirmationOpen(true)}
          >
            Update
          </button>
          <button
            type="button"
            disabled={!isLoaded}
            className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-red-700 shadow-sm transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setIsDeleteConfirmationOpen(true)}
          >
            Delete view
          </button>
        </>
      ) : null}
    </div>
  );
}
