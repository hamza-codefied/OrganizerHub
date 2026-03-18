import React, { useMemo, useState } from 'react';
import { PageHeader, GlassCard } from '../components/UI';
import { 
  Settings as SettingsIcon, Shield, CreditCard, Bell, 
  Users, Globe, ToggleLeft, ToggleRight, Save,
  Lock, Key, Zap, ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import ConfirmationDialog from '../components/ConfirmationDialog';
import DetailsDialog from '../components/DetailsDialog';

const SettingsPage = () => {
  type TabKey = 'core' | 'security' | 'financial' | 'propagation' | 'team' | 'lexicon';

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
    globalTagline: 'Strategic command, delivered instantly.',
  });

  const [syncConfirmOpen, setSyncConfirmOpen] = useState(false);
  const [syncDetailsOpen, setSyncDetailsOpen] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [lastSyncedSnapshot, setLastSyncedSnapshot] = useState<SettingsState | null>(null);

  const tabs = useMemo(
    () =>
      [
        { key: 'core' as const, name: 'Core Parameters', icon: SettingsIcon },
        { key: 'security' as const, name: 'Strategic Security', icon: Shield },
        { key: 'financial' as const, name: 'Financial Tiers', icon: CreditCard },
        { key: 'propagation' as const, name: 'Propagation Rules', icon: Bell },
        { key: 'team' as const, name: 'Command Team', icon: Users },
        { key: 'lexicon' as const, name: 'Global Lexicon', icon: Globe },
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
        title="Operational Protocol" 
        description="Configure system-wide parameters, economic rules, and multi-layered security policies."
      >
        <button
          type="button"
          onClick={() => setSyncConfirmOpen(true)}
          className="flex items-center gap-2 primary-gradient text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/20 hover:scale-105 transition-all active:scale-95 outline-none"
        >
          <Save className="w-4 h-4" />
          Synchronize Configuration
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
           
           <div className="mt-10 p-6 bg-slate-50/50 backdrop-blur-md rounded-3xl border border-white/60">
              <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck className="w-5 h-5 text-primary" />
                 <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Protocol Integrity</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 leading-snug">All system changes are logged and audited via the global administrative ledger.</p>
           </div>
        </div>

        <div className="lg:col-span-9 space-y-10">
          {activeTab === 'core' && (
            <GlassCard
              title="Strategic Business Logic"
              subtitle="Determine platform commission velocity and economic thresholds."
            >
              <div className="space-y-10 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                      Platform Commission Factor (%)
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
                      Minimum Liquidity Release ($)
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
                        Accelerated Payouts
                      </p>
                      <p className="text-xs font-bold text-slate-400 mt-2 leading-snug">
                        Allow partners to release platform liquidity via instant protocol immediately upon session verification.
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
              title="Verification Command"
              subtitle="Manage high-level partner vetting and strategic onboarding protocols."
            >
              <div className="space-y-6 mt-8">
                <div className="flex items-center gap-6 p-8 bg-primary/[0.03] rounded-[2rem] border border-primary/10 hover:border-primary/30 transition-all group">
                  <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-primary shadow-xl border border-primary/5 group-hover:rotate-6 transition-all duration-500">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-black text-slate-800 tracking-tighter leading-none">Automated Pro Activation</p>
                    <p className="text-[13px] font-bold text-slate-500 mt-2 leading-snug max-w-sm">
                      Registry entities are indexed and activated instantly post-verification without manual oversight.
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
                    <p className="text-lg font-black text-slate-800 tracking-tighter leading-none">Command Multi-Factor Security</p>
                    <p className="text-[13px] font-bold text-slate-500 mt-2 leading-snug max-w-sm">
                      Strict enforcement of cryptographic 2FA for all administrator and operational oversight accounts.
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
              title="Financial Tiers"
              subtitle="Economic threshold tuning for tiered releases and commission caps."
            >
              <div className="mt-8 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Tier Commission Cap (%)</label>
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

          {activeTab === 'propagation' && (
            <GlassCard
              title="Propagation Rules"
              subtitle="Control how updates are batched and suspended during maintenance windows."
            >
              <div className="mt-8 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Max Batch Size</label>
                  <input
                    type="number"
                    value={settings.maxPropagationBatch}
                    onChange={(e) => setNumberField('maxPropagationBatch', e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-xl font-black text-slate-800 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 outline-none transition-all shadow-inner"
                  />
                </div>

                <div className="flex items-center justify-between group">
                  <div className="max-w-md">
                    <p className="font-black text-slate-800 text-base tracking-tight leading-none group-hover:text-primary transition-colors">
                      Allow Emergency Propagation Actions
                    </p>
                    <p className="text-xs font-bold text-slate-400 mt-2 leading-snug">
                      Enables emergency overrides from the command team during critical incidents.
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={settings.emergencyActionsAllowed}
                    onClick={() => setSettings((prev) => ({ ...prev, emergencyActionsAllowed: !prev.emergencyActionsAllowed }))}
                    className={cn(
                      'cursor-pointer hover:scale-110 transition-transform p-2 rounded-2xl border',
                      settings.emergencyActionsAllowed
                        ? 'text-primary bg-primary/5 border-primary/10'
                        : 'text-slate-300 bg-slate-50 border-slate-100',
                    )}
                  >
                    {settings.emergencyActionsAllowed ? <ToggleRight className="w-12 h-12" /> : <ToggleLeft className="w-12 h-12" />}
                  </button>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === 'team' && (
            <GlassCard title="Command Team" subtitle="Define the operational lead and allowed oversight behavior.">
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
            <GlassCard title="Global Lexicon" subtitle="Tune the platform’s tone and system-wide label messaging.">
              <div className="mt-8 space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Primary Tagline</label>
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
        title="Confirm Synchronization"
        description="Apply your configuration changes to the CMS mock state (client-side only)."
        confirmText="Synchronize"
        cancelText="Cancel"
        onConfirm={syncNow}
        onCancel={() => setSyncConfirmOpen(false)}
      />

      <DetailsDialog
        open={syncDetailsOpen}
        title="Configuration Synchronized"
        onClose={() => setSyncDetailsOpen(false)}
      >
        <div className="space-y-4 mt-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Synced</p>
            <p className="text-sm font-black text-slate-800 mt-1">{lastSyncedAt ?? '—'}</p>
          </div>
          {lastSyncedSnapshot ? (
            <pre className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-bold text-slate-600 overflow-auto">
              {JSON.stringify(lastSyncedSnapshot, null, 2)}
            </pre>
          ) : (
            <p className="text-sm font-bold text-slate-500">No snapshot available.</p>
          )}
        </div>
      </DetailsDialog>
    </div>
  );
};

export default SettingsPage;
