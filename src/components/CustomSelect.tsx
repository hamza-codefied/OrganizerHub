import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/utils';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select option',
  disabled,
  className,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedLabel = useMemo(() => {
    if (!value) return '';
    return options.find((o) => o.value === value)?.label ?? '';
  }, [options, value]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  const display = selectedLabel || placeholder;

  return (
    <div ref={rootRef} className={cn('relative w-full', className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          'w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold outline-none',
          'focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all',
          'flex items-center justify-between gap-3',
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        )}
        role="combobox"
        aria-expanded={open}
      >
        <span className={cn(!selectedLabel && 'text-slate-400', selectedLabel && 'text-slate-800', 'truncate')}>
          {display}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-slate-400 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[200] mt-2 w-full bg-white/90 backdrop-blur-md border border-slate-100 rounded-[1.5rem] shadow-2xl overflow-hidden"
          >
            <div className="max-h-64 overflow-auto">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  No options
                </div>
              ) : (
                options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={opt.disabled}
                      onClick={() => {
                        if (opt.disabled) return;
                        onChange(opt.value);
                        setOpen(false);
                      }}
                      className={cn(
                        'w-full text-left px-5 py-3 text-sm font-bold transition-colors',
                        opt.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                        isSelected
                          ? 'bg-primary/10 text-primary'
                          : 'bg-transparent text-slate-700 hover:bg-slate-50',
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

