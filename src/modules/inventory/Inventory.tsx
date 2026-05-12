import { useState } from 'react';
import { 
  Warehouse, 
  Package, 
  ArrowRightLeft, 
  History, 
  AlertTriangle,
  ChevronRight,
  MoreVertical,
  Layers,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

const inventoryData = [
  { id: 'RM-001', name: 'Polyester Tape Base', category: 'Raw Material', stock: 5400, unit: 'm', status: 'Stable', logo: 'RM' },
  { id: 'CH-402', name: 'Premium Cyan Ink (Water-based)', category: 'Chemical', stock: 125, unit: 'kg', status: 'Low Stock', logo: 'CH' },
  { id: 'HT-991', name: 'Heat Transfer Film (Hot Peel)', category: 'Raw Material', stock: 12400, unit: 'sqm', status: 'Stable', logo: 'RM' },
  { id: 'LB-220', name: 'Woven Label Yarn - White', category: 'Raw Material', stock: 240, unit: 'rolls', status: 'In Review', logo: 'RM' },
];

const warehouses = [
  { name: 'KEPZ Main Store', count: 1240, value: '$1.2M', active: true },
  { name: 'WIP Hold Area', count: 450, value: '$240k', active: false },
  { name: 'Finished Goods (Export)', count: 210, value: '$450k', active: false },
  { name: 'Scrap & Leftover', count: 85, value: '$12k', active: false },
];

export function Inventory() {
  const [activeWarehouse, setActiveWarehouse] = useState('KEPZ Main Store');

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory & Warehouse</h1>
          <p className="text-slate-500">Manage stock levels, multi-warehouse transfers, and material traceability.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 shadow-sm transition-all">
            <ArrowRightLeft className="w-4 h-4" /> Internal Transfer
          </button>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 shadow-md transition-all">
            <Package className="w-4 h-4" /> Stock Adjustment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Warehouse Selection */}
        <div className="lg:col-span-1 space-y-4">
           {warehouses.map((w) => (
             <button
               key={w.name}
               onClick={() => setActiveWarehouse(w.name)}
               className={cn(
                 "w-full p-4 rounded-2xl border text-left transition-all duration-300",
                 activeWarehouse === w.name 
                   ? "bg-white border-accent shadow-md scale-[1.02]" 
                   : "bg-slate-50 border-transparent hover:bg-white hover:border-slate-200"
               )}
             >
               <div className="flex items-center justify-between mb-2">
                 <div className={cn(
                   "p-2 rounded-lg",
                   activeWarehouse === w.name ? "bg-accent text-white" : "bg-slate-200 text-slate-500"
                 )}>
                   <Warehouse className="w-4 h-4" />
                 </div>
                 {activeWarehouse === w.name && <ChevronRight className="w-4 h-4 text-accent" />}
               </div>
               <p className={cn("font-bold text-sm", activeWarehouse === w.name ? "text-slate-900" : "text-slate-600")}>{w.name}</p>
               <div className="flex items-center justify-between mt-1">
                 <span className="text-[10px] uppercase font-bold text-slate-400">{w.count} SKUs</span>
                 <span className="text-xs font-bold text-slate-900">{w.value}</span>
               </div>
             </button>
           ))}

           <div className="p-6 bg-amber-50 rounded-2xl border border-amber-200">
             <div className="flex items-center gap-2 text-amber-800 mb-2">
               <AlertTriangle className="w-4 h-4" />
               <span className="text-xs font-bold">Low Stock Warning</span>
             </div>
             <p className="text-[10px] text-amber-700 leading-relaxed">
               4 items in <b>KEPZ Main Store</b> are below safety stock levels. RFQ suggested.
             </p>
           </div>
        </div>

        {/* Stock List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Value</span>
                 <span className="text-xl font-black text-slate-900">$1,912,500</span>
               </div>
               <div className="h-8 w-[1px] bg-slate-200"></div>
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth (MoM)</span>
                 <span className="text-xl font-black text-emerald-600">+4.2%</span>
               </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                <History className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                <Layers className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Item Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Current Stock</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventoryData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-[10px] group-hover:bg-accent group-hover:text-white transition-colors">
                          {item.logo}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 group-hover:text-accent transition-colors">{item.name}</p>
                          <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wide">{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{item.category}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-black text-slate-900">{item.stock.toLocaleString()} {item.unit}</span>
                        <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                          <ArrowUp className="w-2 h-2" /> 2% this week
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold border",
                          item.status === 'Stable' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          item.status === 'Low Stock' ? "bg-rose-50 text-rose-600 border-rose-100 animate-pulse" :
                          "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          {item.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 group-hover:text-slate-600 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex items-center justify-between px-2">
             <p className="text-xs text-slate-500 font-medium">Showing 4 of 1240 items</p>
             <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">Previous</button>
                <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">Next Page</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
