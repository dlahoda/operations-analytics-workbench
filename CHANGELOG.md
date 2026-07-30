# Changelog

## Unreleased

### Added

- Added a Refund Rate by Category chart with canonical category coverage,
  percentage labels, order-count tooltips, and safe zero-value handling.
- Added focused refund-rate-by-category domain tests for calculations, category
  ordering, empty states, and input immutability.
- Added case-insensitive search across useful order fields, coordinated with
  filters across KPIs, charts, Scenario Mode, and the orders table.
- Added basic order-table column visibility with Order ID permanently visible.
- Added named custom saved views for the complete active workbench
  configuration.
- Added custom saved-view application and confirmed deletion while preserving
  unsaved workbench state.
- Added versioned, validated browser persistence for custom saved views.
- Added persistence-boundary tests for custom-view cloning, names, payload
  validation, and unsupported values.
- Added a Gross Margin percentage-point scenario with baseline and projected
  margin impact.
- Added selectable Scenario Mode with one active Average Order Value or Gross
  Margin adjustment.
- Added scenario projection and state-transition tests for neutral, positive,
  negative, zero-baseline, and immutability behavior.
- Added custom saved-view rename and confirmed overwrite actions with
  case-insensitive name validation and defensive config cloning.
- Added focused rename, overwrite, config equality, and persistence round-trip
  tests.

### Changed

- Replaced the status-distribution chart with a category refund-pressure view
  derived from the same filtered and searched orders as the Refund Rate KPI and
  table.
- Centralized filters, search, sorting, and visible columns in a serializable
  workbench view configuration restored by predefined saved views and reset.
- Retained custom saved-view source identity through unsaved workbench changes
  so the source can be renamed or updated while the active label remains
  “Custom view.”

## [0.0.0] - 2026-07-23

### Changed

- Extracted filter and saved-view coordination from the workbench client into a
  focused view-state hook without changing visible behavior.
- Updated project documentation to describe the completed `v0.0.0` prototype
  and removed completed work from the backlog.

### Added

- Initial Next.js application.
- Project documentation structure.
- Product design and architecture documentation.
- Visual prototype references.
- Added coordinated Region and Category filters with visible active-filter state
  and reset behavior.
- Added Refund Rate and Average Order Value KPI cards, plus safe empty-results
  and filtered-table pagination behavior.
- Added coordinated Status filtering derived from the same active filtered
  dataset as the KPI cards, charts, and orders table.
- Added inclusive From and To date filtering with dataset-derived input bounds,
  visible validation, active-filter labels, and shared reset behavior.
- Added a Revenue over Time chart with continuous monthly aggregation,
  coordinated through the same active filtered dataset as KPIs, charts, and the
  table.
- Added predefined saved views that replace the complete filter state, show custom
  state after manual filter changes, and reset to Default Overview.
- Added accessible mouse and keyboard order selection with selected-row styling and
  a responsive detail drawer containing order data and an activity timeline.
- Added a temporary Average Order Value Scenario Mode for the active filtered view,
  with baseline-to-projected revenue impact and immutable source data.
