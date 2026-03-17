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

const BookingsPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredBookings = statusFilter === 'all' 
    ? BOOKINGS 
    : BOOKINGS.filter(b => b.status === statusFilter);

  const columns = [
    { 
      header: "Session Ref", 
      accessor: (b: any) => (
        <span className="font-black text-slate-400 text-[10px] tracking-widest">#{b.id}</span>
      )
    },
    { 
      header: "Engagement Partners", 
      accessor: (b: any) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 group/home-owner">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[10px] font-black text-emerald-600 shadow-sm group-hover/home-owner:bg-emerald-500 group-hover/home-owner:text-white transition-all">
               <User className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
               <span className="font-black text-slate-800 text-xs tracking-tight leading-none">{b.homeOwner.name}</span>
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Home Owner Entity</span>
            </div>
          </div>
          <div className="flex items-center gap-2 group/org">
            <div className="w-7 h-7 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-[10px] font-black text-primary shadow-sm group-hover/org:bg-primary group-hover/org:text-white transition-all">
               <Briefcase className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
               <span className="font-black text-slate-600 text-xs tracking-tight leading-none">{b.organizer.name}</span>
               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Pro Partner</span>
            </div>
          </div>
        </div>
      )
    },
    { 
      header: "Strategic Service", 
      accessor: (b: any) => (
        <div className="flex items-center gap-2">
           <Tag className="w-3.5 h-3.5 text-slate-300" />
           <span className="font-black text-slate-700 text-xs tracking-tight">{b.service}</span>
        </div>
      )
    },
    { 
      header: "Valuation", 
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
      header: "Timeline", 
      accessor: (b: any) => (
        <div className="flex flex-col">
          <span className="text-xs font-black text-slate-800 tracking-tighter">{b.date}</span>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Scheduled Slot</span>
        </div>
      )
    },
    { 
      header: "Flow Status", 
      accessor: (b: any) => (
        <div className={cn(
          "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border shadow-sm",
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
        title="Transaction Stream" 
        description="Monitor end-to-end booking life cycles. Track completion rates and session valuations."
      >
        <PremiumTabs 
          tabs={[
            { id: 'all', label: 'Every Session' },
            { id: 'Pending', label: 'Pending' },
            { id: 'Completed', label: 'Completed' },
            { id: 'Cancelled', label: 'Cancelled' },
          ]}
          activeTab={statusFilter}
          onChange={setStatusFilter}
        />
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard title="Active Protocols" value={String(BOOKINGS.filter(b => b.status === 'Pending').length)} icon={Activity} color="blue" />
        <StatCard title="Successful Syncs" value={String(BOOKINGS.filter(b => b.status === 'Completed').length)} icon={CheckCircle2} color="primary" />
        <StatCard title="Economic Flow" value={formatCurrency(BOOKINGS.reduce((acc, b) => acc + b.amount, 0))} icon={DollarSign} color="secondary" />
        <StatCard title="Calculated Yield" value={formatCurrency(BOOKINGS.reduce((acc, b) => acc + b.amount * 0.15, 0))} icon={Percent} color="emerald" />
      </div>

      <DataTable 
        columns={columns} 
        data={filteredBookings} 
        searchPlaceholder="Locate session by reference, partner, or home owner ID..." 
        rowActions={[
          { label: 'View Session Ledger', icon: Activity, onClick: () => {} },
          { label: 'Cancel Protocol', icon: XCircle, onClick: () => {}, variant: 'danger' },
          { label: 'Execute Refund', icon: RotateCcw, onClick: () => {}, variant: 'danger' },
        ]}
      />
    </div>
  );
};

export default BookingsPage;
