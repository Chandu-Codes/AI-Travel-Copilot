import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plane, 
  Compass, 
  Sparkles, 
  Users, 
  Award, 
  Headphones, 
  Star, 
  ArrowRight, 
  Moon, 
  Sun 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handlePlanClick = (destinationName?: string) => {
    const dest = destinationName || searchQuery || 'Goa';
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/plan-trip?dest=${encodeURIComponent(dest)}`)}`);
    } else {
      navigate(`/plan-trip?dest=${encodeURIComponent(dest)}`);
    }
  };

  const handleNavClick = (path: string) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(path)}`);
    } else {
      navigate(path);
    }
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-[#F5EFE6] text-[#0C0A09] flex flex-col justify-between selection:bg-[#9E3816] selection:text-white relative overflow-hidden font-sans">
      
      {/* Background Decorative Mountain Misty Silhouette on the Bottom/Left */}
      <div className="absolute -bottom-10 -left-10 w-[600px] h-[340px] pointer-events-none opacity-40 z-0 hidden lg:block">
        <svg viewBox="0 0 600 340" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 340 L0 210 Q 90 140 180 190 Q 270 240 370 160 Q 480 80 600 240 L600 340 Z" fill="#E2D4C0" />
          <path d="M0 340 L0 250 Q 120 180 220 230 Q 340 280 440 210 Q 520 160 600 280 L600 340 Z" fill="#D5C5AE" opacity="0.6" />
        </svg>
      </div>

      {/* Dotted Curved Flight Trail Arc with Solid Terracotta Airplane Flight Icon on Top-Right */}
      <div className="absolute top-14 right-6 pointer-events-none z-0 hidden lg:block">
        <svg width="250" height="150" viewBox="0 0 250 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 10 140 Q 120 20 220 18" stroke="#9E3816" strokeWidth="1.6" strokeDasharray="4 5" fill="none" opacity="0.65" />
        </svg>
        <div className="absolute top-0 right-4 transform rotate-45 text-[#9E3816] drop-shadow-xs">
          <Plane className="w-7 h-7 fill-[#9E3816] text-[#9E3816]" />
        </div>
      </div>

      {/* Floating Hot Air Balloon on Mid-Left */}
      <div className="absolute top-[48%] left-8 -translate-y-12 pointer-events-none opacity-45 hidden lg:block">
        <svg width="46" height="62" viewBox="0 0 46 62" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="23" cy="22" rx="20" ry="22" fill="#9E3816" />
          <path d="M14 38 L32 38 L27 50 L19 50 Z" fill="#44403C" />
          <rect x="20" y="52" width="6" height="6" rx="1" fill="#9E3816" />
        </svg>
      </div>

      {/* Top Navigation Bar */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between relative z-10">
        {/* Brand Logo with Pure Airplane Icon */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-[#9E3816] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition">
            <Plane className="w-5 h-5 -rotate-45 text-white" />
          </div>
          <h1 className="font-extrabold text-lg text-[#0C0A09] tracking-tight">AI Travel Copilot</h1>
        </div>

        {/* Center Nav Links with active terracotta indicator */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-[#292524]">
          <div className="relative cursor-pointer">
            <span className="text-[#0C0A09]">Home</span>
            <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#9E3816] rounded-full" />
          </div>
          <button onClick={() => handleNavClick('/explore')} className="hover:text-[#9E3816] transition">Destinations</button>
          <button onClick={() => handleNavClick('/assistant')} className="hover:text-[#9E3816] transition">AI Copilot</button>
          <button onClick={() => handleNavClick('/itinerary/1')} className="hover:text-[#9E3816] transition">Trips</button>
          <button onClick={() => handleNavClick('/hotels')} className="hover:text-[#9E3816] transition">Hotels</button>
          <button onClick={() => handleNavClick('/explore')} className="hover:text-[#9E3816] transition">About Us</button>
        </nav>

        {/* Right Actions: Dark Mode Moon Icon & Solid Terracotta Sign In Button */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#0C0A09] hover:bg-[#EAE0D2] transition"
            title="Toggle theme mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {isAuthenticated && user ? (
            <button 
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-full bg-white border border-[#DDCFBD] hover:bg-[#FAF6F0] text-[#0C0A09] font-bold text-xs shadow-warm-sm transition flex items-center gap-2"
            >
              <div className="w-5 h-5 rounded-full bg-[#9E3816] text-white font-bold text-[10px] flex items-center justify-center">
                {userInitial}
              </div>
              <span>{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 rounded-full bg-[#9E3816] hover:bg-[#832C0E] text-white font-bold text-xs shadow-warm transition"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto w-full px-6 py-6 lg:py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* Left Column: Editorial Headline & Search */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#DDCFBD] text-[#9E3816] text-xs font-bold shadow-warm-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#9E3816]" />
            <span className="text-[#0C0A09]">Your Smart Travel Companion</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#0C0A09] tracking-tight leading-[1.12]">
            AI Travel Copilot<br />
            Plans. Recommends.<br />
            <span className="italic font-serif font-normal text-[#9E3816]">Perfects your journey.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#292524] max-w-lg leading-relaxed font-medium">
            From destinations to itineraries, flights to hotels — your entire trip, planned and optimized by AI.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => handlePlanClick()}
              className="px-7 py-3.5 rounded-full bg-[#9E3816] hover:bg-[#832C0E] text-white font-bold text-xs shadow-terracotta transition flex items-center gap-2"
            >
              <span>Plan My Trip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => navigate('/explore')}
              className="px-7 py-3.5 rounded-full bg-white hover:bg-[#FAF6F0] border border-[#DDCFBD] text-[#0C0A09] font-bold text-xs shadow-warm-sm transition"
            >
              Explore Destinations
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="bg-white p-2 rounded-full border border-[#DDCFBD] shadow-warm flex items-center gap-3 max-w-lg">
            <div className="pl-3 text-[#9E3816]">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePlanClick()}
              placeholder="Where do you want to explore? (e.g. Manali, Paris, Bali)"
              className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-[#0C0A09] placeholder-[#78716C] font-semibold"
            />
            <button
              onClick={() => handlePlanClick()}
              className="px-6 py-2.5 rounded-full bg-[#9E3816] hover:bg-[#832C0E] text-white font-bold text-xs shadow-warm-sm transition"
            >
              Explore
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex -space-x-2">
              <img className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Traveler" />
              <img className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80" alt="Traveler" />
              <img className="w-7 h-7 rounded-full border-2 border-white object-cover shadow-xs" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80" alt="Traveler" />
            </div>
            <p className="text-xs text-[#292524] font-medium">
              Trusted by <span className="font-extrabold text-[#9E3816]">10K+</span> travelers worldwide
            </p>
          </div>
        </div>

        {/* Right Column: Original 3 Overlapping Rotated Collage Cards (Matching Exact Previous Placement) */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <div className="relative w-full max-w-[460px] aspect-[4/5]">
            {/* Top Large Card (Santorini Greece Caldera Sunset) */}
            <div 
              onClick={() => handlePlanClick('Santorini')}
              className="absolute top-0 right-0 w-4/5 aspect-[4/3] rounded-3xl overflow-hidden shadow-warm-lg border-4 border-white transform rotate-2 hover:rotate-0 transition duration-500 cursor-pointer group z-0"
            >
              <img
                src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80"
                alt="Santorini Greece"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                <p className="text-white text-xs font-bold font-serif">Santorini, Greece • Plan Trip &rarr;</p>
              </div>
            </div>

            {/* Middle Left Card (Alpine Swiss Mountain Lake) - Crossed Layer */}
            <div 
              onClick={() => handlePlanClick('Switzerland')}
              className="absolute top-1/3 left-0 w-3/5 aspect-square rounded-3xl overflow-hidden shadow-warm-lg border-4 border-white -rotate-3 hover:rotate-0 transition duration-500 z-10 cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80"
                alt="Swiss Alps"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                <p className="text-white text-xs font-bold font-serif">Swiss Alps • Plan Trip &rarr;</p>
              </div>
            </div>

            {/* Bottom Right Card (Maldives Tropical Overwater Bungalows) - Crossed Layer */}
            <div 
              onClick={() => handlePlanClick('Maldives')}
              className="absolute bottom-2 right-4 w-3/5 aspect-square rounded-3xl overflow-hidden shadow-warm-lg border-4 border-white rotate-2 hover:rotate-0 transition duration-500 z-20 cursor-pointer group"
            >
              <img
                src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80"
                alt="Maldives Tropical"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09]/85 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
                <p className="text-white text-xs font-bold font-serif">Maldives • Plan Trip &rarr;</p>
              </div>
            </div>

            {/* Floating Glass Rating Pill */}
            <div className="absolute top-1/2 right-2 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-warm-lg border border-[#DDCFBD] z-30 flex items-center gap-2.5 pointer-events-none">
              <div className="w-8 h-8 rounded-xl bg-[#FDECE4] text-[#D97706] flex items-center justify-center">
                <Star className="w-4 h-4 fill-[#D97706] text-[#D97706]" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-[#0C0A09]">4.9 / 5.0 Rating</p>
                <p className="text-[10px] text-[#44403C] font-semibold">10,000+ AI Trips Planned</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Feature Metrics Pills (Row of 4 Cards Matching Image with Dark High-Contrast Numbers) */}
      <section className="max-w-7xl mx-auto w-full px-6 py-6 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-white p-5 rounded-3xl border border-[#DDCFBD] shadow-warm-sm flex items-center gap-3.5 hover:shadow-warm transition">
            <div className="w-11 h-11 rounded-full bg-[#FDECE4] text-[#9E3816] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-black text-xl text-[#0C0A09]">10K+</p>
              <p className="text-xs text-[#292524] font-bold">Happy Travelers</p>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white p-5 rounded-3xl border border-[#DDCFBD] shadow-warm-sm flex items-center gap-3.5 hover:shadow-warm transition">
            <div className="w-11 h-11 rounded-full bg-[#FDECE4] text-[#9E3816] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-black text-xl text-[#0C0A09]">98%</p>
              <p className="text-xs text-[#292524] font-bold">Trip Success Rate</p>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white p-5 rounded-3xl border border-[#DDCFBD] shadow-warm-sm flex items-center gap-3.5 hover:shadow-warm transition">
            <div className="w-11 h-11 rounded-full bg-[#FDECE4] text-[#9E3816] flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-black text-xl text-[#0C0A09]">150+</p>
              <p className="text-xs text-[#292524] font-bold">Countries Covered</p>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white p-5 rounded-3xl border border-[#DDCFBD] shadow-warm-sm flex items-center gap-3.5 hover:shadow-warm transition">
            <div className="w-11 h-11 rounded-full bg-[#FDECE4] text-[#9E3816] flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif font-black text-xl text-[#0C0A09]">24/7</p>
              <p className="text-xs text-[#292524] font-bold">AI Travel Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full px-6 py-6 border-t border-[#DDCFBD]/70 flex items-center justify-between text-xs text-[#44403C] relative z-10">
        <p className="font-medium">© 2026 AI Travel Copilot. All rights reserved.</p>
        <div className="flex items-center gap-6 font-semibold text-[#0C0A09]">
          <button onClick={() => handleNavClick('/dashboard')} className="hover:text-[#9E3816] transition">Dashboard</button>
          <button onClick={() => handleNavClick('/assistant')} className="hover:text-[#9E3816] transition">AI Copilot</button>
          <button onClick={() => handleNavClick('/flights')} className="hover:text-[#9E3816] transition">Flight Radar</button>
          <button onClick={() => handleNavClick('/explore')} className="hover:text-[#9E3816] transition">Help Center</button>
        </div>
      </footer>
    </div>
  );
};
