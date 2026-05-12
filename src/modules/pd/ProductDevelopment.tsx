import { useState } from 'react';
import { 
  Plus, 
  Search, 
  FileSearch, 
  Upload, 
  CheckCircle, 
  Clock, 
  Eye,
  FileDigit,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const devRequests = [
  {
    id: 'DEV-9901',
    name: 'Reflective Heat Transfer Label V2',
    customer: 'Nike / Global Sourcing',
    type: 'Heat Transfer',
    status: 'Sample Ready',
    lastUpdate: '2h ago',
    artwork: 'nike_v2_reflective.ai',
    version: '2.1'
  },
  {
    id: 'DEV-9902',
    name: 'Biodegradable Pull Tape - Brown',
    customer: 'Adidas',
    type: 'Gum Tape',
    status: 'Customer Review',
    lastUpdate: '5h ago',
    artwork: 'tape_v1_eco.pdf',
    version: '1.0'
  }
];

export function ProductDevelopment() {
  const [selectedView, setSelectedView] = useState<'list' | 'detail'>('list');

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Product Development</h1>
          <p className="text-slate-500">Manage samples, process cards, and customer approvals for new variants.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
            <Upload className="w-4 h-4" /> Import Artwork
          </button>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-md">
            <Plus className="w-4 h-4" /> New Dev Request
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Progress Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-accent" /> Status Overview
            </h3>
            <div className="space-y-3">
              {[
                { label: 'New Inquiry', count: 12, color: 'bg-blue-100 text-blue-600' },
                { label: 'Design Stage', count: 5, color: 'bg-purple-100 text-purple-600' },
                { label: 'Sampling', count: 18, color: 'bg-amber-100 text-amber-600' },
                { label: 'Cust. Review', count: 7, color: 'bg-emerald-100 text-emerald-600' },
                { label: 'Final Approved', count: 34, color: 'bg-slate-100 text-slate-600' },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group">
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">{s.label}</span>
                  <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", s.color)}>{s.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl bg-slate-900 text-white overflow-hidden relative">
             <div className="relative z-10">
               <h3 className="font-bold mb-2">Development Tip</h3>
               <p className="text-xs text-slate-400 leading-relaxed">
                 Always verify the Heat Transfer peel type (Hot/Cold) before confirming the final process card with the customer.
               </p>
             </div>
             <FileDigit className="absolute -bottom-4 -right-4 w-24 h-24 text-white/5 rotate-12" />
          </div>
        </div>

        {/* Development Board */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <button className="text-sm font-bold border-b-2 border-accent pb-1 text-accent">Active Requests</button>
            <button className="text-sm font-medium text-slate-400 hover:text-slate-600 pb-1">Archive</button>
            <div className="flex-1"></div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Filter requests..." className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-accent w-48" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {devRequests.map((req) => (
              <div key={req.id} className="glass-panel rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-transparent hover:border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-slate-50 rounded-xl text-slate-400 group-hover:text-accent group-hover:bg-accent/5 transition-colors">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider",
                    req.status.includes('Approved') ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {req.status}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-1">{req.name}</h3>
                <p className="text-xs text-slate-500 mb-4">{req.customer} • v{req.version}</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-500">Artwork File:</span>
                    <span className="font-bold text-slate-700 flex items-center gap-1">
                       <FileSearch className="w-3 h-3" /> {req.artwork}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Clock className="w-3 h-3" /> Updated {req.lastUpdate}
                    </div>
                    <div className="flex items-center gap-2">
                       <button className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400"><Eye className="w-4 h-4" /></button>
                       <button className="px-3 py-1.5 bg-accent text-white rounded-lg font-bold">Process Card</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-accent/40 hover:text-accent transition-all group">
               <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center group-hover:border-accent">
                 <Plus className="w-6 h-6" />
               </div>
               <span className="text-sm font-bold">New Sample Project</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
