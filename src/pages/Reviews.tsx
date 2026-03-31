import { useMemo, useState } from 'react';
import { PageHeader, GlassCard, StatCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { REVIEWS, RATING_TRENDS } from '../data/mockData';
import { cn } from '../lib/utils';
import { Star, Flag, Trash2, MessageSquare, ShieldAlert, CheckCircle2, TrendingUp, Filter, Eye } from 'lucide-react';
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
      header: "Rating", 
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
      header: "Service", 
      accessor: (r: any) => (
        <span className="font-bold text-slate-700 text-sm">{r.service || '—'}</span>
      )
    },
    { 
      header: "From & to", 
      accessor: (r: any) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
             <span className="text-[9px] font-black text-slate-300 uppercase">Home owner</span>
             <p className="font-black text-slate-800 text-sm tracking-tight leading-none">{r.homeOwner}</p>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-[9px] font-black text-slate-300 uppercase">Organizer</span>
             <p className="font-black text-primary text-[11px] tracking-tight leading-none">{r.organizer}</p>
          </div>
        </div>
      ) 
    },
    { 
      header: "Comment", 
      accessor: (r: any) => (
        <p className="max-w-[400px] font-bold text-slate-600 text-sm italic tracking-tight leading-snug">"{r.comment}"</p>
      )
    },
    { 
      header: "Verification", 
      accessor: () => (
        <div className="flex items-center px-4 py-1 bg-emerald-500 border border-emerald-500 rounded-lg text-white shadow-sm w-fit">
           <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
        </div>
      )
    },
    { 
      header: "Date", 
      accessor: (r: any) => <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.date}</span> 
    },
  ];

  return (
    <>
      <div className="space-y-12">
      <PageHeader 
        title="Reviews" 
        description="Review customer feedback. Flag issues, verify entries, or delete reviews."
      >
        <PremiumTabs 
          tabs={[
            { id: 'all', label: 'All reviews' },
            { id: 'flagged', label: 'Flagged' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </PageHeader>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
        <StatCard title="Avg Rating" value="4.9" icon={Star} color="primary" />
        <StatCard title="Total" value="1.2k" icon={MessageSquare} color="blue" />
        <StatCard title="Flagged" value="12" icon={Flag} color="secondary" />
        <StatCard title="Trust" value="98%" icon={ShieldAlert} color="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-10">
         <div className="w-full space-y-10">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  Reviews list
               </h3>
               <div className="flex items-center gap-4">
                  <button className="p-2.5 bg-white/40 border border-white/60 rounded-xl text-slate-400 hover:text-primary transition-all"><Filter className="w-4 h-4" /></button>
                  <button className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-primary transition-all">Export report</button>
               </div>
            </div>

            <DataTable 
              columns={columns} 
              data={
                activeTab === 'all'
                  ? reviews
                  : reviews.filter((r) => r.flagged)
              } 
              searchPlaceholder="Search by reviewer ID, keyword, or service..." 
              rowActions={[
                {
                  label: 'View',
                  icon: Eye,
                  onClick: (r: Review) => {
                    setDetailsTitle('Review details');
                    setDetailsPayload(r);
                    setDetailsOpen(true);
                  },
                },
                {
                  label: 'Flag',
                  icon: Flag,
                  variant: 'danger',
                  onClick: (r: Review) => {
                    setReviews((prev) => prev.map((x) => (x.id === r.id ? { ...x, flagged: true } : x)));
                  },
                },
                {
                  label: 'Delete',
                  icon: Trash2,
                  variant: 'danger',
                  onClick: (r: Review) => setDeleteTarget(r),
                },
                {
                  label: 'Mark verified',
                  icon: CheckCircle2,
                  onClick: (r: Review) =>
                    setReviews((prev) => prev.map((x) => (x.id === r.id ? { ...x, verified: true, flagged: false } : x))),
                },
              ]}
            />
         </div>
         
      
      </div>
    </div>

    {/* View Details dialog */}
    <DetailsDialog
      open={detailsOpen}
      title={detailsTitle}
      onClose={() => setDetailsOpen(false)}
    >
      <div className="mt-2 space-y-3">
        {detailsPayload && (
          <>
            {detailsPayload.service && (
              <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Review for</p>
                <p className="font-black text-slate-800">{detailsPayload.service}</p>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-black text-slate-800">{detailsPayload.rating}.0</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">out of 5</span>
            </div>
            <div className="text-sm font-bold text-slate-600">
              <span className="text-slate-400 uppercase tracking-widest text-[10px] font-black">Home owner:</span>{" "}
              <span className="text-slate-800">{detailsPayload.homeOwner}</span>
            </div>
            <div className="text-sm font-bold text-slate-600">
              <span className="text-slate-400 uppercase tracking-widest text-[10px] font-black">Organizer:</span>{" "}
              <span className="text-slate-800">{detailsPayload.organizer}</span>
            </div>
            <div className="text-sm font-bold text-slate-600">
              <span className="text-slate-400 uppercase tracking-widest text-[10px] font-black">Date:</span>{" "}
              <span className="text-slate-800">{detailsPayload.date}</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-xs font-bold text-slate-600">
                “{detailsPayload.comment}”
              </p>
            </div>
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => {
                  setReviews((prev) => 
                    prev.map((x) => 
                      x.id === detailsPayload.id 
                        ? { ...x, flagged: !x.flagged } 
                        : x
                    )
                  );
                  setDetailsPayload({ ...detailsPayload, flagged: !detailsPayload.flagged });
                }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  detailsPayload.flagged 
                    ? "bg-rose-50 text-rose-600 hover:bg-rose-100" 
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                )}
              >
                <Flag className={cn("w-4 h-4", detailsPayload.flagged ? "fill-rose-600" : "")} />
                {detailsPayload.flagged ? "Unflag review" : "Flag review"}
              </button>
            </div>
          </>
        )}
      </div>
    </DetailsDialog>

    {/* Delete confirmation dialog */}
    <ConfirmationDialog
      open={!!deleteTarget}
      title="Delete review"
      description={deleteTarget ? `Are you sure you want to delete this review? (${deleteTarget.id})` : undefined}
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
