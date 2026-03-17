import { useState } from 'react';
import { PageHeader, GlassCard, StatCard } from '../components/UI';
import { 
  Mail, Shield, ShieldCheck, MapPin, 
  Clock, Camera, 
  Activity, Star, Zap, Award
} from 'lucide-react';
import { cn } from '../lib/utils';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');

  const adminData = {
    name: "Admin Hub",
    email: "admin@organizehub.com",
    role: "Global Executive",
    location: "Global Command Center",
    joined: "January 2024",
    lastLogin: "March 17, 2026 15:52",
    status: "Peak Access",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=executive"
  };

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Command Authority" 
        description="Global Executive Profile and authentication management."
      >
        <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/60 shadow-sm">
          {(['profile', 'security', 'notifications'] as const).map(tab => (
            <button
               key={tab}
               onClick={() => setActiveTab(tab)}
               className={cn(
                 "px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                 activeTab === tab ? "bg-white text-primary shadow-xl" : "text-slate-400 hover:text-slate-600"
               )}
            >
              {tab}
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <GlassCard className="p-0 overflow-hidden text-center">
            <div className="h-32 primary-gradient blur-3xl -mb-16 opacity-10"></div>
            <div className="p-10 pt-0 relative flex flex-col items-center">
               <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1 border-4 border-white shadow-2xl relative mb-6 group cursor-pointer">
                  <img src={adminData.avatar} alt="Admin" className="w-full h-full rounded-[2.2rem] object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-xl text-primary hover:text-secondary transition-colors transition-transform hover:scale-110">
                     <Camera className="w-5 h-5" />
                  </div>
               </div>
               <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{adminData.name}</h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2 italic">{adminData.role} Entity</p>
               
               <div className="mt-8 flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Authority Level 0
               </div>

               <div className="w-full mt-10 space-y-4 text-left pt-8 border-t border-slate-100/50">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Mail className="w-4 h-4" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Comm Channel</p>
                        <p className="text-sm font-bold text-slate-800">{adminData.email}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <MapPin className="w-4 h-4" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Zone Assignment</p>
                        <p className="text-sm font-bold text-slate-800">{adminData.location}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                        <Clock className="w-4 h-4" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Last Sync</p>
                        <p className="text-sm font-bold text-slate-800">{adminData.lastLogin}</p>
                     </div>
                  </div>
               </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-2 gap-4">
             <StatCard title="Uptime Score" value="99.9%" icon={Activity} color="primary" className="py-6" />
             <StatCard title="Reputation" value="Level 10" icon={Star} color="secondary" className="py-6" />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <GlassCard title="Identity Configuration" subtitle="Universal administration details and synchronization settings.">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Universal Designation</label>
                      <input type="text" defaultValue={adminData.name} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 transition-all font-bold text-slate-700" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Comm ID</label>
                      <input type="email" defaultValue={adminData.email} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 transition-all font-bold text-slate-700" />
                   </div>
                   <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategic Narrative / Bio</label>
                      <textarea defaultValue="Leading the architectural vision for OrganizeHub Global Infrastructure. Committed to platform scalability and performance." rows={3} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 transition-all font-bold text-slate-700 resize-none" />
                   </div>
                </div>
                <div className="mt-10 pt-8 border-t border-slate-50 flex justify-end gap-4">
                   <button className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-all">Decline Sync</button>
                   <button className="px-10 py-3 primary-gradient text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.05] transition-all">Save Protocol</button>
                </div>
              </GlassCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <GlassCard className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                          <Zap className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-lg font-black text-slate-800 tracking-tighter">Velocity Performance</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency Metrics</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-400">Response Speed</span>
                          <span className="text-slate-800">92%</span>
                       </div>
                       <div className="h-2 w-full bg-slate-50 rounded-full border border-slate-100">
                          <div className="h-full bg-primary rounded-full" style={{ width: '92%' }}></div>
                       </div>
                    </div>
                 </GlassCard>
                 <GlassCard className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                          <Award className="w-6 h-6" />
                       </div>
                       <div>
                          <p className="text-lg font-black text-slate-800 tracking-tighter">Achievement Index</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Impact</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-400">Total Deployment</span>
                          <span className="text-slate-800">Elite</span>
                       </div>
                       <div className="h-2 w-full bg-slate-50 rounded-full border border-slate-100">
                          <div className="h-full bg-secondary rounded-full" style={{ width: '85%' }}></div>
                       </div>
                    </div>
                 </GlassCard>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8 animate-in fade-in duration-300">
               <GlassCard title="Security Protocols" subtitle="Manage authentication layers and access credentials.">
                  <div className="space-y-8 mt-8">
                     <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm border border-slate-50">
                              <Shield className="w-6 h-6" />
                           </div>
                           <div>
                              <p className="text-sm font-black text-slate-800 tracking-tight">Two-Factor Authentication</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol Sec-2FA active</p>
                           </div>
                        </div>
                        <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer shadow-inner">
                           <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-lg"></div>
                        </div>
                     </div>

                     <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Sync Key</label>
                              <input type="password" placeholder="••••••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 py-4 px-6 text-sm outline-none focus:bg-white transition-all font-bold" />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">New Protocol Key</label>
                              <input type="password" placeholder="••••••••••••" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 py-4 px-6 text-sm outline-none focus:bg-white transition-all font-bold" />
                           </div>
                        </div>
                        <button className="w-full py-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary hover:text-white transition-all shadow-sm">Rotate Authority Keys</button>
                     </div>
                  </div>
               </GlassCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
