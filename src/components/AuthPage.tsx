import { useState, FormEvent } from 'react';
import { useAuth } from '@/lib/auth';
import { Car, Mail, Lock, AlertCircle, Loader2, ArrowRight, ArrowLeft } from 'lucide-react';

interface AuthPageProps {
  onBackToSite?: () => void;
}

export default function AuthPage({ onBackToSite }: AuthPageProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error: err } = await fn(email, password);
    setSubmitting(false);
    if (err) {
      setError(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md">
        {onBackToSite && (
          <button onClick={onBackToSite} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to website
          </button>
        )}

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-xl shadow-blue-500/30 mb-4">
            <Car className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">AutoCare Plus</h1>
          <p className="text-sm text-slate-400 mt-1">Staff Operations Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="flex gap-1 p-1 bg-slate-800/50 rounded-xl mb-6">
            <button
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === 'signin' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                mode === 'signup' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@autocareplus.example"
                  className="w-full pl-10 pr-3 py-2.5 text-sm text-white bg-slate-800/50 border border-slate-700 rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 text-sm text-white bg-slate-800/50 border border-slate-700 rounded-xl placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <p className="text-sm text-rose-300">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/20"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-5">
            {mode === 'signin'
              ? 'Access the staff portal with your AutoCare Plus account.'
              : 'Create an account to access the staff operations portal.'}
          </p>
        </div>
      </div>
    </div>
  );
}
