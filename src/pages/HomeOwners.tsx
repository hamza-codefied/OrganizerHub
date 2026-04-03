import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import ConfirmationDialog from '../components/ConfirmationDialog';
import SuspendHomeOwnerDialog from '../components/SuspendHomeOwnerDialog';
import { cn } from '../lib/utils';
import { useAdminHomeOwners } from '../hooks/useAdminHomeOwners';
import { adminSuspendHomeOwner } from '../lib/adminHomeOwnersApi';
import type { HomeOwnerListItem, HomeOwnersRange } from '../lib/adminHomeOwnersApi';
import { Users, UserCheck, UserPlus, Eye, ShieldAlert, Loader2, RefreshCw, ShieldCheck } from 'lucide-react';

type HomeOwnerRow = HomeOwnerListItem & { id: string };

const RANGE_TABS: { id: HomeOwnersRange; label: string }[] = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'daily', label: 'Daily' },
  { id: 'yearly', label: 'Yearly' },
  { id: 'all', label: 'All time' },
];

function formatStatusLabel(status: string) {
  const s = status.toLowerCase();
  if (s === 'active') return 'Active';
  if (s === 'suspended') return 'Suspended';
  return status;
}

function normalizeStatus(status: string) {
  return status.toLowerCase();
}

const HomeOwnersPage = () => {
  const navigate = useNavigate();
  const [range, setRange] = useState<HomeOwnersRange>('monthly');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data, error, isLoading, refetch } = useAdminHomeOwners(range);
  const [suspendTarget, setSuspendTarget] = useState<HomeOwnerRow | null>(null);
  const [restoreTarget, setRestoreTarget] = useState<HomeOwnerRow | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [suspendDialogError, setSuspendDialogError] = useState<string | null>(null);

  const rows: HomeOwnerRow[] = useMemo(() => {
    const list = data?.home_owners ?? [];
    return list.map((h) => ({ ...h, id: h.home_owner_id }));
  }, [data?.home_owners]);

  const filteredHomeOwners = useMemo(() => {
    if (statusFilter === 'all') return rows;
    const target = statusFilter.toLowerCase();
    return rows.filter((h) => normalizeStatus(h.status) === target);
  }, [rows, statusFilter]);

  const columns = [
    {
      header: 'Home owner',
      accessor: (homeOwner: HomeOwnerRow) => (
        <div className="cursor-pointer group py-1">
          <p className="font-black text-slate-800 leading-tight tracking-tight text-xs sm:text-sm group-hover:text-primary transition-colors truncate max-w-[120px] xs:max-w-none">
            {homeOwner.name}
          </p>
          <p className="text-[9px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{homeOwner.email}</p>
        </div>
      ),
    },
    {
      header: 'Phone',
      className: 'hidden sm:table-cell',
      accessor: (homeOwner: HomeOwnerRow) => (
        <span className="text-xs font-bold text-slate-600">{homeOwner.phone}</span>
      ),
    },
    {
      header: 'DOB',
      className: 'hidden xl:table-cell',
      accessor: (homeOwner: HomeOwnerRow) => (
        <span className="text-xs font-bold text-slate-600">{homeOwner.date_of_birth}</span>
      ),
    },
    {
      header: 'Gender',
      className: 'hidden lg:table-cell',
      accessor: (homeOwner: HomeOwnerRow) => (
        <span className="text-xs font-black text-slate-500 uppercase">{homeOwner.gender}</span>
      ),
    },
    {
      header: 'Location',
      className: 'hidden md:table-cell',
      accessor: (homeOwner: HomeOwnerRow) => (
        <span className="text-xs font-bold text-slate-600">{homeOwner.location ?? '—'}</span>
      ),
    },
    {
      header: 'Status',
      accessor: (homeOwner: HomeOwnerRow) => (
        <div
          className={cn(
            'inline-flex items-center px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border',
            normalizeStatus(homeOwner.status) === 'active'
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
              : 'bg-rose-500 border-rose-500 text-white shadow-sm',
          )}
        >
          <span>{formatStatusLabel(homeOwner.status)}</span>
        </div>
      ),
    },
  ];

  const totals = data
    ? {
        total: data.total_home_owners,
        active: data.total_active,
        suspended: data.total_suspended,
        new: data.total_new,
      }
    : null;

  const handleSuspendConfirm = async (message: string) => {
    if (!suspendTarget) return;
    setSuspendDialogError(null);
    setActionLoading(true);
    try {
      await adminSuspendHomeOwner({
        home_owner_id: suspendTarget.home_owner_id,
        suspend: true,
        message,
      });
      setSuspendTarget(null);
      await refetch();
    } catch (e) {
      setSuspendDialogError(e instanceof Error ? e.message : 'Could not suspend home owner.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestoreConfirm = async () => {
    if (!restoreTarget) return;
    setActionLoading(true);
    try {
      await adminSuspendHomeOwner({
        home_owner_id: restoreTarget.home_owner_id,
        suspend: false,
      });
      setRestoreTarget(null);
      await refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not restore home owner.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-10">
      <PageHeader title="Home owners" description="Manage home owner profiles.">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex w-full sm:w-auto overflow-x-auto">
            <PremiumTabs tabs={RANGE_TABS} activeTab={range} onChange={(id) => setRange(id as HomeOwnersRange)} />
          </div>
          <div className="flex w-full sm:w-auto overflow-x-auto">
            <PremiumTabs
              tabs={[
                { id: 'all', label: 'All' },
                { id: 'active', label: 'Active' },
                { id: 'suspended', label: 'Suspended' },
              ]}
              activeTab={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        <StatCard
          title="Total"
          value={totals != null ? totals.total.toLocaleString() : '—'}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Active"
          value={totals != null ? totals.active.toLocaleString() : '—'}
          icon={UserCheck}
          color="emerald"
        />
        <StatCard title="Suspended" value={totals != null ? totals.suspended.toLocaleString() : '—'} icon={ShieldAlert} color="rose" />
        <StatCard
          title="New"
          value={totals != null ? totals.new.toLocaleString() : '—'}
          icon={UserPlus}
          color="secondary"
        />
      </div>

      {error && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg border border-rose-200 bg-rose-50 text-rose-800 text-sm">
          <p className="flex-1 font-medium">{error}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-white border border-rose-200 text-rose-800 text-xs font-bold uppercase tracking-wide hover:bg-rose-100/80"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      )}

      <div className="mt-8 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 rounded-lg border border-slate-200 min-h-[240px]">
            <div className="flex items-center gap-3 text-slate-600">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="text-sm font-semibold">Loading home owners…</span>
            </div>
          </div>
        )}
        <DataTable
          columns={columns}
          data={filteredHomeOwners}
          searchPlaceholder="Search home owners..."
          onRowClick={(homeOwner) => navigate(`/users/home-owners/${homeOwner.home_owner_id}`)}
          rowActions={[
            {
              label: 'View Profile',
              icon: Eye,
              onClick: (homeOwner: HomeOwnerRow) => navigate(`/users/home-owners/${homeOwner.home_owner_id}`),
            },
            {
              label: 'Suspend',
              icon: ShieldAlert,
              variant: 'danger' as const,
              show: (h) => normalizeStatus(h.status) === 'active',
              onClick: (h) => {
                setSuspendDialogError(null);
                setSuspendTarget(h);
              },
            },
            {
              label: 'Restore access',
              icon: ShieldCheck,
              variant: 'success' as const,
              show: (h) => normalizeStatus(h.status) === 'suspended',
              onClick: (h) => setRestoreTarget(h),
            },
          ]}
        />
      </div>

      <SuspendHomeOwnerDialog
        open={suspendTarget != null}
        ownerLabel={suspendTarget ? suspendTarget.name : undefined}
        loading={actionLoading}
        error={suspendDialogError}
        onClose={() => {
          if (!actionLoading) setSuspendTarget(null);
        }}
        onConfirm={handleSuspendConfirm}
      />

      <ConfirmationDialog
        open={restoreTarget != null}
        title="Restore this home owner?"
        description={
          restoreTarget
            ? `Allow ${restoreTarget.name} to use their account again? No message is sent to the server for activation.`
            : undefined
        }
        confirmText={actionLoading ? 'Working…' : 'Restore access'}
        danger={false}
        onCancel={() => {
          if (!actionLoading) setRestoreTarget(null);
        }}
        onConfirm={handleRestoreConfirm}
      />
    </div>
  );
};

export default HomeOwnersPage;
