import type { OrderMetrics } from "./metrics";

export const AOV_ADJUSTMENT_MIN = -10;
export const AOV_ADJUSTMENT_MAX = 10;
export const AOV_ADJUSTMENT_STEP = 1;
export const DEFAULT_AOV_ADJUSTMENT = 0;

export type AovScenarioProjection = {
  adjustmentPercent: number;
  baselineAov: number;
  projectedAov: number;
  baselineRevenue: number;
  projectedRevenue: number;
  absoluteRevenueDelta: number;
  percentageRevenueDelta: number;
};

type AovScenarioBaseline = Pick<
  OrderMetrics,
  "averageOrderValue" | "orders" | "revenue"
>;

export function calculateAovScenario(
  baseline: Readonly<AovScenarioBaseline>,
  adjustmentPercent: number,
): AovScenarioProjection {
  const projectedAov =
    baseline.averageOrderValue * (1 + adjustmentPercent / 100);
  const projectedRevenue = projectedAov * baseline.orders;
  const absoluteRevenueDelta = projectedRevenue - baseline.revenue;

  return {
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
