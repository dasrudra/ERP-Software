import { FileText, Mail, User as UserIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Inquiry } from "@/types/erp";
import { cn } from "@/lib/utils";

type InquiryDetailsModalProps = {
  inquiry: Inquiry | null;
  onClose: () => void;
  onConnectPD: (inquiry: Inquiry) => void;
};

function getPriorityClass(priority: Inquiry["priority"]) {
  switch (priority) {
    case "High":
      return "bg-rose-50 text-rose-600 border-rose-100";
    case "Medium":
      return "bg-amber-50 text-amber-600 border-amber-100";
    default:
      return "bg-blue-50 text-blue-600 border-blue-100";
  }
}

export function InquiryDetailsModal({
  inquiry,
  onClose,
  onConnectPD,
}: InquiryDetailsModalProps) {
  if (!inquiry) {
    return null;
  }

  const activeInquiry = inquiry;

  function handleConnectPD() {
    onConnectPD(activeInquiry);
    onClose();
  }

  return (
    <Modal
      isOpen={Boolean(inquiry)}
      title="Inquiry Details"
      description="Review customer inquiry information before product development or commercial follow-up."
      onClose={onClose}
      maxWidthClassName="max-w-3xl"
    >
      <div className="px-6 py-6 space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {inquiry.inquiryNo}
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-900">
                {inquiry.subject}
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-700">
                {inquiry.status}
              </span>
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-bold",
                  getPriorityClass(inquiry.priority),
                )}
              >
                {inquiry.priority} Priority
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-slate-600">
            {inquiry.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-slate-500" />
              <h4 className="text-sm font-bold text-slate-900">
                Customer Information
              </h4>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Customer
                </p>
                <p className="font-semibold text-slate-800">
                  {inquiry.customer.name}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Contact Person
                </p>
                <p className="font-semibold text-slate-800">
                  {inquiry.customer.contactPerson}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Email
                </p>
                <p className="font-semibold text-slate-800">
                  {inquiry.customer.email}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Country
                </p>
                <p className="font-semibold text-slate-800">
                  {inquiry.customer.country}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-500" />
              <h4 className="text-sm font-bold text-slate-900">
                Inquiry Timeline
              </h4>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Received Date
                </p>
                <p className="font-semibold text-slate-800">
                  {inquiry.receivedDate}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Required Date
                </p>
                <p className="font-semibold text-slate-800">
                  {inquiry.requiredDate || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Assigned To
                </p>
                <p className="font-semibold text-slate-800">
                  {inquiry.assignedTo || "Unassigned"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Current Status
                </p>
                <p className="font-semibold text-slate-800">{inquiry.status}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-500" />
            <h4 className="text-sm font-bold text-slate-900">Attachments</h4>
          </div>

          {inquiry.attachments.length === 0 ? (
            <p className="text-sm text-slate-500">
              No files have been attached to this inquiry yet.
            </p>
          ) : (
            <div className="space-y-2">
              {inquiry.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {attachment.fileName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {attachment.fileType} • Uploaded on{" "}
                      {attachment.uploadDate}
                      {attachment.version ? ` • ${attachment.version}` : ""}
                    </p>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500">
                    {(attachment.fileSize / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>

          <button
            onClick={handleConnectPD}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800"
          >
            Connect PD Request
          </button>
        </div>
      </div>
    </Modal>
  );
}
