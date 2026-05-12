import { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Mail,
  User as UserIcon
} from 'lucide-react';
import { ERPStatus, Inquiry } from '@/types/erp';
import { cn } from '@/lib/utils';

// Mock Inquiries
const mockInquiries: Inquiry[] = [
  {
    id: 'INQ-2024-001',
    customer: { id: 'C1', name: 'Global Tech Apparels', code: 'GTA', country: 'USA', contactPerson: 'John Smith', email: 'john@gta.com' },
    subject: 'Bulk Quote for Heat Transfer Labels - Summer Collection',
    description: 'Looking for 50,000 sets of multi-color heat transfer labels...',
    receivedDate: '2024-05-10',
    status: ERPStatus.IN_PROGRESS,
    priority: 'High',
    attachments: []
  },
  {
    id: 'INQ-2024-002',
    customer: { id: 'C2', name: 'EuroFashion Group', code: 'EFG', country: 'Germany', contactPerson: 'Anna Müller', email: 'anna@efg.de' },
    subject: 'Gum Tape Inquiry for Sustainable Packaging',
    description: 'Biodegradable gum tape requirements for our upcoming eco-line...',
    receivedDate: '2024-05-11',
    status: ERPStatus.PENDING_APPROVAL,
    priority: 'Medium',
    attachments: []
  },
  {
    id: 'INQ-2024-003',
    customer: { id: 'C3', name: 'Local Brands Ltd.', code: 'LBL', country: 'Bangladesh', contactPerson: 'Rakib Ahmed', email: 'rakib@local.bd' },
    subject: 'Silica Gel Packs - Standard Specification',
    description: 'Monthly requirement for 10,000 packs of 5g silica gel...',
    receivedDate: '2024-05-12',
    status: ERPStatus.DRAFT,
    priority: 'Low',
    attachments: []
  },
];

export function CRM() {
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusIcon = (status: ERPStatus) => {
    switch (status) {
      case ERPStatus.IN_PROGRESS: return <Clock className="w-3 h-3 text-blue-500" />;
      case ERPStatus.APPROVED: return <CheckCircle2 className="w-3 h-3 text-emerald-500" />;
      case ERPStatus.PENDING_APPROVAL: return <AlertCircle className="w-3 h-3 text-amber-500" />;
      default: return <FileText className="w-3 h-3 text-slate-400" />;
    }
  };

  const getStatusClass = (status: ERPStatus) => {
    switch (status) {
      case ERPStatus.IN_PROGRESS: return "bg-blue-50 text-blue-600 border-blue-100";
      case ERPStatus.APPROVED: return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case ERPStatus.PENDING_APPROVAL: return "bg-amber-50 text-amber-600 border-amber-100";
      default: return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inquiry Management</h1>
          <p className="text-slate-500">Track and manage customer inquiries from first contact to sales order.</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-md group">
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
          Create Inquiry
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search inquiries, customers, or IDs..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-accent/20 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors w-full sm:w-auto justify-center">
             Status: All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockInquiries.map((inquiry) => (
          <div key={inquiry.id} className="group glass-panel rounded-2xl border border-slate-200 hover:border-accent/40 hover:shadow-md transition-all duration-300">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-600 border border-slate-100">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <h3 className="font-bold text-slate-900 group-hover:text-accent transition-colors">{inquiry.subject}</h3>
                       <span className={cn(
                         "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                         inquiry.priority === 'High' ? "bg-rose-50 text-rose-600 border-rose-100" :
                         inquiry.priority === 'Medium' ? "bg-amber-50 text-amber-600 border-amber-100" :
                         "bg-blue-50 text-blue-600 border-blue-100"
                       )}>
                         {inquiry.priority} Priority
                       </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">ID: {inquiry.id} • Received on {inquiry.receivedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className={cn(
                     "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border capitalize",
                     getStatusClass(inquiry.status)
                   )}>
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
                    <p className="text-xs font-bold text-slate-900">{inquiry.customer.name}</p>
                    <p className="text-[10px] text-slate-500">{inquiry.customer.contactPerson} • {inquiry.customer.country}</p>
                  </div>
                </div>
                <div className="flex-1">
                   <p className="text-sm text-slate-600 line-clamp-1 italic">"{inquiry.description}"</p>
                </div>
                <div className="flex items-center gap-3">
                   <button className="text-xs font-bold text-accent hover:underline">View Details</button>
                   <button className="px-4 py-2 bg-slate-50 text-slate-900 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
                     Connect PD Request
                   </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
