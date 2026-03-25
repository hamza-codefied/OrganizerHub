import React from 'react';
import { ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  className?: string;
  color?: 'primary' | 'secondary' | 'blue' | 'orange' | 'emerald' | 'rose' | 'amber';
}

export const GlassCard: React.FC<{ children: React.ReactNode; className?: string; title?: string; subtitle?: string }> = ({ children, className, title, subtitle }) => {
  return (
    <div className={cn("glass-card-premium p-4 sm:p-6", className)}>
      {(title || subtitle) && (
        <div className="mb-4 sm:mb-8">
          {title && <h3 className="text-base sm:text-lg font-semibold text-slate-800">{title}</h3>}
          {subtitle && <p className="text-xs sm:text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, trend = 'up', className, color = 'primary' }) => {
  const colorMap = {
    primary: "text-primary bg-primary/10 border-primary/20",
    secondary: "text-secondary-500 bg-secondary-500/10 border-secondary-500/20",
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
  };

  return (
    <div className={cn("glass-card-premium p-4 sm:p-6 flex flex-col justify-between h-full", className)}>
      <div className="flex justify-between items-start">
        <div className={cn(
          "w-9 h-9 sm:w-10 sm:h-10 rounded-md flex items-center justify-center border",
          colorMap[color]
        )}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded border",
            trend === 'up'
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-rose-50 text-rose-700 border-rose-100"
          )}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}%
          </div>
        )}
      </div>

      <div className="mt-4 sm:mt-6">
        <p className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        <h2 className="text-xl sm:text-2xl font-semibold mt-1 text-slate-900">{value}</h2>
      </div>
    </div>
  );
};

export const PageHeader: React.FC<{ title: string; description?: string; children?: React.ReactNode }> = ({ title, description, children }) => {
  return (
    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4 mb-8 flex-wrap">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">
          {title}
        </h1>
        {description && <p className="text-sm text-slate-600 max-w-2xl">{description}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
      </div>
    </div>
  );
};


export const PremiumTabs: React.FC<{
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: any) => void;
  className?: string;
}> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn("flex flex-nowrap overflow-x-auto overflow-y-hidden scrollbar-none gap-0 border-b border-slate-200 w-full sm:w-fit max-w-full pb-px", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors",
              isActive
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export interface DashboardStatCardProps {
  title: string;
  value: string | number;
  change: string | number;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  className?: string;
  color?: string;
  timeLabel?: string;
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({ 
  title, value, change, icon: Icon, trend = 'up', className, color = 'primary', timeLabel = 'all time' 
}) => {
  const colorMap: Record<string, string> = {
    primary: "text-primary bg-primary/5",
    secondary: "text-secondary-500 bg-secondary-500/5",
    blue: "text-blue-600 bg-blue-50",
    orange: "text-orange-600 bg-orange-50",
    emerald: "text-emerald-600 bg-emerald-50 text-emerald-500 bg-emerald-50/50",
    pink: "text-pink-600 bg-pink-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
    rose: "text-rose-600 bg-rose-50",
    yellow: "text-yellow-600 bg-yellow-50",
    cyan: "text-cyan-600 bg-cyan-50",
    sky: "text-sky-600 bg-sky-50",
  };

  return (
    <div className={cn("bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300", className)}>
      <div className="flex justify-between items-start">
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">{title}</p>
          <h2 className="text-3xl font-bold text-slate-900 leading-tight">{value}</h2>
        </div>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
          colorMap[color] || colorMap.primary
        )}>
          <Icon className="w-6 h-6" strokeWidth={1.5} />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-1.5 pt-4 border-t border-slate-100/50">
        <span className={cn(
          "text-xs font-bold",
          trend === 'up' ? "text-emerald-500" : "text-rose-500"
        )}>
           {trend === 'up' ? '+' : ''}{change}%
        </span>
        <span className="text-[11px] font-bold text-slate-400 capitalize">{timeLabel}</span>
      </div>
    </div>
  );
};

export const TimeFilterTabs: React.FC<{
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}> = ({ activeTab, onChange, className }) => {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'yearly', label: 'Yearly' },
  ];

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
               "px-4 py-1.5 text-xs font-semibold rounded-md border transition-all duration-200 flex items-center gap-2",
               isActive 
                 ? "bg-rose-400 border-rose-400 text-white shadow-sm"
                 : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export const PremiumBackground = () => null;
