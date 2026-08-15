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
  Clock, 
  ShieldCheck, 
  BrainCircuit,
  Sliders,
  Globe2
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { MapComponent } from '../components/MapComponent';
import { travelApi } from '../services/api';

export const TripPlannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(searchParams.get('dest') || localStorage.getItem('travel_copilot_active_destination') || 'Goa');
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

  const popularIndianPlaces = [
    'Goa', 'Jaipur', 'Munnar', 'Manali', 'Ladakh', 'Kashmir', 'Varanasi', 'Ooty', 'Rishikesh', 'Udaipur', 'Andaman', 'Hampi', 'Agra', 'Coorg'
  ];

  const popularGlobalPlaces = [
    'Japan', 'Switzerland', 'Bali', 'Paris', 'Dubai', 'Maldives', 'Rome', 'London', 'New York'
  ];

  const interestOptions = [
    'Sightseeing', 'Food', 'Heritage', 'Beaches', 'Adventure', 'Nature', 'Nightlife', 'Shopping', 'Yoga & Spiritual'
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

  useEffect(() => {
    const dest = searchParams.get('dest');
    if (dest) {
      setDestination(dest);
      const d = dest.toLowerCase();
      if (d.includes('goa') || d.includes('jaipur') || d.includes('kerala') || d.includes('munnar') || d.includes('manali')) {
        setBudget(35000);
      } else if (d.includes('switzerland') || d.includes('paris') || d.includes('japan') || d.includes('london')) {
        setBudget(160000);
      } else if (d.includes('dubai') || d.includes('maldives') || d.includes('bali')) {
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
    if (['goa', 'jaipur', 'munnar', 'manali', 'varanasi', 'ooty', 'rishikesh', 'udaipur', 'coorg', 'hampi', 'agra'].includes(d)) {
      setBudget(35000);
    } else if (['japan', 'switzerland', 'paris', 'london', 'new york', 'rome'].includes(d)) {
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

  const getMapCoordinates = (): [number, number] => {
    const d = destination.toLowerCase();
    if (d.includes('goa')) return [15.4989, 73.8278];
    if (d.includes('jaipur')) return [26.9124, 75.7873];
    if (d.includes('udaipur')) return [24.5854, 73.7125];
    if (d.includes('munnar') || d.includes('kerala')) return [10.0889, 77.0595];
    if (d.includes('manali')) return [32.2396, 77.1887];
    if (d.includes('ladakh') || d.includes('leh')) return [34.1526, 77.5771];
    if (d.includes('kashmir') || d.includes('srinagar')) return [34.0837, 74.7973];
    if (d.includes('varanasi')) return [25.3176, 82.9739];
    if (d.includes('ooty')) return [11.4102, 76.6950];
    if (d.includes('rishikesh')) return [30.0869, 78.2676];
    if (d.includes('agra')) return [27.1767, 78.0081];
    if (d.includes('japan') || d.includes('tokyo')) return [35.6762, 139.6503];
    if (d.includes('switzerland') || d.includes('zurich')) return [47.3769, 8.5417];
    if (d.includes('paris')) return [48.8566, 2.3522];
    if (d.includes('dubai')) return [25.2048, 55.2708];
    if (d.includes('bali')) return [-8.3405, 115.0920];
    if (d.includes('maldives')) return [4.1755, 73.5093];
    return [20.5937, 78.9629];
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Autonomous AI Trip Planner 🗺️" 
          subtitle="Plan vacations to any destination in India or around the world with non-repeating attractions" 
        />

        <main className="p-8 max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form */}
            <div className="lg:col-span-6 bg-white p-7 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
              <div>
                <h3 className="font-bold text-slate-900 text-xl mb-1">Create Your Dream Vacation</h3>
                <p className="text-xs text-slate-500">Choose any destination in India or worldwide. Our AI will plan every single day.</p>
              </div>

              {/* Popular Indian Destinations Quick Select */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🇮🇳 Popular Indian Tourist Hotspots:</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {popularIndianPlaces.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleSelectPopular(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        destination.toLowerCase() === p.toLowerCase()
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Global Destinations */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🌍 International Destinations:</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {popularGlobalPlaces.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleSelectPopular(p)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                        destination.toLowerCase() === p.toLowerCase()
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4 pt-2">
                {/* Destination Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Destination
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <input
                      type="text"
                      required
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g. Goa, Munnar, Manali, Ladakh, Paris, Japan..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-slate-900 bg-slate-50/50 outline-none"
                    />
                  </div>
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-slate-50/50 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-slate-50/50 outline-none"
                    />
                  </div>
                </div>

                {/* Travelers */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Travelers
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Users className="w-4 h-4" />
                    </div>
                    <select
                      value={travelers}
                      onChange={(e) => setTravelers(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-slate-50/50 outline-none"
                    >
                      <option>1 Solo Traveler</option>
                      <option>2 Adults</option>
                      <option>2 Adults, 1 Child</option>
                      <option>Family (4 People)</option>
                      <option>Group (5+ People)</option>
                    </select>
                  </div>
                </div>

                {/* Budget Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Trip Budget
                    </label>
                    <span className="text-sm font-extrabold text-blue-600">
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
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] font-medium text-slate-400 mt-1">
                    <span>₹10,000 (Budget)</span>
                    <span>₹60,000 (Standard)</span>
                    <span>₹3,00,000 (Luxury)</span>
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Interests
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {interestOptions.map((interest) => {
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Travel Style */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Travel Style
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {travelStyleOptions.map((style) => {
                      const isSelected = travelStyle === style;
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setTravelStyle(style)}
                          className={`py-1.5 rounded-xl text-xs font-semibold border text-center transition ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-xs'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 mt-4"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate AI Itinerary ✨</span>
                </button>
              </form>
            </div>

            {/* Right Column: Map & Trip Summary Floating Card */}
            <div className="lg:col-span-6 relative flex flex-col">
              <div className="h-[520px] w-full rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 relative">
                <MapComponent center={getMapCoordinates()} zoom={9} />

                {/* Floating Trip Summary Glass Card */}
                <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-80 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-slate-200/90 z-20">
                  <h4 className="font-bold text-slate-900 text-sm mb-3">Vacation Summary</h4>
                  
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-bold text-slate-900 leading-none">{destination}</p>
                        <p className="text-[10px] text-slate-400">Target Vacation Destination</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-slate-700">
                      <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 leading-none">5 Days / 4 Nights</p>
                        <p className="text-[10px] text-slate-400">Duration (Non-Repeating Daily Plan)</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-slate-700">
                      <Users className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900 leading-none">{travelers}</p>
                        <p className="text-[10px] text-slate-400">Travel Group</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-slate-700 pt-1 border-t border-slate-100">
                      <DollarSign className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <p className="font-bold text-blue-600 leading-none">₹ {budget.toLocaleString('en-IN')}</p>
                        <p className="text-[10px] text-slate-400">Target Budget</p>
                      </div>
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
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <BrainCircuit className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">AI Copilot is Planning</h3>
              <p className="text-xs text-slate-500 mt-1">Generating unique non-repeating attractions for {destination}</p>
            </div>

            <div className="space-y-3 text-left">
              {aiSteps.map((step, idx) => {
                const isPassed = idx < currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                      isPassed ? 'text-emerald-600 font-medium' : isCurrent ? 'text-blue-600 font-bold' : 'text-slate-300'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-200 shrink-0" />
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
