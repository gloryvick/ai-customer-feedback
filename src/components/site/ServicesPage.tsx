import { services, images } from '@/lib/siteConfig';
import { SitePage } from '@/components/site/SiteNav';
import { Wrench, Cog, ScanLine, Zap, CircleDot, Wind, CheckCircle2, ArrowRight, Clock } from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (page: SitePage) => void;
}

const iconMap: Record<string, typeof Wrench> = { Wrench, Cog, ScanLine, Zap, CircleDot, Wind };
const serviceImages: Record<string, string> = { oil: images.repair, brake: images.repair, battery: images.diagnostic, ac: images.diagnostic, wheel: images.tire, diagnostic: images.diagnostic, suspension: images.repair, tuneup: images.repair };

export default function ServicesPage({ onNavigate }: ServicesPageProps) {
  return (
    <div className="pt-20">
      <section className="py-16 bg-gradient-to-br from-slate-950 to-red-950 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold text-red-300 uppercase tracking-wide">Our Capabilities</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Comprehensive Vehicle Care</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">From scheduled synthetic oil changes to complex electronic diagnostics and suspension overhauls.</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 space-y-16">
          {services.map((service, idx) => {
            const Icon = iconMap[service.icon] ?? Wrench;
            const reversed = idx % 2 === 1;
            return (
              <div key={service.id} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className={reversed ? 'lg:order-2' : ''}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-500"><Icon className="w-6 h-6 text-white" /></div>
                    <span className="text-xs font-medium text-slate-500 px-2 py-1 rounded-lg bg-slate-100">{service.category}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">{service.name}</h2>
                  <p className="text-slate-500 leading-relaxed mb-3">{service.description}</p>
                  <p className="text-sm font-medium text-slate-600 flex items-center gap-2 mb-5"><Clock className="w-4 h-4 text-red-500" /> Est: {service.duration}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />{feature}</li>
                    ))}
                  </ul>
                  <button onClick={() => onNavigate('book')} className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-600 to-rose-500 rounded-xl shadow-lg shadow-red-900/20 hover:scale-105 transition-all">Book This Service<ArrowRight className="w-4 h-4" /></button>
                </div>
                <div className={`rounded-2xl overflow-hidden shadow-xl ${reversed ? 'lg:order-1' : ''}`}>
                  <img src={serviceImages[service.id]} alt={service.name} className="w-full h-72 object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-12 bg-red-50 border-y border-red-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-600"><span className="font-bold text-red-700">Pricing Transparency:</span> All service costs are provided via clear, itemized custom estimates following an initial diagnostic inspection by our certified technicians, rather than arbitrary quotes.</p>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Not sure which service you need?</h2>
          <p className="text-slate-500 mb-8">Book a computerized diagnostic appointment. Our technicians will identify exactly what your vehicle needs.</p>
          <button onClick={() => onNavigate('book')} className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-red-600 to-rose-500 rounded-xl shadow-xl shadow-red-900/30 hover:scale-105 transition-all">Book a Diagnostic<ArrowRight className="w-5 h-5" /></button>
        </div>
      </section>
    </div>
  );
}
