import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, GlassCard, StatCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { FEATURE_REQUESTS, ORGANIZERS } from '../data/mockData';
import CustomSelect from '../components/CustomSelect';
import DetailsDialog from '../components/DetailsDialog';
import { formatCurrency, cn } from '../lib/utils';
import { 
  Megaphone, Star, Flame, Trophy, Zap, Plus, ArrowRight,
  CheckCircle2, XCircle, Clock, Eye, BarChart3, Calendar,
  MousePointer2, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SPOTLIGHT_TYPES = ['Homepage Spotlight', 'Highlight Listing', 'Strategic Badge'] as const;

const PromotionsPage = () => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'requests'>('inventory');
  const navigate = useNavigate();
  const [requests, setRequests] = useState(FEATURE_REQUESTS);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployForm, setDeployForm] = useState({ organizerId: '', type: 'Homepage Spotlight' as string, duration: '1 week' });

  const columns = [
    { 
      header: "Partner Identity", 
      accessor: (req: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.organizer}`} alt="" className="w-full h-full object-cover" />
          </div>
          <span className="font-black text-slate-800 text-xs tracking-tight">{req.organizer}</span>
        </div>
      )
    },
    { 
      header: "Deployment Type", 
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
      header: "Valuation", 
      accessor: (req: any) => <span className="font-black text-slate-800 text-xs tracking-tighter">{formatCurrency(req.price)} <span className="text-[9px] text-slate-400">/ {req.duration}</span></span> 
    },
    { 
      header: "Flow Status", 
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
      header: "Placment Date", 
      accessor: (req: any) => <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.placementDate}</span> 
    },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <PageHeader 
        title="Featured Command" 
        description="Amplify platform visibility and manage strategic spotlight inventory for top performers."
      >
        <div className="flex flex-wrap items-center gap-3">
          <PremiumTabs 
            tabs={[
              { id: 'inventory', label: 'Inventory Architecture' },
              { id: 'requests', label: 'Strategic Requests' },
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
            Deploy Spotlight
          </button>
        </div>
      </PageHeader>

      {activeTab === 'inventory' && (
        <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             {[
               { name: 'Homepage Spotlight', price: 25, period: 'week', icon: Home, color: 'text-amber-500', bg: 'bg-amber-50' },
               { name: 'Highlight Listing', price: 15, period: 'week', icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50' },
               { name: 'Strategic Badge', price: 10, period: 'month', icon: Trophy, color: 'text-blue-500', bg: 'bg-blue-50' },
             ].map((pkg, i) => (
               <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                 <GlassCard className="text-center p-10 group border-white/60 shadow-2xl hover:scale-[1.02] transition-all duration-500">
                    <div className={cn("w-20 h-20 rounded-3xl mx-auto flex items-center justify-center mb-8 border-2 border-white shadow-xl transition-all duration-500 group-hover:rotate-12", pkg.bg, pkg.color)}>
                       <pkg.icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tighter mb-2">{pkg.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 px-4">Maximize acquisition through prime tactical placement.</p>
                    <div className="flex items-baseline justify-center gap-1 mb-8">
                       <span className="text-4xl font-black text-slate-800 tracking-tighter">{formatCurrency(pkg.price)}</span>
                       <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">/ {pkg.period}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setDeployForm({
                          organizerId: '',
                          type: pkg.name,
                          duration: pkg.period === 'month' ? '1 month' : '1 week',
                        });
                        setShowDeployModal(true);
                      }}
                      className="w-full py-4 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-primary hover:shadow-lg transition-all text-slate-500 active:scale-95"
                    >
                      Adjust Configuration
                    </button>
                 </GlassCard>
               </motion.div>
             ))}
          </div>

          <div className="space-y-8">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 px-2">
               <Zap className="w-5 h-5 text-primary" />
               Performance Propagation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {requests.filter((r) => r.status === 'Active').map((req, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 + (i * 0.1) }}>
                  <GlassCard className="p-0 overflow-hidden group border-white/60 shadow-xl hover:-translate-y-2 transition-all duration-500">
                     <div className="h-24 bg-slate-50 relative overflow-hidden">
                        <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg border border-white">
                           {req.type}
                        </div>
                        <div className="p-4 flex gap-4">
                           <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-xl overflow-hidden bg-white">
                              <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.organizer}`} alt="" className="w-full h-full object-cover" />
                           </div>
                           <div className="pt-2">
                              <h4 className="font-black text-slate-800 text-xs tracking-tight">{req.organizer}</h4>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Node</p>
                           </div>
                        </div>
                     </div>
                     <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-blue-500">
                                 <Eye className="w-3 h-3" /> <span className="text-[11px] font-black tracking-tighter">{req.performance.impressions}</span>
                              </div>
                              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Network Exposure</p>
                           </div>
                           <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-emerald-500">
                                 <MousePointer2 className="w-3 h-3" /> <span className="text-[11px] font-black tracking-tighter">{req.performance.clicks}</span>
                              </div>
                              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Conversion Clicks</p>
                           </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                           <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Scheduled Until <span className="text-secondary">{req.placementDate}</span></div>
                           <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 hover:text-primary transition-all"><BarChart3 className="w-3.5 h-3.5" /></button>
                        </div>
                     </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
           <DataTable 
             columns={columns} 
             data={requests} 
             searchPlaceholder="Audit requests by partner name or deployment type..." 
             rowActions={[
               {
                 label: 'View Profile',
                 icon: Eye,
                 onClick: (req: any) => {
                   const organizer = ORGANIZERS.find((o) => o.name === req.organizer);
                   if (organizer) navigate(`/users/organizers/${organizer.id}`);
                 },
               },
               {
                 label: 'Approve Placement',
                 icon: CheckCircle2,
                 onClick: (req: any) => setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status: 'Active' } : r))),
                 variant: 'success',
               },
               {
                 label: 'Reject Request',
                 icon: XCircle,
                 onClick: (req: any) => setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status: 'Pending' } : r))),
                 variant: 'danger',
               },
               {
                 label: 'Schedule Delay',
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
      <AnimatePresence>
        {showDeployModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeployModal(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Deploy Spotlight</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Strategic placement for partners</p>
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Placement Type</label>
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
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PromotionsPage;
