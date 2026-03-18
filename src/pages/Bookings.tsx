import { useState } from 'react';
import { PageHeader, StatCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { BOOKINGS } from '../data/mockData';
import { formatCurrency, cn } from '../lib/utils';
import { 
  CheckCircle2, Clock, 
  DollarSign, Activity, XCircle, RotateCcw,
  User, Briefcase, Tag, Percent
} from 'lucide-react';
import { motion } from 'framer-motion';
import DetailsDialog from '../components/DetailsDialog';

const BookingsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  type Booking = typeof BOOKINGS[0];
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS as Booking[]);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTitle, setDetailsTitle] = useState('');
  const [detailsPayload, setDetailsPayload] = useState<any>(null);

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === statusFilter);

  const columns = [
    { 
      header: "Booking ID", 
      accessor: (b: any) => (
        <span className="font-black text-slate-400 text-[10px] tracking-widest">#{b.id}</span>
      )
    },
    { 
      header: "Home owner & organizer", 
      accessor: (b: any) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 group/home-owner">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[10px] font-black text-emerald-600 shadow-sm group-hover/home-owner:bg-emerald-500 group-hover/home-owner:text-white transition-all">
               <User className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
               <span className="font-black text-slate-800 text-xs tracking-tight leading-none">{b.homeOwner.name}</span>
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Home owner</span>
            </div>
          </div>
          <div className="flex items-center gap-2 group/org">
            <div className="w-7 h-7 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-[10px] font-black text-primary shadow-sm group-hover/org:bg-primary group-hover/org:text-white transition-all">
               <Briefcase className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
               <span className="font-black text-slate-600 text-xs tracking-tight leading-none">{b.organizer.name}</span>
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Organizer</span>
            </div>
          </div>
        </div>
      )
    },
    { 
      header: "Service", 
      accessor: (b: any) => (
        <div className="flex items-center gap-2">
           <Tag className="w-3.5 h-3.5 text-slate-300" />
           <span className="font-black text-slate-700 text-xs tracking-tight">{b.service}</span>
        </div>
      )
    },
    { 
      header: "Amount", 
      accessor: (b: any) => (
        <div className="flex flex-col">
           <span className="font-black text-slate-800 text-sm tracking-tighter">{formatCurrency(b.amount)}</span>
           <div className="flex items-center gap-1.5 mt-1">
              <Percent className="w-3 h-3 text-emerald-500" />
              <span className="text-[10px] font-black text-emerald-600 tracking-tighter">
                {formatCurrency(b.amount * 0.15)} <span className="text-[8px] text-slate-400 font-bold uppercase ml-0.5">Fee</span>
              </span>
           </div>
        </div>
      )
    },
    { 
      header: "Date", 
      accessor: (b: any) => (
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-800 tracking-tighter">{b.date}</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Scheduled</span>
        </div>
      )
    },
    { 
      header: "Status", 
      accessor: (b: any) => (
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
          b.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
          b.status === 'Pending' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-rose-50 text-rose-600 border-rose-100"
        )}>
          <div className={cn(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            b.status === 'Completed' ? "bg-emerald-500" :
            b.status === 'Pending' ? "bg-amber-500" : "bg-rose-500"
          )}></div>
          {b.status}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <PageHeader 
        title="Bookings" 
        description="View booking requests and their status. Check who booked and for what service."
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard title="Pending bookings" value={String(bookings.filter(b => b.status === 'Pending').length)} icon={Activity} color="blue" />
        <StatCard title="Completed bookings" value={String(bookings.filter(b => b.status === 'Completed').length)} icon={CheckCircle2} color="primary" />
        <StatCard title="Total booking amount" value={formatCurrency(bookings.reduce((acc, b) => acc + b.amount, 0))} icon={DollarSign} color="secondary" />
        <StatCard title="Total fees (15%)" value={formatCurrency(bookings.reduce((acc, b) => acc + b.amount * 0.15, 0))} icon={Percent} color="emerald" />
      </div>

      <DataTable 
        columns={columns} 
        data={filteredBookings} 
        searchPlaceholder="Search by booking ID, home owner, or organizer..." 
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
          {
            label: 'Mark cancelled',
            icon: RotateCcw,
            variant: 'danger',
            onClick: (b: Booking) =>
              setBookings((prev) =>
                prev.map((x) =>
                  x.id === b.id
                    ? { ...x, status: 'Cancelled' }
                    : x,
                ),
              ),
          },
        ]}
      />

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
                  "font-black",
                  detailsPayload.status === 'Completed' ? "text-emerald-600" :
                  detailsPayload.status === 'Pending' ? "text-amber-600" : "text-rose-600"
                )}>{detailsPayload.status}</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Home owner</p>
              <div className="flex items-center gap-3">
                <img src={detailsPayload.homeOwner?.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-white shadow-sm" />
                <div>
                  <p className="font-black text-slate-800">{detailsPayload.homeOwner?.name}</p>
                  <p className="text-xs font-bold text-slate-500">{detailsPayload.homeOwner?.email}</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Organizer</p>
              <div className="flex items-center gap-3">
                <img src={detailsPayload.organizer?.avatar} alt="" className="w-10 h-10 rounded-xl object-cover border border-white shadow-sm" />
                <div>
                  <p className="font-black text-slate-800">{detailsPayload.organizer?.name}</p>
                  <p className="text-xs font-bold text-slate-500">{detailsPayload.organizer?.email}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service</p>
                <p className="font-black text-slate-800">{detailsPayload.service}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                <p className="font-black text-slate-800">{detailsPayload.date}</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Amount & fee</p>
              <p className="font-black text-slate-800 text-lg">{formatCurrency(detailsPayload.amount)}</p>
              <p className="text-xs font-bold text-slate-500 mt-1">Platform fee (15%): {formatCurrency(detailsPayload.amount * 0.15)}</p>
            </div>
          </div>
        )}
      </DetailsDialog>
    </div>
  );
};

export default BookingsPage;
