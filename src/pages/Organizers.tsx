import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { ORGANIZERS } from '../data/mockData';
import { cn } from '../lib/utils';
import DetailsDialog from '../components/DetailsDialog';
import { 
  BadgeCheck, Ban, Star, Briefcase, ShieldCheck, UserPlus,
  Clock, Eye, CheckCircle2, XCircle, Power
} from 'lucide-react';

const OrganizersPage = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTitle, setDetailsTitle] = useState('');
  const [detailsPayload, setDetailsPayload] = useState<any>(null);

  type Organizer = typeof ORGANIZERS[0];
  const [organizers, setOrganizers] = useState<Organizer[]>(ORGANIZERS as Organizer[]);

  const filteredOrgs = statusFilter === 'all' ? organizers : organizers.filter(o => o.status === statusFilter);

  const columns = [
    {
      header: "Business",
      className: "hidden sm:table-cell",
      accessor: (org: typeof ORGANIZERS[0]) => <span className="font-black text-slate-800 text-xs sm:text-sm">{org.businessName}</span>
    },
    { 
      header: "Organizer", 
      accessor: (org: typeof ORGANIZERS[0]) => (
        <div className="cursor-pointer group py-1">
          <p className="font-black text-slate-800 leading-tight tracking-tight text-xs sm:text-sm group-hover:text-primary transition-colors truncate max-w-[120px] xs:max-w-none">{org.name}</p>
          <p className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{org.email}</p>
        </div>
      )
    },
    {
      header: "Nationality",
      className: "hidden xl:table-cell",
      accessor: (org: typeof ORGANIZERS[0]) => <span className="text-xs font-black text-slate-500 uppercase">{org.nationality}</span>
    },
    {
      header: "Phone",
      className: "hidden lg:table-cell",
      accessor: (org: typeof ORGANIZERS[0]) => <span className="text-xs font-bold text-slate-600">{org.phone}</span>
    },
    {
      header: "Docs",
      className: "hidden md:table-cell",
      accessor: (org: typeof ORGANIZERS[0]) => <span className="text-xs font-bold text-slate-600">{org.documents.length}</span>
    },
    {
      header: "Location",
      className: "hidden lg:table-cell",
      accessor: (org: typeof ORGANIZERS[0]) => <span className="text-xs font-bold text-slate-600">{org.location}</span>
    },
    {
      header: "Plan", 
      className: "hidden xs:table-cell",
      accessor: (org: typeof ORGANIZERS[0]) => (
        <span className={cn(
          "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-sm",
          org.subscriptionPlan === 'Premium' ? "bg-amber-50/50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-400 border-slate-100"
        )}>{org.subscriptionPlan}</span>
      )
    },
    { 
      header: "Status", 
      accessor: (org: typeof ORGANIZERS[0]) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
          org.status === 'Active' ? "bg-emerald-50/50 text-emerald-600 border-emerald-100" :
          org.status === 'Pending' ? "bg-amber-50/50 text-amber-600 border-amber-100" :
          org.status === 'Rejected' ? "bg-rose-50/50 text-rose-600 border-rose-100" :
          "bg-slate-50 text-slate-400 border-slate-200"
        )}>
           {org.status === 'Active' ? <ShieldCheck className="w-3 h-3" /> :
            org.status === 'Pending' ? <Clock className="w-3 h-3" /> :
            <Ban className="w-3 h-3" />}
           <span className="hidden xs:inline">{org.status}</span>
           <span className="xs:hidden">{org.status.charAt(0)}</span>
        </div>
      )
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-10">
      <PageHeader 
        title="Organizers"
        description="Manage organizer profiles and status."
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <PremiumTabs 
            tabs={[
              { id: 'all', label: 'All' },
              { id: 'Active', label: 'Active' },
              { id: 'Pending', label: 'Pending' },
            ]}
            activeTab={statusFilter}
            onChange={setStatusFilter}
          />
          <button
            type="button"
            onClick={() => setShowOnboardModal(true)}
            className="flex items-center justify-center gap-2 primary-gradient text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" /> Onboard
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        <StatCard
          title="Total"
          value={String(organizers.length)}
          icon={Briefcase}
          color="primary"
        />
        <StatCard
          title="Active"
          value={String(organizers.filter((o) => o.status === 'Active').length)}
          icon={ShieldCheck}
          color="blue"
        />
        <StatCard
          title="Pending"
          value={String(organizers.filter((o) => o.status === 'Pending').length)}
          icon={Clock}
          color="orange"
        />
        <StatCard
          title="Rating"
          value={String((organizers.reduce((acc, o) => acc + parseFloat(o.rating as any), 0) / Math.max(1, organizers.length)).toFixed(2))}
          icon={Star}
          color="secondary"
        />
      </div>

      <div className="mt-8 overflow-hidden">
        <DataTable 
          columns={columns} 
          data={filteredOrgs} 
          searchPlaceholder="Search organizers..."
          onRowClick={(org) => navigate(`/users/organizers/${org.id}`)}
          rowActions={[
            { label: 'View Profile', icon: Eye, onClick: (org: any) => navigate(`/users/organizers/${org.id}`) },
            { label: 'Approve', icon: CheckCircle2, onClick: (org: Organizer) => setOrganizers((prev) => prev.map((o) => (o.id === org.id ? { ...o, status: 'Active' } : o))), variant: 'success' as const },
            { label: 'Reject', icon: XCircle, onClick: (org: Organizer) => setOrganizers((prev) => prev.map((o) => (o.id === org.id ? { ...o, status: 'Rejected' } : o))), variant: 'danger' as const },
          ]}
        />
      </div>

      {/* Onboard Pro modal */}
      {showOnboardModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-9999 flex items-center justify-center p-4" aria-modal="true" role="dialog">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" onClick={() => setShowOnboardModal(false)} aria-hidden />
          <div className="relative glass-premium p-8 rounded-[2rem] border border-white/60 shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Onboard Pro</h3>
              <button
                type="button"
                onClick={() => setShowOnboardModal(false)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                aria-label="Close"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm font-medium text-slate-500 mb-6">
              Add a new professional organizer to the network. Invite via email or enter details manually.
            </p>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium outline-none focus:bg-white focus:border-primary/20"
              />
              <input
                type="text"
                placeholder="Full name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3 px-4 text-sm font-medium outline-none focus:bg-white focus:border-primary/20"
              />
            </div>
            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={() => setShowOnboardModal(false)}
                className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowOnboardModal(false);
                  setDetailsTitle('Onboard Pro Invite (mock)');
                  setDetailsPayload({ email: inviteEmail, name: inviteName });
                  setDetailsOpen(true);
                  setInviteEmail('');
                  setInviteName('');
                }}
                className="flex-1 py-3 primary-gradient text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      <DetailsDialog
        open={detailsOpen}
        title={detailsTitle}
        onClose={() => setDetailsOpen(false)}
      >
        {detailsPayload && (
          <div className="mt-2 space-y-4">
            {detailsPayload.id && detailsPayload.services ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <img src={detailsPayload.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md" />
                  <div>
                    <p className="font-black text-slate-800 text-lg">{detailsPayload.name}</p>
                    <p className="text-sm font-bold text-slate-500">{detailsPayload.email}</p>
                    <p className="text-xs font-bold text-slate-400 mt-0.5">{detailsPayload.phone}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Plan</p>
                    <p className="font-black text-slate-800">{detailsPayload.subscriptionPlan}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                    <p className="font-black text-slate-800">{detailsPayload.status}</p>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Services</p>
                  <div className="flex flex-wrap gap-2">
                    {detailsPayload.services?.map((s: string, i: number) => (
                      <span key={i} className="px-2 py-1 bg-white border border-slate-100 rounded-lg text-xs font-bold text-slate-700">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                    <p className="font-black text-slate-800">{detailsPayload.rating} ({detailsPayload.totalReviews} reviews)</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completed jobs</p>
                    <p className="font-black text-slate-800">{detailsPayload.completedJobs}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="font-bold text-slate-700">Invite sent to <span className="text-slate-900">{detailsPayload.name || '—'}</span> ({detailsPayload.email || '—'}).</p>
              </div>
            )}
          </div>
        )}
      </DetailsDialog>
    </div>
  );
};

export default OrganizersPage;
