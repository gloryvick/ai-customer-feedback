import { Loader2, AlertCircle, Inbox } from 'lucide-react';

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-50 mb-4">
        <AlertCircle className="w-7 h-7 text-rose-500" />
      </div>
      <p className="text-sm font-semibold text-slate-700 mb-1">Something went wrong</p>
      <p className="text-xs text-slate-500 max-w-xs mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export function EmptyState({ title = 'Nothing here yet', message = 'Data will appear here once it becomes available.' }: { title?: string; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 mb-4">
        <Inbox className="w-7 h-7 text-slate-300" />
      </div>
      <p className="text-sm font-semibold text-slate-600">{title}</p>
      <p className="text-xs text-slate-400 max-w-xs mt-1">{message}</p>
    </div>
  );
}
