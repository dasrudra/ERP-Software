import { FormEvent, useEffect, useState } from "react";
import {
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileSearch,
  Layers,
  ListChecks,
  ShieldCheck,
} from "lucide-react";
import {
  getProcessCardByRequestId,
  SaveProcessCardDraftPayload,
  saveProcessCardDraft,
} from "@/api/productDevelopment";
import { Modal } from "@/components/ui/Modal";
import {
  DevelopmentRequest,
  ProcessCard,
  ProcessCardApprovalStatus,
  ProcessCardStep,
} from "@/types/productDevelopment";

type ProcessCardModalProps = {
  request: DevelopmentRequest | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
};

type ProcessCardFormState = {
  materialName: string;
  materialSpecification: string;
  estimatedConsumption: string;
  colorSizeMaterialDetails: string;
  qcRequirements: string;
  approvalStatus: ProcessCardApprovalStatus;
  preparedBy: string;
  targetDate: string;
  steps: ProcessCardStep[];
};

export function ProcessCardModal({
  request,
  onClose,
  onSaved,
}: ProcessCardModalProps) {
  const [formState, setFormState] = useState<ProcessCardFormState | null>(null);
  const [existingProcessCard, setExistingProcessCard] =
    useState<ProcessCard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProcessCard() {
      if (!request) {
        setFormState(null);
        setExistingProcessCard(null);
        return;
      }

      try {
        setIsLoading(true);
        setFormError(null);
        setSuccessMessage(null);

        const processCard = await getProcessCardByRequestId(activeRequest.id);

        if (!isMounted) {
          return;
        }

        setExistingProcessCard(processCard || null);
        setFormState(createInitialFormState(request, processCard));
      } catch (err) {
        if (isMounted) {
          setFormError(
            err instanceof Error ? err.message : "Failed to load process card.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProcessCard();

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

  function updateStepText(
    index: number,
    field: "operationName" | "workCenter" | "instruction" | "qcCheckpoint",
    value: string,
  ) {
    setFormState((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        steps: current.steps.map((step, stepIndex) =>
          stepIndex === index ? { ...step, [field]: value } : step,
        ),
      };
    });
  }

  function updateStepMinutes(index: number, value: string) {
    const numericValue = Number(value);

    setFormState((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        steps: current.steps.map((step, stepIndex) =>
          stepIndex === index
            ? {
                ...step,
                estimatedMinutes: Number.isFinite(numericValue)
                  ? numericValue
                  : 0,
              }
            : step,
        ),
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formState) {
      return;
    }

    if (!formState.materialName.trim()) {
      setFormError("Main material is required.");
      return;
    }

    if (!formState.qcRequirements.trim()) {
      setFormError("QC requirement is required.");
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

      const payload: SaveProcessCardDraftPayload = {
        materials: [
          {
            id: "MAT-001",
            materialName: formState.materialName.trim(),
            specification: formState.materialSpecification.trim(),
            unit: "PCS",
            estimatedConsumption: formState.estimatedConsumption.trim(),
            remarks: formState.colorSizeMaterialDetails.trim() || undefined,
          },
        ],
        steps: formState.steps,
        qcRequirements: formState.qcRequirements.trim(),
        approvalStatus: formState.approvalStatus,
        preparedBy: formState.preparedBy.trim(),
        targetDate: formState.targetDate || undefined,
      };

      const savedProcessCard = await saveProcessCardDraft(
        activeRequest.id,
        payload,
      );

      setExistingProcessCard(savedProcessCard);
      setSuccessMessage("Process Card Draft Saved");

      await onSaved();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Failed to save process card draft.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Modal
      isOpen={Boolean(request)}
      title="Process Card"
      description="Prepare material requirement, production steps, QC checks, and approval details."
      onClose={handleClose}
      closeDisabled={isSaving}
      maxWidthClassName="max-w-6xl"
    >
      <div className="px-6 py-6">
        {isLoading || !formState ? (
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
                    icon={<FileSearch className="h-4 w-4" />}
                    label="Source Inquiry"
                    value={activeRequest.sourceInquiryNo || "Manual"}
                  />
                  <SummaryBadge
                    icon={<FileCheck2 className="h-4 w-4" />}
                    label="Artwork"
                    value={activeRequest.artwork}
                  />
                  <SummaryBadge
                    icon={<ClipboardList className="h-4 w-4" />}
                    label="Card No"
                    value={existingProcessCard?.processCardNo || "New Draft"}
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
                <Layers className="h-5 w-5 text-accent" />
                <div>
                  <h3 className="font-bold text-slate-900">
                    Material Requirement
                  </h3>
                  <p className="text-xs text-slate-500">
                    Define the main material and consumption details for sample
                    or bulk development.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="Main Material">
                  <input
                    type="text"
                    value={formState.materialName}
                    onChange={(event) =>
                      setFormState((current) =>
                        current
                          ? { ...current, materialName: event.target.value }
                          : current,
                      )
                    }
                    className="input-style"
                  />
                </Field>

                <Field label="Specification">
                  <input
                    type="text"
                    value={formState.materialSpecification}
                    onChange={(event) =>
                      setFormState((current) =>
                        current
                          ? {
                              ...current,
                              materialSpecification: event.target.value,
                            }
                          : current,
                      )
                    }
                    className="input-style"
                  />
                </Field>

                <Field label="Estimated Consumption">
                  <input
                    type="text"
                    value={formState.estimatedConsumption}
                    onChange={(event) =>
                      setFormState((current) =>
                        current
                          ? {
                              ...current,
                              estimatedConsumption: event.target.value,
                            }
                          : current,
                      )
                    }
                    className="input-style"
                  />
                </Field>

                <Field label="Color / Size / Material Details">
                  <input
                    type="text"
                    value={formState.colorSizeMaterialDetails}
                    onChange={(event) =>
                      setFormState((current) =>
                        current
                          ? {
                              ...current,
                              colorSizeMaterialDetails: event.target.value,
                            }
                          : current,
                      )
                    }
                    className="input-style"
                  />
                </Field>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-5 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-accent" />
                <div>
                  <h3 className="font-bold text-slate-900">Process Steps</h3>
                  <p className="text-xs text-slate-500">
                    Prepare the standard development route from design review to
                    customer approval.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {formState.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm font-black text-slate-900">
                        Step {step.sequence}: {step.operationName}
                      </p>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500">
                        {step.estimatedMinutes} min
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field label="Operation Name">
                        <input
                          type="text"
                          value={step.operationName}
                          onChange={(event) =>
                            updateStepText(
                              index,
                              "operationName",
                              event.target.value,
                            )
                          }
                          className="input-style"
                        />
                      </Field>

                      <Field label="Work Center">
                        <input
                          type="text"
                          value={step.workCenter}
                          onChange={(event) =>
                            updateStepText(
                              index,
                              "workCenter",
                              event.target.value,
                            )
                          }
                          className="input-style"
                        />
                      </Field>

                      <Field label="Instruction">
                        <textarea
                          rows={3}
                          value={step.instruction}
                          onChange={(event) =>
                            updateStepText(
                              index,
                              "instruction",
                              event.target.value,
                            )
                          }
                          className="input-style resize-none"
                        />
                      </Field>

                      <Field label="QC Checkpoint">
                        <textarea
                          rows={3}
                          value={step.qcCheckpoint}
                          onChange={(event) =>
                            updateStepText(
                              index,
                              "qcCheckpoint",
                              event.target.value,
                            )
                          }
                          className="input-style resize-none"
                        />
                      </Field>

                      <Field label="Estimated Minutes">
                        <input
                          type="number"
                          min={0}
                          value={step.estimatedMinutes}
                          onChange={(event) =>
                            updateStepMinutes(index, event.target.value)
                          }
                          className="input-style"
                        />
                      </Field>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-5 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent" />
                <div>
                  <h3 className="font-bold text-slate-900">QC / Approval</h3>
                  <p className="text-xs text-slate-500">
                    Capture quality requirements, preparation ownership, and
                    approval status.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Field label="QC Requirement">
                  <textarea
                    rows={4}
                    value={formState.qcRequirements}
                    onChange={(event) =>
                      setFormState((current) =>
                        current
                          ? { ...current, qcRequirements: event.target.value }
                          : current,
                      )
                    }
                    className="input-style resize-none"
                  />
                </Field>

                <div className="grid grid-cols-1 gap-5">
                  <Field label="Approval Status">
                    <select
                      value={formState.approvalStatus}
                      onChange={(event) =>
                        setFormState((current) =>
                          current
                            ? {
                                ...current,
                                approvalStatus: event.target
                                  .value as ProcessCardApprovalStatus,
                              }
                            : current,
                        )
                      }
                      className="input-style"
                    >
                      <option value="Pending">Pending</option>
                      <option value="QC Checked">QC Checked</option>
                      <option value="Customer Approved">
                        Customer Approved
                      </option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </Field>

                  <Field label="Prepared By">
                    <input
                      type="text"
                      value={formState.preparedBy}
                      onChange={(event) =>
                        setFormState((current) =>
                          current
                            ? { ...current, preparedBy: event.target.value }
                            : current,
                        )
                      }
                      className="input-style"
                    />
                  </Field>

                  <Field label="Target Date">
                    <input
                      type="date"
                      value={formState.targetDate}
                      onChange={(event) =>
                        setFormState((current) =>
                          current
                            ? { ...current, targetDate: event.target.value }
                            : current,
                        )
                      }
                      className="input-style"
                    />
                  </Field>
                </div>
              </div>
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
                disabled={isSaving}
                className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Process Card Draft"}
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

function createInitialFormState(
  request: DevelopmentRequest,
  processCard?: ProcessCard,
): ProcessCardFormState {
  if (processCard) {
    const primaryMaterial = processCard.materials[0];

    return {
      materialName: primaryMaterial?.materialName || "",
      materialSpecification: primaryMaterial?.specification || "",
      estimatedConsumption: primaryMaterial?.estimatedConsumption || "",
      colorSizeMaterialDetails: primaryMaterial?.remarks || "",
      qcRequirements: processCard.qcRequirements,
      approvalStatus: processCard.approvalStatus,
      preparedBy: processCard.preparedBy,
      targetDate: processCard.targetDate || "",
      steps: processCard.steps,
    };
  }

  return {
    materialName: getDefaultMaterialName(request.type),
    materialSpecification: getDefaultMaterialSpecification(request.type),
    estimatedConsumption: "To be confirmed after sample trial",
    colorSizeMaterialDetails: "As per artwork and customer requirement",
    qcRequirements: getDefaultQcRequirement(request.type),
    approvalStatus: "Pending",
    preparedBy: request.owner || "PD Team",
    targetDate: request.targetDate || "",
    steps: getDefaultProcessSteps(request.type),
  };
}

function getDefaultMaterialName(type: DevelopmentRequest["type"]) {
  switch (type) {
    case "Heat Transfer":
      return "Heat transfer film / ink";
    case "Gum Tape":
      return "Kraft paper and adhesive gum";
    case "Label":
      return "Label base material";
    case "Silica Gel":
      return "Silica gel and pouch material";
    default:
      return "Main production material";
  }
}

function getDefaultMaterialSpecification(type: DevelopmentRequest["type"]) {
  switch (type) {
    case "Heat Transfer":
      return "Film, ink, adhesive, and peel type as per artwork";
    case "Gum Tape":
      return "Width, length, adhesive strength, and print requirement";
    case "Label":
      return "Material, size, color, and finishing requirement";
    case "Silica Gel":
      return "Gram weight, pouch size, and printed warning text";
    default:
      return "Specification according to customer requirement";
  }
}

function getDefaultQcRequirement(type: DevelopmentRequest["type"]) {
  switch (type) {
    case "Heat Transfer":
      return "Check artwork accuracy, color matching, peel type, wash durability, and adhesion.";
    case "Gum Tape":
      return "Check print clarity, adhesive strength, roll size, and carton sealing performance.";
    case "Label":
      return "Check size, color, print clarity, material quality, and finishing.";
    case "Silica Gel":
      return "Check weight, sealing, pouch quality, warning text, and moisture absorption requirement.";
    default:
      return "Check product quality according to customer specification.";
  }
}

function getDefaultProcessSteps(
  type: DevelopmentRequest["type"],
): ProcessCardStep[] {
  return [
    {
      id: "STEP-001",
      sequence: 1,
      operationName: "Design Review",
      workCenter: "PD Design Desk",
      instruction: `Review customer artwork and confirm ${type} specification.`,
      qcCheckpoint: "Artwork, color, size, and customer instruction checked.",
      estimatedMinutes: 30,
    },
    {
      id: "STEP-002",
      sequence: 2,
      operationName: "Sample Making",
      workCenter: "Sampling Area",
      instruction:
        "Prepare sample according to approved artwork and material requirement.",
      qcCheckpoint:
        "Sample output matches artwork and development requirement.",
      estimatedMinutes: 60,
    },
    {
      id: "STEP-003",
      sequence: 3,
      operationName: "QC Check",
      workCenter: "Quality Desk",
      instruction:
        "Perform quality check before sending sample for customer review.",
      qcCheckpoint: "Defect, color, size, material, and finishing checked.",
      estimatedMinutes: 25,
    },
    {
      id: "STEP-004",
      sequence: 4,
      operationName: "Customer Approval",
      workCenter: "Commercial / PD Follow-up",
      instruction: "Send sample or process card output for customer approval.",
      qcCheckpoint: "Approval feedback recorded before bulk order or revision.",
      estimatedMinutes: 20,
    },
  ];
}
