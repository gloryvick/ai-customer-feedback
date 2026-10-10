import { siteConfig, services, stats, standardOfService, processSteps, images } from '@/lib/siteConfig';
import { SitePage } from '@/components/site/SiteNav';
import { ArrowRight, Star, Wrench, Cog, ScanLine, Zap, CircleDot, Wind, Quote, MapPin, Phone, Clock, CheckCircle2, FileText, Shield, Smartphone, Building2 } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: SitePage) => void;
}

const iconMap: Record<string, typeof Wrench> = { Wrench, Cog, ScanLine, Zap, CircleDot, Wind };
const standardIcons = [ScanLine, FileText, Smartphone, Building2];

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[720px] flex items-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <img src={images.hero} alt={images.heroAlt} className="w-full h-full object-cover grayscale-[20%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/35" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_45%,rgba(220,38,38,0.18),transparent_30%)]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-red-300 mb-6">
              <span className="h-px w-10 bg-red-500" />
              {siteConfig.tagline}
            </div>
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 mb-6">
              <span className="flex items-center gap-0.5 text-amber-400">
                {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />)}
              </span>
              <span className="text-xs font-medium text-white/90">{siteConfig.locationCount}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[0.98] tracking-tight mb-6">
              Reliable car care<br />
              <span className="text-red-500">without the guesswork.</span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8 max-w-xl">{siteConfig.description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => onNavigate('book')} className="flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-red-600 rounded-xl shadow-xl shadow-red-900/30 hover:bg-red-500 hover:scale-105 transition-all">Book a Service<ArrowRight className="w-5 h-5" /></button>
              <button onClick={() => onNavigate('locations')} className="flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all">Find a Location</button>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8">
              {['Certified Mechanics', 'Itemized Estimates', '4 City Centers', 'OEM Quality Parts'].map((item) => (
                <span key={item} className="flex items-center gap-1.5 text-sm text-slate-300"><CheckCircle2 className="w-4 h-4 text-red-400" />{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Standard of Service */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-red-600 uppercase tracking-[0.16em]">Standard of Service</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Diagnostic First Policy</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {standardOfService.map((item, idx) => {
              const Icon = standardIcons[idx] ?? Shield;
              return (
                <div key={item.title} className="p-6 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-rose-500 mb-4"><Icon className="w-6 h-6 text-white" /></div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Capabilities preview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-red-600 uppercase tracking-[0.16em]">Our Capabilities</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">Comprehensive Vehicle Care</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">From scheduled synthetic oil changes to complex electronic diagnostics and suspension overhauls.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service) => {
              const Icon = iconMap[service.icon] ?? Wrench;
              return (
                <div key={service.id} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-red-200 transition-all duration-300 cursor-pointer" onClick={() => onNavigate('services')}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-rose-500 group-hover:scale-110 transition-transform"><Icon className="w-5 h-5 text-white" /></div>
                    <span className="text-xs font-medium text-slate-400 px-2 py-1 rounded-lg bg-slate-100">{service.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-2">{service.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-3 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Est: {service.duration}</span>
                    <span className="text-sm font-semibold text-red-600 flex items-center gap-1">Book <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-all" /></span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => onNavigate('services')} className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-lg shadow-red-900/20 hover:scale-105 transition-all">Explore All 8 Services<ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      </section>

      {/* Pricing transparency banner */}
      <section className="py-6 bg-red-50 border-y border-red-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-sm text-slate-600">
            <span className="font-bold text-red-700">Pricing Transparency:</span>
            {' '}All service costs are provided via clear, itemized custom estimates following an initial diagnostic inspection by our certified technicians, rather than arbitrary quotes.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-red-600 uppercase tracking-[0.16em]">Frictionless Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">How {siteConfig.name} Works</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We eliminated the traditional auto repair ambiguity with 4 straightforward steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step) => (
              <div key={step.num} className="relative">
                <div className="text-5xl font-bold text-red-100 mb-3">{step.num}</div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-red-600 uppercase tracking-[0.16em]">Verified Customer Feedback</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-2 mb-4">What Customers Say About {siteConfig.name}</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Candid reviews shared by vehicle owners after service visits across our branches.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Adewale Johnson', service: 'Full Brake System Overhaul & Fluid Flush', branch: 'Lekki Branch', text: 'Really happy with the service. The staff were helpful and my car was ready quickly.' },
              { name: 'Funmi Adebayo', service: 'AC Service & Climate Control', branch: 'Ikeja Branch', text: 'They diagnosed the AC issue properly and gave me a clear estimate before starting. No surprises on the bill.' },
              { name: 'Tunde Bakare', service: 'Computerized Diagnostics', branch: 'Victoria Island Branch', text: 'Professional and transparent. The digital inspection report was sent to my phone. Highly recommend.' },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <Quote className="w-8 h-8 text-red-200 mb-3" />
                <p className="text-sm text-slate-600 leading-relaxed mb-4">"{t.text}"</p>
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-sm font-bold text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{t.service}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" /> {t.branch}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={images.bayarea} alt={images.bayareaAlt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-red-950/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready for Reliable Vehicle Service?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8">Submit your request online. Our branch service advisor will verify bay timing with you.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => onNavigate('book')} className="flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-red-600 rounded-xl shadow-xl shadow-red-900/30 hover:bg-red-500 hover:scale-105 transition-all">Request Service<ArrowRight className="w-5 h-5" /></button>
            <button onClick={() => onNavigate('contact')} className="flex items-center justify-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all"><Phone className="w-5 h-5" /> Contact Us</button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-400"><Clock className="w-4 h-4" />{siteConfig.hours}</div>
        </div>
      </section>
    </div>
  );
}
