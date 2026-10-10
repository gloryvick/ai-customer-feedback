import { Feedback, Sentiment, Severity, FeedbackStatus } from '@/lib/supabase';
import { sentimentConfig, severityConfig, statusConfig, timeAgo, ratingStars } from '@/lib/constants';
import { AlertTriangle, Mail, MapPin, Car, ArrowUpRight, Sparkles } from 'lucide-react';

interface FeedbackCardProps {
  feedback: Feedback;
  onStatusChange: (id: string, status: FeedbackStatus) => void;
  onEscalate: (id: string, escalate: boolean) => void;
  onClick?: (feedback: Feedback) => void;
}

export default function FeedbackCard({ feedback, onStatusChange, onEscalate, onClick }: FeedbackCardProps) {
  const sConfig = sentimentConfig[feedback.sentiment as Sentiment];
  const sevConfig = severityConfig[feedback.severity as Severity];
  const stConfig = statusConfig[feedback.status as FeedbackStatus];
  const model = feedback.vehicle_models;
  const dealership = feedback.dealerships;
  const customer = feedback.customers;
  const aiAnalysis = feedback.ai_analysis?.[0];
  const displayName = customer?.name ?? feedback.customer_name ?? 'Unknown Customer';
  const displayEmail = customer?.email ?? feedback.customer_email ?? '';

  return (
    <div
      className={`group relative bg-white rounded-2xl border ${sevConfig.border} hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 cursor-pointer overflow-hidden ${feedback.is_escalated ? 'ring-2 ring-rose-300' : ''}`}
      onClick={() => onClick?.(feedback)}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${sConfig.dot}`} />

      {/* Escalation banner */}
      {feedback.is_escalated && (
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border-b border-rose-100">
          <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />
          <span className="text-xs font-semibold text-rose-700 uppercase tracking-wide">Escalated — Management Attention Required</span>
        </div>
      )}

      <div className="p-5 pl-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${sConfig.bg} ${sConfig.text} ${sConfig.border} border`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sConfig.dot}`} />
                {sConfig.label}
              </span>
              <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${sevConfig.bg} ${sevConfig.text} ${sevConfig.border} border`}>
                {sevConfig.label}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${stConfig.bg} ${stConfig.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${stConfig.dot}`} />
                {stConfig.label}
              </span>
              {aiAnalysis && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200">
                  <Sparkles className="w-3 h-3" />
                  AI
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-800 leading-snug truncate">{feedback.title}</h3>
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
        </div>

        {/* Body */}
        <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">{feedback.body}</p>

        {/* AI summary preview */}
        {aiAnalysis && (
          <div className="flex items-start gap-2 mb-3 p-2.5 rounded-lg bg-violet-50/50 border border-violet-100">
            <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0 mt-0.5" />
            <p className="text-xs text-violet-700 line-clamp-2 leading-relaxed">{aiAnalysis.summary}</p>
          </div>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <Car className="w-3.5 h-3.5 text-slate-400" />
            {model ? `${model.name} ${model.year}` : 'Unknown'}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {dealership ? dealership.name : 'Unknown'}
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            {displayName}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-amber-400 font-bold tracking-tight text-sm">{ratingStars(feedback.rating)}</span>
          </span>
          <span className="ml-auto text-slate-400">{timeAgo(feedback.created_at)}</span>
        </div>

        {/* Component tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-medium text-slate-500 px-2.5 py-1 rounded-lg bg-slate-100">
            {feedback.component}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
          <select
            value={feedback.status}
            onChange={(e) => { e.stopPropagation(); onStatusChange(feedback.id, e.target.value as FeedbackStatus); }}
            onClick={(e) => e.stopPropagation()}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
          >
            <option value="new">New</option>
            <option value="reviewing">Reviewing</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>
          <button
            onClick={(e) => { e.stopPropagation(); onEscalate(feedback.id, !feedback.is_escalated); }}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
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
  );
}
