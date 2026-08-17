import React, { useState, useEffect } from 'react';
import { 
  Save, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || 'Chandu');
  const [email, setEmail] = useState(user?.email || 'chandu@example.com');
  const [travelStyle, setTravelStyle] = useState(user?.travel_style || 'Balanced');
  const [currency, setCurrency] = useState(user?.preferred_currency || 'INR');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setTravelStyle(user.travel_style);
      setCurrency(user.preferred_currency || 'INR');
    }
  }, [user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      travel_style: travelStyle,
      preferred_currency: currency
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const userInitial = name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="flex min-h-screen bg-[#FAF6F0] text-[#1D1917] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Account Profile & Travel Persona" 
          subtitle="Customize AI planner behavior, currency preferences, and personal style" 
        />

        <main className="p-6 sm:p-8 max-w-4xl mx-auto w-full space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8DFD3] shadow-warm space-y-6">
            <div className="flex items-center gap-5">
              {/* Clean Professional Monogram Avatar */}
              <div className="w-16 h-16 rounded-2xl bg-[#A23B19] text-white font-serif font-bold text-2xl flex items-center justify-center shadow-warm-sm">
                {userInitial}
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#1D1917]">{name}</h3>
                <p className="text-xs text-[#78716C] font-medium">{email} • Verified Traveler</p>
                <div className="flex items-center gap-1.5 text-xs text-[#A23B19] font-bold mt-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>AI Copilot Authenticated Session</span>
                </div>
              </div>
            </div>

            {saved && (
              <div className="p-3.5 rounded-2xl bg-[#FBECE7] border border-[#E8DFD3] text-[#A23B19] text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A23B19]" />
                <span>Travel Preferences Successfully Saved!</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#78716C] uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E8DFD3] bg-[#F8F3EC] text-[#1D1917] font-semibold outline-none focus:border-[#A23B19]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#78716C] uppercase mb-1">Email Address (Read Only)</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E8DFD3] bg-[#F8F3EC]/50 text-[#A8A29E] font-medium outline-none cursor-not-allowed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#78716C] uppercase mb-1">Default Travel Persona</label>
                  <select
                    value={travelStyle}
                    onChange={(e) => setTravelStyle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#E8DFD3] bg-[#F8F3EC] text-[#1D1917] font-semibold outline-none focus:border-[#A23B19]"
                  >
                    <option value="Balanced">Balanced (Sights & Relaxation)</option>
                    <option value="Relaxed">Relaxed (Slow Leisure)</option>
                    <option value="Packed">Packed (High-Energy Sightseeing)</option>
                    <option value="Luxury">Luxury (5-Star & Fine Dining)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#78716C] uppercase mb-1">Preferred Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl border border-[#E8DFD3] bg-[#F8F3EC] text-[#1D1917] font-semibold outline-none focus:border-[#A23B19]"
                  >
                    <option value="INR">INR (₹ - Indian Rupee)</option>
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                    <option value="GBP">GBP (£ - British Pound)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#A23B19] hover:bg-[#892F11] text-white font-bold text-xs shadow-warm-sm transition flex items-center gap-2 mt-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Persona Settings</span>
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
