import React from 'react';
import { PageHeader, GlassCard } from '../components/UI';
import { 
  Settings as SettingsIcon, Shield, CreditCard, Bell, 
  Users, Globe, ToggleLeft, ToggleRight, Save,
  Lock, Key, Zap, ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <PageHeader 
        title="Operational Protocol" 
        description="Configure system-wide parameters, economic rules, and multi-layered security policies."
      >
        <button className="flex items-center gap-2 primary-gradient text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 outline-none">
          <Save className="w-4 h-4" />
          Synchronize Configuration
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3 space-y-3">
           {[
             { name: 'Core Parameters', icon: SettingsIcon, active: true },
             { name: 'Strategic Security', icon: Shield },
             { name: 'Financial Tiers', icon: CreditCard },
             { name: 'Propagation Rules', icon: Bell },
             { name: 'Command Team', icon: Users },
             { name: 'Global Lexicon', icon: Globe },
           ].map((tab, i) => (
             <motion.button 
               key={i} 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.05 }}
               className={cn(
                "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
                tab.active 
                  ? "nav-active-item" 
                  : "text-slate-400 hover:bg-white/60 hover:text-primary hover:shadow-lg border border-transparent"
              )}>
                <tab.icon className="w-5 h-5 shrink-0" />
                {tab.name}
             </motion.button>
           ))}
           
           <div className="mt-10 p-6 bg-slate-50/50 backdrop-blur-md rounded-3xl border border-white/60">
              <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck className="w-5 h-5 text-primary" />
                 <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Protocol Integrity</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 leading-snug">All system changes are logged and audited via the global administrative ledger.</p>
           </div>
        </div>

        <div className="lg:col-span-9 space-y-10">
           <GlassCard title="Strategic Business Logic" subtitle="Determine platform commission velocity and economic thresholds.">
              <div className="space-y-10 mt-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Platform Commission Factor (%)</label>
                       <div className="relative">
                          <input type="number" defaultValue="15" className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xl font-black text-slate-800 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-inner" />
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">%</div>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Minimum Liquidity Release ($)</label>
                       <div className="relative">
                          <input type="number" defaultValue="50" className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xl font-black text-slate-800 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-inner" />
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">$</div>
                       </div>
                    </div>
                 </div>

                 <div className="pt-10 border-t border-slate-100 space-y-8">
                    <div className="flex items-center justify-between group">
                       <div className="max-w-md">
                          <p className="font-black text-slate-800 text-base tracking-tight leading-none group-hover:text-primary transition-colors">Accelerated Payouts</p>
                          <p className="text-xs font-bold text-slate-400 mt-2 leading-snug">Allow partners to release platform liquidity via instant protocol immediately upon session verification.</p>
                       </div>
                       <div className="text-primary cursor-pointer hover:scale-110 transition-transform p-2 bg-primary/5 rounded-2xl border border-primary/10">
                          <ToggleRight className="w-12 h-12" />
                       </div>
                    </div>
                    <div className="flex items-center justify-between group">
                       <div className="max-w-md">
                          <p className="font-black text-slate-800 text-base tracking-tight leading-none group-hover:text-secondary transition-colors">Global Preservation Mode</p>
                          <p className="text-xs font-bold text-slate-400 mt-2 leading-snug">Instantly suspend all public-facing application interfaces for high-priority scheduled maintenance events.</p>
                       </div>
                       <div className="text-slate-300 cursor-pointer hover:scale-110 transition-transform p-2 bg-slate-50 rounded-2xl border border-slate-100">
                          <ToggleLeft className="w-12 h-12" />
                       </div>
                    </div>
                 </div>
              </div>
           </GlassCard>

           <GlassCard title="Verification Command" subtitle="Manage high-level partner vetting and strategic onboarding protocols.">
              <div className="space-y-6 mt-8">
                 <div className="flex items-center gap-6 p-8 bg-primary/[0.03] rounded-[2rem] border border-primary/10 hover:border-primary/30 transition-all group">
                    <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-primary shadow-xl border border-primary/5 group-hover:rotate-6 transition-all duration-500">
                       <Zap className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                       <p className="text-lg font-black text-slate-800 tracking-tighter leading-none">Automated Pro Activation</p>
                       <p className="text-[13px] font-bold text-slate-500 mt-2 leading-snug max-w-sm">Registry entities are indexed and activated instantly post-verification without manual oversight.</p>
                    </div>
                    <div className="text-slate-200 cursor-pointer hover:text-slate-300 transition-colors">
                       <ToggleLeft className="w-14 h-14" />
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-6 p-8 bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/60 hover:border-blue-200 transition-all group shadow-sm">
                    <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-xl border border-blue-50 group-hover:-rotate-6 transition-all duration-500">
                       <Lock className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                       <p className="text-lg font-black text-slate-800 tracking-tighter leading-none">Command Multi-Factor Security</p>
                       <p className="text-[13px] font-bold text-slate-500 mt-2 leading-snug max-w-sm">Strict enforcement of cryptographic 2FA for all administrator and operational oversight accounts.</p>
                    </div>
                    <div className="text-primary cursor-pointer hover:scale-105 transition-all">
                       <ToggleRight className="w-14 h-14" />
                    </div>
                 </div>
              </div>
           </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
