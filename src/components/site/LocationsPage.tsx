import { useEffect, useState } from 'react';
import { supabase, Location } from '@/lib/supabase';
import { siteConfig, branchManagers } from '@/lib/siteConfig';
import { SitePage } from '@/components/site/SiteNav';
import { MapPin, Phone, Clock, Navigation, ArrowRight, Loader2, User } from 'lucide-react';

interface LocationsPageProps {
  onNavigate: (page: SitePage) => void;
}

export default function LocationsPage({ onNavigate }: LocationsPageProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    supabase.from('locations').select('*').order('name').then(({ data, error: err }) => {
      if (err || !data) { setError(true); } else { setLocations(data as Location[]); }
      setLoading(false);
    });
  }, []);

  return (
    <div className="pt-20">
      <section className="py-16 bg-gradient-to-br from-slate-950 to-red-950 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-red-300 uppercase tracking-wide">Network Footprint</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">4 Modern Service Locations</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">Strategically located across major Lagos residential and commercial hubs for easy intake and collection.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-red-500 animate-spin" /></div>
          ) : error ? (
            <div className="text-center py-20"><p className="text-sm text-slate-500">Unable to load locations. Please try again later.</p></div>
          ) : locations.length === 0 ? (
            <div className="text-center py-20"><p className="text-sm text-slate-500">No locations available.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {locations.map((loc) => {
                const manager = branchManagers[loc.name] ?? 'Branch Manager';
                return (
                  <div key={loc.id} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-red-200 transition-all duration-300">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-500 shrink-0"><MapPin className="w-6 h-6 text-white" /></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-slate-800">{loc.name}</h3>
                        <p className="text-sm text-slate-500">{loc.address}, {loc.city}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-5 pl-16">
                      <div className="flex items-center gap-2 text-sm text-slate-600"><Navigation className="w-3.5 h-3.5 text-slate-400" />{loc.city}, {loc.region}</div>
                      <div className="flex items-center gap-2 text-sm text-slate-600"><Phone className="w-3.5 h-3.5 text-slate-400" />{siteConfig.phone}</div>
                      <div className="flex items-center gap-2 text-sm text-slate-600"><Clock className="w-3.5 h-3.5 text-slate-400" />{siteConfig.hours}</div>
                      <div className="flex items-center gap-2 text-sm text-slate-600"><User className="w-3.5 h-3.5 text-slate-400" />Mgr: {manager}</div>
                    </div>
                    <div className="pl-16">
                      <button onClick={() => onNavigate('book')} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-500 rounded-lg hover:scale-105 transition-all">Book Here<ArrowRight className="w-4 h-4" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
