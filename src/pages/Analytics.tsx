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
          title="Intelligence"
          subtitle="Strategic predictions"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6">
            <div className="p-4 sm:p-6 bg-slate-50/50 rounded-2xl sm:rounded-3xl border border-white text-center hover:scale-[1.02] transition-all">
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Growth Forecast</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tighter">+18.6%</p>
              <p className="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-2">Next 30 days</p>
            </div>
            <div className="p-4 sm:p-6 bg-slate-50/50 rounded-2xl sm:rounded-3xl border border-white text-center hover:scale-[1.02] transition-all">
              <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Churn Risk</p>
              <p className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tighter">Low</p>
              <p className="text-[9px] sm:text-[10px] font-black text-amber-500 uppercase tracking-widest mt-2">Mitigation ready</p>
            </div>
            <div className="p-4 sm:p-6 bg-primary/5 rounded-2xl sm:rounded-3xl border border-primary/10 text-center hover:scale-[1.02] transition-all">
              <p className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-widest mb-2">Opportunities</p>
              <p className="text-2xl sm:text-3xl font-black text-primary tracking-tighter">12</p>
              <p className="text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2">Top partners</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Platform Level Intelligence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        <StatCard title="Total Users" value={String(HOME_OWNERS.length + ORGANIZERS.length)} change={12} icon={Users} color="blue" trend="up" />
        <StatCard title="Active Partners" value={String(ORGANIZERS.length)} change={5.4} icon={Briefcase} color="primary" trend="up" />
        <StatCard title="Subscribers" value="1,402" icon={CreditCard} color="orange" />
        <StatCard title="Revenue" value={formatCurrency(145800)} change={22} icon={DollarSign} color="secondary" trend="up" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
        <GlassCard title="Revenue Velocity" subtitle="Comparative analysis">
          <div className="h-[250px] sm:h-[350px] w-full mt-4 sm:mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={ANALYTICS_DATA}>
                <defs>
                   <linearGradient id="colorAcq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#288E66" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#288E66" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} width={40} />
                <Tooltip 
                   contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                   itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '9px' }}
                />
                <Area type="monotone" dataKey="revenue" fill="url(#colorAcq)" stroke="#288E66" strokeWidth={3} />
                <Bar dataKey="users" barSize={20} fill="#DD647F" radius={[4, 4, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Global Trends */}
        <div className="grid grid-cols-1 gap-6 sm:gap-10">
           <GlassCard title="Market Sector" subtitle="Category distribution">
              <div className="h-[250px] sm:h-[300px] w-full flex items-center justify-center">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={TOP_SERVICES}
                       cx="50%"
                       cy="50%"
                       innerRadius={50}
                       outerRadius={80}
                       paddingAngle={6}
                       dataKey="value"
                     >
                       {TOP_SERVICES.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: 'none' }}
                     />
                     <Legend wrapperStyle={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '9px', paddingTop: '10px' }} />
                   </PieChart>
                 </ResponsiveContainer>
              </div>
           </GlassCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-10">
        {/* Top Locations */}
        <GlassCard className="lg:col-span-1" title="Strategic Hotspots" subtitle="Geographic nodes">
           <div className="space-y-4 sm:space-y-6 mt-6">
              {TOP_LOCATIONS.map((loc, i) => (
                <div key={i} className="group cursor-default">
                   <div className="flex justify-between items-center mb-1 sm:mb-2">
                      <div className="flex items-center gap-2">
                         <MapPin className="w-3 h-3 text-slate-300 group-hover:text-primary transition-colors" />
                         <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-800">{loc.name}</span>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-slate-400 group-hover:text-primary transition-colors">{loc.value}</span>
                   </div>
                   <div className="h-1.5 sm:h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${(loc.value / 850) * 100}%` }}
                        className={cn("h-full rounded-full", i === 0 ? "bg-primary" : "bg-slate-300")}
                      />
                   </div>
                </div>
              ))}
           </div>
        </GlassCard>

        <div className="lg:col-span-2 space-y-6 sm:space-y-10">
           {/* Partner Performance Indicators */}
           <GlassCard title="Partner Performance" subtitle="Aggregated metrics">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mt-4">
                 <div className="p-5 sm:p-8 bg-slate-50/50 rounded-2xl sm:rounded-3xl border border-white text-center hover:scale-[1.02] transition-all">
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-2">Views</p>
                    <h4 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tighter">1,240</h4>
                    <div className="flex items-center justify-center gap-1 mt-1 sm:mt-2 text-emerald-500">
                       <TrendingUp className="w-3.5 h-3.5" />
                       <span className="text-[9px] sm:text-[10px] font-black uppercase">+12%</span>
                    </div>
                 </div>
                 <div className="p-5 sm:p-8 bg-slate-50/50 rounded-2xl sm:rounded-3xl border border-white text-center hover:scale-[1.02] transition-all">
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 sm:mb-2">Bookings</p>
                    <h4 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tighter">45.2k</h4>
                    <div className="flex items-center justify-center gap-1 mt-1 sm:mt-2 text-emerald-500">
                       <TrendingUp className="w-3.5 h-3.5" />
                       <span className="text-[9px] sm:text-[10px] font-black uppercase">+8.4%</span>
                    </div>
                 </div>
                 <div className="p-5 sm:p-8 bg-primary/5 rounded-2xl sm:rounded-3xl border border-primary/20 text-center hover:scale-[1.02] transition-all">
                    <p className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-widest mb-1 sm:mb-2">Conversion</p>
                    <h4 className="text-3xl sm:text-4xl font-black text-primary tracking-tighter">18.4%</h4>
                    <div className="flex items-center justify-center gap-1 mt-1 sm:mt-2 text-emerald-500 font-black text-[9px] sm:text-[10px] uppercase">
                       Optimized
                    </div>
                 </div>
              </div>
           </GlassCard>

           <GlassCard title="Market Capture" subtitle="Monthly engagement">
              <div className="h-[200px] sm:h-[250px] w-full mt-4 sm:mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.5} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} width={40} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', borderRadius: '12px', border: 'none' }}
                     />
                    <Line type="monotone" dataKey="value" name="Revenue" stroke="#288E66" strokeWidth={4} dot={{ r: 4, fill: '#fff', strokeWidth: 2, stroke: '#288E66' }} activeDot={{ r: 6, strokeWidth: 0 }} />
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
