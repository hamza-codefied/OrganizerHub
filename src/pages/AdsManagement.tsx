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

const TARGETING_OPTIONS = ['Home Owners, UAE', 'Corporate HR, KSA', 'Events Sector, UAE', 'Luxury Market, Qatar'];

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
      header: "Campaign Lead", 
      accessor: (ad: any) => (
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="font-black text-slate-800 leading-tight tracking-tight">{ad.organizer}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Signal: {ad.id}</p>
          </div>
        </div>
      )
    },
    { 
      header: "Valuation & Flow", 
      accessor: (ad: any) => (
        <div className="flex flex-col">
           <span className="font-black text-slate-800 tracking-tighter text-sm">{formatCurrency(ad.budget)}</span>
           <span className="text-[9px] font-black text-slate-400 shadow-none uppercase tracking-widest">{ad.duration} Protocol</span>
        </div>
      )
    },
    { 
      header: "Strategic Targeting", 
      accessor: (ad: any) => (
        <div className="flex items-center gap-2">
           <MapPin className="w-3 h-3 text-slate-300" />
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{ad.targeting}</span>
        </div>
      )
    },
    { 
      header: "Performance Matrix", 
      accessor: (ad: any) => (
        <div className="flex items-center gap-6">
           <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-blue-600 mb-0.5">
                <Eye className="w-3 h-3" /> <span className="font-black text-xs tracking-tighter">{ad.stats.impressions}</span>
              </div>
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Exposure</span>
           </div>
           <div className="flex flex-col">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-0.5">
                <MousePointer2 className="w-3 h-3" /> <span className="font-black text-xs tracking-tighter">{ad.stats.clicks}</span>
              </div>
              <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Engagement</span>
           </div>
        </div>
      )
    },
    { 
      header: "Registry Status", 
      accessor: (ad: any) => (
        <div className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
          ad.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
          ad.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
          ad.status === 'Paused' ? "bg-slate-100 text-slate-400 border-slate-200" :
          "bg-rose-50 text-rose-600 border-rose-100"
        )}>
          {ad.status}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Ad Command" 
        description="Optimize platform visibility through premium featured slots and strategic campaign management."
      >
        <button
          type="button"
          onClick={() => setShowDeployModal(true)}
          className="flex items-center gap-2 primary-gradient text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" />
          Deploy Campaign
        </button>
      </PageHeader>

      <PremiumTabs 
        tabs={[
          { id: 'campaigns', label: 'Campaign Stream' },
          { id: 'revenue', label: 'Revenue Analytics' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'campaigns' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard title="Active Protocols" value={String(ads.filter(a => a.status === 'Active').length)} icon={Activity} color="emerald" />
            <StatCard title="Global Impressions" value="450.8k" icon={Eye} color="blue" />
            <StatCard title="Engagement Ratio" value="12.4k" icon={TrendingUp} color="primary" />
            <StatCard title="Budget Volume" value={formatCurrency(12500)} icon={DollarSign} color="secondary" />
          </div>

          <DataTable 
            columns={columns} 
            data={ads} 
            searchPlaceholder="Locate campaign by signal ID, partner, or status..." 
            rowActions={[
              {
                label: 'View Analytics',
                icon: BarChart3,
                onClick: (ad: any) => {
                  setDetailsTitle('Campaign Analytics (mock)');
                  setDetailsPayload(ad);
                  setDetailsOpen(true);
                },
              },
              {
                label: 'Approve Campaign',
                icon: CheckCircle2,
                onClick: (ad: any) =>
                  setAds((prev) => prev.map((x) => (x.id === ad.id ? { ...x, status: 'Active' } : x))),
                variant: 'success',
              },
              {
                label: 'Pause Campaign',
                icon: Pause,
                onClick: (ad: any) =>
                  setAds((prev) => prev.map((x) => (x.id === ad.id ? { ...x, status: 'Paused' } : x))),
              },
              {
                label: 'Resume Campaign',
                icon: Play,
                onClick: (ad: any) =>
                  setAds((prev) => prev.map((x) => (x.id === ad.id ? { ...x, status: 'Active' } : x))),
                variant: 'success',
              },
              {
                label: 'Reject / Kill',
                icon: XCircle,
                onClick: (ad: any) =>
                  setAds((prev) => prev.map((x) => (x.id === ad.id ? { ...x, status: 'Ended' } : x))),
                variant: 'danger',
              },
            ]}
          />
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <GlassCard className="lg:col-span-4" title="Yield Distribution">
              <div className="space-y-8 mt-8">
                  {[
                    { label: 'Geographic Search', val: 75, color: 'bg-primary', icon: Globe },
                    { label: 'In-Platform Spotlight', val: 45, color: 'bg-secondary', icon: Megaphone },
                    { label: 'Sidebar Placement', val: 12, color: 'bg-blue-500', icon: Layers },
                  ].map((item, i) => (
                    <div key={i} className="space-y-3">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <div className="flex items-center gap-2">
                             <item.icon className="w-3.5 h-3.5 text-slate-300" />
                             <span className="text-slate-400">{item.label}</span>
                          </div>
                          <span className="text-slate-800">{item.val}% Yield</span>
                       </div>
                       <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div style={{ width: `${item.val}%` }} className={cn("h-full rounded-full", item.color)} />
                       </div>
                    </div>
                  ))}
                  
                  <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 mt-12">
                     <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <p className="text-[11px] font-black text-primary uppercase tracking-[0.2em]">Strategy Insight</p>
                     </div>
                     <p className="text-sm font-bold text-slate-600 leading-relaxed italic">"Dynamic budget adjustment is currently increasing aggregate CTR by 24.2% across premium tiers."</p>
                  </div>
              </div>
           </GlassCard>

           <GlassCard className="lg:col-span-8" title="Recent Financial Flux">
              <div className="space-y-4 mt-8">
                 {ads.slice(0, 6).map((ad, i) => (
                   <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:bg-white transition-all group">
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-sm group-hover:rotate-6 transition-all">
                            <DollarSign className="w-6 h-6" />
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-800 tracking-tight">{ad.organizer}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ad.startDate} Protocol</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xl font-black text-emerald-600 tracking-tighter">+{formatCurrency(ad.revenue)}</p>
                         <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Total Yield</p>
                      </div>
                   </div>
                 ))}
              </div>
           </GlassCard>
        </div>
      )}

      {/* Deploy Campaign modal */}
      {showDeployModal && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div
              onClick={() => setShowDeployModal(false)}
              className="absolute inset-0 bg-slate-900/40"
              aria-hidden
            />
            <div
              className="relative w-full max-w-lg bg-white rounded-lg border border-slate-200 shadow-sm p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Deploy Campaign</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Launch a new ad campaign</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeployModal(false)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Partner</label>
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
                    max={1000}
                    value={deployForm.budget}
                    onChange={(e) => setDeployForm({ ...deployForm, budget: Number(e.target.value) || 50 })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
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
                        { value: '10 Days', label: '10 Days' },
                        { value: '14 Days', label: '14 Days' },
                        { value: '20 Days', label: '20 Days' },
                        { value: '30 Days', label: '30 Days' },
                      ]}
                    />
                </div>
              </div>

              <div className="mt-10 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeployModal(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
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
                  className="flex-1 py-4 bg-primary text-white text-[11px] font-semibold uppercase tracking-wide rounded-md flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" /> Deploy
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      <DetailsDialog
        open={detailsOpen}
        title={detailsTitle}
        onClose={() => setDetailsOpen(false)}
      >
        {detailsPayload && (
          <div className="space-y-4 mt-2">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Campaign ID</p>
              <p className="font-black text-slate-800">{detailsPayload.id}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Organizer</p>
                <p className="font-bold text-slate-800">{detailsPayload.organizer}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget</p>
                <p className="font-black text-slate-800">{formatCurrency(detailsPayload.budget)}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                <p className="font-bold text-slate-800">{detailsPayload.duration}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className="font-bold text-slate-800">{detailsPayload.status}</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Targeting</p>
              <p className="font-bold text-slate-800">{detailsPayload.targeting}</p>
            </div>
            {detailsPayload.stats && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Impressions</p>
                  <p className="font-black text-slate-800">{detailsPayload.stats.impressions}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clicks</p>
                  <p className="font-black text-slate-800">{detailsPayload.stats.clicks}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </DetailsDialog>
    </div>
  );
};

export default AdsManagementPage;
