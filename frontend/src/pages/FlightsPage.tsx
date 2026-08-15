import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Search, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { travelApi } from '../services/api';
import { FlightItem } from '../types';

export const FlightsPage: React.FC = () => {
  const [source, setSource] = useState('Delhi');
  const [destination, setDestination] = useState('Goa');
  const [daysLeft, setDaysLeft] = useState(15);
  const [flights, setFlights] = useState<FlightItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFlights = () => {
    setLoading(true);
    travelApi.searchFlights(source, destination, daysLeft)
      .then(res => setFlights(res.data.flights))
      .catch(err => console.error("Flight error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Flight Fares & Disruption Risk" 
          subtitle="Machine Learning price predictions (RandomForest R²=0.97) and live delay risk analysis" 
        />

        <main className="p-8 max-w-7xl w-full space-y-6">
          {/* Search Header */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">From</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">To</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50"
              />
            </div>

            <button
              onClick={fetchFlights}
              className="py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Predict Fares</span>
            </button>
          </div>

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
                    <p className="text-xs text-slate-400 mt-0.5">{f.source_city} → {f.destination_city} • {f.departure_time}</p>
                  </div>
                </div>

                {/* Timing & Delay Risk */}
                <div className="flex items-center gap-8 text-xs text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Flight Duration</span>
                    <span className="font-bold text-slate-900">{f.duration_hrs} Hours (Non-stop)</span>
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
                    <span className="text-[10px] text-slate-400 font-medium">ML Predicted Fare</span>
                    <p className="text-xl font-extrabold text-blue-600">₹{f.predicted_price_inr.toLocaleString('en-IN')}</p>
                    <span className="text-[10px] text-slate-400 font-medium">Range: {f.price_range_inr}</span>
                  </div>

                  <button
                    onClick={() => alert(`Selected ${f.airline} flight (${f.source_city} -> ${f.destination_city}) for booking!`)}
                    className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition"
                  >
                    Select Flight
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
