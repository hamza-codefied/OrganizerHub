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
import { motion } from 'framer-motion';
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
      title: 'Marketplace Architecture Update',
      target: 'All Home Owners',
      date: '2 Hours Ago',
      reach: '1.4k',
      type: 'System',
      payload: 'Mock payload content for the marketplace architecture update.',
    },
    {
      id: 'notif-2',
      title: 'Strategic Payout Processed',
      target: 'Partners',
      date: 'Yesterday',
      reach: '180',
      type: 'Finance',
      payload: 'Mock payload content for payout processing.',
    },
    {
      id: 'notif-3',
      title: 'Global Seasonal Promotion',
      target: 'All Home Owners',
      date: '3 Days Ago',
      reach: '2.2k',
      type: 'Marketing',
      payload: 'Mock payload content for seasonal promotions.',
    },
    {
      id: 'notif-4',
      title: 'Operational Protocol Revision',
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
    <div className="space-y-12 animate-in fade-in duration-700">
      <PageHeader 
        title="Propagation Command" 
        description="Strategically deploy push notifications and system-wide alerts to targeted platform clusters."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4">
          <GlassCard title="Broadcast Node" subtitle="Create and deploy a new structural alert.">
            <div className="space-y-8 mt-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Target Cluster</label>
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
                    <Briefcase className="w-5 h-5" /> Partners
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={openCreate}
                className="w-full py-5 primary-gradient text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 group"
              >
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Create Notification
              </button>
            </div>
          </GlassCard>
        </div>

        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-8 px-2">
             <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Strategic Propagation Log
             </h3>
            <div className="flex gap-3">
               <div className="relative group">
                  <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    type="text"
                    placeholder="Search logs..."
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
                  aria-label="Filter logs"
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
                 <motion.div
                   key={log.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                 >
                   <GlassCard className="p-6 flex items-center justify-between group cursor-pointer hover:border-primary/20 border-white/60 shadow-xl transition-all duration-500">
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
                             <span className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {log.target} Cluster</span>
                             <span className="text-slate-200">|</span>
                             <span>{log.date} Sync Event</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-10">
                        <div className="text-right hidden sm:block">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Impact Radius</p>
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
                 </motion.div>
               );
             })}
          </div>
          
          <button
            type="button"
            onClick={() => {
              const newLog: NotificationLog = {
                id: `notif-${Date.now()}`,
                title: 'Legacy logs synchronized',
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
            Synchronize Legacy Logs
          </button>
        </div>
      </div>

      <DetailsDialog
        open={createOpen}
        title="Create Notification"
        onClose={() => setCreateOpen(false)}
      >
        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Cluster</label>
            <CustomSelect
              value={createForm.target}
              onChange={(value) => setCreateForm((p) => ({ ...p, target: value as TargetCluster }))}
              options={[
                { value: 'All Home Owners', label: 'All Home Owners' },
                { value: 'Partners', label: 'Partners' },
              ]}
              placeholder="Select target"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Notification Type</label>
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
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strategic Title</label>
            <input
              value={createForm.title}
              onChange={(e) => setCreateForm((p) => ({ ...p, title: e.target.value }))}
              type="text"
              placeholder="e.g. PLATFORM UPGRADE LIVE"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Payload Content</label>
            <textarea
              value={createForm.payload}
              onChange={(e) => setCreateForm((p) => ({ ...p, payload: e.target.value }))}
              rows={5}
              placeholder="Construct the core message narrative..."
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
              Create Notification
            </button>
          </div>
        </div>
      </DetailsDialog>

      <ConfirmationDialog
        open={!!deleteTargetId}
        title="Confirm Delete"
        description="Delete this notification log entry?"
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
