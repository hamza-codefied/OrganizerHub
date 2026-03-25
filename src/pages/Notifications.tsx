import { useState } from 'react';
import { createPortal } from 'react-dom';
import { PageHeader } from '../components/UI';
import { Send, X } from 'lucide-react';
import { cn } from '../lib/utils';
import CustomSelect from '../components/CustomSelect';

type TargetValue = 'All Users' | 'Home Owners Only' | 'Organizers Only' | 'Specific User';

type NotificationLog = {
  id: string;
  title: string;
  message: string;
  target: TargetValue;
  targetEmail?: string;
  status: 'Sent' | 'Scheduled';
  sentDate: string | null;
};

const INITIAL_NOTIFICATIONS: NotificationLog[] = [
  { 
    id: '1', 
    title: 'Spring Cleaning Special', 
    message: 'Book any home organization service this month and get 1...', 
    target: 'All Users', 
    status: 'Sent', 
    sentDate: '2026-02-01' 
  },
  { 
    id: '2', 
    title: 'Your Booking Reminder', 
    message: 'Hi Jessica! Your Pantry Organization session with Claire ...', 
    target: 'Specific User', 
    targetEmail: 'jessica@email.com', 
    status: 'Sent', 
    sentDate: '2026-02-23' 
  },
  { 
    id: '3', 
    title: 'New Organizers in Your Area', 
    message: '5 new certified organizers have joined in your area! Chec...', 
    target: 'Home Owners Only', 
    status: 'Scheduled', 
    sentDate: null 
  },
  { 
    id: '4', 
    title: 'Organizer Profile Tips', 
    message: 'Complete your portfolio with before/after photos to attrac...', 
    target: 'Organizers Only', 
    status: 'Sent', 
    sentDate: '2026-01-20' 
  },
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState<NotificationLog[]>(INITIAL_NOTIFICATIONS);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<{
    title: string;
    message: string;
    target: TargetValue;
    targetEmail: string;
  }>({
    title: '',
    message: '',
    target: 'All Users',
    targetEmail: '',
  });

  const createNotification = () => {
    const title = createForm.title.trim();
    const message = createForm.message.trim();
    if (!title || !message) return;

    const newLog: NotificationLog = {
      id: `notif-${Date.now()}`,
      title,
      message,
      target: createForm.target,
      targetEmail: createForm.target === 'Specific User' ? createForm.targetEmail : undefined,
      status: 'Scheduled',
      sentDate: null,
    };

    setNotifications((prev) => [newLog, ...prev]);
    setCreateOpen(false);
    setCreateForm({ title: '', message: '', target: 'All Users', targetEmail: '' });
  };

  return (
    <div className="space-y-10">
      <PageHeader 
        title="Notifications" 
        description="Broadcast platform-wide updates or targeted alerts."
      >
        <button
           type="button"
           onClick={() => setCreateOpen(true)}
           className="flex items-center justify-center gap-2 primary-gradient text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all outline-none"
        >
           <Send className="w-4 h-4" />
           New Notification
        </button>
      </PageHeader>

      <div className="bg-[#fafafa] sm:bg-white rounded-xl sm:rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] p-4 sm:p-8">
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h3 className="text-sm font-semibold text-slate-800">Notification History</h3>
          <span className="bg-slate-100 text-slate-600 text-[10px] px-2.5 py-1 rounded-md font-medium tracking-wide">
            {notifications.length} total
          </span>
        </div>
        
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-4 px-2 text-[11px] font-medium text-slate-500 w-[25%] tracking-wide">Title</th>
                <th className="pb-4 px-2 text-[11px] font-medium text-slate-500 w-[35%] tracking-wide">Message</th>
                <th className="pb-4 px-2 text-[11px] font-medium text-slate-500 tracking-wide">Target</th>
                <th className="pb-4 px-2 text-[11px] font-medium text-slate-500 w-[12%] tracking-wide">Status</th>
                <th className="pb-4 px-2 text-[11px] font-medium text-slate-500 w-[12%] tracking-wide">Sent Date</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((n) => (
                <tr key={n.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-2 text-[13px] font-medium text-slate-800">{n.title}</td>
                  <td className="py-4 px-2 text-[13px] text-slate-500">
                    <span className="block truncate max-w-[280px]" title={n.message}>
                      {n.message}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex flex-col items-start gap-1">
                      <span className="inline-block py-0.5 px-2 bg-white border border-slate-200 rounded text-[10px] font-medium text-slate-800 shadow-sm leading-relaxed">
                        {n.target}
                      </span>
                      {n.target === 'Specific User' && n.targetEmail && (
                         <span className="text-[9px] text-slate-400 pl-0.5 truncate max-w-[120px]" title={n.targetEmail}>
                           {n.targetEmail}
                         </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className={cn(
                      "inline-flex items-center justify-center py-1 px-3 text-[10px] uppercase font-bold tracking-wide rounded-md w-fit min-w-[70px]",
                      n.status === 'Sent' 
                        ? "bg-[#fb7185] text-white shadow-sm" 
                        : "bg-white border border-slate-200 text-slate-800 font-semibold"
                    )}>
                      {n.status}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-[12px] text-slate-500 whitespace-nowrap">
                    {n.sentDate || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {createOpen && typeof document !== 'undefined'
        ? createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
              <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
                onClick={() => setCreateOpen(false)}
                aria-hidden
              />
              <div className="relative w-full max-w-lg rounded-xl flex flex-col bg-white shadow-2xl overflow-visible animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">Compose Notification</h2>
                  <button
                    onClick={() => setCreateOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">Title</label>
                    <input
                      value={createForm.title}
                      onChange={(e) => setCreateForm((p) => ({ ...p, title: e.target.value }))}
                      type="text"
                      placeholder="Notification title"
                      className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3.5 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">Message</label>
                    <textarea
                      value={createForm.message}
                      onChange={(e) => setCreateForm((p) => ({ ...p, message: e.target.value }))}
                      rows={4}
                      placeholder="Write your message..."
                      className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3.5 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400 resize-y"
                    />
                  </div>

                  <div className="space-y-2 relative">
                    <label className="text-sm font-semibold text-slate-800">Target Audience</label>
                    <CustomSelect
                      value={createForm.target}
                      onChange={(value) => setCreateForm((p) => ({ ...p, target: value as TargetValue }))}
                      options={[
                        { value: 'All Users', label: 'All Users' },
                        { value: 'Home Owners Only', label: 'Home Owners Only' },
                        { value: 'Organizers Only', label: 'Organizers Only' },
                        { value: 'Specific User', label: 'Specific User' },
                      ]}
                    />
                  </div>
                  
                  {createForm.target === 'Specific User' && (
                    <div className="space-y-2 animate-in slide-in-from-top-2 fade-in">
                       <label className="text-sm font-semibold text-slate-800">Target Email</label>
                       <input
                         value={createForm.targetEmail}
                         onChange={(e) => setCreateForm((p) => ({ ...p, targetEmail: e.target.value }))}
                         type="email"
                         placeholder="e.g. jessica@email.com"
                         className="w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3.5 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all placeholder:text-slate-400"
                       />
                    </div>
                  )}
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 rounded-b-xl flex justify-end">
                   <button
                     type="button"
                     onClick={createNotification}
                     className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                   >
                     Send Notification
                   </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      
    </div>
  );
};

export default NotificationsPage;
