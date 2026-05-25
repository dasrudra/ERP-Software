import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Factory,
  PackageCheck,
  RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createMaterialReservation,
  getProductionOrderDrafts,
  ProductionOrderListItem,
} from "@/api/productDevelopment";

export function Production() {
  const [productionOrders, setProductionOrders] = useState<
    ProductionOrderListItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadProductionOrders() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const orders = await getProductionOrderDrafts();
      setProductionOrders(orders);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to load production orders.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProductionOrders();
  }, []);

  const summary = useMemo(() => {
    const totalQuantity = productionOrders.reduce(
      (total, order) => total + order.orderQuantity,
      0,
    );

    const draftCount = productionOrders.filter(
      (order) => order.status === "Draft",
    ).length;

    const plannedCount = productionOrders.filter(
      (order) => order.status === "Planned",
    ).length;

    const reservedCount = productionOrders.filter(
      (order) =>
        order.materialReservationStatus === "Reserved" ||
        order.materialReservationStatus === "Partially Reserved",
    ).length;

    return {
      totalOrders: productionOrders.length,
      draftCount,
      plannedCount,
      reservedCount,
      totalQuantity,
    };
  }, [productionOrders]);

  async function handleReserveMaterials(order: ProductionOrderListItem) {
    try {
      setActiveActionId(`reserve-${order.requestId}`);
      setErrorMessage(null);
      setSuccessMessage(null);

      const reservation = await createMaterialReservation(order.requestId, {
        reservedBy: "Inventory Planning",
        notes: `Materials reserved for ${order.productionOrderNo}.`,
      });

      setSuccessMessage(
        `${reservation.materialReservationNo} created for ${order.productionOrderNo}.`,
      );

      await loadProductionOrders();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to reserve materials.",
      );
    } finally {
      setActiveActionId(null);
    }
  }

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Production Control
          </h1>
          <p className="text-slate-500">
            Plan production orders, reserve materials, and prepare shop floor
            execution.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadProductionOrders}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw
              className={cn("w-4 h-4", isLoading && "animate-spin")}
            />
            Refresh
          </button>

          <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-md">
            <BarChart3 className="w-4 h-4" /> Capacity Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Production Orders"
          value={summary.totalOrders}
          badge="From SO"
        />

        <SummaryCard
          title="Draft Orders"
          value={summary.draftCount}
          badge="Planning"
          valueClassName="text-blue-700"
        />

        <SummaryCard
          title="Planned Orders"
          value={summary.plannedCount}
          badge="Ready"
          valueClassName="text-emerald-700"
        />

        <SummaryCard
          title="Reserved"
          value={summary.reservedCount}
          badge="Inventory"
          valueClassName="text-indigo-700"
        />
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
          <CheckCircle2 className="h-5 w-5" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Production workflow error</p>
            <p className="mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 glass-panel p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-slate-900 mb-2">
            Planning Summary
          </h3>

          <p className="text-xs text-slate-500 mb-6">
            Sales Orders released from Commercial are converted into Production
            Orders. Materials should be reserved before shop floor execution.
          </p>

          <div className="space-y-4">
            <InfoBox
              label="Total Quantity"
              value={summary.totalQuantity.toLocaleString()}
            />
            <InfoBox label="Planning Queue" value={`${summary.draftCount}`} />
            <InfoBox
              label="Reserved Orders"
              value={`${summary.reservedCount}`}
            />
          </div>

          <div className="mt-8 rounded-2xl bg-slate-900 p-5 text-white">
            <Factory className="mb-4 h-8 w-8 text-white/70" />
            <h4 className="font-bold">Next Flow</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              After material reservation, the next step will issue reserved raw
              materials from Inventory to Production.
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Production Orders from Sales
            </h3>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Planning Queue
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {productionOrders.length === 0 ? (
              <div className="glass-panel rounded-2xl border border-slate-200 p-10 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
                  <ClipboardList className="h-6 w-6" />
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  No production orders yet
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Release a Sales Order from Sales & Commercial to create a
                  Production Order draft here.
                </p>
              </div>
            ) : (
              productionOrders.map((order) => (
                <ProductionOrderCard
                  key={order.id}
                  order={order}
                  activeActionId={activeActionId}
                  onReserveMaterials={handleReserveMaterials}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductionOrderCard({
  order,
  activeActionId,
  onReserveMaterials,
}: {
  order: ProductionOrderListItem;
  activeActionId: string | null;
  onReserveMaterials: (order: ProductionOrderListItem) => void;
}) {
  const canReserve =
    (order.status === "Draft" || order.status === "Planned") &&
    order.materialReservationStatus !== "Reserved" &&
    order.materialReservationStatus !== "Partially Reserved";

  return (
    <div className="glass-panel rounded-2xl border-l-[6px] border-l-emerald-400 p-6 hover:shadow-lg transition-all">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <PackageCheck className="h-6 w-6" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-bold text-slate-900">
                {order.productionOrderNo}
              </h4>

              <StatusBadge status={order.status} />

              <StatusBadge
                status={order.materialReservationStatus || "Not Started"}
              />
            </div>

            <p className="mt-0.5 text-xs text-slate-500">
              SO: {order.salesOrderNo} • {order.customer}
            </p>

            <p className="mt-1 text-[10px] font-bold text-emerald-600">
              {order.requestId} • {order.productType} • Qty{" "}
              {order.orderQuantity.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3 xl:min-w-[420px]">
          <MiniInfo label="Work Center" value={order.workCenter} />

          <MiniInfo
            label="Start Date"
            value={order.plannedStartDate || "Not planned"}
          />

          <MiniInfo
            label="Reservation"
            value={order.materialReservationNo || "Not reserved"}
          />
        </div>
      </div>

      {order.notes && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
          {order.notes}
        </div>
      )}

      <div className="mt-5 flex justify-end">
        <button
          onClick={() => onReserveMaterials(order)}
          disabled={
            !canReserve || activeActionId === `reserve-${order.requestId}`
          }
          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {activeActionId === `reserve-${order.requestId}`
            ? "Reserving..."
            : "Reserve Materials"}
        </button>
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

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function MiniInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-bold text-slate-800">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
        status === "Reserved" ||
          status === "Partially Reserved" ||
          status === "Planned"
          ? "bg-emerald-50 text-emerald-600"
          : status === "Draft"
            ? "bg-amber-50 text-amber-600"
            : status === "Shortage" || status === "Cancelled"
              ? "bg-red-50 text-red-600"
              : "bg-slate-50 text-slate-500",
      )}
    >
      {status}
    </span>
  );
}
