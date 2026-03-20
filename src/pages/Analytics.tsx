import { useState } from 'react';
import { PageHeader, StatCard, GlassCard, PremiumTabs } from '../components/UI';
import { 
  Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, ComposedChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { 
  REVENUE_DATA, ANALYTICS_DATA, TOP_SERVICES, 
  TOP_LOCATIONS, HOME_OWNERS, ORGANIZERS 
} from '../data/mockData';
import { cn, formatCurrency } from '../lib/utils';
import { 
  TrendingUp, Zap, Globe, 
  MousePointer2, Target,
  Search, Share2, Users, 
  Briefcase, CreditCard, DollarSign,
  Download, FileSpreadsheet, MapPin
} from 'lucide-react';

const AnalyticsPage = () => {
  const COLORS = ['#288E66', '#DD647F', '#3B82F6', '#F59E0B', '#8B5CF6'];
  const [activeTab, setActiveTab] = useState<'overview' | 'intelligence'>('overview');

  return (
    <div className="space-y-12">
      <PageHeader 
        title="Predictive Analytics" 
        description="Deep learning insights into platform growth, churn, and strategic market capture."
      >
        <div className="flex flex-wrap items-center gap-3">
          <PremiumTabs
            tabs={[
              { id: 'overview', label: 'Analytics Overview' },
              { id: 'intelligence', label: 'Intelligence Report' },
            ]}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as 'overview' | 'intelligence')}
          />
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-primary transition-all rounded-xl bg-white/40 backdrop-blur-md border border-white/60">
              <Download className="w-4 h-4" />
              CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-500 transition-all rounded-xl bg-white/40 backdrop-blur-md border border-white/60">
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
          </div>
        </div>
      </PageHeader>

      {activeTab === 'intelligence' && (
        <GlassCard
          title="Intelligence Report"
          subtitle="Actionable predictions derived from recent platform telemetry."
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="p-6 bg-slate-50/50 rounded-3xl border border-white text-center hover:scale-[1.02] transition-all">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Growth Forecast</p>
              <p className="text-3xl font-black text-slate-800 tracking-tighter">+18.6%</p>
              <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2">Next 30 days</p>
            </div>
            <div className="p-6 bg-slate-50/50 rounded-3xl border border-white text-center hover:scale-[1.02] transition-all">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Churn Risk</p>
              <p className="text-3xl font-black text-slate-800 tracking-tighter">Low</p>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mt-2">Mitigation ready</p>
            </div>
            <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 text-center hover:scale-[1.02] transition-all">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Spotlight Opportunities</p>
              <p className="text-3xl font-black text-primary tracking-tighter">12</p>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2">Top partners</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Platform Level Intelligence */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Aggregate Users" value={String(HOME_OWNERS.length + ORGANIZERS.length)} change={12} icon={Users} color="blue" trend="up" />
        <StatCard title="Active Partners" value={String(ORGANIZERS.length)} change={5.4} icon={Briefcase} color="primary" trend="up" />
        <StatCard title="Live Subscriptions" value="1,402" icon={CreditCard} color="orange" />
        <StatCard title="Registry Revenue" value={formatCurrency(145800)} change={22} icon={DollarSign} color="secondary" trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <GlassCard title="Revenue Propagation Velocity" subtitle="Comparative analysis of monthly acquisition vs. yield.">
          <div className="h-[350px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={ANALYTICS_DATA}>
                <defs>
                   <linearGradient id="colorAcq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#288E66" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#288E66" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                   itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="revenue" fill="url(#colorAcq)" stroke="#288E66" strokeWidth={4} />
                <Bar dataKey="users" barSize={30} fill="#DD647F" radius={[8, 8, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Global Trends */}
        <div className="grid grid-cols-1 gap-10">
           <GlassCard title="Service Sector Distribution" subtitle="Market capture by service category.">
              <div className="h-[300px] w-full flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={TOP_SERVICES}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={100}
                       paddingAngle={8}
                       dataKey="value"
                     >
                       {TOP_SERVICES.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: 'none' }}
                     />
                     <Legend wrapperStyle={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '10px' }} />
                   </PieChart>
                 </ResponsiveContainer>
              </div>
           </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Top Locations */}
        <GlassCard className="lg:col-span-1" title="Strategic Hotspots" subtitle="Top performing geographic nodes.">
           <div className="space-y-6 mt-6">
              {TOP_LOCATIONS.map((loc, i) => (
                <div key={i} className="group cursor-default">
                   <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                         <MapPin className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary transition-colors" />
                         <span className="text-xs font-black uppercase tracking-widest text-slate-800">{loc.name}</span>
                      </div>
                      <span className="text-sm font-black text-slate-400 group-hover:text-primary transition-colors">{loc.value}</span>
                   </div>
                   <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${(loc.value / 850) * 100}%` }}
                        className={cn("h-full rounded-full", i === 0 ? "bg-primary" : "bg-slate-300")}
                      />
                   </div>
                </div>
              ))}
           </div>
        </GlassCard>

        <div className="lg:col-span-2 space-y-10">
           {/* Partner Performance Indicators */}
           <GlassCard title="Pro-Partner Performance matrix" subtitle="Aggregated metrics for the organizer network.">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
                 <div className="p-8 bg-slate-50/50 rounded-3xl border border-white text-center hover:scale-[1.02] transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avg Profile Views</p>
                    <h4 className="text-3xl font-black text-slate-800 tracking-tighter">1,240</h4>
                    <div className="flex items-center justify-center gap-1 mt-2 text-emerald-500">
                       <TrendingUp className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase">+12%</span>
                    </div>
                 </div>
                 <div className="p-8 bg-slate-50/50 rounded-3xl border border-white text-center hover:scale-[1.02] transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Network Bookings</p>
                    <h4 className="text-3xl font-black text-slate-800 tracking-tighter">45.2k</h4>
                    <div className="flex items-center justify-center gap-1 mt-2 text-emerald-500">
                       <TrendingUp className="w-4 h-4" />
                       <span className="text-[10px] font-black uppercase">+8.4%</span>
                    </div>
                 </div>
                 <div className="p-8 bg-slate-50/50 rounded-3xl border border-white text-center hover:scale-[1.02] transition-all border-primary/20 bg-primary/5">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Conversion Core</p>
                    <h4 className="text-4xl font-black text-primary tracking-tighter">18.4%</h4>
                    <div className="flex items-center justify-center gap-1 mt-2 text-emerald-500 font-black text-[10px] uppercase">
                       Optimized flow
                    </div>
                 </div>
              </div>
           </GlassCard>

           <GlassCard title="Market Capture History" subtitle="Comparative analysis of monthly engagement metrics.">
              <div className="h-[250px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: 'none' }}
                     />
                    <Line type="monotone" dataKey="value" name="Global Revenue" stroke="#288E66" strokeWidth={5} dot={{ r: 6, fill: '#fff', strokeWidth: 3, stroke: '#288E66' }} activeDot={{ r: 8, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
