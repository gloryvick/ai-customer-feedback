import { Alert, Feedback, Sentiment, Severity } from '@/lib/supabase';
import { sentimentConfig, severityConfig, alertTypeConfig, timeAgo, ratingStars } from '@/lib/constants';
import { AlertTriangle, Clock, Car, MapPin, ArrowUpRight, Bell } from 'lucide-react';

interface EscalationAlertsProps {
  alerts: Alert[];
  feedback: Feedback[];
  onClick?: (feedback: Feedback) => void;
}

export default function EscalationAlerts({ alerts, feedback, onClick }: EscalationAlertsProps) {
  // Use alerts table for active alerts, plus derive from feedback for escalated items
  const activeAlerts = alerts.filter((a) => a.is_active);
  const escalatedFeedback = feedback.filter((f) => f.is_escalated || f.severity === 'critical');

  // Build a unified list: active alerts first, then escalated feedback without an alert
  const alertFeedbackIds = new Set(activeAlerts.map((a) => a.feedback_id));
  const additionalEscalated = escalatedFeedback.filter((f) => !alertFeedbackIds.has(f.id));

  const sortedFeedback = [...escalatedFeedback].sort((a, b) => {
    const sevOrder: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    const sevDiff = sevOrder[a.severity as Severity] - sevOrder[b.severity as Severity];
    if (sevDiff !== 0) return sevDiff;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const totalCount = activeAlerts.length + additionalEscalated.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-rose-50 to-white">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100">
          <AlertTriangle className="w-4.5 h-4.5 text-rose-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-slate-800">Escalation Alerts</h3>
          <p className="text-xs text-slate-500">
            {totalCount > 0
              ? `${totalCount} ${totalCount === 1 ? 'item' : 'items'} require immediate attention`
              : 'No active escalations'}
          </p>
        </div>
        {totalCount > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-100 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            Live
          </span>
        )}
      </div>

      <div className="divide-y divide-slate-100 max-h-[480px] overflow-y-auto">
        {totalCount === 0 && (
          <div className="px-5 py-10 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 mb-3">
              <Bell className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-slate-600">No escalations</p>
            <p className="text-xs text-slate-400 mt-1">All feedback is under control</p>
          </div>
        )}

        {/* Active alerts from alerts table */}
        {activeAlerts.map((alert) => {
          const f = alert.feedback;
          const sevCfg = f ? severityConfig[f.severity as Severity] : null;
          return (
            <div
              key={alert.id}
              onClick={() => f && onClick?.(f)}
              className="group flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className={`mt-1 w-1 h-12 rounded-full ${alert.type === 'Critical' || alert.type === 'Escalation' ? 'bg-rose-500' : 'bg-orange-400'} shrink-0`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${alertTypeConfig[alert.type].bg} ${alertTypeConfig[alert.type].text}`}>
                    {alertTypeConfig[alert.type].label}
                  </span>
                  {f && sevCfg && (
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${sevCfg.bg} ${sevCfg.text}`}>{sevCfg.label}</span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
                    <Clock className="w-3 h-3" /> {timeAgo(alert.created_at)}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                  {alert.message}
                </p>
                {f && (
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Car className="w-3 h-3" /> {f.vehicle_models?.name ?? 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {f.dealerships?.city ?? '—'}
                    </span>
                    <span className="text-amber-400 font-bold">{ratingStars(f.rating)}</span>
                  </div>
                )}
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
            </div>
          );
        })}

        {/* Additional escalated feedback without alerts */}
        {additionalEscalated.map((f) => {
          const sevCfg = severityConfig[f.severity as Severity];
          const sentCfg = sentimentConfig[f.sentiment as Sentiment];
          return (
            <div
              key={f.id}
              onClick={() => onClick?.(f)}
              className="group flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <div className={`mt-1 w-1 h-12 rounded-full ${f.severity === 'critical' ? 'bg-rose-500' : 'bg-orange-400'} shrink-0`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${sevCfg.bg} ${sevCfg.text}`}>{sevCfg.label}</span>
                  {f.is_escalated && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-rose-600">
                      <AlertTriangle className="w-3 h-3" /> Escalated
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
                    <Clock className="w-3 h-3" /> {timeAgo(f.created_at)}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{f.title}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Car className="w-3 h-3" /> {f.vehicle_models?.name ?? 'Unknown'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {f.dealerships?.city ?? '—'}
                  </span>
                  <span className={`font-medium ${sentCfg.text}`}>{sentCfg.label}</span>
                  <span className="text-amber-400 font-bold">{ratingStars(f.rating)}</span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:-translate-y-0.5 transition-all shrink-0 mt-1" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
