import React, { useState } from 'react';
import { PageHeader, GlassCard, StatCard, PremiumTabs } from '../components/UI';
import { DataTable } from '../components/DataTable';
import { cn } from '../lib/utils';
import { 
  Clock, CheckCircle2, 
  MessageSquare, ShieldAlert,
  LifeBuoy, UserPlus, Reply, Trash2, 
  HelpCircle, Plus, Edit3, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
         <div className="lg:col-span-3 space-y-6">
            <GlassCard title="Support Vitals">
               <div className="space-y-8 mt-6">
                  {[
                    { label: 'Conflict Delta', val: 12, color: 'bg-rose-500' },
                    { label: 'Resolution Rate', val: 92, color: 'bg-primary' },
                    { label: 'Partner Satis.', val: 85, color: 'bg-amber-500' },
                  ].map((vital, i) => (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                          <span className="text-slate-400">{vital.label}</span>
                          <span className="text-slate-800">{vital.val}%</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-white">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${vital.val}%` }}
                            transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                            className={cn("h-full rounded-full", vital.color)}
                          />
                       </div>
                    </div>
                  ))}
                  
                  <div className="p-6 bg-blue-50/30 rounded-3xl border border-blue-100 mt-10">
                     <div className="flex items-center gap-3 mb-3">
                        <LifeBuoy className="w-5 h-5 text-blue-500" />
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">System Note</span>
                     </div>
                     <p className="text-xs font-bold text-slate-600 leading-snug tracking-tight">Support flow is currently within optimal temporal thresholds. No escalation required.</p>
                  </div>
               </div>
            </GlassCard>
         </div>

         <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
               {activeTab === 'tickets' ? (
                 <motion.div key="tickets" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }}>
                    <DataTable 
                      columns={ticketColumns} 
                      data={MOCK_TICKETS} 
                      searchPlaceholder="Filter stream by Actor ID or Incident Ref..." 
                      rowActions={[
                        { label: 'Admin Reply', icon: Reply, onClick: () => {} },
                        { label: 'Assign Agent', icon: UserPlus, onClick: () => {} },
                        { label: 'Resolve Lifecycle', icon: CheckCircle2, onClick: () => {}, variant: 'success' },
                        { label: 'Kill Ticket', icon: Trash2, onClick: () => {}, variant: 'danger' },
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
                       <button className="flex items-center gap-2 primary-gradient text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                          <Plus className="w-4 h-4" />
                          Deploy New FAQ
                       </button>
                    </div>
                    <DataTable 
                      columns={faqColumns} 
                      data={MOCK_FAQS} 
                      searchPlaceholder="Audit FAQs by category or narrative keywords..." 
                      rowActions={[
                        { label: 'Edit Payload', icon: Edit3, onClick: () => {} },
                        { label: 'Archive Protocol', icon: Lock, onClick: () => {} },
                        { label: 'Delete Registry', icon: Trash2, onClick: () => {}, variant: 'danger' },
                      ]}
                    />
                 </motion.div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
};

export default SupportPage;
