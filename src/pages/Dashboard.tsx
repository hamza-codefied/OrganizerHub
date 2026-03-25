import React, { useState } from 'react';
import { 
  Users, UserCheck, CreditCard, Zap, Star, Award, DollarSign, CalendarCheck
} from 'lucide-react';
import { GlassCard, PageHeader, DashboardStatCard, TimeFilterTabs } from '../components/UI';
import { DateRangePicker } from '../components/DateRangePicker';
import type { DateRange } from 'react-day-picker';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { REVENUE_DATA, BOOKINGS } from '../data/mockData';
import { formatCurrency, cn } from '../lib/utils';

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
  const [activeTab, setActiveTab] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  // Mock data generator based on active filter
  const getStats = () => {
    const multipliers: Record<string, number> = {
      all: 1,
      daily: 0.1,
      weekly: 0.3,
      monthly: 0.7,
      yearly: 0.9,
      custom: 0.5
    };
    
    // If range is selected in custom, maybe vary data? 
    // For now keep it static based on 'custom' tab
    const m = multipliers[activeTab] || 1;
    
    return [
      { id: 'home_owners', title: 'TOTAL HOME OWNERS', value: Math.round(8 * m).toString(), change: '100', icon: Users, color: 'pink', trend: 'up' },
      { id: 'organizers', title: 'TOTAL ORGANIZERS', value: Math.round(9 * m).toString(), change: '100', icon: UserCheck, color: 'green', trend: 'up' },
      { id: 'standard_subs', title: 'STANDARD SUBSCRIPTIONS', value: Math.round(2 * m).toString(), change: '100', icon: CreditCard, color: 'blue', trend: 'up' },
      { id: 'premium_subs', title: 'PREMIUM SUBSCRIPTIONS', value: Math.round(4 * m).toString(), change: '100', icon: Zap, color: 'yellow', trend: 'up' },
      { id: 'spotlight', title: 'TOTAL HOME PAGE SPOTLIGHT', value: '$' + Math.round(165 * m).toString(), change: '100', icon: Star, color: 'purple', trend: 'up' },
      { id: 'highlighted', title: 'TOTAL HIGHLIGHTED LISTINGS', value: '$' + Math.round(12280 * m).toLocaleString(), change: '100', icon: Award, color: 'rose', trend: 'up' },
      { id: 'earnings', title: 'TOTAL EARNINGS', value: formatCurrency(2384.24 * m), change: '100', icon: DollarSign, color: 'emerald', trend: 'up' },
      { id: 'bookings', title: 'TOTAL BOOKINGS', value: Math.round(30 * m).toString(), change: '100', icon: CalendarCheck, color: 'cyan', trend: 'up' },
    ];
  };

  const stats = getStats();

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      <div className="flex flex-col gap-6">
        <PageHeader 
          title="Dashboard" 
          description="A quick view of users, revenue, and bookings."
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
             <TimeFilterTabs 
               activeTab={activeTab === 'custom' ? '' : activeTab} 
               onChange={(id) => {
                 setActiveTab(id);
                 if (id !== 'custom') setDateRange(undefined);
                }} 
             />
             <DateRangePicker 
               range={dateRange} 
               onRangeChange={(range) => {
                 setDateRange(range);
                 if (range) setActiveTab('custom');
               }} 
             />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <DashboardStatCard 
            key={stat.id}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend as 'up' | 'down'}
            timeLabel={activeTab === 'all' ? 'all time' : activeTab}
          />
        ))}
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

        <div className="space-y-6">
          <GlassCard title="Recent bookings" subtitle="A quick look at recent booking activity.">
            <div className="space-y-3 sm:space-y-4 mt-4 sm:mt-6">
              {BOOKINGS.slice(0, 4).map((booking) => (
                <div 
                  key={booking.id} 
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/30"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${booking.homeOwner.name}`} 
                      className="w-10 h-10 rounded-lg"
                      alt="Avatar"
                    />
                    <div>
                      <h4 className="font-semibold text-slate-800 text-xs sm:text-sm">{booking.homeOwner.name}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{booking.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-900">{formatCurrency(booking.amount)}</p>
                    <span className={cn(
                      "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                      booking.status === 'Completed' ? "text-emerald-600" : "text-amber-600"
                    )}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button type="button" className="w-full mt-6 py-2.5 text-xs font-bold text-primary bg-primary/5 rounded-xl hover:bg-primary/10 transition-colors">
              View All Activity
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
