import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertCircle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  Clock,
  FileSignature,
  FileText,
  Globe,
  PackageCheck,
  RefreshCcw,
  Send,
  Tag,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  acceptProformaInvoice,
  approveQuotationDraft,
  createProformaInvoiceDraft,
  createSalesOrderDraft,
  getProformaInvoiceDrafts,
  getQuotationDrafts,
  getSalesOrderDrafts,
  releaseSalesOrder,
  SalesOrderListItem,
  SalesProformaInvoiceDraft,
  SalesQuotationDraft,
} from "@/api/productDevelopment";

type QuoteRow = {
  id: string;
  customer: string;
  date: string;
  amount: string;
  amountBdt?: string;
  margin: string;
  status: string;
  source: "PD" | "Demo";
  requestId?: string;
  productType?: string;
};

type ProformaInvoiceRow = {
  id: string;
  quotationNo: string;
  customer: string;
  date: string;
  amount: string;
  amountBdt: string;
  status: string;
  requestId: string;
  productType: string;
};

type SalesOrderRow = {
  id: string;
  proformaInvoiceNo: string;
  quotationNo: string;
  customer: string;
  date: string;
  amount: string;
  amountBdt: string;
  status: string;
  requestId: string;
  productType: string;
  orderQuantity: number;
};

const demoQuotes: QuoteRow[] = [
  {
    id: "QT-552",
    customer: "Nike India",
    date: "2024-05-12",
    amount: "$42,500",
    margin: "42%",
    status: "Draft",
    source: "Demo",
  },
  {
    id: "QT-548",
    customer: "Global Fashion",
    date: "2024-05-11",
    amount: "$15,800",
    margin: "38%",
    status: "Sent",
    source: "Demo",
  },
  {
    id: "QT-541",
    customer: "EuroFashion Group",
    date: "2024-05-10",
    amount: "$89,200",
    margin: "45%",
    status: "Approved",
    source: "Demo",
  },
];

const tabs = [
  "Quotations",
  "Proforma Invoices",
  "Sales Orders",
  "Customer POs",
];

export function Sales() {
  const [activeSubTab, setActiveSubTab] = useState("quotations");
  const [pdQuotationDrafts, setPdQuotationDrafts] = useState<
    SalesQuotationDraft[]
  >([]);
  const [proformaInvoices, setProformaInvoices] = useState<
    SalesProformaInvoiceDraft[]
  >([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadSalesData() {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const [drafts, invoices, orders] = await Promise.all([
        getQuotationDrafts(),
        getProformaInvoiceDrafts(),
        getSalesOrderDrafts(),
      ]);

      setPdQuotationDrafts(drafts);
      setProformaInvoices(invoices);
      setSalesOrders(orders);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load Sales data.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadSalesData();
  }, []);

  const quoteRows = useMemo(() => {
    const pdRows = pdQuotationDrafts.map(mapQuotationDraftToRow);
    return [...pdRows, ...demoQuotes];
  }, [pdQuotationDrafts]);

  const piRows = useMemo(
    () => proformaInvoices.map(mapProformaInvoiceToRow),
    [proformaInvoices],
  );

  const salesOrderRows = useMemo(
    () => salesOrders.map(mapSalesOrderToRow),
    [salesOrders],
  );

  const summary = useMemo(() => {
    const releasedSalesOrders = salesOrders.filter(
      (order) => order.status === "Released",
    ).length;

    return {
      totalQuotes: quoteRows.length,
      pdQuotationCount: pdQuotationDrafts.length,
      salesOrderCount: salesOrders.length,
      releasedSalesOrders,
    };
  }, [pdQuotationDrafts.length, quoteRows.length, salesOrders]);

  async function handleApproveQuotation(quote: QuoteRow) {
    if (!quote.requestId || quote.source !== "PD") {
      return;
    }

    try {
      setActiveActionId(`approve-${quote.requestId}`);
      setErrorMessage(null);
      setSuccessMessage(null);

      await approveQuotationDraft(quote.requestId, {
        approvedBy: "Commercial Manager",
      });

      setSuccessMessage(`${quote.id} approved successfully.`);
      await loadSalesData();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to approve quotation.",
      );
    } finally {
      setActiveActionId(null);
    }
  }

  async function handleCreatePi(quote: QuoteRow) {
    if (!quote.requestId || quote.source !== "PD") {
      return;
    }

    try {
      setActiveActionId(`pi-${quote.requestId}`);
      setErrorMessage(null);
      setSuccessMessage(null);

      const today = new Date().toISOString().slice(0, 10);

      const pi = await createProformaInvoiceDraft(quote.requestId, {
        preparedBy: "Commercial Team",
        issueDate: today,
        notes: `PI created from approved quotation ${quote.id}.`,
      });

      setSuccessMessage(`${pi.proformaInvoiceNo} created successfully.`);
      setActiveSubTab("proforma invoices");
      await loadSalesData();
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to create Proforma Invoice.",
      );
    } finally {
      setActiveActionId(null);
    }
  }

  async function handleAcceptPi(pi: ProformaInvoiceRow) {
    try {
      setActiveActionId(`accept-pi-${pi.requestId}`);
      setErrorMessage(null);
      setSuccessMessage(null);

      await acceptProformaInvoice(pi.requestId, {
        acceptedBy: "Customer / Commercial Team",
        notes: `Customer accepted ${pi.id}.`,
      });

      setSuccessMessage(`${pi.id} accepted successfully.`);
      await loadSalesData();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to accept PI.",
      );
    } finally {
      setActiveActionId(null);
    }
  }

  async function handleCreateSalesOrder(pi: ProformaInvoiceRow) {
    try {
      setActiveActionId(`sales-order-${pi.requestId}`);
      setErrorMessage(null);
      setSuccessMessage(null);

      const today = new Date().toISOString().slice(0, 10);

      const salesOrder = await createSalesOrderDraft(pi.requestId, {
        preparedBy: "Sales Team",
        orderDate: today,
        notes: `Sales Order created from accepted PI ${pi.id}.`,
      });

      setSuccessMessage(`${salesOrder.salesOrderNo} created successfully.`);
      setActiveSubTab("sales orders");
      await loadSalesData();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to create Sales Order.",
      );
    } finally {
      setActiveActionId(null);
    }
  }

  async function handleReleaseSalesOrder(order: SalesOrderRow) {
    try {
      setActiveActionId(`release-so-${order.requestId}`);
      setErrorMessage(null);
      setSuccessMessage(null);

      const today = new Date().toISOString().slice(0, 10);

      const productionOrder = await releaseSalesOrder(order.requestId, {
        releasedBy: "Production Planning",
        plannedStartDate: today,
        notes: `Sales Order ${order.id} released to Production Planning.`,
      });

      setSuccessMessage(
        `${order.id} released successfully. ${productionOrder.productionOrderNo} created.`,
      );

      await loadSalesData();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to release Sales Order.",
      );
    } finally {
      setActiveActionId(null);
    }
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Sales & Commercial
          </h1>
          <p className="text-slate-500">
            Manage quotations, proforma invoices, sales orders, and customer
            purchase orders.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={loadSalesData}
            disabled={isLoading}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw
              className={cn("w-4 h-4", isLoading && "animate-spin")}
            />
            Refresh
          </button>

          <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-md">
            <Calculator className="w-4 h-4" /> New Quotation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Quotations"
          value={summary.totalQuotes}
          badge="All"
        />

        <SummaryCard
          title="PD Quotations"
          value={summary.pdQuotationCount}
          badge="From PD"
          valueClassName="text-indigo-700"
        />

        <SummaryCard
          title="Sales Orders"
          value={summary.salesOrderCount}
          badge="Draft"
          valueClassName="text-blue-700"
        />

        <SummaryCard
          title="Released SO"
          value={summary.releasedSalesOrders}
          badge="To Production"
          valueClassName="text-emerald-700"
        />
      </div>

      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab.toLowerCase())}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all",
              activeSubTab === tab.toLowerCase()
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700",
            )}
          >
            {tab}
          </button>
        ))}
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
            <p className="font-bold">Sales workflow error</p>
            <p className="mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {activeSubTab === "quotations" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <QuotationsTable
              quoteRows={quoteRows}
              activeActionId={activeActionId}
              onApproveQuotation={handleApproveQuotation}
              onCreatePi={handleCreatePi}
            />
          </div>

          <SalesSidebar />
        </div>
      ) : activeSubTab === "proforma invoices" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <ProformaInvoicesTable
              rows={piRows}
              activeActionId={activeActionId}
              onAcceptPi={handleAcceptPi}
              onCreateSalesOrder={handleCreateSalesOrder}
            />
          </div>

          <SalesSidebar />
        </div>
      ) : activeSubTab === "sales orders" ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <SalesOrdersTable
              rows={salesOrderRows}
              activeActionId={activeActionId}
              onReleaseSalesOrder={handleReleaseSalesOrder}
            />
          </div>

          <SalesSidebar />
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            {getActiveTabTitle(activeSubTab)}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Customer PO upload, verification, and matching will be connected in
            the next commercial workflow step.
          </p>
        </div>
      )}
    </div>
  );
}

function QuotationsTable({
  quoteRows,
  activeActionId,
  onApproveQuotation,
  onCreatePi,
}: {
  quoteRows: QuoteRow[];
  activeActionId: string | null;
  onApproveQuotation: (quote: QuoteRow) => void;
  onCreatePi: (quote: QuoteRow) => void;
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <TableHead>Quote Details</TableHead>
            <TableHead>Commercials</TableHead>
            <TableHead align="center">Source</TableHead>
            <TableHead align="center">Status</TableHead>
            <TableHead align="right">Actions</TableHead>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {quoteRows.map((quote) => {
            const isPdQuote = quote.source === "PD";
            const canApprove = isPdQuote && quote.status === "Draft";
            const canCreatePi = isPdQuote && quote.status === "Approved";

            return (
              <tr
                key={`${quote.source}-${quote.id}`}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <IconBox
                      variant={isPdQuote ? "indigo" : "blue"}
                      icon={<FileText className="w-5 h-5" />}
                    />

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {quote.id}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {quote.customer} • {quote.date}
                      </p>

                      {isPdQuote && (
                        <p className="mt-1 text-[10px] font-bold text-indigo-600">
                          {quote.requestId} • {quote.productType}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900">
                      {quote.amount}
                    </span>
                    {quote.amountBdt && (
                      <span className="text-[10px] font-bold text-slate-400">
                        {quote.amountBdt}
                      </span>
                    )}
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {quote.margin} Est.
                      Margin
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold border",
                        isPdQuote
                          ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                          : "bg-slate-50 text-slate-600 border-slate-200",
                      )}
                    >
                      {isPdQuote ? "PD Quotation" : "Demo"}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <StatusBadge status={quote.status} />
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
                      <Send className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onApproveQuotation(quote)}
                      disabled={
                        !canApprove ||
                        activeActionId === `approve-${quote.requestId}`
                      }
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {activeActionId === `approve-${quote.requestId}`
                        ? "Approving..."
                        : "Approve"}
                    </button>

                    <button
                      onClick={() => onCreatePi(quote)}
                      disabled={
                        !canCreatePi ||
                        activeActionId === `pi-${quote.requestId}`
                      }
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {activeActionId === `pi-${quote.requestId}`
                        ? "Creating..."
                        : "Create PI"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {quoteRows.length === 0 && (
            <EmptyTableRow colSpan={5} message="No quotations found." />
          )}
        </tbody>
      </table>
    </div>
  );
}

function ProformaInvoicesTable({
  rows,
  activeActionId,
  onAcceptPi,
  onCreateSalesOrder,
}: {
  rows: ProformaInvoiceRow[];
  activeActionId: string | null;
  onAcceptPi: (pi: ProformaInvoiceRow) => void;
  onCreateSalesOrder: (pi: ProformaInvoiceRow) => void;
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <TableHead>PI Details</TableHead>
            <TableHead>Commercials</TableHead>
            <TableHead align="center">Linked Quote</TableHead>
            <TableHead align="center">Status</TableHead>
            <TableHead align="right">Actions</TableHead>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {rows.map((pi) => {
            const canAccept = pi.status === "Draft" || pi.status === "Sent";
            const canCreateSalesOrder = pi.status === "Accepted";

            return (
              <tr
                key={pi.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <IconBox
                      variant="blue"
                      icon={<FileSignature className="w-5 h-5" />}
                    />

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {pi.id}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {pi.customer} • {pi.date}
                      </p>
                      <p className="mt-1 text-[10px] font-bold text-blue-600">
                        {pi.requestId} • {pi.productType}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900">
                      {pi.amount}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {pi.amountBdt}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600">
                    {pi.quotationNo}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <StatusBadge status={pi.status} />
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      onClick={() => onAcceptPi(pi)}
                      disabled={
                        !canAccept ||
                        activeActionId === `accept-pi-${pi.requestId}`
                      }
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {activeActionId === `accept-pi-${pi.requestId}`
                        ? "Accepting..."
                        : "Accept PI"}
                    </button>

                    <button
                      onClick={() => onCreateSalesOrder(pi)}
                      disabled={
                        !canCreateSalesOrder ||
                        activeActionId === `sales-order-${pi.requestId}`
                      }
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {activeActionId === `sales-order-${pi.requestId}`
                        ? "Creating..."
                        : "Create SO"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {rows.length === 0 && (
            <EmptyTableRow
              colSpan={5}
              message="No Proforma Invoice drafts found. Approve a PD quotation first, then click Create PI."
            />
          )}
        </tbody>
      </table>
    </div>
  );
}

function SalesOrdersTable({
  rows,
  activeActionId,
  onReleaseSalesOrder,
}: {
  rows: SalesOrderRow[];
  activeActionId: string | null;
  onReleaseSalesOrder: (order: SalesOrderRow) => void;
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <TableHead>Sales Order Details</TableHead>
            <TableHead>Commercials</TableHead>
            <TableHead align="center">Linked PI</TableHead>
            <TableHead align="center">Status</TableHead>
            <TableHead align="right">Actions</TableHead>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {rows.map((order) => {
            const canRelease = order.status === "Draft";

            return (
              <tr
                key={order.id}
                className="hover:bg-slate-50 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <IconBox
                      variant="emerald"
                      icon={<PackageCheck className="w-5 h-5" />}
                    />

                    <div>
                      <p className="text-sm font-bold text-slate-900">
                        {order.id}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {order.customer} • {order.date}
                      </p>
                      <p className="mt-1 text-[10px] font-bold text-emerald-600">
                        {order.requestId} • {order.productType} • Qty{" "}
                        {order.orderQuantity}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900">
                      {order.amount}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {order.amountBdt}
                    </span>
                    <span className="mt-1 text-[10px] font-bold text-indigo-600">
                      Quote: {order.quotationNo}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-600">
                    {order.proformaInvoiceNo}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <StatusBadge status={order.status} />
                  </div>
                </td>

                <td className="px-6 py-4 text-right">
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <button
                      onClick={() => onReleaseSalesOrder(order)}
                      disabled={
                        !canRelease ||
                        activeActionId === `release-so-${order.requestId}`
                      }
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {activeActionId === `release-so-${order.requestId}`
                        ? "Releasing..."
                        : "Release SO"}
                    </button>

                    <button className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold">
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {rows.length === 0 && (
            <EmptyTableRow
              colSpan={5}
              message="No Sales Orders found. Accept a PI first, then click Create SO."
            />
          )}
        </tbody>
      </table>
    </div>
  );
}

function SalesSidebar() {
  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-500" /> Multi-Currency Rates
        </h3>

        <div className="space-y-3">
          {[
            { label: "USD/BDT", rate: "120.00" },
            { label: "EUR/USD", rate: "1.08" },
            { label: "GBP/USD", rate: "1.25" },
          ].map((rate) => (
            <div
              key={rate.label}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-xl"
            >
              <span className="text-xs font-bold text-slate-600">
                {rate.label}
              </span>
              <span className="text-xs font-black text-slate-900">
                {rate.rate}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden shadow-xl group">
        <div className="relative z-10">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-lg mb-1 italic">Commercial Workflow</h3>
          <p className="text-xs text-blue-100 leading-relaxed">
            Approve quotation, create PI, accept PI, create Sales Order, then
            release SO to Production Planning.
          </p>
          <button className="mt-4 flex items-center gap-2 text-[10px] font-black group-hover:gap-4 transition-all">
            REVIEW FLOW <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <Clock className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12" />
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

function TableHead({
  children,
  align = "left",
}: {
  children: ReactNode;
  align?: "left" | "center" | "right";
}) {
  return (
    <th
      className={cn(
        "px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest",
        align === "center" && "text-center",
        align === "right" && "text-right",
      )}
    >
      {children}
    </th>
  );
}

function IconBox({
  icon,
  variant,
}: {
  icon: ReactNode;
  variant: "blue" | "indigo" | "emerald";
}) {
  return (
    <div
      className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-all",
        variant === "blue" &&
          "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
        variant === "indigo" &&
          "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
        variant === "emerald" &&
          "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white",
      )}
    >
      {icon}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-[10px] font-bold border",
        status === "Approved" || status === "Accepted" || status === "Released"
          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
          : status === "Sent"
            ? "bg-blue-50 text-blue-600 border-blue-100"
            : status === "Cancelled" || status === "Rejected"
              ? "bg-red-50 text-red-600 border-red-100"
              : "bg-slate-50 text-slate-600 border-slate-200",
      )}
    >
      {status}
    </span>
  );
}

function EmptyTableRow({
  colSpan,
  message,
}: {
  colSpan: number;
  message: string;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-6 py-10 text-center text-sm text-slate-500"
      >
        {message}
      </td>
    </tr>
  );
}

function mapQuotationDraftToRow(quotation: SalesQuotationDraft): QuoteRow {
  return {
    id: quotation.quotationNo,
    customer: quotation.customer,
    date: quotation.createdAt.slice(0, 10),
    amount: `${quotation.currency} ${formatNumber(
      quotation.totalSellingValue,
    )}`,
    amountBdt: `BDT ${formatNumber(quotation.totalSellingValueBdt)}`,
    margin: `${quotation.marginPercent}%`,
    status: quotation.status,
    source: "PD",
    requestId: quotation.requestId,
    productType: quotation.productType,
  };
}

function mapProformaInvoiceToRow(
  pi: SalesProformaInvoiceDraft,
): ProformaInvoiceRow {
  return {
    id: pi.proformaInvoiceNo,
    quotationNo: pi.quotationNo,
    customer: pi.customer,
    date: pi.issueDate,
    amount: `${pi.currency} ${formatNumber(pi.totalValue)}`,
    amountBdt: `BDT ${formatNumber(pi.totalValueBdt)}`,
    status: pi.status,
    requestId: pi.requestId,
    productType: pi.productType,
  };
}

function mapSalesOrderToRow(order: SalesOrderListItem): SalesOrderRow {
  return {
    id: order.salesOrderNo,
    proformaInvoiceNo: order.proformaInvoiceNo,
    quotationNo: order.quotationNo,
    customer: order.customer,
    date: order.orderDate,
    amount: `${order.currency} ${formatNumber(order.totalValue)}`,
    amountBdt: `BDT ${formatNumber(order.totalValueBdt)}`,
    status: order.status,
    requestId: order.requestId,
    productType: order.productType,
    orderQuantity: order.orderQuantity,
  };
}

function getActiveTabTitle(activeSubTab: string) {
  return activeSubTab
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatNumber(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
