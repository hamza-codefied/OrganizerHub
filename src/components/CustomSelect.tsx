import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
          'w-full bg-white border border-slate-200 rounded-md py-2.5 px-3 text-sm outline-none',
          'focus:border-primary focus:ring-1 focus:ring-primary/20',
          'flex items-center justify-between gap-2',
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
        )}
        role="combobox"
        aria-expanded={open}
      >
        <span className={cn(!selectedLabel && 'text-slate-400', selectedLabel && 'text-slate-800', 'truncate')}>
          {display}
        </span>
        <ChevronDown className={cn('w-4 h-4 text-slate-400 shrink-0', open && 'rotate-180')} />
      </button>

      {open && !disabled && (
        <div className="absolute z-[200] mt-1 w-full bg-white border border-slate-200 rounded-md shadow-md overflow-hidden">
          <div className="max-h-64 overflow-auto">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-400">No options</div>
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
                      'w-full text-left px-3 py-2 text-sm',
                      opt.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
                      isSelected
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-slate-700 hover:bg-slate-50',
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
