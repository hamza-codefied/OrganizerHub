import { useState, useEffect, useMemo, type ChangeEvent } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, GlassCard, PremiumTabs } from '../components/UI';
import CustomSelect from '../components/CustomSelect';
import { ORGANIZERS, ORGANIZER_TRANSACTIONS, REVIEWS } from '../data/mockData';
import { cn, formatCurrency } from '../lib/utils';
import { 
  BadgeCheck, Ban, Star, Briefcase, ShieldCheck, Zap,
  X, MapPin, Mail, Phone, Calendar, Award, Image as ImageIcon,
  Clock, Eye, ChevronLeft, CheckCircle2, XCircle, Power,
  TrendingUp, BarChart3, CreditCard, Target, ExternalLink,
  ChevronRight, ArrowUpRight, Users, UserPlus, Download,
  Globe, FileText, Wallet, Receipt
} from 'lucide-react';

type OrganizerStatus = 'Active' | 'Deactivated';

type OrganizerReview = typeof REVIEWS[0];
type TeamMember = {
  id: string;
  organizerId: string;
  profilePicture: string;
  name: string;
  nationality: string;
  email: string;
  phone: string;
  skills: string[];
};

const TEAM_MEMBER_SKILLS = [
  'Problem-solving',
  'Attention to detail',
  'Physical organization',
  'Maintenance',
  'Habit coaching',
  'Confidentiality',
  'Personal Inventory',
  'Recycling',
  'home care',
  'Space Planning',
  'Decluttering',
  'Sorting & Categorizing',
  'Storage Solution Planning',
  'Labeling System Creation',
  'Moving-In',
  'Storage',
];

const NATIONALITY_OPTIONS = [
  'United Arab Emirates',
  'Saudi Arabia',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
  'India',
  'Pakistan',
  'Philippines',
  'Egypt',
  'Jordan',
  'Lebanon',
  'United Kingdom',
  'United States',
  'Canada',
  'Other',
];

const OrganizerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const foundOrg = ORGANIZERS.find(o => o.id === id);
  const normalizedOrg = foundOrg ? { ...foundOrg, status: foundOrg.status === 'Active' ? 'Active' : ('Deactivated' as OrganizerStatus) } : null;
  const [org, setOrg] = useState<any>(normalizedOrg);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'reviews' | 'team' | 'transactions' | 'gallery' | 'performance'>('overview');
  const [teamMembersByOrg, setTeamMembersByOrg] = useState<Record<string, TeamMember[]>>({});
  useEffect(() => {
    if (foundOrg) setOrg(foundOrg);
    else setOrg(null);
  }, [id, foundOrg]);

  const orgTransactions = useMemo(() => {
    if (!foundOrg) return [];
    return ORGANIZER_TRANSACTIONS.filter((t) => t.organizerId === foundOrg.id).sort((a, b) => b.date.localeCompare(a.date));
  }, [foundOrg]);

  const totalPlatformContribution = useMemo(
    () => orgTransactions.reduce((sum, t) => sum + t.platformFee, 0),
    [orgTransactions],
  );

  const totalGrossVolume = useMemo(
    () => orgTransactions.reduce((sum, t) => sum + t.grossAmount, 0),
    [orgTransactions],
  );

  const updateStatus = (status: OrganizerStatus) => {
    if (org) setOrg({ ...org, status });
  };

  const currentTeamMembers = org ? teamMembersByOrg[org.id] ?? [] : [];

  if (!org) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 border border-rose-100 italic font-black text-4xl">!</div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Organizer not found</p>
        <button onClick={() => navigate('/users/organizers')} className="text-primary font-black text-xs uppercase tracking-widest hover:underline">Back to organizers</button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => navigate('/users/organizers')}
          className="p-2 hover:bg-white/60 rounded-xl transition-all text-slate-400 hover:text-primary group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Organizer</p>
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Profile #{org.id}</h2>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Profile Sidebar */}
        <div className="lg:w-1/4 space-y-6 sm:space-y-8">
           <GlassCard className="p-0 overflow-hidden border-white/60">
              <div className="h-12 sm:h-16 bg-slate-100 blur-3xl -mb-6 sm:-mb-8"></div>
              <div className="p-5 sm:p-8 pt-0 flex flex-col items-center text-center">
                 <h1 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tighter leading-tight">{org.name}</h1>
                 <div className="flex flex-wrap items-center justify-center gap-2 mt-2 sm:mt-3">
                    <span className={cn(
                      "px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase tracking-widest border shadow-sm",
                      org.subscriptionPlan === 'Premium' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-400 border-slate-100"
                    )}>{org.subscriptionPlan} Tier</span>
                    <div className="flex items-center gap-1 px-2 py-0.5 sm:py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                      <Star className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] sm:text-xs font-black text-slate-800">{org.rating}</span>
                    </div>
                 </div>
                 <p className="text-xs sm:text-sm font-bold text-slate-500 mt-4 sm:mt-6 leading-relaxed italic px-2">"{org.bio}"</p>

                 <div className="w-full space-y-3 sm:space-y-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-100 text-left">
                    <div className="space-y-0.5 sm:space-y-1">
                      <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Business</p>
                      <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">{org.businessName}</p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                       <Mail className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                       <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">{org.email}</p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                       <Phone className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                       <p className="text-xs sm:text-sm font-bold text-slate-700">{org.phone}</p>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                       <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                       <p className="text-xs sm:text-sm font-bold text-slate-700 truncate">{org.location}</p>
                    </div>
                 </div>
              </div>
           </GlassCard>

          <GlassCard title="Status controls" subtitle="Approve or change organizer status.">
               <div className="space-y-4 mt-6">
                  {org.status === 'Active' ? (
                    <button
                      type="button"
                      onClick={() => updateStatus('Deactivated')}
                      className="w-full flex items-center justify-between p-4 bg-rose-100/40 hover:bg-rose-100/60 rounded-2xl border border-rose-200 transition-all text-rose-600"
                    >
                      <span className="text-xs font-black uppercase tracking-widest">Deactivate Account</span>
                       <Power className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => updateStatus('Active')}
                      className="w-full flex items-center justify-between p-4 primary-gradient rounded-2xl text-white transition-all shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
                    >
                      <span className="text-xs font-black uppercase tracking-widest">Activate Account</span>
                       <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                  <div className="pt-4 border-t border-slate-50">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                        Current status: <span className={cn("inline-block ml-1 underline", 
                           org.status === 'Active' ? 'text-emerald-500' : 'text-rose-500'
                        )}>{org.status}</span>
                     </p>
                     <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Last active: {org.lastActive}</p>
                  </div>
               </div>
            </GlassCard>
        </div>

        {/* Main Content */}
        <div className="lg:flex-1 min-w-0 space-y-6 sm:space-y-8">
           <PremiumTabs 
             tabs={[
               { id: 'overview', label: 'Overview' },
               { id: 'services', label: 'Services' },
               { id: 'reviews', label: 'Reviews' },
               { id: 'team', label: 'Team members' },
               { id: 'transactions', label: 'Transaction history' },
               { id: 'gallery', label: 'Gallery' },
             ]}
             activeTab={activeTab}
             onChange={setActiveTab}
           />

           <div className="space-y-6 sm:space-y-8">
              {activeTab === 'overview' && (
                <div className="space-y-6 sm:space-y-8">
                   <GlassCard title="Business profile" subtitle="Organizer record.">
                     <div className="mt-4 sm:mt-6 space-y-6 sm:space-y-8">
                       <div>
                         <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 sm:mb-3">Company banner</p>
                         <div className="relative rounded-2xl sm:rounded-[1.75rem] overflow-hidden border border-slate-100 bg-slate-100 aspect-[21/9] sm:aspect-[21/6]">
                           <img
                             src={org.companyBannerUrl}
                             alt=""
                             className="absolute inset-0 w-full h-full object-cover"
                           />
                         </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                         <div className="space-y-0.5 sm:space-y-1">
                           <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Trade name</p>
                           <p className="text-xs sm:text-sm font-bold text-slate-800">{org.tradeName}</p>
                         </div>
                         <div className="space-y-0.5 sm:space-y-1">
                           <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Website</p>
                           <a
                             href={org.website}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-primary hover:underline break-all"
                           >
                             <Globe className="w-3.5 h-3.5 shrink-0" />
                             {org.website.replace(/^https?:\/\//, '')}
                             <ExternalLink className="w-3 h-3 shrink-0 opacity-60" />
                           </a>
                         </div>
                         <div className="md:col-span-2 space-y-0.5 sm:space-y-1">
                           <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</p>
                           <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">{org.fullAddress}</p>
                         </div>
                       </div>

                       <div className="grid grid-cols-1 gap-4">
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                           <div className="flex items-start gap-3 min-w-0">
                             <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                               <FileText className="w-5 h-5 text-slate-500" />
                             </div>
                             <div className="min-w-0">
                               <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Business license</p>
                               <p className="text-xs font-bold text-slate-800 truncate">{org.businessLicenseDocument}</p>
                             </div>
                           </div>
                           <a
                             href={org.businessLicenseFileUrl}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 shadow-sm"
                           >
                             <Eye className="w-4 h-4" /> View
                           </a>
                         </div>
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                           <div className="flex items-start gap-3 min-w-0">
                             <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                               <FileText className="w-5 h-5 text-slate-500" />
                             </div>
                             <div className="min-w-0">
                               <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">Trade registration</p>
                               <p className="text-xs font-bold text-slate-800 truncate">{org.tradeRegistrationDocument}</p>
                             </div>
                           </div>
                           <a
                             href={org.tradeRegistrationFileUrl}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 shadow-sm"
                           >
                             <Eye className="w-4 h-4" /> View
                           </a>
                         </div>
                       </div>
                     </div>
                   </GlassCard>

                   <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                      {[
                        { label: 'Completed', value: org.completedJobs, icon: Briefcase, color: 'blue' },
                        { label: 'Earnings', value: formatCurrency(org.earnings), icon: TrendingUp, color: 'emerald' },
                        { label: 'Response', value: `${org.responseRate}%`, icon: Target, color: 'amber' },
                      ].map((stat, i) => (
                        <GlassCard key={i} className="p-4 sm:p-6 text-center border-white/40">
                          <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border shadow-sm",
                             stat.color === 'blue' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                             stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                             'bg-amber-50 text-amber-500 border-amber-100'
                          )}>
                             <stat.icon className="w-4 h-4 sm:w-5 h-5" />
                          </div>
                          <p className="text-lg sm:text-2xl font-black text-slate-800 tracking-tighter leading-none">{stat.value}</p>
                          <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 sm:mt-2">{stat.label}</p>
                        </GlassCard>
                      ))}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                      <GlassCard title="Subscription" subtitle="Plan details.">
                         <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 bg-slate-50 border border-slate-100 rounded-2xl sm:rounded-3xl gap-4">
                            <div>
                               <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Plan</p>
                               <p className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-2 sm:gap-3">
                                  {org.subscriptionPlan} Tier 
                                  <Zap className="w-4 h-4 sm:w-5 h-5 text-amber-500 fill-amber-500" />
                               </p>
                            </div>
                            <div className="sm:text-right">
                               <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Renewal</p>
                               <p className="text-xs sm:text-sm font-bold text-slate-800">Dec 15, 2024</p>
                            </div>
                         </div>
                      </GlassCard>

                      <GlassCard title="Certifications" subtitle="Credentials.">
                         <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                            {org.certifications.map((cert: string, i: number) => (
                              <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-primary/[0.03] text-primary rounded-xl border border-primary/10 w-full sm:w-auto">
                                <div className="flex items-center gap-2">
                                  <Award className="w-3.5 h-3.5 shrink-0" />
                                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest truncate">{cert}</span>
                                </div>
                                <button
                                  type="button"
                                  className="sm:ml-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-primary/20 text-primary text-[8px] sm:text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all w-full sm:w-auto"
                                >
                                  <Download className="w-3 h-3" /> Download
                                </button>
                              </div>
                            ))}
                         </div>
                      </GlassCard>

                      <GlassCard title="Documents" subtitle="Organizer files.">
                        <div className="mt-4 sm:mt-6 space-y-2">
                          {org.documents.map((doc: string, i: number) => (
                            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
                              <span className="text-[10px] sm:text-xs font-bold text-slate-700 truncate mr-4">{doc}</span>
                              <button type="button" className="text-[9px] font-black uppercase tracking-widest text-primary shrink-0">View</button>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                   </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="space-y-6 sm:space-y-8">
                  <GlassCard title="Service areas" subtitle="Operational regions.">
                    <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
                      {org.serviceAreas.map((area: string, i: number) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg sm:rounded-xl bg-primary/5 text-primary text-[10px] sm:text-[11px] font-bold border border-primary/10"
                        >
                          <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 opacity-80" />
                          {area}
                        </span>
                      ))}
                    </div>
                  </GlassCard>

                  <div className="flex items-center justify-between px-2">
                     <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest">{org.services.length} Services</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {org.services.map((service: string, i: number) => (
                      <GlassCard key={i} className="p-6 sm:p-8 group hover:border-primary/20 transition-all text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-[1.5rem] bg-primary/5 flex items-center justify-center text-primary mx-auto mb-4 sm:mb-6 border border-primary/10 group-hover:rotate-12 transition-all">
                          <Briefcase className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tighter leading-none mb-2">{service}</h3>
                        <div className="flex items-center justify-center gap-1.5 py-1.5 sm:py-2 px-3 sm:px-4 bg-slate-50 rounded-xl w-fit mx-auto mt-3 sm:mt-4 border border-slate-100">
                           <span className="text-lg sm:text-xl font-black text-slate-800">${Math.floor(Math.random() * 50 + 100)}</span>
                           <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">/ hr</span>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4 sm:space-y-6">
                  {(() => {
                    const organizerReviews: OrganizerReview[] = REVIEWS.filter((r) => r.organizer === org.name);
                    const topReviews = organizerReviews.slice(0, 5);

                    return (
                      <>
                        <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">
                          {organizerReviews.length} reviews submitted
                        </p>

                        {topReviews.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 italic font-black text-slate-200 text-2xl sm:text-3xl">
                              !
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-slate-400">No reviews yet for this organizer.</p>
                          </div>
                        ) : (
                          <div className="space-y-4 sm:space-y-6">
                            {topReviews.map((review) => {
                              const filledStars = Math.floor(review.rating);
                              return (
                                <GlassCard key={review.id} className="p-5 sm:p-8">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                                    <div className="flex items-center gap-2">
                                      <div className="flex bg-amber-50 p-1.5 sm:p-2 rounded-lg sm:rounded-xl border border-amber-100 gap-1">
                                        {Array.from({ length: 5 }).map((_, j) => (
                                          <Star
                                            key={j}
                                            className={cn(
                                              'w-3 h-3 sm:w-4 sm:h-4',
                                              j < filledStars ? 'fill-amber-400 text-amber-400' : 'text-slate-200',
                                            )}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-xs sm:text-sm font-black text-slate-800 ml-1 sm:ml-2">
                                        {review.rating.toFixed(1)}
                                      </span>
                                    </div>
                                    <span className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                      {review.date}
                                    </span>
                                  </div>

                                  <p className="text-sm sm:text-lg font-bold text-slate-600 italic leading-relaxed">
                                    "{review.comment}"
                                  </p>

                                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-50/50">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-slate-50 flex items-center justify-center text-primary font-black border border-slate-100 shadow-inner text-[10px] sm:text-xs">
                                        {review.homeOwner
                                          ? review.homeOwner.split(' ').map(x => x[0]).join('').toUpperCase()
                                          : 'R'}
                                      </div>
                                      <div>
                                        <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Home owner</p>
                                        <p className="text-[10px] sm:text-xs font-bold text-primary">{review.homeOwner}</p>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Service</p>
                                      <p className="text-[10px] sm:text-xs font-bold text-slate-700">{review.service}</p>
                                    </div>
                                  </div>
                                </GlassCard>
                              );
                            })}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {activeTab === 'team' && (
                <div className="space-y-6 sm:space-y-8">
                    <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">
                      {currentTeamMembers.length} Team members
                    </p>

                  {currentTeamMembers.length === 0 ? (
                    <GlassCard className="p-10 sm:p-12 text-center">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 mx-auto">
                        <Users className="w-6 h-6 sm:w-8 sm:h-8 text-slate-300" />
                      </div>
                      <p className="text-xs sm:text-sm font-bold text-slate-400">No team members added for this organizer yet.</p>
                    </GlassCard>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      {currentTeamMembers.map((member: TeamMember) => (
                        <GlassCard key={member.id} className="p-4 sm:p-6 border-white/60">
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white shrink-0">
                              <img src={member.profilePicture} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">{member.name}</h3>
                              <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                {member.nationality}
                              </p>
                              <div className="mt-3 space-y-1">
                                <p className="text-[10px] sm:text-xs font-bold text-slate-500 truncate">{member.email}</p>
                                <p className="text-[10px] sm:text-xs font-bold text-slate-500">{member.phone}</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 sm:mt-5 pt-4 border-t border-slate-100">
                            <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">
                              Skills ({member.skills.length})
                            </p>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {member.skills.length === 0 ? (
                                <span className="text-[10px] sm:text-xs font-bold text-slate-400">No skills selected.</span>
                              ) : (
                                member.skills.map((skill: string) => (
                                  <span
                                    key={skill}
                                    className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[8px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest"
                                  >
                                    {skill}
                                  </span>
                                ))
                              )}
                            </div>
                          </div>
                        </GlassCard>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="space-y-6 sm:space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    {[
                      { label: 'Platform fee', value: totalPlatformContribution, icon: Wallet, color: 'primary', subtitle: 'Contributions' },
                      { label: 'Gross volume', value: totalGrossVolume, icon: Receipt, color: 'emerald', subtitle: `${orgTransactions.length} items` },
                      { label: 'Net to org', value: orgTransactions.reduce((s, t) => s + t.netToOrganizer, 0), icon: TrendingUp, color: 'amber', subtitle: 'After fees' },
                    ].map((stat, i) => (
                      <GlassCard key={i} className="p-5 sm:p-6 border-white/40">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border",
                            stat.color === 'primary' ? 'bg-primary/10 text-primary border-primary/15' :
                            stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                          )}>
                            <stat.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-[10px] font-bold text-slate-500 leading-none mt-0.5">{stat.subtitle}</p>
                          </div>
                        </div>
                        <p className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter">{formatCurrency(stat.value)}</p>
                      </GlassCard>
                    ))}
                  </div>

                  <GlassCard title="All transactions" subtitle="History record.">
                    {orgTransactions.length === 0 ? (
                      <p className="text-sm font-bold text-slate-400 text-center py-12">No transactions recorded.</p>
                    ) : (
                      <div className="mt-4 sm:mt-6 overflow-x-auto -mx-2 sm:mx-0 rounded-2xl border border-slate-100">
                        <table className="w-full min-w-[800px] text-left">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/80">
                              <th className="px-4 py-3 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                              <th className="px-4 py-3 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
                              <th className="px-4 py-3 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                              <th className="px-4 py-3 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Gross</th>
                              <th className="px-4 py-3 text-[8px] sm:text-[9px] font-black text-primary uppercase tracking-widest text-right">Fee</th>
                              <th className="px-4 py-3 text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orgTransactions.map((tx: any) => (
                              <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3 text-[10px] sm:text-xs font-bold text-slate-700 whitespace-nowrap">{tx.date}</td>
                                <td className="px-4 py-3 text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 whitespace-nowrap">{tx.reference}</td>
                                <td className="px-4 py-3 text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest whitespace-nowrap">{tx.type}</td>
                                <td className={cn(
                                  'px-4 py-3 text-[10px] sm:text-xs font-black text-right tabular-nums',
                                  tx.grossAmount < 0 ? 'text-rose-600' : 'text-slate-800',
                                )}>
                                  {formatCurrency(tx.grossAmount)}
                                </td>
                                <td className={cn(
                                  'px-4 py-3 text-[10px] sm:text-xs font-black text-right tabular-nums',
                                  tx.platformFee < 0 ? 'text-rose-600' : 'text-primary',
                                )}>
                                  {formatCurrency(tx.platformFee)}
                                </td>
                                <td className="px-4 py-3 text-right sm:text-left">
                                  <span className={cn(
                                    'inline-flex px-2 py-0.5 rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-widest border',
                                    tx.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100',
                                  )}>
                                    {tx.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </GlassCard>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-[10px] sm:text-[11px] font-black text-slate-400 uppercase tracking-widest px-2">{org.portfolio.length} Items</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {org.portfolio.map((img: string, i: number) => (
                      <div 
                        key={i}
                        className="relative rounded-2xl overflow-hidden border border-slate-200 bg-white group shadow-sm"
                      >
                        <img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="p-3 bg-white/90 backdrop-blur-sm border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs font-bold text-slate-600">
                          <span className="uppercase tracking-widest">Item #{String(i + 1).padStart(2, '0')}</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'performance' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { label: 'Response rate', value: org.responseRate, color: 'primary', icon: Clock },
                      { label: 'On-time rate', value: org.onTimeRate, color: 'blue', icon: Target },
                      { label: 'Reputation', value: Math.min(Math.round(parseFloat(org.rating) * 20), 100), color: 'amber', icon: Star },
                      { label: 'Retention', value: Math.floor(Math.random() * 30) + 50, color: 'secondary', icon: TrendingUp },
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
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${metric.value}%` }}
                            className={cn("h-full rounded-full", 
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
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Summary</h3>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 text-center group hover:bg-white transition-all">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Jobs</p>
                           <p className="text-4xl font-black text-slate-800 tracking-tighter">{org.completedJobs}</p>
                        </div>
                        <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 text-center group hover:bg-white transition-all">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Reviews</p>
                           <p className="text-4xl font-black text-slate-800 tracking-tighter">{org.totalReviews}</p>
                        </div>
                        <div className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 text-center group hover:bg-white transition-all">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Earnings</p>
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
