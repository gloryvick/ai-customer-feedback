import { useEffect, useState, FormEvent } from 'react';
import { supabase, Location } from '@/lib/supabase';
import { services } from '@/lib/siteConfig';
import { SitePage } from '@/components/site/SiteNav';
import { Loader2, CheckCircle2, AlertCircle, ArrowRight, Calendar, Car, User, Mail, Phone, MapPin, FileText } from 'lucide-react';

interface BookPageProps {
  onNavigate: (page: SitePage) => void;
}

const inputClass = 'w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all';

export default function BookPage({ onNavigate }: BookPageProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loadingLocs, setLoadingLocs] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [locationId, setLocationId] = useState('');
  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('locations').select('*').order('name').then(({ data, error: err }) => {
      if (!err && data) setLocations(data as Location[]);
      setLoadingLocs(false);
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: insertError } = await supabase.from('bookings').insert({
      name, email, phone: phone || null, location_id: locationId,
      vehicle_make: vehicleMake, vehicle_model: vehicleModel,
      vehicle_year: vehicleYear ? parseInt(vehicleYear) : null,
      service_type: serviceType, preferred_date: preferredDate, notes: notes || null,
    });
    setSubmitting(false);
    if (insertError) { setError('Failed to submit booking. Please try again.'); return; }
    setSuccess(true);
  };

  const today = new Date().toISOString().split('T')[0];

  if (success) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-6 mx-auto"><CheckCircle2 className="w-8 h-8 text-emerald-500" /></div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Request submitted!</h1>
          <p className="text-slate-500 mb-2">Thanks, {name}! We've received your service request for {serviceType} at {locations.find((l) => l.id === locationId)?.name ?? 'your preferred branch'}.</p>
          <p className="text-sm text-slate-400 mb-8">Our branch service advisor will contact you to verify bay timing. A confirmation will be sent to {email}.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => { setSuccess(false); setName(''); setEmail(''); setPhone(''); setLocationId(''); setVehicleMake(''); setVehicleModel(''); setVehicleYear(''); setServiceType(''); setPreferredDate(''); setNotes(''); }} className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-500 rounded-xl hover:scale-105 transition-all">Request Another Service</button>
            <button onClick={() => onNavigate('home')} className="px-5 py-2.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <section className="py-12 bg-gradient-to-br from-slate-950 to-red-950 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-red-300 uppercase tracking-wide">Request Service</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Submit your service request</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">Submit your request online. Our branch service advisor will verify bay timing with you.</p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
            <div>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2"><User className="w-4 h-4 text-red-500" /> Your Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Full Name *</label><input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" className={inputClass} /></div>
                <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Email *</label><input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={inputClass} /></div>
                <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Phone (optional)</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0801 234 5678" className={inputClass} /></div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2"><Car className="w-4 h-4 text-red-500" /> Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Make *</label><input type="text" required value={vehicleMake} onChange={(e) => setVehicleMake(e.target.value)} placeholder="Toyota" className={inputClass} /></div>
                <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Model *</label><input type="text" required value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} placeholder="Camry" className={inputClass} /></div>
                <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Year (optional)</label><input type="number" min="1900" max="2030" value={vehicleYear} onChange={(e) => setVehicleYear(e.target.value)} placeholder="2023" className={inputClass} /></div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-red-500" /> Service Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Location *</label>
                  {loadingLocs ? (
                    <div className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> Loading locations...</div>
                  ) : (
                    <select required value={locationId} onChange={(e) => setLocationId(e.target.value)} className={inputClass}>
                      <option value="">Select a location</option>
                      {locations.map((loc) => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                    </select>
                  )}
                </div>
                <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Service Type *</label>
                  <select required value={serviceType} onChange={(e) => setServiceType(e.target.value)} className={inputClass}>
                    <option value="">Select a service</option>
                    {services.map((s) => <option key={s.id} value={s.name}>{s.name} (Est: {s.duration})</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Preferred Date *</label><input type="date" required min={today} value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} className={inputClass} /></div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Additional Notes (optional)</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Describe any specific issues or requests..." className={`${inputClass} resize-none`} />
            </div>
            {error && (<div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100"><AlertCircle className="w-4 h-4 text-rose-500 shrink-0" /><p className="text-sm text-rose-600">{error}</p></div>)}
            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-red-600 to-rose-500 rounded-xl shadow-lg shadow-red-900/20 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Confirm Booking<ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
