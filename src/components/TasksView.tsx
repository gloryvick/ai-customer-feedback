import { Task, TaskPriority, TaskStatus } from '@/lib/supabase';
import { taskPriorityConfig, taskStatusConfig, formatDate } from '@/lib/constants';
import { CheckSquare, User, Calendar, MessageSquareText } from 'lucide-react';
import { EmptyState } from '@/components/States';

interface TasksViewProps {
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
}

export default function TasksView({ tasks, onStatusChange }: TasksViewProps) {
  if (tasks.length === 0) {
    return <EmptyState title="No tasks yet" message="Tasks will appear here when they are created from feedback items." />;
  }

  const sorted = [...tasks].sort((a, b) => {
    const prioOrder: Record<TaskPriority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
    return prioOrder[a.priority] - prioOrder[b.priority];
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sorted.map((task) => {
        const prioCfg = taskPriorityConfig[task.priority as TaskPriority];
        const stCfg = taskStatusConfig[task.status as TaskStatus];
        return (
          <div key={task.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${prioCfg.bg} ${prioCfg.text} ${prioCfg.border}`}>
                {prioCfg.label}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${stCfg.bg} ${stCfg.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${stCfg.dot}`} />
                {stCfg.label}
              </span>
            </div>

            <h3 className="text-base font-bold text-slate-800 mb-2">{task.title}</h3>
            {task.description && (
              <p className="text-sm text-slate-500 mb-3 line-clamp-2">{task.description}</p>
            )}

            <div className="space-y-1.5 mb-4">
              {task.assignee && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {task.assignee}
                </div>
              )}
              {task.due_date && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Due {formatDate(task.due_date)}
                </div>
              )}
              {task.feedback && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <MessageSquareText className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{task.feedback.title}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <select
                value={task.status}
                onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 cursor-pointer hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
}
