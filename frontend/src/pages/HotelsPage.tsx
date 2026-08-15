import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Star, 
  Sparkles, 
  MapPin, 
  Check, 
  Search, 
  Filter,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { travelApi } from '../services/api';
import { Hotel } from '../types';

export const HotelsPage: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedTier, setSelectedTier] = useState('All');
  const [bookedHotel, setBookedHotel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const cities = ['All', 'Goa', 'Jaipur', 'Alleppey', 'Kochi', 'Munnar'];
  const tiers = ['All', 'Luxury', 'Mid-Range', 'Budget / Hostel'];

  useEffect(() => {
    travelApi.getHotels({
      city: selectedCity === 'All' ? undefined : selectedCity,
      tier: selectedTier === 'All' ? undefined : selectedTier
    })
      .then(res => setHotels(res.data))
      .catch(err => console.error("Hotels fetch error:", err))
      .finally(() => setLoading(false));
  }, [selectedCity, selectedTier]);

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
          {/* Filter Header */}
          <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">City:</span>
              <div className="flex gap-1.5 overflow-x-auto">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      selectedCity === city
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Tier:</span>
              <div className="flex gap-1.5">
                {tiers.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                      selectedTier === tier
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
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
                          <span>{hotel.city}, India</span>
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
                          <span className="font-bold text-emerald-600">94% Positive</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="w-[94%] h-full bg-emerald-500 rounded-full" />
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
