import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Calculator,
  CheckCircle2,
  FileText,
  ReceiptText,
} from "lucide-react";
import {
  getQuotationDraftByRequestId,
  SaveQuotationDraftPayload,
  saveQuotationDraft,
} from "@/api/productDevelopment";
import { Modal } from "@/components/ui/Modal";
import {
  DevelopmentRequest,
  QuotationCurrency,
  QuotationDraft,
} from "@/types/productDevelopment";

type QuotationDraftModalProps = {
  request: DevelopmentRequest | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
};

type QuotationFormState = {
  orderQuantity: string;
  currency: QuotationCurrency;
  exchangeRate: string;
  materialCost: string;
  laborCost: string;
  overheadCost: string;
  wastageCost: string;
  marginPercent: string;
  preparedBy: string;
  notes: string;
};

const initialFormState: QuotationFormState = {
  orderQuantity: "1000",
  currency: "USD",
  exchangeRate: "120",
  materialCost: "0.00",
  laborCost: "0.00",
  overheadCost: "0.00",
  wastageCost: "0.00",
  marginPercent: "20",
  preparedBy: "Commercial Team",
  notes: "",
};

export function QuotationDraftModal({
  request,
  onClose,
  onSaved,
}: QuotationDraftModalProps) {
  const [formState, setFormState] =
    useState<QuotationFormState>(initialFormState);
  const [existingQuotation, setExistingQuotation] =
    useState<QuotationDraft | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadQuotation() {
      if (!request) {
        setExistingQuotation(null);
        setFormState(initialFormState);
        return;
      }

      try {
        setIsLoading(true);
        setFormError(null);
        setSuccessMessage(null);

        const quotation = await getQuotationDraftByRequestId(request.id);

        if (!isMounted) {
          return;
        }

        setExistingQuotation(quotation || null);
        setFormState(
          quotation
            ? createFormStateFromQuotation(quotation)
            : initialFormState,
        );
      } catch (err) {
        if (isMounted) {
          setFormError(
            err instanceof Error ? err.message : "Failed to load quotation.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadQuotation();

    return () => {
      isMounted = false;
    };
  }, [request]);

  const calculation = useMemo(() => {
    const orderQuantity = parseNumber(formState.orderQuantity);
    const exchangeRate = parseNumber(formState.exchangeRate);
    const materialCost = parseNumber(formState.materialCost);
    const laborCost = parseNumber(formState.laborCost);
    const overheadCost = parseNumber(formState.overheadCost);
    const wastageCost = parseNumber(formState.wastageCost);
    const marginPercent = parseNumber(formState.marginPercent);

    const unitCost = materialCost + laborCost + overheadCost + wastageCost;
    const unitSellingPrice = unitCost + unitCost * (marginPercent / 100);
    const totalSellingValue = unitSellingPrice * orderQuantity;
    const totalSellingValueBdt =
      formState.currency === "USD"
        ? totalSellingValue * exchangeRate
        : totalSellingValue;

    return {
      orderQuantity,
      exchangeRate,
      materialCost,
      laborCost,
      overheadCost,
      wastageCost,
      marginPercent,
      unitCost,
      unitSellingPrice,
      totalSellingValue,
      totalSellingValueBdt,
    };
  }, [formState]);

  if (!request) {
    return null;
  }

  const activeRequest = request;
  const canCreateQuotation =
    activeRequest.customerApprovalStatus === "Approved";

  function handleClose() {
    if (isSaving) {
      return;
    }

    setFormError(null);
    setSuccessMessage(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canCreateQuotation) {
      setFormError("Customer approval is required before quotation creation.");
      return;
    }

    if (calculation.orderQuantity <= 0) {
      setFormError("Order quantity must be greater than 0.");
      return;
    }

    if (calculation.unitCost <= 0) {
      setFormError("Unit cost must be greater than 0.");
      return;
    }

    if (formState.currency === "USD" && calculation.exchangeRate <= 0) {
      setFormError("Exchange rate is required for USD quotation.");
      return;
    }

    if (!formState.preparedBy.trim()) {
      setFormError("Prepared by is required.");
      return;
    }

    try {
      setIsSaving(true);
      setFormError(null);
      setSuccessMessage(null);

      const payload: SaveQuotationDraftPayload = {
        orderQuantity: calculation.orderQuantity,
        currency: formState.currency,
        exchangeRate: calculation.exchangeRate,
        materialCost: calculation.materialCost,
        laborCost: calculation.laborCost,
        overheadCost: calculation.overheadCost,
        wastageCost: calculation.wastageCost,
        marginPercent: calculation.marginPercent,
        preparedBy: formState.preparedBy.trim(),
        notes: formState.notes.trim() || undefined,
      };

      const savedQuotation = await saveQuotationDraft(
        activeRequest.id,
        payload,
      );

      setExistingQuotation(savedQuotation);
      setSuccessMessage("Quotation Draft Saved");

      await onSaved();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to save quotation draft.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal
      isOpen={Boolean(activeRequest)}
      title="Create Quotation / Cost Sheet"
      description="Prepare BOM-based costing, margin, USD/BDT conversion, and quotation draft."
      onClose={handleClose}
      closeDisabled={isSaving}
      maxWidthClassName="max-w-6xl"
    >
      <div className="px-6 py-6">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="mb-4 h-5 w-60 animate-pulse rounded bg-slate-200" />
            <div className="mb-2 h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    PD Request Summary
                  </p>
                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    {activeRequest.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {activeRequest.id} • {activeRequest.customer} •{" "}
                    {activeRequest.type}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                  <SummaryBadge
                    icon={<FileText className="h-4 w-4" />}
                    label="Approval"
                    value={activeRequest.customerApprovalStatus || "Not Sent"}
                  />
                  <SummaryBadge
                    icon={<ReceiptText className="h-4 w-4" />}
                    label="Quotation"
                    value={existingQuotation?.quotationNo || "New Draft"}
                  />
                  <SummaryBadge
                    icon={<Calculator className="h-4 w-4" />}
                    label="Currency"
                    value={formState.currency}
                  />
                </div>
              </div>
            </div>

            {!canCreateQuotation && (
              <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <div>
                  <p className="font-bold">
                    Customer approval is required before quotation creation.
                  </p>
                  <p className="mt-1">
                    Please update Customer Approval to Approved before creating
                    a quotation draft.
                  </p>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                {successMessage}
              </div>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">Quotation Inputs</h3>
              <p className="mt-1 text-xs text-slate-500">
                Enter per-unit cost values. The system will calculate selling
                price and total quotation value.
              </p>

              <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                <Field label="Order Quantity">
                  <NumberInput
                    value={formState.orderQuantity}
                    disabled={!canCreateQuotation || isSaving}
                    onChange={(value) =>
                      setFormState((current) => ({
                        ...current,
                        orderQuantity: value,
                      }))
                    }
                  />
                </Field>

                <Field label="Currency">
                  <select
                    value={formState.currency}
                    disabled={!canCreateQuotation || isSaving}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        currency: event.target.value as QuotationCurrency,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="USD">USD</option>
                    <option value="BDT">BDT</option>
                  </select>
                </Field>

                <Field label="Exchange Rate">
                  <NumberInput
                    value={formState.exchangeRate}
                    disabled={!canCreateQuotation || isSaving}
                    onChange={(value) =>
                      setFormState((current) => ({
                        ...current,
                        exchangeRate: value,
                      }))
                    }
                  />
                </Field>

                <Field label="Material Cost / Unit">
                  <NumberInput
                    value={formState.materialCost}
                    disabled={!canCreateQuotation || isSaving}
                    onChange={(value) =>
                      setFormState((current) => ({
                        ...current,
                        materialCost: value,
                      }))
                    }
                  />
                </Field>

                <Field label="Labor Cost / Unit">
                  <NumberInput
                    value={formState.laborCost}
                    disabled={!canCreateQuotation || isSaving}
                    onChange={(value) =>
                      setFormState((current) => ({
                        ...current,
                        laborCost: value,
                      }))
                    }
                  />
                </Field>

                <Field label="Overhead Cost / Unit">
                  <NumberInput
                    value={formState.overheadCost}
                    disabled={!canCreateQuotation || isSaving}
                    onChange={(value) =>
                      setFormState((current) => ({
                        ...current,
                        overheadCost: value,
                      }))
                    }
                  />
                </Field>

                <Field label="Wastage Cost / Unit">
                  <NumberInput
                    value={formState.wastageCost}
                    disabled={!canCreateQuotation || isSaving}
                    onChange={(value) =>
                      setFormState((current) => ({
                        ...current,
                        wastageCost: value,
                      }))
                    }
                  />
                </Field>

                <Field label="Margin %">
                  <NumberInput
                    value={formState.marginPercent}
                    disabled={!canCreateQuotation || isSaving}
                    onChange={(value) =>
                      setFormState((current) => ({
                        ...current,
                        marginPercent: value,
                      }))
                    }
                  />
                </Field>

                <Field label="Prepared By">
                  <input
                    type="text"
                    value={formState.preparedBy}
                    disabled={!canCreateQuotation || isSaving}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        preparedBy: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-bold text-slate-900">
                Auto Calculated Cost Summary
              </h3>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
                <ResultCard
                  label="Unit Cost"
                  value={formatMoney(calculation.unitCost, formState.currency)}
                />
                <ResultCard
                  label="Unit Selling Price"
                  value={formatMoney(
                    calculation.unitSellingPrice,
                    formState.currency,
                  )}
                />
                <ResultCard
                  label="Total Quotation Value"
                  value={formatMoney(
                    calculation.totalSellingValue,
                    formState.currency,
                  )}
                />
                <ResultCard
                  label="Total Value in BDT"
                  value={`BDT ${formatNumber(calculation.totalSellingValueBdt)}`}
                />
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <Field label="Quotation Notes">
                <textarea
                  rows={4}
                  value={formState.notes}
                  disabled={!canCreateQuotation || isSaving}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Example: Price calculated based on sample BOM and current USD/BDT exchange rate."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </Field>
            </section>

            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {formError}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSaving}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Close
              </button>

              <button
                type="submit"
                disabled={!canCreateQuotation || isSaving}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Quotation Draft"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

function SummaryBadge({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <div className="mb-1 flex items-center gap-2 text-slate-400">{icon}</div>
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 max-w-[160px] truncate text-xs font-bold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function NumberInput({
  value,
  disabled,
  onChange,
}: {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="number"
      min={0}
      step="0.01"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60"
    />
  );
}

function ResultCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-slate-900">{value}</p>
    </div>
  );
}

function createFormStateFromQuotation(
  quotation: QuotationDraft,
): QuotationFormState {
  return {
    orderQuantity: String(quotation.orderQuantity),
    currency: quotation.currency,
    exchangeRate: String(quotation.exchangeRate),
    materialCost: String(quotation.materialCost),
    laborCost: String(quotation.laborCost),
    overheadCost: String(quotation.overheadCost),
    wastageCost: String(quotation.wastageCost),
    marginPercent: String(quotation.marginPercent),
    preparedBy: quotation.preparedBy,
    notes: quotation.notes || "",
  };
}

function parseNumber(value: string) {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function formatMoney(value: number, currency: QuotationCurrency) {
  return `${currency} ${formatNumber(value)}`;
}

function formatNumber(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
