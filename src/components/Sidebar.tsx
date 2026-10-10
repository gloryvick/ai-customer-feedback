import { useState } from 'react';
import { Car, LayoutDashboard, AlertTriangle, BarChart3, MessageSquareText, Users, CalendarDays, CheckSquare, MapPin, LogOut, ChevronLeft, Settings, Cog } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export type SidebarView = 'dashboard' | 'escalations' | 'analytics' | 'all-feedback' | 'customers' | 'visits' | 'tasks' | 'alerts' | 'locations';

interface SidebarProps {
  view: SidebarView;
  onViewChange: (view: SidebarView) => void;
  escalatedCount: number;
  newCount: number;
  totalCount: number;
  alertCount: number;
  taskCount: number;
  customerCount: number;
  visitCount: number;
}

const navSections: { section: string; items: { id: SidebarView; label: string; icon: typeof LayoutDashboard }[] }[] = [
  {
    section: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'escalations', label: 'Escalations', icon: AlertTriangle },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
  },
  {
    section: 'Operations',
    items: [
      { id: 'all-feedback', label: 'All Feedback', icon: MessageSquareText },
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'visits', label: 'Visits', icon: CalendarDays },
    ],
  },
  {
    section: 'Management',
    items: [
      { id: 'tasks', label: 'Tasks', icon: CheckSquare },
      { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
      { id: 'locations', label: 'Locations', icon: MapPin },
    ],
  },
];

export default function Sidebar({
  view, onViewChange, escalatedCount, newCount, totalCount, alertCount, taskCount, customerCount, visitCount,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut } = useAuth();

  const badgeFor = (id: SidebarView): string | null => {
    if (id === 'escalations' && escalatedCount > 0) return String(escalatedCount);
    if (id === 'dashboard' && newCount > 0) return String(newCount);
    if (id === 'all-feedback') return String(totalCount);
    if (id === 'alerts' && alertCount > 0) return String(alertCount);
    if (id === 'tasks' && taskCount > 0) return String(taskCount);
    if (id === 'customers' && customerCount > 0) return String(customerCount);
    if (id === 'visits' && visitCount > 0) return String(visitCount);
    return null;
  };

  return (
    <aside
      className={`${collapsed ? 'w-20' : 'w-64'} shrink-0 transition-all duration-300 bg-slate-900 flex flex-col h-screen sticky top-0`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 shrink-0 shadow-lg shadow-blue-500/20">
          <Car className="w-6 h-6 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-white font-bold text-lg leading-tight whitespace-nowrap">AutoCare Plus</h1>
            <p className="text-slate-400 text-xs whitespace-nowrap">Operations Portal</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.section} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">{section.section}</p>
            )}
            {section.items.map((item) => {
              const active = view === item.id;
              const badge = badgeFor(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                    active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className={`w-5 h-5 shrink-0 ${active ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                  {!collapsed && <span className="flex-1 text-left whitespace-nowrap">{item.label}</span>}
                  {!collapsed && badge && (
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        item.id === 'escalations' || item.id === 'alerts'
                          ? 'bg-rose-500 text-white animate-pulse'
                          : active
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {badge}
                    </span>
                  )}
                  {collapsed && badge && (item.id === 'escalations' || item.id === 'alerts') && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User section */}
      <div className="px-3 py-3 border-t border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-white text-xs font-bold shrink-0">
              {user?.email?.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate">{user?.email ?? 'Unknown'}</p>
              <p className="text-[10px] text-slate-500">Signed In</p>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
          title="Sign Out"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center gap-2 px-3 py-3 border-t border-slate-800 text-slate-500 hover:text-white transition-colors"
      >
        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        {!collapsed && <span className="text-xs font-medium">Collapse</span>}
      </button>
    </aside>
  );
}
