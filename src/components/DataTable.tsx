import { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, SlidersHorizontal, Eye, Edit3, Trash2, Ban, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Column<T> {
  header: string;
  accessor: keyof T | string | ((item: T) => React.ReactNode);
  className?: string;
}

export interface RowAction<T> {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: (item: T) => void;
  variant?: 'default' | 'danger' | 'success';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  isLoading?: boolean;
  rowActions?: RowAction<T>[];
  onRowClick?: (item: T) => void;
}

function ActionDropdown<T>({ item, actions }: { item: T; actions: RowAction<T>[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button 
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={cn(
          "p-2.5 rounded-xl transition-all text-slate-400",
          open ? "bg-primary/10 text-primary" : "hover:bg-primary/10 hover:text-primary"
        )}
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 bg-white/95 backdrop-blur-2xl rounded-2xl border border-slate-100 shadow-2xl z-50 py-2 min-w-[180px] overflow-hidden"
          >
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); action.onClick(item); setOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-all text-left",
                  action.variant === 'danger' 
                    ? "text-rose-600 hover:bg-rose-50" 
                    : action.variant === 'success'
                    ? "text-emerald-600 hover:bg-emerald-50" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-primary"
                )}
              >
                <action.icon className="w-4 h-4 shrink-0" />
                {action.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DataTable<T extends { id: string | number }>({ 
  columns, 
  data, 
  searchPlaceholder = "Search records...",
  onSearch,
  rowActions,
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const defaultActions: RowAction<T>[] = [
    { label: 'View Details', icon: Eye, onClick: (item) => onRowClick?.(item) },
    // If the page doesn't provide handlers, at least make the button respond visibly.
    { label: 'Edit Record', icon: Edit3, onClick: (item) => onRowClick?.(item) },
    { label: 'Delete', icon: Trash2, onClick: (item) => onRowClick?.(item), variant: 'danger' },
  ];

  const actions = rowActions || defaultActions;

  const filteredData = searchTerm.trim()
    ? data.filter((item) => {
        try {
          return JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase());
        } catch {
          return false;
        }
      })
    : data;

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pagedData = filteredData.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const pageButtons = Array.from({ length: Math.min(3, totalPages) }).map((_, i) => {
    const candidate = safePage - 1 + i;
    return Math.max(1, Math.min(totalPages, candidate));
  });
  const uniquePageButtons = Array.from(new Set(pageButtons));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 flex-wrap">
        <div className="relative flex-1 max-w-md group w-full">
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            ref={searchRef}
            className="w-full bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl py-3 pl-12 pr-4 focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all outline-none font-medium text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => {
              const v = e.target.value;
              setSearchTerm(v);
              onSearch?.(v);
            }}
          />
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
        </div>
        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            setCurrentPage(1);
            searchRef.current?.focus();
          }}
          className="flex items-center gap-2 px-6 py-3 bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl hover:bg-white hover:border-primary/20 transition-all text-sm font-bold text-slate-600 hover:text-primary hover:shadow-lg shadow-sm w-full sm:w-auto justify-center"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Refine Search
        </button>
      </div>

      <div className="glass-card-premium overflow-hidden border-white/60 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 backdrop-blur-md border-b border-slate-100">
                {columns.map((col, idx) => (
                  <th key={idx} className={cn("px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]", col.className)}>
                    {col.header}
                  </th>
                ))}
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedData.map((item, idx) => (
                <motion.tr 
                  key={item.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={cn(
                    "hover:bg-white/60 transition-colors group",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className={cn("px-8 py-5 text-[13px] font-bold text-slate-700 tracking-tight", col.className)}>
                      {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                  <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                    <ActionDropdown item={item} actions={actions} />
                  </td>
                </motion.tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 italic font-black text-slate-200 text-3xl">!</div>
                      <p className="font-bold text-slate-400">No organizational records found.</p>
                    </div>
                  </td>
                </tr>
              )}

              {data.length !== 0 && pagedData.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 italic font-black text-slate-200 text-3xl">!</div>
                      <p className="font-bold text-slate-400">No matching records found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-8 py-5 flex items-center justify-between border-t border-slate-100 bg-slate-50/30">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none">
            Registry Index <span className="text-slate-800">{(safePage - 1) * itemsPerPage + 1} — {Math.min(safePage * itemsPerPage, filteredData.length)}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-2 border border-slate-200 rounded-xl hover:bg-white transition-all disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5 px-2">
              {uniquePageButtons.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center text-xs font-black rounded-xl transition-all",
                    page === safePage
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "hover:bg-white text-slate-400 hover:text-slate-600"
                  )}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-2 border border-slate-200 rounded-xl hover:bg-white transition-all hover:border-primary/20 hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
