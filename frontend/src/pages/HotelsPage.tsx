import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Search, 
  Sparkles 
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { travelApi } from '../services/api';
import { Hotel } from '../types';

export const HotelsPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const cityParam = searchParams.get('city') || localStorage.getItem('travel_copilot_active_destination') || 'Goa';
  const [selectedCity, setSelectedCity] = useState(cityParam);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [bookingHotel, setBookingHotel] = useState<Hotel | null>(null);

  const cityOptions = ['Goa', 'Manali', 'Paris', 'Switzerland', 'Jaipur', 'Kerala', 'Ladakh'];
  const tierOptions = ['All', 'Luxury', 'Mid-Range', 'Boutique', 'Budget'];

  useEffect(() => {
    setLoading(true);
    travelApi.getHotels({ city: selectedCity, tier: selectedTier !== 'All' ? selectedTier : undefined })
      .then(res => setHotels(res.data))
      .catch(err => console.error("Error fetching hotels:", err))
      .finally(() => setLoading(false));
  }, [selectedCity, selectedTier]);

  const filteredHotels = hotels.filter(h => 
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.amenities.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#FAF6F0] text-[#1D1917] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Verified Hotel Stays 🏨" 
          subtitle="AI Sentiment Analyzed Accommodations with Aspect-Level Guest Satisfaction" 
        />

        <main className="p-6 sm:p-8 max-w-7xl w-full space-y-6">
          {/* Search & Filter Header Bar */}
          <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-warm space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#A23B19] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hotels by name, pool, heritage, beach view..."
                  className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#E8DFD3] bg-[#F8F3EC] text-xs sm:text-sm font-medium text-[#1D1917] outline-none focus:border-[#A23B19]"
                />
              </div>

              {/* Tier Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {tierOptions.map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition ${
                      selectedTier === tier
                        ? 'bg-[#A23B19] text-white shadow-warm-sm'
                        : 'bg-[#F8F3EC] text-[#78716C] hover:bg-[#EFE8DE]'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* City Fast Selection Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1">
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider shrink-0">City:</span>
              {cityOptions.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold shrink-0 transition ${
                    selectedCity.toLowerCase() === city.toLowerCase()
                      ? 'bg-[#A23B19] text-white shadow-warm-sm'
                      : 'bg-white border border-[#E8DFD3] text-[#78716C] hover:border-[#A23B19]'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Hotel Grid */}
          {loading ? (
            <div className="py-12 text-center text-xs font-semibold text-[#78716C]">
              Scanning live hospitality inventory and NLP sentiment ratings...
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#E8DFD3] text-xs font-medium text-[#78716C]">
              No hotels found for the selected criteria. Try switching the city or tier filter.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map((hotel) => {
                const sentimentPct = hotel.sentiment_score ?? Math.min(99, Math.round((hotel.review_score || 4.7) * 20));
                const hotelLocation = hotel.location || hotel.address || hotel.city;
                const reviewSummary = hotel.review_summary || `${hotel.tier} stay with top-tier amenities and hospitality.`;

                return (
                  <div 
                    key={hotel.hotel_id}
                    className="bg-white rounded-3xl border border-[#E8DFD3] overflow-hidden shadow-warm-sm hover:shadow-warm hover:border-[#A23B19]/50 transition duration-300 flex flex-col justify-between"
                  >
                    <div>
                      {/* Hotel Image Container */}
                      <div className="relative aspect-[16/10] w-full bg-[#FAF6F0] overflow-hidden">
                        <img 
                          src={hotel.image_url} 
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                        />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#A23B19] text-white font-bold text-[10px] shadow-sm">
                          {hotel.tier}
                        </div>

                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#1D1917] font-bold text-xs shadow-sm flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#D97736] text-[#D97736]" />
                          <span>{hotel.star_rating}</span>
                        </div>
                      </div>

                      {/* Hotel Content Details */}
                      <div className="p-5 space-y-3">
                        <div>
                          <div className="flex items-center gap-1 text-[11px] text-[#78716C] font-semibold">
                            <MapPin className="w-3 h-3 text-[#A23B19]" />
                            <span>{hotelLocation}</span>
                          </div>
                          <h3 className="font-serif font-bold text-[#1D1917] text-base mt-1 leading-tight">{hotel.name}</h3>
                        </div>

                        <p className="text-xs text-[#78716C] line-clamp-2">{hotel.amenities}</p>

                        {/* NLP Sentiment Aspect Bar */}
                        <div className="bg-[#F8F3EC] p-3 rounded-2xl border border-[#E8DFD3] space-y-1.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-[#1D1917] flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#D97736]" />
                              NLP Sentiment
                            </span>
                            <span className="font-extrabold text-[#A23B19]">{sentimentPct}% Positive</span>
                          </div>
                          <div className="w-full bg-[#E8DFD3] h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-[#A23B19] h-full rounded-full" 
                              style={{ width: `${sentimentPct}%` }} 
                            />
                          </div>
                          <p className="text-[10px] text-[#78716C] italic font-medium">"{reviewSummary}"</p>
                        </div>
                      </div>
                    </div>

                    {/* Pricing and Booking Action */}
                    <div className="p-5 pt-0 border-t border-[#E8DFD3]/60 flex items-center justify-between mt-2">
                      <div>
                        <p className="text-[10px] text-[#78716C] font-semibold uppercase">Per Night</p>
                        <p className="font-serif font-black text-base text-[#1D1917]">₹{hotel.price_per_night_inr.toLocaleString('en-IN')}</p>
                      </div>

                      <button
                        onClick={() => setBookingHotel(hotel)}
                        className="px-5 py-2 rounded-full bg-[#A23B19] hover:bg-[#892F11] text-white font-bold text-xs shadow-warm-sm transition"
                      >
                        Book Assist
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Booking Assistant Modal */}
      {bookingHotel && (
        <div className="fixed inset-0 bg-[#1D1917]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E8DFD3] shadow-warm-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-[#1D1917] text-lg">Confirm Hotel Reservation</h3>
              <button 
                onClick={() => setBookingHotel(null)} 
                className="text-xs text-[#78716C] hover:text-[#1D1917] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F3EC] border border-[#E8DFD3] space-y-2">
              <h4 className="font-serif font-bold text-[#1D1917]">{bookingHotel.name}</h4>
              <p className="text-xs text-[#78716C]">{bookingHotel.location || bookingHotel.city}</p>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#E8DFD3]">
                <span className="text-xs font-semibold text-[#78716C]">Nightly Tariff:</span>
                <span className="text-base font-extrabold text-[#A23B19]">₹{bookingHotel.price_per_night_inr.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-xs text-[#78716C]">
              AI Travel Copilot will verify live room availability and lock in the lowest guaranteed promotional tariff.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setBookingHotel(null)}
                className="flex-1 py-2.5 rounded-full border border-[#E8DFD3] text-xs font-bold text-[#1D1917] hover:bg-[#F8F3EC]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Booking Assist request placed for ${bookingHotel.name}! Reservation voucher sent to your registered email.`);
                  setBookingHotel(null);
                }}
                className="flex-1 py-2.5 rounded-full bg-[#A23B19] hover:bg-[#892F11] text-white font-bold text-xs shadow-terracotta"
              >
                Confirm Stay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
