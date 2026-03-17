import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { ORGANIZERS } from '../data/mockData';
import { cn } from '../lib/utils';
import { 
  BadgeCheck, Ban, Star, Briefcase, ShieldCheck, UserPlus,
  Clock, Eye, ChevronRight, CheckCircle2, XCircle, Power
} from 'lucide-react';

const OrganizersPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrgs = statusFilter === 'all' ? ORGANIZERS : ORGANIZERS.filter(o => o.status === statusFilter);

  const columns = [
    { 
      header: "Professional Identity", 
      accessor: (org: typeof ORGANIZERS[0]) => (
        <div className="flex items-center gap-4 cursor-pointer group">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-xl overflow-hidden p-0.5 group-hover:shadow-2xl transition-all">
             <img src={org.avatar} alt={org.name} className="w-full h-full object-cover rounded-[14px]" />
          </div>
          <div>
            <p className="font-black text-slate-800 leading-tight tracking-tight group-hover:text-primary transition-colors">{org.name}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{org.email}</p>
          </div>
        </div>
      )
    },
    { 
      header: "Core Services", 
      accessor: (org: typeof ORGANIZERS[0]) => (
        <div className="flex flex-wrap gap-1.5">
          {org.services.slice(0, 2).map((s, i) => (
            <span key={i} className="px-2 py-0.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-md border border-primary/10">
              {s}
            </span>
          ))}
          {org.services.length > 2 && <span className="text-[10px] font-black text-slate-400">+{org.services.length - 2}</span>}
        </div>
      )
    },
    { 
      header: "Tier & Plan", 
      accessor: (org: typeof ORGANIZERS[0]) => (
        <span className={cn(
          "px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm",
          org.subscriptionPlan === 'Premium' ? "bg-amber-50/50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-400 border-slate-100"
        )}>{org.subscriptionPlan}</span>
      )
    },
    { 
      header: "Reputation", 
      accessor: (org: typeof ORGANIZERS[0]) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-black text-slate-800">{org.rating}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400">{org.totalReviews} reviews</span>
        </div>
      )
    },
    { 
      header: "Status", 
      accessor: (org: typeof ORGANIZERS[0]) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
          org.status === 'Active' ? "bg-emerald-50/50 text-emerald-600 border-emerald-100" :
          org.status === 'Pending' ? "bg-amber-50/50 text-amber-600 border-amber-100" :
          org.status === 'Rejected' ? "bg-rose-50/50 text-rose-600 border-rose-100" :
          "bg-slate-50 text-slate-400 border-slate-200"
        )}>
           {org.status === 'Active' ? <ShieldCheck className="w-3.5 h-3.5" /> :
            org.status === 'Pending' ? <Clock className="w-3.5 h-3.5" /> :
            <Ban className="w-3.5 h-3.5" />}
           {org.status}
        </div>
      )
    },
    {
      header: "Profile",
      accessor: (org: typeof ORGANIZERS[0]) => (
        <button 
          onClick={() => navigate(`/users/organizers/${org.id}`)}
          className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-all"
        >
          <Eye className="w-3.5 h-3.5" /> View <ChevronRight className="w-3 h-3" />
        </button>
      )
    },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <PageHeader 
        title="Pro Network" 
        description="Verify registrations, manage organizer profiles, and track performance across the network."
      >
        <div className="flex flex-wrap gap-3">
          <PremiumTabs 
            tabs={[
              { id: 'all', label: 'All' },
              { id: 'Active', label: 'Active' },
              { id: 'Pending', label: 'Pending' },
              { id: 'Rejected', label: 'Rejected' },
              { id: 'Deactivated', label: 'Deactivated' },
            ]}
            activeTab={statusFilter}
            onChange={setStatusFilter}
          />
          <button className="flex items-center gap-2 primary-gradient text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            <UserPlus className="w-4 h-4" /> Onboard Pro
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard title="Total Partners" value="842" change={4.2} icon={Briefcase} color="primary" trend="up" />
        <StatCard title="Active Network" value="790" change={6.8} icon={ShieldCheck} color="blue" trend="up" />
        <StatCard title="Pending Approval" value={String(ORGANIZERS.filter(o => o.status === 'Pending').length)} icon={Clock} color="orange" />
        <StatCard title="Avg Rating" value="4.85" change={2.1} icon={Star} color="secondary" trend="up" />
      </div>

      <DataTable 
        columns={columns} 
        data={filteredOrgs} 
        searchPlaceholder="Search organizers by name, service, or status..."
        onRowClick={(org) => navigate(`/users/organizers/${org.id}`)}
        rowActions={[
          { label: 'View Profile', icon: Eye, onClick: (org: any) => navigate(`/users/organizers/${org.id}`) },
          { label: 'Approve', icon: CheckCircle2, onClick: () => {}, variant: 'success' as const },
          { label: 'Reject', icon: XCircle, onClick: () => {}, variant: 'danger' as const },
          { label: 'Deactivate', icon: Power, onClick: () => {}, variant: 'danger' as const },
        ]}
      />
    </div>
  );
};

export default OrganizersPage;
