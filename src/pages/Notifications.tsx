import React, { useMemo, useState } from 'react';
import { PageHeader, GlassCard } from '../components/UI';
import {
  Send,
  Users,
  Briefcase,
  Bell,
  History,
  Search,
  Trash2,
  Filter,
  Megaphone,
  Zap,
  Radio,
} from 'lucide-react';
import { cn } from '../lib/utils';
import CustomSelect from '../components/CustomSelect';
import DetailsDialog from '../components/DetailsDialog';
import ConfirmationDialog from '../components/ConfirmationDialog';

const NotificationsPage = () => {
  type NotificationType = 'System' | 'Finance' | 'Marketing' | 'Legal';
  type TargetCluster = 'All Home Owners' | 'Partners';

  type NotificationLog = {
    id: string;
    title: string;
    target: TargetCluster;
    date: string;
    reach: string;
    type: NotificationType;
    payload: string;
  };

  const typeToIcon = useMemo(() => {
    return {
      System: Radio,
      Finance: Zap,
      Marketing: Megaphone,
      Legal: Bell,
    } as const;
  }, []);

  const [notifications, setNotifications] = useState<NotificationLog[]>([
    {
      id: 'notif-1',
      title: 'Platform update',
      target: 'All Home Owners',
      date: '2 Hours Ago',
      reach: '1.4k',
      type: 'System',
      payload: 'Mock payload content for the marketplace architecture update.',
    },
    {
      id: 'notif-2',
      title: 'Payout sent',
      target: 'Partners',
      date: 'Yesterday',
      reach: '180',
      type: 'Finance',
      payload: 'Mock payload content for payout processing.',
    },
    {
      id: 'notif-3',
      title: 'Seasonal promotion',
      target: 'All Home Owners',
      date: '3 Days Ago',
      reach: '2.2k',
      type: 'Marketing',
      payload: 'Mock payload content for seasonal promotions.',
    },
    {
      id: 'notif-4',
      title: 'Terms updated',
      target: 'All Home Owners',
      date: '1 Week Ago',
      reach: '2.4k',
      type: 'Legal',
      payload: 'Mock payload content for protocol revision.',
    },
  ]);

  const [clusterTarget, setClusterTarget] = useState<TargetCluster>('All Home Owners');

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<{
    title: string;
    target: TargetCluster;
    type: NotificationType;
    payload: string;
  }>({
    title: '',
    target: 'All Home Owners',
    type: 'System',
    payload: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | NotificationType>('all');

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredNotifications = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return notifications.filter((n) => {
      const matchesType = typeFilter === 'all' ? true : n.type === typeFilter;
      const matchesSearch =
        term.length === 0 ? true : `${n.title} ${n.target} ${n.type}`.toLowerCase().includes(term);
      return matchesType && matchesSearch;
    });
  }, [notifications, searchTerm, typeFilter]);

  const openCreate = () => {
    setCreateForm((p) => ({ ...p, target: clusterTarget }));
    setCreateOpen(true);
  };

  const createNotification = () => {
    const title = createForm.title.trim();
    const payload = createForm.payload.trim();
    if (!title || !payload) return;

    const newLog: NotificationLog = {
      id: `notif-${Date.now()}`,
      title,
      payload,
      target: createForm.target,
      type: createForm.type,
      date: 'Just Now',
      reach:
        createForm.type === 'Marketing'
          ? '2.9k'
          : createForm.type === 'Finance'
            ? '420'
            : createForm.type === 'Legal'
              ? '860'
              : '1.2k',
    };

    setNotifications((prev) => [newLog, ...prev]);
    setCreateOpen(false);
    setCreateForm((p) => ({ ...p, title: '', payload: '' }));
  };

  const deleteNotification = () => {
    if (!deleteTargetId) return;
    setNotifications((prev) => prev.filter((n) => n.id !== deleteTargetId));
    setDeleteTargetId(null);
  };

  return (
    <div className="space-y-12">
      <PageHeader 
        title="Notifications" 
        description="Send push notifications and alerts to home owners or organizers."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12">
          <GlassCard title="Send notification" subtitle="Create and send a new message to your audience.">
            <div className="space-y-8 mt-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Audience</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setClusterTarget('All Home Owners')}
                    className={cn(
                      'flex flex-col gap-2 items-center justify-center py-5 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all border-white shadow-xl',
                      clusterTarget === 'All Home Owners'
                        ? 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/10'
                        : 'border-slate-100 bg-white/0 text-slate-400 hover:bg-slate-50',
                    )}
                  >
                    <Users className="w-5 h-5" /> All Home Owners
                  </button>
                  <button
                    type="button"
                    onClick={() => setClusterTarget('Partners')}
                    className={cn(
                      'flex flex-col gap-2 items-center justify-center py-5 rounded-2xl border font-black text-[10px] uppercase tracking-widest transition-all border-white shadow-xl',
                      clusterTarget === 'Partners'
                        ? 'border-secondary/20 bg-secondary/5 text-secondary hover:bg-secondary/10'
                        : 'border-slate-100 bg-white/0 text-slate-400 hover:bg-slate-50',
                    )}
                  >
                    <Briefcase className="w-5 h-5" /> Organizers
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={openCreate}
                className="w-[30%] mx-auto py-5 primary-gradient text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 group"
              >
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                New notification
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Sent notifications section (commented out) */}
        {/*
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8 px-2">
               <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Sent notifications
               </h3>
              <div className="flex gap-3">
                 <div className="relative group">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                    <input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      type="text"
                      placeholder="Search notifications..."
                      className="bg-white/40 border border-white/60 rounded-xl py-2 pl-10 pr-4 text-xs font-bold outline-none w-48 focus:bg-white transition-all shadow-sm"
                    />
                 </div>
                 <button
                    type="button"
                    onClick={() => setShowTypeFilter((v) => !v)}
                    className={cn(
                      'p-2.5 border border-white/60 bg-white/40 backdrop-blur-md rounded-xl hover:bg-white transition-all shadow-sm',
                      showTypeFilter && 'border-primary/30 bg-primary/5',
                    )}
                    aria-label="Filter by type"
                 >
                    <Filter className="w-4 h-4 text-slate-400" />
                 </button>
              </div>
            </div>

            {showTypeFilter && (
              <div className="mb-6 px-2">
                <CustomSelect
                  value={typeFilter}
                  onChange={(value) => setTypeFilter(value as 'all' | NotificationType)}
                  options={[
                    { value: 'all', label: 'All Types' },
                    { value: 'System', label: 'System' },
                    { value: 'Finance', label: 'Finance' },
                    { value: 'Marketing', label: 'Marketing' },
                    { value: 'Legal', label: 'Legal' },
                  ]}
                  placeholder="Filter by type"
                />
              </div>
            )}

            <div className="space-y-4">
               {filteredNotifications.map((log, i) => {
                 const Icon = typeToIcon[log.type];
                 return (
                   <div key={log.id}>
                     <GlassCard className="p-6 flex items-center justify-between border-slate-200">
                        <div className="flex items-center gap-6">
                          <div
                            className={cn(
                              'w-12 h-12 rounded-2xl flex items-center justify-center border border-white shadow-lg transition-all duration-500 group-hover:rotate-6',
                              log.type === 'Marketing'
                                ? 'bg-amber-50 text-amber-600'
                                : log.type === 'Finance'
                                  ? 'bg-emerald-50 text-emerald-600'
                                  : log.type === 'Legal'
                                    ? 'bg-rose-50 text-rose-600'
                                    : 'bg-blue-50 text-blue-600',
                            )}
                          >
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-black text-slate-800 text-base tracking-tight leading-none group-hover:text-primary transition-colors">{log.title}</h4>
                            <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2 px-1">
                               <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {log.target}</span>
                               <span className="text-slate-200">|</span>
                               <span>{log.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-10">
                          <div className="text-right hidden sm:block">
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Reach</p>
                            <p className="font-black text-lg text-primary tracking-tighter">{log.reach}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(log.id)}
                            className="p-3 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100"
                            aria-label="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                     </GlassCard>
                   </div>
                 );
               })}
            </div>
            
            <button
              type="button"
              onClick={() => {
                const newLog: NotificationLog = {
                  id: `notif-${Date.now()}`,
                  title: 'Older notifications synced',
                  target: clusterTarget,
                  date: 'Just Now',
                  reach: '0.0k',
                  type: 'System',
                  payload: 'Mock sync action: legacy propagation log has been re-indexed.',
                };
                setNotifications((prev) => [newLog, ...prev]);
              }}
              className="w-full mt-10 py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all"
            >
              Load older notifications
            </button>
          </div>
        */}
      </div>

      <DetailsDialog
        open={createOpen}
        title="New notification"
        onClose={() => setCreateOpen(false)}
      >
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Audience</label>
            <CustomSelect
              value={createForm.target}
              onChange={(value) => setCreateForm((p) => ({ ...p, target: value as TargetCluster }))}
              options={[
                { value: 'All Home Owners', label: 'All Home Owners' },
                { value: 'Organizers', label: 'Organizers' },
              ]}
              placeholder="Select target"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
            <CustomSelect
              value={createForm.type}
              onChange={(value) => setCreateForm((p) => ({ ...p, type: value as NotificationType }))}
              options={[
                { value: 'System', label: 'System' },
                { value: 'Finance', label: 'Finance' },
                { value: 'Marketing', label: 'Marketing' },
                { value: 'Legal', label: 'Legal' },
              ]}
              placeholder="Select type"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
            <input
              value={createForm.title}
              onChange={(e) => setCreateForm((p) => ({ ...p, title: e.target.value }))}
              type="text"
              placeholder="e.g. Platform upgrade"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Message</label>
            <textarea
              value={createForm.payload}
              onChange={(e) => setCreateForm((p) => ({ ...p, payload: e.target.value }))}
              rows={5}
              placeholder="Type your message..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCreateOpen(false)}
              className="flex-1 py-4 bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={createNotification}
              className="flex-1 py-4 primary-gradient text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              Send
            </button>
          </div>
        </div>
      </DetailsDialog>

      <ConfirmationDialog
        open={!!deleteTargetId}
        title="Delete"
        description="Delete this notification?"
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onConfirm={deleteNotification}
        onCancel={() => setDeleteTargetId(null)}
      />

    </div>
  );
};

export default NotificationsPage;
