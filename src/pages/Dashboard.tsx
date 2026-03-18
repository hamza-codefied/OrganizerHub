import React from 'react';
import { 
  Users, Briefcase, DollarSign, Calendar,
} from 'lucide-react';
import { StatCard, GlassCard, PageHeader, PremiumTabs } from '../components/UI';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { REVENUE_DATA, BOOKING_STATS, TOP_SERVICES, BOOKINGS } from '../data/mockData';
import { formatCurrency, cn } from '../lib/utils';
const COLORS = ['#288E66', '#DD647F', '#4FD1C5', '#F6AD55'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-premium p-4 rounded-2xl border border-white/50 shadow-2xl">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-black text-primary">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = React.useState('today');

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Dashboard" 
        description="A quick view of users, revenue, and bookings."
      >
        {/* <PremiumTabs 
          tabs={[
            { id: 'today', label: 'Today' },
            { id: 'month', label: 'Month' },
            { id: 'year', label: 'Year' },
          ]}
          activeTab={timeFilter}
          onChange={setTimeFilter}
        /> */}
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total users" value="12,842" change={14.2} icon={Users} color="blue" trend="up" />
        <StatCard title="Verified organizers" value="842" change={5.1} icon={Briefcase} color="primary" trend="up" />
        <StatCard title="Premium revenue" value={formatCurrency(142500)} change={22.4} icon={DollarSign} color="secondary" trend="up" />
        <StatCard title="Total bookings" value="3,105" change={2.5} icon={Calendar} color="orange" trend="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <GlassCard className="lg:col-span-2" title="Revenue over time" subtitle="Track earnings and subscription growth.">
          <div className="h-[350px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#288E66" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#288E66" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#288E66" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Service share" subtitle="Which services are getting the most activity.">
          <div className="h-[280px] w-full mt-6 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={TOP_SERVICES}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={105}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {TOP_SERVICES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-8">
            {TOP_SERVICES.map((s, i) => (
              <div key={i} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                  <span className="text-xs font-bold text-slate-600 group-hover:text-primary transition-colors">{s.name}</span>
                </div>
                <span className="text-xs font-black text-slate-800">{s.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <GlassCard title="Recent bookings" subtitle="A quick look at recent booking activity.">
          <div className="space-y-5 mt-6">
            {BOOKINGS.slice(0, 5).map((booking) => (
              <div 
                key={booking.id} 
                className="flex items-center justify-between p-5 rounded-[2rem] hover:bg-white/60 transition-all border border-transparent hover:border-white/80 hover:shadow-xl hover:shadow-primary/5 group"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center border border-white shadow-inner">
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.homeOwner.name}`} 
                      className="w-10 h-10 rounded-xl"
                      alt="Avatar"
                    />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm group-hover:text-primary transition-colors tracking-tight">{booking.homeOwner.name}</h4>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{booking.service} • {booking.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    "text-[10px] font-black uppercase px-3 py-1 rounded-full border shadow-sm",
                    booking.status === 'Completed' ? "bg-emerald-50/50 text-emerald-600 border-emerald-100" :
                    booking.status === 'Pending' ? "bg-amber-50/50 text-amber-600 border-amber-100" : "bg-rose-50/50 text-rose-600 border-rose-100"
                  )}>
                    {booking.status}
                  </div>
                  <p className="text-base font-black mt-2 text-slate-800 tracking-tighter">{formatCurrency(booking.amount)}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 text-xs font-black text-slate-500 hover:text-primary hover:bg-white/80 rounded-2xl transition-all border border-transparent hover:border-white/60 hover:shadow-premium tracking-[0.2em] uppercase">
            View all bookings
          </button>
        </GlassCard>

        <GlassCard title="Bookings by day" subtitle="How bookings change across the week.">
          <div className="h-[350px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BOOKING_STATS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                   cursor={{fill: 'rgba(221, 100, 127, 0.05)'}}
                   contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#DD647F" 
                  radius={[12, 12, 0, 0]} 
                  barSize={40}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
