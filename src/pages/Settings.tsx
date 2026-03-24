import React, { useMemo, useState } from 'react';
import { PageHeader, GlassCard } from '../components/UI';
import { 
  Settings as SettingsIcon, Shield, CreditCard, 
  Users, Globe, ToggleLeft, ToggleRight, Save,
  Zap
} from 'lucide-react';
import { cn } from '../lib/utils';
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
        { key: 'team' as const, name: 'Team', icon: Users },
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
    <div className="space-y-6 sm:space-y-12">
      <PageHeader 
        title="Settings" 
        description="Platform rules & security."
      >
        <button
          type="button"
          onClick={() => setSyncConfirmOpen(true)}
          className="flex items-center justify-center gap-2 primary-gradient text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95 outline-none w-full sm:w-auto"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </PageHeader>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        <div className="lg:w-1/4 flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-2 scrollbar-none">
           {tabs.map((tab) => (
             <button
               key={tab.key}
               type="button"
               onClick={() => setActiveTab(tab.key)}
               className={cn(
                 "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-left transition-all shrink-0 lg:shrink",
                 activeTab === tab.key
                   ? "bg-primary text-white shadow-lg shadow-primary/20"
                   : "text-slate-400 hover:bg-slate-50 border border-slate-100"
               )}
             >
               <tab.icon className="w-4 h-4 shrink-0" />
               <span>{tab.name}</span>
             </button>
           ))}
        </div>

        <div className="lg:flex-1 space-y-6 lg:space-y-10">
          {activeTab === 'core' && (
            <GlassCard
              title="General"
              subtitle="Limits & Fees"
            >
              <div className="space-y-8 mt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Commission (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={settings.commissionFactor}
                        onChange={(e) => setNumberField('commissionFactor', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-lg font-black text-slate-800 focus:bg-white focus:border-primary/20 transition-all shadow-inner"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">%</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Min Payout ($)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={settings.minLiquidityRelease}
                        onChange={(e) => setNumberField('minLiquidityRelease', e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-lg font-black text-slate-800 focus:bg-white focus:border-primary/20 transition-all shadow-inner"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">$</div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100 space-y-6">
                  <div className="flex items-center justify-between gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100 transition-all">
                    <div className="flex-1">
                      <p className="font-black text-slate-800 text-sm tracking-tight">
                        Maintenance Mode
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 leading-snug">
                        Instantly suspend all public interfaces.
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-pressed={settings.preservationMode}
                      onClick={() => setSettings((prev) => ({ ...prev, preservationMode: !prev.preservationMode }))}
                      className={cn(
                        'cursor-pointer transition-all p-1 rounded-xl border',
                        settings.preservationMode
                          ? 'text-secondary bg-white border-secondary/20 shadow-sm'
                          : 'text-slate-300 bg-white border-slate-100',
                      )}
                    >
                      {settings.preservationMode ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                    </button>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === 'security' && (
            <GlassCard
              title="Security"
              subtitle="Verification & Access"
            >
              <div className="space-y-4 mt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-6 sm:p-8 bg-primary/5 rounded-3xl border border-primary/10 transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-lg border border-primary/5 shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-black text-slate-800 tracking-tight">Auto-approve Organizers</p>
                    <p className="text-[11px] font-bold text-slate-500 mt-1 leading-snug">
                      New organizers go live automatically after verification.
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={settings.automatedProActivation}
                    onClick={() => setSettings((prev) => ({ ...prev, automatedProActivation: !prev.automatedProActivation }))}
                    className={cn(
                      'cursor-pointer hover:scale-105 transition-all p-1 rounded-xl border sm:ml-auto self-end sm:self-center',
                      settings.automatedProActivation
                        ? 'text-primary bg-white border-primary/20 shadow-sm'
                        : 'text-slate-300 bg-white border-slate-100',
                    )}
                  >
                    {settings.automatedProActivation ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10" />}
                  </button>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === 'financial' && (
            <GlassCard
              title="Payments"
              subtitle="Limits & Caps"
            >
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Max Commission (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={settings.financialTierCap}
                      onChange={(e) => setNumberField('financialTierCap', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-3.5 text-lg font-black text-slate-800 focus:bg-white focus:border-primary/20 transition-all shadow-inner"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">%</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === 'team' && (
            <GlassCard title="Team" subtitle="Ops & Permissions">
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Team Lead</label>
                  <input
                    type="text"
                    value={settings.teamLead}
                    onChange={(e) => setSettings((prev) => ({ ...prev, teamLead: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:bg-white focus:border-primary/20 transition-all shadow-inner"
                  />
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === 'lexicon' && (
            <GlassCard title="Branding" subtitle="Platform Messaging">
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tagline</label>
                  <input
                    type="text"
                    value={settings.globalTagline}
                    onChange={(e) => setSettings((prev) => ({ ...prev, globalTagline: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-black text-slate-800 outline-none focus:bg-white focus:border-primary/20 transition-all shadow-inner"
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
        description="Apply these settings to the platform."
        confirmText="Save"
        cancelText="Cancel"
        onConfirm={syncNow}
        onCancel={() => setSyncConfirmOpen(false)}
      />

      <DetailsDialog
        open={syncDetailsOpen}
        title="Settings Applied"
        onClose={() => setSyncDetailsOpen(false)}
      >
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Applied at</p>
            <p className="text-sm font-black text-slate-800 mt-1">{lastSyncedAt ?? '—'}</p>
          </div>
          {lastSyncedSnapshot && (
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Commission</p>
                  <p className="text-sm font-black text-slate-800 text-center">{lastSyncedSnapshot.commissionFactor}%</p>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Payout</p>
                  <p className="text-sm font-black text-slate-800 text-center">${lastSyncedSnapshot.minLiquidityRelease}</p>
                </div>
            </div>
          )}
        </div>
      </DetailsDialog>
    </div>
  );
};

export default SettingsPage;
