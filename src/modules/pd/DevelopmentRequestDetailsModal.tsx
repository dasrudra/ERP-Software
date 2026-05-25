import type { ReactNode } from "react";
import {
  Calculator,
  CalendarDays,
  ClipboardList,
  FileCheck2,
  FileSearch,
  MessageSquareText,
  UserRound,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { DevelopmentRequest } from "@/types/productDevelopment";

type DevelopmentRequestDetailsModalProps = {
  request: DevelopmentRequest | null;
  onClose: () => void;
};

export function DevelopmentRequestDetailsModal({
  request,
  onClose,
}: DevelopmentRequestDetailsModalProps) {
  if (!request) {
    return null;
  }

  return (
    <Modal
      isOpen={Boolean(request)}
      title="Development Request Details"
      description="Review development request information, artwork, process card, customer approval, and quotation status."
      onClose={onClose}
      maxWidthClassName="max-w-5xl"
    >
      <div className="space-y-6 px-6 py-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {request.id}
              </p>
              <h3 className="mt-1 text-xl font-black text-slate-900">
                {request.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                {request.customer} • {request.type} • v{request.version}
              </p>
            </div>

            <span className="w-fit rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-700">
              {request.status}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
          <InfoCard
            icon={<UserRound className="h-4 w-4" />}
            label="Owner"
            value={request.owner || "PD Team"}
          />

          <InfoCard
            icon={<CalendarDays className="h-4 w-4" />}
            label="Target Date"
            value={request.targetDate || "Not set"}
          />

          <InfoCard
            icon={<FileSearch className="h-4 w-4" />}
            label="Source Inquiry"
            value={request.sourceInquiryNo || "Manual request"}
          />

          <InfoCard
            icon={<ClipboardList className="h-4 w-4" />}
            label="Process Card"
            value={request.processCardStatus || "Not Started"}
          />

          <InfoCard
            icon={<MessageSquareText className="h-4 w-4" />}
            label="Customer Approval"
            value={request.customerApprovalStatus || "Not Sent"}
          />

          <InfoCard
            icon={<Calculator className="h-4 w-4" />}
            label="Quotation"
            value={request.quotationStatus || "Not Started"}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Artwork & Attachment
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Artwork File Name
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {request.artwork}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Attachment Status
              </p>

              {request.artworkAttachment ? (
                <p className="mt-1 flex items-center gap-2 font-semibold text-emerald-700">
                  <FileCheck2 className="h-4 w-4" />
                  {request.artworkAttachment.fileType} file attached
                </p>
              ) : (
                <p className="mt-1 font-semibold text-slate-500">
                  No file attached
                </p>
              )}
            </div>
          </div>

          {request.artworkAttachment && (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                Attached Artwork File
              </p>

              <div className="mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-4">
                <AttachmentInfo
                  label="File Name"
                  value={request.artworkAttachment.fileName}
                />
                <AttachmentInfo
                  label="File Type"
                  value={request.artworkAttachment.fileType}
                />
                <AttachmentInfo
                  label="File Size"
                  value={formatFileSize(request.artworkAttachment.fileSize)}
                />
                <AttachmentInfo
                  label="Upload Date"
                  value={request.artworkAttachment.uploadDate}
                />
              </div>

              {request.artworkAttachment.url && (
                <a
                  href={request.artworkAttachment.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                >
                  Preview Attachment
                </a>
              )}
            </div>
          )}
        </div>

        <StatusSection
          title="Process Card Status"
          items={[
            {
              label: "Process Card No",
              value: request.processCardNo || "Not generated yet",
            },
            {
              label: "Current Status",
              value: request.processCardStatus || "Not Started",
            },
          ]}
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Customer Approval
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <SimpleInfo
              label="Approval Status"
              value={request.customerApprovalStatus || "Not Sent"}
            />
            <SimpleInfo
              label="Approval Date"
              value={request.customerApprovalDate || "Not set"}
            />
            <SimpleInfo
              label="Updated By"
              value={request.customerApprovalUpdatedBy || "Not updated"}
            />
          </div>

          {request.customerFeedback && (
            <div className="mt-4 rounded-xl bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Customer Feedback
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                {request.customerFeedback}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Quotation / Costing
          </p>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <SimpleInfo
              label="Quotation No"
              value={request.quotationNo || "Not generated yet"}
            />
            <SimpleInfo
              label="Quotation Status"
              value={request.quotationStatus || "Not Started"}
            />
            <SimpleInfo
              label="Quotation Value"
              value={
                request.quotationTotalValue
                  ? `${request.quotationCurrency || ""} ${formatNumber(
                      request.quotationTotalValue,
                    )}`
                  : "Not calculated"
              }
            />
          </div>
        </div>

        {request.notes && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
              Notes
            </p>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {request.notes}
            </p>
          </div>
        )}

        <div className="flex justify-end border-t border-slate-100 pt-5">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-slate-400">{icon}</div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function StatusSection({
  title,
  items,
}: {
  title: string;
  items: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item) => (
          <SimpleInfo key={item.label} label={item.label} value={item.value} />
        ))}
      </div>
    </div>
  );
}

function SimpleInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function AttachmentInfo({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-emerald-700/70">
        {label}
      </p>
      <p className="mt-1 break-words font-semibold text-emerald-950">{value}</p>
    </div>
  );
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

function formatNumber(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
