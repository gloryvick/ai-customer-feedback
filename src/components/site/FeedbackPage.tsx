import { useState, useEffect } from 'react';
import { supabase, FeedbackToken, Location } from '@/lib/supabase';
import { siteConfig, services } from '@/lib/siteConfig';
import { Star, CheckCircle2, AlertCircle, Loader2, Car, ArrowLeft, MessageSquare, Mail, Phone, MapPin, Wrench } from 'lucide-react';

const RATING_LABELS: Record<number, string> = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Okay',
  4: 'Good',
  5: 'Excellent',
};

const CONCERN_OPTIONS = [
  { value: 'service_quality', label: 'Service Quality' },
  { value: 'staff_service', label: 'Staff / Customer Service' },
  { value: 'waiting_time', label: 'Waiting Time' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'vehicle_issue', label: 'Vehicle Issue' },
  { value: 'facility', label: 'Facility' },
  { value: 'other', label: 'Other' },
];

const RECOMMEND_OPTIONS = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
  { value: 'not_sure', label: 'Not sure' },
];

type FormState = 'loading' | 'form' | 'submitting' | 'success' | 'error' | 'invalid' | 'used';

export default function FeedbackPage() {
  const [tokenInfo, setTokenInfo] = useState<FeedbackToken | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [formState, setFormState] = useState<FormState>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [locations, setLocations] = useState<Location[]>([]);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [mainConcern, setMainConcern] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState('');
  const [contactRequested, setContactRequested] = useState('');
  const [preferredContact, setPreferredContact] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [locationId, setLocationId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    loadLocations();
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      setHasToken(true);
      loadToken(token);
    } else {
      setFormState('form');
    }
  }, []);

  const loadLocations = async () => {
    const { data } = await supabase.from('locations').select('id, name, city, region').order('name');
    if (data) setLocations(data as Location[]);
  };

  const loadToken = async (token: string) => {
    const { data, error } = await supabase
      .from('feedback_tokens')
      .select('*')
      .eq('token', token)
      .maybeSingle();

    if (error || !data) {
      setFormState('invalid');
      setErrorMsg('This feedback link is invalid or has expired.');
      return;
    }

    const ft = data as FeedbackToken;

    if (ft.feedback_received) {
      setFormState('used');
      return;
    }

    if (ft.expires_at && new Date(ft.expires_at) < new Date()) {
      setFormState('invalid');
      setErrorMsg('This feedback link has expired.');
      return;
    }

    setTokenInfo(ft);
    setServiceType(ft.service_type);
    setLocationId(ft.location_id ?? '');
    setCustomerName(ft.customer_name);
    setCustomerEmail(ft.customer_email);
    setFormState('form');
  };

  const canSubmit =
    rating > 0 &&
    feedbackText.trim().length > 0 &&
    mainConcern !== '' &&
    wouldRecommend !== '' &&
    contactRequested !== '' &&
    (contactRequested !== 'yes' || preferredContact !== '') &&
    serviceType !== '' &&
    locationId !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setFormState('submitting');
    setErrorMsg('');

    try {
      const selectedLocation = locations.find((l) => l.id === locationId);
      const locationName = selectedLocation?.name ?? tokenInfo?.location_name ?? '';

      const { error: insertError } = await supabase.from('feedback').insert({
        customer_name: customerName || null,
        customer_email: customerEmail || null,
        vehicle_model_id: tokenInfo ? await getVehicleModelId(tokenInfo.visit_id) : null,
        dealership_id: null,
        component: mainConcern,
        rating,
        title: `${RATING_LABELS[rating]} — ${CONCERN_OPTIONS.find((c) => c.value === mainConcern)?.label ?? 'Feedback'}`,
        body: feedbackText.trim(),
        sentiment: 'neutral',
        severity: 'low',
        status: 'new',
        is_escalated: false,
        customer_id: tokenInfo?.customer_id ?? null,
        visit_id: tokenInfo?.visit_id ?? null,
        feedback_token_id: tokenInfo?.id ?? null,
        main_concern: mainConcern,
        would_recommend: wouldRecommend,
        contact_requested: contactRequested === 'yes',
        preferred_contact_method: contactRequested === 'yes' ? preferredContact : null,
        location_name: locationName,
        location_id: locationId,
        service_type: serviceType,
        submitted_at: new Date().toISOString(),
      });

      if (insertError) {
        setFormState('error');
        setErrorMsg(insertError.message);
        return;
      }

      if (tokenInfo) {
        await supabase
          .from('feedback_tokens')
          .update({
            feedback_received: true,
            feedback_received_at: new Date().toISOString(),
          })
          .eq('id', tokenInfo.id);
      }

      setFormState('success');
    } catch (err) {
      setFormState('error');
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.');
    }
  };

  if (formState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-slate-200 border-t-red-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading feedback form...</p>
        </div>
      </div>
    );
  }

  if (formState === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Thank You!</h1>
          <p className="text-slate-500 leading-relaxed mb-2">
            Thank you for sharing your feedback. We appreciate you taking the time to help us improve.
          </p>
          {tokenInfo && (
            <p className="text-sm text-slate-400 mt-4">
              Your feedback for your {tokenInfo.service_type.toLowerCase()} visit at {tokenInfo.location_name} has been received.
            </p>
          )}
          <a
            href={window.location.origin}
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm font-semibold text-white bg-red-600 rounded-xl shadow-lg shadow-red-900/20 hover:bg-red-500 hover:scale-105 transition-all"
          >
            <Car className="w-4 h-4" /> Visit {siteConfig.name}
          </a>
        </div>
      </div>
    );
  }

  if (formState === 'used') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 mb-6">
            <CheckCircle2 className="w-8 h-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Feedback Already Submitted</h1>
          <p className="text-slate-500 leading-relaxed">
            We have already received your feedback for this visit. Thank you for sharing your thoughts with us!
          </p>
          <a
            href={window.location.origin}
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm font-semibold text-white bg-red-600 rounded-xl shadow-lg shadow-red-900/20 hover:bg-red-500 hover:scale-105 transition-all"
          >
            <Car className="w-4 h-4" /> Visit {siteConfig.name}
          </a>
        </div>
      </div>
    );
  }

  if (formState === 'invalid' || formState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 text-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 mb-6">
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            {formState === 'error' ? 'Submission Error' : 'Invalid Feedback Link'}
          </h1>
          <p className="text-slate-500 leading-relaxed">{errorMsg || 'Something went wrong.'}</p>
          {formState === 'error' && (
            <button
              onClick={() => setFormState('form')}
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 text-sm font-semibold text-white bg-red-600 rounded-xl shadow-lg shadow-red-900/20 hover:bg-red-500 hover:scale-105 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Form
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-slate-950 py-8 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-500 shadow-lg shadow-red-900/20">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">{siteConfig.name}</span>
          </div>
          <p className="text-sm text-slate-400">{siteConfig.tagline}</p>
        </div>
      </header>

      {/* Visit info banner (only for token-based access) */}
      {hasToken && tokenInfo && (
        <div className="bg-white border-b border-slate-200 py-4 px-6">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
            <span className="text-slate-400 uppercase tracking-wide font-semibold text-xs">Visit Details</span>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-slate-600">
              <span><strong className="text-slate-800">{tokenInfo.location_name}</strong></span>
              <span>Service: <strong className="text-slate-800">{tokenInfo.service_type}</strong></span>
              <span>Date: <strong className="text-slate-800">{new Date(tokenInfo.visit_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-50">
              <MessageSquare className="w-5 h-5 text-red-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">We'd Love Your Feedback</h1>
          </div>
          <p className="text-slate-500 ml-13">
            {hasToken && tokenInfo
              ? `Hi, ${tokenInfo.customer_name.split(' ')[0]} — your experience matters to us. Please take a moment to share your thoughts.`
              : 'Your experience matters to us. Please take a moment to share your thoughts about your visit.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Service Type & Location */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Service Type <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-400 mb-4">Which service did you receive?</p>
            <div className="relative">
              <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all appearance-none"
              >
                <option value="">Select a service...</option>
                {services.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Location <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-400 mb-4">Which branch did you visit?</p>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all appearance-none"
              >
                <option value="">Select a location...</option>
                {locations.map((l) => (
                  <option key={l.id} value={l.id}>{l.name} — {l.city}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Overall Experience Rating <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-400 mb-4">How would you rate your overall experience?</p>
            <div className="flex items-center gap-2 flex-wrap">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border transition-all ${
                    (hoverRating || rating) >= n
                      ? 'border-red-300 bg-red-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 transition-colors ${
                          s <= n && (hoverRating || rating) >= n
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-100 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-medium ${n === (hoverRating || rating) ? 'text-red-600' : 'text-slate-400'}`}>
                    {n}. {RATING_LABELS[n]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Written feedback */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <label htmlFor="feedback-text" className="block text-sm font-bold text-slate-800 mb-1">
              Tell us about your experience <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-400 mb-4">Share details about what went well or what could be improved.</p>
            <textarea
              id="feedback-text"
              required
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={5}
              placeholder="Your feedback..."
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all resize-none"
            />
          </div>

          {/* Main concern */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Main Area of Feedback <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-400 mb-4">Which area does your feedback relate to most?</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {CONCERN_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMainConcern(opt.value)}
                  className={`px-4 py-3 text-sm font-medium rounded-xl border transition-all text-left ${
                    mainConcern === opt.value
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Would recommend */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Would you recommend us to someone else? <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-400 mb-4">Based on your experience, would you recommend {siteConfig.name}?</p>
            <div className="flex flex-wrap gap-3">
              {RECOMMEND_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setWouldRecommend(opt.value)}
                  className={`px-6 py-3 text-sm font-medium rounded-xl border transition-all ${
                    wouldRecommend === opt.value
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact requested */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <label className="block text-sm font-bold text-slate-800 mb-1">
              Would you like our team to contact you about your feedback? <span className="text-rose-500">*</span>
            </label>
            <p className="text-xs text-slate-400 mb-4">If you have a concern, we'd like to follow up.</p>
            <div className="flex flex-wrap gap-3 mb-4">
              {[
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setContactRequested(opt.value);
                    if (opt.value === 'no') setPreferredContact('');
                  }}
                  className={`px-6 py-3 text-sm font-medium rounded-xl border transition-all ${
                    contactRequested === opt.value
                      ? 'border-red-300 bg-red-50 text-red-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Preferred contact method (conditional) */}
            {contactRequested === 'yes' && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">
                    Preferred Contact Method <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-xs text-slate-400 mb-3">How would you like us to reach you?</p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { value: 'email', label: 'Email', icon: Mail },
                      { value: 'phone', label: 'Phone', icon: Phone },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPreferredContact(opt.value)}
                        className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-xl border transition-all ${
                          preferredContact === opt.value
                            ? 'border-red-300 bg-red-50 text-red-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <opt.icon className="w-4 h-4" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email fields (only shown when contact is requested and no token) */}
                {!hasToken && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="cust-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                        Your Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="cust-name"
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Full name"
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="cust-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                        {preferredContact === 'phone' ? 'Email (optional)' : 'Email'} {preferredContact !== 'phone' && <span className="text-rose-500">*</span>}
                      </label>
                      <input
                        id="cust-email"
                        type="email"
                        required={preferredContact !== 'phone'}
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-300 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              disabled={!canSubmit || formState === 'submitting'}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white bg-red-600 rounded-xl shadow-lg shadow-red-900/20 hover:bg-red-500 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all"
            >
              {formState === 'submitting' ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
              ) : (
                <>Submit Feedback</>
              )}
            </button>
            <p className="text-xs text-slate-400">
              Your feedback is confidential and will be reviewed by our management team.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}

async function getVehicleModelId(visitId: string): Promise<string | null> {
  const { data } = await supabase
    .from('visits')
    .select('vehicle_model_id')
    .eq('id', visitId)
    .maybeSingle();
  return data?.vehicle_model_id ?? null;
}
