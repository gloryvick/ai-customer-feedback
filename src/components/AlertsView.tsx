import { Alert, AlertType } from '@/lib/supabase';
import { alertTypeConfig, timeAgo } from '@/lib/constants';
import { AlertTriangle, Clock, ArrowUpRight, Bell, BellOff } from 'lucide-react';
import { EmptyState } from '@/components/States';

interface AlertsViewProps {
  alerts: Alert[];
  onToggleActive: (id: string, isActive: boolean) => void;
}

export default function AlertsView({ alerts, onToggleActive }: AlertsViewProps) {
  if (alerts.length === 0) {
    return <EmptyState title="No alerts yet" message="System alerts will appear here when escalations, critical issues, or SLA breaches are detected." />;
  }

  const sorted = [...alerts].sort((a, b) => {
    if (a.is_active !== b.is_active) return a.is_active ? -1 : 1;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-3">
      {sorted.map((alert) => {
        const cfg = alertTypeConfig[alert.type as AlertType] ?? alertTypeConfig.Escalation;
        return (
          <div
            key={alert.id}
            className={`bg-white rounded-2xl border p-5 shadow-sm transition-all ${
              alert.is_active ? 'border-rose-200 ring-1 ring-rose-100' : 'border-slate-200 opacity-60'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${alert.is_active ? 'bg-rose-100' : 'bg-slate-100'}`}>
                {alert.is_active
                  ? <AlertTriangle className={`w-5 h-5 ${alert.is_active ? 'text-rose-500' : 'text-slate-400'} ${alert.is_active ? 'animate-pulse' : ''}`} />
                  : <BellOff className="w-5 h-5 text-slate-400" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                    {cfg.label}
                  </span>
                  {alert.is_active ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                      Active
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Resolved</span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
                    <Clock className="w-3 h-3" /> {timeAgo(alert.created_at)}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-1">{alert.message}</p>
                {alert.feedback && (
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ArrowUpRight className="w-3 h-3" />
                    Related: {alert.feedback.title}
                  </p>
                )}
              </div>
              <button
                onClick={() => onToggleActive(alert.id, !alert.is_active)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all shrink-0 ${
                  alert.is_active
                    ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
              >
                {alert.is_active ? 'Resolve' : 'Reactivate'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
