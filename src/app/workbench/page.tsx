import { mockOrders } from "@/data/mock-orders";
import { WorkbenchClient } from "@/features/workbench/workbench-client";

export default function WorkbenchPage() {
  return <WorkbenchClient initialOrders={mockOrders} />;
}
