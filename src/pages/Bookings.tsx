import { useState } from 'react';
import { PageHeader, StatCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { BOOKINGS } from '../data/mockData';
import { formatCurrency, cn } from '../lib/utils';
import { 
  CheckCircle2, DollarSign, Activity, XCircle,
  User, Briefcase, Tag, Percent
} from 'lucide-react';
import DetailsDialog from '../components/DetailsDialog';
import { DateRangePicker } from '../components/DateRangePicker';
import type { DateRange } from 'react-day-picker';

const BookingsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
  type Booking = typeof BOOKINGS[0];
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS as Booking[]);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTitle, setDetailsTitle] = useState('');
  const [detailsPayload, setDetailsPayload] = useState<any>(null);

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const bookingDate = new Date(b.date);
    const matchStart = dateRange?.from ? bookingDate >= dateRange.from : true;
    const matchEnd = dateRange?.to ? bookingDate <= dateRange.to : true;
    return matchesStatus && matchStart && matchEnd;
  });

  const columns = [
    { 
      header: "Booking ID", 
      className: "hidden sm:table-cell",
      accessor: (b: any) => (
        <span className="font-black text-slate-400 text-[10px] tracking-widest whitespace-nowrap">#{b.id}</span>
      )
    },
    { 
      header: "Home Owner", 
      accessor: (b: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
             <User className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
             <span className="font-bold text-slate-800 text-[12px] truncate">{b.homeOwner.name}</span>
             <span className="text-[10px] font-medium text-slate-500 truncate">{b.homeOwner.email}</span>
          </div>
        </div>
      )
    },
    { 
      header: "Organizer", 
      accessor: (b: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
             <Briefcase className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
             <span className="font-bold text-slate-800 text-[12px] truncate">{b.organizer.name}</span>
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate mt-0.5">
               {b.organizer.businessName || b.organizer.tradeName || 'Independent'}
             </span>
          </div>
        </div>
      )
    },
    { 
      header: "Service", 
      className: "hidden lg:table-cell",
      accessor: (b: any) => (
        <div className="flex items-center gap-2 max-w-[180px] truncate">
           <Tag className="w-3.5 h-3.5 text-slate-300 shrink-0" />
           <span className="font-bold text-slate-700 text-[11px] truncate">{b.service}</span>
        </div>
      )
    },
    { 
      header: "Amount", 
      className: "hidden md:table-cell",
      accessor: (b: any) => (
        <span className="font-black text-slate-800 text-[13px] tracking-tight">{formatCurrency(b.amount)}</span>
      )
    },
    { 
      header: "Revenue", 
      accessor: (b: any) => (
         <span className="inline-flex items-center font-black text-primary text-[12px] tracking-tight bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10 whitespace-nowrap">
           {formatCurrency(b.amount * 0.15)}
         </span>
      )
    },
    { 
      header: "Date", 
      className: "hidden sm:table-cell",
      accessor: (b: any) => (
        <span className="text-[11px] font-bold text-slate-800 whitespace-nowrap">{b.date}</span>
      )
    },
    { 
      header: "Status", 
      accessor: (b: any) => (
        <div className={cn(
          "inline-flex items-center px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm whitespace-nowrap",
          b.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
          b.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"
        )}>
          <span>{b.status}</span>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-10">
      <PageHeader
        title="Bookings"
        description="View booking requests and their status."
      >
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
        <StatCard title="Pending" value={String(bookings.filter(b => b.status === 'Pending').length)} icon={Activity} color="amber" />
        <StatCard title="Completed" value={String(bookings.filter(b => b.status === 'Completed').length)} icon={CheckCircle2} color="primary" />
        <StatCard title="Gross Volume" value={formatCurrency(bookings.reduce((acc, b) => acc + b.amount, 0))} icon={DollarSign} color="secondary" />
        <StatCard title="Total Revenue" value={formatCurrency(bookings.reduce((acc, b) => acc + b.amount * 0.15, 0))} icon={Percent} color="emerald" />
      </div>

      <div className="mt-8">
        <DataTable 
          columns={columns} 
          data={filteredBookings} 
          searchPlaceholder="Search bookings..." 
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
              onClick: (b: Booking) => {
                setDetailsTitle('Booking details');
                setDetailsPayload(b);
                setDetailsOpen(true);
              },
            },
            {
              label: 'Cancel',
              icon: XCircle,
              variant: 'danger',
              onClick: (b: Booking) => setBookings((prev) => prev.map((x) => (x.id === b.id ? { ...x, status: 'Cancelled' } : x))),
            },
          ]}
        />
      </div>

      <DetailsDialog
        open={detailsOpen}
        title={detailsTitle}
        onClose={() => setDetailsOpen(false)}
      >
        {detailsPayload && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Booking ID</p>
                <p className="font-black text-slate-800">#{detailsPayload.id}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <p className={cn(
                  "font-black text-sm",
                  detailsPayload.status === 'Completed' ? "text-emerald-600" :
                  detailsPayload.status === 'Pending' ? "text-amber-600" : "text-rose-600"
                )}>{detailsPayload.status}</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Home owner</p>
              <div className="flex items-center gap-4">
                <img src={detailsPayload.homeOwner?.avatar} alt="" className="w-12 h-12 rounded-xl object-cover border border-white shadow-sm bg-white" />
                <div>
                  <p className="font-black text-slate-800 text-sm">{detailsPayload.homeOwner?.name}</p>
                  <p className="text-xs font-bold text-slate-500 mt-0.5">{detailsPayload.homeOwner?.email}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Organizer</p>
              <div className="flex items-center gap-4">
                <img src={detailsPayload.organizer?.avatar} alt="" className="w-12 h-12 rounded-xl object-cover border border-white shadow-sm bg-white" />
                <div>
                  <p className="font-black text-slate-800 text-sm">{detailsPayload.organizer?.name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    {detailsPayload.organizer?.businessName || detailsPayload.organizer?.tradeName || 'Independent Organizer'}
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
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Date</p>
                <p className="font-black text-slate-800 text-sm">{detailsPayload.date}</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                <p className="font-black text-slate-800 text-xl">{formatCurrency(detailsPayload.amount)}</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Platform Revenue</p>
                 <p className="font-black text-primary text-xl">{formatCurrency(detailsPayload.amount * 0.15)}</p>
              </div>
            </div>
          </div>
        )}
      </DetailsDialog>
    </div>
  );
};

export default BookingsPage;
