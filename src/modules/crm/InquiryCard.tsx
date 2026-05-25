import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  MoreVertical,
  User as UserIcon,
} from "lucide-react";
import { ERPStatus, Inquiry } from "@/types/erp";
import { cn } from "@/lib/utils";

type InquiryCardProps = {
  inquiry: Inquiry;
  onViewDetails: (inquiry: Inquiry) => void;
  onConnectPD: (inquiry: Inquiry) => void;
};

export function InquiryCard({
  inquiry,
  onViewDetails,
  onConnectPD,
}: InquiryCardProps) {
  const getStatusIcon = (status: ERPStatus) => {
    switch (status) {
      case ERPStatus.IN_PROGRESS:
        return <Clock className="w-3 h-3 text-blue-500" />;
      case ERPStatus.APPROVED:
        return <CheckCircle2 className="w-3 h-3 text-emerald-500" />;
      case ERPStatus.PENDING_APPROVAL:
        return <AlertCircle className="w-3 h-3 text-amber-500" />;
      default:
        return <FileText className="w-3 h-3 text-slate-400" />;
    }
  };

  const getStatusClass = (status: ERPStatus) => {
    switch (status) {
      case ERPStatus.IN_PROGRESS:
        return "bg-blue-50 text-blue-600 border-blue-100";
      case ERPStatus.APPROVED:
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case ERPStatus.PENDING_APPROVAL:
        return "bg-amber-50 text-amber-600 border-amber-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="group glass-panel rounded-2xl border border-slate-200 hover:border-accent/40 hover:shadow-md transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
              <Mail className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 group-hover:text-accent transition-colors">
                  {inquiry.subject}
                </h3>

                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                    inquiry.priority === "High"
                      ? "bg-rose-50 text-rose-600 border-rose-100"
                      : inquiry.priority === "Medium"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-blue-50 text-blue-600 border-blue-100",
                  )}
                >
                  {inquiry.priority} Priority
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-0.5">
                ID: {inquiry.inquiryNo} • Received on {inquiry.receivedDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize",
                getStatusClass(inquiry.status),
              )}
            >
              {getStatusIcon(inquiry.status)}
              {inquiry.status}
            </div>

            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-6 mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
              <UserIcon className="w-4 h-4 text-slate-600" />
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900">
                {inquiry.customer.name}
              </p>
              <p className="text-[10px] text-slate-500">
                {inquiry.customer.contactPerson} • {inquiry.customer.country}
              </p>
            </div>
          </div>

          <div className="flex-1">
            <p className="text-sm text-slate-600 line-clamp-1 italic">
              "{inquiry.description}"
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onViewDetails(inquiry)}
              className="text-xs font-bold text-accent hover:underline"
            >
              View Details
            </button>

            <button
              onClick={() => onConnectPD(inquiry)}
              className="px-4 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              Connect PD Request
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
