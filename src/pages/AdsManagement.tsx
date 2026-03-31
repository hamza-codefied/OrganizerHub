import { useState } from 'react';
import { createPortal } from 'react-dom';
import { PageHeader, GlassCard, StatCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { ADS, ORGANIZERS } from '../data/mockData';
import DetailsDialog from '../components/DetailsDialog';
import CustomSelect from '../components/CustomSelect';
import { cn, formatCurrency } from '../lib/utils';
import { 
  Megaphone, MousePointer2, Eye, TrendingUp, 
  Target, Plus, Layers, CheckCircle2, XCircle, 
  Pause, Play, BarChart3, DollarSign,
  MapPin, Globe, Activity
} from 'lucide-react';

const TARGETING_OPTIONS = ['Home Owners, USA', 'Businesses, USA', 'New Homeowners, USA', 'Real Estate Market, USA'];

const AdsManagementPage = () => {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'revenue'>('campaigns');
  const [ads, setAds] = useState(ADS);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTitle, setDetailsTitle] = useState('');
  const [detailsPayload, setDetailsPayload] = useState<any>(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployForm, setDeployForm] = useState({ organizerId: '', budget: 100, targeting: TARGETING_OPTIONS[0], duration: '14 Days' });

  const columns = [
    { 
      header: "Lead", 
      accessor: (ad: any) => (
        <div className="flex items-center gap-3 py-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm shrink-0">
            <Target className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-slate-800 leading-tight tracking-tight text-[10px] sm:text-sm truncate max-w-[80px] xs:max-w-none">{ad.organizer}</p>
            <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">#{ad.id}</p>
          </div>
        </div>
      )
    },
    { 
      header: "Budget", 
      accessor: (ad: any) => (
        <div className="flex flex-col">
           <span className="font-black text-slate-800 tracking-tighter text-[10px] sm:text-sm">{formatCurrency(ad.budget)}</span>
           <span className="text-[7px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest hidden xs:inline">{ad.duration}</span>
        </div>
      )
    },
    { 
      header: "Target", 
      className: "hidden md:table-cell",
      accessor: (ad: any) => (
        <div className="flex items-center gap-2">
           <MapPin className="w-3 h-3 text-slate-300" />
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{ad.targeting}</span>
        </div>
      )
    },
    { 
      header: "Stats", 
      className: "hidden sm:table-cell",
      accessor: (ad: any) => (
        <div className="flex items-center gap-4">
           <div className="flex flex-col">
              <div className="flex items-center gap-1 text-blue-600">
                <Eye className="w-2.5 h-2.5" /> <span className="font-black text-[10px] tracking-tighter">{ad.stats.impressions}</span>
              </div>
           </div>
           <div className="flex flex-col">
              <div className="flex items-center gap-1 text-emerald-600">
                <MousePointer2 className="w-2.5 h-2.5" /> <span className="font-black text-[10px] tracking-tighter">{ad.stats.clicks}</span>
              </div>
           </div>
        </div>
      )
    },
    { 
      header: "Status", 
      accessor: (ad: any) => (
        <div className={cn(
          "inline-flex items-center px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm",
          ad.status === "Active"
            ? "bg-emerald-500 border-emerald-500 text-white"
            : ad.status === "Pending"
              ? "bg-amber-500 border-amber-500 text-white"
              : ad.status === "Paused"
                ? "bg-slate-500 border-slate-500 text-white"
                : "bg-rose-500 border-rose-500 text-white",
        )}>
          <span className="hidden xs:inline">{ad.status}</span>
          <span className="xs:hidden">{ad.status.charAt(0)}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-10">
      <PageHeader 
        title="Ad Command" 
        description="Premium slots & campaigns."
      >
        <button
          type="button"
          onClick={() => setShowDeployModal(true)}
          className="flex items-center gap-2 primary-gradient text-white px-4 sm:px-6 py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden xs:inline">Deploy Campaign</span>
          <span className="xs:hidden">Deploy</span>
        </button>
      </PageHeader>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <PremiumTabs 
          tabs={[
            { id: 'campaigns', label: 'Campaigns' },
            { id: 'revenue', label: 'Revenue' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="w-full sm:w-auto"
        />
      </div>

      {activeTab === 'campaigns' && (
        <div className="space-y-6 sm:space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            <StatCard title="Active" value={String(ads.filter(a => a.status === 'Active').length)} icon={Activity} color="emerald" />
            <StatCard title="Impressions" value="450.8k" icon={Eye} color="blue" />
            <StatCard title="Clicks" value="12.4k" icon={TrendingUp} color="primary" />
            <StatCard title="Budget" value={formatCurrency(12500)} icon={DollarSign} color="secondary" />
          </div>

          <div className="overflow-hidden">
            <DataTable 
              columns={columns} 
              data={ads} 
              searchPlaceholder="Locate campaign..." 
              rowActions={[
                {
                  label: 'Stats',
                  icon: BarChart3,
                  onClick: (ad: any) => {
                    setDetailsTitle('Campaign Stats');
                    setDetailsPayload(ad);
                    setDetailsOpen(true);
                  },
                },
                {
                  label: 'Pause',
                  icon: Pause,
                  onClick: (ad: any) =>
                    setAds((prev) => prev.map((x) => (x.id === ad.id ? { ...x, status: 'Paused' } : x))),
                },
              ]}
            />
          </div>
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
           <GlassCard className="lg:col-span-4" title="Yield Distribution">
              <div className="space-y-6 mt-6">
                  {[
                    { label: 'Geographic', val: 75, color: 'bg-primary', icon: Globe },
                    { label: 'Spotlight', val: 45, color: 'bg-secondary', icon: Megaphone },
                    { label: 'Sidebar', val: 12, color: 'bg-blue-500', icon: Layers },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                          <div className="flex items-center gap-2">
                             <item.icon className="w-3 h-3 text-slate-300" />
                             <span className="text-slate-400">{item.label}</span>
                          </div>
                          <span className="text-slate-800">{item.val}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div style={{ width: `${item.val}%` }} className={cn("h-full rounded-full", item.color)} />
                       </div>
                    </div>
                  ))}
                  
                  <div className="p-6 sm:p-8 bg-primary/5 rounded-[2rem] border border-primary/10 mt-8">
                     <p className="text-[9px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Insight
                     </p>
                     <p className="text-xs font-bold text-slate-600 italic">"CTR is up 24.2% across premium tiers."</p>
                  </div>
              </div>
           </GlassCard>

           <GlassCard className="lg:col-span-8" title="Recent Financial Flux">
              <div className="space-y-3 mt-6">
                 {ads.slice(0, 6).map((ad, i) => (
                   <div key={i} className="flex items-center justify-between p-4 sm:p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-all group">
                      <div className="flex items-center gap-3 sm:gap-5">
                         <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm shrink-0">
                            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
                         </div>
                         <div className="min-w-0">
                            <p className="text-xs sm:text-sm font-black text-slate-800 tracking-tight truncate">{ad.organizer}</p>
                            <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{ad.startDate}</p>
                         </div>
                      </div>
                      <div className="text-right shrink-0">
                         <p className="text-base sm:text-xl font-black text-emerald-600 tracking-tighter">+{formatCurrency(ad.revenue)}</p>
                         <p className="text-[8px] sm:text-[9px] font-black text-slate-300 uppercase tracking-widest">Yield</p>
                      </div>
                   </div>
                 ))}
              </div>
           </GlassCard>
        </div>
      )}

      {/* Deploy Campaign modal */}
      {showDeployModal && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div
              onClick={() => setShowDeployModal(false)}
              className="absolute inset-0 bg-slate-900/60 transition-opacity backdrop-blur-sm"
              aria-hidden
            />
            <div
              className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6 sm:mb-8 shrink-0">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter">Deploy Campaign</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Strategic activation</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeployModal(false)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 overflow-y-auto pr-2 -mr-2 flex-1 scrollbar-thin scrollbar-thumb-slate-200">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Organizer</label>
                  <CustomSelect
                    value={deployForm.organizerId}
                    onChange={(v) => setDeployForm({ ...deployForm, organizerId: v })}
                    placeholder="Select organizer"
                    options={ORGANIZERS.map((org) => ({ value: org.id, label: org.name }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Budget</label>
                  <input
                    type="number"
                    min={50}
                    value={deployForm.budget}
                    onChange={(e) => setDeployForm({ ...deployForm, budget: Number(e.target.value) || 50 })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 sm:py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 transition-all font-black"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Targeting</label>
                  <CustomSelect
                    value={deployForm.targeting}
                    onChange={(v) => setDeployForm({ ...deployForm, targeting: v })}
                    options={TARGETING_OPTIONS.map((opt) => ({ value: opt, label: opt }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration</label>
                  <CustomSelect
                    value={deployForm.duration}
                    onChange={(v) => setDeployForm({ ...deployForm, duration: v })}
                    options={[
                      { value: '14 Days', label: '14 Days' },
                      { value: '30 Days', label: '30 Days' },
                    ]}
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowDeployModal(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const organizer = ORGANIZERS.find((o) => o.id === deployForm.organizerId);
                    if (!organizer) return;
                    setAds((prev) => [
                      {
                        id: `ad-${Date.now()}`,
                        organizer: organizer.name,
                        budget: deployForm.budget,
                        targeting: deployForm.targeting,
                        duration: deployForm.duration,
                        status: 'Active',
                        stats: { clicks: 0, impressions: 0 },
                        revenue: 0,
                        startDate: new Date().toISOString().slice(0, 10),
                      },
                      ...prev,
                    ]);
                    setShowDeployModal(false);
                  }}
                  className="flex-1 py-4 primary-gradient text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" /> Deploy
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      <DetailsDialog open={detailsOpen} title={detailsTitle} onClose={() => setDetailsOpen(false)}>
        {detailsPayload && (
          <div className="space-y-4">
             {/* Simple details view */}
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lead</p>
                <p className="font-black text-slate-800">{detailsPayload.organizer}</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exposure</p>
                  <p className="font-black text-slate-800">{detailsPayload.stats?.impressions ?? 0}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Engagement</p>
                  <p className="font-black text-slate-800">{detailsPayload.stats?.clicks ?? 0}</p>
                </div>
             </div>
          </div>
        )}
      </DetailsDialog>
    </div>
  );
};

export default AdsManagementPage;
