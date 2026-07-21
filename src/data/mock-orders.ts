import {
  CATEGORIES,
  REGIONS,
  type Category,
  type Order,
  type OrderStatus,
  type Region,
} from "@/domain/orders";

export const MOCK_ORDER_COUNT = 2_500;

export const DATASET_PATTERN_RATES = {
  baselineRefundRate: 0.04,
  apparelRefundRate: 0.12,
  europeElectronicsRefundRate: 0.1,
  baselineFulfillmentIssueRate: 0.06,
  apacFulfillmentIssueRate: 0.18,
  accessoriesVolumeMultiplier: 1.8,
  europeElectronicsAovMultiplier: 1.4,
  accessoriesAovRange: [35, 60] as const,
} as const;

const CATEGORY_WEIGHTS: Record<Category, number> = {
  Apparel: 1,
  Electronics: 1,
  Home: 1,
  Accessories: DATASET_PATTERN_RATES.accessoriesVolumeMultiplier,
};

const CATEGORY_AOV_RANGES: Record<Category, readonly [number, number]> = {
  Apparel: [55, 180],
  Electronics: [120, 650],
  Home: [80, 420],
  Accessories: DATASET_PATTERN_RATES.accessoriesAovRange,
};

const SUBCATEGORIES: Record<Category, readonly string[]> = {
  Apparel: ["Outerwear", "Shirts", "Footwear", "Activewear"],
  Electronics: ["Computers", "Audio", "Mobile", "Displays"],
  Home: ["Furniture", "Kitchen", "Decor", "Lighting"],
  Accessories: ["Bags", "Cases", "Cables", "Wearables"],
};

const COUNTRIES: Record<Region, readonly string[]> = {
  "North America": ["United States", "Canada", "Mexico"],
  Europe: ["Germany", "France", "United Kingdom", "Spain"],
  APAC: ["Japan", "Australia", "Singapore", "South Korea"],
  "Latin America": ["Brazil", "Argentina", "Chile", "Colombia"],
};

function createRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function pick<T>(values: readonly T[], random: () => number): T {
  return values[Math.floor(random() * values.length)];
}

function pickCategory(random: () => number): Category {
  const totalWeight = CATEGORIES.reduce(
    (sum, category) => sum + CATEGORY_WEIGHTS[category],
    0,
  );
  let cursor = random() * totalWeight;

  for (const category of CATEGORIES) {
    cursor -= CATEGORY_WEIGHTS[category];
    if (cursor < 0) {
      return category;
    }
  }

  return CATEGORIES[CATEGORIES.length - 1];
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

function resolveStatus(region: Region, random: () => number): OrderStatus {
  const issueRate =
    region === "APAC"
      ? DATASET_PATTERN_RATES.apacFulfillmentIssueRate
      : DATASET_PATTERN_RATES.baselineFulfillmentIssueRate;
  const roll = random();

  if (roll < issueRate / 2) return "Cancelled";
  if (roll < issueRate) return "Delayed";
  if (roll < issueRate + 0.13) return "Processing";
  if (roll < issueRate + 0.35) return "Shipped";
  return "Completed";
}

function deterministicScore(order: Order, salt: number): number {
  const orderNumber = Number(order.orderId.slice(4));
  let value = Math.imul(orderNumber ^ salt, 2_654_435_761) >>> 0;
  value = Math.imul(value ^ (value >>> 16), 2_246_822_519) >>> 0;
  return value / 4_294_967_296;
}

function applyAovAnomaly(orders: Order[]): Order[] {
  const europeElectronics = orders.filter(
    (order) => order.region === "Europe" && order.category === "Electronics",
  );
  const otherElectronics = orders.filter(
    (order) => order.region !== "Europe" && order.category === "Electronics",
  );
  const average = (records: Order[]) =>
    records.reduce((sum, order) => sum + order.orderValue, 0) / records.length;
  const correctionFactor =
    (average(otherElectronics) *
      DATASET_PATTERN_RATES.europeElectronicsAovMultiplier) /
    average(europeElectronics);

  return orders.map((order) => {
    if (order.region !== "Europe" || order.category !== "Electronics") {
      return order;
    }

    const orderValue = roundMoney(order.orderValue * correctionFactor);
    const cost = roundMoney(order.cost * correctionFactor);

    return {
      ...order,
      revenue: orderValue,
      orderValue,
      cost,
      margin: roundMoney(orderValue - cost),
    };
  });
}

function applyRefundPatterns(orders: Order[]): Order[] {
  const refundedOrderIds = new Set<string>();
  const segments = [
    {
      matches: (order: Order) =>
        order.region === "Europe" && order.category === "Electronics",
      rate: DATASET_PATTERN_RATES.europeElectronicsRefundRate,
      salt: 11,
    },
    {
      matches: (order: Order) => order.category === "Apparel",
      rate: DATASET_PATTERN_RATES.apparelRefundRate,
      salt: 23,
    },
    {
      matches: (order: Order) =>
        order.category !== "Apparel" &&
        !(order.region === "Europe" && order.category === "Electronics"),
      rate: DATASET_PATTERN_RATES.baselineRefundRate,
      salt: 37,
    },
  ];

  for (const segment of segments) {
    const candidates = orders
      .filter(segment.matches)
      .sort(
        (left, right) =>
          deterministicScore(left, segment.salt) -
          deterministicScore(right, segment.salt),
      );
    const targetCount = Math.round(candidates.length * segment.rate);

    for (const order of candidates.slice(0, targetCount)) {
      refundedOrderIds.add(order.orderId);
    }
  }

  return orders.map((order) => {
    if (!refundedOrderIds.has(order.orderId)) {
      return order;
    }

    const refundFraction = 0.55 + deterministicScore(order, 53) * 0.45;
    return {
      ...order,
      refundAmount: roundMoney(order.orderValue * refundFraction),
      refundStatus: "Refunded",
    };
  });
}

export function generateMockOrders(
  count = MOCK_ORDER_COUNT,
  seed = 20_260_721,
): Order[] {
  const random = createRandom(seed);
  const startDate = Date.UTC(2025, 6, 1);
  const dateSpanInDays = 365;

  const orders = Array.from({ length: count }, (_, index): Order => {
    const region = pick(REGIONS, random);
    const category = pickCategory(random);
    const [minimumAov, maximumAov] = CATEGORY_AOV_RANGES[category];
    const orderValue = roundMoney(
      minimumAov + random() * (maximumAov - minimumAov),
    );
    const cost = roundMoney(orderValue * (0.54 + random() * 0.2));
    const orderDateValue = new Date(
      startDate + Math.floor(random() * dateSpanInDays) * 86_400_000,
    );
    const updatedAtValue = new Date(
      orderDateValue.getTime() + (1 + Math.floor(random() * 8)) * 86_400_000,
    );

    return {
      orderId: `ORD-${String(index + 100_001).padStart(6, "0")}`,
      orderDate: orderDateValue.toISOString().slice(0, 10),
      region,
      country: pick(COUNTRIES[region], random),
      category,
      subcategory: pick(SUBCATEGORIES[category], random),
      status: resolveStatus(region, random),
      customerSegment: pick(
        ["Consumer", "Small Business", "Enterprise"] as const,
        random,
      ),
      channel: pick(["Online", "Retail", "Marketplace"] as const, random),
      revenue: orderValue,
      orderValue,
      refundAmount: 0,
      refundStatus: "None",
      cost,
      margin: roundMoney(orderValue - cost),
      units: 1 + Math.floor(random() * 6),
      paymentMethod: pick(
        ["Card", "Bank Transfer", "Digital Wallet"] as const,
        random,
      ),
      createdAt: orderDateValue.toISOString(),
      updatedAt: updatedAtValue.toISOString(),
    };
  });

  return applyRefundPatterns(applyAovAnomaly(orders));
}

export const mockOrders = generateMockOrders();
