import { useState } from "react";
import { Plus, Search, FileSearch, Upload, FileDigit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDevelopmentRequests } from "@/hooks/useDevelopmentRequests";
import { CreateDevelopmentRequestPayload } from "@/api/productDevelopment";
import { DevelopmentRequest } from "@/types/productDevelopment";
import { DevelopmentRequestCard } from "./DevelopmentRequestCard";
import { DevelopmentRequestDetailsModal } from "./DevelopmentRequestDetailsModal";
import { CreateDevelopmentRequestModal } from "./CreateDevelopmentRequestModal";
import { ProcessCardModal } from "./ProcessCardModal";
import { CustomerApprovalModal } from "./CustomerApprovalModal";
import { QuotationDraftModal } from "./QuotationDraftModal";

const statusOverview = [
  { label: "New Inquiry", count: 12, color: "bg-blue-100 text-blue-600" },
  { label: "Design Stage", count: 5, color: "bg-purple-100 text-purple-600" },
  { label: "Sampling", count: 18, color: "bg-amber-100 text-amber-600" },
  { label: "Cust. Review", count: 7, color: "bg-emerald-100 text-emerald-600" },
  { label: "Final Approved", count: 34, color: "bg-slate-100 text-slate-600" },
];

export function ProductDevelopment() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] =
    useState<DevelopmentRequest | null>(null);
  const [processCardRequest, setProcessCardRequest] =
    useState<DevelopmentRequest | null>(null);
  const [customerApprovalRequest, setCustomerApprovalRequest] =
    useState<DevelopmentRequest | null>(null);
  const [quotationRequest, setQuotationRequest] =
    useState<DevelopmentRequest | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const {
    data: devRequests,
    isLoading,
    isCreating,
    error,
    addDevelopmentRequest,
    refreshDevelopmentRequests,
  } = useDevelopmentRequests();

  const filteredRequests = devRequests.filter((request) => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) {
      return true;
    }

    return (
      request.id.toLowerCase().includes(query) ||
      request.name.toLowerCase().includes(query) ||
      request.customer.toLowerCase().includes(query) ||
      request.type.toLowerCase().includes(query) ||
      request.status.toLowerCase().includes(query) ||
      request.artwork.toLowerCase().includes(query) ||
      request.version.toLowerCase().includes(query) ||
      Boolean(request.sourceInquiryNo?.toLowerCase().includes(query)) ||
      Boolean(request.owner?.toLowerCase().includes(query)) ||
      Boolean(request.notes?.toLowerCase().includes(query)) ||
      Boolean(request.processCardNo?.toLowerCase().includes(query)) ||
      Boolean(request.processCardStatus?.toLowerCase().includes(query)) ||
      Boolean(request.customerApprovalStatus?.toLowerCase().includes(query)) ||
      Boolean(request.customerFeedback?.toLowerCase().includes(query)) ||
      Boolean(request.quotationNo?.toLowerCase().includes(query)) ||
      Boolean(request.quotationStatus?.toLowerCase().includes(query))
    );
  });

  async function handleCreateDevelopmentRequest(
    payload: CreateDevelopmentRequestPayload,
  ) {
    const newRequest = await addDevelopmentRequest(payload);
    setSearchTerm("");
    setSelectedRequest(newRequest);
  }

  async function handleProcessCardSaved() {
    await refreshDevelopmentRequests();
  }

  async function handleCustomerApprovalSaved() {
    await refreshDevelopmentRequests();
  }

  async function handleQuotationSaved() {
    await refreshDevelopmentRequests();
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Product Development
          </h1>
          <p className="text-slate-500">Loading development requests...</p>
        </div>

        <div className="glass-panel rounded-2xl border border-slate-200 p-6">
          <div className="h-5 w-64 bg-slate-200 rounded animate-pulse mb-4" />
          <div className="h-4 w-full bg-slate-100 rounded animate-pulse mb-2" />
          <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error && devRequests.length === 0) {
    return (
      <div className="glass-panel rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-xl font-bold text-red-900">
          Failed to load development requests
        </h1>
        <p className="text-sm text-red-700 mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Product Development
          </h1>
          <p className="text-slate-500">
            Manage samples, process cards, customer approvals, and quotation
            preparation for new variants.
          </p>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
            <Upload className="w-4 h-4" /> Import Artwork
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" /> New Dev Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-accent" /> Status Overview
            </h3>

            <div className="space-y-3">
              {statusOverview.map((status) => (
                <div
                  key={status.label}
                  className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group"
                >
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">
                    {status.label}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      status.color,
                    )}
                  >
                    {status.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl bg-slate-900 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="font-bold mb-2">Commercial Tip</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Create quotation only after customer approval, then verify
                material, labor, overhead, wastage, margin, and USD/BDT exchange
                rate.
              </p>
            </div>
            <FileDigit className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <button className="text-sm font-bold border-b-2 border-accent pb-1 text-accent">
              Active Requests
            </button>

            <button className="text-sm font-medium text-slate-400 hover:text-slate-600 pb-1">
              Archive
            </button>

            <div className="flex-1" />

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter requests..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-accent w-48"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              {error.message}
            </div>
          )}

          {filteredRequests.length === 0 ? (
            <div className="glass-panel rounded-2xl border border-slate-200 p-10 text-center">
              <h2 className="text-lg font-bold text-slate-900">
                No development requests found
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Try changing your search term or create a new development
                request.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRequests.map((request) => (
                <DevelopmentRequestCard
                  key={request.id}
                  request={request}
                  onViewDetails={setSelectedRequest}
                  onOpenProcessCard={setProcessCardRequest}
                  onOpenCustomerApproval={setCustomerApprovalRequest}
                  onOpenQuotation={setQuotationRequest}
                />
              ))}

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-accent/40 hover:text-accent transition-all group"
              >
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:border-accent">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold">New Sample Project</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <CreateDevelopmentRequestModal
        isOpen={isCreateModalOpen}
        isCreating={isCreating}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateRequest={handleCreateDevelopmentRequest}
      />

      <DevelopmentRequestDetailsModal
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />

      <ProcessCardModal
        request={processCardRequest}
        onClose={() => setProcessCardRequest(null)}
        onSaved={handleProcessCardSaved}
      />

      <CustomerApprovalModal
        request={customerApprovalRequest}
        onClose={() => setCustomerApprovalRequest(null)}
        onSaved={handleCustomerApprovalSaved}
      />

      <QuotationDraftModal
        request={quotationRequest}
        onClose={() => setQuotationRequest(null)}
        onSaved={handleQuotationSaved}
      />
    </div>
  );
}
