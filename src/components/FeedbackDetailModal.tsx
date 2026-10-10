import { Feedback, Sentiment, Severity, FeedbackStatus, RoutingEvent, ResponseDraft, DraftTone } from '@/lib/supabase';
import { sentimentConfig, severityConfig, statusConfig, ratingStars, timeAgo, formatDate, draftToneConfig } from '@/lib/constants';
import { X, Mail, MapPin, Car, Calendar, User, Tag, Star, AlertTriangle, Sparkles, GitBranch, FileText, Send, CheckCircle2 } from 'lucide-react';

interface FeedbackDetailModalProps {
  feedback: Feedback | null;
  onClose: () => void;
  onStatusChange: (id: string, status: FeedbackStatus) => void;
  onEscalate: (id: string, escalate: boolean) => void;
}

export default function FeedbackDetailModal({ feedback, onClose, onStatusChange, onEscalate }: FeedbackDetailModalProps) {
  if (!feedback) return null;
  const sConfig = sentimentConfig[feedback.sentiment as Sentiment];
  const sevConfig = severityConfig[feedback.severity as Severity];
  const stConfig = statusConfig[feedback.status as FeedbackStatus];
  const model = feedback.vehicle_models;
  const dealership = feedback.dealerships;
  const customer = feedback.customers;
  const visit = feedback.visits;
  const aiAnalysis = feedback.ai_analysis?.[0];
  const routingEvents = feedback.routing_events ?? [];
  const responseDrafts = feedback.response_drafts ?? [];
  const displayName = customer?.name ?? feedback.customer_name ?? 'Unknown';
  const displayEmail = customer?.email ?? feedback.customer_email ?? '—';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-start justify-between gap-4 z-10">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${sConfig.bg} ${sConfig.text} ${sConfig.border} border`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sConfig.dot}`} />
                {sConfig.label}
              </span>
              <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full ${sevConfig.bg} ${sevConfig.text} ${sevConfig.border} border`}>
                {sevConfig.label}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${stConfig.bg} ${stConfig.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${stConfig.dot}`} />
                {stConfig.label}
              </span>
              {feedback.is_escalated && (
                <span className="flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="w-3 h-3" /> Escalated
                </span>
              )}
              {aiAnalysis && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                  <Sparkles className="w-3 h-3" /> AI Analyzed
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-800 leading-snug">{feedback.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Rating */}
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="text-2xl font-bold text-amber-500">{feedback.rating}.0</span>
            <span className="text-lg text-amber-300 tracking-tight">{ratingStars(feedback.rating)}</span>
            <span className="text-sm text-slate-400 ml-1">out of 5</span>
          </div>

          {/* Feedback text */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Feedback</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{feedback.body}</p>
          </div>

          {/* AI Analysis */}
          {aiAnalysis && (
            <div className="rounded-xl border border-violet-200 bg-violet-50/50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <h4 className="text-sm font-bold text-violet-800">AI Analysis</h4>
                <span className="text-xs text-violet-500 ml-auto">
                  {Math.round(aiAnalysis.confidence * 100)}% confidence
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{aiAnalysis.summary}</p>
              {aiAnalysis.key_issues.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5">Key Issues</p>
                  <div className="flex flex-wrap gap-1.5">
                    {aiAnalysis.key_issues.map((issue, i) => (
                      <span key={i} className="text-xs font-medium px-2 py-1 rounded-lg bg-white border border-violet-200 text-violet-700">
                        {issue}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {aiAnalysis.suggested_actions.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-1.5">Suggested Actions</p>
                  <ul className="space-y-1">
                    {aiAnalysis.suggested_actions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <DetailRow icon={User} label="Customer" value={displayName} />
            <DetailRow icon={Mail} label="Email" value={displayEmail} />
            <DetailRow icon={Car} label="Vehicle" value={model ? `${model.name} ${model.year} (${model.category})` : '—'} />
            <DetailRow icon={MapPin} label="Dealership" value={dealership ? `${dealership.name}, ${dealership.city}` : '—'} />
            <DetailRow icon={Tag} label="Component" value={feedback.component} />
            <DetailRow icon={Calendar} label="Submitted" value={formatDate(feedback.created_at)} />
          </div>

          {/* Visit info */}
          {visit && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">Linked Visit</h4>
              <div className="grid grid-cols-2 gap-4">
                <DetailRow icon={Calendar} label="Visit Date" value={formatDate(visit.visit_date)} />
                <DetailRow icon={Tag} label="Service Type" value={visit.service_type} />
                <DetailRow icon={MapPin} label="Location" value={visit.locations?.name ?? '—'} />
                <DetailRow icon={Car} label="Vehicle" value={visit.vehicle_models?.name ?? '—'} />
              </div>
              {visit.notes && (
                <p className="text-xs text-slate-500 mt-3 italic">{visit.notes}</p>
              )}
            </div>
          )}

          {/* Routing Events */}
          {routingEvents.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <GitBranch className="w-4 h-4" /> Routing History
              </h4>
              <div className="space-y-2">
                {routingEvents.map((event: RoutingEvent) => (
                  <div key={event.id} className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      {event.from_status && (
                        <span className="text-xs font-medium px-2 py-1 rounded-lg bg-slate-100 text-slate-600">{event.from_status}</span>
                      )}
                      <span className="text-slate-400">→</span>
                      <span className="text-xs font-medium px-2 py-1 rounded-lg bg-blue-50 text-blue-700">{event.to_status}</span>
                    </div>
                    {event.assigned_to && (
                      <span className="text-xs text-slate-500">to {event.assigned_to}</span>
                    )}
                    <span className="text-xs text-slate-400 ml-auto">{timeAgo(event.created_at)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Response Drafts */}
          {responseDrafts.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Response Drafts
              </h4>
              <div className="space-y-2">
                {responseDrafts.map((draft: ResponseDraft) => {
                  const toneCfg = draftToneConfig[draft.tone as DraftTone] ?? draftToneConfig.Professional;
                  return (
                    <div key={draft.id} className="rounded-xl border border-slate-200 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${toneCfg.bg} ${toneCfg.text}`}>
                          {toneCfg.label}
                        </span>
                        {draft.is_sent ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                            <Send className="w-3 h-3" /> Sent
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400">Draft</span>
                        )}
                        <span className="text-xs text-slate-400 ml-auto">{timeAgo(draft.created_at)}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{draft.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-slate-500">Update Status</label>
              <select
                value={feedback.status}
                onChange={(e) => onStatusChange(feedback.id, e.target.value as FeedbackStatus)}
                className="text-sm font-medium px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="resolved">Resolved</option>
                <option value="escalated">Escalated</option>
              </select>
            </div>
            <button
              onClick={() => onEscalate(feedback.id, !feedback.is_escalated)}
              className={`mt-5 text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                feedback.is_escalated
                  ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              {feedback.is_escalated ? 'De-escalate' : 'Escalate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-50 shrink-0">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-slate-700 truncate">{value}</p>
      </div>
    </div>
  );
}
