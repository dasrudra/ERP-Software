import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Factory,
  PackageCheck,
  PlayCircle,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  completeProductionRun,
  createMaterialReservation,
  getProductionOrderDrafts,
  getProductionRunDrafts,
  getQCInspectionDrafts,
  passQCInspection,
  ProductionOrderListItem,
  ProductionRunListItem,
  QCInspectionListItem,
  startProductionOrder,
} from "@/api/productDevelopment";

export function Production() {
  const [productionOrders, setProductionOrders] = useState<
    ProductionOrderListItem[]
  >([]);
  const [productionRuns, setProductionRuns] = useState<ProductionRunListItem[]>(
    [],
  );
  const [qcInspections, setQcInspections] = useState<QCInspectionListItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadProductionWorkflowData() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const [orders, runs, inspections] = await Promise.all([
        getProductionOrderDrafts(),
        getProductionRunDrafts(),
        getQCInspectionDrafts(),
      ]);

      setProductionOrders(orders);
      setProductionRuns(runs);
      setQcInspections(inspections);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to load production workflow data.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProductionWorkflowData();
  }, []);

  const summary = useMemo(() => {
    const totalQuantity = productionOrders.reduce(
      (total, order) => total + order.orderQuantity,
      0,
    );

    const runningCount = productionOrders.filter(
      (order) => order.status === "Running",
    ).length;

    const completedCount = productionOrders.filter(
      (order) => order.status === "Completed",
    ).length;

    const qcPendingCount = qcInspections.filter(
      (inspection) => inspection.status === "Pending",
    ).length;

    const qcPassedCount = qcInspections.filter(
      (inspection) => inspection.status === "Passed",
    ).length;

    const completedQuantity = productionRuns.reduce(
      (total, run) => total + run.completedQuantity,
      0,
    );

    return {
      totalOrders: productionOrders.length,
      runningCount,
      completedCount,
      qcPendingCount,
      qcPassedCount,
      totalQuantity,
      completedQuantity,
    };
  }, [productionOrders, productionRuns, qcInspections]);

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

      await loadProductionWorkflowData();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to reserve materials.",
      );
    } finally {
      setActiveActionId(null);
    }
  }

  async function handleStartProduction(order: ProductionOrderListItem) {
    try {
      setActiveActionId(`start-${order.requestId}`);
      setErrorMessage(null);
      setSuccessMessage(null);

      const run = await startProductionOrder(order.requestId, {
        startedBy: "Production Supervisor",
        startedAt: new Date().toISOString(),
        notes: `Production started for ${order.productionOrderNo}.`,
      });

      setSuccessMessage(
        `${run.productionRunNo} started for ${order.productionOrderNo}.`,
      );

      await loadProductionWorkflowData();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to start production.",
      );
    } finally {
      setActiveActionId(null);
    }
  }

  async function handleCompleteProduction(requestId: string) {
    try {
      setActiveActionId(`complete-${requestId}`);
      setErrorMessage(null);
      setSuccessMessage(null);

      const inspection = await completeProductionRun(requestId, {
        completedBy: "Production Supervisor",
        completedAt: new Date().toISOString(),
        notes: "Production completed and sent to QC inspection.",
      });

      setSuccessMessage(
        `${inspection.qcInspectionNo} created for ${inspection.productionRunNo}.`,
      );

      await loadProductionWorkflowData();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to complete production.",
      );
    } finally {
      setActiveActionId(null);
    }
  }

  async function handlePassQC(requestId: string) {
    try {
      setActiveActionId(`pass-qc-${requestId}`);
      setErrorMessage(null);
      setSuccessMessage(null);

      const finishedGoods = await passQCInspection(requestId, {
        passedBy: "QC Manager",
        passedAt: new Date().toISOString(),
        warehouseLocation: "Finished Goods Warehouse",
        notes: "QC passed and finished goods received in warehouse.",
      });

      setSuccessMessage(
        `${finishedGoods.finishedGoodsTransferNo} created from ${finishedGoods.qcInspectionNo}.`,
      );

      await loadProductionWorkflowData();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to pass QC inspection.",
      );
    } finally {
      setActiveActionId(null);
    }
  }

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Production Control
          </h1>
          <p className="text-slate-500">
            Plan, release, start, complete, QC pass, and transfer finished goods
            to warehouse.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadProductionWorkflowData}
            disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw
              className={cn("h-4 w-4", isLoading && "animate-spin")}
            />
            Refresh
          </button>

          <button className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-slate-800">
            <BarChart3 className="h-4 w-4" /> Capacity Dashboard
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
          title="Completed"
          value={summary.completedCount}
          badge="Done"
          valueClassName="text-blue-700"
        />

        <SummaryCard
          title="QC Pending"
          value={summary.qcPendingCount}
          badge="Inspection"
          valueClassName="text-amber-700"
        />

        <SummaryCard
          title="QC Passed"
          value={summary.qcPassedCount}
          badge="FG Ready"
          valueClassName="text-emerald-700"
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="glass-panel rounded-3xl p-8 lg:col-span-1">
          <h3 className="mb-2 text-lg font-bold text-slate-900">
            Production Summary
          </h3>

          <p className="mb-6 text-xs text-slate-500">
            QC passed quantity will be transferred to Finished Goods Warehouse.
            Rejected quantity remains recorded but does not enter finished goods
            stock.
          </p>

          <div className="space-y-4">
            <InfoBox
              label="Total Quantity"
              value={summary.totalQuantity.toLocaleString()}
            />
            <InfoBox
              label="Completed Quantity"
              value={summary.completedQuantity.toLocaleString()}
            />
            <InfoBox label="QC Passed" value={`${summary.qcPassedCount}`} />
          </div>

          <div className="mt-8 rounded-2xl bg-slate-900 p-5 text-white">
            <Factory className="mb-4 h-8 w-8 text-white/70" />
            <h4 className="font-bold">Next Flow</h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">
              After finished goods are received, the next module can create
              delivery planning and shipment.
            </p>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              Production Orders from Sales
            </h3>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Shop Floor Queue
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {productionOrders.length === 0 ? (
              <EmptyState
                icon={<ClipboardList className="h-6 w-6" />}
                title="No production orders yet"
                description="Release a Sales Order from Sales & Commercial to create a Production Order draft here."
              />
            ) : (
              productionOrders.map((order) => (
                <ProductionOrderCard
                  key={order.id}
                  order={order}
                  activeActionId={activeActionId}
                  onReserveMaterials={handleReserveMaterials}
                  onStartProduction={handleStartProduction}
                  onCompleteProduction={handleCompleteProduction}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-bold text-slate-900">WIP Tracking</h2>
          <p className="mt-1 text-xs text-slate-500">
            Clear production progress line: started, completed, rejected, and QC
            handoff.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {productionRuns.length === 0 ? (
            <EmptyState
              icon={<PlayCircle className="h-6 w-6" />}
              title="No WIP production started yet"
              description="Issue materials from Inventory, then click Start Production."
            />
          ) : (
            productionRuns.map((run) => (
              <ProductionRunCard
                key={run.id}
                run={run}
                activeActionId={activeActionId}
                onCompleteProduction={handleCompleteProduction}
              />
            ))
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="font-bold text-slate-900">QC Inspection Queue</h2>
          <p className="mt-1 text-xs text-slate-500">
            Pending QC can be passed here. Passing QC creates Finished Goods
            Transfer for Inventory.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {qcInspections.length === 0 ? (
            <EmptyState
              icon={<ShieldCheck className="h-6 w-6" />}
              title="No QC inspection draft yet"
              description="Complete a running production order to create QC inspection."
            />
          ) : (
            qcInspections.map((inspection) => (
              <QCInspectionCard
                key={inspection.id}
                inspection={inspection}
                activeActionId={activeActionId}
                onPassQC={handlePassQC}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ProductionOrderCard({
  order,
  activeActionId,
  onReserveMaterials,
  onStartProduction,
  onCompleteProduction,
}: {
  order: ProductionOrderListItem;
  activeActionId: string | null;
  onReserveMaterials: (order: ProductionOrderListItem) => void;
  onStartProduction: (order: ProductionOrderListItem) => void;
  onCompleteProduction: (requestId: string) => void;
}) {
  const canReserve =
    (order.status === "Draft" || order.status === "Planned") &&
    order.materialReservationStatus !== "Reserved" &&
    order.materialReservationStatus !== "Partially Reserved" &&
    order.materialReservationStatus !== "Issued";

  const canStart =
    order.status === "Released" &&
    order.materialIssueStatus === "Issued" &&
    order.productionRunStatus !== "Running" &&
    order.productionRunStatus !== "Completed";

  const canComplete =
    order.status === "Running" && order.productionRunStatus === "Running";

  return (
    <div className="glass-panel rounded-2xl border-l-[6px] border-l-emerald-400 p-6 transition-all hover:shadow-lg">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <PackageCheck className="h-6 w-6" />
          </div>

          <div>
            <h4 className="font-bold text-slate-900">
              {order.productionOrderNo}
            </h4>

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
            label="QC No"
            value={order.qcInspectionNo || "Not created"}
          />
          <MiniInfo
            label="FG Transfer"
            value={order.finishedGoodsTransferNo || "Not created"}
          />
        </div>
      </div>

      <WorkflowLine
        materialIssueStatus={order.materialIssueStatus || "Not Started"}
        productionStatus={order.status}
        productionRunStatus={order.productionRunStatus || "Not Started"}
        qcInspectionStatus={order.qcInspectionStatus || "Not Started"}
        finishedGoodsStatus={order.finishedGoodsTransferStatus || "Not Started"}
        finishedGoodsNo={order.finishedGoodsTransferNo}
      />

      {order.notes && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
          {order.notes}
        </div>
      )}

      <div className="mt-5 flex flex-wrap justify-end gap-2">
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

        <button
          onClick={() => onStartProduction(order)}
          disabled={!canStart || activeActionId === `start-${order.requestId}`}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {activeActionId === `start-${order.requestId}`
            ? "Starting..."
            : "Start Production"}
        </button>

        <button
          onClick={() => onCompleteProduction(order.requestId)}
          disabled={
            !canComplete || activeActionId === `complete-${order.requestId}`
          }
          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {activeActionId === `complete-${order.requestId}`
            ? "Completing..."
            : "Complete Production"}
        </button>
      </div>
    </div>
  );
}

function WorkflowLine({
  materialIssueStatus,
  productionStatus,
  productionRunStatus,
  qcInspectionStatus,
  finishedGoodsStatus,
  finishedGoodsNo,
}: {
  materialIssueStatus: string;
  productionStatus: string;
  productionRunStatus: string;
  qcInspectionStatus: string;
  finishedGoodsStatus: string;
  finishedGoodsNo?: string;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        Workflow Status Line
      </p>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
        <WorkflowStep
          label="1. Material Issue"
          value={materialIssueStatus}
          helper="Inventory issue status"
        />

        <WorkflowStep
          label="2. Production Order"
          value={productionStatus}
          helper="Main production status"
        />

        <WorkflowStep
          label="3. WIP / Completion"
          value={productionRunStatus}
          helper="Running or completed"
        />

        <WorkflowStep
          label="4. QC Inspection"
          value={qcInspectionStatus}
          helper="Pending or passed"
        />

        <WorkflowStep
          label="5. Finished Goods"
          value={finishedGoodsStatus}
          helper={finishedGoodsNo || "Warehouse transfer"}
        />
      </div>
    </div>
  );
}

function WorkflowStep({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-2">
        <StatusBadge status={value} />
      </div>

      <p className="mt-2 text-[10px] font-medium text-slate-500">{helper}</p>
    </div>
  );
}

function ProductionRunCard({
  run,
  activeActionId,
  onCompleteProduction,
}: {
  run: ProductionRunListItem;
  activeActionId: string | null;
  onCompleteProduction: (requestId: string) => void;
}) {
  const canComplete = run.status === "Running";

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h3 className="font-bold text-slate-900">{run.productionRunNo}</h3>

          <p className="mt-1 text-xs text-slate-500">
            Production Order: {run.productionOrderNo} • Sales Order:{" "}
            {run.salesOrderNo}
          </p>

          <p className="mt-1 text-[10px] font-bold text-emerald-600">
            {run.customer} • {run.productType} • {run.workCenter}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <ClearStatusBox label="WIP Status" status={run.status} />
          <ClearStatusBox
            label="QC Status"
            status={run.qcInspectionStatus || "Not Started"}
          />
        </div>
      </div>

      {run.notes && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
          {run.notes}
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <MiniInfo
          label="Started Qty"
          value={run.startedQuantity.toLocaleString()}
        />
        <MiniInfo
          label="Completed Qty"
          value={run.completedQuantity.toLocaleString()}
        />
        <MiniInfo
          label="Rejected Qty"
          value={run.rejectedQuantity.toLocaleString()}
        />
        <MiniInfo label="QC No" value={run.qcInspectionNo || "Not created"} />
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={() => onCompleteProduction(run.requestId)}
          disabled={
            !canComplete || activeActionId === `complete-${run.requestId}`
          }
          className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {activeActionId === `complete-${run.requestId}`
            ? "Completing..."
            : "Complete Production"}
        </button>
      </div>
    </div>
  );
}

function QCInspectionCard({
  inspection,
  activeActionId,
  onPassQC,
}: {
  inspection: QCInspectionListItem;
  activeActionId: string | null;
  onPassQC: (requestId: string) => void;
}) {
  const canPassQC = inspection.status === "Pending";

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h3 className="font-bold text-slate-900">
            {inspection.qcInspectionNo}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Production Order: {inspection.productionOrderNo} • WIP:{" "}
            {inspection.productionRunNo}
          </p>

          <p className="mt-1 text-[10px] font-bold text-blue-600">
            {inspection.customer} • {inspection.productType} • Sales Order:{" "}
            {inspection.salesOrderNo}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
          <ClearStatusBox label="QC Status" status={inspection.status} />
          <ClearStatusBox
            label="FG Status"
            status={inspection.finishedGoodsTransferStatus || "Not Started"}
          />
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
              FG Transfer
            </p>
            <p className="mt-1 font-black text-slate-900">
              {inspection.finishedGoodsTransferNo || "Not created"}
            </p>
          </div>
        </div>
      </div>

      {inspection.notes && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
          {inspection.notes}
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-4">
        <MiniInfo
          label="Inspected Qty"
          value={inspection.inspectedQuantity.toLocaleString()}
        />
        <MiniInfo
          label="Passed Qty"
          value={inspection.passedQuantity.toLocaleString()}
        />
        <MiniInfo
          label="Rejected Qty"
          value={inspection.rejectedQuantity.toLocaleString()}
        />
        <MiniInfo label="Warehouse Step" value="FG Transfer" />
      </div>

      <div className="mt-5 flex justify-end">
        <button
          onClick={() => onPassQC(inspection.requestId)}
          disabled={
            !canPassQC || activeActionId === `pass-qc-${inspection.requestId}`
          }
          className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {activeActionId === `pass-qc-${inspection.requestId}`
            ? "Passing QC..."
            : "Pass QC"}
        </button>
      </div>
    </div>
  );
}

function ClearStatusBox({ label, status }: { label: string; status: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="mt-2">
        <StatusBadge status={status} />
      </div>
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
        "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
        status === "Running" ||
          status === "Released" ||
          status === "Issued" ||
          status === "Reserved" ||
          status === "Partially Reserved" ||
          status === "Completed" ||
          status === "Passed" ||
          status === "Received"
          ? "bg-emerald-50 text-emerald-700"
          : status === "Pending" || status === "Planned"
            ? "bg-blue-50 text-blue-700"
            : status === "Draft"
              ? "bg-amber-50 text-amber-700"
              : status === "Shortage" ||
                  status === "Cancelled" ||
                  status === "Failed" ||
                  status === "Rework Required"
                ? "bg-red-50 text-red-700"
                : "bg-slate-100 text-slate-500",
      )}
    >
      {status}
    </span>
  );
}
