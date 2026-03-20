import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  className?: string;
  color?: 'primary' | 'secondary' | 'blue' | 'orange' | 'emerald';
}

export const GlassCard: React.FC<{ children: React.ReactNode; className?: string; title?: string; subtitle?: string }> = ({ children, className, title, subtitle }) => {
  return (
    <div className={cn("glass-card-premium p-6", className)}>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
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
  };

  return (
    <div className={cn("glass-card-premium p-6 flex flex-col justify-between h-full", className)}>
      <div className="flex justify-between items-start">
        <div className={cn(
          "w-10 h-10 rounded-md flex items-center justify-center border",
          colorMap[color]
        )}>
          <Icon className="w-5 h-5" />
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border",
            trend === 'up'
              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
              : "bg-rose-50 text-rose-700 border-rose-100"
          )}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}%
          </div>
        )}
      </div>

      <div className="mt-6">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{title}</p>
        <h2 className="text-2xl font-semibold mt-1 text-slate-900">{value}</h2>
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
    <div className={cn("flex flex-wrap gap-0 border-b border-slate-200 w-fit max-w-full", className)}>
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

export const PremiumBackground = () => null;
