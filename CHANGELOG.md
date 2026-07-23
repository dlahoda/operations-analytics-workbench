# Changelog

## Unreleased

### Added

- Initial Next.js application.
- Project documentation structure.
- Product design and architecture documentation.
- Visual prototype references.
- Added coordinated Region and Category filters with visible active-filter state
  and reset behavior.
- Added Refund Rate and Average Order Value KPI cards, plus safe empty-results
  and filtered-table pagination behavior.
- Added coordinated Status filtering and an Orders by Status chart derived from
  the same active filtered dataset as the KPI cards and orders table.
- Added inclusive From and To date filtering with dataset-derived input bounds,
  visible validation, active-filter labels, and shared reset behavior.
- Added a Revenue over Time chart with continuous monthly aggregation, coordinated
  through the same active filtered dataset as KPIs, Orders by Status, and the table.
- Added predefined saved views that replace the complete filter state, show custom
  state after manual filter changes, and reset to Default Overview.
- Added accessible mouse and keyboard order selection with selected-row styling and
  a responsive detail drawer containing order data and an activity timeline.
- Added a temporary Average Order Value Scenario Mode for the active filtered view,
  with baseline-to-projected revenue impact and immutable source data.
