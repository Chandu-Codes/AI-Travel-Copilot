import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Compass, 
  Loader2, 
  CheckCircle2, 
  BrainCircuit,
  Navigation
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { MapComponent } from '../components/MapComponent';
import { travelApi } from '../services/api';
import { resolveDestinationMap } from '../utils/geoRegistry';

export const TripPlannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(searchParams.get('dest') || localStorage.getItem('travel_copilot_active_destination') || 'Manali');
  const [startDate, setStartDate] = useState('2025-06-10');
  const [endDate, setEndDate] = useState('2025-06-15');
  const [travelers, setTravelers] = useState('2 Adults');
  const [budget, setBudget] = useState<number>(35000);
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Sightseeing', 'Food', 'Heritage', 'Beaches', 'Adventure'
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const popularPlaces = [
    'Manali', 'Goa', 'Jaipur', 'Kerala', 'Ladakh', 'Paris', 'Switzerland', 'Bali', 'Dubai'
  ];

  const interestOptions = [
    'Sightseeing', 'Food', 'Heritage', 'Adventure', 'Beaches', 'Nature', 'Nightlife', 'Shopping'
  ];

  const travelStyleOptions = ['Relaxed', 'Balanced', 'Packed', 'Luxury'];

  const aiSteps = [
    "Understanding your travel persona and constraints...",
    "Retrieving verified POIs & historical guides via RAG...",
    "Solving 0/1 Knapsack for hotel and activity budget allocation...",
    "Optimizing daily visiting sequence with TSP routing...",
    "Checking live weather forecasts & disruption risks...",
    "Finalizing structured non-repeating itinerary schema..."
  ];

  const currentMapData = resolveDestinationMap(destination);

  useEffect(() => {
    const dest = searchParams.get('dest');
    if (dest) {
      setDestination(dest);
      const d = dest.toLowerCase();
      if (['goa', 'jaipur', 'munnar', 'manali', 'varanasi', 'ooty', 'rishikesh', 'udaipur', 'agra', 'kerala'].some(k => d.includes(k))) {
        setBudget(35000);
      } else if (['switzerland', 'paris', 'japan'].some(k => d.includes(k))) {
        setBudget(160000);
      } else {
        setBudget(85000);
      }
    }
  }, [searchParams]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSelectPopular = (place: string) => {
    setDestination(place);
    const d = place.toLowerCase();
    if (['goa', 'jaipur', 'munnar', 'manali', 'varanasi', 'ooty', 'rishikesh', 'udaipur', 'agra', 'kerala'].some(k => d.includes(k))) {
      setBudget(35000);
    } else if (['switzerland', 'paris', 'japan'].some(k => d.includes(k))) {
      setBudget(160000);
    } else {
      setBudget(85000);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setCurrentStep(0);

    const targetCity = destination.split(',')[0].trim();
    localStorage.setItem('travel_copilot_active_destination', targetCity);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < aiSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      const travelersCount = parseInt(travelers.split(' ')[0]) || 2;
      const res = await travelApi.planTrip({
        destination: targetCity,
        start_date: startDate,
        end_date: endDate,
        travelers_count: travelersCount,
        travelers_label: travelers,
        budget_inr: budget,
        travel_style: travelStyle,
        interests: selectedInterests
      });

      clearInterval(interval);
      const tripId = res.data.id || 1;
      localStorage.setItem('travel_copilot_active_trip_id', String(tripId));
      setTimeout(() => {
        navigate(`/itinerary/${tripId}?dest=${encodeURIComponent(targetCity)}`);
      }, 500);
    } catch (err) {
      console.error("Trip planning error:", err);
      clearInterval(interval);
      setIsGenerating(false);
      navigate(`/itinerary/1?dest=${encodeURIComponent(targetCity)}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF6F0] text-[#1D1917] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Plan Your Dream Vacation ✈️" 
          subtitle="Generate tailored AI itineraries with live interactive map routing across India & worldwide" 
        />

        <main className="p-6 sm:p-8 max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Card in White */}
            <div className="lg:col-span-6 bg-white p-6 sm:p-7 rounded-3xl border border-[#E8DFD3] shadow-warm space-y-5">
              {/* Destination Search Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1D1917] uppercase tracking-wider">
                  Target Destination
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A23B19]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where to? (e.g. Manali, Paris, Goa, Switzerland, Bali)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-[#E8DFD3] focus:border-[#A23B19] text-xs sm:text-sm font-bold text-[#1D1917] bg-[#F8F3EC] outline-none transition"
                  />
                </div>
              </div>

              {/* Popular Destination Quick Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider block">
                  Popular destinations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {popularPlaces.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleSelectPopular(p)}
                      className={`px-3.5 py-1 rounded-full text-xs font-semibold transition ${
                        destination.toLowerCase() === p.toLowerCase()
                          ? 'bg-[#A23B19] text-white shadow-warm-sm'
                          : 'bg-[#F8F3EC] text-[#78716C] hover:bg-[#EFE8DE]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4 pt-1">
                {/* Dates Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#A23B19]" />
                      <span>Start Date</span>
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-2xl border border-[#E8DFD3] text-xs font-medium text-[#1D1917] bg-[#F8F3EC] outline-none focus:border-[#A23B19]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#A23B19]" />
                      <span>End Date</span>
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-2xl border border-[#E8DFD3] text-xs font-medium text-[#1D1917] bg-[#F8F3EC] outline-none focus:border-[#A23B19]"
                    />
                  </div>
                </div>

                {/* Travelers Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#A23B19]" />
                    <span>Travelers</span>
                  </label>
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full pl-3 pr-4 py-2.5 rounded-2xl border border-[#E8DFD3] text-xs font-semibold text-[#1D1917] bg-[#F8F3EC] outline-none focus:border-[#A23B19]"
                  >
                    <option>1 Solo Traveler</option>
                    <option>2 Adults</option>
                    <option>2 Adults, 1 Child</option>
                    <option>Family (4 People)</option>
                    <option>Group (5+ People)</option>
                  </select>
                </div>

                {/* Travel Style Segmented Pills */}
                <div>
                  <label className="block text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-[#A23B19]" />
                    <span>Travel Style</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 bg-[#F8F3EC] p-1 rounded-2xl border border-[#E8DFD3]">
                    {travelStyleOptions.map((style) => {
                      const isSelected = travelStyle === style;
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setTravelStyle(style)}
                          className={`py-1.5 rounded-xl text-xs font-bold transition text-center ${
                            isSelected
                              ? 'bg-white text-[#A23B19] shadow-warm-sm'
                              : 'text-[#78716C] hover:text-[#1D1917]'
                          }`}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Budget Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-[#A23B19]" />
                      <span>Budget</span>
                    </label>
                    <span className="text-xs font-extrabold text-[#A23B19] bg-[#FBECE7] px-2.5 py-0.5 rounded-full border border-[#E8DFD3]">
                      ₹ {budget.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="300000"
                    step="5000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-2 bg-[#E8DFD3] rounded-lg appearance-none cursor-pointer accent-[#A23B19]"
                  />
                  <div className="flex justify-between text-[10px] font-medium text-[#A8A29E] mt-1">
                    <span>₹10,000</span>
                    <span>₹1,50,000</span>
                    <span>₹3,00,000</span>
                  </div>
                </div>

                {/* Interest Tags */}
                <div>
                  <label className="block text-[11px] font-bold text-[#78716C] uppercase tracking-wider mb-1.5">
                    Interest Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {interestOptions.map((interest) => {
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-3.5 py-1 rounded-full text-xs font-semibold transition ${
                            isSelected
                              ? 'bg-[#A23B19] text-white shadow-warm-sm'
                              : 'bg-[#F8F3EC] text-[#78716C] hover:bg-[#EFE8DE]'
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3.5 rounded-full bg-[#A23B19] hover:bg-[#892F11] text-white font-bold text-sm shadow-terracotta transition flex items-center justify-center gap-2 mt-2"
                >
                  <Sparkles className="w-4 h-4 text-[#D97736]" />
                  <span>Generate AI Itinerary</span>
                </button>
              </form>
            </div>

            {/* Right Column: Dynamic Interactive Map & Frosted Vacation Summary Card */}
            <div className="lg:col-span-6 relative flex flex-col space-y-4">
              <div className="h-[540px] w-full rounded-3xl overflow-hidden shadow-warm border border-[#E8DFD3] relative">
                <MapComponent 
                  center={currentMapData.center} 
                  zoom={currentMapData.zoom} 
                  markers={currentMapData.markers}
                  showRoute={true}
                />

                {/* Map Active Header Pill */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E8DFD3] shadow-warm-sm z-20 flex items-center gap-2 pointer-events-none">
                  <Navigation className="w-3.5 h-3.5 text-[#A23B19] animate-pulse" />
                  <span className="text-xs font-bold text-[#1D1917]">
                    Live Route: {destination.toUpperCase()} ({currentMapData.markers.length} Sights)
                  </span>
                </div>

                {/* Floating Frosted Glass Vacation Summary Card */}
                <div className="absolute bottom-4 right-4 max-w-[280px] w-full p-4 rounded-3xl bg-white/95 backdrop-blur-md shadow-warm-lg border border-[#E8DFD3] z-20 space-y-2.5">
                  <span className="text-[10px] font-bold text-[#A23B19] uppercase tracking-wider block">
                    Vacation Summary
                  </span>

                  <div>
                    <h4 className="font-serif font-bold text-[#1D1917] text-base leading-tight">{destination} Trip</h4>
                    <p className="text-[11px] text-[#78716C] font-medium mt-0.5">5 Days | 4 Nights Planned</p>
                  </div>

                  <div className="border-t border-[#E8DFD3]/70 pt-2 space-y-1 text-xs">
                    <div className="flex justify-between text-[#78716C]">
                      <span className="font-medium text-[11px]">Travelers</span>
                      <span className="font-bold text-[#1D1917]">{travelers}</span>
                    </div>

                    <div className="flex justify-between items-baseline pt-1">
                      <span className="font-medium text-[11px] text-[#78716C]">Total Budget</span>
                      <span className="font-black text-sm text-[#A23B19]">₹ {budget.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Animated AI Planning Reasoning Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-[#1D1917]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-warm-lg border border-[#E8DFD3] text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#FBECE7] text-[#A23B19] flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <BrainCircuit className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold text-[#1D1917]">AI Copilot is Planning</h3>
              <p className="text-xs text-[#78716C] mt-1">Generating unique non-repeating attractions for {destination}</p>
            </div>

            <div className="space-y-3 text-left">
              {aiSteps.map((step, idx) => {
                const isPassed = idx < currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                      isPassed ? 'text-[#A23B19] font-medium' : isCurrent ? 'text-[#1D1917] font-bold' : 'text-[#A8A29E]'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-[#A23B19] shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-[#A23B19] animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#E8DFD3] shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
