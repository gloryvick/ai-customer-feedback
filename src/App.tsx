import { useState, useCallback } from 'react';
import { supabase, Feedback, FeedbackStatus, TaskStatus } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useDashboardData } from '@/lib/useDashboardData';
import Sidebar, { SidebarView } from '@/components/Sidebar';
import FeedbackCard from '@/components/FeedbackCard';
import Analytics from '@/components/Analytics';
import EscalationAlerts from '@/components/EscalationAlerts';
import FeedbackDetailModal from '@/components/FeedbackDetailModal';
import CustomersView from '@/components/CustomersView';
import VisitsView from '@/components/VisitsView';
import TasksView from '@/components/TasksView';
import AlertsView from '@/components/AlertsView';
import LocationsView from '@/components/LocationsView';
import { LoadingState, ErrorState, EmptyState } from '@/components/States';
import { Search, Filter, RefreshCw, Bell, TrendingUp, AlertTriangle, MessageSquareText, CheckCircle2, Clock, Globe } from 'lucide-react';

interface AppProps {
  onExitToSite?: () => void;
}

export default function App({ onExitToSite }: AppProps = {}) {
  const { loading: authLoading } = useAuth();
  const { data, state, errorMsg, reload } = useDashboardData();

  const [view, setView] = useState<SidebarView>('dashboard');
  const [search, setSearch] = useState('');
  const [filterSentiment, setFilterSentiment] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selected, setSelected] = useState<Feedback | null>(null);

  const handleStatusChange = useCallback(async (id: string, status: FeedbackStatus) => {
    const prevFeedback = data.feedback;
    const prevStatus = prevFeedback.find((f) => f.id === id)?.status ?? null;
    // Optimistic update
    data.feedback = prevFeedback.map((f) => (f.id === id ? { ...f, status } : f));
    if (selected?.id === id) setSelected((prev) => (prev ? { ...prev, status } : prev));

    const { error: updateError } = await supabase.from('feedback').update({ status }).eq('id', id);
    if (updateError) {
      data.feedback = prevFeedback;
      reload();
      return;
    }
    // Insert routing event
    await supabase.from('routing_events').insert({
      feedback_id: id,
      from_status: prevStatus,
      to_status: status,
      reason: 'Status updated via dashboard',
    });
  }, [data, selected, reload]);

  const handleEscalate = useCallback(async (id: string, escalate: boolean) => {
    const status: FeedbackStatus = escalate ? 'escalated' : 'reviewing';
    const prevFeedback = data.feedback;
    data.feedback = prevFeedback.map((f) => (f.id === id ? { ...f, is_escalated: escalate, status } : f));
    if (selected?.id === id) setSelected((prev) => (prev ? { ...prev, is_escalated: escalate, status } : prev));

    const { error } = await supabase.from('feedback').update({ is_escalated: escalate, status }).eq('id', id);
    if (error) {
      data.feedback = prevFeedback;
      reload();
      return;
    }

    if (escalate) {
      await supabase.from('alerts').insert({
        feedback_id: id,
        type: 'Escalation',
        message: 'Feedback escalated by dashboard operator',
        is_active: true,
      });
    }
  }, [data, selected, reload]);

  const handleTaskStatusChange = useCallback(async (id: string, status: TaskStatus) => {
    const prevTasks = data.tasks;
    data.tasks = prevTasks.map((t) => (t.id === id ? { ...t, status } : t));
    const { error } = await supabase.from('tasks').update({ status }).eq('id', id);
    if (error) {
      data.tasks = prevTasks;
      reload();
    }
  }, [data, reload]);

  const handleToggleAlert = useCallback(async (id: string, isActive: boolean) => {
    const prevAlerts = data.alerts;
    data.alerts = prevAlerts.map((a) => (a.id === id ? { ...a, is_active: isActive } : a));
    const { error } = await supabase.from('alerts').update({ is_active: isActive }).eq('id', id);
    if (error) {
      data.alerts = prevAlerts;
      reload();
    }
  }, [data, reload]);

  // Derived counts
  const escalatedCount = data.feedback.filter((f) => f.is_escalated).length;
  const newCount = data.feedback.filter((f) => f.status === 'new').length;
  const resolvedCount = data.feedback.filter((f) => f.status === 'resolved').length;
  const reviewingCount = data.feedback.filter((f) => f.status === 'reviewing').length;
  const activeAlertCount = data.alerts.filter((a) => a.is_active).length;
  const openTaskCount = data.tasks.filter((t) => t.status !== 'completed').length;

  // Filtered feedback for lists
  const filtered = data.feedback.filter((f) => {
    if (search) {
      const q = search.toLowerCase();
      const match =
        f.title.toLowerCase().includes(q) ||
        f.body.toLowerCase().includes(q) ||
        (f.customers?.name?.toLowerCase().includes(q) ?? false) ||
        (f.customer_name?.toLowerCase().includes(q) ?? false) ||
        f.component.toLowerCase().includes(q) ||
        (f.vehicle_models?.name?.toLowerCase().includes(q) ?? false);
      if (!match) return false;
    }
    if (filterSentiment !== 'all' && f.sentiment !== filterSentiment) return false;
    if (filterSeverity !== 'all' && f.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && f.status !== filterStatus) return false;
    return true;
  });

  const viewFeedback =
    view === 'escalations'
      ? filtered.filter((f) => f.is_escalated || f.severity === 'critical')
      : filtered;

  const viewTitle: Record<SidebarView, string> = {
    dashboard: 'Feedback Dashboard',
    escalations: 'Escalation Center',
    analytics: 'Analytics & Insights',
    'all-feedback': 'All Feedback',
    customers: 'Customers',
    visits: 'Visits',
    tasks: 'Tasks',
    alerts: 'Alerts',
    locations: 'Locations',
  };

  const viewSubtitle: Record<SidebarView, string> = {
    dashboard: 'Monitor and triage customer feedback in real time',
    escalations: 'Critical issues requiring immediate management attention',
    analytics: 'Trends, sentiment, and performance metrics',
    'all-feedback': 'Browse and manage all customer feedback entries',
    customers: 'View customer profiles and visit history',
    visits: 'Track customer visits across all locations',
    tasks: 'Manage action items derived from feedback',
    alerts: 'System-generated alerts and notifications',
    locations: 'Dealerships and service center locations',
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-slate-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        view={view}
        onViewChange={setView}
        escalatedCount={escalatedCount}
        newCount={newCount}
        totalCount={data.feedback.length}
        alertCount={activeAlertCount}
        taskCount={openTaskCount}
        customerCount={data.customers.length}
        visitCount={data.visits.length}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-3.5 flex items-center gap-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-slate-800">{viewTitle[view]}</h2>
            <p className="text-xs text-slate-500 hidden sm:block">{viewSubtitle[view]}</p>
          </div>

          {/* Search — only on feedback-related views */}
          {(view === 'dashboard' || view === 'escalations' || view === 'all-feedback') && (
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search feedback..."
                className="w-56 lg:w-72 pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-300 transition-all"
              />
            </div>
          )}

          <button
            onClick={reload}
            className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${state === 'loading' ? 'animate-spin' : ''}`} />
          </button>

          <button className="relative p-2 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors">
            <Bell className="w-4 h-4" />
            {activeAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeAlertCount}
              </span>
            )}
          </button>

          {onExitToSite && (
            <button
              onClick={onExitToSite}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all"
              title="Back to website"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Website</span>
            </button>
          )}
        </header>

        {/* Content area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {state === 'loading' ? (
            <LoadingState label="Loading dashboard data..." />
          ) : state === 'error' ? (
            <ErrorState message={errorMsg} onRetry={reload} />
          ) : (
            <>
              {view === 'analytics' ? (
                <Analytics feedback={data.feedback} />
              ) : view === 'dashboard' ? (
                <div className="space-y-6">
                  {/* KPI cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard icon={MessageSquareText} label="Total Feedback" value={data.feedback.length} accent="blue" />
                    <KpiCard icon={Clock} label="Needs Review" value={reviewingCount + newCount} accent="amber" />
                    <KpiCard icon={AlertTriangle} label="Escalated" value={escalatedCount} accent="rose" pulse={escalatedCount > 0} />
                    <KpiCard icon={CheckCircle2} label="Resolved" value={resolvedCount} accent="emerald" />
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Feedback list */}
                    <div className="xl:col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Recent Feedback</h3>
                        <span className="text-xs text-slate-400">{filtered.length} entries</span>
                      </div>
                      {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {filtered.slice(0, 6).map((f) => (
                            <FeedbackCard
                              key={f.id}
                              feedback={f}
                              onStatusChange={handleStatusChange}
                              onEscalate={handleEscalate}
                              onClick={setSelected}
                            />
                          ))}
                        </div>
                      ) : (
                        <EmptyState title="No feedback yet" message="Customer feedback will appear here once it is submitted." />
                      )}
                    </div>

                    {/* Escalation sidebar */}
                    <div className="xl:col-span-1">
                      <EscalationAlerts alerts={data.alerts} feedback={data.feedback} onClick={setSelected} />
                    </div>
                  </div>
                </div>
              ) : view === 'customers' ? (
                <CustomersView customers={data.customers} visits={data.visits} />
              ) : view === 'visits' ? (
                <VisitsView visits={data.visits} />
              ) : view === 'tasks' ? (
                <TasksView tasks={data.tasks} onStatusChange={handleTaskStatusChange} />
              ) : view === 'alerts' ? (
                <AlertsView alerts={data.alerts} onToggleActive={handleToggleAlert} />
              ) : view === 'locations' ? (
                <LocationsView locations={data.locations} />
              ) : (
                /* Escalations + All Feedback views */
                <div className="space-y-5">
                  {/* Filters */}
                  {view !== 'escalations' && (
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Filter className="w-4 h-4" />
                        <span className="font-medium">Filter:</span>
                      </div>
                      <FilterSelect label="Sentiment" value={filterSentiment} onChange={setFilterSentiment} options={[['all', 'All'], ['positive', 'Positive'], ['neutral', 'Neutral'], ['negative', 'Negative']]} />
                      <FilterSelect label="Severity" value={filterSeverity} onChange={setFilterSeverity} options={[['all', 'All'], ['low', 'Low'], ['medium', 'Medium'], ['high', 'High'], ['critical', 'Critical']]} />
                      <FilterSelect label="Status" value={filterStatus} onChange={setFilterStatus} options={[['all', 'All'], ['new', 'New'], ['reviewing', 'Reviewing'], ['resolved', 'Resolved'], ['escalated', 'Escalated']]} />
                      {(filterSentiment !== 'all' || filterSeverity !== 'all' || filterStatus !== 'all' || search) && (
                        <button
                          onClick={() => { setFilterSentiment('all'); setFilterSeverity('all'); setFilterStatus('all'); setSearch(''); }}
                          className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          Clear all
                        </button>
                      )}
                      <span className="text-xs text-slate-400 ml-auto">{viewFeedback.length} results</span>
                    </div>
                  )}

                  {/* Feedback grid */}
                  {viewFeedback.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {viewFeedback.map((f) => (
                        <FeedbackCard
                          key={f.id}
                          feedback={f}
                          onStatusChange={handleStatusChange}
                          onEscalate={handleEscalate}
                          onClick={setSelected}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title={view === 'escalations' ? 'No escalations' : 'No feedback found'}
                      message={view === 'escalations' ? 'There are no escalated or critical feedback items.' : 'Try adjusting your filters or search query.'}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Detail modal */}
      <FeedbackDetailModal
        feedback={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
        onEscalate={handleEscalate}
      />
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, accent, pulse }: { icon: typeof MessageSquareText; label: string; value: number; accent: 'blue' | 'amber' | 'rose' | 'emerald'; pulse?: boolean }) {
  const accents = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
  };
  const a = accents[accent];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${a.bg} ${a.text}`}>
          <Icon className={`w-5 h-5 ${pulse ? 'animate-pulse' : ''}`} />
        </div>
        <TrendingUp className="w-4 h-4 text-slate-300" />
      </div>
      <p className="text-3xl font-bold text-slate-800 leading-none mb-1">{value}</p>
      <p className="text-sm font-medium text-slate-500">{label}</p>
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
      >
        {options.map(([val, lbl]) => (
          <option key={val} value={val}>{lbl}</option>
        ))}
      </select>
    </div>
  );
}
