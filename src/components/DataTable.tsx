import { useState, useRef, useEffect, type ReactNode } from 'react';
import { cn } from '../lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal, Search, X, Eye, Edit3, Trash2 } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | string | ((item: T) => React.ReactNode);
  className?: string;
}

export interface RowAction<T> {
  label: string | ((item: T) => string);
  icon: React.ComponentType<{ className?: string }>;
  onClick: (item: T) => void;
  variant?: 'default' | 'danger' | 'success' | ((item: T) => 'default' | 'danger' | 'success');
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
  belowSearch?: ReactNode;
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
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className={cn(
          "p-2 rounded-md text-slate-500",
          open ? "bg-slate-100 text-primary" : "hover:bg-slate-100"
        )}
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-md border border-slate-200 shadow-md z-50 py-1 min-w-[160px]">
          {actions.map((action, i) => {
            const label = typeof action.label === 'function' ? action.label(item) : action.label;
            const variant = typeof action.variant === 'function' ? action.variant(item) : action.variant;
            
            return (
              <button
                key={i}
                type="button"
                onClick={(e) => { e.stopPropagation(); action.onClick(item); setOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-2 px-3 py-2 text-sm text-left",
                  variant === 'danger' 
                    ? "text-rose-600 hover:bg-rose-50" 
                    : variant === 'success'
                    ? "text-emerald-700 hover:bg-emerald-50" 
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <action.icon className="w-4 h-4 shrink-0" />
                {label}
              </button>
            );
          })}
        </div>
      )}
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
  belowSearch,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const defaultActions: RowAction<T>[] = [
    { label: 'View Details', icon: Eye, onClick: (item) => onRowClick?.(item) },
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md w-full">
          <input 
            type="text" 
            placeholder={searchPlaceholder}
            ref={searchRef}
            className="w-full bg-white border border-slate-200 rounded-md py-2 pl-9 pr-3 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none text-sm"
            value={searchTerm}
            onChange={(e) => {
              const v = e.target.value;
              setSearchTerm(v);
              onSearch?.(v);
            }}
          />
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <button
          type="button"
          onClick={() => {
            setSearchTerm('');
            setCurrentPage(1);
            searchRef.current?.focus();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 w-full sm:w-auto justify-center"
        >
          <X className="w-4 h-4" />
          Clear search
        </button>
      </div>

      {belowSearch != null ? (
        <div className="w-full flex flex-col sm:flex-row sm:items-center gap-3">{belowSearch}</div>
      ) : null}

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {columns.map((col, idx) => (
                  <th key={idx} className={cn("px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide", col.className)}>
                    {col.header}
                  </th>
                ))}
                <th className="px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedData.map((item) => (
                <tr 
                  key={item.id} 
                  className={cn(
                    "hover:bg-slate-50/80",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className={cn("px-4 py-3 text-sm text-slate-700", col.className)}>
                      {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor as keyof T] as React.ReactNode)}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <ActionDropdown item={item} actions={actions} />
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-12 text-center">
                    <p className="text-sm text-slate-500">No organizational records found.</p>
                  </td>
                </tr>
              )}

              {data.length !== 0 && pagedData.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-4 py-12 text-center">
                    <p className="text-sm text-slate-500">No matching records found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 flex items-center justify-between border-t border-slate-200 bg-slate-50/50">
          <p className="text-xs text-slate-500">
            Showing <span className="text-slate-800 font-medium">{(safePage - 1) * itemsPerPage + 1}</span>–<span className="text-slate-800 font-medium">{Math.min(safePage * itemsPerPage, filteredData.length)}</span> of {filteredData.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 border border-slate-200 rounded-md hover:bg-white disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-0.5 px-1">
              {uniquePageButtons.map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "min-w-[2rem] h-8 flex items-center justify-center text-sm rounded-md",
                    page === safePage
                      ? "bg-primary text-white"
                      : "text-slate-500 hover:bg-slate-100"
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
              className="p-1.5 border border-slate-200 rounded-md hover:bg-white disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
