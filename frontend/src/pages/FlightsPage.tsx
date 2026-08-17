import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plane, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Search 
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { travelApi } from '../services/api';
import { FlightItem } from '../types';

export const FlightsPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [source, setSource] = useState('Delhi');
  const [destination, setDestination] = useState(searchParams.get('destination') || localStorage.getItem('travel_copilot_active_destination') || 'Goa');
  const [travelDate, setTravelDate] = useState('2025-06-10');
  const [flights, setFlights] = useState<FlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingFlight, setBookingFlight] = useState<FlightItem | null>(null);

  const fetchFlights = () => {
    setLoading(true);
    travelApi.searchFlights(source, destination, 15)
      .then(res => setFlights(res.data.flights))
      .catch(err => {
        console.error("Error fetching flights:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFlights();
  }, [destination]);

  return (
    <div className="flex min-h-screen bg-[#FAF6F0] text-[#1D1917] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Predicted Flight Fares ✈️" 
          subtitle="Machine Learning Price Forecasting & Autonomous Delay Risk Engine" 
        />

        <main className="p-6 sm:p-8 max-w-7xl w-full space-y-6">
          {/* Flight Search Bar */}
          <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-warm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">From (Source)</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. Delhi, Mumbai, Bengaluru"
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E8DFD3] bg-[#F8F3EC] text-xs sm:text-sm font-bold text-[#1D1917] outline-none focus:border-[#A23B19]"
                />
              </div>

              <div className="sm:col-span-4 space-y-1">
                <label className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">To (Destination)</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Goa, Zurich, Paris, Manali"
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E8DFD3] bg-[#F8F3EC] text-xs sm:text-sm font-bold text-[#1D1917] outline-none focus:border-[#A23B19]"
                />
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider">Departure Date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl border border-[#E8DFD3] bg-[#F8F3EC] text-xs sm:text-sm font-medium text-[#1D1917] outline-none focus:border-[#A23B19]"
                />
              </div>

              <div className="sm:col-span-1">
                <button
                  onClick={fetchFlights}
                  className="w-full h-10 rounded-2xl bg-[#A23B19] hover:bg-[#892F11] text-white flex items-center justify-center shadow-warm-sm transition"
                  title="Search Flights"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Flights Listing */}
          {loading ? (
            <div className="py-12 text-center text-xs font-semibold text-[#78716C]">
              Running Random Forest regression price predictions and weather disruption checks...
            </div>
          ) : flights.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-[#E8DFD3] text-xs font-medium text-[#78716C]">
              No flight schedules found for {source} &rarr; {destination}. Try changing cities.
            </div>
          ) : (
            <div className="space-y-4">
              {flights.map((flight, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-3xl border border-[#E8DFD3] p-5 sm:p-6 shadow-warm-sm hover:shadow-warm hover:border-[#A23B19]/50 transition duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Flight Route & Timings */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-[#FBECE7] text-[#A23B19] flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                      <Plane className="w-6 h-6 -rotate-45" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-[#1D1917]">{flight.airline}</span>
                        <span className="text-[10px] font-semibold text-[#78716C] bg-[#F8F3EC] px-2.5 py-0.5 rounded-full border border-[#E8DFD3]">
                          {flight.flight_number || 'AI-102'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-medium text-[#78716C]">
                        <span>{flight.source_city}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#A23B19]" />
                        <span>{flight.destination_city}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#A23B19]" />
                          {flight.duration_hrs}h Non-stop
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delay Risk & Recommendation */}
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-[#F8F3EC] border border-[#E8DFD3] text-left">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1D1917]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#A23B19]" />
                        <span>ML Delay Risk:</span>
                        <span className={`font-black ${
                          flight.delay_risk === 'Low' ? 'text-emerald-700' : 'text-[#A23B19]'
                        }`}>
                          {flight.delay_risk}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#78716C] mt-0.5">{flight.recommended_badge || 'Good time to book'}</p>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-[#E8DFD3]">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] text-[#78716C] uppercase font-bold">Predicted Fare</p>
                      <p className="font-serif font-black text-xl text-[#A23B19]">
                        ₹{flight.predicted_price_inr.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <button
                      onClick={() => setBookingFlight(flight)}
                      className="px-6 py-2.5 rounded-full bg-[#A23B19] hover:bg-[#892F11] text-white font-bold text-xs shadow-warm-sm transition"
                    >
                      Book Fare
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Flight Booking Assistant Modal */}
      {bookingFlight && (
        <div className="fixed inset-0 bg-[#1D1917]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#E8DFD3] shadow-warm-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-[#1D1917] text-lg">Flight Fare Confirmation</h3>
              <button 
                onClick={() => setBookingFlight(null)} 
                className="text-xs text-[#78716C] hover:text-[#1D1917] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F3EC] border border-[#E8DFD3] space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-serif font-bold text-sm text-[#1D1917]">{bookingFlight.airline} ({bookingFlight.flight_number || 'Direct'})</span>
                <span className="text-xs text-[#A23B19] font-bold">{bookingFlight.source_city} &rarr; {bookingFlight.destination_city}</span>
              </div>
              <p className="text-xs text-[#78716C]">{travelDate} • {bookingFlight.duration_hrs}h Duration</p>
              <div className="flex justify-between items-baseline pt-2 border-t border-[#E8DFD3]">
                <span className="text-xs font-semibold text-[#78716C]">Predicted Locked Fare:</span>
                <span className="text-base font-extrabold text-[#A23B19]">₹{bookingFlight.predicted_price_inr.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-xs text-[#78716C]">
              Price lock guaranteed with autonomous flight delay protection and rebooking alerts.
            </p>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setBookingFlight(null)}
                className="flex-1 py-2.5 rounded-full border border-[#E8DFD3] text-xs font-bold text-[#1D1917] hover:bg-[#F8F3EC]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Flight ticket booked for ${bookingFlight.airline}! E-ticket issued to your profile.`);
                  setBookingFlight(null);
                }}
                className="flex-1 py-2.5 rounded-full bg-[#A23B19] hover:bg-[#892F11] text-white font-bold text-xs shadow-terracotta"
              >
                Confirm Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
