import { Sentiment, Severity, FeedbackStatus, AlertType, TaskPriority, TaskStatus, DraftTone } from '@/lib/supabase';

export const sentimentConfig: Record<Sentiment, { label: string; dot: string; text: string; bg: string; border: string; icon: string }> = {
  positive: {
    label: 'Positive',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-500',
  },
  neutral: {
    label: 'Neutral',
    dot: 'bg-amber-500',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-500',
  },
  negative: {
    label: 'Negative',
    dot: 'bg-rose-500',
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    icon: 'text-rose-500',
  },
};

export const severityConfig: Record<Severity, { label: string; text: string; bg: string; border: string; ring: string }> = {
  low: {
    label: 'Low',
    text: 'text-slate-600',
    bg: 'bg-slate-100',
    border: 'border-slate-200',
    ring: 'ring-slate-200',
  },
  medium: {
    label: 'Medium',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    ring: 'ring-amber-200',
  },
  high: {
    label: 'High',
    text: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    ring: 'ring-orange-200',
  },
  critical: {
    label: 'Critical',
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    ring: 'ring-rose-300',
  },
};

export const statusConfig: Record<FeedbackStatus, { label: string; text: string; bg: string; dot: string }> = {
  new: { label: 'New', text: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' },
  reviewing: { label: 'Reviewing', text: 'text-violet-700', bg: 'bg-violet-50', dot: 'bg-violet-500' },
  resolved: { label: 'Resolved', text: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  escalated: { label: 'Escalated', text: 'text-rose-700', bg: 'bg-rose-50', dot: 'bg-rose-500' },
};

export const alertTypeConfig: Record<AlertType, { label: string; text: string; bg: string; border: string }> = {
  Escalation: { label: 'Escalation', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
  Critical: { label: 'Critical', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
  SLA_Breach: { label: 'SLA Breach', text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
  Negative_Trend: { label: 'Negative Trend', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
};

export const taskPriorityConfig: Record<TaskPriority, { label: string; text: string; bg: string; border: string }> = {
  low: { label: 'Low', text: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
  medium: { label: 'Medium', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200' },
  high: { label: 'High', text: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200' },
  urgent: { label: 'Urgent', text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200' },
};

export const taskStatusConfig: Record<TaskStatus, { label: string; text: string; bg: string; dot: string }> = {
  open: { label: 'Open', text: 'text-blue-700', bg: 'bg-blue-50', dot: 'bg-blue-500' },
  in_progress: { label: 'In Progress', text: 'text-violet-700', bg: 'bg-violet-50', dot: 'bg-violet-500' },
  completed: { label: 'Completed', text: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
};

export const draftToneConfig: Record<DraftTone, { label: string; text: string; bg: string }> = {
  Professional: { label: 'Professional', text: 'text-blue-700', bg: 'bg-blue-50' },
  Empathetic: { label: 'Empathetic', text: 'text-violet-700', bg: 'bg-violet-50' },
  Apologetic: { label: 'Apologetic', text: 'text-rose-700', bg: 'bg-rose-50' },
  Informational: { label: 'Informational', text: 'text-slate-700', bg: 'bg-slate-100' },
};

export function timeAgo(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return '1d ago';
  return `${diffDay}d ago`;
}

export function ratingStars(rating: number): string {
  return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
