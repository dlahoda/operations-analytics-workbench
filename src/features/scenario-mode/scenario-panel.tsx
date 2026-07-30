import type { WorkbenchFilters } from "@/domain/filters";
import {
  SCENARIO_ADJUSTMENT_CONSTRAINTS,
  type ScenarioProjection,
  type ScenarioState,
  type ScenarioType,
} from "@/domain/scenarios";
import {
  formatCalendarDate,
  formatNumber,
  formatPercentage,
  formatUsd,
} from "@/lib/formatters";

type ScenarioPanelProps = {
  activeViewName: string;
  filters: WorkbenchFilters;
  orderCount: number;
  projection: ScenarioProjection;
  scenario: ScenarioState;
  onAdjustmentChange: (adjustment: number) => void;
  onScenarioTypeChange: (type: ScenarioType) => void;
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
  filters,
  orderCount,
  projection,
  scenario,
  onAdjustmentChange,
  onScenarioTypeChange,
}: ScenarioPanelProps) {
  const presentation = getScenarioPresentation(projection);
  const constraints = SCENARIO_ADJUSTMENT_CONSTRAINTS[scenario.type];
  const isNeutral = Math.abs(presentation.absoluteDelta) < 0.005;
  const isPositive = presentation.absoluteDelta > 0;
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
  const adjustmentUnit = scenario.type === "average-order-value" ? "%" : " pp";
  const signedAdjustment = `${scenario.adjustment > 0 ? "+" : ""}${
    scenario.adjustment
  }${adjustmentUnit}`;
  const signedDelta = isNeutral
    ? formatUsd(0)
    : `${isPositive ? "+" : "−"}${formatUsd(
        Math.abs(presentation.absoluteDelta),
      )}`;
  const signedDeltaPercent = isNeutral
    ? "0.0%"
    : `${isPositive ? "+" : "−"}${Math.abs(
        presentation.percentageDelta,
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
            {presentation.title}
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
        <div className="flex flex-col justify-center gap-4">
          <div>
            <label
              htmlFor="scenario-type"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Scenario type
            </label>
            <select
              id="scenario-type"
              value={scenario.type}
              onChange={(event) =>
                onScenarioTypeChange(event.target.value as ScenarioType)
              }
              className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="average-order-value">Average Order Value</option>
              <option value="gross-margin">Gross Margin</option>
            </select>
          </div>

          <div className="flex items-center justify-between text-sm font-medium text-slate-700">
            <label htmlFor="scenario-adjustment">
              {presentation.adjustmentLabel}
            </label>
            <output className="rounded-md bg-blue-50 px-2 py-1 font-semibold text-blue-800">
              {signedAdjustment}
            </output>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={`Decrease ${presentation.adjustmentLabel.toLowerCase()}`}
              disabled={scenario.adjustment <= constraints.min}
              className="size-8 shrink-0 rounded-md border border-slate-300 text-lg font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() =>
                onAdjustmentChange(scenario.adjustment - constraints.step)
              }
            >
              −
            </button>
            <input
              id="scenario-adjustment"
              type="range"
              min={constraints.min}
              max={constraints.max}
              step={constraints.step}
              value={scenario.adjustment}
              onChange={(event) =>
                onAdjustmentChange(Number(event.target.value))
              }
              className="w-full accent-blue-700"
            />
            <button
              type="button"
              aria-label={`Increase ${presentation.adjustmentLabel.toLowerCase()}`}
              disabled={scenario.adjustment >= constraints.max}
              className="size-8 shrink-0 rounded-md border border-slate-300 text-lg font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              onClick={() =>
                onAdjustmentChange(scenario.adjustment + constraints.step)
              }
            >
              +
            </button>
          </div>
          <span className="flex justify-between text-xs text-slate-500">
            <span>
              {constraints.min}
              {adjustmentUnit}
            </span>
            <span>
              +{constraints.max}
              {adjustmentUnit}
            </span>
          </span>
        </div>

        <ScenarioMetric
          label={presentation.primaryMetricLabel}
          baseline={presentation.primaryBaseline}
          projected={presentation.primaryProjected}
        />
        <ScenarioMetric
          label={presentation.secondaryMetricLabel}
          baseline={presentation.secondaryBaseline}
          projected={presentation.secondaryProjected}
        />
        <div className="rounded-lg border border-slate-200 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {presentation.deltaMetricLabel}
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
        Temporary projection for the active filtered and searched view.
        Baseline KPIs and source orders remain unchanged.
      </p>
    </section>
  );
}

type ScenarioPresentation = {
  title: string;
  adjustmentLabel: string;
  primaryMetricLabel: string;
  primaryBaseline: string;
  primaryProjected: string;
  secondaryMetricLabel: string;
  secondaryBaseline: string;
  secondaryProjected: string;
  deltaMetricLabel: string;
  absoluteDelta: number;
  percentageDelta: number;
};

function getScenarioPresentation(
  projection: ScenarioProjection,
): ScenarioPresentation {
  if (projection.type === "average-order-value") {
    return {
      title: "Average Order Value adjustment",
      adjustmentLabel: "AOV adjustment",
      primaryMetricLabel: "Average Order Value",
      primaryBaseline: formatUsd(projection.baselineAov),
      primaryProjected: formatUsd(projection.projectedAov),
      secondaryMetricLabel: "Revenue",
      secondaryBaseline: formatUsd(projection.baselineRevenue),
      secondaryProjected: formatUsd(projection.projectedRevenue),
      deltaMetricLabel: "Revenue delta",
      absoluteDelta: projection.absoluteRevenueDelta,
      percentageDelta: projection.percentageRevenueDelta,
    };
  }

  return {
    title: "Gross Margin adjustment",
    adjustmentLabel: "Margin adjustment",
    primaryMetricLabel: "Margin Percentage",
    primaryBaseline: formatPercentage(projection.baselineMarginPercentage),
    primaryProjected: formatPercentage(projection.projectedMarginPercentage),
    secondaryMetricLabel: "Gross Margin",
    secondaryBaseline: formatUsd(projection.baselineGrossMargin),
    secondaryProjected: formatUsd(projection.projectedGrossMargin),
    deltaMetricLabel: "Gross Margin delta",
    absoluteDelta: projection.absoluteGrossMarginDelta,
    percentageDelta: projection.percentageGrossMarginDelta,
  };
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
