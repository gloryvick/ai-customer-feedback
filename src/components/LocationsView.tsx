import { Location } from '@/lib/supabase';
import { MapPin, Building2, Navigation } from 'lucide-react';
import { EmptyState } from '@/components/States';

interface LocationsViewProps {
  locations: Location[];
}

export default function LocationsView({ locations }: LocationsViewProps) {
  if (locations.length === 0) {
    return <EmptyState title="No locations yet" message="Dealerships and service centers will appear here once they are added." />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {locations.map((loc) => (
        <div key={loc.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-bold text-slate-800 truncate">{loc.name}</h3>
              <span className="text-xs font-medium text-slate-500 px-2 py-0.5 rounded-lg bg-slate-100 inline-block mt-1">
                {loc.region}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2 text-sm text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
              <span>{loc.address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Navigation className="w-3.5 h-3.5 text-slate-400" />
              <span>{loc.city}, {loc.region}</span>
            </div>
            {loc.lat !== null && loc.lng !== null && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-100">
                <span>Lat: {Number(loc.lat).toFixed(4)}</span>
                <span>·</span>
                <span>Lng: {Number(loc.lng).toFixed(4)}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
