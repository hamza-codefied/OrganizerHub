import React, { useMemo, useState } from 'react';
import { PageHeader, GlassCard } from '../components/UI';
import { 
  Settings as SettingsIcon, Shield, CreditCard, 
  Users, Globe, ToggleLeft, ToggleRight, Save,
  Lock, Key, Zap, ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import ConfirmationDialog from '../components/ConfirmationDialog';
import DetailsDialog from '../components/DetailsDialog';

const SettingsPage = () => {
  type TabKey = 'core' | 'security' | 'financial' | 'team' | 'lexicon';

  type SettingsState = {
    commissionFactor: number;
    minLiquidityRelease: number;
    acceleratedPayouts: boolean;
    preservationMode: boolean;
    automatedProActivation: boolean;
    mfaEnabled: boolean;
    financialTierCap: number;
    maxPropagationBatch: number;
    emergencyActionsAllowed: boolean;
    teamLead: string;
    globalTagline: string;
  };

  const [activeTab, setActiveTab] = useState<TabKey>('core');
  const [settings, setSettings] = useState<SettingsState>({
    commissionFactor: 15,
    minLiquidityRelease: 50,
    acceleratedPayouts: true,
    preservationMode: false,
    automatedProActivation: true,
    mfaEnabled: true,
    financialTierCap: 20,
    maxPropagationBatch: 25,
    emergencyActionsAllowed: false,
    teamLead: 'Ops Lead',
    globalTagline: 'Your events, simplified.',
  });

  const [syncConfirmOpen, setSyncConfirmOpen] = useState(false);
  const [syncDetailsOpen, setSyncDetailsOpen] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [lastSyncedSnapshot, setLastSyncedSnapshot] = useState<SettingsState | null>(null);

  const tabs = useMemo(
    () =>
      [
        { key: 'core' as const, name: 'General', icon: SettingsIcon },
        { key: 'security' as const, name: 'Security', icon: Shield },
        { key: 'financial' as const, name: 'Payments', icon: CreditCard },
        // { key: 'team' as const, name: 'Team', icon: Users },
        { key: 'lexicon' as const, name: 'Branding', icon: Globe },
      ] as const,
    [],
  );

  const syncNow = () => {
    setLastSyncedAt(new Date().toLocaleString());
    setLastSyncedSnapshot(settings);
    setSyncConfirmOpen(false);
    setSyncDetailsOpen(true);
  };

  const setNumberField = (key: keyof SettingsState, value: string) => {
    const num = Number(value);
    setSettings((prev) => ({
      ...prev,
      [key]: Number.isFinite(num) ? num : prev[key],
    }));
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <PageHeader 
        title="Settings" 
        description="Manage platform rules, fees, and security."
      >
        <button
          type="button"
          onClick={() => setSyncConfirmOpen(true)}
          className="flex items-center gap-2 primary-gradient text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 outline-none"
        >
          <Save className="w-4 h-4" />
          Save changes
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-3 space-y-3">
           {tabs.map((tab, i) => (
             <motion.button
               key={tab.key}
               type="button"
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.05 }}
               onClick={() => setActiveTab(tab.key)}
               className={cn(
                 "w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
                 activeTab === tab.key
                   ? "nav-active-item"
                   : "text-slate-400 hover:bg-white/60 hover:text-primary hover:shadow-lg border border-transparent"
               )}
             >
               <tab.icon className="w-5 h-5 shrink-0" />
               {tab.name}
             </motion.button>
           ))}
           
          
        </div>

        <div className="lg:col-span-9 space-y-10">
          {activeTab === 'core' && (
            <GlassCard
              title="General"
              subtitle="Set commission and payout limits."
            >
              <div className="space-y-10 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Commission (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={settings.commissionFactor}
                        onChange={(e) => setNumberField('commissionFactor', e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xl font-black text-slate-800 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-inner"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">%</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Min payout ($)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={settings.minLiquidityRelease}
                        onChange={(e) => setNumberField('minLiquidityRelease', e.target.value)}
                        className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xl font-black text-slate-800 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-inner"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">$</div>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-slate-100 space-y-8">
                  <div className="flex items-center justify-between group">
                    <div className="max-w-md">
                      <p className="font-black text-slate-800 text-base tracking-tight leading-none group-hover:text-primary transition-colors">
                        Fast payouts
                      </p>
                      <p className="text-xs font-bold text-slate-400 mt-2 leading-snug">
                        Pay organizers as soon as a booking is confirmed.
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-pressed={settings.acceleratedPayouts}
                      onClick={() => setSettings((prev) => ({ ...prev, acceleratedPayouts: !prev.acceleratedPayouts }))}
                      className={cn(
                        'cursor-pointer hover:scale-110 transition-transform p-2 rounded-2xl border',
                        settings.acceleratedPayouts
                          ? 'text-primary bg-primary/5 border-primary/10'
                          : 'text-slate-300 bg-slate-50 border-slate-100',
                      )}
                    >
                      {settings.acceleratedPayouts ? <ToggleRight className="w-12 h-12" /> : <ToggleLeft className="w-12 h-12" />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between group">
                    <div className="max-w-md">
                      <p className="font-black text-slate-800 text-base tracking-tight leading-none group-hover:text-secondary transition-colors">
                        Global Preservation Mode
                      </p>
                      <p className="text-xs font-bold text-slate-400 mt-2 leading-snug">
                        Instantly suspend all public-facing application interfaces for high-priority scheduled maintenance events.
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-pressed={settings.preservationMode}
                      onClick={() => setSettings((prev) => ({ ...prev, preservationMode: !prev.preservationMode }))}
                      className={cn(
                        'cursor-pointer hover:scale-110 transition-transform p-2 rounded-2xl border',
                        settings.preservationMode
                          ? 'text-secondary bg-secondary/5 border-secondary/10'
                          : 'text-slate-300 bg-slate-50 border-slate-100',
                      )}
                    >
                      {settings.preservationMode ? <ToggleRight className="w-12 h-12" /> : <ToggleLeft className="w-12 h-12" />}
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === 'security' && (
            <GlassCard
              title="Security"
              subtitle="Manage organizer verification and admin security."
            >
              <div className="space-y-6 mt-8">
                <div className="flex items-center gap-6 p-8 bg-primary/3 rounded-[2rem] border border-primary/10 hover:border-primary/30 transition-all group">
                  <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-primary shadow-xl border border-primary/5 group-hover:rotate-6 transition-all duration-500">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-black text-slate-800 tracking-tighter leading-none">Auto-approve organizers</p>
                    <p className="text-[13px] font-bold text-slate-500 mt-2 leading-snug max-w-sm">
                      New organizers go live automatically after verification.
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={settings.automatedProActivation}
                    onClick={() => setSettings((prev) => ({ ...prev, automatedProActivation: !prev.automatedProActivation }))}
                    className={cn(
                      'cursor-pointer hover:scale-105 transition-all p-2 rounded-2xl border',
                      settings.automatedProActivation
                        ? 'text-primary bg-primary/5 border-primary/10'
                        : 'text-slate-300 bg-slate-50 border-slate-100',
                    )}
                  >
                    {settings.automatedProActivation ? <ToggleRight className="w-14 h-14" /> : <ToggleLeft className="w-14 h-14" />}
                  </button>
                </div>

                <div className="flex items-center gap-6 p-8 bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/60 hover:border-blue-200 transition-all group shadow-sm">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-xl border border-blue-50 group-hover:-rotate-6 transition-all duration-500">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-black text-slate-800 tracking-tighter leading-none">Two-factor authentication</p>
                    <p className="text-[13px] font-bold text-slate-500 mt-2 leading-snug max-w-sm">
                      Require 2FA for all admin accounts.
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={settings.mfaEnabled}
                    onClick={() => setSettings((prev) => ({ ...prev, mfaEnabled: !prev.mfaEnabled }))}
                    className={cn(
                      'cursor-pointer hover:scale-105 transition-all p-2 rounded-2xl border',
                      settings.mfaEnabled
                        ? 'text-primary bg-primary/5 border-primary/10'
                        : 'text-slate-300 bg-slate-50 border-slate-100',
                    )}
                  >
                    {settings.mfaEnabled ? <ToggleRight className="w-14 h-14" /> : <ToggleLeft className="w-14 h-14" />}
                  </button>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === 'financial' && (
            <GlassCard
              title="Payments"
              subtitle="Set commission caps and payment limits."
            >
              <div className="mt-8 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Max commission (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={settings.financialTierCap}
                      onChange={(e) => setNumberField('financialTierCap', e.target.value)}
                      className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xl font-black text-slate-800 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-inner"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">%</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === 'team' && (
            <GlassCard title="Team" subtitle="Set the team lead and permissions.">
              <div className="mt-8 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Team Lead</label>
                  <input
                    type="text"
                    value={settings.teamLead}
                    onChange={(e) => setSettings((prev) => ({ ...prev, teamLead: e.target.value }))}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
                  />
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === 'lexicon' && (
            <GlassCard title="Branding" subtitle="Set your tagline and messaging.">
              <div className="mt-8 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tagline</label>
                  <input
                    type="text"
                    value={settings.globalTagline}
                    onChange={(e) => setSettings((prev) => ({ ...prev, globalTagline: e.target.value }))}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all shadow-inner"
                  />
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      <ConfirmationDialog
        open={syncConfirmOpen}
        title="Save changes?"
        description="Save your settings? (demo only)"
        confirmText="Save"
        cancelText="Cancel"
        onConfirm={syncNow}
        onCancel={() => setSyncConfirmOpen(false)}
      />

      <DetailsDialog
        open={syncDetailsOpen}
        title="Saved"
        onClose={() => setSyncDetailsOpen(false)}
      >
        <div className="space-y-4 mt-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saved at</p>
            <p className="text-sm font-black text-slate-800 mt-1">{lastSyncedAt ?? '—'}</p>
          </div>
          {lastSyncedSnapshot ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Commission</p>
                  <p className="text-sm font-black text-slate-800">{lastSyncedSnapshot.commissionFactor}%</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Min payout</p>
                  <p className="text-sm font-black text-slate-800">${lastSyncedSnapshot.minLiquidityRelease}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fast payouts</p>
                  <p className="text-sm font-black text-slate-800">{lastSyncedSnapshot.acceleratedPayouts ? 'On' : 'Off'}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Maintenance mode</p>
                  <p className="text-sm font-black text-slate-800">{lastSyncedSnapshot.preservationMode ? 'On' : 'Off'}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2FA for admins</p>
                  <p className="text-sm font-black text-slate-800">{lastSyncedSnapshot.mfaEnabled ? 'On' : 'Off'}</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Team lead</p>
                  <p className="text-sm font-black text-slate-800 truncate">{lastSyncedSnapshot.teamLead || '—'}</p>
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tagline</p>
                <p className="text-sm font-bold text-slate-800">{lastSyncedSnapshot.globalTagline || '—'}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm font-bold text-slate-500">No data.</p>
          )}
        </div>
      </DetailsDialog>
    </div>
  );
};

export default SettingsPage;
