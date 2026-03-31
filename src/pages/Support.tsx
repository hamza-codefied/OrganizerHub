import React, { useState } from 'react';
import { Search, MoreVertical, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { PremiumTabs } from '../components/UI';

type Ticket = {
  id: string;
  userType: 'organizer' | 'home_owner';
  name: string;
  email: string;
  date: string;
  subject: string;
  issue: string;
  status: 'Open' | 'Pending' | 'Resolved';
};

const MOCK_TICKETS: Ticket[] = [
  {
    id: '#CASE-\n0002',
    userType: 'organizer',
    name: 'Marcus Webb',
    email: 'marcus@organiser.com',
    date: '2026-02-22',
    subject: 'Profile verification taking\ntoo long',
    issue: "I submitted my organizer profile with all certifications 5 days ago and still haven't heard back. I'm\nmissing out on booking requests.",
    status: 'Open'
  },
  {
    id: '#CASE-\n0004',
    userType: 'organizer',
    name: 'Derek Simmons',
    email: 'derek@organiser.com',
    date: '2026-02-15',
    subject: 'Unfair suspension appeal',
    issue: 'My account was suspended due to one negative review about my garage organization service. I believe\nthis is unfair and would like to appeal.',
    status: 'Pending'
  },
  {
    id: '#CASE-\n0007',
    userType: 'organizer',
    name: 'Carlos Mendez',
    email: 'carlos@organiser.com',
    date: '2026-02-01',
    subject: 'Payout not received',
    issue: "My January payout was supposed to arrive on the 25th but I still haven't received it in my bank account.",
    status: 'Resolved'
  },
  {
    id: '#CASE-\n0010',
    userType: 'home_owner',
    name: 'Sarah Jenkins',
    email: 'sarah@homeowner.com',
    date: '2026-02-25',
    subject: 'Unable to edit review',
    issue: "I made a typo in my review for Marcus Webb but the system won't let me edit it after submission.",
    status: 'Open'
  },
  {
    id: '#CASE-\n0012',
    userType: 'home_owner',
    name: 'Tom Barnes',
    email: 'tom@homeowner.com',
    date: '2026-02-20',
    subject: 'Organizer no-show',
    issue: "The organizer I booked for yesterday never showed up and isn't responding to messages.",
    status: 'Pending'
  }
];

const SupportPage = () => {
  const [audience, setAudience] = useState<'organizer' | 'home_owner'>('organizer');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Resolved'>('All');
  const [search, setSearch] = useState('');

  const filteredTickets = MOCK_TICKETS.filter(t => t.userType === audience)
    .filter(t => statusFilter === 'All' ? true : t.status === statusFilter || (statusFilter === 'Pending' && t.status === 'Open'))
    .filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || 
                 t.email.toLowerCase().includes(search.toLowerCase()) || 
                 t.id.replace('\n', '').toLowerCase().includes(search.toLowerCase()));


  return (
    <div className="bg-[#fcfcfc] sm:bg-white rounded-2xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] p-4 sm:p-8">
      {/* Top Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
        
        {/* Audience Toggle */}
        <PremiumTabs
          tabs={[
            { id: 'organizer', label: 'Organizers' },
            { id: 'home_owner', label: 'Home owners' },
          ]}
          activeTab={audience}
          onChange={(id) => setAudience(id as 'organizer' | 'home_owner')}
          className="w-full sm:w-fit"
        />

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row w-full xl:w-auto items-stretch sm:items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by name, email, case ID"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full sm:w-[280px] pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-[13px] font-medium text-slate-600 focus:outline-none focus:border-slate-300 focus:ring-4 focus:ring-slate-100 placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex rounded-lg overflow-hidden border border-slate-200 bg-white">
            <button 
              onClick={() => setStatusFilter('All')}
              className={cn("px-4 py-2 text-[12px] font-semibold transition-colors border-r border-slate-200", statusFilter === 'All' ? "bg-primary text-white border-primary" : "text-slate-600 hover:bg-slate-50")}
            >
              All
            </button>
            <button 
               onClick={() => setStatusFilter('Pending')}
              className={cn("px-4 py-2 text-[12px] font-semibold transition-colors border-r border-slate-200", statusFilter === 'Pending' ? "bg-primary text-white border-primary" : "text-slate-600 hover:bg-slate-50")}
            >
              Pending
            </button>
            <button 
               onClick={() => setStatusFilter('Resolved')}
              className={cn("px-4 py-2 text-[12px] font-semibold transition-colors", statusFilter === 'Resolved' ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-50")}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 mt-4">
        <table className="w-full text-left min-w-[1000px] border-collapse">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="pb-4 pr-3 pl-2 text-[11px] font-medium text-slate-500 whitespace-nowrap">Case ID</th>
              <th className="pb-4 px-3 text-[11px] font-medium text-slate-500 whitespace-nowrap">Name</th>
              <th className="pb-4 px-3 text-[11px] font-medium text-slate-500 whitespace-nowrap">Email</th>
              <th className="pb-4 px-3 text-[11px] font-medium text-slate-500 whitespace-nowrap">Date</th>
              <th className="pb-4 px-3 text-[11px] font-medium text-slate-500 w-[18%]">Subject</th>
              <th className="pb-4 px-3 text-[11px] font-medium text-slate-500 w-[35%]">Issue</th>
              <th className="pb-4 px-3 text-[11px] font-medium text-slate-500 text-center">Status</th>
              <th className="pb-4 pl-3 pr-2 text-[11px] font-medium text-slate-500 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(ticket => (
              <tr key={ticket.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors">
                <td className="py-5 pr-3 pl-2 align-top">
                  <span className="text-[12px] font-bold text-primary whitespace-pre-line leading-snug">{ticket.id}</span>
                </td>
                <td className="py-5 px-3 text-[12.5px] font-bold text-slate-700 whitespace-nowrap align-top">{ticket.name}</td>
                <td className="py-5 px-3 text-[12.5px] text-slate-500 whitespace-nowrap align-top">{ticket.email}</td>
                <td className="py-5 px-3 text-[12.5px] text-slate-500 whitespace-nowrap align-top">{ticket.date}</td>
                <td className="py-5 px-3 text-[12.5px] font-bold text-slate-700 leading-snug align-top whitespace-pre-line pr-4">{ticket.subject}</td>
                <td className="py-5 px-3 text-[12.5px] text-slate-500 leading-relaxed align-top whitespace-pre-line">{ticket.issue}</td>
                <td className="py-5 px-3 text-center align-top pt-4">
                  <div className="flex justify-center mt-1.5">
                    {ticket.status === "Open" && (
                      <span className="inline-flex items-center px-4 py-1 bg-amber-500 border border-amber-500 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                        Open
                      </span>
                    )}
                    {ticket.status === "Pending" && (
                      <span className="inline-flex items-center px-4 py-1 bg-slate-100 border border-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-sm">
                        Pending
                      </span>
                    )}
                    {ticket.status === "Resolved" && (
                      <span className="inline-flex items-center px-4 py-1 bg-emerald-500 border border-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                        Resolved
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-5 pl-3 pr-2 text-center align-top pt-4">
                  <button className="p-1 mt-0.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredTickets.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm font-medium text-slate-400">
                  No tickets found fitting the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupportPage;
