import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Plane, Mail, Lock, Sparkles, ArrowRight, AlertCircle, LogIn, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in both email and password.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate(redirectUrl);
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === "ERR_NETWORK" || !err.response) {
        setError("Unable to connect to backend server. Make sure the backend is running at http://localhost:8000.");
      } else {
        setError(err.response?.data?.detail || "Invalid credentials. Please verify your email and password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      await login('chandu@example.com', 'password123');
      navigate(redirectUrl);
    } catch (err: any) {
      console.error("Demo login error:", err);
      try {
        setEmail('chandu@example.com');
        setPassword('password123');
        await login('chandu@example.com', 'password123');
        navigate(redirectUrl);
      } catch (innerErr: any) {
        setError(innerErr.response?.data?.detail || "Could not log in with demo account. You can create a new account in 5 seconds!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between text-[#1D1917] font-sans">
      {/* Header Bar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#A23B19] flex items-center justify-center text-white shadow-sm">
            <Plane className="w-4 h-4 -rotate-45" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-[#1D1917] leading-tight">AI Travel Copilot</h1>
          </div>
        </Link>

        <div className="text-xs font-medium text-[#78716C]">
          Don't have an account?{' '}
          <Link to={`/register${searchParams.toString() ? `?${searchParams.toString()}` : ''}`} className="text-[#A23B19] font-bold hover:underline">
            Create one
          </Link>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8DFD3] shadow-warm p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FBECE7] text-[#A23B19] text-xs font-bold border border-[#E8DFD3]">
              <Sparkles className="w-3.5 h-3.5 text-[#A23B19]" />
              <span>Smart Travel Portal</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1D1917] tracking-tight">Welcome Back</h2>
            <p className="text-xs text-[#78716C] font-medium">
              Sign in to manage your AI itineraries, active bookings, and disruption radars.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-2xl bg-[#FBECE7] border border-[#E8DFD3] text-[#A23B19] text-xs font-medium space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#A23B19]" />
                <span>{error}</span>
              </div>
              <div className="pt-1">
                <Link
                  to={`/register${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
                  className="text-xs font-extrabold text-[#A23B19] underline block"
                >
                  Click here to register this email &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* Quick Demo 1-Click Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full py-3 px-4 rounded-full bg-[#FAF6F0] hover:bg-[#F0E7DB] border border-[#E8DFD3] text-[#1D1917] font-bold text-xs shadow-warm-sm transition flex items-center justify-center gap-2 group"
          >
            <UserCheck className="w-4 h-4 text-[#A23B19] group-hover:scale-110 transition" />
            <span>1-Click Demo Login (Chandu)</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#E8DFD3]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E]">Or sign in with password</span>
            <div className="flex-1 h-px bg-[#E8DFD3]" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#78716C] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A23B19]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E8DFD3] focus:border-[#A23B19] text-[#1D1917] font-medium bg-[#F8F3EC] outline-none transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-[#78716C] uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A23B19]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E8DFD3] focus:border-[#A23B19] text-[#1D1917] font-medium bg-[#F8F3EC] outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[#A23B19] hover:bg-[#892F11] disabled:opacity-50 text-white font-bold text-xs shadow-terracotta transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2 text-xs text-[#78716C] font-medium">
            New to AI Travel Copilot?{' '}
            <Link to={`/register${searchParams.toString() ? `?${searchParams.toString()}` : ''}`} className="text-[#A23B19] font-bold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-4 text-center text-xs text-[#A8A29E]">
        © 2026 AI Travel Copilot Inc. • Enterprise Grade JWT Authentication
      </footer>
    </div>
  );
};
