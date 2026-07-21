export const REGIONS = [
  "North America",
  "Europe",
  "APAC",
  "Latin America",
] as const;

export const CATEGORIES = [
  "Apparel",
  "Electronics",
  "Home",
  "Accessories",
] as const;

export const ORDER_STATUSES = [
  "Completed",
  "Processing",
  "Shipped",
  "Delayed",
  "Cancelled",
] as const;

export type Region = (typeof REGIONS)[number];
export type Category = (typeof CATEGORIES)[number];
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type RefundStatus = "None" | "Refunded";

export type Order = {
  orderId: string;
  orderDate: string;
  region: Region;
  country: string;
  category: Category;
  subcategory: string;
  status: OrderStatus;
  customerSegment: "Consumer" | "Small Business" | "Enterprise";
  channel: "Online" | "Retail" | "Marketplace";
  revenue: number;
  orderValue: number;
  refundAmount: number;
  refundStatus: RefundStatus;
  cost: number;
  margin: number;
  units: number;
  paymentMethod: "Card" | "Bank Transfer" | "Digital Wallet";
  createdAt: string;
  updatedAt: string;
};
