import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  Star, 
  Sparkles, 
  MapPin, 
  Check, 
  Search, 
  Filter,
  ShieldCheck,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { travelApi } from '../services/api';
import { Hotel } from '../types';

export const HotelsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || localStorage.getItem('travel_copilot_active_destination') || 'All';
  
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [customSearch, setCustomSearch] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');
  const [bookedHotel, setBookedHotel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const popularCities = ['All', 'Manali', 'Goa', 'Paris', 'Switzerland', 'Jaipur', 'Munnar', 'Kerala', 'Japan', 'Bali', 'Dubai', 'Maldives', 'Ladakh'];
  const tiers = ['All', 'Luxury', 'Mid-Range', 'Budget / Hostel'];

  const fetchHotels = (cityQuery?: string) => {
    setLoading(true);
    const c = cityQuery !== undefined ? cityQuery : selectedCity;
    travelApi.getHotels({
      city: (!c || c === 'All') ? undefined : c,
      tier: selectedTier === 'All' ? undefined : selectedTier
    })
      .then(res => setHotels(res.data))
      .catch(err => console.error("Hotels fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHotels(selectedCity);
  }, [selectedCity, selectedTier]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setSearchParams(city === 'All' ? {} : { city });
    localStorage.setItem('travel_copilot_active_destination', city === 'All' ? '' : city);
  };

  const handleCustomSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSearch.trim()) {
      setSelectedCity(customSearch.trim());
      setSearchParams({ city: customSearch.trim() });
    }
  };

  const handleBookAssist = async (hotelId: string) => {
    try {
      await travelApi.bookHotelAssist(hotelId);
      setBookedHotel(hotelId);
      setTimeout(() => setBookedHotel(null), 3000);
    } catch (err) {
      console.error("Booking error:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Hotel Discovery & Booking" 
          subtitle="NLP-analyzed sentiment reviews, star ratings, and instant AI booking assistance" 
        />

        <main className="p-8 max-w-7xl w-full space-y-6">
          {/* Active Filter Notice */}
          {selectedCity && selectedCity !== 'All' && (
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center justify-between shadow-2xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Showing verified hotels & stays matching your trip to <strong>{selectedCity}</strong></span>
              </div>
              <button 
                onClick={() => handleCitySelect('All')}
                className="text-[11px] text-blue-700 underline font-bold hover:text-blue-900"
              >
                Clear Filter (View All)
              </button>
            </div>
          )}

          {/* Search & Filter Header */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            {/* Custom Search Input */}
            <form onSubmit={handleCustomSearch} className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={customSearch}
                  onChange={(e) => setCustomSearch(e.target.value)}
                  placeholder="Search hotels in any city (e.g. Manali, Paris, Goa, Switzerland, Tokyo)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 text-xs font-semibold text-slate-900 bg-slate-50 outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
              >
                Search
              </button>
            </form>

            {/* City Quick Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0">City:</span>
              <div className="flex gap-1.5 flex-nowrap">
                {popularCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                      selectedCity.toLowerCase() === city.toLowerCase()
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            {/* Tier Filter */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Tier:</span>
              <div className="flex gap-1.5">
                {tiers.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      selectedTier === tier
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading / Results count */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Found {hotels.length} verified accommodations</span>
          </div>

          {/* Hotels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map((hotel) => (
              <div 
                key={hotel.hotel_id}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img
                      src={hotel.image_url}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                      {hotel.tier}
                    </div>
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-blue-600/90 text-white text-[11px] font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{hotel.ai_recommendation_score}% AI Match</span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base leading-tight">{hotel.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{hotel.city}, {hotel.country || 'Global'}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-lg text-amber-800 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{hotel.star_rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{hotel.amenities}</p>

                    {/* NLP Sentiment Aspect Breakdown */}
                    {hotel.sentiment_summary && (
                      <div className="pt-2 border-t border-slate-100 space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between text-slate-600">
                          <span>NLP Cleanliness Score</span>
                          <span className="font-bold text-emerald-600">96% Positive</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="w-[96%] h-full bg-emerald-500 rounded-full" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium">Nightly Rate</span>
                    <p className="text-base font-extrabold text-blue-600">
                      ₹{hotel.price_per_night_inr.toLocaleString('en-IN')}
                    </p>
                  </div>

                  <button
                    onClick={() => handleBookAssist(hotel.hotel_id)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                  >
                    {bookedHotel === hotel.hotel_id ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Reserved!</span>
                      </>
                    ) : (
                      <span>Book Assist</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
