import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Plane, Mail, Lock, User as UserIcon, Sparkles, ArrowRight, AlertCircle, Compass, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();

  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExistingAccount, setIsExistingAccount] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setError(null);
    setIsExistingAccount(false);
    setLoading(true);

    try {
      await register(name.trim(), email.trim(), password, travelStyle);
      navigate(redirectUrl);
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.code === "ERR_NETWORK" || !err.response) {
        setError("Unable to connect to the backend server. Please make sure the backend is running at http://localhost:8000.");
      } else {
        const detail = err.response?.data?.detail || "Registration failed. Please try a different email.";
        setError(detail);
        if (typeof detail === 'string' && (detail.toLowerCase().includes("already exists") || detail.toLowerCase().includes("log in") || detail.toLowerCase().includes("sign in"))) {
          setIsExistingAccount(true);
        }
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
          Already have an account?{' '}
          <Link to={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`} className="text-[#A23B19] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8DFD3] shadow-warm p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FBECE7] text-[#A23B19] text-xs font-bold border border-[#E8DFD3]">
              <Sparkles className="w-3.5 h-3.5 text-[#A23B19]" />
              <span>Create Your Persona</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-[#1D1917] tracking-tight">Create an Account</h2>
            <p className="text-xs text-[#78716C] font-medium">
              Start planning smarter with autonomous AI itineraries and budget optimization.
            </p>
          </div>

          {/* Error Message with 1-Click Action */}
          {error && (
            <div className="p-4 rounded-2xl bg-[#FBECE7] border border-[#E8DFD3] text-[#A23B19] text-xs font-medium space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#A23B19]" />
                <span>{error}</span>
              </div>

              {isExistingAccount && (
                <button
                  type="button"
                  onClick={() => navigate(`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`)}
                  className="w-full mt-2 py-2 rounded-full bg-[#A23B19] hover:bg-[#892F11] text-white font-bold text-xs shadow-warm-sm transition flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In to Existing Account</span>
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Full Name */}
            <div>
              <label className="block font-bold text-[#78716C] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A23B19]">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Chandu"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E8DFD3] focus:border-[#A23B19] text-[#1D1917] font-medium bg-[#F8F3EC] outline-none transition"
                />
              </div>
            </div>

            {/* Email Field */}
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

            {/* Passwords Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#78716C] uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A23B19]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 4 chars"
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-[#E8DFD3] focus:border-[#A23B19] text-[#1D1917] font-medium bg-[#F8F3EC] outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#78716C] uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A23B19]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-3 py-2.5 rounded-2xl border border-[#E8DFD3] focus:border-[#A23B19] text-[#1D1917] font-medium bg-[#F8F3EC] outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Travel Style Preference */}
            <div>
              <label className="block font-bold text-[#78716C] uppercase tracking-wider mb-1.5">
                Default Travel Style
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A23B19]">
                  <Compass className="w-4 h-4" />
                </div>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E8DFD3] focus:border-[#A23B19] text-[#1D1917] font-medium bg-[#F8F3EC] outline-none transition"
                >
                  <option value="Balanced">Balanced (Mix of Sights & Relaxation)</option>
                  <option value="Relaxed">Relaxed (Slow Travel / Leisure)</option>
                  <option value="Packed">Packed (High-Energy Sightseeing)</option>
                  <option value="Luxury">Luxury (5-Star Heritage & Fine Dining)</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-full bg-[#A23B19] hover:bg-[#892F11] disabled:opacity-50 text-white font-bold text-xs shadow-terracotta transition flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2 text-xs text-[#78716C] font-medium">
            Already have an account?{' '}
            <Link to={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ''}`} className="text-[#A23B19] font-bold hover:underline">
              Sign in
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
