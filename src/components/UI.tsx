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
    <div className={cn("glass-card-premium p-8", className)}>
      {(title || subtitle) && (
        <div className="mb-8">
          {title && <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">{title}</h3>}
          {subtitle && <p className="text-sm font-medium text-slate-500 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, trend = 'up', className, color = 'primary' }) => {
  const colorMap = {
    primary: "from-primary/20 to-primary/5 text-primary border-primary/20 bg-primary/10",
    secondary: "from-secondary/20 to-secondary/5 text-secondary border-secondary/20 bg-secondary/10",
    blue: "from-blue-500/20 to-blue-500/5 text-blue-500 border-blue-500/20 bg-blue-500/10",
    orange: "from-orange-500/20 to-orange-500/5 text-orange-500 border-orange-500/20 bg-orange-500/10",
    emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-500 border-emerald-500/20 bg-emerald-500/10",
  };

  return (
    <div className={cn("glass-card-premium p-6 flex flex-col justify-between group h-full hover:-translate-y-2 transition-transform duration-300", className)}>
      <div className="flex justify-between items-start">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:rotate-6 shadow-sm border",
          colorMap[color]
        )}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <div className={cn(
            "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border",
            trend === 'up' 
              ? "bg-emerald-50/50 text-emerald-600 border-emerald-100" 
              : "bg-rose-50/50 text-rose-600 border-rose-100"
          )}>
            {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}%
          </div>
        )}
      </div>
      
      <div className="mt-6">
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">{title}</p>
        <h2 className="text-3xl font-black mt-2 tracking-tighter text-slate-800">{value}</h2>
      </div>
    </div>
  );
};

export const PageHeader: React.FC<{ title: string; description?: string; children?: React.ReactNode }> = ({ title, description, children }) => {
  return (
    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-10 flex-wrap">
      <div className="space-y-1">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 leading-tight">
          {title}<span className="text-primary text-5xl">.</span>
        </h1>
        {description && <p className="text-base font-medium text-slate-500 max-w-2xl">{description}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
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
    <div className={cn("flex gap-2 p-1.5 bg-slate-900/[0.03] backdrop-blur-xl rounded-[1.8rem] border border-white/60 shadow-inner w-fit", className)}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.22em] rounded-[1.4rem] overflow-hidden",
              isActive 
                ? "text-white shadow-2xl shadow-secondary/40" 
                : "text-slate-400 hover:text-slate-600 hover:bg-white/40 transition-all duration-300"
            )}
          >
            {isActive && (
              <div
                className="absolute inset-0 bg-secondary z-0 transition-all duration-300"
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const PremiumBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none -z-20">
    <div className="absolute w-[500px] h-[500px] bg-primary/5 top-[-10%] left-[-5%] rounded-full blur-3xl"></div>
    <div className="absolute w-[600px] h-[600px] bg-secondary/5 bottom-[-10%] right-[-5%] rounded-full blur-3xl"></div>
  </div>
);
