import type { WorkbenchFilters } from "@/domain/filters";
import type { AovScenarioProjection } from "@/domain/scenarios";
import {
  AOV_ADJUSTMENT_MAX,
  AOV_ADJUSTMENT_MIN,
  AOV_ADJUSTMENT_STEP,
} from "@/domain/scenarios";
import {
  formatCalendarDate,
  formatNumber,
  formatUsd,
} from "@/lib/formatters";

type ScenarioPanelProps = {
  activeViewName: string;
  adjustmentPercent: number;
  filters: WorkbenchFilters;
  orderCount: number;
  projection: AovScenarioProjection;
  onAdjustmentChange: (adjustmentPercent: number) => void;
};

function getFilterSummary(filters: WorkbenchFilters): string {
  const activeFilters = [
    filters.dateFrom
      ? `from ${formatCalendarDate(filters.dateFrom)}`
      : null,
    filters.dateTo ? `to ${formatCalendarDate(filters.dateTo)}` : null,
    filters.region,
    filters.category,
    filters.status,
  ].filter((value): value is string => value !== null);

  return activeFilters.length > 0 ? activeFilters.join(" · ") : "All records";
}

export function ScenarioPanel({
  activeViewName,
  adjustmentPercent,
  filters,
  orderCount,
  projection,
  onAdjustmentChange,
}: ScenarioPanelProps) {
  const isNeutral = Math.abs(projection.absoluteRevenueDelta) < 0.005;
  const isPositive = projection.absoluteRevenueDelta > 0;
  const deltaLabel = isNeutral
    ? "Neutral"
    : isPositive
      ? "Positive"
      : "Negative";
  const deltaStyles = isNeutral
    ? "bg-slate-100 text-slate-700"
    : isPositive
      ? "bg-emerald-50 text-emerald-800"
      : "bg-rose-50 text-rose-800";
  const signedAdjustment =
    adjustmentPercent > 0 ? `+${adjustmentPercent}%` : `${adjustmentPercent}%`;
  const signedDelta = isNeutral
    ? formatUsd(0)
    : `${isPositive ? "+" : "−"}${formatUsd(
        Math.abs(projection.absoluteRevenueDelta),
      )}`;
  const signedDeltaPercent = isNeutral
    ? "0.0%"
    : `${isPositive ? "+" : "−"}${Math.abs(
        projection.percentageRevenueDelta,
      ).toFixed(1)}%`;

  return (
    <section
      aria-labelledby="scenario-panel-title"
      className="rounded-xl border border-blue-200 bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
            Scenario Mode
          </p>
          <h2
            id="scenario-panel-title"
            className="mt-1 text-lg font-semibold text-slate-950"
          >
            Average Order Value adjustment
          </h2>
        </div>
        <div className="text-sm text-slate-600 lg:text-right">
          <p className="font-medium text-slate-800">{activeViewName}</p>
          <p>
            {getFilterSummary(filters)} · {formatNumber(orderCount)} orders
          </p>
        </div>
      </div>

      <div className="grid gap-5 py-5 lg:grid-cols-[minmax(16rem,1.2fr)_repeat(3,minmax(0,1fr))]">
        <div className="flex flex-col justify-center gap-3">
          <div className="flex items-center justify-between text-sm font-medium text-slate-700">
            <label htmlFor="aov-adjustment">AOV adjustment</label>
            <output className="rounded-md bg-blue-50 px-2 py-1 font-semibold text-blue-800">
              {signedAdjustment}
            </output>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Decrease AOV adjustment"
              disabled={adjustmentPercent <= AOV_ADJUSTMENT_MIN}
              className="size-8 shrink-0 rounded-md border border-slate-300 text-lg font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() =>
                onAdjustmentChange(adjustmentPercent - AOV_ADJUSTMENT_STEP)
              }
            >
              −
            </button>
            <input
              id="aov-adjustment"
              type="range"
              min={AOV_ADJUSTMENT_MIN}
              max={AOV_ADJUSTMENT_MAX}
              step={AOV_ADJUSTMENT_STEP}
              value={adjustmentPercent}
              onChange={(event) => onAdjustmentChange(Number(event.target.value))}
              className="w-full accent-blue-700"
            />
            <button
              type="button"
              aria-label="Increase AOV adjustment"
              disabled={adjustmentPercent >= AOV_ADJUSTMENT_MAX}
              className="size-8 shrink-0 rounded-md border border-slate-300 text-lg font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() =>
                onAdjustmentChange(adjustmentPercent + AOV_ADJUSTMENT_STEP)
              }
            >
              +
            </button>
          </div>
          <span className="flex justify-between text-xs text-slate-500">
            <span>{AOV_ADJUSTMENT_MIN}%</span>
            <span>{AOV_ADJUSTMENT_MAX > 0 ? "+" : ""}{AOV_ADJUSTMENT_MAX}%</span>
          </span>
        </div>

        <ScenarioMetric
          label="Average Order Value"
          baseline={formatUsd(projection.baselineAov)}
          projected={formatUsd(projection.projectedAov)}
        />
        <ScenarioMetric
          label="Revenue"
          baseline={formatUsd(projection.baselineRevenue)}
          projected={formatUsd(projection.projectedRevenue)}
        />
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Revenue delta
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-950">
            {signedDelta}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-semibold ${deltaStyles}`}
            >
              {deltaLabel}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {signedDeltaPercent}
            </span>
          </div>
        </div>
      </div>

      <p className="border-t border-slate-200 pt-4 text-xs text-slate-500">
        Temporary projection for the current filtered view. Baseline KPIs and
        source orders remain unchanged.
      </p>
    </section>
  );
}

type ScenarioMetricProps = {
  label: string;
  baseline: string;
  projected: string;
};

function ScenarioMetric({ label, baseline, projected }: ScenarioMetricProps) {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <dl className="mt-3 space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-xs text-slate-500">Baseline</dt>
          <dd className="text-sm font-medium text-slate-700">{baseline}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-xs text-slate-500">Projected</dt>
          <dd className="text-xl font-semibold text-blue-800">{projected}</dd>
        </div>
      </dl>
    </div>
  );
}
