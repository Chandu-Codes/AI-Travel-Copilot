import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  CloudSun, 
  Sun, 
  CloudRain, 
  Wind, 
  Droplets, 
  Thermometer, 
  MapPin, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { travelApi } from '../services/api';
import { WeatherForecast, WeatherDayForecast } from '../types';

export const WeatherPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const destParam = searchParams.get('destination') || localStorage.getItem('travel_copilot_active_destination') || 'Goa';

  const [destination, setDestination] = useState(destParam);
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = (city: string) => {
    setLoading(true);
    travelApi.getWeather(city)
      .then(res => setWeather(res.data))
      .catch(err => {
        console.error("Error fetching weather:", err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWeather(destination);
  }, [destination]);

  const dailyForecastList: WeatherDayForecast[] = weather?.daily_forecast || [
    { day_name: "Today", temp_max_c: 31, temp_min_c: 24, condition: "Sunny" },
    { day_name: "Tomorrow", temp_max_c: 30, temp_min_c: 23, condition: "Clear Sky" },
    { day_name: "Day 3", temp_max_c: 29, temp_min_c: 22, condition: "Partly Cloudy" },
    { day_name: "Day 4", temp_max_c: 28, temp_min_c: 22, condition: "Sunny" },
    { day_name: "Day 5", temp_max_c: 30, temp_min_c: 24, condition: "Warm & Breezy" },
  ];

  const packingTips: string[] = weather?.packing_tips || [
    "Lightweight cotton & breathable linen fabrics",
    "UV protective sunglasses & SPF 50+ sunscreen",
    "Comfortable walking shoes & sandals",
    "Compact umbrella for unexpected mountain showers"
  ];

  const indoorAlternatives: string[] = weather?.indoor_alternatives || [
    "State Museum & Cultural Art Gallery",
    "Historic Cathedral & Sacred Relics Tour",
    "Artisan Spice Plantation & Tasting Pavilion"
  ];

  return (
    <div className="flex min-h-screen bg-[#F5EFE6] text-[#0C0A09] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Predictive Weather Forecast ☀️" 
          subtitle="Real-time OpenWeather integration with AI packing recommendations & indoor activity backup plans" 
        />

        <main className="p-6 sm:p-8 max-w-7xl w-full space-y-6">
          {/* Destination Quick Bar */}
          <div className="bg-white p-5 rounded-3xl border border-[#DDCFBD] shadow-warm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-2xl bg-[#FDECE4] text-[#9E3816] flex items-center justify-center font-bold shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Search city weather (e.g. Manali, Paris, Goa)"
                className="w-full sm:w-80 px-4 py-2.5 rounded-2xl border border-[#DDCFBD] bg-[#FAF6F0] text-xs sm:text-sm font-bold text-[#0C0A09] outline-none focus:border-[#9E3816]"
              />
            </div>

            <button
              onClick={() => fetchWeather(destination)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#9E3816] hover:bg-[#832C0E] text-white font-bold text-xs shadow-warm-sm transition"
            >
              Update Forecast
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs font-semibold text-[#44403C]">
              Querying atmospheric barometric telemetry and precipitation probabilities...
            </div>
          ) : weather ? (
            <div className="space-y-6">
              {/* Today's Climate Hero Card */}
              <div className="bg-gradient-to-br from-[#9E3816] to-[#6C240B] text-white p-8 rounded-3xl shadow-terracotta space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="px-3.5 py-1 rounded-full bg-white/20 text-white font-bold text-xs">
                      Live Regional Climate
                    </span>
                    <h3 className="font-serif text-3xl font-extrabold mt-2 text-white">{weather.destination || destination}</h3>
                    <p className="text-xs text-[#F2ECE4]">{weather.condition || "Optimal Conditions"} • {weather.date || "Today"}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Sun className="w-16 h-16 text-white animate-pulse" />
                    <span className="font-serif text-5xl font-black text-white">{weather.temperature_c ?? 28}°C</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/20 text-xs">
                  <div className="flex items-center gap-2.5">
                    <Thermometer className="w-4 h-4 text-[#F2ECE4]" />
                    <div>
                      <p className="text-[10px] text-[#F2ECE4]">Feels Like</p>
                      <p className="font-bold text-white">{weather.feels_like_c ?? 29}°C</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Droplets className="w-4 h-4 text-[#F2ECE4]" />
                    <div>
                      <p className="text-[10px] text-[#F2ECE4]">Humidity</p>
                      <p className="font-bold text-white">{weather.humidity_percent ?? 65}%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Wind className="w-4 h-4 text-[#F2ECE4]" />
                    <div>
                      <p className="text-[10px] text-[#F2ECE4]">Wind Velocity</p>
                      <p className="font-bold text-white">{weather.wind_speed_kmh ?? 12} km/h</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <CloudRain className="w-4 h-4 text-[#F2ECE4]" />
                    <div>
                      <p className="text-[10px] text-[#F2ECE4]">Rain Probability</p>
                      <p className="font-bold text-white">{weather.rain_probability_percent ?? 10}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5-Day Forecast Grid */}
              <div className="space-y-3">
                <h4 className="font-serif font-bold text-[#0C0A09] text-base">5-Day Weather Outlook</h4>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {dailyForecastList.map((day: WeatherDayForecast, idx: number) => (
                    <div key={idx} className="bg-white p-4 rounded-3xl border border-[#DDCFBD] text-center space-y-2 shadow-warm-sm">
                      <p className="text-xs font-bold text-[#44403C]">{day.day_name}</p>
                      <CloudSun className="w-8 h-8 text-[#9E3816] mx-auto" />
                      <div>
                        <p className="font-serif font-black text-base text-[#0C0A09]">{day.temp_max_c}° / {day.temp_min_c}°</p>
                        <p className="text-[11px] text-[#78716C] font-semibold mt-0.5">{day.condition}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Packing Advisor & Rain Alternative Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-[#DDCFBD] shadow-warm space-y-3">
                  <div className="flex items-center gap-2 text-[#9E3816] font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-[#9E3816]" />
                    <span>AI Packing & Clothing Checklist</span>
                  </div>
                  <p className="text-xs text-[#44403C] font-medium leading-relaxed">
                    Based on anticipated temperatures ({weather.temperature_c ?? 28}°C) in {weather.destination || destination}:
                  </p>
                  <ul className="text-xs space-y-1.5 text-[#0C0A09] font-bold">
                    {packingTips.map((tip: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9E3816]" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-[#DDCFBD] shadow-warm space-y-3">
                  <div className="flex items-center gap-2 text-[#9E3816] font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-[#9E3816]" />
                    <span>Inclement Weather Contingency Plan</span>
                  </div>
                  <p className="text-xs text-[#44403C] font-medium leading-relaxed">
                    Should heavy rain impact outdoor excursions, the AI assistant will automatically swap open-air activities with vetted indoor heritage galleries and culinary experiences.
                  </p>
                  <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#DDCFBD] text-xs">
                    <p className="font-bold text-[#0C0A09]">Recommended Indoor Alternatives:</p>
                    <p className="text-[#44403C] font-medium mt-0.5">{indoorAlternatives.join(' • ')}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
};
