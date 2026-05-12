import { useState } from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle, 
  Calculator, 
  ArrowRight,
  TrendingUp,
  Globe,
  Tag,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const quotes = [
  { id: 'QT-552', customer: 'Nike India', date: '2024-05-12', amount: '$42,500', margin: '42%', status: 'Draft' },
  { id: 'QT-548', customer: 'Global Fashion', date: '2024-05-11', amount: '$15,800', margin: '38%', status: 'Sent' },
  { id: 'QT-541', customer: 'EuroFashion Group', date: '2024-05-10', amount: '$89,200', margin: '45%', status: 'Approved' },
];

export function Sales() {
  const [activeSubTab, setActiveSubTab] = useState('quotations');

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sales & Commercial</h1>
          <p className="text-slate-500">Manage quotations, proforma invoices, and multi-currency sales orders.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-md">
             <Calculator className="w-4 h-4" /> New Quotation
           </button>
        </div>
      </div>

      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
        {['Quotations', 'Proforma Invoices', 'Sales Orders', 'Customer POs'].map(t => (
          <button 
            key={t}
            onClick={() => setActiveSubTab(t.toLowerCase())}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all",
              activeSubTab === t.toLowerCase() ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quote Details</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Commercials</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {quotes.map((q) => (
                     <tr key={q.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                 <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                 <p className="text-sm font-bold text-slate-900">{q.id}</p>
                                 <p className="text-[10px] text-slate-400 font-medium">{q.customer} • {q.date}</p>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-900">{q.amount}</span>
                              <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                 <TrendingUp className="w-3 h-3" /> {q.margin} Est. Margin
                              </span>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex justify-center">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold border",
                                q.status === 'Approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                q.status === 'Sent' ? "bg-blue-50 text-blue-600 border-blue-100" :
                                "bg-slate-50 text-slate-600 border-slate-200"
                              )}>
                                 {q.status}
                              </span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2">
                              <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"><Send className="w-4 h-4" /></button>
                              <button className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold">Details</button>
                           </div>
                        </td>
                     </tr>
                   ))}
                </tbody>
              </table>
            </div>
         </div>

         <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200">
               <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" /> Multi-Currency Rates
               </h3>
               <div className="space-y-3">
                  {[
                    { label: 'USD/BDT', rate: '117.50', trend: 'up' },
                    { label: 'EUR/USD', rate: '1.08', trend: 'down' },
                    { label: 'GBP/USD', rate: '1.25', trend: 'up' },
                  ].map(r => (
                    <div key={r.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                       <span className="text-xs font-bold text-slate-600">{r.label}</span>
                       <span className="text-xs font-black text-slate-900">{r.rate}</span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden shadow-xl group">
               <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-4">
                     <Tag className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-1 italic">Proactive Suggestion</h3>
                  <p className="text-xs text-blue-100 leading-relaxed">
                     Alpha AI predicts a 2.5% increase in material cost for <b>Premium Polyester</b> next month. Update pending quotations now.
                  </p>
                  <button className="mt-4 flex items-center gap-2 text-[10px] font-black group-hover:gap-4 transition-all">
                     UPDATE ALL QUOTES <ArrowRight className="w-3 h-3" />
                  </button>
               </div>
               <Clock className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12" />
            </div>
         </div>
      </div>
    </div>
  );
}
