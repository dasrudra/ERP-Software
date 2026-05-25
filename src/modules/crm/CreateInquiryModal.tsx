import { FormEvent, useState } from "react";
import { CreateInquiryPayload } from "@/api/crm";
import { Modal } from "@/components/ui/Modal";
import { mockCustomers } from "@/mock/customers";
import { Priority } from "@/types/erp";

type InquiryFormState = {
  customerId: string;
  subject: string;
  description: string;
  priority: Priority;
  requiredDate: string;
};

type CreateInquiryModalProps = {
  isOpen: boolean;
  isCreating: boolean;
  onClose: () => void;
  onCreateInquiry: (payload: CreateInquiryPayload) => Promise<void>;
};

const initialFormState: InquiryFormState = {
  customerId: mockCustomers[0]?.id ?? "",
  subject: "",
  description: "",
  priority: "Medium",
  requiredDate: "",
};

export function CreateInquiryModal({
  isOpen,
  isCreating,
  onClose,
  onCreateInquiry,
}: CreateInquiryModalProps) {
  const [formState, setFormState] =
    useState<InquiryFormState>(initialFormState);
  const [formError, setFormError] = useState<string | null>(null);

  function resetAndClose() {
    if (isCreating) {
      return;
    }

    setFormState(initialFormState);
    setFormError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const selectedCustomer = mockCustomers.find(
      (customer) => customer.id === formState.customerId,
    );

    if (!selectedCustomer) {
      setFormError("Please select a valid customer.");
      return;
    }

    if (!formState.subject.trim()) {
      setFormError("Subject is required.");
      return;
    }

    if (!formState.description.trim()) {
      setFormError("Description is required.");
      return;
    }

    try {
      setFormError(null);

      await onCreateInquiry({
        customer: selectedCustomer,
        subject: formState.subject.trim(),
        description: formState.description.trim(),
        priority: formState.priority,
        requiredDate: formState.requiredDate || undefined,
      });

      setFormState(initialFormState);
      onClose();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to create inquiry.",
      );
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      title="Create New Inquiry"
      description="Register a new customer inquiry for Alpha product development or commercial follow-up."
      onClose={resetAndClose}
      closeDisabled={isCreating}
    >
      <form onSubmit={handleSubmit} className="px-6 py-6">
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              Customer
            </label>
            <select
              value={formState.customerId}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  customerId: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
            >
              {mockCustomers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} ({customer.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={formState.subject}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  subject: event.target.value,
                }))
              }
              placeholder="Example: New reflective label development"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
              Description
            </label>
            <textarea
              value={formState.description}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Describe customer requirement, artwork needs, expected usage, or commercial context."
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                Priority
              </label>
              <select
                value={formState.priority}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    priority: event.target.value as Priority,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
                Required Date
              </label>
              <input
                type="date"
                value={formState.requiredDate}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    requiredDate: event.target.value,
                  }))
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          {formError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {formError}
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
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
            {isCreating ? "Saving..." : "Save Inquiry"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
