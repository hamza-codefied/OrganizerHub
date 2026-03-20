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

type OrganizerStatus = 'Active' | 'Pending' | 'Rejected' | 'Deactivated';

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
  const [org, setOrg] = useState<typeof ORGANIZERS[0] | null>(foundOrg ?? null);
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'reviews' | 'team' | 'transactions' | 'gallery' | 'performance'>('overview');
  const [teamMembersByOrg, setTeamMembersByOrg] = useState<Record<string, TeamMember[]>>({});
  const [isTeamMemberModalOpen, setIsTeamMemberModalOpen] = useState(false);
  const [teamMemberForm, setTeamMemberForm] = useState({
    profilePicture: '',
    name: '',
    nationality: '',
    email: '',
    phone: '',
    skills: [] as string[],
  });
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

  const toggleSkill = (skill: string) => {
    setTeamMemberForm((prev) => {
      const hasSkill = prev.skills.includes(skill);
      return {
        ...prev,
        skills: hasSkill ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
      };
    });
  };

  const handleProfilePictureUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setTeamMemberForm((prev) => ({ ...prev, profilePicture: String(reader.result ?? '') }));
    };
    reader.readAsDataURL(file);
  };

  const resetTeamMemberForm = () => {
    setTeamMemberForm({
      profilePicture: '',
      name: '',
      nationality: '',
      email: '',
      phone: '',
      skills: [],
    });
  };

  const handleCreateTeamMember = () => {
    if (!org) return;
    if (!teamMemberForm.name.trim() || !teamMemberForm.email.trim() || !teamMemberForm.phone.trim()) return;

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      organizerId: org.id,
      profilePicture:
        teamMemberForm.profilePicture ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(teamMemberForm.name.trim())}`,
      name: teamMemberForm.name.trim(),
      nationality: teamMemberForm.nationality.trim() || 'Not specified',
      email: teamMemberForm.email.trim(),
      phone: teamMemberForm.phone.trim(),
      skills: teamMemberForm.skills,
    };

    setTeamMembersByOrg((prev) => ({
      ...prev,
      [org.id]: [newMember, ...(prev[org.id] ?? [])],
    }));
    setIsTeamMemberModalOpen(false);
    resetTeamMemberForm();
    setActiveTab('team');
  };

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
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business name</p>
                      <p className="text-sm font-bold text-slate-700">{org.businessName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trade name</p>
                      <p className="text-sm font-bold text-slate-700">{org.tradeName}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner name</p>
                      <p className="text-sm font-bold text-slate-700">{org.ownerName}</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <Mail className="w-4 h-4 text-slate-300" />
                       <p className="text-sm font-bold text-slate-700 truncate">{org.email}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nationality</p>
                      <p className="text-sm font-bold text-slate-700">{org.nationality}</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <Phone className="w-4 h-4 text-slate-300" />
                       <p className="text-sm font-bold text-slate-700">{org.phone}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <MapPin className="w-4 h-4 text-slate-300" />
                      <p className="text-sm font-bold text-slate-700">{org.location}</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <Calendar className="w-4 h-4 text-slate-300" />
                       <p className="text-sm font-bold text-slate-700">Joined {org.joinedDate}</p>
                    </div>
                 </div>
              </div>
           </GlassCard>

          <GlassCard title="Status controls" subtitle="Approve or change organizer status.">
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
                      <span className="text-xs font-black uppercase tracking-widest">Deactivate</span>
                       <Power className="w-5 h-5" />
                    </button>
                 )}
                 {(org.status === 'Rejected' || org.status === 'Deactivated') && (
                    <button
                      type="button"
                      onClick={() => updateStatus('Active')}
                      className="w-full flex items-center justify-between p-4 primary-gradient rounded-2xl text-white transition-all shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
                    >
                      <span className="text-xs font-black uppercase tracking-widest">Reactivate</span>
                       <CheckCircle2 className="w-5 h-5" />
                    </button>
                 )}
                 <div className="pt-4 border-t border-slate-50">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                       Current status: <span className={cn("inline-block ml-1 underline", 
                          org.status === 'Active' ? 'text-emerald-500' : 'text-amber-500'
                       )}>{org.status}</span>
                    </p>
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Last active: {org.lastActive}</p>
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
               { id: 'reviews', label: 'Reviews' },
               { id: 'team', label: 'Team members' },
               { id: 'transactions', label: 'Transaction history' },
               { id: 'gallery', label: 'Gallery' },
              //  { id: 'performance', label: 'Performance' },
             ]}
             activeTab={activeTab}
             onChange={setActiveTab}
           />

           <div className="space-y-8">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                   <GlassCard title="Business profile" subtitle="Submitted by the organizer from their app — view only.">
                     <div className="mt-6 space-y-8">
                       <div>
                         <div className="flex items-center justify-between gap-3 mb-3">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company banner</p>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">From organizer app</span>
                         </div>
                         <div className="relative rounded-[1.75rem] overflow-hidden border border-slate-100 bg-slate-100 aspect-[21/6] min-h-[140px]">
                           <img
                             src={org.companyBannerUrl}
                             alt=""
                             className="absolute inset-0 w-full h-full object-cover"
                           />
                         </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-1">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trade name</p>
                           <p className="text-sm font-bold text-slate-800">{org.tradeName}</p>
                         </div>
                         <div className="space-y-1">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Website</p>
                           <a
                             href={org.website}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline break-all"
                           >
                             <Globe className="w-4 h-4 shrink-0" />
                             {org.website.replace(/^https?:\/\//, '')}
                             <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-60" />
                           </a>
                         </div>
                         <div className="md:col-span-2 space-y-1">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Complete address</p>
                           <p className="text-sm font-bold text-slate-800 leading-relaxed">{org.fullAddress}</p>
                         </div>
                         <div className="md:col-span-2 space-y-1">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Clock className="w-3.5 h-3.5" /> Business timings
                           </p>
                           <p className="text-sm font-bold text-slate-800">{org.businessTimings}</p>
                         </div>
                       </div>

                       <div className="space-y-2">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description / notes</p>
                         <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 text-sm font-medium text-slate-700 leading-relaxed">
                           {org.description}
                         </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                           <div className="flex items-start gap-3 min-w-0">
                             <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                               <FileText className="w-5 h-5 text-slate-500" />
                             </div>
                             <div className="min-w-0">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business license</p>
                               <p className="text-xs font-bold text-slate-800 truncate">{org.businessLicenseDocument}</p>
                               <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">From organizer app</p>
                             </div>
                           </div>
                           <a
                             href={org.businessLicenseFileUrl}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 shrink-0"
                           >
                             <Eye className="w-4 h-4" />
                             View
                           </a>
                         </div>
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                           <div className="flex items-start gap-3 min-w-0">
                             <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                               <FileText className="w-5 h-5 text-slate-500" />
                             </div>
                             <div className="min-w-0">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trade name registration</p>
                               <p className="text-xs font-bold text-slate-800 truncate">{org.tradeRegistrationDocument}</p>
                               <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-widest">From organizer app</p>
                             </div>
                           </div>
                           <a
                             href={org.tradeRegistrationFileUrl}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 shrink-0"
                           >
                             <Eye className="w-4 h-4" />
                             View
                           </a>
                         </div>
                       </div>
                     </div>
                   </GlassCard>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { label: 'Completed jobs', value: org.completedJobs, icon: Briefcase, color: 'blue' },
                        { label: 'Total earnings', value: formatCurrency(org.earnings), icon: TrendingUp, color: 'emerald' },
                        { label: 'Response rate', value: `${org.responseRate}%`, icon: Target, color: 'amber' },
                        // { label: 'On-time rate', value: `${org.onTimeRate}%`, icon: Clock, color: 'orange' },
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
                      <GlassCard title="Subscription" subtitle="Plan and billing details.">
                         <div className="mt-6 flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-3xl">
                            <div>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Plan</p>
                               <p className="text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-3">
                                  {org.subscriptionPlan} Tier 
                                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                               </p>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Next update</p>
                               <p className="text-sm font-bold text-slate-800">Dec 15, 2024</p>
                            </div>
                         </div>
                      </GlassCard>

                      <GlassCard title="Certifications" subtitle="Saved credentials.">
                         <div className="mt-6 flex flex-wrap gap-2">
                            {org.certifications.map((cert, i) => (
                              <div key={i} className="flex items-center gap-2 px-3 py-2 bg-primary/5 text-primary rounded-xl border border-primary/10">
                                <Award className="w-4 h-4 shrink-0" />
                                <span className="text-[10px] font-black uppercase tracking-widest">{cert}</span>
                                <button
                                  type="button"
                                  className="ml-1 inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/80 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest hover:bg-white transition-all cursor-pointer"
                                >
                                  <Download className="w-3 h-3" />
                                  Download
                                </button>
                              </div>
                            ))}
                         </div>
                      </GlassCard>

                      <GlassCard title="Documents" subtitle="Uploaded organizer files.">
                        <div className="mt-6 space-y-2">
                          {org.documents.map((doc, i) => (
                            <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
                              <span className="text-xs font-bold text-slate-700">{doc}</span>
                              <button type="button" className="text-[9px] font-black uppercase tracking-widest text-primary">View</button>
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                   </div>
                </div>
              )}

              {activeTab === 'services' && (
                <div className="space-y-6">
                  <GlassCard title="Service areas" subtitle="Regions and neighborhoods where this organizer provides services.">
                    <div className="mt-6 flex flex-wrap gap-2">
                      {org.serviceAreas.map((area, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/5 text-primary text-[11px] font-bold border border-primary/15"
                        >
                          <MapPin className="w-3.5 h-3.5 shrink-0 opacity-80" />
                          {area}
                        </span>
                      ))}
                    </div>
                  </GlassCard>

                  <div className="flex items-center justify-between px-2">
                     <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{org.services.length} Services</p>
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

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {(() => {
                    const organizerReviews: OrganizerReview[] = REVIEWS.filter((r) => r.organizer === org.name);
                    const topReviews = organizerReviews.slice(0, 5);

                    return (
                      <>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-2">
                          {organizerReviews.length} reviews submitted
                        </p>

                        {topReviews.length === 0 ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 italic font-black text-slate-200 text-3xl">
                              !
                            </div>
                            <p className="font-bold text-slate-400">No reviews yet for this organizer.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {topReviews.map((review) => {
                              const filledStars = Math.floor(review.rating);
                              return (
                                <GlassCard key={review.id} className="p-8">
                                  <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                      <div className="flex bg-amber-50 p-2 rounded-xl border border-amber-100 gap-1">
                                        {Array.from({ length: 5 }).map((_, j) => (
                                          <Star
                                            key={j}
                                            className={cn(
                                              'w-4 h-4',
                                              j < filledStars ? 'fill-amber-400 text-amber-400' : 'text-slate-200',
                                            )}
                                          />
                                        ))}
                                      </div>
                                      <span className="text-sm font-black text-slate-800 ml-2">
                                        {review.rating.toFixed(1)} rating
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                      Review date: {review.date}
                                    </span>
                                  </div>

                                  <p className="text-lg font-bold text-slate-600 italic leading-snug">
                                    "{review.comment}"
                                  </p>

                                  <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-50">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary font-black border border-slate-100 shadow-inner">
                                      {review.homeOwner
                                        ? review.homeOwner
                                            .split(' ')
                                            .slice(0, 2)
                                            .map((x) => x[0])
                                            .join('')
                                            .toUpperCase()
                                        : 'R'}
                                    </div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                      Home owner: <span className="text-primary">{review.homeOwner}</span>
                                    </p>
                                  </div>

                                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">
                                    Service: <span className="text-slate-800">{review.service}</span>
                                  </p>
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
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      {currentTeamMembers.length} Team members
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsTeamMemberModalOpen(true)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 primary-gradient text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                    >
                      <UserPlus className="w-4 h-4" />
                      Add team member
                    </button>
                  </div>

                  {currentTeamMembers.length === 0 ? (
                    <GlassCard className="p-12 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 mx-auto">
                        <Users className="w-8 h-8 text-slate-300" />
                      </div>
                      <p className="font-bold text-slate-400">No team members added for this organizer yet.</p>
                    </GlassCard>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {currentTeamMembers.map((member) => (
                        <GlassCard key={member.id} className="p-6 border-white/60">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-white shrink-0">
                              <img src={member.profilePicture} alt={member.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-lg font-black text-slate-800 tracking-tight">{member.name}</h3>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                {member.nationality}
                              </p>
                              <p className="text-xs font-bold text-slate-500 mt-3 truncate">{member.email}</p>
                              <p className="text-xs font-bold text-slate-500 mt-1">{member.phone}</p>
                            </div>
                          </div>

                          <div className="mt-5 pt-4 border-t border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                              Skills ({member.skills.length})
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {member.skills.length === 0 ? (
                                <span className="text-xs font-bold text-slate-400">No skills selected.</span>
                              ) : (
                                member.skills.map((skill) => (
                                  <span
                                    key={skill}
                                    className="px-3 py-1 rounded-lg bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-widest"
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
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <GlassCard className="p-6 border-white/40">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/15">
                          <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Platform fee</p>
                          <p className="text-[10px] font-bold text-slate-500 leading-snug">Contributions to OrganizerHub</p>
                        </div>
                      </div>
                      <p className="text-2xl font-black text-slate-800 tracking-tighter">{formatCurrency(totalPlatformContribution)}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Total from this org (all rows)</p>
                    </GlassCard>
                    <GlassCard className="p-6 border-white/40">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gross volume</p>
                          <p className="text-[10px] font-bold text-slate-500 leading-snug">Booking & subscription charges</p>
                        </div>
                      </div>
                      <p className="text-2xl font-black text-slate-800 tracking-tighter">{formatCurrency(totalGrossVolume)}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">{orgTransactions.length} transactions</p>
                    </GlassCard>
                    <GlassCard className="p-6 border-white/40">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                          <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Net to organizer</p>
                          <p className="text-[10px] font-bold text-slate-500 leading-snug">After platform fee</p>
                        </div>
                      </div>
                      <p className="text-2xl font-black text-slate-800 tracking-tighter">
                        {formatCurrency(orgTransactions.reduce((s, t) => s + t.netToOrganizer, 0))}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">Total credited to organizer</p>
                    </GlassCard>
                  </div>

                  <GlassCard title="All transactions" subtitle="Payments, refunds, subscriptions, and fees for this organization.">
                    {orgTransactions.length === 0 ? (
                      <p className="text-sm font-bold text-slate-400 text-center py-12 mt-4">No transactions recorded for this organizer.</p>
                    ) : (
                      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-100">
                        <table className="w-full min-w-[920px] text-left">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/80">
                              <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                              <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Reference</th>
                              <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                              <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                              <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Gross</th>
                              <th className="px-4 py-3 text-[9px] font-black text-primary uppercase tracking-widest text-right">Platform fee</th>
                              <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Net to org</th>
                              <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orgTransactions.map((tx) => (
                              <tr key={tx.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="px-4 py-3 text-xs font-bold text-slate-700 whitespace-nowrap">{tx.date}</td>
                                <td className="px-4 py-3 text-[11px] font-mono font-bold text-slate-500">{tx.reference}</td>
                                <td className="px-4 py-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">{tx.type}</td>
                                <td className="px-4 py-3 text-xs font-medium text-slate-600 max-w-[220px]">{tx.description}</td>
                                <td className={cn(
                                  'px-4 py-3 text-xs font-black text-right tabular-nums',
                                  tx.grossAmount < 0 ? 'text-rose-600' : 'text-slate-800',
                                )}>
                                  {formatCurrency(tx.grossAmount)}
                                </td>
                                <td className={cn(
                                  'px-4 py-3 text-xs font-black text-right tabular-nums',
                                  tx.platformFee < 0 ? 'text-rose-600' : 'text-primary',
                                )}>
                                  {formatCurrency(tx.platformFee)}
                                </td>
                                <td className={cn(
                                  'px-4 py-3 text-xs font-black text-right tabular-nums',
                                  tx.netToOrganizer < 0 ? 'text-rose-600' : 'text-slate-800',
                                )}>
                                  {formatCurrency(tx.netToOrganizer)}
                                </td>
                                <td className="px-4 py-3">
                                  <span className={cn(
                                    'inline-flex px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border',
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
                <div className="space-y-6">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">{org.portfolio.length} Portfolio items</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {org.portfolio.map((img, i) => (
                      <div 
                        key={i}
                        className="relative rounded-lg overflow-hidden border border-slate-200 bg-white"
                      >
                        <img src={img} alt={`Portfolio ${i + 1}`} className="w-full h-56 object-cover" />
                        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-sm text-slate-600">
                          <span>Item #{String(i + 1).padStart(2, '0')}</span>
                          <ArrowUpRight className="w-4 h-4 text-slate-400" />
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

      {isTeamMemberModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4" aria-modal="true" role="dialog">
          <div
            onClick={() => {
              setIsTeamMemberModalOpen(false);
              resetTeamMemberForm();
            }}
            className="absolute inset-0 bg-slate-900/40"
            aria-hidden
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-white rounded-lg border border-slate-200 shadow-lg p-6 max-h-[calc(100vh-2rem)] flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Add Team Member</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  Add member for {org.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsTeamMemberModalOpen(false);
                  resetTeamMemberForm();
                }}
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto pr-2 -mr-2 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Profile picture
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                    {teamMemberForm.profilePicture ? (
                      <img src={teamMemberForm.profilePicture} alt="preview" className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="block w-full text-xs font-bold text-slate-600 file:mr-3 file:px-4 file:py-2.5 file:rounded-xl file:border-0 file:bg-slate-100 file:text-slate-600 file:text-[10px] file:font-black file:uppercase file:tracking-widest hover:file:bg-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={teamMemberForm.name}
                  onChange={(e) => setTeamMemberForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
                />
                <CustomSelect
                  value={teamMemberForm.nationality}
                  onChange={(value) => setTeamMemberForm((prev) => ({ ...prev, nationality: value }))}
                  placeholder="Select nationality"
                  options={NATIONALITY_OPTIONS.map((nationality) => ({ value: nationality, label: nationality }))}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={teamMemberForm.email}
                  onChange={(e) => setTeamMemberForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
                />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={teamMemberForm.phone}
                  onChange={(e) => setTeamMemberForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-5 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Select skills ({teamMemberForm.skills.length}/{TEAM_MEMBER_SKILLS.length})
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TEAM_MEMBER_SKILLS.map((skill) => {
                    const selected = teamMemberForm.skills.includes(skill);
                    return (
                      <button
                        type="button"
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={cn(
                          'text-left px-4 py-2.5 rounded-xl border text-xs font-bold transition-all',
                          selected
                            ? 'bg-primary/10 border-primary/30 text-primary'
                            : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100',
                        )}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsTeamMemberModalOpen(false);
                  resetTeamMemberForm();
                }}
                className="flex-1 py-3.5 bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTeamMember}
                className="flex-1 py-3 bg-primary text-white text-sm font-medium rounded-md hover:bg-primary/90"
              >
                Add Team Member
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default OrganizerDetails;
