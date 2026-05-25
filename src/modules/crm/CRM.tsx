import { useState } from "react";
import { Plus, Search, Filter } from "lucide-react";
import { ERPStatus, Inquiry } from "@/types/erp";
import { useInquiries } from "@/hooks/useInquiries";
import { CreateInquiryPayload } from "@/api/crm";
import {
  CreateDevelopmentRequestPayload,
  createDevelopmentRequest,
} from "@/api/productDevelopment";
import { DevelopmentRequest } from "@/types/productDevelopment";
import { KpiCard } from "@/components/ui/KpiCard";
import { CreateInquiryModal } from "./CreateInquiryModal";
import { InquiryCard } from "./InquiryCard";
import { InquiryDetailsModal } from "./InquiryDetailsModal";
import { PDHandoffModal } from "./PDHandoffModal";

type StatusFilter = "All" | ERPStatus;

const statusFilterOptions: StatusFilter[] = [
  "All",
  ERPStatus.DRAFT,
  ERPStatus.PENDING_APPROVAL,
  ERPStatus.IN_PROGRESS,
  ERPStatus.APPROVED,
  ERPStatus.COMPLETED,
];

export function CRM() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [pdHandoffInquiry, setPdHandoffInquiry] = useState<Inquiry | null>(
    null,
  );

  const {
    data: inquiries,
    isLoading,
    isCreating,
    error,
    addInquiry,
  } = useInquiries();

  const totalCount = inquiries.length;
  const draftCount = inquiries.filter(
    (inquiry) => inquiry.status === ERPStatus.DRAFT,
  ).length;
  const pendingApprovalCount = inquiries.filter(
    (inquiry) => inquiry.status === ERPStatus.PENDING_APPROVAL,
  ).length;
  const inProgressCount = inquiries.filter(
    (inquiry) => inquiry.status === ERPStatus.IN_PROGRESS,
  ).length;

  const filteredInquiries = inquiries.filter((inquiry) => {
    const query = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !query ||
      inquiry.id.toLowerCase().includes(query) ||
      inquiry.inquiryNo.toLowerCase().includes(query) ||
      inquiry.subject.toLowerCase().includes(query) ||
      inquiry.description.toLowerCase().includes(query) ||
      inquiry.customer.name.toLowerCase().includes(query) ||
      inquiry.customer.contactPerson.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || inquiry.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  async function handleCreateInquiry(payload: CreateInquiryPayload) {
    const newInquiry = await addInquiry(payload);
    setStatusFilter("All");
    setSelectedInquiry(newInquiry);
  }

  function handleOpenPDHandoff(inquiry: Inquiry) {
    setSelectedInquiry(null);
    setPdHandoffInquiry(inquiry);
  }

  async function handleCreatePDRequest(
    payload: CreateDevelopmentRequestPayload,
  ): Promise<DevelopmentRequest> {
    return createDevelopmentRequest(payload);
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inquiry Management
          </h1>
          <p className="text-slate-500">Loading customer inquiries...</p>
        </div>

        <div className="glass-panel rounded-2xl border border-slate-200 p-6">
          <div className="h-5 w-64 bg-slate-200 rounded animate-pulse mb-4" />
          <div className="h-4 w-full bg-slate-100 rounded animate-pulse mb-2" />
          <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error && inquiries.length === 0) {
    return (
      <div className="glass-panel rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-bold text-red-900">
          Failed to load inquiries
        </h1>
        <p className="text-sm text-red-700 mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Inquiry Management
          </h1>
          <p className="text-slate-500">
            Track and manage customer inquiries from first contact to sales
            order.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-md group"
        >
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Create Inquiry
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Total Inquiries" value={totalCount} badge="All" />

        <KpiCard title="Draft" value={draftCount} badge="New" />

        <KpiCard
          title="Pending Approval"
          value={pendingApprovalCount}
          badge="Waiting"
          valueClassName="text-amber-600"
          badgeClassName="bg-amber-50 text-amber-600"
        />

        <KpiCard
          title="In Progress"
          value={inProgressCount}
          badge="Active"
          valueClassName="text-blue-600"
          badgeClassName="bg-blue-50 text-blue-600"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search inquiries, customers, or IDs..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" /> Filter
          </button>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors w-full sm:w-auto bg-white outline-none focus:ring-2 focus:ring-accent/20"
            aria-label="Filter inquiries by status"
          >
            {statusFilterOptions.map((status) => (
              <option key={status} value={status}>
                Status: {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {error.message}
        </div>
      )}

      {filteredInquiries.length === 0 ? (
        <div className="glass-panel rounded-2xl border border-slate-200 p-10 text-center">
          <h2 className="text-lg font-bold text-slate-900">
            No inquiries found
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Try changing your search term, status filter, or create a new
            inquiry.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredInquiries.map((inquiry) => (
            <InquiryCard
              key={inquiry.id}
              inquiry={inquiry}
              onViewDetails={setSelectedInquiry}
              onConnectPD={handleOpenPDHandoff}
            />
          ))}
        </div>
      )}

      <CreateInquiryModal
        isOpen={isCreateModalOpen}
        isCreating={isCreating}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateInquiry={handleCreateInquiry}
      />

      <InquiryDetailsModal
        inquiry={selectedInquiry}
        onClose={() => setSelectedInquiry(null)}
        onConnectPD={handleOpenPDHandoff}
      />

      <PDHandoffModal
        inquiry={pdHandoffInquiry}
        onClose={() => setPdHandoffInquiry(null)}
        onCreatePDRequest={handleCreatePDRequest}
      />
    </div>
  );
}
