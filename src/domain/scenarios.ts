import type { OrderMetrics } from "./metrics";

export const SCENARIO_TYPES = [
  "average-order-value",
  "gross-margin",
] as const;

export type ScenarioType = (typeof SCENARIO_TYPES)[number];

export type ScenarioState = {
  type: ScenarioType;
  adjustment: number;
};

export type ScenarioAdjustmentConstraints = {
  min: number;
  max: number;
  step: number;
  neutral: number;
};

export const AOV_ADJUSTMENT_MIN = -10;
export const AOV_ADJUSTMENT_MAX = 10;
export const AOV_ADJUSTMENT_STEP = 1;
export const DEFAULT_AOV_ADJUSTMENT = 0;
export const GROSS_MARGIN_ADJUSTMENT_MIN = -5;
export const GROSS_MARGIN_ADJUSTMENT_MAX = 5;
export const GROSS_MARGIN_ADJUSTMENT_STEP = 1;
export const DEFAULT_GROSS_MARGIN_ADJUSTMENT = 0;

export const SCENARIO_ADJUSTMENT_CONSTRAINTS: Readonly<
  Record<ScenarioType, ScenarioAdjustmentConstraints>
> = {
  "average-order-value": {
    min: AOV_ADJUSTMENT_MIN,
    max: AOV_ADJUSTMENT_MAX,
    step: AOV_ADJUSTMENT_STEP,
    neutral: DEFAULT_AOV_ADJUSTMENT,
  },
  "gross-margin": {
    min: GROSS_MARGIN_ADJUSTMENT_MIN,
    max: GROSS_MARGIN_ADJUSTMENT_MAX,
    step: GROSS_MARGIN_ADJUSTMENT_STEP,
    neutral: DEFAULT_GROSS_MARGIN_ADJUSTMENT,
  },
};

export type AovScenarioProjection = {
  type: "average-order-value";
  adjustmentPercent: number;
  baselineAov: number;
  projectedAov: number;
  baselineRevenue: number;
  projectedRevenue: number;
  absoluteRevenueDelta: number;
  percentageRevenueDelta: number;
};

export type GrossMarginScenarioProjection = {
  type: "gross-margin";
  adjustmentPercentagePoints: number;
  baselineMarginPercentage: number;
  projectedMarginPercentage: number;
  baselineGrossMargin: number;
  projectedGrossMargin: number;
  absoluteGrossMarginDelta: number;
  percentageGrossMarginDelta: number;
};

export type ScenarioProjection =
  | AovScenarioProjection
  | GrossMarginScenarioProjection;

type AovScenarioBaseline = Pick<
  OrderMetrics,
  "averageOrderValue" | "orders" | "revenue"
>;

type GrossMarginScenarioBaseline = Pick<
  OrderMetrics,
  "revenue" | "grossMargin" | "marginPercentage"
>;

export const DEFAULT_SCENARIO_STATE: Readonly<ScenarioState> = {
  type: "average-order-value",
  adjustment: DEFAULT_AOV_ADJUSTMENT,
};

export function createScenarioState(
  state: ScenarioState = DEFAULT_SCENARIO_STATE,
): ScenarioState {
  return {
    type: state.type,
    adjustment: state.adjustment,
  };
}

export function changeScenarioType(type: ScenarioType): ScenarioState {
  return {
    type,
    adjustment: SCENARIO_ADJUSTMENT_CONSTRAINTS[type].neutral,
  };
}

export function changeScenarioAdjustment(
  state: Readonly<ScenarioState>,
  adjustment: number,
): ScenarioState {
  const constraints = SCENARIO_ADJUSTMENT_CONSTRAINTS[state.type];

  return {
    type: state.type,
    adjustment: Math.min(
      constraints.max,
      Math.max(constraints.min, adjustment),
    ),
  };
}

export function calculateAovScenario(
  baseline: Readonly<AovScenarioBaseline>,
  adjustmentPercent: number,
): AovScenarioProjection {
  const projectedAov =
    baseline.averageOrderValue * (1 + adjustmentPercent / 100);
  const projectedRevenue = projectedAov * baseline.orders;
  const absoluteRevenueDelta = projectedRevenue - baseline.revenue;

  return {
    type: "average-order-value",
    adjustmentPercent,
    baselineAov: baseline.averageOrderValue,
    projectedAov,
    baselineRevenue: baseline.revenue,
    projectedRevenue,
    absoluteRevenueDelta,
    percentageRevenueDelta:
      baseline.revenue === 0
        ? 0
        : (absoluteRevenueDelta / baseline.revenue) * 100,
  };
}

export function calculateGrossMarginScenario(
  baseline: Readonly<GrossMarginScenarioBaseline>,
  adjustmentPercentagePoints: number,
): GrossMarginScenarioProjection {
  const projectedMarginPercentage =
    baseline.marginPercentage + adjustmentPercentagePoints / 100;
  const projectedGrossMargin =
    baseline.revenue * projectedMarginPercentage;
  const absoluteGrossMarginDelta =
    projectedGrossMargin - baseline.grossMargin;

  return {
    type: "gross-margin",
    adjustmentPercentagePoints,
    baselineMarginPercentage: baseline.marginPercentage,
    projectedMarginPercentage,
    baselineGrossMargin: baseline.grossMargin,
    projectedGrossMargin,
    absoluteGrossMarginDelta,
    percentageGrossMarginDelta:
      baseline.grossMargin === 0
        ? 0
        : (absoluteGrossMarginDelta / baseline.grossMargin) * 100,
  };
}

export function calculateScenarioProjection(
  baseline: Readonly<OrderMetrics>,
  scenario: Readonly<ScenarioState>,
): ScenarioProjection {
  if (scenario.type === "average-order-value") {
    return calculateAovScenario(baseline, scenario.adjustment);
  }

  return calculateGrossMarginScenario(baseline, scenario.adjustment);
}
