import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plane, 
  Search, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  TrendingDown,
  MapPin
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { travelApi } from '../services/api';
import { FlightItem } from '../types';

export const FlightsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDest = searchParams.get('destination') || localStorage.getItem('travel_copilot_active_destination') || 'Goa';

  const [source, setSource] = useState('Delhi');
  const [destination, setDestination] = useState(initialDest);
  const [daysLeft, setDaysLeft] = useState(15);
  const [flights, setFlights] = useState<FlightItem[]>([]);
  const [bookedFlight, setBookedFlight] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleSelectFlight = async (f: FlightItem) => {
    try {
      await travelApi.createBooking({
        booking_type: "Flight",
        item_name: `${f.airline} Flight ${f.flight_number || '6E-402'}`,
        destination: f.destination_city,
        amount_inr: f.predicted_price_inr,
        details: `${f.source_city} -> ${f.destination_city} • ${f.cabin_class} (${f.stops})`
      });
      setBookedFlight(`${f.airline}-${f.departure_time}`);
      setTimeout(() => setBookedFlight(null), 3000);
    } catch (err) {
      console.error("Flight booking error:", err);
    }
  };

  const popularDestinations = ['Manali', 'Goa', 'Paris', 'Switzerland', 'Jaipur', 'Munnar', 'Kerala', 'Japan', 'Bali', 'Dubai', 'Maldives', 'Ladakh'];

  const fetchFlights = (destQuery?: string) => {
    setLoading(true);
    const dest = destQuery || destination;
    travelApi.searchFlights(source, dest, daysLeft)
      .then(res => setFlights(res.data.flights))
      .catch(err => console.error("Flight error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFlights(destination);
  }, [destination]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ destination });
    localStorage.setItem('travel_copilot_active_destination', destination);
    fetchFlights(destination);
  };

  const handleSelectQuick = (place: string) => {
    setDestination(place);
    setSearchParams({ destination: place });
    localStorage.setItem('travel_copilot_active_destination', place);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Flight Fares & Disruption Risk" 
          subtitle="Machine Learning price predictions and real-time delay risk analysis" 
        />

        <main className="p-8 max-w-7xl w-full space-y-6">
          {/* Active Trip Notice */}
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center gap-2 shadow-2xs">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Showing flight routes, airline options, and ML price predictions for <strong>{destination}</strong></span>
          </div>

          {/* Quick Destination Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0">Popular:</span>
            <div className="flex gap-1.5 flex-nowrap">
              {popularDestinations.map((d) => (
                <button
                  key={d}
                  onClick={() => handleSelectQuick(d)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                    destination.toLowerCase() === d.toLowerCase()
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Search Header */}
          <form onSubmit={handleSearch} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">From (Origin)</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Delhi / Mumbai"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">To (Destination)</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Manali, Paris, Goa, Switzerland"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Days to Departure</label>
              <input
                type="number"
                min="1"
                max="60"
                value={daysLeft}
                onChange={(e) => setDaysLeft(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Search Flights</span>
            </button>
          </form>

          {/* Flights Cards List */}
          <div className="space-y-4">
            {flights.map((f, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col md:flex-row items-center justify-between gap-6"
              >
                {/* Airline & Route */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-sm shrink-0">
                    <Plane className="w-6 h-6 -rotate-45" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{f.airline}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                        {f.cabin_class}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        f.recommended_badge.includes('Cheapest') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {f.recommended_badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {f.source_city} &rarr; <strong>{f.destination_city}</strong> ({f.destination_airport || f.destination_city})
                    </p>
                    <p className="text-[11px] text-slate-400">{f.departure_time} • Flight {f.flight_number || '6E-402'}</p>
                  </div>
                </div>

                {/* Timing & Delay Risk */}
                <div className="flex items-center gap-8 text-xs text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Flight Duration</span>
                    <span className="font-bold text-slate-900">{f.duration_hrs}h ({f.stops})</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">ML Delay Risk</span>
                    <span className={`font-bold flex items-center gap-1 ${
                      f.delay_risk === 'Low' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {f.delay_risk === 'Low' ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                      {f.delay_risk} Risk ({f.delay_probability_pct}%)
                    </span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 font-medium">Predicted Fare</span>
                    <p className="text-xl font-extrabold text-blue-600">₹{f.predicted_price_inr.toLocaleString('en-IN')}</p>
                    <span className="text-[10px] text-slate-400 font-medium">Range: {f.price_range_inr}</span>
                  </div>

                  <button
                    onClick={() => handleSelectFlight(f)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                  >
                    {bookedFlight === `${f.airline}-${f.departure_time}` ? (
                      <span className="text-emerald-400 font-bold">Flight Reserved!</span>
                    ) : (
                      <span>Select Flight</span>
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
