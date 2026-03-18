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
import { motion } from 'framer-motion';
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
      header: "Transaction ID",
      accessor: (tx: any) => <span className="font-black text-slate-400 text-[10px] uppercase tracking-widest">TX-{tx.id}</span>
    },
    { 
      header: "Participants",
      accessor: (tx: any) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 rounded-md bg-emerald-50 text-[8px] flex items-center justify-center font-black text-emerald-600 border border-emerald-100">C</div>
             <span className="font-black text-slate-800 text-xs tracking-tight">{tx.user}</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 rounded-md bg-primary/5 text-[8px] flex items-center justify-center font-black text-primary border border-primary/10">O</div>
             <span className="font-bold text-slate-500 text-[11px] tracking-tight">{tx.organizer}</span>
          </div>
        </div>
      )
    },
    { 
      header: "Amount",
      accessor: (tx: any) => (
        <div className="flex flex-col">
           <span className="font-black text-slate-800 text-sm tracking-tighter">{formatCurrency(tx.amount)}</span>
           <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[9px] font-black text-primary uppercase tracking-tighter">Fee: {formatCurrency(tx.fee)}</span>
           </div>
        </div>
      )
    },
    { 
      header: "Earnings",
      accessor: (tx: any) => (
        <div className="flex flex-col">
           <span className="font-black text-emerald-600 text-sm tracking-tighter">{formatCurrency(tx.earnings)}</span>
           <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none">Net Payout</span>
        </div>
      )
    },
    { 
      header: "Status",
      accessor: (tx: any) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
          tx.status === 'Paid' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
          tx.status === 'Refunded' ? "bg-amber-50 text-amber-600 border-amber-100" :
          "bg-rose-50 text-rose-600 border-rose-100"
        )}>
          {tx.status}
        </div>
      )
    },
    { header: "Date", accessor: (tx: any) => <span className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{tx.date}</span> },
  ];

  return (
    <>
      <div className="space-y-10 animate-in fade-in duration-700">
      <PageHeader 
        title="Finance" 
        description="Track payments, fees, and payouts in one place."
      >
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/60 text-slate-600 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all">
             <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard title="Total Revenue" value={formatCurrency(0)} icon={DollarSign} color="primary" />
        <StatCard title="Transactions" value={0} icon={TrendingUp} color="blue" />
        <StatCard title="Boost Revenue" value={formatCurrency(0)} icon={Megaphone} color="emerald" />
        <StatCard title="Platform Fees" value={formatCurrency(0)} icon={CreditCard} color="orange" />

        <StatCard title="Premium Subscriptions" value={formatCurrency(0)} icon={Crown} color="primary" />
        <StatCard title="Standard Subscriptions" value={formatCurrency(0)} icon={Star} color="blue" />
        <StatCard title="Homepage Spotlight" value={formatCurrency(0)} icon={Sparkles} color="emerald" />
        <StatCard title="Highlighted Listing" value={formatCurrency(0)} icon={Zap} color="orange" />
      </div>

      <PremiumTabs 
        tabs={[
          { id: 'ledgers', label: 'Transactions' },
          { id: 'reports', label: 'Reports' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'ledgers' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
           <DataTable 
             columns={transactionColumns} 
             data={transactions} 
             searchPlaceholder="Search by user, amount, or status..." 
             rowActions={[
               {
                 label: 'View details',
                 icon: History,
                 onClick: (tx: Transaction) => {
                   setDetailsTitle('Transaction details (mock)');
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
               {
                 label: 'Verify',
                 icon: ShieldCheck,
                 onClick: (tx: Transaction) => {
                   setDetailsTitle('Verification details (mock)');
                   setDetailsPayload(tx);
                   setDetailsOpen(true);
                 },
               },
             ]}
           />
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-bottom-4 duration-500">
          <GlassCard title="Last 7 Days" subtitle="Commission and revenue overview.">
              <div className="mt-8 space-y-6">
                 {REVENUE_REPORTS.daily.map((day, i) => (
                   <div key={i} className="flex items-center gap-6 group">
                      <div className="w-10 text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-primary transition-colors">{day.name}</div>
                      <div className="flex-1 h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 flex shadow-inner">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${(day.revenue / 5000) * 100}%` }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full bg-slate-200 group-hover:bg-slate-300 transition-colors" />
                         <motion.div initial={{ width: 0 }} animate={{ width: `${(day.commission / 5000) * 100}%` }} transition={{ duration: 1, delay: i * 0.1 + 0.5 }} className="h-full primary-gradient shadow-[0_0_15px_rgba(0,0,0,0.1)]" />
                      </div>
                      <div className="w-24 text-right">
                         <p className="text-xs font-black text-slate-800 tracking-tighter">{formatCurrency(day.revenue)}</p>
                         <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">Earnings: {formatCurrency(day.commission)}</p>
                      </div>
                   </div>
                 ))}
                 <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-center px-2">
                    <div className="flex gap-4">
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 primary-gradient rounded-sm shadow-sm"></div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Commission</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-slate-200 rounded-sm"></div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gross Volume</span>
                       </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                 </div>
              </div>
           </GlassCard>

           <GlassCard title="Monthly Summary" subtitle="Revenue and earnings overview.">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                 {REVENUE_REPORTS.monthly.map((month, i) => (
                   <div key={i} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 text-center hover:bg-white transition-all group cursor-default">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 group-hover:text-primary transition-colors">{month.name} Total</p>
                      <p className="text-2xl font-black text-slate-800 tracking-tighter leading-none mb-1">{formatCurrency(month.revenue / 1000)}k</p>
                      <p className="text-[8px] font-black text-primary uppercase tracking-widest">Revenue</p>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                         <p className="text-sm font-black text-emerald-600 tracking-tighter">{formatCurrency(month.commission)}</p>
                         <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-0.5">Earnings</p>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="mt-10 p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 flex items-start gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                    <TrendingUp className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Growth summary</h4>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed italic">In this mock report, growth increased by 18.5% compared to the last period.</p>
                 </div>
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
