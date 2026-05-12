import { 
  User as UserIcon, 
  Shield, 
  Bell, 
  Lock, 
  Database, 
  Globe,
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const settingSections = [
  { 
    title: 'User Management', 
    description: 'Add and manage system users across departments.',
    icon: UserIcon,
    items: ['Active Users', 'Roles & Permissions', 'Approval Workflows']
  },
  { 
    title: 'Security & Access', 
    description: 'Configure multi-factor authentication and session limits.',
    icon: Shield,
    items: ['Two-Factor Auth', 'IP Whitelisting', 'Password Policy']
  },
  { 
    title: 'Global Config', 
    description: 'Manage currencies, units of measure, and default tax rates.',
    icon: Globe,
    items: ['Currency Exchange', 'UOM Settings', 'VAT Table']
  },
  { 
    title: 'Data & Backup', 
    description: 'Monitor database health and schedule backups.',
    icon: Database,
    items: ['System Health', 'Auto-Backups', 'Import/Export Tools']
  },
];

export function Settings() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Settings</h1>
          <p className="text-slate-500">Configure global ERP parameters and manage enterprise-grade security.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all">
             <Bell className="w-4 h-4" /> Notifications
           </button>
           <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all shadow-md">
             <UserPlus className="w-4 h-4" /> Add User
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         {settingSections.map((section) => (
           <div key={section.title} className="glass-panel p-8 rounded-3xl border border-slate-200 hover:border-slate-300 transition-all group">
              <div className="flex items-start justify-between mb-6">
                 <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 group-hover:bg-accent group-hover:text-white transition-all">
                    <section.icon className="w-6 h-6" />
                 </div>
                 <button className="p-2 text-slate-300 group-hover:text-slate-900 transition-colors">
                    <Lock className="w-5 h-5" />
                 </button>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{section.title}</h3>
              <p className="text-sm text-slate-500 mb-8 leading-relaxed">{section.description}</p>
              
              <div className="space-y-2">
                 {section.items.map(item => (
                   <div key={item} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl group/item hover:bg-slate-100 cursor-pointer transition-colors">
                      <span className="text-xs font-bold text-slate-600">{item}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover/item:text-slate-900 transition-colors" />
                   </div>
                 ))}
              </div>
           </div>
         ))}
      </div>

      <div className="p-8 bg-amber-50 rounded-3xl border border-amber-200 flex items-center justify-between">
         <div>
            <h4 className="text-amber-900 font-bold mb-1">Upcoming Maintenance</h4>
            <p className="text-sm text-amber-700">System backup scheduled for Saturday, 15 May 2024 (02:00 AM BD Time).</p>
         </div>
         <button className="px-6 py-2 bg-amber-900 text-white rounded-xl text-xs font-bold">Reschedule</button>
      </div>
    </div>
  );
}
