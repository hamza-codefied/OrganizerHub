import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, GlassCard, StatCard, PremiumTabs } from '../components/UI';
import { HOME_OWNERS } from '../data/mockData';
import { cn, formatCurrency } from '../lib/utils';
import { 
  BadgeCheck, Ban, MapPin, Mail, Phone, Calendar, Star, Heart,
  ShoppingBag, Clock, ShieldAlert, ShieldOff, ShieldCheck,
  ChevronLeft, ExternalLink
} from 'lucide-react';

const HomeOwnerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [homeOwner, setHomeOwner] = useState<typeof HOME_OWNERS[0] | undefined>(() => HOME_OWNERS.find(h => h.id === id));
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'favorites'>('overview');

  if (!homeOwner) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 border border-rose-100 italic font-black text-4xl">!</div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Home owner not found</p>
        <button onClick={() => navigate('/users/home-owners')} className="text-primary font-black text-xs uppercase tracking-widest hover:underline">Back to home owners</button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate('/users/home-owners')}
          className="p-2 hover:bg-white/60 rounded-xl transition-all text-slate-400 hover:text-primary group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Home owner</p>
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Profile #{homeOwner.id}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Profile Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <GlassCard className="p-0 overflow-hidden">
            <div className="h-32 primary-gradient opacity-10 blur-3xl -mb-16"></div>
            <div className="p-8 pt-0 flex flex-col items-center text-center">
              <h1 className="text-3xl font-black text-slate-800 tracking-tighter">{homeOwner.name}</h1>
              <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Premium home owner</p>
              
              <div className={cn(
                "mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border shadow-sm",
                homeOwner.status === 'Active' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                "bg-amber-50 text-amber-600 border-amber-100"
              )}>
                {homeOwner.status === 'Active' ? <BadgeCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                {homeOwner.status} account
              </div>

              <div className="w-full space-y-4 mt-10 text-left pt-8 border-t border-slate-100">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">First name</p>
                      <p className="text-sm font-bold text-slate-800">{homeOwner.firstName}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last name</p>
                      <p className="text-sm font-bold text-slate-800">{homeOwner.lastName}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                       <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                       <p className="text-sm font-bold text-slate-800 truncate">{homeOwner.email}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                       <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                       <p className="text-sm font-bold text-slate-800">{homeOwner.phone}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                       <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                       <p className="text-sm font-bold text-slate-800">{homeOwner.location}</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DOB</p>
                      <p className="text-sm font-bold text-slate-800">{homeOwner.dob}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gender</p>
                      <p className="text-sm font-bold text-slate-800">{homeOwner.gender}</p>
                    </div>
                 </div>
                 <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Join date</p>
                   <p className="text-sm font-bold text-slate-800">{homeOwner.joinedDate}</p>
                 </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard title="Account security" subtitle="Control access and restrictions.">
             <div className="space-y-4 mt-6">
                {homeOwner.status === 'Active' ? (
                  <button 
                    onClick={() => setHomeOwner(prev => prev ? { ...prev, status: 'Suspended' as const } : prev)}
                    className="w-full flex items-center justify-between p-4 bg-amber-50/50 hover:bg-amber-50 rounded-2xl border border-amber-100 transition-all group"
                  >
                     <div className="flex items-center gap-3">
                        <ShieldAlert className="w-5 h-5 text-amber-500" />
                        <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Suspend access</span>
                     </div>
                  </button>
                ) : (
                  <button 
                    onClick={() => setHomeOwner(prev => prev ? { ...prev, status: 'Active' as const } : prev)}
                    className="w-full flex items-center justify-between p-4 primary-gradient rounded-2xl text-white transition-all group shadow-lg shadow-primary/20"
                  >
                     <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="text-xs font-black uppercase tracking-widest">Restore access</span>
                     </div>
                  </button>
                )}
             </div>
          </GlassCard>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
           <PremiumTabs 
             tabs={[
               { id: 'overview', label: 'Overview' },
               { id: 'bookings', label: 'Bookings' },
               { id: 'favorites', label: 'Favorites' },
             ]}
             activeTab={activeTab}
             onChange={setActiveTab}
           />

           <div className="space-y-8">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { label: 'Bookings', value: homeOwner.totalBookings, icon: ShoppingBag, color: 'primary' },
                        { label: 'Total spending', value: formatCurrency(homeOwner.totalSpent), icon: Star, color: 'blue' },
                        { label: 'Favorites', value: homeOwner.favorites, icon: Heart, color: 'secondary' },
                      ].map((stat, i) => (
                        <GlassCard key={i} className="flex items-center gap-6 p-6">
                           <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm", 
                              stat.color === 'primary' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                              stat.color === 'blue' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                              stat.color === 'orange' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                              'bg-rose-50 text-rose-500 border-rose-100'
                           )}>
                              <stat.icon className="w-6 h-6" />
                           </div>
                           <div>
                              <p className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                           </div>
                        </GlassCard>
                      ))}
                   </div>

                   <GlassCard title="Activity overview" subtitle="Recent activity and verification details.">
                      <div className="grid grid-cols-2 gap-8 mt-6">
                         <div className="space-y-1">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Joined</p>
                            <p className="text-lg font-black text-slate-800">{homeOwner.joinedDate}</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verified</p>
                            <div className="flex items-center gap-2">
                               <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                               <p className="text-lg font-black text-slate-800 uppercase tracking-widest">Verified</p>
                            </div>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last active</p>
                            <p className="text-lg font-black text-slate-800 uppercase tracking-widest">{homeOwner.lastActive}</p>
                         </div>
                         <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Account level</p>
                            <p className="text-lg font-black text-slate-800 uppercase tracking-widest">Level 4</p>
                         </div>
                      </div>
                   </GlassCard>
                </div>
              )}

              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2 mb-2">
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{homeOwner.bookingHistory.length} bookings found</p>
                  </div>
                  {homeOwner.bookingHistory.map((booking, i) => (
                    <GlassCard key={i} className="flex items-center justify-between p-6 hover:border-primary/20 group cursor-default">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-xl group-hover:rotate-6 transition-all duration-500">
                          <ShoppingBag className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-lg font-black text-slate-800 tracking-tighter group-hover:text-primary transition-colors">{booking.service}</p>
                          <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-2">
                             Organizer: <span className="text-primary font-black">{booking.organizer}</span> • {booking.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8">
                        <div className="text-right">
                           <p className="text-xl font-black text-slate-800 tracking-tighter">{formatCurrency(booking.amount)}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Amount</p>
                        </div>
                        <div className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm",
                          booking.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          booking.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" :
                          "bg-rose-50 text-rose-600 border-rose-100"
                        )}>{booking.status}</div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Array.from({ length: Math.min(homeOwner.favorites, 5) }).map((_, i) => (
                    <GlassCard key={i} className="group p-6 hover:-translate-y-1 hover:border-primary/20">
                      <div className="flex items-start justify-between mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-white border-2 border-white shadow-xl overflow-hidden shadow-primary/5 group-hover:scale-110 transition-transform">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=org${i}`} className="w-full h-full" alt="" />
                        </div>
                        <div className="flex h-10 w-10 bg-white border border-slate-50 rounded-xl items-center justify-center shadow-lg group-hover:rotate-12 transition-all">
                           <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xl font-black text-slate-800 tracking-tighter group-hover:text-primary transition-colors">{["Sarah Green", "David White", "Emma Wilson", "Ali Kazmi", "Nadia Rashid"][i % 5]}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{["Home Organizing", "Event Planning", "Closet Audit", "Kitchen Detox", "Office Declutter"][i % 5]}</p>
                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                           <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                              <span className="text-[11px] font-black text-slate-800">{(4 + Math.random()).toFixed(1)}</span>
                           </div>
                           <button className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">View organizer <ExternalLink className="w-3 h-3" /></button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default HomeOwnerDetails;
