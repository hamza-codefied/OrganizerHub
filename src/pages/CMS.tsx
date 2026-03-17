import { useState } from 'react';
import { PageHeader, GlassCard, PremiumTabs } from '../components/UI';
import { 
  FileText, Globe, Layout, 
  Edit3, Eye, Plus, Settings as SettingsIcon,
  Sparkles, Layers, Shield, Bookmark, 
  Smartphone, Newspaper,
  ArrowUpRight, Trash2, CheckCircle2, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const CMSPage = () => {
  const [activeTab, setActiveTab] = useState<'visuals' | 'static' | 'articles'>('visuals');

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <PageHeader 
        title="Content Command" 
        description="Strategic oversight of platform narrative. Manage assets, static deployments, and metadata."
      >
        <PremiumTabs 
          tabs={[
            { id: 'visuals', label: 'Interface Visuals' },
            { id: 'static', label: 'Static Registry' },
            { id: 'articles', label: 'Strategic Narrative' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </PageHeader>

      <AnimatePresence mode="wait">
        {activeTab === 'visuals' && (
          <motion.div 
            key="visuals"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          >
            <GlassCard title="Hero Velocity" subtitle="Strategic visual assets for the global landing interface.">
              <div className="space-y-6 mt-6">
                 {[
                   { title: 'Spring Harvest Collection', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=200&fit=crop', status: 'Live Deployment', type: 'Main Banner' },
                   { title: 'Global Pro Onboarding', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=200&fit=crop', status: 'Scheduled Index', type: 'Sub Banner' },
                 ].map((slide, i) => (
                   <div key={i} className="group relative rounded-[2.5rem] overflow-hidden border border-white shadow-2xl">
                      <img src={slide.img} alt="" className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-1000" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent p-8 flex flex-col justify-end">
                         <div className="flex justify-between items-end">
                            <div className="space-y-1">
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="px-2 py-0.5 bg-primary rounded text-[7px] font-black text-white uppercase tracking-widest">{slide.type}</span>
                                  <span className="text-white/40 text-[7px] font-black uppercase tracking-widest">{slide.status}</span>
                               </div>
                               <p className="text-white font-black text-xl tracking-tight leading-none">{slide.title}</p>
                            </div>
                            <div className="flex gap-2">
                               <button className="p-3 bg-white/10 hover:bg-primary text-white rounded-xl backdrop-blur-xl transition-all border border-white/20"><Edit3 className="w-4 h-4" /></button>
                               <button className="p-3 bg-white/10 hover:bg-white text-slate-800 rounded-xl backdrop-blur-xl transition-all border border-white/20"><Eye className="w-4 h-4" /></button>
                            </div>
                         </div>
                      </div>
                   </div>
                 ))}
                 <button className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all outline-none">
                    + Initialized New Hero Node
                 </button>
              </div>
            </GlassCard>

            <GlassCard title="Featured Segments" subtitle="Curated homepage sections highlighting top-tier results.">
               <div className="space-y-4 mt-6">
                  {[
                    { title: 'Eco-Friendly Elite', items: '12 Slots', status: 'Active', icon: Sparkles },
                    { title: 'Top Global Organizers', items: '8 Slots', status: 'Dynamic', icon: Bookmark },
                    { title: 'Limited Time Flash Pro', items: 'Unlimited', status: 'Inactive', icon: Zap },
                  ].map((section, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group transition-all hover:bg-white hover:shadow-xl hover:border-primary/10">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:rotate-6 shadow-sm border border-slate-100 transition-all">
                             <section.icon className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-800 tracking-tight">{section.title}</p>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{section.items} Protocol • {section.status}</p>
                          </div>
                       </div>
                       <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button className="p-2.5 text-slate-400 hover:text-primary transition-colors"><Edit3 className="w-4 h-4" /></button>
                          <button className="p-2.5 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </div>
                  ))}
                  <button className="flex items-center justify-center gap-3 w-full py-4 bg-primary/5 border border-primary/10 rounded-2xl text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                     <Plus className="w-4 h-4" /> Inject New Segment
                  </button>
               </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'static' && (
          <motion.div 
            key="static"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-1 gap-10"
          >
            <GlassCard title="Global Static Registry" subtitle="Legal frameworks, corporate narrative, and aid architecture.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                 {[
                   { name: 'Global Terms of Service', updated: '2 Hours Ago', icon: Shield, sector: 'Legal' },
                   { name: 'Privacy Assurance Protocol', updated: '1 Month Ago', icon: FileText, sector: 'Privacy' },
                   { name: 'Strategic Corporate Narrative', updated: '3 Months Ago', icon: Globe, sector: 'About' },
                   { name: 'Pro Verification Guidelines', updated: '1 Week Ago', icon: CheckCircle2, sector: 'Guidelines' },
                   { name: 'Help & Operations Center', updated: 'Today', icon: Layers, sector: 'Support' },
                   { name: 'Community Standards', updated: 'Yesterday', icon: Smartphone, sector: 'Rules' },
                 ].map((page, i) => (
                   <motion.div 
                     key={i} 
                     whileHover={{ x: 10 }}
                     className="flex items-center justify-between p-6 rounded-[2rem] bg-slate-50/50 border border-slate-100 cursor-pointer group hover:bg-white hover:shadow-2xl hover:border-primary/10"
                   >
                      <div className="flex items-center gap-5">
                         <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:-rotate-6 shadow-sm border border-slate-100 transition-all">
                            <page.icon className="w-7 h-7" />
                         </div>
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em]">{page.sector}</span>
                            </div>
                            <p className="text-sm font-black text-slate-800 tracking-tight group-hover:text-primary transition-colors">{page.name}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Last Sync: {page.updated}</p>
                         </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-slate-200 group-hover:text-primary transition-all" />
                   </motion.div>
                 ))}
              </div>
            </GlassCard>
          </motion.div>
        )}

        {activeTab === 'articles' && (
          <motion.div 
            key="articles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {[
                  { title: 'Sustainable Space: The 2024 Index', author: 'Admin Delta', date: 'Mar 12', cat: 'Lifestyle' },
                  { title: 'Mastering Minimalist Office Flow', author: 'Pro Hub', date: 'Mar 10', cat: 'Business' },
                  { title: 'The Psychology of Decluttering', author: 'Insight Team', date: 'Mar 08', cat: 'Science' },
                ].map((post, i) => (
                  <GlassCard key={i} className="hover:-translate-y-2 transition-all cursor-pointer group">
                     <div className="flex items-center justify-between mb-6">
                        <span className="px-3 py-1 bg-primary/5 text-primary text-[8px] font-black uppercase tracking-widest rounded-lg border border-primary/10">{post.cat}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{post.date}</span>
                     </div>
                     <h4 className="text-lg font-black text-slate-800 tracking-tight mb-4 leading-tight group-hover:text-primary transition-colors">{post.title}</h4>
                     <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400 tracking-tighter">AD</div>
                           <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{post.author}</span>
                        </div>
                        <div className="flex gap-1">
                           <button className="p-2 text-slate-300 hover:text-primary transition-colors"><Edit3 className="w-4 h-4" /></button>
                           <button className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                     </div>
                  </GlassCard>
                ))}
             </div>
             <button className="flex items-center justify-center gap-3 w-full py-8 border-2 border-dashed border-slate-100 rounded-[3rem] text-slate-300 text-[11px] font-black uppercase tracking-[0.3em] hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all">
                <Newspaper className="w-5 h-5" /> Initialize New Narrative Payload
             </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 border-t border-slate-100 pt-12">
         <GlassCard className="p-10 border-blue-500/10 bg-blue-500/[0.02] hover:bg-blue-500/[0.05] transition-all cursor-pointer group">
            <div className="flex items-center gap-5 mb-8">
               <div className="w-16 h-16 rounded-[2rem] bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-2xl shadow-blue-500/5 group-hover:rotate-12 transition-all">
                  <Globe className="w-8 h-8" />
               </div>
               <div>
                  <h4 className="font-black text-slate-800 tracking-tight text-xl">SEO Core</h4>
                  <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Visibility Optimization</p>
               </div>
            </div>
            <p className="text-xs font-bold text-slate-500 mb-10 leading-relaxed italic">"Calibrate meta-traversal, strategic sitemaps, and search index velocity for maximum global visibility."</p>
            <button className="w-full py-4 bg-blue-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all outline-none">Configure Meta</button>
         </GlassCard>
         
         <GlassCard className="p-10 border-primary/10 bg-primary/[0.02] hover:bg-primary/[0.05] transition-all cursor-pointer group">
            <div className="flex items-center gap-5 mb-8">
               <div className="w-16 h-16 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-2xl shadow-primary/5 group-hover:rotate-12 transition-all">
                  <Layout className="w-8 h-8" />
               </div>
               <div>
                  <h4 className="font-black text-slate-800 tracking-tight text-xl">App Lexicon</h4>
                  <p className="text-[9px] font-black text-primary uppercase tracking-widest">Strategic Copy Engine</p>
               </div>
            </div>
            <p className="text-xs font-bold text-slate-500 mb-10 leading-relaxed italic">"Update strategic labels, text modules, and localization vectors across the global application interface."</p>
            <button className="w-full py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all outline-none">Edit Lexicon</button>
         </GlassCard>

         <GlassCard className="p-10 border-slate-200/50 hover:bg-slate-50 transition-all cursor-pointer group">
            <div className="flex items-center gap-5 mb-8">
               <div className="w-16 h-16 rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 group-hover:rotate-12 transition-all">
                  <SettingsIcon className="w-8 h-8" />
               </div>
               <div>
                  <h4 className="font-black text-slate-800 tracking-tight text-xl">System Config</h4>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Site Identity & Meta</p>
               </div>
            </div>
            <p className="text-xs font-bold text-slate-500 mb-10 leading-relaxed italic">"Modify universal site identity, assets, and strategic social propagation preferences for the platform hub."</p>
            <button className="w-full py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-100 transition-all active:scale-95 outline-none">Site Settings</button>
         </GlassCard>
      </div>
    </div>
  );
};

export default CMSPage;
