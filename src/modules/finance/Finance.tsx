import { useState } from 'react';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  ArrowUpRight,
  Calculator,
  ShieldCheck,
  Package
} from 'lucide-react';
import { cn } from '@/lib/utils';

const vatTransactions = [
  { id: 'TXN-A01', date: '2024-05-12', type: 'Sales', customer: 'Nike India', amount: '$42,500', vat: '$3,187.50', status: 'Ready (Mushak 6.3)' },
  { id: 'TXN-A02', date: '2024-05-12', type: 'Purchase', customer: 'BASF Chemicals', amount: '$12,000', vat: '$900.00', status: 'Verified' },
  { id: 'TXN-A03', date: '2024-05-11', type: 'Sales', customer: 'Global Fashion', amount: '$15,800', vat: '$1,185.00', status: 'Draft' },
];

export function Finance() {
  const [reportType, setReportType] = useState('Mushak 6.3');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Finance & VAT Compliance</h1>
          <p className="text-slate-500">Manage tax obligations, Bangladesh VAT reporting (Mushak), and HQ data exports.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
             <Download className="w-4 h-4" /> Export CSV for BDC
           </button>
           <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-md">
             <Calculator className="w-4 h-4" /> Finalize VAT Period
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compliance Summary */}
        <div className="lg:col-span-1 space-y-6">
           <div className="glass-panel p-8 rounded-3xl bg-slate-900 text-white">
              <div className="flex items-center justify-between mb-6">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                <span className="text-[10px] font-bold px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg">PERIOD: MAY 2024</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">Audit Ready</h3>
              <p className="text-sm text-slate-400 mb-8">All transactions for the current week have been verified against NBR rules.</p>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">VAT Payable</span>
                    <span className="font-bold">$12,450.00</span>
                 </div>
                 <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Input Tax Credit</span>
                    <span className="font-bold text-emerald-400">-$3,120.50</span>
                 </div>
                 <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <span className="font-bold">Net Vat</span>
                    <span className="text-xl font-black text-white">$9,329.50</span>
                 </div>
              </div>
           </div>

           <div className="glass-panel p-6 rounded-2xl">
              <h4 className="text-sm font-bold text-slate-900 mb-4">Required Reports</h4>
              <div className="space-y-2">
                 {['Mushak 6.3 (Tax Invoice)', 'Mushak 9.1 (VAT Return)', 'Mushak 6.1 (Purchase Book)', 'Mushak 6.2 (Sales Book)'].map(r => (
                   <button 
                    key={r}
                    onClick={() => setReportType(r)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all",
                      reportType === r ? "bg-accent text-white" : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                    )}
                   >
                     {r}
                     <FileText className={cn("w-4 h-4", reportType === r ? "text-white" : "text-slate-400")} />
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Transaction Table */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <Search className="w-5 h-5 text-slate-400" />
                <input type="text" placeholder="Search transactions..." className="bg-transparent border-none outline-none text-sm font-medium text-slate-900 w-64" />
             </div>
             <div className="flex items-center gap-1">
                <button className="p-2 text-slate-400 hover:text-slate-600"><AlertCircle className="w-5 h-5" /></button>
             </div>
           </div>

           <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Source Trans.</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Type</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Value (USD)</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">VAT Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vatTransactions.map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                           <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-accent group-hover:text-white transition-colors">
                              <Package className="w-4 h-4" />
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-900 uppercase">{txn.id}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{txn.customer} • {txn.date}</p>
                           </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-[10px] font-bold uppercase",
                          txn.type === 'Sales' ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"
                        )}>{txn.type}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <p className="text-sm font-bold text-slate-900">{txn.amount}</p>
                         <p className="text-[10px] text-slate-400 font-medium">VAT: {txn.vat}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center gap-1">
                           <div className={cn(
                             "flex items-center gap-1 text-[10px] font-bold",
                             txn.status.includes('Ready') ? "text-emerald-600" : txn.status === 'Draft' ? "text-amber-600" : "text-blue-600"
                           )}>
                             {txn.status.includes('Ready') ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                             {txn.status}
                           </div>
                           {txn.status.includes('Ready') && (
                             <button className="text-[9px] font-black underline text-accent uppercase tracking-tighter">Download 6.3</button>
                           )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>

           <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                    <ArrowUpRight className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="font-bold text-slate-900">Run HQ Data Synchronizer</h4>
                    <p className="text-xs text-slate-500">Export verified weekly batch to Group Business Data Cloud (JSON Format)</p>
                 </div>
              </div>
              <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">Start Export</button>
           </div>
        </div>
      </div>
    </div>
  );
}
