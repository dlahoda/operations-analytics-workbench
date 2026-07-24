import { describe, expect, it } from "vitest";

import type { OrderMetrics } from "./metrics";
import {
  calculateAovScenario,
  calculateGrossMarginScenario,
  calculateScenarioProjection,
  changeScenarioType,
  createScenarioState,
  DEFAULT_SCENARIO_STATE,
  SCENARIO_ADJUSTMENT_CONSTRAINTS,
  type ScenarioState,
} from "./scenarios";

const BASELINE_METRICS: OrderMetrics = {
  revenue: 1_000,
  orders: 10,
  refundAmount: 50,
  refundRate: 0.1,
  averageOrderValue: 100,
  grossMargin: 200,
  marginPercentage: 0.2,
  openOrders: 2,
  cancelledOrders: 1,
};

describe("Average Order Value scenario", () => {
  it("returns baseline values for a neutral adjustment", () => {
    const projection = calculateAovScenario(BASELINE_METRICS, 0);

    expect(projection).toMatchObject({
      type: "average-order-value",
      projectedAov: 100,
      projectedRevenue: 1_000,
      absoluteRevenueDelta: 0,
      percentageRevenueDelta: 0,
    });
  });

  it("projects a positive adjustment", () => {
    const projection = calculateAovScenario(BASELINE_METRICS, 10);

    expect(projection.projectedAov).toBeCloseTo(110);
    expect(projection.projectedRevenue).toBeCloseTo(1_100);
    expect(projection.absoluteRevenueDelta).toBeCloseTo(100);
    expect(projection.percentageRevenueDelta).toBeCloseTo(10);
  });

  it("projects a negative adjustment", () => {
    const projection = calculateAovScenario(BASELINE_METRICS, -10);

    expect(projection.projectedAov).toBeCloseTo(90);
    expect(projection.projectedRevenue).toBeCloseTo(900);
    expect(projection.absoluteRevenueDelta).toBeCloseTo(-100);
    expect(projection.percentageRevenueDelta).toBeCloseTo(-10);
  });

  it("handles zero revenue safely", () => {
    const projection = calculateAovScenario(
      {
        averageOrderValue: 0,
        orders: 0,
        revenue: 0,
      },
      10,
    );

    expect(projection.projectedRevenue).toBe(0);
    expect(projection.percentageRevenueDelta).toBe(0);
  });

  it("does not mutate input metrics", () => {
    const metrics = { ...BASELINE_METRICS };
    const original = { ...metrics };

    calculateAovScenario(metrics, 5);

    expect(metrics).toEqual(original);
  });
});

describe("Gross Margin scenario", () => {
  it("returns baseline values for a neutral adjustment", () => {
    const projection = calculateGrossMarginScenario(BASELINE_METRICS, 0);

    expect(projection).toMatchObject({
      type: "gross-margin",
      projectedMarginPercentage: 0.2,
      projectedGrossMargin: 200,
      absoluteGrossMarginDelta: 0,
      percentageGrossMarginDelta: 0,
    });
  });

  it("projects a positive percentage-point adjustment", () => {
    const projection = calculateGrossMarginScenario(BASELINE_METRICS, 5);

    expect(projection.projectedMarginPercentage).toBeCloseTo(0.25);
    expect(projection.projectedGrossMargin).toBeCloseTo(250);
    expect(projection.absoluteGrossMarginDelta).toBeCloseTo(50);
    expect(projection.percentageGrossMarginDelta).toBeCloseTo(25);
  });

  it("projects a negative percentage-point adjustment", () => {
    const projection = calculateGrossMarginScenario(BASELINE_METRICS, -5);

    expect(projection.projectedMarginPercentage).toBeCloseTo(0.15);
    expect(projection.projectedGrossMargin).toBeCloseTo(150);
    expect(projection.absoluteGrossMarginDelta).toBeCloseTo(-50);
    expect(projection.percentageGrossMarginDelta).toBeCloseTo(-25);
  });

  it("handles zero baseline gross margin safely", () => {
    const projection = calculateGrossMarginScenario(
      {
        revenue: 1_000,
        grossMargin: 0,
        marginPercentage: 0,
      },
      5,
    );

    expect(projection.projectedGrossMargin).toBeCloseTo(50);
    expect(projection.absoluteGrossMarginDelta).toBeCloseTo(50);
    expect(projection.percentageGrossMarginDelta).toBe(0);
  });

  it("allows a negative projected margin", () => {
    const projection = calculateGrossMarginScenario(
      {
        revenue: 1_000,
        grossMargin: 20,
        marginPercentage: 0.02,
      },
      -5,
    );

    expect(projection.projectedMarginPercentage).toBeCloseTo(-0.03);
    expect(projection.projectedGrossMargin).toBeCloseTo(-30);
  });

  it("does not mutate input metrics", () => {
    const metrics = { ...BASELINE_METRICS };
    const original = { ...metrics };

    calculateGrossMarginScenario(metrics, 5);

    expect(metrics).toEqual(original);
  });
});

describe("scenario state", () => {
  it("defaults to a neutral Average Order Value scenario", () => {
    expect(DEFAULT_SCENARIO_STATE).toEqual({
      type: "average-order-value",
      adjustment: 0,
    });
    expect(createScenarioState()).toEqual(DEFAULT_SCENARIO_STATE);
  });

  it("resets the adjustment when switching from AOV to margin", () => {
    const state: ScenarioState = {
      type: "average-order-value",
      adjustment: 7,
    };

    expect(changeScenarioType("gross-margin")).toEqual({
      type: "gross-margin",
      adjustment: 0,
    });
    expect(state.adjustment).toBe(7);
  });

  it("resets the adjustment when switching from margin to AOV", () => {
    const state: ScenarioState = {
      type: "gross-margin",
      adjustment: -3,
    };

    expect(changeScenarioType("average-order-value")).toEqual({
      type: "average-order-value",
      adjustment: 0,
    });
    expect(state.adjustment).toBe(-3);
  });

  it("exposes the supported adjustment bounds", () => {
    expect(SCENARIO_ADJUSTMENT_CONSTRAINTS).toMatchObject({
      "average-order-value": { min: -10, max: 10, step: 1, neutral: 0 },
      "gross-margin": { min: -5, max: 5, step: 1, neutral: 0 },
    });
  });

  it("returns projections that narrow by scenario type", () => {
    const states: ScenarioState[] = [
      { type: "average-order-value", adjustment: 1 },
      { type: "gross-margin", adjustment: 1 },
    ];

    for (const state of states) {
      const projection = calculateScenarioProjection(BASELINE_METRICS, state);

      if (projection.type === "average-order-value") {
        expect(projection.projectedAov).toBeCloseTo(101);
      } else {
        expect(projection.projectedMarginPercentage).toBeCloseTo(0.21);
      }
    }
  });
});
