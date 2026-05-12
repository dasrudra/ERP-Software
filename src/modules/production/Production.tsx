import { useState } from 'react';
import { 
  BarChart3, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertCircle, 
  Users,
  Timer,
  Factory,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const workOrders = [
  { 
    id: 'WO-10332', 
    product: 'Nike Heat Transfer V2', 
    qty: 5000, 
    progress: 65, 
    status: 'Running', 
    center: 'Printing Line 1',
    op: 'Heat Pressing',
    startTime: '08:00 AM'
  },
  { 
    id: 'WO-10335', 
    product: 'Adidas Pull Tape', 
    qty: 2000, 
    progress: 10, 
    status: 'Setup', 
    center: 'Gumming Line A',
    op: 'Coating',
    startTime: '09:30 AM'
  },
  { 
    id: 'WO-10338', 
    product: 'Levi\'s Woven Label', 
    qty: 12000, 
    progress: 100, 
    status: 'QC Pending', 
    center: 'Woven Line 4',
    op: 'Cutting',
    startTime: '07:15 AM'
  },
];

const loadData = [
  { name: 'Print 1', load: 85 },
  { name: 'Print 2', load: 45 },
  { name: 'Gum A', load: 95 },
  { name: 'Gum B', load: 20 },
  { name: 'Woven 4', load: 60 },
];

export function Production() {
  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Production Control</h1>
          <p className="text-slate-500">Shop floor execution, job cards, and real-time work center monitoring.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
             Production Plan
          </button>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-md">
            <BarChart3 className="w-4 h-4" /> Capacity Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Work Center Load */}
        <div className="lg:col-span-1 glass-panel p-8 rounded-3xl">
           <h3 className="text-lg font-bold text-slate-900 mb-2">Work Center Load</h3>
           <p className="text-xs text-slate-500 mb-8">Real-time capacity utilization across departments</p>
           
           <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loadData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 11}}
                />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="load" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
           </div>

           <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <div>
                    <p className="text-sm font-bold text-rose-900">Bottleneck Alert</p>
                    <p className="text-[10px] text-rose-700">Gumming Line A at 95% capacity</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold text-rose-600 underline">View Plan</button>
              </div>
           </div>
        </div>

        {/* Live Work Orders */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
             <h3 className="text-lg font-bold text-slate-900">Active Work Orders</h3>
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Monitoring</span>
             </div>
           </div>

           <div className="space-y-4">
             {workOrders.map((wo) => (
               <div key={wo.id} className="glass-panel p-6 rounded-2xl border-l-[6px] border-l-slate-200 hover:border-l-accent transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-accent group-hover:text-white transition-colors">
                        <Timer className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <h4 className="font-bold text-slate-900">{wo.product}</h4>
                           <span className={cn(
                             "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                             wo.status === 'Running' ? "bg-emerald-50 text-emerald-600" : 
                             wo.status === 'Setup' ? "bg-amber-50 text-amber-600" : 
                             "bg-blue-50 text-blue-600"
                           )}>
                             {wo.status}
                           </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">ID: {wo.id} • {wo.qty.toLocaleString()} units • Started {wo.startTime}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                       <div className="flex flex-col items-end">
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{wo.center}</span>
                         <span className="text-sm font-bold text-slate-900">{wo.op}</span>
                       </div>
                       <div className="flex items-center gap-2">
                         {wo.status === 'Running' ? (
                            <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                              <Pause className="w-4 h-4 fill-slate-600" />
                            </button>
                         ) : (
                            <button className="p-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20">
                              <Play className="w-4 h-4 fill-accent" />
                            </button>
                         )}
                         <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100">
                           <CheckCircle className="w-4 h-4" />
                         </button>
                       </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-2">
                      <span>PROGRESS</span>
                      <span>{wo.progress}% COMPLETE</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div 
                        className={cn("h-full rounded-full transition-all duration-1000 bg-accent")} 
                        style={{ width: `${wo.progress}%` }}
                       ></div>
                    </div>
                  </div>
               </div>
             ))}
           </div>

           <div className="p-8 bg-slate-900 rounded-3xl text-white relative overflow-hidden group">
              <div className="relative z-10 flex items-center justify-between">
                <div>
                   <h3 className="text-xl font-bold mb-2">Shop Floor Terminal</h3>
                   <p className="text-sm text-slate-400 max-w-sm">
                     Optimized tablet interface for operators. Start work orders, log wastage, and report rework in one tap.
                   </p>
                   <button className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-accent text-white rounded-xl font-bold text-sm hover:scale-105 transition-all">
                     Open Terminal <ArrowRight className="w-4 h-4" />
                   </button>
                </div>
                <Factory className="w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
