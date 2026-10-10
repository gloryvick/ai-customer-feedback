import { Visit } from '@/lib/supabase';
import { formatDate } from '@/lib/constants';
import { CalendarDays, Car, MapPin, User, FileText } from 'lucide-react';
import { EmptyState } from '@/components/States';

interface VisitsViewProps {
  visits: Visit[];
}

const serviceTypeColors: Record<string, string> = {
  Purchase: 'bg-blue-50 text-blue-700 border-blue-200',
  Maintenance: 'bg-amber-50 text-amber-700 border-amber-200',
  Repair: 'bg-rose-50 text-rose-700 border-rose-200',
  'Test Drive': 'bg-violet-50 text-violet-700 border-violet-200',
  Warranty: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function VisitsView({ visits }: VisitsViewProps) {
  if (visits.length === 0) {
    return <EmptyState title="No visits yet" message="Customer visits will appear here once they are logged in the system." />;
  }

  return (
    <div className="space-y-3">
      {visits.map((visit) => {
        const customer = visit.customers;
        const location = visit.locations;
        const model = visit.vehicle_models;
        const typeColor = serviceTypeColors[visit.service_type] ?? 'bg-slate-50 text-slate-700 border-slate-200';
        return (
          <div key={visit.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-slate-100 shrink-0">
                <CalendarDays className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${typeColor}`}>
                    {visit.service_type}
                  </span>
                  <span className="text-xs text-slate-400">{formatDate(visit.visit_date)}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{customer?.name ?? '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Car className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{model ? `${model.name} ${model.year}` : '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{location?.name ?? '—'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="text-xs text-slate-400">{location?.city}, {location?.region}</span>
                  </div>
                </div>
                {visit.notes && (
                  <div className="flex items-start gap-2 mt-3 pt-3 border-t border-slate-100">
                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-500 italic">{visit.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
