import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { GlassCard, PremiumTabs } from '../components/UI';
import ConfirmationDialog from '../components/ConfirmationDialog';
import SuspendHomeOwnerDialog from '../components/SuspendHomeOwnerDialog';
import { cn } from '../lib/utils';
import { useAdminHomeOwnerDetails } from '../hooks/useAdminHomeOwnerDetails';
import { adminSuspendHomeOwner } from '../lib/adminHomeOwnersApi';
import {
  BadgeCheck,
  Ban,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Heart,
  ShoppingBag,
  ChevronLeft,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

function formatJoinedDate(iso: string) {
  try {
    return format(parseISO(iso), 'MMM d, yyyy');
  } catch {
    return iso;
  }
}

function bookingTitle(booking: Record<string, unknown>, index: number) {
  const title =
    (typeof booking.service === 'string' && booking.service) ||
    (typeof booking.service_name === 'string' && booking.service_name) ||
    (typeof booking.title === 'string' && booking.title);
  return title || `Booking ${index + 1}`;
}

const HomeOwnerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading, refetch } = useAdminHomeOwnerDetails(id);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'favorites'>('overview');
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [restoreOpen, setRestoreOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [suspendDialogError, setSuspendDialogError] = useState<string | null>(null);

  const homeOwner = data?.home_owner;
  const bookings = data?.bookings ?? [];

  if (isLoading && !homeOwner) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="font-semibold text-slate-600">Loading profile…</p>
      </div>
    );
  }

  if (error && !homeOwner) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4 max-w-md mx-auto text-center px-4">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 border border-rose-100 font-black text-2xl">!</div>
        <p className="font-black text-slate-600">{error}</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
          <button
            type="button"
            onClick={() => navigate('/users/home-owners')}
            className="text-primary font-black text-xs uppercase tracking-widest hover:underline"
          >
            Back to home owners
          </button>
        </div>
      </div>
    );
  }

  if (!homeOwner) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center text-rose-500 border border-rose-100 italic font-black text-4xl">!</div>
        <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Home owner not found</p>
        <button
          type="button"
          onClick={() => navigate('/users/home-owners')}
          className="text-primary font-black text-xs uppercase tracking-widest hover:underline"
        >
          Back to home owners
        </button>
      </div>
    );
  }

  const accountActive = homeOwner.status === true;
  const phoneDisplay = [homeOwner.country_code?.trim(), homeOwner.phone_number?.trim()].filter(Boolean).join(' ');

  const handleSuspendConfirm = async (message: string) => {
    setSuspendDialogError(null);
    setActionLoading(true);
    try {
      await adminSuspendHomeOwner({
        home_owner_id: homeOwner.home_owner_id,
        suspend: true,
        message,
      });
      setSuspendOpen(false);
      await refetch();
    } catch (e) {
      setSuspendDialogError(e instanceof Error ? e.message : 'Could not suspend home owner.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestoreConfirm = async () => {
    setActionLoading(true);
    try {
      await adminSuspendHomeOwner({
        home_owner_id: homeOwner.home_owner_id,
        suspend: false,
      });
      setRestoreOpen(false);
      await refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not restore home owner.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 mb-2">
        <button
          type="button"
          onClick={() => navigate('/users/home-owners')}
          className="p-2 hover:bg-white/60 rounded-xl transition-all text-slate-400 hover:text-primary group"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Home owner</p>
          <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Profile #{homeOwner.home_owner_id}</h2>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 text-sm flex flex-wrap items-center gap-3">
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => refetch()}
            className="text-xs font-black uppercase tracking-widest text-amber-900 underline"
          >
            Refresh
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1 space-y-8">
          <GlassCard className="p-0 overflow-hidden">
            <div className="h-32 primary-gradient opacity-10 blur-3xl -mb-16"></div>
            <div className="p-8 pt-0 flex flex-col items-center text-center">
              <h1 className="text-3xl font-black text-slate-800 tracking-tighter">{homeOwner.name}</h1>
              <p className="text-sm font-bold text-slate-400 mt-2 uppercase tracking-widest">Home owner</p>

              <div
                className={cn(
                  'mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] border shadow-sm',
                  accountActive
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                    : 'bg-amber-50 text-amber-600 border-amber-100',
                )}
              >
                {accountActive ? <BadgeCheck className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                {accountActive ? 'Active account' : 'Inactive account'}
              </div>

              <div className="w-full space-y-4 mt-10 text-left pt-8 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">First name</p>
                    <p className="text-sm font-bold text-slate-800">{homeOwner.first_name}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Last name</p>
                    <p className="text-sm font-bold text-slate-800">{homeOwner.last_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Email</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{homeOwner.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Phone</p>
                    <p className="text-sm font-bold text-slate-800">{phoneDisplay || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                    <p className="text-sm font-bold text-slate-800">{homeOwner.location ?? '—'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DOB</p>
                    <p className="text-sm font-bold text-slate-800">{homeOwner.date_of_birth}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gender</p>
                    <p className="text-sm font-bold text-slate-800">{homeOwner.gender}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Member since</p>
                  <p className="text-sm font-bold text-slate-800">{formatJoinedDate(homeOwner.created_at)}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard title="Account security" subtitle="Suspend or restore access.">
            <div className="space-y-4 mt-6">
              {accountActive ? (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => {
                    setSuspendDialogError(null);
                    setSuspendOpen(true);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-amber-50/50 hover:bg-amber-50 rounded-2xl border border-amber-100 transition-all group disabled:opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-black text-amber-600 uppercase tracking-widest">Suspend access</span>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={() => setRestoreOpen(true)}
                  className="w-full flex items-center justify-between p-4 primary-gradient rounded-2xl text-white transition-all group shadow-lg shadow-primary/20 disabled:opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-widest">Restore access</span>
                  </div>
                </button>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <PremiumTabs
            tabs={[
              { id: 'overview', label: 'Overview' },
              { id: 'bookings', label: 'Bookings' },
              { id: 'favorites', label: 'Favorites' },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          <div className="space-y-8">
            {activeTab === 'overview' && (
              <div className="space-y-8 max-w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <GlassCard className="flex items-center gap-6 p-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm bg-emerald-50 text-emerald-500 border-emerald-100">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-3xl font-black text-slate-800 tracking-tighter">{bookings.length}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Bookings</p>
                    </div>
                  </GlassCard>
                  <GlassCard className="flex items-center gap-6 p-6">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm bg-blue-50 text-blue-500 border-blue-100">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xl font-black text-slate-800 tracking-tighter">{formatJoinedDate(homeOwner.created_at)}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Member since</p>
                    </div>
                  </GlassCard>
                </div>

                <GlassCard title="Activity overview" subtitle="Account details from your records.">
                  <div className="grid grid-cols-2 gap-8 mt-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Joined</p>
                      <p className="text-lg font-black text-slate-800">{formatJoinedDate(homeOwner.created_at)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={cn('w-5 h-5', accountActive ? 'text-emerald-500' : 'text-slate-300')} />
                        <p className="text-lg font-black text-slate-800 uppercase tracking-widest">
                          {accountActive ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2 mb-2">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{bookings.length} bookings</p>
                </div>
                {bookings.length === 0 ? (
                  <GlassCard className="p-8 text-center text-slate-500 text-sm">No bookings for this home owner yet.</GlassCard>
                ) : (
                  bookings.map((booking, i) => {
                    const b = booking as Record<string, unknown>;
                    const organizer =
                      (typeof b.organizer === 'string' && b.organizer) ||
                      (typeof b.organizer_name === 'string' && b.organizer_name) ||
                      '';
                    const date =
                      (typeof b.date === 'string' && b.date) ||
                      (typeof b.booking_date === 'string' && b.booking_date) ||
                      '';
                    const amount = b.amount;
                    const status = typeof b.status === 'string' ? b.status : '';

                    return (
                      <GlassCard key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:border-primary/20 gap-4">
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary shadow-xl">
                            <ShoppingBag className="w-7 h-7" />
                          </div>
                          <div>
                            <p className="text-lg font-black text-slate-800 tracking-tighter">{bookingTitle(b, i)}</p>
                            {(organizer || date) && (
                              <p className="text-xs font-bold text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                                {organizer && (
                                  <>
                                    Organizer: <span className="text-primary font-black">{organizer}</span>
                                  </>
                                )}
                                {organizer && date && <span>•</span>}
                                {date && <span>{date}</span>}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-8 sm:justify-end">
                          {amount != null && (
                            <div className="text-right">
                              <p className="text-xl font-black text-slate-800 tracking-tighter">{String(amount)}</p>
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Amount</p>
                            </div>
                          )}
                          {status && (
                            <div
                              className={cn(
                                'px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm',
                                status.toLowerCase() === 'completed'
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                  : status.toLowerCase() === 'pending'
                                    ? 'bg-amber-50 text-amber-600 border-amber-100'
                                    : 'bg-rose-50 text-rose-600 border-rose-100',
                              )}
                            >
                              {status}
                            </div>
                          )}
                        </div>
                      </GlassCard>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <GlassCard className="p-10 text-center space-y-3">
                <Heart className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-slate-600 font-medium">Favorite organizers are not included in this profile response yet.</p>
                <p className="text-xs text-slate-400">When the API provides favorites, they will appear here.</p>
              </GlassCard>
            )}
          </div>
        </div>
      </div>

      <SuspendHomeOwnerDialog
        open={suspendOpen}
        ownerLabel={homeOwner.name}
        loading={actionLoading}
        error={suspendDialogError}
        onClose={() => {
          if (!actionLoading) setSuspendOpen(false);
        }}
        onConfirm={handleSuspendConfirm}
      />

      <ConfirmationDialog
        open={restoreOpen}
        title="Restore this home owner?"
        description={`Allow ${homeOwner.name} to use their account again? The request will not include a message.`}
        confirmText={actionLoading ? 'Working…' : 'Restore access'}
        danger={false}
        onCancel={() => {
          if (!actionLoading) setRestoreOpen(false);
        }}
        onConfirm={handleRestoreConfirm}
      />
    </div>
  );
};

export default HomeOwnerDetails;
