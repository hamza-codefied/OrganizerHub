import React from 'react';
import { PageHeader, GlassCard } from '../components/UI';
import { 
  Send, Users, UserCheck, Briefcase, 
  Bell, History, Search, Trash2, Filter,
  Megaphone, Zap, Radio
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

const NotificationsPage = () => {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <PageHeader 
        title="Propagation Command" 
        description="Strategically deploy push notifications and system-wide alerts to targeted platform clusters."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <GlassCard title="Broadcast Node" subtitle="Configure and deploy a new structural alert.">
            <div className="space-y-8 mt-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Target Cluster</label>
                  <div className="grid grid-cols-2 gap-3">
                     <button className="flex flex-col gap-2 items-center justify-center py-5 rounded-2xl border border-primary/20 bg-primary/5 text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/10 transition-all border-white shadow-xl">
                        <Users className="w-5 h-5" /> All Home Owners
                     </button>
                     <button className="flex flex-col gap-2 items-center justify-center py-5 rounded-2xl border border-secondary/20 bg-secondary/5 text-secondary font-black text-[10px] uppercase tracking-widest hover:bg-secondary/10 transition-all border-white shadow-xl">
                        <Briefcase className="w-5 h-5" /> Partners
                     </button>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Strategic Title</label>
                  <input type="text" placeholder="e.g. PLATFORM UPGRADE LIVE" className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-inner" />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Payload Content</label>
                  <textarea rows={4} placeholder="Construct the core message narrative..." className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none shadow-inner"></textarea>
               </div>

               <button className="w-full py-5 primary-gradient text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 group">
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  Initiate Broadcast
               </button>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8 px-2">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Strategic Propagation Log
             </h3>
             <div className="flex gap-3">
                <div className="relative group">
                   <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                   <input type="text" placeholder="Search logs..." className="bg-white/40 border border-white/60 rounded-xl py-2 pl-10 pr-4 text-xs font-bold outline-none w-48 focus:bg-white transition-all shadow-sm" />
                </div>
                <button className="p-2.5 border border-white/60 bg-white/40 backdrop-blur-md rounded-xl hover:bg-white transition-all shadow-sm">
                   <Filter className="w-4 h-4 text-slate-400" />
                </button>
             </div>
          </div>

          <div className="space-y-4">
             {[
               { title: 'Marketplace Architecture Update', target: 'Universal', date: '2 Hours Ago', reach: '1.4k', type: 'System', icon: Radio },
               { title: 'Strategic Payout Processed', target: 'Pros Only', date: 'Yesterday', reach: '180', type: 'Finance', icon: Zap },
               { title: 'Global Seasonal Promotion', target: 'Home Owners', date: '3 Days Ago', reach: '2.2k', type: 'Marketing', icon: Megaphone },
               { title: 'Operational Protocol Revision', target: 'Universal', date: '1 Week Ago', reach: '2.4k', type: 'Legal', icon: Bell },
             ].map((log, i) => (
               <motion.div
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
               >
                 <GlassCard className="p-6 flex items-center justify-between group cursor-pointer hover:border-primary/20 border-white/60 shadow-xl transition-all duration-500">
                    <div className="flex items-center gap-6">
                       <div className={cn(
                         "w-12 h-12 rounded-2xl flex items-center justify-center border border-white shadow-lg transition-all duration-500 group-hover:rotate-6",
                         log.type === 'Marketing' ? "bg-amber-50 text-amber-600" : 
                         log.type === 'Finance' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                       )}>
                          <log.icon className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="font-black text-slate-800 text-base tracking-tight leading-none group-hover:text-primary transition-colors">{log.title}</h4>
                          <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1">
                             <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {log.target} Cluster</span>
                             <span className="text-slate-200">|</span>
                             <span>{log.date} Sync Event</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-10">
                       <div className="text-right hidden sm:block">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Impact Radius</p>
                          <p className="font-black text-lg text-primary tracking-tighter">{log.reach}</p>
                       </div>
                       <button className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                 </GlassCard>
               </motion.div>
             ))}
          </div>
          
          <button className="w-full mt-10 py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all">
             Synchronize Legacy Logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
