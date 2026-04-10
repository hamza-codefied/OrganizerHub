import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { PageHeader, GlassCard } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { formatCurrency, cn } from '../lib/utils';
import { useAdminPromotions } from '../hooks/useAdminPromotions';
import { useAdminPromotionsBought } from '../hooks/useAdminPromotionsBought';
import type { PromotionBoughtRow } from '../lib/adminPromotionsApi';
import type { LucideIcon } from 'lucide-react';
import {
  Flame,
  Zap,
  CheckCircle2,
  Eye,
  Home,
  Loader2,
  RefreshCw,
} from 'lucide-react';

const ICON_BY_CODE: Record<string, LucideIcon> = {
  featured_post: Flame,
  boosted_organization: Home,
};

const CARD_ACCENT: Record<string, { color: string; bg: string }> = {
  featured_post: { color: 'text-rose-500', bg: 'bg-rose-50' },
  boosted_organization: { color: 'text-amber-500', bg: 'bg-amber-50' },
};

function formatPurchasedAt(iso: string) {
  try {
    return format(parseISO(iso), 'MMM d, yyyy · h:mm a');
  } catch {
    return iso;
  }
}

function boostBadgeClass(name: string) {
  const n = name.toLowerCase();
  if (n.includes('home') || n.includes('spotlight')) {
    return 'bg-amber-500 border-amber-500 text-white';
  }
  if (n.includes('highlight') || n.includes('listing')) {
    return 'bg-blue-600 border-blue-600 text-white';
  }
  return 'bg-slate-600 border-slate-600 text-white';
}

type PromotionsBoughtTableRow = PromotionBoughtRow & { id: string };

function toBoughtRows(rows: PromotionBoughtRow[]): PromotionsBoughtTableRow[] {
  return rows.map((r) => ({
    ...r,
    id: `${r.organizer_id ?? r.organization_id}|${r.purchased_at}`,
  }));
}

const PromotionsPage = () => {
  const navigate = useNavigate();

  const [activeSearch, setActiveSearch] = useState('');
  const { data: promotionsData, error: promotionsError, isLoading: promotionsLoading, refetch: refetchPromotions } =
    useAdminPromotions();
  const {
    data: boughtData,
    error: boughtError,
    isLoading: boughtLoading,
    refetch: refetchBought,
  } = useAdminPromotionsBought(activeSearch);

  const boughtRows = useMemo(() => toBoughtRows(boughtData?.promotions_bought ?? []), [boughtData?.promotions_bought]);

  const promotionsList = promotionsData?.promotions ?? [];

  const activePromotionsColumns = [
    {
      header: 'Organization',
      accessor: (row: PromotionsBoughtTableRow) => (
        <div className="flex flex-col min-w-0 py-1">
          <span className="font-black text-slate-800 text-[11px] sm:text-xs tracking-tight truncate">{row.organization_name}</span>
          {row.organization_full_name ? (
            <span className="text-[10px] font-medium text-slate-500 truncate">{row.organization_full_name}</span>
          ) : null}
        </div>
      ),
    },
    {
      header: 'Boost',
      className: 'hidden sm:table-cell',
      accessor: (row: PromotionsBoughtTableRow) => (
        <span
          className={cn(
            'px-4 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border shadow-sm inline-flex',
            boostBadgeClass(row.boost_name),
          )}
        >
          {row.boost_name}
        </span>
      ),
    },
    {
      header: 'Price',
      accessor: (row: PromotionsBoughtTableRow) => (
        <span className="font-black text-slate-800 text-[10px] sm:text-xs tracking-tighter">{formatCurrency(row.boost_price)}</span>
      ),
    },
    {
      header: 'Purchased',
      className: 'hidden md:table-cell',
      accessor: (row: PromotionsBoughtTableRow) => (
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{formatPurchasedAt(row.purchased_at)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-12">
      <PageHeader title="Promotions" description="Spotlight options" />

      <div className="space-y-8 sm:space-y-12">
          {promotionsError && (
            <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-sm flex flex-wrap items-center gap-3">
              <span className="flex-1">{promotionsError}</span>
              <button
                type="button"
                onClick={() => refetchPromotions()}
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-900 underline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          )}

          {promotionsLoading && !promotionsData ? (
            <div className="h-48 flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <p className="text-sm font-semibold text-slate-500">Loading promotions…</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
              {promotionsList.length === 0 ? (
                <div className="col-span-full text-center py-12 text-slate-500 text-sm">No promotion offers configured.</div>
              ) : (
                promotionsList.map((pkg) => {
                  const Icon = ICON_BY_CODE[pkg.code] ?? Zap;
                  const accent = CARD_ACCENT[pkg.code] ?? { color: 'text-primary', bg: 'bg-primary/5' };
                  return (
                    <GlassCard key={pkg.id} className="text-center p-6 sm:p-8 border-slate-200 relative">
                      {!pkg.is_active && (
                        <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg">
                          Inactive
                        </span>
                      )}
                      <div
                        className={cn(
                          'w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl mx-auto flex items-center justify-center mb-6 sm:mb-8 border-2 border-white shadow-xl transition-all duration-500',
                          accent.bg,
                          accent.color,
                        )}
                      >
                        <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-800 tracking-tighter mb-2">{pkg.name}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium mb-4 px-2 leading-relaxed">{pkg.description}</p>
                      <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                        {pkg.duration_days} day{pkg.duration_days === 1 ? '' : 's'} · {pkg.currency}
                      </p>
                      <div className="flex items-baseline justify-center gap-1 flex-wrap">
                        <span className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tighter">
                          {formatCurrency(pkg.weekly_price)}
                        </span>
                        <span className="text-slate-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest">/ week</span>
                      </div>
                      {pkg.is_active && (
                        <div className="mt-4 flex items-center justify-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                          <CheckCircle2 className="w-4 h-4" />
                          Active
                        </div>
                      )}
                    </GlassCard>
                  );
                })
              )}
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 px-2">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Active promotions
            </h3>

            {boughtError && (
              <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-sm flex flex-wrap items-center gap-3">
                <span className="flex-1">{boughtError}</span>
                <button
                  type="button"
                  onClick={() => refetchBought()}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-900 underline"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry
                </button>
              </div>
            )}

            <div className="overflow-hidden">
              {boughtLoading && !boughtData ? (
                <div className="h-40 flex flex-col items-center justify-center gap-3 rounded-lg border border-slate-200 bg-white">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-sm font-semibold text-slate-500">Loading active promotions…</p>
                </div>
              ) : (
                <DataTable
                  columns={activePromotionsColumns}
                  data={boughtRows}
                  searchPlaceholder="Search organizations…"
                  serverSideSearch
                  onSearch={setActiveSearch}
                  rowActions={[
                    {
                      label: 'Profile',
                      icon: Eye,
                      onClick: (row: PromotionsBoughtTableRow) => {
                        const id = row.organizer_id ?? row.organization_id;
                        navigate(`/users/organizers/${id}`);
                      },
                    },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
    </div>
  );
};

export default PromotionsPage;
