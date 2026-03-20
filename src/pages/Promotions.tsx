import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { PageHeader, GlassCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { FEATURE_REQUESTS, ORGANIZERS } from '../data/mockData';
import CustomSelect from '../components/CustomSelect';
import DetailsDialog from '../components/DetailsDialog';
import { formatCurrency, cn } from '../lib/utils';
import { 
  Flame, Zap, Plus,
  CheckCircle2, XCircle, Clock, Eye, Calendar,
  Home
} from 'lucide-react';

const SPOTLIGHT_TYPES = ['Homepage Spotlight', 'Highlight Listing'] as const;

const PromotionsPage = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'requests'>('inventory');
  const navigate = useNavigate();
  const [requests, setRequests] = useState(
    FEATURE_REQUESTS.map((request) => ({ ...request, status: 'Active' }))
  );
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployForm, setDeployForm] = useState({ organizerId: '', type: 'Homepage Spotlight' as string, duration: '1 week' });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!showDeployModal) return;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    // Prevent background scroll + minimize layout shift when the scrollbar disappears.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    body.style.overflow = 'hidden';

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [showDeployModal]);

  const organizerCell = (req: { organizer: string }) => (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.organizer}`} alt="" className="w-full h-full object-cover" />
      </div>
      <span className="font-black text-slate-800 text-xs tracking-tight">{req.organizer}</span>
    </div>
  );

  const activePromotionsColumns = [
    { header: "Organizer", accessor: (req: any) => organizerCell(req) },
    {
      header: "Type",
      accessor: (req: any) => (
        <span
          className={cn(
            "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border",
            req.type === "Homepage Spotlight"
              ? "bg-amber-50 text-amber-600 border-amber-100"
              : "bg-blue-50 text-blue-600 border-blue-100",
          )}
        >
          {req.type}
        </span>
      ),
    },
    {
      header: "Price",
      accessor: (req: any) => (
        <span className="font-black text-slate-800 text-xs tracking-tighter">
          {formatCurrency(req.price)} <span className="text-[9px] text-slate-400">/ {req.duration}</span>
        </span>
      ),
    },
    {
      header: "Impressions",
      accessor: (req: any) => (
        <span className="font-black text-slate-800 text-xs tabular-nums">{req.performance?.impressions ?? 0}</span>
      ),
    },
    {
      header: "Ends",
      accessor: (req: any) => (
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.placementDate}</span>
      ),
    },
  ];

  const columns = [
    { 
      header: "Organizer", 
      accessor: (req: any) => organizerCell(req)
    },
    { 
      header: "Type", 
      accessor: (req: any) => (
        <span className={cn(
          "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border",
          req.type === 'Homepage Spotlight' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-blue-50 text-blue-600 border-blue-100"
        )}>
          {req.type}
        </span>
      )
    },
    { 
      header: "Price", 
      accessor: (req: any) => <span className="font-black text-slate-800 text-xs tracking-tighter">{formatCurrency(req.price)} <span className="text-[9px] text-slate-400">/ {req.duration}</span></span> 
    },
    { 
      header: "Status", 
      accessor: (req: any) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
          req.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
        )}>
          {req.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          {req.status}
        </div>
      )
    },
    { 
      header: "Placement date", 
      accessor: (req: any) => <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.placementDate}</span> 
    },
  ];

  return (
    <div className="space-y-12">
      <PageHeader 
        title="Promotions" 
        description="Create and manage your spotlight promotions."
      >
        <div className="flex flex-wrap items-center gap-3">
          <PremiumTabs 
            tabs={[
              { id: 'inventory', label: 'Spotlight options' },
              { id: 'requests', label: 'Requests' },
            ]}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as 'inventory' | 'requests')}
          />
          <button
            type="button"
            onClick={() => setShowDeployModal(true)}
            className="flex items-center gap-2 primary-gradient text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 transition-all outline-none"
          >
            <Plus className="w-4 h-4" />
            Add promotion
          </button>
        </div>
      </PageHeader>

      {activeTab === 'inventory' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             {[
               { name: 'Homepage Spotlight', price: 25, period: 'week', icon: Home, color: 'text-amber-500', bg: 'bg-amber-50' },
               { name: 'Highlight Listing', price: 15, period: 'week', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50' },
          
             ].map((pkg, i) => (
               <div key={i}>
                 <GlassCard className="text-center p-8 border-slate-200">
                    <div className={cn("w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-8 border-2 border-white shadow-xl transition-all duration-500 group-hover:rotate-12", pkg.bg, pkg.color)}>
                       <pkg.icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tighter mb-2">{pkg.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">Boost visibility for this organizer.</p>
                    <div className="flex items-baseline justify-center gap-1 mb-8">
                       <span className="text-4xl font-black text-slate-800 tracking-tighter">{formatCurrency(pkg.price)}</span>
                       <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">/ {pkg.period}</span>
                    </div>
                   
                 </GlassCard>
               </div>
             ))}
          </div>

          <div className="space-y-8">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 px-2">
               <Zap className="w-5 h-5 text-primary" />
               Active promotions
            </h3>
            <DataTable
              columns={activePromotionsColumns}
              data={requests.filter((r) => r.status === "Active")}
              searchPlaceholder="Search by organizer, type, or date..."
              rowActions={[
                {
                  label: "View profile",
                  icon: Eye,
                  onClick: (req: any) => {
                    const organizer = ORGANIZERS.find((o) => o.name === req.organizer);
                    if (organizer) navigate(`/users/organizers/${organizer.id}`);
                  },
                },
                {
                  label: "Update date",
                  icon: Calendar,
                  onClick: (req: any) => {
                    const nextDate = new Date();
                    nextDate.setDate(nextDate.getDate() + 7);
                    const iso = nextDate.toISOString().slice(0, 10);
                    setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, placementDate: iso } : r)));
                  },
                },
              ]}
            />
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div>
           <DataTable 
             columns={columns} 
             data={requests} 
             searchPlaceholder="Search by organizer, type, or status..." 
             rowActions={[
               {
                 label: 'View profile',
                 icon: Eye,
                 onClick: (req: any) => {
                   const organizer = ORGANIZERS.find((o) => o.name === req.organizer);
                   if (organizer) navigate(`/users/organizers/${organizer.id}`);
                 },
               },
               {
                 label: 'Update date',
                 icon: Calendar,
                 onClick: (req: any) => {
                   const nextDate = new Date();
                   nextDate.setDate(nextDate.getDate() + 7);
                   const iso = nextDate.toISOString().slice(0, 10);
                   setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, placementDate: iso } : r)));
                 },
               },
             ]}
           />
        </div>
      )}

      {/* Deploy Spotlight modal */}
      {showDeployModal && typeof document !== 'undefined' && createPortal(
          <div className="fixed inset-0 z-9999 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div
              onClick={() => setShowDeployModal(false)}
              className="absolute inset-0 bg-slate-900/40"
              aria-hidden
            />
            <div
              className="relative w-full max-w-lg bg-white rounded-lg border border-slate-200 shadow-lg p-6 flex flex-col max-h-[calc(100vh-2rem)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8 shrink-0">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Deploy promotion</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Choose an organizer and type</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeployModal(false)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 overflow-y-auto pr-2 -mr-2 flex-1 min-h-0">
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                  <CustomSelect
                    value={deployForm.type}
                    onChange={(v) => setDeployForm({ ...deployForm, type: v })}
                    options={SPOTLIGHT_TYPES.map((type) => ({ value: type, label: type }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Time period</label>
                  <CustomSelect
                    value={deployForm.duration}
                    onChange={(v) => setDeployForm({ ...deployForm, duration: v })}
                    options={[
                      { value: '1 week', label: '1 week' },
                      { value: '2 weeks', label: '2 weeks' },
                      { value: '1 month', label: '1 month' },
                    ]}
                  />
                </div>
              </div>

              <div className="mt-auto flex gap-3 shrink-0 pt-8">
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

                    const price =
                      deployForm.type === 'Homepage Spotlight' ? 25 :
                      deployForm.type === 'Highlight Listing' ? 15 :
                      10;

                    const nextDate = new Date();
                    nextDate.setDate(nextDate.getDate() + 1);
                    const iso = nextDate.toISOString().slice(0, 10);

                    setRequests((prev) => [
                      {
                        id: `feat-${Date.now()}`,
                        organizer: organizer.name,
                        type: deployForm.type,
                        price,
                        duration: deployForm.duration,
                        status: 'Active',
                        placementDate: iso,
                        performance: {
                          clicks: Math.floor(Math.random() * 200),
                          impressions: Math.floor(Math.random() * 2000),
                        },
                      },
                      ...prev,
                    ]);

                    setShowDeployModal(false);
                  }}
                  className="flex-1 py-4 primary-gradient text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" /> Deploy
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default PromotionsPage;
