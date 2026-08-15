import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Thermometer, 
  Sun, 
  CloudRain, 
  AlertCircle,
  MapPin,
  Sparkles,
  Shirt
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { travelApi } from '../services/api';

export const WeatherPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDest = searchParams.get('destination') || localStorage.getItem('travel_copilot_active_destination') || 'Goa';

  const [destination, setDestination] = useState(initialDest);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [indoorReroute, setIndoorReroute] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const cityOptions = ['Manali', 'Goa', 'Paris', 'Switzerland', 'Japan', 'Bali', 'Dubai', 'Maldives', 'Jaipur', 'Kerala', 'Ladakh'];

  const fetchWeather = (dest: string) => {
    setLoading(true);
    travelApi.getWeather(dest)
      .then(res => {
        setWeatherData(res.data.weather);
        setIndoorReroute(res.data.indoor_rerouting);
      })
      .catch(err => console.error("Weather error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWeather(destination);
  }, [destination]);

  const handleSelectCity = (c: string) => {
    setDestination(c);
    setSearchParams({ destination: c });
    localStorage.setItem('travel_copilot_active_destination', c);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Weather & Climate Intelligence" 
          subtitle="Forecast radars, rain probability, packing tips, and AI automated indoor rerouting" 
        />

        <main className="p-8 max-w-7xl w-full space-y-6">
          {/* Active Trip Notice */}
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center gap-2 shadow-2xs">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Weather intelligence active for <strong>{destination}</strong></span>
          </div>

          {/* Destination Quick Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase shrink-0">City:</span>
            <div className="flex gap-1.5 flex-nowrap">
              {cityOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => handleSelectCity(c)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition shrink-0 ${
                    destination.toLowerCase() === c.toLowerCase()
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {weatherData && (
            <div className="space-y-6">
              {/* Current Weather Card */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 rounded-3xl shadow-xl shadow-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-white/80 text-xs font-medium">
                    <MapPin className="w-4 h-4" />
                    <span>{weatherData.city}</span>
                  </div>
                  <h3 className="text-5xl font-black">{weatherData.current_temp_c}°C</h3>
                  <p className="text-base font-semibold text-blue-100">{weatherData.condition}</p>
                </div>

                <div className="grid grid-cols-3 gap-6 bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 text-xs">
                  <div>
                    <div className="flex items-center gap-1 text-blue-200">
                      <Droplets className="w-4 h-4" />
                      <span>Rain Prob.</span>
                    </div>
                    <p className="text-lg font-bold text-white mt-1">{weatherData.rain_probability_pct}%</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-blue-200">
                      <Thermometer className="w-4 h-4" />
                      <span>Humidity</span>
                    </div>
                    <p className="text-lg font-bold text-white mt-1">{weatherData.humidity_pct}%</p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-blue-200">
                      <Wind className="w-4 h-4" />
                      <span>Wind</span>
                    </div>
                    <p className="text-lg font-bold text-white mt-1">{weatherData.wind_speed_kmh} km/h</p>
                  </div>
                </div>
              </div>

              {/* AI Packing & Clothing Recommendation */}
              {weatherData.clothing_tip && (
                <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Shirt className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">AI Packing & Clothing Advisory for {destination}</h4>
                    <p className="text-xs text-slate-600 font-medium mt-0.5">{weatherData.clothing_tip}</p>
                  </div>
                </div>
              )}

              {/* Rain / Severe Weather Advisory & Indoor Rerouting Card */}
              {indoorReroute && (
                <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 space-y-3 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <span>Weather Adaptation Advisory: Precipitation Expected in {destination}</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed font-medium">{indoorReroute.advisory}</p>
                  
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-amber-900 uppercase">Recommended Indoor Substitutions:</span>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {indoorReroute.indoor_alternatives.map((alt: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-white border border-amber-200 rounded-xl text-xs font-semibold text-amber-900 shadow-2xs">
                          🏛️ {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5-Day Forecast Grid */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                <h4 className="font-bold text-slate-900 text-base">5-Day Weather Outlook for {destination}</h4>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {weatherData.forecast_5_days.map((fc: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
                      <span className="text-xs font-bold text-slate-400">{fc.day}</span>
                      <div className="flex justify-center">
                        {fc.rain_pct > 30 ? (
                          <CloudRain className="w-6 h-6 text-blue-500" />
                        ) : (
                          <Sun className="w-6 h-6 text-amber-500" />
                        )}
                      </div>
                      <p className="text-base font-extrabold text-slate-900">{fc.temp_c}°C</p>
                      <span className="text-[10px] text-slate-500 block">{fc.condition}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
