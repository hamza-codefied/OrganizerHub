import React, { useState } from 'react';
import { PageHeader, GlassCard, StatCard, PremiumTabs } from '../components/UI';
import { SUBSCRIPTION_PLANS as INITIAL_PLANS, ORGANIZERS } from '../data/mockData';
import { cn, formatCurrency } from '../lib/utils';
import { 
  Check, Shield, Zap, Info, Layers, Users, CreditCard, 
  TrendingUp, Plus, Edit3, Trash2, X, Archive, RotateCcw,
  BarChart, Megaphone, ArrowUpCircle, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SubscriptionsPage = () => {
  const [plans, setPlans] = useState(INITIAL_PLANS);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<any>(null);
  const [planForm, setPlanForm] = useState({ 
    name: '', 
    price: 0, 
    features: [] as string[] 
  });
  const [newFeature, setNewFeature] = useState('');

  const handleOpenPlanModal = (plan: any = null) => {
    if (plan) {
      setCurrentPlan(plan);
      setPlanForm({ name: plan.name, price: plan.price, features: [...plan.features] });
    } else {
      setCurrentPlan(null);
      setPlanForm({ name: '', price: 0, features: [] });
    }
    setIsPlanModalOpen(true);
  };

  const handleSavePlan = () => {
    if (!planForm.name) return;
    if (currentPlan) {
      setPlans(plans.map(p => p.id === currentPlan.id ? { ...p, ...planForm } : p));
    } else {
      setPlans([...plans, { id: `p-${Date.now()}`, ...planForm }]);
    }
    setIsPlanModalOpen(false);
  };

  const addFeature = () => {
    if (newFeature && !planForm.features.includes(newFeature)) {
      setPlanForm({ ...planForm, features: [...planForm.features, newFeature] });
      setNewFeature('');
    }
  };

  const removeFeature = (feat: string) => {
    setPlanForm({ ...planForm, features: planForm.features.filter(f => f !== feat) });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <PageHeader 
        title="Economic Tiers" 
        description="Configure membership structures and oversee the pro-network subscription velocity."
      >
        <div className="flex items-center gap-4">
          <PremiumTabs 
            tabs={[
              { id: 'monthly', label: 'Monthly' },
              { id: 'yearly', label: 'Yearly' },
            ]}
            activeTab={billingCycle}
            onChange={setBillingCycle}
          />
          <button 
            onClick={() => handleOpenPlanModal()}
            className="flex items-center gap-2 primary-gradient text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 transition-all outline-none"
          >
            <Plus className="w-4 h-4" />
            New Tier
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {plans.map((plan, idx) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.15 }}
          >
            <GlassCard className={cn(
              "relative overflow-hidden group p-10 h-full border-white/60 shadow-2xl transition-all duration-500 hover:scale-[1.02]",
              plan.name === 'Premium' ? "border-primary/20 bg-emerald-50/5 shadow-primary/5" : ""
            )}>
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button onClick={() => handleOpenPlanModal(plan)} className="p-2 hover:bg-white rounded-xl text-slate-400 hover:text-primary shadow-sm border border-slate-100 bg-white/50 transition-all">
                    <Edit3 className="w-4 h-4" />
                 </button>
                 <button className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 shadow-sm border border-slate-100 bg-white/50 transition-all">
                    <Trash2 className="w-4 h-4" />
                 </button>
              </div>

              {plan.name === 'Premium' && (
                <div className="absolute top-8 right-[-45px] rotate-45 bg-gradient-to-r from-primary to-primary-700 text-white text-[9px] font-black px-12 py-1.5 shadow-xl tracking-[0.2em] uppercase">
                  Apex Tier
                </div>
              )}
              
              <div className="flex items-center gap-5 mb-10">
                <div className={cn(
                  "w-16 h-16 rounded-3xl flex items-center justify-center border-2 border-white shadow-xl transition-all duration-500 group-hover:rotate-6",
                  plan.name === 'Premium' ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                )}>
                  {plan.name === 'Premium' ? <Zap className="w-8 h-8" /> : <Shield className="w-8 h-8" />}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tighter">{plan.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Professional Capability</p>
                </div>
              </div>

              <div className="mb-10">
                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-black text-slate-800 tracking-tighter">
                    {formatCurrency(billingCycle === 'yearly' ? plan.price * 10 : plan.price).replace('.00', '')}
                  </span>
                  <span className="text-slate-400 text-xs font-black uppercase tracking-widest">
                    / {billingCycle === 'yearly' ? 'Fiscal Year' : 'Monthly'}
                  </span>
                </div>
              </div>

              <ul className="space-y-5 mb-12">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm font-bold text-slate-600">
                    <div className="mt-1 w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-emerald-500" strokeWidth={4} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="pt-10">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Strategic Network Log
           </h3>
           <div className="flex gap-4">
              <StatCard title="Active Subscriptions" value="1,402" icon={Users} className="py-2 px-4 h-auto min-w-[200px]" color="primary" />
              <StatCard title="Projected Revenue" value={formatCurrency(12400)} icon={TrendingUp} className="py-2 px-4 h-auto min-w-[200px]" color="blue" />
           </div>
        </div>

        <GlassCard className="overflow-hidden p-0 border-white/60 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 backdrop-blur-md border-b border-slate-100">
                <tr>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Partner Identity</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment Tier</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Auto-Renew</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Renewal Horizon</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Strategic Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ORGANIZERS.slice(0, 10).map((org, i) => (
                  <motion.tr 
                    key={org.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.05) }}
                    className="hover:bg-white/60 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden p-0.5">
                           <img src={org.avatar} className="w-full h-full object-cover rounded-[10px]" alt="" />
                        </div>
                        <div>
                           <p className="font-black text-slate-800 text-sm tracking-tight">{org.name}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{org.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm",
                        org.subscriptionPlan === 'Premium' ? "bg-amber-50/50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-400 border-slate-100"
                      )}>
                        {org.subscriptionPlan}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                       <span className={cn(
                         "text-[10px] font-black uppercase tracking-widest",
                         org.autoRenew ? "text-emerald-500" : "text-rose-500"
                       )}>
                         {org.autoRenew ? "Enabled" : "Disabled"}
                       </span>
                    </td>
                    <td className="px-8 py-5">
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{org.subscriptionExpiry}</p>
                       <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-0.5">Sync Expected</p>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-primary px-3 py-1.5 rounded-lg border border-slate-100 hover:border-primary/20 bg-white transition-all">Refund</button>
                         <button className="text-[9px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-100 transition-all">Cancel</button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-slate-50/30 border-t border-slate-100 text-center">
             <button className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-primary transition-all">View Extended Network Log</button>
          </div>
        </GlassCard>
      </div>

      {/* Plan Modal */}
      <AnimatePresence>
        {isPlanModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPlanModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-800 tracking-tighter">
                    {currentPlan ? 'Optimize Economic Tier' : 'Blueprint New Tier'}
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Tiered Architecture Protocol</p>
                </div>
                <button onClick={() => setIsPlanModalOpen(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tier Designation</label>
                      <input type="text" value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 transition-all" placeholder="Standard, Premium, etc." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Valuation ($)</label>
                      <div className="relative">
                         <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold">$</div>
                         <input type="number" value={planForm.price} onChange={(e) => setPlanForm({ ...planForm, price: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-10 pr-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 transition-all" />
                      </div>
                    </div>
                 </div>

                 <div className="space-y-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Feature Assignments & Privileges</label>
                    <div className="space-y-3 p-6 bg-slate-50 rounded-3xl border border-slate-100 min-h-[200px]">
                       <div className="flex flex-wrap gap-2">
                          {planForm.features.map((feat, i) => (
                            <span key={i} className="flex items-center gap-2 bg-white border border-slate-100 pl-3 pr-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm">
                               {feat.toLowerCase().includes('analytics') && <BarChart className="w-3 h-3 text-primary" />}
                               {feat.toLowerCase().includes('promotion') && <Megaphone className="w-3 h-3 text-emerald-500" />}
                               {feat.toLowerCase().includes('visibility') && <ArrowUpCircle className="w-3 h-3 text-amber-500" />}
                               {feat}
                               <button onClick={() => removeFeature(feat)} className="p-0.5 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-md">
                                  <X className="w-3 h-3" />
                               </button>
                            </span>
                          ))}
                       </div>
                       <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-200/50">
                          <input type="text" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addFeature()} placeholder="Protocol feature..." className="flex-1 bg-transparent text-xs font-bold outline-none border-b border-dashed border-slate-300 focus:border-primary/40 transition-all" />
                          <button onClick={addFeature} className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all">
                             <Plus className="w-4 h-4" />
                          </button>
                       </div>
                       <div className="grid grid-cols-2 gap-2 mt-4">
                          {['Analytics Access', 'Promotions', 'Visibility Boost', 'Priority Support'].map(f => (
                            <button key={f} onClick={() => !planForm.features.includes(f) && setPlanForm({...planForm, features: [...planForm.features, f]})} className="text-[9px] font-black uppercase tracking-widest p-2 bg-white border border-slate-100 rounded-lg hover:border-primary/20 text-slate-400 hover:text-primary transition-all text-left">+ {f}</button>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button onClick={() => setIsPlanModalOpen(false)} className="flex-1 py-5 bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-slate-100 transition-all">Decline Edit</button>
                <button onClick={handleSavePlan} className="flex-1 py-5 primary-gradient text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                   Save Economic Tier
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SubscriptionsPage;
