import { 
  Users, 
  ShoppingBag, 
  Factory, 
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { cn } from '@/lib/utils';

const data = [
  { name: 'Jan', revenue: 4000, production: 2400 },
  { name: 'Feb', revenue: 3000, production: 1398 },
  { name: 'Mar', revenue: 2000, production: 9800 },
  { name: 'Apr', revenue: 2780, production: 3908 },
  { name: 'May', revenue: 1890, production: 4800 },
  { name: 'Jun', revenue: 2390, production: 3800 },
];

const stats = [
  { 
    name: 'Total Inquiries', 
    value: '128', 
    change: '+12.5%', 
    trend: 'up', 
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  { 
    name: 'Active Orders', 
    value: '42', 
    change: '+8.2%', 
    trend: 'up', 
    icon: ShoppingBag,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100'
  },
  { 
    name: 'WIP Value', 
    value: '$284,500', 
    change: '-2.4%', 
    trend: 'down', 
    icon: Factory,
    color: 'text-amber-600',
    bg: 'bg-amber-100'
  },
  { 
    name: 'Pending Approvals', 
    value: '18', 
    change: '+3', 
    trend: 'up', 
    icon: AlertCircle,
    color: 'text-rose-600',
    bg: 'bg-rose-100'
  },
];

export function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Executive Dashboard</h1>
        <p className="text-slate-500">Welcome back. Here is what's happening across Alpha Products today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="glass-panel p-6 rounded-2xl group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                stat.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.name}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-panel p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Revenue vs Production</h3>
              <p className="text-sm text-slate-500">Monthly overview of operational financials</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-accent"></div>
                 <span className="text-xs text-slate-500 font-medium">Revenue</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                 <span className="text-xs text-slate-500 font-medium">Production</span>
               </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="production" stroke="#10b981" strokeWidth={3} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-900">Current Order Load</h3>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div className="space-y-6">
              {[
                { label: 'Heat Transfers', value: 75, color: 'bg-blue-500' },
                { label: 'Gum Tape', value: 45, color: 'bg-emerald-500' },
                { label: 'Labels', value: 90, color: 'bg-amber-500' },
                { label: 'Silica Gel', value: 30, color: 'bg-rose-500' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">{item.label}</span>
                    <span className="text-slate-500 font-bold">{item.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", item.color)} 
                      style={{ width: `${item.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors shadow-sm">
            View Full Production Plan
          </button>
        </div>
      </div>
    </div>
  );
}
