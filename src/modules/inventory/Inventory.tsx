import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRightLeft,
  ClipboardList,
  Package,
  RefreshCcw,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getMaterialReservationDrafts,
  InventoryMaterialReservationListItem,
} from "@/api/productDevelopment";

const inventoryData = [
  {
    id: "RM-001",
    name: "Polyester Tape Base",
    category: "Raw Material",
    stock: 5400,
    unit: "m",
    status: "Stable",
  },
  {
    id: "CH-402",
    name: "Premium Cyan Ink",
    category: "Chemical",
    stock: 125,
    unit: "kg",
    status: "Low Stock",
  },
  {
    id: "HT-991",
    name: "Heat Transfer Film",
    category: "Raw Material",
    stock: 12400,
    unit: "sqm",
    status: "Stable",
  },
  {
    id: "LB-220",
    name: "Woven Label Yarn",
    category: "Raw Material",
    stock: 240,
    unit: "rolls",
    status: "In Review",
  },
];

const warehouses = [
  { name: "KEPZ Main Store", count: 1240, value: "$1.2M" },
  { name: "WIP Hold Area", count: 450, value: "$240k" },
  { name: "Finished Goods", count: 210, value: "$450k" },
  { name: "Scrap & Leftover", count: 85, value: "$12k" },
];

export function Inventory() {
  const [activeWarehouse, setActiveWarehouse] = useState("KEPZ Main Store");
  const [reservations, setReservations] = useState<
    InventoryMaterialReservationListItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadReservations() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const data = await getMaterialReservationDrafts();
      setReservations(data);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to load material reservations.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadReservations();
  }, []);

  const summary = useMemo(() => {
    const totalMaterialLines = reservations.reduce(
      (total, reservation) => total + reservation.materials.length,
      0,
    );

    const availableLines = reservations.reduce(
      (total, reservation) =>
        total +
        reservation.materials.filter(
          (material) => material.stockStatus === "Available",
        ).length,
      0,
    );

    const lowStockLines = reservations.reduce(
      (total, reservation) =>
        total +
        reservation.materials.filter(
          (material) => material.stockStatus === "Low Stock",
        ).length,
      0,
    );

    const shortageLines = reservations.reduce(
      (total, reservation) =>
        total +
        reservation.materials.filter(
          (material) => material.stockStatus === "Shortage",
        ).length,
      0,
    );

    return {
      reservationCount: reservations.length,
      totalMaterialLines,
      availableLines,
      lowStockLines,
      shortageLines,
    };
  }, [reservations]);

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventory & Warehouse
          </h1>
          <p className="text-slate-500">
            Manage stock, warehouse movement, and material reservation for
            production.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadReservations}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw
              className={cn("h-4 w-4", isLoading && "animate-spin")}
            />
            Refresh
          </button>

          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all">
            <ArrowRightLeft className="w-4 h-4" /> Internal Transfer
          </button>

          <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 shadow-md transition-all">
            <Package className="w-4 h-4" /> Stock Adjustment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Reservations"
          value={summary.reservationCount}
          badge="From Production"
        />

        <SummaryCard
          title="Material Lines"
          value={summary.totalMaterialLines}
          badge="Required"
          valueClassName="text-blue-700"
        />

        <SummaryCard
          title="Available Lines"
          value={summary.availableLines}
          badge="Reserved"
          valueClassName="text-emerald-700"
        />

        <SummaryCard
          title="Risk Lines"
          value={summary.lowStockLines + summary.shortageLines}
          badge="Check"
          valueClassName="text-amber-700"
        />
      </div>

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Inventory workflow error</p>
            <p className="mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          {warehouses.map((warehouse) => (
            <button
              key={warehouse.name}
              onClick={() => setActiveWarehouse(warehouse.name)}
              className={cn(
                "w-full rounded-2xl border p-4 text-left transition-all duration-300",
                activeWarehouse === warehouse.name
                  ? "scale-[1.02] border-accent bg-white shadow-md"
                  : "border-transparent bg-slate-50 hover:border-slate-200 hover:bg-white",
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <Warehouse
                  className={cn(
                    "h-5 w-5",
                    activeWarehouse === warehouse.name
                      ? "text-accent"
                      : "text-slate-400",
                  )}
                />
                <span className="text-[10px] font-bold text-slate-400">
                  {warehouse.count} SKUs
                </span>
              </div>

              <p className="font-bold text-slate-900">{warehouse.name}</p>

              <p className="mt-1 text-xs text-slate-500">
                Inventory value: {warehouse.value}
              </p>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="font-bold text-slate-900">
                Material Reservations
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Materials reserved against Production Orders.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {reservations.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                    <ClipboardList className="h-6 w-6" />
                  </div>

                  <h3 className="font-bold text-slate-900">
                    No material reservations yet
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    Go to Production and click Reserve Materials on a Production
                    Order.
                  </p>
                </div>
              ) : (
                reservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                  />
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-4">
              <h2 className="font-bold text-slate-900">
                Current Stock Snapshot
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Demo inventory stock visibility for {activeWarehouse}.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {inventoryData.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>

                    <p className="text-xs text-slate-500">
                      {item.id} • {item.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-black text-slate-900">
                        {item.stock.toLocaleString()} {item.unit}
                      </p>

                      <p className="text-xs text-slate-500">Current Stock</p>
                    </div>

                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReservationCard({
  reservation,
}: {
  reservation: InventoryMaterialReservationListItem;
}) {
  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-slate-900">
              {reservation.materialReservationNo}
            </h3>

            <StatusBadge status={reservation.status} />
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Production Order: {reservation.productionOrderNo} • Sales Order:{" "}
            {reservation.salesOrderNo}
          </p>

          <p className="mt-1 text-[10px] font-bold text-emerald-600">
            {reservation.customer} • {reservation.productType} • Qty{" "}
            {reservation.orderQuantity.toLocaleString()}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 px-4 py-3 text-xs">
          <p className="font-bold text-slate-500">Reserved By</p>

          <p className="mt-1 font-black text-slate-900">
            {reservation.reservedBy}
          </p>
        </div>
      </div>

      {reservation.notes && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
          {reservation.notes}
        </div>
      )}

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-4 py-3">Material</th>
              <th className="px-4 py-3">Specification</th>
              <th className="px-4 py-3 text-right">Required</th>
              <th className="px-4 py-3 text-right">Reserved</th>
              <th className="px-4 py-3 text-center">Stock</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {reservation.materials.map((material) => (
              <tr key={material.id}>
                <td className="px-4 py-3">
                  <p className="font-bold text-slate-900">
                    {material.materialName}
                  </p>

                  <p className="text-[10px] text-slate-400">
                    {material.materialCode}
                  </p>
                </td>

                <td className="px-4 py-3 text-slate-500">
                  {material.specification}
                </td>

                <td className="px-4 py-3 text-right font-bold text-slate-700">
                  {material.requiredQuantity.toLocaleString()} {material.unit}
                </td>

                <td className="px-4 py-3 text-right font-bold text-slate-700">
                  {material.reservedQuantity.toLocaleString()} {material.unit}
                </td>

                <td className="px-4 py-3 text-center">
                  <StatusBadge status={material.stockStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  badge,
  valueClassName,
}: {
  title: string;
  value: string | number;
  badge: string;
  valueClassName?: string;
}) {
  return (
    <div className="glass-panel rounded-2xl border border-slate-200 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <div className="mt-3 flex items-end justify-between">
        <p className={cn("text-3xl font-black text-slate-900", valueClassName)}>
          {value}
        </p>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {badge}
        </span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded-full border px-3 py-1 text-[10px] font-bold",
        status === "Reserved" || status === "Available" || status === "Stable"
          ? "border-emerald-100 bg-emerald-50 text-emerald-600"
          : status === "Low Stock" ||
              status === "Partially Reserved" ||
              status === "In Review"
            ? "border-amber-100 bg-amber-50 text-amber-600"
            : status === "Shortage"
              ? "border-red-100 bg-red-50 text-red-600"
              : "border-slate-200 bg-slate-50 text-slate-600",
      )}
    >
      {status}
    </span>
  );
}
