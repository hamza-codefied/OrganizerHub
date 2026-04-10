import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { PageHeader, StatCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { formatCurrency, cn } from '../lib/utils';
import {
  CheckCircle2,
  DollarSign,
  Activity,
  User,
  Briefcase,
  Tag,
  Percent,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import DetailsDialog from '../components/DetailsDialog';
import { DateRangePicker } from '../components/DateRangePicker';
import type { DateRange } from 'react-day-picker';
import { useAdminBookings } from '../hooks/useAdminBookings';
import type { AdminBookingRow } from '../lib/adminBookingsApi';

/** Row shape for DataTable (requires `id`). */
type BookingTableRow = AdminBookingRow & { id: string };

function toTableRows(bookings: AdminBookingRow[]): BookingTableRow[] {
  return bookings.map((b) => ({ ...b, id: b.booking_id }));
}

function formatBookingDate(iso: string) {
  try {
    return format(parseISO(iso), 'MMM d, yyyy');
  } catch {
    return iso;
  }
}

function formatBookingDateTime(iso: string) {
  try {
    return format(parseISO(iso), 'MMM d, yyyy · h:mm a');
  } catch {
    return iso;
  }
}

function matchesStatusFilter(status: string, filter: string) {
  if (filter === 'all') return true;
  const s = status.toLowerCase();
  if (filter === 'Pending') {
    return ['pending', 'active', 'scheduled'].includes(s);
  }
  if (filter === 'Completed') return s === 'completed';
  if (filter === 'Cancelled') return s === 'cancelled' || s === 'canceled';
  return true;
}

function statusBadgeClass(status: string) {
  const s = status.toLowerCase();
  if (s === 'completed') return 'bg-emerald-500 border-emerald-500 text-white';
  if (s === 'pending' || s === 'active' || s === 'scheduled') {
    return 'bg-amber-500 border-amber-500 text-white';
  }
  if (s === 'cancelled' || s === 'canceled') return 'bg-rose-500 border-rose-500 text-white';
  return 'bg-slate-500 border-slate-500 text-white';
}

function detailStatusTextClass(status: string) {
  const s = status.toLowerCase();
  if (s === 'completed') return 'text-emerald-600';
  if (s === 'pending' || s === 'active' || s === 'scheduled') return 'text-amber-600';
  if (s === 'cancelled' || s === 'canceled') return 'text-rose-600';
  return 'text-slate-600';
}

const BookingsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchInput, setSearchInput] = useState('');

  const { data, error, isLoading, refetch } = useAdminBookings({
    search: searchInput,
    dateRange,
  });

  const tableRows = useMemo(() => toTableRows(data?.bookings ?? []), [data?.bookings]);

  const filteredBookings = useMemo(
    () => tableRows.filter((b) => matchesStatusFilter(b.status, statusFilter)),
    [tableRows, statusFilter],
  );

  const columns = [
    {
      header: 'Booking ID',
      className: 'hidden sm:table-cell',
      accessor: (b: BookingTableRow) => (
        <span
          title={b.booking_id}
          className="font-black text-slate-400 text-[10px] tracking-widest whitespace-nowrap"
        >
          #{b.booking_id.slice(0, 8)}…
        </span>
      ),
    },
    {
      header: 'Home Owner',
      accessor: (b: BookingTableRow) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-800 text-[12px] truncate">{b.home_owner_name}</span>
            <span className="text-[10px] font-medium text-slate-500 truncate">{b.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Organizer',
      accessor: (b: BookingTableRow) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-slate-800 text-[12px] truncate">{b.organizer_name}</span>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate mt-0.5">
              {b.organization}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Service',
      className: 'hidden lg:table-cell',
      accessor: (b: BookingTableRow) => (
        <div className="flex items-center gap-2 max-w-[180px] truncate">
          <Tag className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="font-bold text-slate-700 text-[11px] truncate">{b.service}</span>
        </div>
      ),
    },
    {
      header: 'Amount',
      className: 'hidden md:table-cell',
      accessor: (b: BookingTableRow) => (
        <span className="font-black text-slate-800 text-[13px] tracking-tight">{formatCurrency(b.price)}</span>
      ),
    },
    {
      header: 'Revenue',
      accessor: (b: BookingTableRow) => (
        <span className="inline-flex items-center font-black text-primary text-[12px] tracking-tight bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 whitespace-nowrap">
          {formatCurrency(b.revenue)}
        </span>
      ),
    },
    {
      header: 'Date',
      className: 'hidden sm:table-cell',
      accessor: (b: BookingTableRow) => (
        <span className="text-[11px] font-bold text-slate-800 whitespace-nowrap">{formatBookingDate(b.created_at)}</span>
      ),
    },
    {
      header: 'Status',
      accessor: (b: BookingTableRow) => (
        <div
          className={cn(
            'inline-flex items-center px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm whitespace-nowrap',
            statusBadgeClass(b.status),
          )}
        >
          <span>{b.status}</span>
        </div>
      ),
    },
  ];

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTitle, setDetailsTitle] = useState('');
  const [detailsPayload, setDetailsPayload] = useState<BookingTableRow | null>(null);

  const pendingCount = data?.pending_services_count ?? 0;
  const completedCount = data?.completed_services_count ?? 0;
  const grossVolume = data?.gross_volume ?? 0;
  const totalRevenue = data?.total_revenue ?? 0;

  return (
    <div className="space-y-6 sm:space-y-10">
      <PageHeader title="Bookings" description="View booking requests and their status.">
        <PremiumTabs
          tabs={[
            { id: 'all', label: 'All' },
            { id: 'Pending', label: 'Pending' },
            { id: 'Completed', label: 'Completed' },
            { id: 'Cancelled', label: 'Cancelled' },
          ]}
          activeTab={statusFilter}
          onChange={setStatusFilter}
        />
      </PageHeader>

      {error && (
        <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-sm flex flex-wrap items-center gap-3">
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-900 underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        <StatCard title="Pending" value={String(pendingCount)} icon={Activity} color="amber" />
        <StatCard title="Completed" value={String(completedCount)} icon={CheckCircle2} color="emerald" />
        <StatCard title="Gross Volume" value={formatCurrency(grossVolume)} icon={DollarSign} color="blue" />
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={Percent} color="primary" />
      </div>

      <div className="mt-8">
        {isLoading && !data ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-sm font-semibold text-slate-500">Loading bookings…</p>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredBookings}
            searchPlaceholder="Search by home owner or organization…"
            serverSideSearch
            onSearch={setSearchInput}
            belowSearch={
              <div className="flex items-center gap-2 mt-3 sm:mt-0 w-full xl:w-auto pb-1 sm:pb-0 relative z-50">
                <DateRangePicker
                  range={dateRange}
                  onRangeChange={setDateRange}
                  placeholder="Select date range"
                />
              </div>
            }
            rowActions={[
              {
                label: 'View details',
                icon: Activity,
                onClick: (b: BookingTableRow) => {
                  setDetailsTitle('Booking details');
                  setDetailsPayload(b);
                  setDetailsOpen(true);
                },
              },
            ]}
          />
        )}
      </div>

      <DetailsDialog open={detailsOpen} title={detailsTitle} onClose={() => setDetailsOpen(false)}>
        {detailsPayload && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Booking ID</p>
                <p className="font-black text-slate-800 font-mono text-xs break-all">{detailsPayload.booking_id}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className={cn('font-black text-sm capitalize', detailStatusTextClass(detailsPayload.status))}>
                  {detailsPayload.status}
                </p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Home owner</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-800 text-sm">{detailsPayload.home_owner_name}</p>
                  <p className="text-xs font-bold text-slate-500 mt-0.5 truncate">{detailsPayload.email}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Organizer</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-800 text-sm">{detailsPayload.organizer_name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {detailsPayload.organization}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Service</p>
                <p className="font-black text-slate-800 text-sm">{detailsPayload.service}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Created</p>
                <p className="font-black text-slate-800 text-sm">{formatBookingDateTime(detailsPayload.created_at)}</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Price</p>
                <p className="font-black text-slate-800 text-xl">{formatCurrency(detailsPayload.price)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Revenue</p>
                <p className="font-black text-primary text-xl">{formatCurrency(detailsPayload.revenue)}</p>
              </div>
            </div>
          </div>
        )}
      </DetailsDialog>
    </div>
  );
};

export default BookingsPage;
