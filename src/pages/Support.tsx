import React, { useState } from 'react';
import { PageHeader, GlassCard, StatCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { cn } from '../lib/utils';
import { 
  Clock, CheckCircle2, 
  MessageSquare, ShieldAlert,
  LifeBuoy, UserPlus, Reply, Trash2, 
  HelpCircle, Plus, Edit3, Lock, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationDialog from '../components/ConfirmationDialog';
import DetailsDialog from '../components/DetailsDialog';

const MOCK_TICKETS = Array.from({ length: 15 }).map((_, i) => ({
  id: `TK-${1000 + i}`,
  user: i % 2 === 0 ? "John Doe" : "Sarah Green",
  subject: i % 3 === 0 ? "Strategic Payment conflict on session #123" : i % 3 === 1 ? "Partner verification protocol" : "Incident Report: Platform Violation",
  status: i % 4 === 0 ? "Resolved" : i % 4 === 1 ? "In Progress" : "Pending",
  priority: i % 3 === 0 ? "High" : "Medium",
  agent: i % 3 === 0 ? "Support Delta" : i % 3 === 1 ? "Support Echo" : "Unassigned",
  date: "2024-03-12"
}));

const MOCK_FAQS = [
  { id: 1, question: "How do I initiate a global verification protocol?", category: "Verification", status: "Published" },
  { id: 2, question: "Can I manual override a booking lifecycle?", category: "Operations", status: "Published" },
  { id: 3, question: "What is the platform's fiscal yield distribution?", category: "Finance", status: "Draft" },
];

const SupportPage = () => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'faq'>('tickets');
  type Ticket = typeof MOCK_TICKETS[0];
  type Faq = typeof MOCK_FAQS[0];
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS as Ticket[]);
  const [faqs, setFaqs] = useState<Faq[]>(MOCK_FAQS as Faq[]);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsTitle, setDetailsTitle] = useState('');
  const [detailsPayload, setDetailsPayload] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  // Create FAQ modal
  const [isCreateFaqOpen, setIsCreateFaqOpen] = useState(false);
  const [faqForm, setFaqForm] = useState({ question: '', category: '', status: 'Draft' });

  const ticketColumns = [
    { 
      header: "Strategic ID", 
      accessor: (t: any) => <span className="font-black text-primary text-[10px] tracking-[0.2em]">{t.id}</span> 
    },
    { 
      header: "Platform Actor", 
      accessor: (t: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center border border-white shadow-sm overflow-hidden p-0.5">
             <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.user}`} className="w-full h-full" alt="User" />
          </div>
          <div>
            <p className="font-black text-slate-800 text-sm tracking-tight">{t.user}</p>
            <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Assigned: {t.agent}</p>
          </div>
        </div>
      )
    },
    { header: "Incident Brief", accessor: (t: any) => <span className="max-w-[300px] truncate font-bold text-slate-600 text-sm block">{t.subject}</span> },
    { 
      header: "Urgency", 
      accessor: (t: any) => (
        <span className={cn(
          "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm",
          t.priority === 'High' ? "bg-rose-50/50 text-rose-600 border-rose-100 shadow-rose-50" : "bg-blue-50/50 text-blue-600 border-blue-100"
        )}>
          {t.priority}
        </span>
      )
    },
    { 
      header: "Operation Status", 
      accessor: (t: any) => (
        <div className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
          t.status === 'Resolved' ? "bg-emerald-50/50 text-emerald-600 border-emerald-100" : 
          t.status === 'In Progress' ? "bg-amber-50/50 text-amber-600 border-amber-100" : "bg-slate-50 text-slate-400 border-slate-100"
        )}>
           {t.status}
        </div>
      )
    },
    { 
      header: "Sync Timestamp", 
      accessor: (t: any) => <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.date}</span> 
    },
  ];

  const faqColumns = [
    { header: "Strategic ID", accessor: (f: any) => <span className="font-black text-primary text-[10px] tracking-widest">FAQ-{f.id}</span> },
    { header: "Question Narrative", accessor: (f: any) => <span className="font-bold text-slate-800 text-sm">{f.question}</span> },
    { header: "Sector", accessor: (f: any) => <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{f.category}</span> },
    { 
      header: "Registry Status", 
      accessor: (f: any) => (
        <span className={cn(
          "px-3 py-1 rounded-full text-[9px] font-black uppercase border",
          f.status === 'Published' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"
        )}>{f.status}</span>
      ) 
    },
  ];

  return (
    <>
      <div className="space-y-12 animate-in fade-in duration-700">
      <PageHeader 
        title="Support Command" 
        description="Oversee user conflict resolution and maintain platform operational integrity."
      >
        <PremiumTabs 
          tabs={[
            { id: 'tickets', label: 'Incident Stream' },
            { id: 'faq', label: 'Strategic FAQs' },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <StatCard title="Priority Alerts" value="4" icon={ShieldAlert} color="secondary" trend="up" />
        <StatCard title="Response Velocity" value="14m" icon={Clock} color="blue" />
        <StatCard title="Total Registry" value="1,240" icon={HelpCircle} color="primary" />
        <StatCard title="Active Tickets" value="24" icon={MessageSquare} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-12">
            <AnimatePresence mode="wait">
               {activeTab === 'tickets' ? (
                 <motion.div key="tickets" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
                    <DataTable 
                      columns={ticketColumns} 
                      data={tickets} 
                      searchPlaceholder="Filter stream by Actor ID or Incident Ref..." 
                      rowActions={[
                        {
                          label: 'Admin Reply',
                          icon: Reply,
                          onClick: (t: Ticket) => {
                            setDetailsTitle('Admin Reply (mock)');
                            setDetailsPayload(t);
                            setDetailsOpen(true);
                          },
                        },
                        {
                          label: 'Assign Agent',
                          icon: UserPlus,
                          onClick: (t: Ticket) =>
                            setTickets((prev) => prev.map((x) => (x.id === t.id ? { ...x, agent: 'Support Delta' } : x))),
                        },
                        {
                          label: 'Resolve Lifecycle',
                          icon: CheckCircle2,
                          variant: 'success',
                          onClick: (t: Ticket) =>
                            setTickets((prev) =>
                              prev.map((x) => (x.id === t.id ? { ...x, status: 'Resolved', agent: x.agent === 'Unassigned' ? 'Support Delta' : x.agent } : x)),
                            ),
                        },
                        {
                          label: 'Kill Ticket',
                          icon: Trash2,
                          variant: 'danger',
                          onClick: (t: Ticket) => setDeleteTarget(t),
                        },
                      ]}
                    />
                 </motion.div>
               ) : (
                 <motion.div key="faq" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3">
                          <HelpCircle className="w-5 h-5 text-primary" />
                          Strategic FAQ Registry
                       </h3>
                       <button
                         type="button"
                         onClick={() => setIsCreateFaqOpen(true)}
                         className="flex items-center gap-2 primary-gradient text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                       >
                          <Plus className="w-4 h-4" />
                          Deploy New FAQ
                       </button>
                    </div>
                    <DataTable 
                      columns={faqColumns} 
                      data={faqs} 
                      searchPlaceholder="Audit FAQs by category or narrative keywords..." 
                      rowActions={[
                        {
                          label: 'Edit Payload',
                          icon: Edit3,
                          onClick: (f: Faq) => {
                            setDetailsTitle('Edit FAQ (mock)');
                            setDetailsPayload(f);
                            setDetailsOpen(true);
                          },
                        },
                        {
                          label: 'Archive Protocol',
                          icon: Lock,
                          onClick: (f: Faq) =>
                            setFaqs((prev) => prev.map((x) => (x.id === f.id ? { ...x, status: 'Archived' } : x))),
                        },
                        {
                          label: 'Delete Registry',
                          icon: Trash2,
                          variant: 'danger',
                          onClick: (f: Faq) => setDeleteTarget(f),
                        },
                      ]}
                    />
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
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

    <ConfirmationDialog
      open={!!deleteTarget}
      title="Confirm Delete"
      description={
        deleteTarget
          ? typeof deleteTarget.id === 'string'
            ? `Are you sure you want to delete ticket ${deleteTarget.id}?`
            : `Are you sure you want to delete FAQ #${deleteTarget.id}?`
          : undefined
      }
      confirmText="Delete"
      cancelText="Cancel"
      danger
      onCancel={() => setDeleteTarget(null)}
      onConfirm={() => {
        if (!deleteTarget) return;
        if (typeof deleteTarget.id === 'string') {
          setTickets((prev) => prev.filter((t) => t.id !== deleteTarget.id));
        } else {
          setFaqs((prev) => prev.filter((f) => f.id !== deleteTarget.id));
        }
        setDeleteTarget(null);
      }}
    />

      {/* Create FAQ modal */}
      <AnimatePresence>
        {isCreateFaqOpen && (
          <div className="fixed inset-0 z-[320] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateFaqOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-white overflow-hidden p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Deploy New FAQ</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                    Add a new knowledge entry for your clients
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateFaqOpen(false)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-400 transition-all"
                  aria-label="Close create FAQ modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Question
                  </label>
                  <input
                    type="text"
                    value={faqForm.question}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    placeholder="Type the FAQ question..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={faqForm.category}
                    onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                    placeholder="e.g., Finance"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Status
                  </label>
                  <input
                    type="text"
                    value={faqForm.status}
                    onChange={(e) => setFaqForm({ ...faqForm, status: e.target.value })}
                    placeholder="e.g., Draft"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                </div>
              </div>

              <div className="mt-10 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateFaqOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const question = faqForm.question.trim();
                    const category = faqForm.category.trim();
                    if (!question || !category) return;

                    const ids = faqs.map((f) => typeof f.id === 'number' ? f.id : 0);
                    const nextId = (Math.max(...ids) || 0) + 1;

                    setFaqs((prev) => [
                      {
                        id: nextId,
                        question,
                        category,
                        status: faqForm.status.trim() || 'Draft',
                      } as Faq,
                      ...prev,
                    ]);

                    setIsCreateFaqOpen(false);
                    setFaqForm({ question: '', category: '', status: 'Draft' });
                  }}
                  className="flex-1 py-4 primary-gradient text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Create FAQ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SupportPage;
