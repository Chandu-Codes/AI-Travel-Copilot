import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Briefcase, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ChevronRight, 
  Send,
  Bot
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { DestinationCard } from '../components/DestinationCard';
import { travelApi } from '../services/api';
import { DestinationCard as IDestinationCard } from '../types';
import { useAuth } from '../context/AuthContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featured, setFeatured] = useState<IDestinationCard[]>([]);
  const [searchPrompt, setSearchPrompt] = useState('');
  const [stats, setStats] = useState({
    upcoming_trips_count: 2,
    total_bookings_count: 5,
    places_visited_count: 12,
    travel_days_count: 28,
    active_upcoming_trip: null as any
  });

  const userName = user?.name ? user.name.split(' ')[0] : 'Chandu';

  useEffect(() => {
    // Fetch featured destinations
    travelApi.getFeaturedDestinations()
      .then(res => setFeatured(res.data))
      .catch(err => console.error("Error fetching destinations:", err));

    // Fetch dynamic dashboard stats & active upcoming trip
    travelApi.getDashboardStats()
      .then(res => {
        if (res.data) {
          setStats(res.data);
        }
      })
      .catch(err => console.error("Error fetching dashboard stats:", err));
  }, []);

  const handleQuickPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPrompt.trim()) return;
    navigate(`/assistant?q=${encodeURIComponent(searchPrompt)}`);
  };

  return (
    <div className="flex min-h-screen bg-[#F5EFE6] text-[#0C0A09] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title={`Good morning, ${userName}! 👋`} 
          subtitle="Where do you want to go today?" 
        />

        <main className="p-6 sm:p-8 space-y-8 max-w-7xl w-full">
          {/* Quick AI Search Prompt Bar */}
          <form onSubmit={handleQuickPrompt} className="relative w-full">
            <div className="bg-white p-2 sm:p-2.5 rounded-full border border-[#DDCFBD] shadow-warm flex items-center gap-3">
              <input
                type="text"
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                placeholder="Describe your dream trip... (e.g. 5 days in Switzerland for 2 people with scenic trains)"
                className="flex-1 bg-transparent border-none outline-none text-xs sm:text-sm text-[#0C0A09] placeholder-[#78716C] px-4 font-semibold"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-[#9E3816] hover:bg-[#832C0E] text-white flex items-center justify-center shrink-0 shadow-warm transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* 4 Statistics Metrics Cards with Deep Black Numbers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Upcoming Trips */}
            <div 
              onClick={() => navigate('/itinerary/1')}
              className="bg-white p-5 rounded-3xl border border-[#DDCFBD] shadow-warm-sm flex items-center gap-4 hover:shadow-warm hover:border-[#9E3816]/50 transition cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FDECE4] text-[#9E3816] flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#44403C]">Upcoming Trips</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-serif text-2xl font-black text-[#0C0A09]">{stats.upcoming_trips_count}</span>
                  <span className="text-xs font-extrabold text-[#292524]">Trips</span>
                </div>
              </div>
            </div>

            {/* Card 2: Total Bookings */}
            <div 
              onClick={() => navigate('/hotels')}
              className="bg-white p-5 rounded-3xl border border-[#DDCFBD] shadow-warm-sm flex items-center gap-4 hover:shadow-warm hover:border-[#9E3816]/50 transition cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FDECE4] text-[#9E3816] flex items-center justify-center shrink-0">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#44403C]">Total Bookings</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-serif text-2xl font-black text-[#0C0A09]">{stats.total_bookings_count}</span>
                  <span className="text-xs font-extrabold text-[#292524]">Bookings</span>
                </div>
              </div>
            </div>

            {/* Card 3: Places Visited */}
            <div 
              onClick={() => navigate('/explore')}
              className="bg-white p-5 rounded-3xl border border-[#DDCFBD] shadow-warm-sm flex items-center gap-4 hover:shadow-warm hover:border-[#9E3816]/50 transition cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FDECE4] text-[#9E3816] flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#44403C]">Places Visited</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-serif text-2xl font-black text-[#0C0A09]">{stats.places_visited_count}</span>
                  <span className="text-xs font-extrabold text-[#292524]">Cities</span>
                </div>
              </div>
            </div>

            {/* Card 4: Travel Days */}
            <div 
              onClick={() => navigate('/plan-trip')}
              className="bg-white p-5 rounded-3xl border border-[#DDCFBD] shadow-warm-sm flex items-center gap-4 hover:shadow-warm hover:border-[#9E3816]/50 transition cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#FDECE4] text-[#9E3816] flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#44403C]">Travel Days</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="font-serif text-2xl font-black text-[#0C0A09]">{stats.travel_days_count}</span>
                  <span className="text-xs font-extrabold text-[#292524]">Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Popular Destinations Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-extrabold text-[#0C0A09] text-xl">Popular Destinations</h3>
                <p className="text-xs font-semibold text-[#44403C]">Curated with Hybrid AI & Persona Matching</p>
              </div>

              <button 
                onClick={() => navigate('/explore')}
                className="text-xs font-bold text-[#9E3816] hover:text-[#832C0E] flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {featured.slice(0, 5).map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          </div>

          {/* Your Upcoming Trips Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-extrabold text-[#0C0A09] text-xl">Your Upcoming Trips</h3>
              <button 
                onClick={() => navigate('/itinerary/1')}
                className="text-xs font-bold text-[#9E3816] hover:text-[#832C0E] flex items-center gap-1"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trip 1: Swiss Adventure */}
              <div 
                onClick={() => navigate('/itinerary/1?dest=Switzerland')}
                className="bg-white p-4 rounded-3xl border border-[#DDCFBD] shadow-warm-sm hover:shadow-warm transition cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-[#F5EFE6]">
                  <img 
                    src="https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=400&q=80" 
                    alt="Swiss Adventure"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-base text-[#0C0A09] truncate">Swiss Alps Adventure</h4>
                    <span className="text-[10px] font-bold text-[#9E3816] bg-[#FDECE4] px-2.5 py-0.5 rounded-full">5 Days</span>
                  </div>
                  <p className="text-xs text-[#44403C] font-medium mt-0.5">Zurich · Interlaken · Lucerne</p>
                  <p className="text-[11px] text-[#78716C] mt-1 font-semibold">15 – 22 Aug 2025</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9E3816] group-hover:translate-x-1 transition-transform shrink-0" />
              </div>

              {/* Trip 2: Maldives Escape */}
              <div 
                onClick={() => navigate('/itinerary/1?dest=Maldives')}
                className="bg-white p-4 rounded-3xl border border-[#DDCFBD] shadow-warm-sm hover:shadow-warm transition cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-[#F5EFE6]">
                  <img 
                    src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80" 
                    alt="Maldives Escape"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-base text-[#0C0A09] truncate">Maldives Island Escape</h4>
                    <span className="text-[10px] font-bold text-[#9E3816] bg-[#FDECE4] px-2.5 py-0.5 rounded-full">6 Days</span>
                  </div>
                  <p className="text-xs text-[#44403C] font-medium mt-0.5">Male · Maafushi · Overwater Villas</p>
                  <p className="text-[11px] text-[#78716C] mt-1 font-semibold">10 – 16 Sep 2025</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#9E3816] group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            </div>
          </div>

          {/* AI Banner: Let AI plan your perfect itinerary */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#DDCFBD] shadow-warm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#FDECE4] text-[#9E3816] flex items-center justify-center shrink-0">
                <Bot className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-serif font-extrabold text-lg text-[#0C0A09]">Let AI plan your perfect itinerary ✨</h4>
                <p className="text-xs text-[#44403C] mt-0.5 max-w-md font-medium">Answer a few quick questions and our Multi-Agent AI will craft a personalized day-by-day plan tailored to your budget and travel style.</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/plan-trip')}
              className="px-7 py-3 rounded-full bg-[#9E3816] hover:bg-[#832C0E] text-white font-bold text-xs shadow-terracotta transition shrink-0 flex items-center gap-2"
            >
              <span>Plan with AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
