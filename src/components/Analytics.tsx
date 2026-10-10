import { Feedback, Sentiment, Severity } from '@/lib/supabase';
import { sentimentConfig, severityConfig } from '@/lib/constants';
import { TrendingUp, TrendingDown, Minus, Smile, Frown, Meh, BarChart3 } from 'lucide-react';

interface AnalyticsProps {
  feedback: Feedback[];
}

export default function Analytics({ feedback }: AnalyticsProps) {
  const total = feedback.length;
  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 } as Record<Sentiment, number>;
  const severityCounts = { low: 0, medium: 0, high: 0, critical: 0 } as Record<Severity, number>;
  const componentCounts: Record<string, number> = {};
  const ratingBuckets = [0, 0, 0, 0, 0];
  let ratingSum = 0;

  feedback.forEach((f) => {
    sentimentCounts[f.sentiment as Sentiment]++;
    severityCounts[f.severity as Severity]++;
    componentCounts[f.component] = (componentCounts[f.component] || 0) + 1;
    ratingBuckets[f.rating - 1]++;
    ratingSum += f.rating;
  });

  const avgRating = total > 0 ? (ratingSum / total).toFixed(1) : '0.0';
  const positiveRate = total > 0 ? Math.round((sentimentCounts.positive / total) * 100) : 0;
  const escalationRate = total > 0 ? Math.round((feedback.filter(f => f.is_escalated).length / total) * 100) : 0;

  const sentimentIcons = { positive: Smile, neutral: Meh, negative: Frown };
  const trendIcons = { positive: TrendingUp, negative: TrendingDown, neutral: Minus };

  const maxComponent = Math.max(...Object.values(componentCounts), 1);
  const components = Object.entries(componentCounts).sort((a, b) => b[1] - a[1]);

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-100 mb-4">
          <BarChart3 className="w-7 h-7 text-slate-300" />
        </div>
        <p className="text-sm font-semibold text-slate-600">No analytics data yet</p>
        <p className="text-xs text-slate-400 max-w-xs mt-1">Analytics will populate once feedback is submitted to the system.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Feedback" value={total} subtext="across all channels" accent="blue" />
        <StatCard label="Avg. Rating" value={`${avgRating} / 5`} subtext={`${ratingBuckets[4]} five-star reviews`} accent="amber" />
        <StatCard label="Positive Rate" value={`${positiveRate}%`} subtext={`${sentimentCounts.positive} positive entries`} accent="emerald" />
        <StatCard label="Escalation Rate" value={`${escalationRate}%`} subtext={`${feedback.filter(f => f.is_escalated).length} need attention`} accent="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-5">Sentiment Distribution</h3>
          <div className="space-y-4">
            {(Object.keys(sentimentCounts) as Sentiment[]).map((s) => {
              const count = sentimentCounts[s];
              const pct = total > 0 ? (count / total) * 100 : 0;
              const cfg = sentimentConfig[s];
              const Icon = sentimentIcons[s];
              return (
                <div key={s}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Icon className={`w-4 h-4 ${cfg.icon}`} />
                      {cfg.label}
                    </span>
                    <span className="text-sm font-semibold text-slate-600">{count} <span className="text-slate-400 font-normal">({Math.round(pct)}%)</span></span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cfg.dot} transition-all duration-700 ease-out`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Severity distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-5">Severity Breakdown</h3>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(severityCounts) as Severity[]).map((sev) => {
              const count = severityCounts[sev];
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              const cfg = severityConfig[sev];
              return (
                <div key={sev} className={`rounded-xl border ${cfg.border} ${cfg.bg} p-4`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold uppercase tracking-wide ${cfg.text}`}>{cfg.label}</span>
                    <span className={`text-2xl font-bold ${cfg.text}`}>{count}</span>
                  </div>
                  <span className={`text-xs ${cfg.text} opacity-70`}>{pct}% of total</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Component breakdown */}
      {components.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-5">Feedback by Component</h3>
          <div className="space-y-3">
            {components.map(([comp, count]) => (
              <div key={comp} className="flex items-center gap-3">
                <span className="text-sm font-medium text-slate-600 w-28 shrink-0">{comp}</span>
                <div className="flex-1 h-7 rounded-lg bg-slate-100 overflow-hidden relative">
                  <div
                    className="h-full rounded-lg bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-end pr-2 transition-all duration-700 ease-out"
                    style={{ width: `${(count / maxComponent) * 100}%` }}
                  >
                    <span className="text-xs font-bold text-white">{count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rating distribution */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-5">Rating Distribution</h3>
        <div className="flex items-end justify-between gap-4 h-40">
          {ratingBuckets.map((count, i) => {
            const maxBar = Math.max(...ratingBuckets, 1);
            const heightPct = (count / maxBar) * 100;
            const rating = i + 1;
            const color = rating >= 4 ? 'from-emerald-400 to-emerald-500' : rating >= 3 ? 'from-amber-400 to-amber-500' : 'from-rose-400 to-rose-500';
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-sm font-bold text-slate-600">{count}</span>
                <div className="w-full flex-1 flex items-end">
                  <div
                    className={`w-full rounded-t-lg bg-gradient-to-t ${color} transition-all duration-700 ease-out min-h-[4px]`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-500">{rating}★</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, subtext, accent }: { label: string; value: string | number; subtext: string; accent: 'blue' | 'amber' | 'emerald' | 'rose' }) {
  const accents = {
    blue: 'from-blue-500 to-blue-600',
    amber: 'from-amber-400 to-amber-500',
    emerald: 'from-emerald-400 to-emerald-500',
    rose: 'from-rose-400 to-rose-500',
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-10 h-1 rounded-full bg-gradient-to-r ${accents[accent]} mb-3`} />
      <p className="text-3xl font-bold text-slate-800 leading-none mb-1">{value}</p>
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="text-xs text-slate-400 mt-1">{subtext}</p>
    </div>
  );
}
