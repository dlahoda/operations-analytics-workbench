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
    adjustment: 0,
  };
}

export function changeScenarioAdjustment(
  state: Readonly<ScenarioState>,
  adjustment: number,
): ScenarioState {
  return {
    type: state.type,
    adjustment,
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

export function calculateScenarioProjection(
  baseline: Readonly<OrderMetrics>,
  scenario: Readonly<ScenarioState>,
): ScenarioProjection {
  if (scenario.type === "average-order-value") {
    return calculateAovScenario(baseline, scenario.adjustment);
  }

  throw new Error("Gross Margin scenario projection is not implemented.");
}
