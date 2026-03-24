import React, { useState } from 'react';
import { PageHeader, StatCard, GlassCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { TRANSACTIONS, REVENUE_REPORTS } from '../data/mockData';
import { formatCurrency, cn } from '../lib/utils';
import { 
  DollarSign, TrendingUp, CreditCard, Crown, Star,
  Sparkles, Zap, Megaphone,
  ShieldCheck,
  Globe, History, BarChart3,
  CheckCircle2, XCircle, RotateCcw,
  ArrowUpRight, Activity, Download, Briefcase
} from 'lucide-react';
import DetailsDialog from '../components/DetailsDialog';

const FinancePage = () => {
  const [activeTab, setActiveTab] = useState<'ledgers' | 'reports'>('ledgers');
  type Transaction = typeof TRANSACTIONS[0];
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS as Transaction[]);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTitle, setDetailsTitle] = useState('');
  const [detailsPayload, setDetailsPayload] = useState<any>(null);

  const transactionColumns = [
    { 
      header: "ID",
      className: "hidden sm:table-cell",
      accessor: (tx: any) => <span className="font-black text-slate-400 text-[10px] uppercase tracking-widest">#{tx.id}</span>
    },
    { 
      header: "Involved",
      accessor: (tx: any) => (
        <div className="flex flex-col gap-1 py-1">
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 rounded-md bg-emerald-50 text-[8px] flex items-center justify-center font-black text-emerald-600 border border-emerald-100 shrink-0">C</div>
             <span className="font-black text-slate-800 text-[10px] sm:text-xs tracking-tight truncate max-w-[80px] xs:max-w-none">{tx.user}</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 rounded-md bg-primary/5 text-[8px] flex items-center justify-center font-black text-primary border border-primary/10 shrink-0">O</div>
             <span className="font-bold text-slate-500 text-[9px] sm:text-[11px] tracking-tight truncate max-w-[80px] xs:max-w-none">{tx.organizer}</span>
          </div>
        </div>
      )
    },
    { 
      header: "Amount",
      accessor: (tx: any) => (
        <div className="flex flex-col">
           <span className="font-black text-slate-800 text-xs sm:text-sm tracking-tighter">{formatCurrency(tx.amount)}</span>
           <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[8px] sm:text-[9px] font-black text-primary uppercase tracking-tighter">Fee: {formatCurrency(tx.fee)}</span>
           </div>
        </div>
      )
    },
    { 
      header: "Earnings",
      className: "hidden xs:table-cell",
      accessor: (tx: any) => (
        <div className="flex flex-col">
           <span className="font-black text-emerald-600 text-xs sm:text-sm tracking-tighter">{formatCurrency(tx.earnings)}</span>
           <span className="text-[7px] sm:text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">Net</span>
        </div>
      )
    },
    { 
      header: "Status",
      accessor: (tx: any) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-widest border shadow-sm",
          tx.status === 'Paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
          tx.status === 'Refunded' ? "bg-amber-50 text-amber-600 border-amber-100" :
          "bg-rose-50 text-rose-600 border-rose-100"
        )}>
          {tx.status}
        </div>
      )
    },
    { 
      header: "Date", 
      className: "hidden md:table-cell",
      accessor: (tx: any) => <span className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{tx.date}</span> 
    },
  ];

  return (
    <>
      <div className="space-y-6 sm:space-y-10">
      <PageHeader 
        title="Finance" 
        description="Monitor revenue and payouts."
      >
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/60 text-slate-600 px-4 sm:px-6 py-2 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all">
             <Download className="w-4 h-4" /> <span className="hidden xs:inline">Export</span>
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Revenue" value={formatCurrency(124500)} icon={DollarSign} color="primary" />
        <StatCard title="Transactions" value="1,842" icon={TrendingUp} color="blue" />
        <StatCard title="Boost Revenue" value={formatCurrency(4200)} icon={Megaphone} color="emerald" />
        <StatCard title="Sub Revenue" value={formatCurrency(18500)} icon={Crown} color="orange" />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <PremiumTabs 
          tabs={[
            { id: 'ledgers', label: 'Transactions' },
            { id: 'reports', label: 'Reports' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {activeTab === 'ledgers' && (
        <div className="overflow-hidden">
           <DataTable 
             columns={transactionColumns} 
             data={transactions} 
             searchPlaceholder="Search transactions..." 
             rowActions={[
               {
                 label: 'Details',
                 icon: History,
                 onClick: (tx: Transaction) => {
                   setDetailsTitle('Transaction details');
                   setDetailsPayload(tx);
                   setDetailsOpen(true);
                 },
               },
               {
                 label: 'Refund',
                 icon: RotateCcw,
                 variant: 'danger',
                 onClick: (tx: Transaction) => setTransactions((prev) => prev.map((x) => (x.id === tx.id ? { ...x, status: 'Refunded' } : x))),
               },
             ]}
           />
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
          <GlassCard title="Last 7 Days" subtitle="Revenue overview">
              <div className="mt-6 sm:mt-8 space-y-4 sm:space-y-6">
                 {REVENUE_REPORTS.daily.map((day, i) => (
                   <div key={i} className="flex items-center gap-3 sm:gap-6 group">
                      <div className="w-8 sm:w-10 text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">{day.name.slice(0, 3)}</div>
                      <div className="flex-1 h-2 sm:h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 flex">
                         <div style={{ width: `${(day.revenue / 5000) * 100}%` }} className="h-full bg-slate-200" />
                         <div style={{ width: `${(day.commission / 5000) * 100}%` }} className="h-full bg-primary" />
                      </div>
                      <div className="w-20 sm:w-24 text-right">
                         <p className="text-[10px] sm:text-xs font-black text-slate-800 tracking-tighter">{formatCurrency(day.revenue)}</p>
                      </div>
                   </div>
                 ))}
                 <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
                    <div className="flex gap-3 sm:gap-4">
                       <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 primary-gradient rounded-sm"></div>
                          <span className="text-[8px] sm:text-[9px] font-black text-slate-400 uppercase tracking-widest text-[7px] sm:text-[9px]">Commission</span>
                       </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                 </div>
              </div>
           </GlassCard>

           <GlassCard title="Monthly Summary" subtitle="Revenue overview">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
                 {REVENUE_REPORTS.monthly.map((month, i) => (
                   <div key={i} className="p-4 sm:p-6 bg-slate-50/50 rounded-2xl sm:rounded-3xl border border-slate-100 text-center hover:bg-white transition-all group">
                      <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">{month.name}</p>
                      <p className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter leading-none mb-1">{formatCurrency(month.revenue / 1000)}k</p>
                      <div className="mt-3 pt-3 border-t border-slate-100">
                         <p className="text-xs sm:text-sm font-black text-emerald-600 tracking-tighter">{formatCurrency(month.commission)}</p>
                         <p className="text-[7px] sm:text-[8px] font-black text-slate-300 uppercase tracking-widest mt-0.5">Earnings</p>
                      </div>
                   </div>
                 ))}
              </div>
           </GlassCard>
        </div>
      )}
    </div>

    <DetailsDialog
      open={detailsOpen}
      title={detailsTitle}
      onClose={() => setDetailsOpen(false)}
    >
      {detailsPayload && (
        <div className="space-y-4">
          {detailsPayload.pendingWithdrawalsApproved !== undefined ? (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="font-bold text-slate-800">
                {detailsPayload.pendingWithdrawalsApproved} pending withdrawal(s) approved. Status set to {detailsPayload.updatedStatus}.
              </p>
              {detailsPayload.note && <p className="text-sm text-slate-500 mt-2">{detailsPayload.note}</p>}
            </div>
          ) : typeof detailsPayload.id === 'string' && detailsPayload.id.startsWith('wd-') ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Withdrawal ID</p>
                <p className="font-black text-slate-800">{detailsPayload.id}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Organizer</p>
                  <p className="font-bold text-slate-800">{detailsPayload.organizer}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                  <p className="font-black text-slate-800">{formatCurrency(detailsPayload.amount)}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Method</p>
                  <p className="font-bold text-slate-800">{detailsPayload.method}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="font-bold text-slate-800">{detailsPayload.status}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                  <p className="font-bold text-slate-800">{detailsPayload.date}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transaction ID</p>
                <p className="font-black text-slate-800">TX-{detailsPayload.id}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">User</p>
                  <p className="font-bold text-slate-800">{detailsPayload.user}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Organizer</p>
                  <p className="font-bold text-slate-800">{detailsPayload.organizer}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</p>
                  <p className="font-black text-slate-800">{formatCurrency(detailsPayload.amount)}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fee</p>
                  <p className="font-bold text-slate-800">{formatCurrency(Number(detailsPayload.fee))}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Earnings</p>
                  <p className="font-black text-emerald-600">{formatCurrency(Number(detailsPayload.earnings))}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="font-bold text-slate-800">{detailsPayload.status}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                <p className="font-bold text-slate-800">{detailsPayload.date}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </DetailsDialog>
    </>
  );
};

export default FinancePage;
