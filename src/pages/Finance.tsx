import React, { useState } from 'react';
import { PageHeader, StatCard, GlassCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { TRANSACTIONS, WITHDRAWAL_REQUESTS, REVENUE_REPORTS } from '../data/mockData';
import { formatCurrency, cn } from '../lib/utils';
import { 
  DollarSign, TrendingUp, CreditCard, 
  ArrowDownToLine, ShieldCheck,
  Globe, Wallet, History, BarChart3,
  CheckCircle2, XCircle, RotateCcw,
  ArrowUpRight, Activity, Download, Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';
import DetailsDialog from '../components/DetailsDialog';

const FinancePage = () => {
  const [activeTab, setActiveTab] = useState<'ledgers' | 'withdrawals' | 'reports'>('ledgers');
  type Transaction = typeof TRANSACTIONS[0];
  type Withdrawal = typeof WITHDRAWAL_REQUESTS[0];
  const [transactions, setTransactions] = useState<Transaction[]>(TRANSACTIONS as Transaction[]);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(WITHDRAWAL_REQUESTS as Withdrawal[]);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTitle, setDetailsTitle] = useState('');
  const [detailsPayload, setDetailsPayload] = useState<any>(null);

  const transactionColumns = [
    { 
      header: "Strategic ID", 
      accessor: (tx: any) => <span className="font-black text-slate-400 text-[10px] uppercase tracking-widest">TX-{tx.id}</span>
    },
    { 
      header: "Node Entities", 
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
      header: "Financial Flow", 
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
      header: "Partner Yield", 
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
    { header: "Sync Time", accessor: (tx: any) => <span className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">{tx.date}</span> },
  ];

  const withdrawalColumns = [
    { header: "Request ID", accessor: (wd: any) => <span className="font-black text-slate-400 text-[10px] uppercase tracking-widest">WD-{wd.id}</span> },
    { 
      header: "Pro Entity", 
      accessor: (wd: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center border border-primary/10 shadow-sm">
             <Wallet className="w-4 h-4 text-primary" />
          </div>
          <span className="font-black text-slate-800 text-xs tracking-tight">{wd.organizer}</span>
        </div>
      )
    },
    { 
      header: "Liquidity Volume", 
      accessor: (wd: any) => <span className="font-black text-slate-800 text-sm tracking-tighter">{formatCurrency(wd.amount)}</span> 
    },
    { header: "Gateway", accessor: (wd: any) => <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{wd.method}</span> },
    { 
      header: "Protocol Status", 
      accessor: (wd: any) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
          wd.status === 'Approved' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
        )}>
          {wd.status === 'Approved' ? <CheckCircle2 className="w-3 h-3" /> : <Activity className="w-3 h-3 animate-pulse" />}
          {wd.status}
        </div>
      )
    },
  ];

  return (
    <>
      <div className="space-y-10 animate-in fade-in duration-700">
      <PageHeader 
        title="Escrow & Finance" 
        description="Monitor global liquidity, platform commissions, and payout schedules with absolute precision."
      >
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white/40 backdrop-blur-md border border-white/60 text-slate-600 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all">
             <Download className="w-4 h-4" /> Export Ledger
          </button>
          <button className="flex items-center gap-2 primary-gradient text-white px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 transition-all">
            <ArrowDownToLine className="w-4 h-4" /> Initiate Batch
          </button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard title="Aggregate Volume" value={formatCurrency(145800)} change={22.5} icon={Globe} color="blue" trend="up" />
        <StatCard title="Platform Commission" value={formatCurrency(21870)} change={18.2} icon={DollarSign} color="primary" trend="up" />
        <StatCard title="Organizer Yield" value={formatCurrency(123930)} change={24.1} icon={Briefcase} color="emerald" trend="up" />
        <StatCard title="Pending Liquidity" value={formatCurrency(8450)} icon={CreditCard} color="orange" />
      </div>

      <PremiumTabs 
        tabs={[
          { id: 'ledgers', label: 'Transaction Stream' },
          { id: 'withdrawals', label: 'Withdrawal Registry' },
          { id: 'reports', label: 'Revenue Matrix' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'ledgers' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
           <DataTable 
             columns={transactionColumns} 
             data={transactions} 
             searchPlaceholder="Filter ledgers by actor ID, volume reference, or status..." 
             rowActions={[
               {
                 label: 'View Audit Log',
                 icon: History,
                 onClick: (tx: Transaction) => {
                   setDetailsTitle('Transaction Audit Log (mock)');
                   setDetailsPayload(tx);
                   setDetailsOpen(true);
                 },
               },
               {
                 label: 'Issue Refund',
                 icon: RotateCcw,
                 variant: 'danger',
                 onClick: (tx: Transaction) => setTransactions((prev) => prev.map((x) => (x.id === tx.id ? { ...x, status: 'Refunded' } : x))),
               },
               {
                 label: 'Verify Entity',
                 icon: ShieldCheck,
                 onClick: (tx: Transaction) => {
                   setDetailsTitle('Verify Entity (mock)');
                   setDetailsPayload(tx);
                   setDetailsOpen(true);
                 },
               },
             ]}
           />
        </div>
      )}

      {activeTab === 'withdrawals' && (
        <div className="animate-in slide-in-from-bottom-4 duration-500">
           <DataTable 
             columns={withdrawalColumns} 
             data={withdrawals} 
             searchPlaceholder="Audit requests by pro-entity name or gateway..." 
             rowActions={[
               {
                 label: 'Process Approve',
                 icon: CheckCircle2,
                 variant: 'success',
                 onClick: (wd: Withdrawal) => setWithdrawals((prev) => prev.map((x) => (x.id === wd.id ? { ...x, status: 'Approved' } : x))),
               },
               {
                 label: 'Decline Protocol',
                 icon: XCircle,
                 variant: 'danger',
                 onClick: (wd: Withdrawal) => setWithdrawals((prev) => prev.map((x) => (x.id === wd.id ? { ...x, status: 'Pending' } : x))),
               },
               {
                 label: 'Verify Bank Data',
                 icon: BarChart3,
                 onClick: (wd: Withdrawal) => {
                   setDetailsTitle('Withdrawal Verification (mock)');
                   setDetailsPayload(wd);
                   setDetailsOpen(true);
                 },
               },
             ]}
           />
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-in slide-in-from-bottom-4 duration-500">
           <GlassCard title="Daily Revenue Velocity" subtitle="Real-time commission propagation (Last 7 Days).">
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
                         <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-0.5">Yield: {formatCurrency(day.commission)}</p>
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

           <GlassCard title="Monthly Economic Synthesis" subtitle="Macro-level revenue and yield auditing.">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                 {REVENUE_REPORTS.monthly.map((month, i) => (
                   <div key={i} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 text-center hover:bg-white transition-all group cursor-default">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 group-hover:text-primary transition-colors">{month.name} Signal</p>
                      <p className="text-2xl font-black text-slate-800 tracking-tighter leading-none mb-1">{formatCurrency(month.revenue / 1000)}k</p>
                      <p className="text-[8px] font-black text-primary uppercase tracking-widest">Gross Deployment</p>
                      <div className="mt-4 pt-4 border-t border-slate-100">
                         <p className="text-sm font-black text-emerald-600 tracking-tighter">{formatCurrency(month.commission)}</p>
                         <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-0.5">Aggregated Yield</p>
                      </div>
                   </div>
                 ))}
              </div>
              <div className="mt-10 p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100 flex items-start gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-white border border-blue-100 flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                    <TrendingUp className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className="text-[11px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2">Growth Vector Audit</h4>
                    <p className="text-sm font-bold text-slate-600 leading-relaxed italic">"Aggregate marketplace velocity has increased by 18.5% compared to the previous fiscal quarter, with premium commission yield scaling at a 1.2x multiplier."</p>
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
      <pre className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-600 overflow-auto">
        {detailsPayload ? JSON.stringify(detailsPayload, null, 2) : ''}
      </pre>
    </DetailsDialog>
    </>
  );
};

export default FinancePage;
