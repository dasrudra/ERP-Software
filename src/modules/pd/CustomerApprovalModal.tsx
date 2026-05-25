import { FormEvent, useEffect, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  MessageSquareText,
  Send,
  UserRoundCheck,
} from "lucide-react";
import {
  getCustomerApprovalByRequestId,
  SaveCustomerApprovalPayload,
  saveCustomerApprovalUpdate,
} from "@/api/productDevelopment";
import { Modal } from "@/components/ui/Modal";
import {
  CustomerApprovalStatus,
  CustomerApprovalUpdate,
  DevelopmentRequest,
} from "@/types/productDevelopment";

type CustomerApprovalModalProps = {
  request: DevelopmentRequest | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
};

type CustomerApprovalFormState = {
  status: CustomerApprovalStatus;
  feedback: string;
  approvalDate: string;
  updatedBy: string;
};

const approvalStatusOptions: CustomerApprovalStatus[] = [
  "Not Sent",
  "Sent for Review",
  "Approved",
  "Revision Required",
  "Rejected",
];

export function CustomerApprovalModal({
  request,
  onClose,
  onSaved,
}: CustomerApprovalModalProps) {
  const [formState, setFormState] = useState<CustomerApprovalFormState>({
    status: "Not Sent",
    feedback: "",
    approvalDate: "",
    updatedBy: "PD Team",
  });
  const [existingApproval, setExistingApproval] =
    useState<CustomerApprovalUpdate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadApproval() {
      if (!request) {
        setExistingApproval(null);
        setFormState({
          status: "Not Sent",
          feedback: "",
          approvalDate: "",
          updatedBy: "PD Team",
        });
        return;
      }

      try {
        setIsLoading(true);
        setFormError(null);
        setSuccessMessage(null);

        const approval = await getCustomerApprovalByRequestId(request.id);

        if (!isMounted) {
          return;
        }

        setExistingApproval(approval || null);
        setFormState({
          status:
            approval?.status || request.customerApprovalStatus || "Not Sent",
          feedback: approval?.feedback || request.customerFeedback || "",
          approvalDate:
            approval?.approvalDate || request.customerApprovalDate || "",
          updatedBy:
            approval?.updatedBy ||
            request.customerApprovalUpdatedBy ||
            request.owner ||
            "PD Team",
        });
      } catch (err) {
        if (isMounted) {
          setFormError(
            err instanceof Error
              ? err.message
              : "Failed to load customer approval.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadApproval();

    return () => {
      isMounted = false;
    };
  }, [request]);

  if (!request) {
    return null;
  }

  const activeRequest = request;

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

    if (!formState.updatedBy.trim()) {
      setFormError("Updated by is required.");
      return;
    }

    if (formState.status !== "Not Sent" && !formState.feedback.trim()) {
      setFormError("Customer feedback or approval note is required.");
      return;
    }

    try {
      setIsSaving(true);
      setFormError(null);
      setSuccessMessage(null);

      const payload: SaveCustomerApprovalPayload = {
        status: formState.status,
        feedback: formState.feedback.trim(),
        approvalDate: formState.approvalDate || undefined,
        updatedBy: formState.updatedBy.trim(),
      };

      const savedApproval = await saveCustomerApprovalUpdate(
        activeRequest.id,
        payload,
      );

      setExistingApproval(savedApproval);
      setSuccessMessage("Customer Approval Updated");

      await onSaved();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Failed to save customer approval update.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal
      isOpen={Boolean(activeRequest)}
      title="Customer Approval Tracking"
      description="Track customer review, feedback, approval, revision, or rejection."
      onClose={handleClose}
      closeDisabled={isSaving}
      maxWidthClassName="max-w-5xl"
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
                    Request Summary
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
                    icon={<FileCheck2 className="h-4 w-4" />}
                    label="Artwork"
                    value={activeRequest.artwork}
                  />
                  <SummaryBadge
                    icon={<ClipboardList className="h-4 w-4" />}
                    label="Process Card"
                    value={activeRequest.processCardStatus || "Not Started"}
                  />
                  <SummaryBadge
                    icon={<UserRoundCheck className="h-4 w-4" />}
                    label="Approval"
                    value={formState.status}
                  />
                </div>
              </div>
            </div>

            {successMessage && (
              <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
                {successMessage}
              </div>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-5 flex items-center gap-2">
                <Send className="h-5 w-5 text-accent" />
                <div>
                  <h3 className="font-bold text-slate-900">Approval Status</h3>
                  <p className="text-xs text-slate-500">
                    Update customer review status and approval result.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <Field label="Customer Approval Status">
                  <select
                    value={formState.status}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        status: event.target.value as CustomerApprovalStatus,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
                  >
                    {approvalStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field label="Approval / Feedback Date">
                  <input
                    type="date"
                    value={formState.approvalDate}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        approvalDate: event.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </Field>

                <Field label="Updated By">
                  <input
                    type="text"
                    value={formState.updatedBy}
                    onChange={(event) =>
                      setFormState((current) => ({
                        ...current,
                        updatedBy: event.target.value,
                      }))
                    }
                    placeholder="PD Team"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-5 flex items-center gap-2">
                <MessageSquareText className="h-5 w-5 text-accent" />
                <div>
                  <h3 className="font-bold text-slate-900">
                    Customer Feedback Notes
                  </h3>
                  <p className="text-xs text-slate-500">
                    Record approval comments, revision instructions, or
                    rejection reason.
                  </p>
                </div>
              </div>

              <textarea
                rows={6}
                value={formState.feedback}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    feedback: event.target.value,
                  }))
                }
                placeholder="Example: Customer approved sample color and artwork. Bulk process card can move forward."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
              />
            </section>

            {existingApproval && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Last updated by{" "}
                <span className="font-bold text-slate-900">
                  {existingApproval.updatedBy}
                </span>{" "}
                on{" "}
                <span className="font-bold text-slate-900">
                  {new Date(existingApproval.updatedAt).toLocaleString()}
                </span>
              </div>
            )}

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
                disabled={isSaving}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Approval Update"}
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
