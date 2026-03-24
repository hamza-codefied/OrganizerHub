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
      <div className="bg-white p-3 rounded-md border border-slate-200 shadow-sm text-sm">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="font-medium text-primary">
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
    <div className="space-y-6 sm:space-y-10">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        <StatCard title="Total users" value="12,842" change={14.2} icon={Users} color="blue" trend="up" />
        <StatCard title="Verified organizers" value="842" change={5.1} icon={Briefcase} color="primary" trend="up" />
        <StatCard title="Premium revenue" value={formatCurrency(142500)} change={22.4} icon={DollarSign} color="secondary" trend="up" />
        <StatCard title="Total bookings" value="3,105" change={2.5} icon={Calendar} color="orange" trend="down" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        <GlassCard className="lg:col-span-2" title="Revenue over time" subtitle="Track earnings and subscription growth.">
          <div className="h-[250px] sm:h-[350px] w-full mt-4 sm:mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#288E66" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#288E66" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#288E66" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard title="Service share" subtitle="Which services are getting the most activity.">
          <div className="h-[240px] sm:h-[280px] w-full mt-4 sm:mt-6 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={TOP_SERVICES}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {TOP_SERVICES.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4 sm:mt-8">
            {TOP_SERVICES.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                  <span className="text-[10px] sm:text-xs text-slate-600">{s.name}</span>
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-slate-800">{s.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        <GlassCard title="Recent bookings" subtitle="A quick look at recent booking activity.">
          <div className="space-y-3 sm:space-y-5 mt-4 sm:mt-6">
            {BOOKINGS.slice(0, 5).map((booking) => (
              <div 
                key={booking.id} 
                className="flex items-center justify-between p-3 sm:p-4 rounded-md border border-slate-100 bg-white"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-slate-100 flex items-center justify-center border border-slate-200">
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.homeOwner.name}`} 
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded"
                      alt="Avatar"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 text-xs sm:text-sm truncate max-w-[100px] xs:max-w-none">{booking.homeOwner.name}</h4>
                    <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{booking.service} • {booking.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded border inline-block",
                    booking.status === 'Completed' ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                    booking.status === 'Pending' ? "bg-amber-50 text-amber-700 border-amber-100" : "bg-rose-50 text-rose-700 border-rose-100"
                  )}>
                    {booking.status}
                  </div>
                  <p className="text-xs sm:text-sm font-medium mt-1.5 sm:mt-2 text-slate-800">{formatCurrency(booking.amount)}</p>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="w-full mt-4 sm:mt-6 py-2.5 text-xs sm:text-sm text-slate-600 border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            View all bookings
          </button>
        </GlassCard>

        <GlassCard title="Bookings by day" subtitle="How bookings change across the week.">
          <div className="h-[250px] sm:h-[350px] w-full mt-4 sm:mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BOOKING_STATS}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <Tooltip 
                   cursor={{fill: 'rgba(221, 100, 127, 0.05)'}}
                   contentStyle={{ backgroundColor: '#fff', borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#DD647F" 
                  radius={[8, 8, 0, 0]} 
                  barSize={30}
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
