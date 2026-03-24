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
    <div className="flex items-center gap-3 py-1">
      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 hidden xs:block">
        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.organizer}`} alt="" className="w-full h-full object-cover" />
      </div>
      <span className="font-black text-slate-800 text-[10px] sm:text-xs tracking-tight truncate max-w-[100px] xs:max-w-none">{req.organizer}</span>
    </div>
  );

  const activePromotionsColumns = [
    { header: "Organizer", accessor: (req: any) => organizerCell(req) },
    {
      header: "Type",
      className: "hidden sm:table-cell",
      accessor: (req: any) => (
        <span
          className={cn(
            "px-2.5 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest border",
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
        <span className="font-black text-slate-800 text-[10px] sm:text-xs tracking-tighter">
          {formatCurrency(req.price)}
        </span>
      ),
    },
    {
      header: "Perf",
      className: "hidden md:table-cell",
      accessor: (req: any) => (
        <span className="font-black text-slate-800 text-xs tabular-nums">{req.performance?.impressions ?? 0}</span>
      ),
    },
    {
      header: "Ends",
      className: "hidden xs:table-cell",
      accessor: (req: any) => (
        <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.placementDate}</span>
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
      className: "hidden sm:table-cell",
      accessor: (req: any) => (
        <span className={cn(
          "px-2.5 py-1 rounded-xl text-[8px] font-black uppercase tracking-widest border",
          req.type === 'Homepage Spotlight' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-blue-50 text-blue-600 border-blue-100"
        )}>
          {req.type}
        </span>
      )
    },
    { 
      header: "Price", 
      accessor: (req: any) => <span className="font-black text-slate-800 text-[10px] sm:text-xs tracking-tighter">{formatCurrency(req.price)}</span> 
    },
    { 
      header: "Status", 
      accessor: (req: any) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border shadow-sm",
          req.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
        )}>
          {req.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
          <span className="hidden xs:inline">{req.status}</span>
        </div>
      )
    },
    { 
      header: "Date", 
      className: "hidden md:table-cell",
      accessor: (req: any) => <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.placementDate}</span> 
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-12">
      <PageHeader 
        title="Promotions" 
        description="Spotlight options"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <PremiumTabs 
            tabs={[
              { id: 'inventory', label: 'Offer' },
              { id: 'requests', label: 'History' },
            ]}
            activeTab={activeTab}
            onChange={(id) => setActiveTab(id as 'inventory' | 'requests')}
            className="w-full sm:w-auto"
          />
          <button
            type="button"
            onClick={() => setShowDeployModal(true)}
            className="flex items-center justify-center gap-2 primary-gradient text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all outline-none"
          >
            <Plus className="w-4 h-4" />
            Add promotion
          </button>
        </div>
      </PageHeader>

      {activeTab === 'inventory' && (
        <div className="space-y-8 sm:space-y-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
             {[
               { name: 'Homepage Spotlight', price: 25, period: 'week', icon: Home, color: 'text-amber-500', bg: 'bg-amber-50' },
               { name: 'Highlight Listing', price: 15, period: 'week', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50' },
           
             ].map((pkg, i) => (
                <GlassCard key={i} className="text-center p-6 sm:p-8 border-slate-200">
                    <div className={cn("w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl mx-auto flex items-center justify-center mb-6 sm:mb-8 border-2 border-white shadow-xl transition-all duration-500", pkg.bg, pkg.color)}>
                       <pkg.icon className="w-8 h-8 sm:w-10 sm:h-10" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tighter mb-2">{pkg.name}</h3>
                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">Boost visibility</p>
                    <div className="flex items-baseline justify-center gap-1">
                       <span className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tighter">{formatCurrency(pkg.price)}</span>
                       <span className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">/ {pkg.period}</span>
                    </div>
                </GlassCard>
             ))}
          </div>

          <div className="space-y-6">
            <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 px-2">
               <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
               Active promotions
            </h3>
            <div className="overflow-hidden">
              <DataTable
                columns={activePromotionsColumns}
                data={requests.filter((r) => r.status === "Active")}
                searchPlaceholder="Search..."
                rowActions={[
                  {
                    label: "Profile",
                    icon: Eye,
                    onClick: (req: any) => {
                      const organizer = ORGANIZERS.find((o) => o.name === req.organizer);
                      if (organizer) navigate(`/users/organizers/${organizer.id}`);
                    },
                  },
                ]}
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="overflow-hidden">
           <DataTable 
             columns={columns} 
             data={requests} 
             searchPlaceholder="Search history..." 
             rowActions={[
               {
                 label: 'Profile',
                 icon: Eye,
                 onClick: (req: any) => {
                   const organizer = ORGANIZERS.find((o) => o.name === req.organizer);
                   if (organizer) navigate(`/users/organizers/${organizer.id}`);
                 },
               },
             ]}
           />
        </div>
      )}

      {/* Deploy Spotlight modal */}
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
              <div className="flex items-center justify-between mb-8 shrink-0">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter">Deploy promotion</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Strategic placement</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDeployModal(false)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6 overflow-y-auto pr-2 -mr-2 flex-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration</label>
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
                  className="flex-1 py-4 primary-gradient text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
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
