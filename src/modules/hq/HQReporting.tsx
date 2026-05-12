import { useState } from 'react';
import { 
  Cloud, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  Download,
  Terminal,
  FileCode,
  LayoutGrid
} from 'lucide-react';
import { cn } from '@/lib/utils';

const exportLogs = [
  { id: 'EXP-101', date: '2024-05-12 10:00 AM', module: 'Sales + Inventory', size: '1.2MB', status: 'Success', batch: 'weekly_q2_24' },
  { id: 'EXP-100', date: '2024-05-05 10:05 AM', module: 'Production + Shop Floor', size: '0.8MB', status: 'Success', batch: 'weekly_q2_23' },
  { id: 'EXP-099', date: '2024-04-28 10:15 AM', module: 'VAT Transactions', size: '0.4MB', status: 'Failed', batch: 'weekly_q2_22', error: 'API Timeout' },
];

export function HQReporting() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">HQ Reporting Bridge</h1>
          <p className="text-slate-500">Synchronize local Bangladesh operations data with the Global Business Data Cloud in Amsterdam.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-md">
             <RefreshCw className="w-4 h-4" /> Trigger Manual Sync
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="glass-panel p-6 rounded-2xl">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="font-bold text-slate-900">Cloud Status</h3>
                 <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Connected</span>
                 </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl space-y-3">
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Last Sync</span>
                    <span className="text-slate-900 font-bold">2h ago</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Data Latency</span>
                    <span className="text-slate-900 font-bold">140ms</span>
                 </div>
                 <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Auto-Sync</span>
                    <span className="text-emerald-600 font-bold">Enabled</span>
                 </div>
              </div>
           </div>

           <div className="glass-panel p-6 rounded-2xl bg-slate-900 text-white">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                 <Terminal className="w-4 h-4 text-accent" /> Data Mapping
              </h3>
              <div className="space-y-2">
                 {['Product Master (Global)', 'Financial GL', 'Production OEE', 'Inventory Valuation'].map(m => (
                    <div key={m} className="flex items-center justify-between p-2 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-xs">
                       <span className="text-slate-400">{m}</span>
                       <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Sync History & Logs</h3>
              <button className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest leading-relaxed">
                 <Download className="w-3 h-3" /> Export Audit Log
              </button>
           </div>

           <div className="space-y-4">
              {exportLogs.map(log => (
                <div key={log.id} className="glass-panel p-5 rounded-2xl flex items-center justify-between group hover:border-slate-300 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center",
                        log.status === 'Success' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                      )}>
                         {log.status === 'Success' ? <FileCode className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                      </div>
                      <div>
                         <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900">Batch {log.batch}</h4>
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                              log.status === 'Success' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                            )}>{log.status}</span>
                         </div>
                         <p className="text-xs text-slate-500 mt-0.5">{log.module} • {log.size} • {log.date}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      {log.error && <span className="text-[10px] font-medium text-rose-500">{log.error}</span>}
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"><LayoutGrid className="w-4 h-4" /></button>
                   </div>
                </div>
              ))}
           </div>

           <div className="p-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-6 font-medium">
                 <RefreshCw className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Sync Automation Active</h3>
              <p className="text-sm text-slate-500 max-w-md">
                 Our system will automatically push data to HQ every evening at 11:30 PM BD time. You can manually push data during audits.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
