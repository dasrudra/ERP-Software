import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileCode2, 
  ShoppingBag, 
  Factory, 
  Warehouse, 
  CircleDollarSign, 
  FileOutput, 
  Settings,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { User, UserRole } from '@/types/erp';

interface NavItem {
  name: string;
  icon: React.ElementType;
  id: string;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { name: 'CRM & Inquiry', icon: Users, id: 'crm' },
  { name: 'Product Development', icon: FileCode2, id: 'pd' },
  { name: 'Sales & Commercial', icon: ShoppingBag, id: 'sales' },
  { name: 'Production', icon: Factory, id: 'production' },
  { name: 'Inventory', icon: Warehouse, id: 'inventory' },
  { name: 'Finance & VAT', icon: CircleDollarSign, id: 'finance' },
  { name: 'HQ Reporting', icon: FileOutput, id: 'hq' },
  { name: 'Settings', icon: Settings, id: 'settings' },
];

interface ShellProps {
  children: React.ReactNode;
  currentUser: User;
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export function Shell({ children, currentUser, activeTab, setActiveTab }: ShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out border-r border-slate-800",
          !isSidebarOpen && "-translate-x-full lg:translate-x-0 lg:w-20"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <span className="text-white font-bold">A</span>
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-white tracking-wider whitespace-nowrap">ALPHA-ERP</span>
            )}
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group text-sm font-medium",
                activeTab === item.id 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-slate-800 hover:text-white"
              )}
              title={!isSidebarOpen ? item.name : undefined}
            >
              <item.icon className={cn("w-5 h-5 shrink-0", activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-white")} />
              {isSidebarOpen && <span>{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
               <UserIcon className="w-4 h-4 text-slate-300" />
             </div>
             {isSidebarOpen && (
               <div className="flex-1 overflow-hidden">
                 <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                 <p className="text-[10px] text-slate-400 truncate">{currentUser.role}</p>
               </div>
             )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300",
        isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
      )}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search ERP..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-accent/20 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-2 cursor-pointer p-1 hover:bg-slate-50 rounded-lg group relative" onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{currentUser.name}</p>
                <div className="flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider">{currentUser.role}</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
              
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                    <UserIcon className="w-4 h-4" /> My Profile
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                    <Settings className="w-4 h-4" /> Settings
                  </button>
                  <div className="h-[1px] bg-slate-100 my-1"></div>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 pb-16">
          {children}
        </div>
      </main>
    </div>
  );
}
