import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { HOME_OWNERS } from '../data/mockData';
import { cn } from '../lib/utils';
import DetailsDialog from '../components/DetailsDialog';
import { 
  BadgeCheck, Ban, Users, UserCheck, UserPlus, Download,
  MapPin, Eye, ShieldAlert, ChevronRight
} from 'lucide-react';

const HomeOwnersPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  type HomeOwner = typeof HOME_OWNERS[0];
  const [homeOwners, setHomeOwners] = useState<HomeOwner[]>(HOME_OWNERS as HomeOwner[]);

  const filteredHomeOwners = statusFilter === 'all' ? homeOwners : homeOwners.filter(h => h.status === statusFilter);

  const columns = [
    { 
      header: "Home owner", 
      accessor: (homeOwner: typeof HOME_OWNERS[0]) => (
        <div className="flex items-center gap-4 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden group-hover:shadow-lg transition-all">
             <img src={homeOwner.avatar} alt={homeOwner.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="font-black text-slate-800 leading-tight tracking-tight group-hover:text-primary transition-colors">{homeOwner.name}</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{homeOwner.email}</p>
          </div>
        </div>
      )
    },
    { 
      header: "Location", 
      accessor: (homeOwner: typeof HOME_OWNERS[0]) => (
        <span className="flex items-center gap-1.5 font-bold text-slate-600 tracking-tight text-sm">
          <MapPin className="w-3.5 h-3.5 text-slate-300" /> {homeOwner.location}
        </span>
      )
    },
    { 
      header: "Activity", 
      accessor: (homeOwner: typeof HOME_OWNERS[0]) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-black text-primary">{homeOwner.totalBookings} bookings</span>
          <span className="text-[10px] font-bold text-slate-400">{homeOwner.reviewsGiven} reviews • {homeOwner.favorites} favorites</span>
        </div>
      )
    },
    { 
      header: "Status", 
      accessor: (homeOwner: typeof HOME_OWNERS[0]) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm",
          homeOwner.status === 'Active' ? "bg-emerald-50/50 text-emerald-600 border-emerald-100" :
          homeOwner.status === 'Suspended' ? "bg-amber-50/50 text-amber-600 border-amber-100" :
          "bg-rose-50/50 text-rose-600 border-rose-100"
        )}>
           {homeOwner.status === 'Active' ? <BadgeCheck className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
           {homeOwner.status}
        </div>
      )
    },
    {
      header: "Profile",
      accessor: (homeOwner: typeof HOME_OWNERS[0]) => (
        <button 
          onClick={() => navigate(`/users/home-owners/${homeOwner.id}`)}
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
        title="Home owners"
        description="Browse home owners, view their profiles, and manage their access."
      >
        <div className="flex gap-3">
          <PremiumTabs 
            tabs={[
              { id: 'all', label: 'All' },
              { id: 'Active', label: 'Active' },
              { id: 'Suspended', label: 'Suspended' },
              { id: 'Blocked', label: 'Blocked' },
            ]}
            activeTab={statusFilter}
            onChange={setStatusFilter}
          />
          {/* <button className="flex items-center gap-2 px-5 py-2.5 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:shadow-lg transition-all active:scale-95 text-slate-600">
            <Download className="w-4 h-4" /> Export
          </button> */}
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard title="Total home owners" value="12,450" change={12} icon={Users} color="blue" trend="up" />
        <StatCard title="Active" value="11,180" change={8} icon={UserCheck} color="primary" trend="up" />
        <StatCard title="Suspended" value="128" icon={ShieldAlert} color="orange" />
        <StatCard title="New this month" value="842" change={15} icon={UserPlus} color="secondary" trend="up" />
      </div>

      <DataTable 
        columns={columns} 
        data={filteredHomeOwners} 
        searchPlaceholder="Search by name, email, or location..."
        onRowClick={(homeOwner) => navigate(`/users/home-owners/${homeOwner.id}`)}
        rowActions={[
          { label: 'View', icon: Eye, onClick: (homeOwner: any) => navigate(`/users/home-owners/${homeOwner.id}`) },
          { label: 'Suspend', icon: ShieldAlert, onClick: (homeOwner: any) => setHomeOwners((prev) => prev.map((h) => (h.id === homeOwner.id ? { ...h, status: 'Suspended' } : h))), variant: 'danger' as const },
          { label: 'Block', icon: Ban, onClick: (homeOwner: any) => setHomeOwners((prev) => prev.map((h) => (h.id === homeOwner.id ? { ...h, status: 'Blocked' } : h))), variant: 'danger' as const },
        ]}
      />
    </div>
  );
};

export default HomeOwnersPage;
