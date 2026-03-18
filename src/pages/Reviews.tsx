import { useMemo, useState } from 'react';
import { PageHeader, GlassCard, StatCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { REVIEWS, RATING_TRENDS } from '../data/mockData';
import { cn } from '../lib/utils';
import { Star, Flag, Trash2, MessageSquare, ShieldAlert, CheckCircle2, TrendingUp, Filter, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import ConfirmationDialog from '../components/ConfirmationDialog';
import DetailsDialog from '../components/DetailsDialog';

const ReviewsPage = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'flagged'>('all');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTitle, setDetailsTitle] = useState('');
  const [detailsPayload, setDetailsPayload] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  type Review = typeof REVIEWS[0] & { flagged?: boolean; verified?: boolean };
  const [reviews, setReviews] = useState<Review[]>(
    () =>
      REVIEWS.map((r, i) => ({
        ...r,
        flagged: i < 2,
        verified: true,
      })) as Review[],
  );

  const columns = [
    { 
      header: "Strategic Rating", 
      accessor: (r: any) => (
        <div className="flex items-center gap-1">
           {Array.from({ length: 5 }).map((_, i) => (
             <Star key={i} className={cn("w-4 h-4", i < r.rating ? "fill-amber-400 text-amber-400" : "text-slate-200")} />
           ))}
           <span className="ml-2 font-black text-slate-800 text-xs">{r.rating}.0</span>
        </div>
      )
    },
    { 
      header: "Engagement Partners", 
      accessor: (r: any) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
             <span className="text-[9px] font-black text-slate-300 uppercase">From</span>
             <p className="font-black text-slate-800 text-sm tracking-tight leading-none">{r.homeOwner}</p>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[9px] font-black text-slate-300 uppercase">To</span>
             <p className="font-black text-primary text-[11px] tracking-tight leading-none">{r.organizer}</p>
          </div>
        </div>
      ) 
    },
    { 
      header: "Core Narrative", 
      accessor: (r: any) => (
        <p className="max-w-[400px] font-bold text-slate-600 text-sm italic tracking-tight leading-snug">"{r.comment}"</p>
      )
    },
    { 
      header: "Status", 
      accessor: () => (
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50/50 border border-emerald-100 rounded-full w-fit">
           <CheckCircle2 className="w-3 h-3 text-emerald-500" />
           <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Verified Hub</span>
        </div>
      )
    },
    { 
      header: "Sync Event", 
      accessor: (r: any) => <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.date}</span> 
    },
  ];

  return (
    <>
      <div className="space-y-12 animate-in fade-in duration-700">
      <PageHeader 
        title="Reputation Command" 
        description="Monitor marketplace quality signals, moderate user feedback, and maintain global service standards."
      >
        <PremiumTabs 
          tabs={[
            { id: 'all', label: 'Global Registry' },
            { id: 'flagged', label: 'Flagged Items' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard title="Mean Rating" value="4.9" change={2.1} icon={Star} color="primary" trend="up" />
        <StatCard title="Total Narratives" value="1,240" change={14} icon={MessageSquare} color="blue" trend="up" />
        <StatCard title="Critical Flags" value="12" change={5} icon={Flag} color="secondary" trend="down" />
        <StatCard title="Health Index" value="98%" icon={ShieldAlert} color="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-10">
         <div className="w-full space-y-10">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  Reputation Registry
               </h3>
               <div className="flex items-center gap-4">
                  <button className="p-2.5 bg-white/40 border border-white/60 rounded-xl text-slate-400 hover:text-primary transition-all"><Filter className="w-4 h-4" /></button>
                  <button className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-primary transition-all">Export Analysis</button>
               </div>
            </div>

            <DataTable 
              columns={columns} 
              data={
                activeTab === 'all'
                  ? reviews
                  : reviews.filter((r) => r.flagged)
              } 
              searchPlaceholder="Audit narratives by actor ID or keywords..." 
              rowActions={[
                {
                  label: 'View Context',
                  icon: Eye,
                  onClick: (r: Review) => {
                    setDetailsTitle('Review Context (mock)');
                    setDetailsPayload(r);
                    setDetailsOpen(true);
                  },
                },
                {
                  label: 'Flag Abuse',
                  icon: Flag,
                  variant: 'danger',
                  onClick: (r: Review) => {
                    setReviews((prev) => prev.map((x) => (x.id === r.id ? { ...x, flagged: true } : x)));
                  },
                },
                {
                  label: 'Delete Lifecycle',
                  icon: Trash2,
                  variant: 'danger',
                  onClick: (r: Review) => setDeleteTarget(r),
                },
                {
                  label: 'Verified Status',
                  icon: CheckCircle2,
                  onClick: (r: Review) =>
                    setReviews((prev) => prev.map((x) => (x.id === r.id ? { ...x, verified: true, flagged: false } : x))),
                },
              ]}
            />
         </div>
         
         <div className="w-full max-w-2xl mx-auto">
           <GlassCard title="Rating Evolution" subtitle="Macro-level sentiment trajectory.">
              <div className="mt-8 space-y-6">
                 {RATING_TRENDS.map((t, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                         <span className="text-slate-400">{t.month} Pulse</span>
                         <span className="text-slate-800">{t.rating} / 5.0</span>
                      </div>
                      <div className="h-2 w-full bg-slate-50 rounded-full border border-white overflow-hidden shadow-inner">
                         <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: `${(t.rating / 5) * 100}%` }} 
                           transition={{ duration: 1, delay: i * 0.1 }}
                           className={cn("h-full rounded-full primary-gradient", t.rating < 4.5 ? "opacity-60" : "opacity-100")} 
                         />
                      </div>
                   </div>
                 ))}
                 <div className="mt-8 p-6 bg-primary/5 rounded-3xl border border-primary/10">
                    <div className="flex items-center gap-3 mb-2">
                       <TrendingUp className="w-4 h-4 text-primary" />
                       <p className="text-[10px] font-black text-primary uppercase tracking-widest">Growth Vector</p>
                    </div>
                    <p className="text-xs font-bold text-slate-600 leading-snug italic">"Aggregated sentiment has scaled by 16% this quarter following the pro-tier verification deployment."</p>
                 </div>
              </div>
           </GlassCard>
         </div>
      </div>
    </div>

    {/* View Details dialog */}
    <DetailsDialog
      open={detailsOpen}
      title={detailsTitle}
      onClose={() => setDetailsOpen(false)}
    >
      <div className="mt-2">
        <pre className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-600 overflow-auto">
          {detailsPayload ? JSON.stringify(detailsPayload, null, 2) : ''}
        </pre>
      </div>
    </DetailsDialog>

    {/* Delete confirmation dialog */}
    <ConfirmationDialog
      open={!!deleteTarget}
      title="Delete Lifecycle"
      description={deleteTarget ? `Are you sure you want to delete this review lifecycle? (${deleteTarget.id})` : undefined}
      confirmText="Delete"
      cancelText="Cancel"
      danger
      onCancel={() => setDeleteTarget(null)}
      onConfirm={() => {
        if (!deleteTarget) return;
        setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
        setDeleteTarget(null);
      }}
    />
    </>
  );
};

export default ReviewsPage;
