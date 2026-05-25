import {
  Calculator,
  ClipboardList,
  Clock,
  Eye,
  FileCheck2,
  FileSearch,
  Image as ImageIcon,
  MessageSquareText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DevelopmentRequest } from "@/types/productDevelopment";

type DevelopmentRequestCardProps = {
  request: DevelopmentRequest;
  onViewDetails: (request: DevelopmentRequest) => void;
  onOpenProcessCard: (request: DevelopmentRequest) => void;
  onOpenCustomerApproval: (request: DevelopmentRequest) => void;
  onOpenQuotation: (request: DevelopmentRequest) => void;
};

export function DevelopmentRequestCard({
  request,
  onViewDetails,
  onOpenProcessCard,
  onOpenCustomerApproval,
  onOpenQuotation,
}: DevelopmentRequestCardProps) {
  return (
    <div className="group glass-panel rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-slate-200">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-accent group-hover:bg-accent/5 transition-colors">
          <ImageIcon className="w-6 h-6" />
        </div>

        <span
          className={cn(
            "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
            request.status.includes("Approved")
              ? "bg-emerald-50 text-emerald-600"
              : "bg-amber-50 text-amber-600",
          )}
        >
          {request.status}
        </span>
      </div>

      <h3 className="font-bold text-slate-900 mb-1">{request.name}</h3>

      <p className="text-xs text-slate-500 mb-4">
        {request.customer} • v{request.version}
      </p>

      <div className="space-y-3">
        <InfoRow label="Artwork File">
          <span className="font-bold text-slate-700 flex items-center gap-1 truncate">
            <FileSearch className="w-3 h-3 shrink-0" /> {request.artwork}
          </span>
        </InfoRow>

        <InfoRow label="Attachment">
          {request.artworkAttachment ? (
            <span className="font-bold text-emerald-700 flex items-center gap-1 truncate">
              <FileCheck2 className="w-3 h-3 shrink-0" />
              {request.artworkAttachment.fileType} attached
            </span>
          ) : (
            <span className="font-bold text-slate-400">No file attached</span>
          )}
        </InfoRow>

        <InfoRow label="Process Card">
          <span
            className={cn(
              "font-bold flex items-center gap-1 truncate",
              request.processCardStatus === "Draft"
                ? "text-blue-700"
                : "text-slate-400",
            )}
          >
            <ClipboardList className="w-3 h-3 shrink-0" />
            {request.processCardStatus || "Not Started"}
          </span>
        </InfoRow>

        <InfoRow label="Customer Approval">
          <span
            className={cn(
              "font-bold flex items-center gap-1 truncate",
              getApprovalStatusClass(request.customerApprovalStatus),
            )}
          >
            <MessageSquareText className="w-3 h-3 shrink-0" />
            {request.customerApprovalStatus || "Not Sent"}
          </span>
        </InfoRow>

        <InfoRow label="Quotation">
          <span
            className={cn(
              "font-bold flex items-center gap-1 truncate",
              request.quotationStatus === "Draft"
                ? "text-indigo-700"
                : "text-slate-400",
            )}
          >
            <Calculator className="w-3 h-3 shrink-0" />
            {request.quotationStatus || "Not Started"}
          </span>
        </InfoRow>

        {request.sourceInquiryNo && (
          <InfoRow label="Source Inquiry">
            <span className="font-bold text-slate-700">
              {request.sourceInquiryNo}
            </span>
          </InfoRow>
        )}

        <div className="flex items-center justify-between gap-2 pt-1 text-xs">
          <div className="flex min-w-0 items-center gap-1.5 text-slate-500">
            <Clock className="w-3 h-3 shrink-0" />
            <span className="truncate">Updated {request.lastUpdate}</span>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
            <button
              onClick={() => onViewDetails(request)}
              className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100"
              aria-label={`View details for ${request.name}`}
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenProcessCard(request)}
              className="rounded-lg bg-accent px-2 py-1.5 text-[10px] font-bold text-white"
            >
              Process Card
            </button>

            <button
              onClick={() => onOpenCustomerApproval(request)}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[10px] font-bold text-slate-700 hover:bg-slate-50"
            >
              Customer Approval
            </button>

            <button
              onClick={() => onOpenQuotation(request)}
              className="rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-1.5 text-[10px] font-bold text-indigo-700 hover:bg-indigo-100"
            >
              Create Quotation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs p-2 bg-slate-50 rounded-lg">
      <span className="text-slate-500">{label}:</span>
      {children}
    </div>
  );
}

function getApprovalStatusClass(
  status?: DevelopmentRequest["customerApprovalStatus"],
) {
  switch (status) {
    case "Approved":
      return "text-emerald-700";
    case "Revision Required":
      return "text-amber-700";
    case "Rejected":
      return "text-red-700";
    case "Sent for Review":
      return "text-blue-700";
    case "Not Sent":
    default:
      return "text-slate-400";
  }
}
