import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { HOME_OWNERS } from '../data/mockData';
import { cn } from '../lib/utils';
import DetailsDialog from '../components/DetailsDialog';
import { 
  BadgeCheck, Ban, Users, UserCheck, UserPlus, Download,
  Eye, ShieldAlert
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
        <div className="cursor-pointer group py-1">
          <p className="font-black text-slate-800 leading-tight tracking-tight text-xs sm:text-sm group-hover:text-primary transition-colors truncate max-w-[120px] xs:max-w-none">{homeOwner.name}</p>
          <p className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{homeOwner.email}</p>
        </div>
      )
    },
    { header: "Phone", className: "hidden sm:table-cell", accessor: (homeOwner: typeof HOME_OWNERS[0]) => <span className="text-xs font-bold text-slate-600">{homeOwner.phone}</span> },
    { header: "DOB", className: "hidden xl:table-cell", accessor: (homeOwner: typeof HOME_OWNERS[0]) => <span className="text-xs font-bold text-slate-600">{homeOwner.dob}</span> },
    { header: "Gender", className: "hidden lg:table-cell", accessor: (homeOwner: typeof HOME_OWNERS[0]) => <span className="text-xs font-black text-slate-500 uppercase">{homeOwner.gender}</span> },
    { header: "Location", className: "hidden md:table-cell", accessor: (homeOwner: typeof HOME_OWNERS[0]) => <span className="text-xs font-bold text-slate-600">{homeOwner.location}</span> },
    {
      header: "Activity", 
      className: "hidden xs:table-cell",
      accessor: (homeOwner: typeof HOME_OWNERS[0]) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] sm:text-sm font-black text-primary">{homeOwner.totalBookings} bookings</span>
          <span className="text-[8px] sm:text-[10px] font-bold text-slate-400">{homeOwner.reviewsGiven} reviews</span>
        </div>
      )
    },
    { 
      header: "Status", 
      accessor: (homeOwner: typeof HOME_OWNERS[0]) => (
        <div
          className={cn(
            "inline-flex items-center px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
            homeOwner.status === "Active"
              ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
              : "bg-rose-500 border-rose-500 text-white shadow-sm",
          )}
        >
          <span>{homeOwner.status}</span>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-10">
      <PageHeader 
        title="Home owners"
        description="Manage home owner profiles."
      >
        <div className="flex w-full sm:w-auto overflow-x-auto">
          <PremiumTabs 
            tabs={[
              { id: 'all', label: 'All' },
              { id: 'Active', label: 'Active' },
              { id: 'Suspended', label: 'Suspended' },
            ]}
            activeTab={statusFilter}
            onChange={setStatusFilter}
          />
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        <StatCard title="Total" value="12,450" change={12} icon={Users} color="blue" trend="up" />
        <StatCard title="Active" value="11,180" change={8} icon={UserCheck} color="emerald" trend="up" />
        <StatCard title="Suspended" value="128" icon={ShieldAlert} color="rose" />
        <StatCard title="New" value="842" change={15} icon={UserPlus} color="secondary" trend="up" />
      </div>

      <div className="mt-8 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={filteredHomeOwners} 
          searchPlaceholder="Search home owners..."
          onRowClick={(homeOwner) => navigate(`/users/home-owners/${homeOwner.id}`)}
          rowActions={[
            { label: 'View Profile', icon: Eye, onClick: (homeOwner: any) => navigate(`/users/home-owners/${homeOwner.id}`) },
            { label: 'Suspend', icon: ShieldAlert, onClick: (homeOwner: any) => setHomeOwners((prev) => prev.map((h) => (h.id === homeOwner.id ? { ...h, status: 'Suspended' } : h))), variant: 'danger' as const },
          ]}
        />
      </div>
    </div>
  );
};

export default HomeOwnersPage;
