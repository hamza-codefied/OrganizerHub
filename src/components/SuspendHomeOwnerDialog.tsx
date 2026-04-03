import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export type SuspendHomeOwnerDialogProps = {
  open: boolean;
  title?: string;
  ownerLabel?: string;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: (message: string) => void | Promise<void>;
};

export default function SuspendHomeOwnerDialog({
  open,
  title = 'Suspend home owner',
  ownerLabel,
  loading = false,
  error = null,
  onClose,
  onConfirm,
}: SuspendHomeOwnerDialogProps) {
  const [message, setMessage] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setMessage('');
      setLocalError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && !loading) onClose();
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, loading, onClose]);

  if (!open || typeof document === 'undefined') return null;

  const displayError = error ?? localError;

  const handleSubmit = async () => {
    const trimmed = message.trim();
    if (!trimmed) {
      setLocalError('A reason is required to suspend this account.');
      return;
    }
    setLocalError(null);
    await onConfirm(trimmed);
  };

  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div onClick={() => !loading && onClose()} className="absolute inset-0 bg-slate-900/40" aria-hidden />

      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-lg border border-slate-200 shadow-lg p-6"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
            {ownerLabel && <p className="text-sm text-slate-600 mt-1">{ownerLabel}</p>}
            <p className="text-sm text-slate-600 mt-2">
              Provide a reason for suspension. This will be sent to the server with the request.
            </p>
          </div>
          <button
            type="button"
            onClick={() => !loading && onClose()}
            className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <label className="block">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Reason</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={loading}
            rows={4}
            className={cn(
              'mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-800',
              'placeholder:text-slate-400 focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none resize-y min-h-[100px]',
              loading && 'opacity-60 cursor-not-allowed',
            )}
            placeholder="e.g. Policy violation, fraud concern…"
          />
        </label>

        {displayError && (
          <p className="mt-3 text-sm text-rose-600 border border-rose-100 bg-rose-50 rounded-md px-3 py-2">{displayError}</p>
        )}

        <div className="flex gap-2 justify-end mt-6">
          <button
            type="button"
            onClick={() => !loading && onClose()}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Suspend
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
