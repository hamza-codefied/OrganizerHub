import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, GlassCard, PremiumTabs } from '../components/UI';
import { ORGANIZERS } from '../data/mockData';
import { cn, formatCurrency } from '../lib/utils';
import { 
  BadgeCheck, Ban, Star, Briefcase, ShieldCheck, Zap,
  X, MapPin, Mail, Phone, Calendar, Award, Image as ImageIcon,
  Clock, Eye, ChevronLeft, CheckCircle2, XCircle, Power,
  TrendingUp, BarChart3, CreditCard, Target, ExternalLink,
  ChevronRight, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type OrganizerStatus = 'Active' | 'Pending' | 'Rejected' | 'Deactivated';

const OrganizerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const foundOrg = ORGANIZERS.find(o => o.id === id);
  const [org, setOrg] = useState<typeof ORGANIZERS[0] | null>(foundOrg ?? null);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'portfolio' | 'performance'>('overview');

  useEffect(() => {
    if (foundOrg) setOrg(foundOrg);
    else setOrg(null);
  }, [id, foundOrg]);

  const updateStatus = (status: OrganizerStatus) => {
    if (org) setOrg({ ...org, status });
  };

  if (!org) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 border border-rose-100 italic font-black text-4xl">!</div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Professional profile not recovered</p>
        <button onClick={() => navigate('/users/organizers')} className="text-primary font-black text-xs uppercase tracking-widest hover:underline">Return to Pro Registry</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate('/users/organizers')}
          className="p-2 hover:bg-white/60 rounded-xl transition-all text-slate-400 hover:text-primary group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Partner Management</p>
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Org Network Index / {org.id}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-8">
           <GlassCard className="p-0 overflow-hidden">
              <div className="h-32 bg-slate-100 blur-3xl -mb-16"></div>
              <div className="p-8 pt-0 flex flex-col items-center text-center">
                 <div className="w-32 h-32 rounded-[2.5rem] bg-white border-4 border-white shadow-2xl overflow-hidden mb-6 relative group">
                    <img src={org.avatar} alt={org.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 </div>
                 <h1 className="text-3xl font-black text-slate-800 tracking-tighter leading-none">{org.name}</h1>
                 <div className="flex items-center gap-2 mt-3">
                    <span className={cn(
                      "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                      org.subscriptionPlan === 'Premium' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-400 border-slate-100"
                    )}>{org.subscriptionPlan} Tier</span>
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-black text-slate-800">{org.rating}</span>
                    </div>
                 </div>
                 <p className="text-sm font-bold text-slate-500 mt-6 leading-relaxed italic">"{org.bio}"</p>

                 <div className="w-full space-y-4 mt-8 pt-8 border-t border-slate-100 text-left">
                    <div className="flex items-center gap-4">
                       <Mail className="w-4 h-4 text-slate-300" />
                       <p className="text-sm font-bold text-slate-700 truncate">{org.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <Phone className="w-4 h-4 text-slate-300" />
                       <p className="text-sm font-bold text-slate-700">{org.phone}</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <Calendar className="w-4 h-4 text-slate-300" />
                       <p className="text-sm font-bold text-slate-700">Joined {org.joinedDate}</p>
                    </div>
                 </div>
              </div>
           </GlassCard>

           <GlassCard title="Operational Control" subtitle="Approve, restrict or modify professional status.">
              <div className="space-y-4 mt-6">
                 {org.status === 'Pending' && (
                    <div className="grid grid-cols-2 gap-3">
                       <button
                         type="button"
                         onClick={() => updateStatus('Active')}
                         className="primary-gradient py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
                       >
                          <CheckCircle2 className="w-4 h-4" /> Approve
                       </button>
                       <button
                         type="button"
                         onClick={() => updateStatus('Rejected')}
                         className="bg-rose-50 border border-rose-100 py-4 rounded-2xl text-rose-600 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-100/80 transition-colors"
                       >
                          <XCircle className="w-4 h-4" /> Reject
                       </button>
                    </div>
                 )}
                 {org.status === 'Active' && (
                    <button
                      type="button"
                      onClick={() => updateStatus('Deactivated')}
                      className="w-full flex items-center justify-between p-4 bg-rose-100/40 hover:bg-rose-100/60 rounded-2xl border border-rose-200 transition-all text-rose-600"
                    >
                       <span className="text-xs font-black uppercase tracking-widest">Deactivate Partner</span>
                       <Power className="w-5 h-5" />
                    </button>
                 )}
                 {(org.status === 'Rejected' || org.status === 'Deactivated') && (
                    <button
                      type="button"
                      onClick={() => updateStatus('Active')}
                      className="w-full flex items-center justify-between p-4 primary-gradient rounded-2xl text-white transition-all shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
                    >
                       <span className="text-xs font-black uppercase tracking-widest">Restore Network Access</span>
                       <CheckCircle2 className="w-5 h-5" />
                    </button>
                 )}
                 <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                       Current Core Status: <span className={cn("inline-block ml-1 underline", 
                          org.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'
                       )}>{org.status}</span>
                    </p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Propagated {org.lastActive}</p>
                 </div>
              </div>
           </GlassCard>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-8">
           <PremiumTabs 
             tabs={[
               { id: 'overview', label: 'Overview' },
               { id: 'services', label: 'Services' },
               { id: 'portfolio', label: 'Portfolio' },
               { id: 'performance', label: 'Performance' },
             ]}
             activeTab={activeTab}
             onChange={setActiveTab}
           />

           <div className="space-y-8">
              {activeTab === 'overview' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {[
                        { label: 'Completed Jobs', value: org.completedJobs, icon: Briefcase, color: 'blue' },
                        { label: 'Total Earnings', value: formatCurrency(org.earnings), icon: TrendingUp, color: 'emerald' },
                        { label: 'Response Rate', value: `${org.responseRate}%`, icon: Target, color: 'amber' },
                        { label: 'On-Time Rate', value: `${org.onTimeRate}%`, icon: Clock, color: 'orange' },
                      ].map((stat, i) => (
                        <GlassCard key={i} className="p-6 text-center border-white/40">
                          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 border shadow-sm",
                             stat.color === 'blue' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                             stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                             stat.color === 'amber' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                             'bg-orange-50 text-orange-500 border-orange-100'
                          )}>
                             <stat.icon className="w-5 h-5" />
                          </div>
                          <p className="text-2xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                        </GlassCard>
                      ))}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <GlassCard title="Subscription Protocol" subtitle="Current network authority level and billing.">
                         <div className="mt-6 flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-3xl">
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Plan</p>
                               <p className="text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
                                  {org.subscriptionPlan} Tier 
                                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                               </p>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Next Sync Event</p>
                               <p className="text-sm font-bold text-slate-800">Dec 15, 2024</p>
                            </div>
                         </div>
                      </GlassCard>

                      <GlassCard title="Certifications Index" subtitle="Validated professional credentials and authority.">
                         <div className="mt-6 flex flex-wrap gap-2">
                            {org.certifications.map((cert, i) => (
                              <div key={i} className="flex items-center gap-2 px-4 py-2.5 bg-primary/5 text-primary rounded-xl border border-primary/10">
                                <Award className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{cert}</span>
                              </div>
                            ))}
                         </div>
                      </GlassCard>
                   </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between px-2">
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{org.services.length} Service Capabilities Identified</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {org.services.map((service, i) => (
                      <GlassCard key={i} className="p-8 group hover:border-primary/20 transition-all text-center">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-primary/5 flex items-center justify-center text-primary mx-auto mb-6 border border-primary/10 group-hover:rotate-12 transition-all">
                          <Briefcase className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tighter leading-none mb-2">{service}</h3>
                        <div className="flex items-center justify-center gap-1.5 py-2 px-4 bg-slate-50 rounded-xl w-fit mx-auto mt-4 border border-slate-100">
                           <span className="text-xl font-black text-slate-800">${Math.floor(Math.random() * 50 + 100)}</span>
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">/ hr</span>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'portfolio' && (
                <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">{org.portfolio.length} Visual Evidences Recorded</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {org.portfolio.map((img, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative rounded-[2rem] overflow-hidden border border-white shadow-2xl cursor-pointer"
                      >
                        <img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                          <div className="flex items-center gap-3 text-white">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                               <ArrowUpRight className="w-5 h-5" />
                            </div>
                            <div>
                               <p className="text-xs font-black uppercase tracking-widest">Exhibit #{String(i + 1).padStart(2, '0')}</p>
                               <p className="text-[10px] text-white/60 font-medium">Verified Operational Deployment</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { label: 'Network Response Velocity', value: org.responseRate, color: 'primary', icon: Clock },
                      { label: 'On-Time Deployment Metric', value: org.onTimeRate, color: 'blue', icon: Target },
                      { label: 'Operator Reputation Factor', value: Math.min(Math.round(parseFloat(org.rating) * 20), 100), color: 'amber', icon: Star },
                      { label: 'Home Owner Retention Amplitude', value: Math.floor(Math.random() * 30) + 50, color: 'secondary', icon: TrendingUp },
                    ].map((metric, i) => (
                      <GlassCard key={i} className="p-8 border-white/40">
                        <div className="flex justify-between items-start mb-6">
                           <div className="flex items-center gap-3">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", 
                                 metric.color === 'primary' ? 'bg-emerald-50 text-emerald-500' :
                                 metric.color === 'blue' ? 'bg-blue-50 text-blue-500' :
                                 metric.color === 'amber' ? 'bg-amber-50 text-amber-500' :
                                 'bg-rose-50 text-rose-500'
                              )}>
                                 <metric.icon className="w-5 h-5" />
                              </div>
                              <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{metric.label}</span>
                           </div>
                           <span className="text-2xl font-black text-slate-800 tracking-tighter">{metric.value}%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${metric.value}%` }}
                            transition={{ duration: 1.5, delay: i * 0.2, ease: "easeOut" }}
                            className={cn("h-full rounded-full shadow-[0_0_20px_rgba(0,0,0,0.1)]", 
                               metric.color === 'primary' ? 'bg-emerald-500' :
                               metric.color === 'blue' ? 'bg-blue-500' :
                               metric.color === 'amber' ? 'bg-amber-500' :
                               'bg-rose-500'
                            )}
                          />
                        </div>
                      </GlassCard>
                    ))}
                  </div>

                  <GlassCard className="p-10 border-white/60">
                     <div className="flex items-center gap-3 mb-10">
                        <BarChart3 className="w-6 h-6 text-primary" />
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Aggregated Service Metadata</h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 text-center group hover:bg-white transition-all">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Jobs Processed</p>
                           <p className="text-4xl font-black text-slate-800 tracking-tighter">{org.completedJobs}</p>
                        </div>
                        <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 text-center group hover:bg-white transition-all">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Sentinel Reviews</p>
                           <p className="text-4xl font-black text-slate-800 tracking-tighter">{org.totalReviews}</p>
                        </div>
                        <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 text-center group hover:bg-white transition-all">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Economic Inflow</p>
                           <p className="text-4xl font-black text-slate-800 tracking-tighter">{formatCurrency(org.earnings)}</p>
                        </div>
                     </div>
                  </GlassCard>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDetails;
