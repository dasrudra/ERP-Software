import { ChangeEvent, FormEvent, useState } from "react";
import { FileUp, X } from "lucide-react";
import { CreateDevelopmentRequestPayload } from "@/api/productDevelopment";
import { Modal } from "@/components/ui/Modal";
import { ArtworkAttachment, DevelopmentType } from "@/types/productDevelopment";

type CreateDevelopmentRequestModalProps = {
  isOpen: boolean;
  isCreating: boolean;
  onClose: () => void;
  onCreateRequest: (payload: CreateDevelopmentRequestPayload) => Promise<void>;
};

type DevelopmentRequestFormState = {
  name: string;
  customer: string;
  type: DevelopmentType;
  artwork: string;
  owner: string;
  targetDate: string;
  sourceInquiryNo: string;
  notes: string;
};

const initialFormState: DevelopmentRequestFormState = {
  name: "",
  customer: "",
  type: "Heat Transfer",
  artwork: "",
  owner: "PD Team",
  targetDate: "",
  sourceInquiryNo: "",
  notes: "",
};

export function CreateDevelopmentRequestModal({
  isOpen,
  isCreating,
  onClose,
  onCreateRequest,
}: CreateDevelopmentRequestModalProps) {
  const [formState, setFormState] =
    useState<DevelopmentRequestFormState>(initialFormState);
  const [selectedArtworkFile, setSelectedArtworkFile] = useState<File | null>(
    null,
  );
  const [formError, setFormError] = useState<string | null>(null);

  function resetAndClose() {
    if (isCreating) {
      return;
    }

    setFormState(initialFormState);
    setSelectedArtworkFile(null);
    setFormError(null);
    onClose();
  }

  function handleArtworkFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedArtworkFile(null);
      return;
    }

    const isValidFile = isAllowedArtworkFile(file);

    if (!isValidFile) {
      setSelectedArtworkFile(null);
      setFormError("Only PDF or AI artwork files are allowed.");
      event.target.value = "";
      return;
    }

    setFormError(null);
    setSelectedArtworkFile(file);

    setFormState((current) => ({
      ...current,
      artwork: file.name,
    }));
  }

  function removeSelectedArtworkFile() {
    setSelectedArtworkFile(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!formState.name.trim()) {
      setFormError("Development request name is required.");
      return;
    }

    if (!formState.customer.trim()) {
      setFormError("Customer is required.");
      return;
    }

    if (!formState.artwork.trim()) {
      setFormError("Artwork file name is required.");
      return;
    }

    try {
      setFormError(null);

      await onCreateRequest({
        name: formState.name.trim(),
        customer: formState.customer.trim(),
        type: formState.type,
        artwork: formState.artwork.trim(),
        owner: formState.owner.trim() || "PD Team",
        targetDate: formState.targetDate || undefined,
        sourceInquiryNo: formState.sourceInquiryNo.trim() || undefined,
        notes: formState.notes.trim() || undefined,
        artworkAttachment: selectedArtworkFile
          ? createArtworkAttachment(selectedArtworkFile)
          : undefined,
      });

      setFormState(initialFormState);
      setSelectedArtworkFile(null);
      onClose();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Failed to create development request.",
      );
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Create New Development Request"
      description="Register a new sample, artwork, or product development request."
      onClose={resetAndClose}
      closeDisabled={isCreating}
      maxWidthClassName="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="px-6 py-6">
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Request Name
            </label>
            <input
              type="text"
              value={formState.name}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="Example: Reflective Label Sample Development"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Customer
              </label>
              <input
                type="text"
                value={formState.customer}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    customer: event.target.value,
                  }))
                }
                placeholder="Example: Youngone Korea HQ"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Development Type
              </label>
              <select
                value={formState.type}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    type: event.target.value as DevelopmentType,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
              >
                <option value="Heat Transfer">Heat Transfer</option>
                <option value="Gum Tape">Gum Tape</option>
                <option value="Label">Label</option>
                <option value="Silica Gel">Silica Gel</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Artwork File Name
            </label>
            <input
              type="text"
              value={formState.artwork}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  artwork: event.target.value,
                }))
              }
              placeholder="Example: reflective_label_v1.ai"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Attach Artwork File
            </label>

            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl bg-white px-4 py-6 text-center transition hover:bg-slate-50">
                <FileUp className="mb-2 h-7 w-7 text-slate-400" />
                <span className="text-sm font-bold text-slate-800">
                  Upload PDF/AI Artwork
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  Allowed file types: .pdf, .ai
                </span>

                <input
                  type="file"
                  accept=".pdf,.ai,application/pdf,application/postscript"
                  onChange={handleArtworkFileChange}
                  disabled={isCreating}
                  className="hidden"
                />
              </label>

              {selectedArtworkFile && (
                <div className="mt-4 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-bold text-emerald-900">
                      {selectedArtworkFile.name}
                    </p>
                    <p className="text-xs text-emerald-700">
                      {formatFileSize(selectedArtworkFile.size)} • Ready to
                      attach
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeSelectedArtworkFile}
                    disabled={isCreating}
                    className="rounded-lg p-2 text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Remove selected artwork file"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Owner
              </label>
              <input
                type="text"
                value={formState.owner}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    owner: event.target.value,
                  }))
                }
                placeholder="PD Team"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
              />
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
                Source Inquiry
              </label>
              <input
                type="text"
                value={formState.sourceInquiryNo}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    sourceInquiryNo: event.target.value,
                  }))
                }
                placeholder="INQ-2026-0004"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Notes
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
              placeholder="Example: Customer requested sample before bulk confirmation. Artwork and wash test need to be reviewed."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          {formError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {formError}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={resetAndClose}
            disabled={isCreating}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isCreating}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating ? "Saving..." : "Save Development Request"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function isAllowedArtworkFile(file: File) {
  const fileName = file.name.toLowerCase();

  return fileName.endsWith(".pdf") || fileName.endsWith(".ai");
}

function createArtworkAttachment(file: File): ArtworkAttachment {
  return {
    id: `ART-${Date.now()}`,
    fileName: file.name,
    fileType: getReadableFileType(file),
    fileSize: file.size,
    uploadDate: new Date().toISOString().slice(0, 10),
    url: URL.createObjectURL(file),
  };
}

function getReadableFileType(file: File) {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith(".pdf")) {
    return "PDF";
  }

  if (fileName.endsWith(".ai")) {
    return "AI";
  }

  return file.type || "Unknown";
}

function formatFileSize(sizeInBytes: number) {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} B`;
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
}
