import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRightLeft,
  CheckCircle2,
  ClipboardList,
  History,
  Layers,
  MoreVertical,
  Package,
  PackageCheck,
  RefreshCcw,
  Warehouse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getFinishedGoodsTransfers,
  getMaterialIssueDrafts,
  getMaterialReservationDrafts,
  InventoryFinishedGoodsListItem,
  InventoryMaterialIssueListItem,
  InventoryMaterialReservationListItem,
  issueMaterialReservation,
} from "@/api/productDevelopment";

const inventoryData = [
  {
    id: "RM-001",
    name: "Polyester Tape Base",
    category: "Raw Material",
    stock: 5400,
    unit: "m",
    status: "Stable",
    logo: "RM",
  },
  {
    id: "CH-402",
    name: "Premium Cyan Ink (Water-based)",
    category: "Chemical",
    stock: 125,
    unit: "kg",
    status: "Low Stock",
    logo: "CH",
  },
  {
    id: "HT-991",
    name: "Heat Transfer Film (Hot Peel)",
    category: "Raw Material",
    stock: 12400,
    unit: "sqm",
    status: "Stable",
    logo: "RM",
  },
  {
    id: "LB-220",
    name: "Woven Label Yarn - White",
    category: "Raw Material",
    stock: 240,
    unit: "rolls",
    status: "In Review",
    logo: "RM",
  },
];

const warehouses = [
  { name: "KEPZ Main Store", count: 1240, value: "$1.2M", active: true },
  { name: "WIP Hold Area", count: 450, value: "$240k", active: false },
  {
    name: "Finished Goods Warehouse",
    count: 210,
    value: "$450k",
    active: false,
  },
  { name: "Scrap & Leftover", count: 85, value: "$12k", active: false },
];

export function Inventory() {
  const [activeWarehouse, setActiveWarehouse] = useState("KEPZ Main Store");
  const [materialReservations, setMaterialReservations] = useState<
    InventoryMaterialReservationListItem[]
  >([]);
  const [materialIssues, setMaterialIssues] = useState<
    InventoryMaterialIssueListItem[]
  >([]);
  const [finishedGoods, setFinishedGoods] = useState<
    InventoryFinishedGoodsListItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadInventoryWorkflowData() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const [reservations, issues, finishedGoodsTransfers] = await Promise.all([
        getMaterialReservationDrafts(),
        getMaterialIssueDrafts(),
        getFinishedGoodsTransfers(),
      ]);

      setMaterialReservations(reservations);
      setMaterialIssues(issues);
      setFinishedGoods(finishedGoodsTransfers);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to load inventory workflow data.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadInventoryWorkflowData();
  }, []);

  const summary = useMemo(() => {
    const reservedCount = materialReservations.filter(
      (reservation) =>
        reservation.status === "Reserved" ||
        reservation.status === "Partially Reserved",
    ).length;

    const issuedCount = materialIssues.filter(
      (issue) => issue.status === "Issued",
    ).length;

    const finishedGoodsQuantity = finishedGoods.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    return {
      reservations: materialReservations.length,
      reservedCount,
      issuedCount,
      finishedGoodsCount: finishedGoods.length,
      finishedGoodsQuantity,
    };
  }, [materialReservations, materialIssues, finishedGoods]);

  async function handleIssueMaterials(
    reservation: InventoryMaterialReservationListItem,
  ) {
    try {
      setActiveActionId(`issue-${reservation.requestId}`);
      setSuccessMessage(null);
      setErrorMessage(null);

      const issue = await issueMaterialReservation(reservation.requestId, {
        issuedBy: "Inventory Officer",
        issueDate: new Date().toISOString(),
        notes: `Materials issued from ${reservation.materialReservationNo}.`,
      });

      setSuccessMessage(
        `${issue.materialIssueNo} created from ${reservation.materialReservationNo}.`,
      );

      await loadInventoryWorkflowData();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to issue materials.",
      );
    } finally {
      setActiveActionId(null);
    }
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inventory & Warehouse
          </h1>
          <p className="text-slate-500">
            Manage raw stock, material issue, and finished goods warehouse
            transfer.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadInventoryWorkflowData}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw
              className={cn("h-4 w-4", isLoading && "animate-spin")}
            />
            Refresh
          </button>

          <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50">
            <ArrowRightLeft className="h-4 w-4" /> Internal Transfer
          </button>

          <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800">
            <Package className="h-4 w-4" /> Stock Adjustment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Reservations"
          value={summary.reservations}
          badge="MR"
        />

        <SummaryCard
          title="Ready to Issue"
          value={summary.reservedCount}
          badge="Reserved"
          valueClassName="text-blue-700"
        />

        <SummaryCard
          title="Material Issues"
          value={summary.issuedCount}
          badge="Issued"
          valueClassName="text-emerald-700"
        />

        <SummaryCard
          title="FG Quantity"
          value={summary.finishedGoodsQuantity.toLocaleString()}
          badge="Received"
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
            <p className="font-bold">Inventory workflow error</p>
            <p className="mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-1">
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
                <div
                  className={cn(
                    "rounded-lg p-2",
                    activeWarehouse === warehouse.name
                      ? "bg-accent text-white"
                      : "bg-slate-200 text-slate-500",
                  )}
                >
                  <Warehouse className="h-4 w-4" />
                </div>

                {activeWarehouse === warehouse.name && (
                  <span className="rounded-full bg-accent/10 px-2 py-1 text-[10px] font-bold text-accent">
                    Active
                  </span>
                )}
              </div>

              <p
                className={cn(
                  "text-sm font-bold",
                  activeWarehouse === warehouse.name
                    ? "text-slate-900"
                    : "text-slate-600",
                )}
              >
                {warehouse.name}
              </p>

              <div className="mt-1 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {warehouse.count} SKUs
                </span>
                <span className="text-xs font-bold text-slate-900">
                  {warehouse.value}
                </span>
              </div>
            </button>
          ))}

          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <div className="mb-2 flex items-center gap-2 text-emerald-800">
              <PackageCheck className="h-4 w-4" />
              <span className="text-xs font-bold">Finished Goods Flow</span>
            </div>
            <p className="text-[10px] leading-relaxed text-emerald-700">
              Passed QC quantity will appear in Finished Goods Stock after the
              Production team clicks Pass QC.
            </p>
          </div>
        </div>

        <div className="space-y-8 lg:col-span-3">
          <RawStockTable />

          <MaterialReservationSection
            reservations={materialReservations}
            activeActionId={activeActionId}
            onIssueMaterials={handleIssueMaterials}
          />

          <MaterialIssueSection issues={materialIssues} />

          <FinishedGoodsSection finishedGoods={finishedGoods} />
        </div>
      </div>
    </div>
  );
}

function RawStockTable() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h2 className="font-bold text-slate-900">Raw Material Stock</h2>
          <p className="mt-1 text-xs text-slate-500">
            Demo stock list for warehouse visibility.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100">
            <History className="h-5 w-5" />
          </button>
          <button className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100">
            <Layers className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Item Details
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Category
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                Current Stock
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-6 py-4" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {inventoryData.map((item) => (
              <tr
                key={item.id}
                className="group cursor-pointer transition-colors hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-bold text-slate-500 transition-colors group-hover:bg-accent group-hover:text-white">
                      {item.logo}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 transition-colors group-hover:text-accent">
                        {item.name}
                      </p>
                      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                        {item.id}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {item.category}
                  </span>
                </td>

                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-black text-slate-900">
                    {item.stock.toLocaleString()} {item.unit}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <StatusBadge status={item.status} />
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 group-hover:text-slate-600">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MaterialReservationSection({
  reservations,
  activeActionId,
  onIssueMaterials,
}: {
  reservations: InventoryMaterialReservationListItem[];
  activeActionId: string | null;
  onIssueMaterials: (reservation: InventoryMaterialReservationListItem) => void;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="font-bold text-slate-900">Material Reservations</h2>
        <p className="mt-1 text-xs text-slate-500">
          Production reservation records waiting for material issue.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {reservations.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="h-6 w-6" />}
            title="No material reservations yet"
            description="Reserve materials from Production first."
          />
        ) : (
          reservations.map((reservation) => {
            const canIssue =
              reservation.status === "Reserved" ||
              reservation.status === "Partially Reserved";

            return (
              <div key={reservation.id} className="p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900">
                        {reservation.materialReservationNo}
                      </h3>
                      <StatusBadge status={reservation.status} />
                      <StatusBadge
                        status={
                          reservation.materialIssueStatus || "Not Started"
                        }
                      />
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Production Order: {reservation.productionOrderNo} • SO:{" "}
                      {reservation.salesOrderNo}
                    </p>

                    <p className="mt-1 text-[10px] font-bold text-blue-600">
                      {reservation.customer} • {reservation.productType} • Qty{" "}
                      {reservation.orderQuantity.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      onClick={() => onIssueMaterials(reservation)}
                      disabled={
                        !canIssue ||
                        activeActionId === `issue-${reservation.requestId}`
                      }
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {activeActionId === `issue-${reservation.requestId}`
                        ? "Issuing..."
                        : "Issue Materials"}
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                  {reservation.materials.map((material) => (
                    <div
                      key={material.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <p className="text-xs font-bold text-slate-900">
                        {material.materialName}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {material.materialCode} • {material.specification}
                      </p>
                      <p className="mt-2 text-xs font-black text-slate-800">
                        Reserved: {material.reservedQuantity.toLocaleString()}{" "}
                        {material.unit}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function MaterialIssueSection({
  issues,
}: {
  issues: InventoryMaterialIssueListItem[];
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="font-bold text-slate-900">Material Issues</h2>
        <p className="mt-1 text-xs text-slate-500">
          Issued raw materials sent to production floor.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {issues.length === 0 ? (
          <EmptyState
            icon={<Package className="h-6 w-6" />}
            title="No material issue records yet"
            description="Issue materials from a reservation to create a material issue record."
          />
        ) : (
          issues.map((issue) => (
            <div key={issue.id} className="p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900">
                      {issue.materialIssueNo}
                    </h3>
                    <StatusBadge status={issue.status} />
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Reservation: {issue.materialReservationNo} • Production
                    Order: {issue.productionOrderNo}
                  </p>

                  <p className="mt-1 text-[10px] font-bold text-emerald-600">
                    {issue.customer} • {issue.productType} • Issued by{" "}
                    {issue.issuedBy}
                  </p>
                </div>

                <MiniInfo
                  label="Issued Lines"
                  value={issue.materials.length.toString()}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function FinishedGoodsSection({
  finishedGoods,
}: {
  finishedGoods: InventoryFinishedGoodsListItem[];
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <h2 className="font-bold text-slate-900">Finished Goods Stock</h2>
        <p className="mt-1 text-xs text-slate-500">
          QC passed quantity received into Finished Goods Warehouse.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {finishedGoods.length === 0 ? (
          <EmptyState
            icon={<PackageCheck className="h-6 w-6" />}
            title="No finished goods received yet"
            description="Pass QC from Production to create Finished Goods Transfer."
          />
        ) : (
          finishedGoods.map((item) => (
            <div key={item.id} className="p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900">
                      {item.finishedGoodsTransferNo}
                    </h3>
                    <StatusBadge status={item.status} />
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    QC: {item.qcInspectionNo} • Production Order:{" "}
                    {item.productionOrderNo}
                  </p>

                  <p className="mt-1 text-[10px] font-bold text-indigo-600">
                    {item.customer} • {item.productType} • SO:{" "}
                    {item.salesOrderNo}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-3">
                  <MiniInfo
                    label="FG Quantity"
                    value={item.quantity.toLocaleString()}
                  />
                  <MiniInfo
                    label="Rejected Qty"
                    value={item.rejectedQuantity.toLocaleString()}
                  />
                  <MiniInfo label="Warehouse" value={item.warehouseLocation} />
                </div>
              </div>

              {item.notes && (
                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                  {item.notes}
                </div>
              )}
            </div>
          ))
        )}
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

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
        {icon}
      </div>

      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
        status === "Stable" ||
          status === "Issued" ||
          status === "Reserved" ||
          status === "Partially Reserved" ||
          status === "Received" ||
          status === "Passed"
          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
          : status === "Low Stock" ||
              status === "Shortage" ||
              status === "Cancelled"
            ? "border-red-100 bg-red-50 text-red-700"
            : status === "Pending" || status === "In Review"
              ? "border-blue-100 bg-blue-50 text-blue-700"
              : "border-slate-200 bg-slate-50 text-slate-600",
      )}
    >
      {status}
    </span>
  );
}
