import { FormEvent, useState } from "react";
import { CheckCircle2, FileSymlink } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Inquiry } from "@/types/erp";
import { CreateDevelopmentRequestPayload } from "@/api/productDevelopment";
import {
  DevelopmentRequest,
  DevelopmentType,
} from "@/types/productDevelopment";

type PDHandoffModalProps = {
  inquiry: Inquiry | null;
  onClose: () => void;
  onCreatePDRequest: (
    payload: CreateDevelopmentRequestPayload,
  ) => Promise<DevelopmentRequest>;
};

type PDHandoffFormState = {
  developmentType:
    | "Sample Development"
    | "Artwork Revision"
    | "Bulk Development";
  assignedTeam: "PD Team" | "Commercial Team" | "Production Planning";
  targetDate: string;
  notes: string;
};

const initialFormState: PDHandoffFormState = {
  developmentType: "Sample Development",
  assignedTeam: "PD Team",
  targetDate: "",
  notes: "",
};

export function PDHandoffModal({
  inquiry,
  onClose,
  onCreatePDRequest,
}: PDHandoffModalProps) {
  const [formState, setFormState] =
    useState<PDHandoffFormState>(initialFormState);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdRequest, setCreatedRequest] =
    useState<DevelopmentRequest | null>(null);

  if (!inquiry) {
    return null;
  }

  const activeInquiry = inquiry;

  function handleClose() {
    setFormState(initialFormState);
    setFormError(null);
    setIsSubmitting(false);
    setCreatedRequest(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formState.targetDate) {
      setFormError("Target date is required.");
      return;
    }

    if (!formState.notes.trim()) {
      setFormError("Handoff notes are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError(null);

      const payload: CreateDevelopmentRequestPayload = {
        name: createDevelopmentRequestName(activeInquiry),
        customer: activeInquiry.customer.name,
        type: inferDevelopmentType(activeInquiry),
        artwork: getArtworkName(activeInquiry),
        owner: formState.assignedTeam,
        targetDate: formState.targetDate,
        sourceInquiryNo: activeInquiry.inquiryNo,
        notes: createHandoffNotes(formState, activeInquiry),
      };

      const newRequest = await onCreatePDRequest(payload);

      setCreatedRequest(newRequest);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Failed to create Product Development request.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal
      isOpen={Boolean(activeInquiry)}
      title="Connect Product Development Request"
      description="Create a product development handoff from the selected customer inquiry."
      onClose={handleClose}
      maxWidthClassName="max-w-3xl"
    >
      <div className="px-6 py-6">
        {createdRequest ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-6 w-6 text-emerald-600" />
                <div>
                  <h3 className="text-lg font-bold text-emerald-900">
                    PD Request Created Successfully
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-emerald-700">
                    A real Product Development Request has been created from{" "}
                    <strong>{activeInquiry.inquiryNo}</strong>. You can now open
                    the Product Development module and find{" "}
                    <strong>{createdRequest.id}</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Handoff Summary
              </p>

              <div className="mt-4 grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <SummaryItem label="PD Request ID" value={createdRequest.id} />
                <SummaryItem
                  label="Source Inquiry"
                  value={activeInquiry.inquiryNo}
                />
                <SummaryItem label="Customer" value={createdRequest.customer} />
                <SummaryItem label="Product Type" value={createdRequest.type} />
                <SummaryItem
                  label="Assigned Team"
                  value={createdRequest.owner || "-"}
                />
                <SummaryItem
                  label="Target Date"
                  value={createdRequest.targetDate || "-"}
                />
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-5">
              <button
                onClick={handleClose}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white p-3 text-slate-600">
                  <FileSymlink className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Source Inquiry
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {activeInquiry.subject}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {activeInquiry.inquiryNo} • {activeInquiry.customer.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Development Type
                </label>
                <select
                  value={formState.developmentType}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      developmentType: event.target
                        .value as PDHandoffFormState["developmentType"],
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
                >
                  <option value="Sample Development">Sample Development</option>
                  <option value="Artwork Revision">Artwork Revision</option>
                  <option value="Bulk Development">Bulk Development</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Assigned Team
                </label>
                <select
                  value={formState.assignedTeam}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      assignedTeam: event.target
                        .value as PDHandoffFormState["assignedTeam"],
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
                >
                  <option value="PD Team">PD Team</option>
                  <option value="Commercial Team">Commercial Team</option>
                  <option value="Production Planning">
                    Production Planning
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Target Date
                </label>
                <input
                  type="date"
                  value={formState.targetDate}
                  onChange={(event) =>
                    setFormState((current) => ({
                      ...current,
                      targetDate: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                  Detected Product Type
                </label>
                <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700">
                  {inferDevelopmentType(activeInquiry)}
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Handoff Notes
              </label>
              <textarea
                rows={4}
                value={formState.notes}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
                placeholder="Example: Customer needs artwork review, wash test confirmation, and sample development before bulk order confirmation."
                className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {formError}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? "Creating..." : "Create PD Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function createDevelopmentRequestName(inquiry: Inquiry) {
  return inquiry.subject;
}

function getArtworkName(inquiry: Inquiry) {
  return inquiry.attachments[0]?.fileName || "No artwork attached";
}

function createHandoffNotes(formState: PDHandoffFormState, inquiry: Inquiry) {
  return [
    `Development Type: ${formState.developmentType}`,
    `Source Inquiry: ${inquiry.inquiryNo}`,
    `Customer Contact: ${inquiry.customer.contactPerson}`,
    `Original Inquiry: ${inquiry.description}`,
    `Handoff Notes: ${formState.notes.trim()}`,
  ].join("\n");
}

function inferDevelopmentType(inquiry: Inquiry): DevelopmentType {
  const text = `${inquiry.subject} ${inquiry.description}`.toLowerCase();

  if (text.includes("gum tape") || text.includes("tape")) {
    return "Gum Tape" as DevelopmentType;
  }

  if (text.includes("silica")) {
    return "Silica Gel" as DevelopmentType;
  }

  if (
    text.includes("label") ||
    text.includes("sticker") ||
    text.includes("heat transfer")
  ) {
    return "Heat Transfer" as DevelopmentType;
  }

  return "Label" as DevelopmentType;
}
