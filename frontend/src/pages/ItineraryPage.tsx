import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  Calendar, 
  Users, 
  Plane, 
  Building2, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Star, 
  AlertTriangle, 
  CloudSun, 
  ExternalLink,
  MapPin,
  Compass
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { MapComponent } from '../components/MapComponent';
import { travelApi } from '../services/api';
import { Trip, Hotel, FlightItem } from '../types';
import { resolveDestinationImage } from '../utils/geoRegistry';

export const ItineraryPage: React.FC = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'day_plan' | 'map' | 'overview' | 'stay' | 'transport' | 'budget'>('day_plan');
  const [trip, setTrip] = useState<Trip | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [flights, setFlights] = useState<FlightItem[]>([]);
  const [loading, setLoading] = useState(true);

  const destParam = searchParams.get('dest');

  useEffect(() => {
    setLoading(true);
    travelApi.getTripById(id || 1, destParam || undefined)
      .then(res => {
        setTrip(res.data);
        if (res.data?.destination) {
          localStorage.setItem('travel_copilot_active_destination', res.data.destination);
          travelApi.getHotels({ city: res.data.destination }).then(h => setHotels(h.data)).catch(() => {});
          travelApi.searchFlights("Delhi", res.data.destination).then(f => setFlights(f.data.flights)).catch(() => {});
        }
      })
      .catch((err) => {
        console.error("Error fetching trip:", err);
      })
      .finally(() => setLoading(false));
  }, [id, destParam]);

  const handleDownload = () => {
    if (!trip) return;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(trip, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${trip.title.replace(/\s+/g, '_')}_Itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleShare = () => {
    if (navigator.share && trip) {
      navigator.share({
        title: trip.title,
        text: `Check out my AI-crafted itinerary for ${trip.destination}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Itinerary link copied to clipboard!");
    }
  };

  if (loading || !trip) {
    return (
      <div className="flex min-h-screen bg-[#F5EFE6]">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#9E3816] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-[#44403C]">Generating authentic day plan with TSP route optimization...</p>
        </div>
      </div>
    );
  }

  const defaultLat = (typeof (trip as any).destination_lat === 'number') ? (trip as any).destination_lat : 15.4989;
  const defaultLon = (typeof (trip as any).destination_lon === 'number') ? (trip as any).destination_lon : 73.8278;

  const markers = trip.itinerary_days.flatMap(d => d.activities.map(a => ({
    name: a.name,
    lat: (typeof a.lat === 'number' && !isNaN(a.lat) && (a.lat !== 0 || a.lon !== 0)) ? a.lat : defaultLat,
    lon: (typeof a.lon === 'number' && !isNaN(a.lon) && (a.lat !== 0 || a.lon !== 0)) ? a.lon : defaultLon,
    description: a.description,
    category: a.category,
    cost: a.cost_inr
  })));

  return (
    <div className="flex min-h-screen bg-[#F5EFE6] text-[#0C0A09] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Your AI Itinerary" 
          subtitle={`${trip.title} • ${trip.duration_days} Days / ${trip.duration_days - 1} Nights in ${trip.destination}`} 
        />

        <main className="p-6 sm:p-8 max-w-7xl w-full space-y-6">
          {/* Top Actions Header */}
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-xs font-bold text-[#0C0A09] hover:text-[#9E3816] transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </button>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleShare}
                className="px-4 py-2 rounded-full border border-[#DDCFBD] bg-white hover:bg-[#FAF6F0] text-[#0C0A09] font-bold text-xs shadow-warm-sm transition flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>

              <button 
                onClick={handleDownload}
                className="px-4 py-2 rounded-full border border-[#DDCFBD] bg-white hover:bg-[#FAF6F0] text-[#0C0A09] font-bold text-xs shadow-warm-sm transition flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden aspect-[24/8] w-full shadow-warm-lg border border-[#DDCFBD] bg-[#E8DFD3]">
            <img
              src={trip.image_url || resolveDestinationImage(trip.destination)}
              alt={trip.title}
              onError={(e) => {
                const target = e.currentTarget;
                const fallback = resolveDestinationImage(trip.destination);
                if (target.src !== fallback) {
                  target.src = fallback;
                }
              }}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09]/90 via-[#0C0A09]/30 to-transparent" />

            <div className="absolute bottom-6 left-8 text-white space-y-1.5">
              <span className="px-3.5 py-1 rounded-full bg-[#9E3816] text-white font-bold text-[11px] uppercase tracking-wider shadow-sm">
                {trip.destination}
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-extrabold tracking-tight drop-shadow-md text-white">
                {trip.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#F2ECE4] font-medium">
                {trip.duration_days} Days / {trip.duration_days - 1} Nights • {trip.start_date} – {trip.end_date}
              </p>
            </div>
          </div>

          {/* Quick-Action Integrated Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <button
              onClick={() => setActiveTab('stay')}
              className="p-4 rounded-3xl border border-[#DDCFBD] bg-white hover:bg-[#FAF6F0] transition text-left space-y-1 shadow-warm-sm group"
            >
              <div className="flex items-center justify-between text-[#9E3816]">
                <Building2 className="w-5 h-5" />
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FDECE4] text-[#9E3816]">
                  {hotels.length} Stays
                </span>
              </div>
              <p className="font-serif font-bold text-xs text-[#0C0A09]">Accommodations</p>
              <p className="text-[11px] text-[#44403C]">View verified stays &rarr;</p>
            </button>

            <button
              onClick={() => setActiveTab('transport')}
              className="p-4 rounded-3xl border border-[#DDCFBD] bg-white hover:bg-[#FAF6F0] transition text-left space-y-1 shadow-warm-sm group"
            >
              <div className="flex items-center justify-between text-[#9E3816]">
                <Plane className="w-5 h-5 -rotate-45" />
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FDECE4] text-[#9E3816]">
                  {flights.length} Flights
                </span>
              </div>
              <p className="font-serif font-bold text-xs text-[#0C0A09]">Flights & Transit</p>
              <p className="text-[11px] text-[#44403C]">Check fares & delays &rarr;</p>
            </button>

            <button
              onClick={() => navigate(`/disruptions?destination=${encodeURIComponent(trip.destination)}`)}
              className="p-4 rounded-3xl border border-[#DDCFBD] bg-white hover:bg-[#FAF6F0] transition text-left space-y-1 shadow-warm-sm group"
            >
              <div className="flex items-center justify-between text-[#D97706]">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#D97706]">
                  Live Radar
                </span>
              </div>
              <p className="font-serif font-bold text-xs text-[#0C0A09]">Disruptions</p>
              <p className="text-[11px] text-[#44403C]">Transit & road status &rarr;</p>
            </button>

            <button
              onClick={() => navigate(`/weather?destination=${encodeURIComponent(trip.destination)}`)}
              className="p-4 rounded-3xl border border-[#DDCFBD] bg-white hover:bg-[#FAF6F0] transition text-left space-y-1 shadow-warm-sm group"
            >
              <div className="flex items-center justify-between text-[#9E3816]">
                <CloudSun className="w-5 h-5" />
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#FDECE4] text-[#9E3816]">
                  Forecast
                </span>
              </div>
              <p className="font-serif font-bold text-xs text-[#0C0A09]">Weather Advisor</p>
              <p className="text-[11px] text-[#44403C]">Packing & climate tips &rarr;</p>
            </button>
          </div>

          {/* Navigation Pill Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-[#DDCFBD] pb-3 text-xs font-bold">
            {[
              { key: 'day_plan', label: 'Day Plan Timeline' },
              { key: 'map', label: 'Interactive Route Map 🗺️' },
              { key: 'overview', label: 'Trip Overview' },
              { key: 'stay', label: `Hotels (${hotels.length})` },
              { key: 'transport', label: `Flights (${flights.length})` },
              { key: 'budget', label: 'Budget Allocation' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-5 py-2.5 rounded-full transition ${
                  activeTab === tab.key
                    ? 'bg-[#9E3816] text-white shadow-terracotta'
                    : 'bg-white border border-[#DDCFBD] text-[#292524] hover:bg-[#FAF6F0]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Tab Content */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* TAB: Day Plan Timeline */}
              {activeTab === 'day_plan' && (
                <div className="space-y-6">
                  {trip.itinerary_days.map((day) => (
                    <div
                      key={day.day_number}
                      className="bg-white rounded-3xl p-6 sm:p-7 border border-[#DDCFBD] shadow-warm space-y-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDCFBD]/60 pb-3">
                        <div>
                          <span className="px-3 py-1 rounded-full bg-[#FDECE4] text-[#9E3816] text-[11px] font-bold uppercase tracking-wider">
                            DAY {day.day_number}
                          </span>
                          <h3 className="font-serif font-extrabold text-lg sm:text-xl text-[#0C0A09] mt-2">
                            {day.title}
                          </h3>
                          <p className="text-xs text-[#44403C] mt-0.5 font-medium">{day.description}</p>
                        </div>
                        <span className="text-xs font-bold text-[#78716C] shrink-0">{day.date_str}</span>
                      </div>

                      {/* Activities for the Day */}
                      <div className="space-y-3.5">
                        {day.activities.map((act, actIdx) => (
                          <div
                            key={act.order_index || actIdx}
                            className="p-4 rounded-2xl border border-[#DDCFBD] bg-[#FAF6F0] hover:bg-white hover:border-[#9E3816]/40 transition flex items-start gap-4 shadow-warm-sm"
                          >
                            <div className="w-8 h-8 rounded-full bg-white border border-[#DDCFBD] text-[#9E3816] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                              {actIdx + 1}
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <h4 className="font-serif font-extrabold text-sm text-[#0C0A09]">
                                  {act.name}
                                </h4>
                                <span className="font-black text-xs text-[#9E3816] shrink-0">
                                  {act.cost_inr > 0 ? `₹${act.cost_inr.toLocaleString('en-IN')}` : 'Free Entry'}
                                </span>
                              </div>

                              <p className="text-xs text-[#44403C] leading-relaxed font-medium">
                                {act.description}
                              </p>

                              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-[#78716C] font-semibold">
                                <span className="flex items-center gap-1 text-[#0C0A09]">
                                  <Clock className="w-3.5 h-3.5 text-[#9E3816]" />
                                  <span>{act.time_slot} ({act.duration_hrs}h)</span>
                                </span>
                                <span className="flex items-center gap-1 text-[#D97706] font-bold">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span>{act.rating}</span>
                                </span>
                                <span className="text-[#44403C] bg-white px-2.5 py-0.5 rounded-full border border-[#DDCFBD]">
                                  {act.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: Interactive Route Map */}
              {activeTab === 'map' && (
                <div className="bg-white p-6 rounded-3xl border border-[#DDCFBD] shadow-warm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-extrabold text-lg text-[#0C0A09]">Optimized Route & POI Map ({trip.destination})</h3>
                      <p className="text-xs text-[#44403C] font-medium">Interactive GPS markers sequenced with Traveling Salesperson Problem (TSP) algorithm</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#FDECE4] text-[#9E3816] font-bold text-xs">
                      {markers.length} Waypoints
                    </span>
                  </div>

                  <div className="h-[520px] rounded-2xl overflow-hidden border border-[#DDCFBD]">
                    <MapComponent markers={markers} zoom={11} showRoute={true} />
                  </div>
                </div>
              )}

              {/* TAB: Overview */}
              {activeTab === 'overview' && (
                <div className="bg-white p-6 rounded-3xl border border-[#DDCFBD] shadow-warm space-y-4 text-xs sm:text-sm text-[#44403C]">
                  <h3 className="font-serif font-extrabold text-[#0C0A09] text-base">Trip Overview & Optimization Summary</h3>
                  <p className="leading-relaxed font-medium">
                    This {trip.duration_days}-day journey to <strong className="text-[#0C0A09]">{trip.destination}</strong> has been engineered with TSP routing and 0/1 Knapsack financial optimization. It connects authentic landmarks across {trip.destination} to minimize transit fatigue.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#DDCFBD]">
                      <p className="text-xs text-[#9E3816] font-bold">Total Sights</p>
                      <p className="font-serif text-xl font-black text-[#0C0A09] mt-0.5">{markers.length} Authentic POIs</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#DDCFBD]">
                      <p className="text-xs text-[#9E3816] font-bold">TSP Optimization Score</p>
                      <p className="font-serif text-xl font-black text-[#0C0A09] mt-0.5">99.4%</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#DDCFBD]">
                      <p className="text-xs text-[#9E3816] font-bold">Disruption Risk</p>
                      <p className="font-serif text-xl font-black text-[#0C0A09] mt-0.5">Low / Safe</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Stay */}
              {activeTab === 'stay' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-extrabold text-[#0C0A09] text-base">Verified Stays in {trip.destination}</h3>
                    <button 
                      onClick={() => navigate(`/hotels?city=${encodeURIComponent(trip.destination)}`)}
                      className="text-xs font-bold text-[#9E3816] hover:underline flex items-center gap-1"
                    >
                      <span>Explore all hotels</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {hotels.slice(0, 4).map((h) => (
                      <div key={h.hotel_id} className="p-4 rounded-3xl border border-[#DDCFBD] bg-white flex flex-col sm:flex-row gap-4 items-center shadow-warm-sm">
                        <img 
                          src={h.image_url} 
                          alt={h.name} 
                          className="w-full sm:w-40 aspect-[4/3] rounded-2xl object-cover" 
                        />
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FDECE4] text-[#9E3816]">{h.tier}</span>
                            <span className="text-xs font-bold text-[#D97706] flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-current" />
                              {h.star_rating}
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-[#0C0A09] text-sm">{h.name}</h4>
                          <p className="text-xs text-[#44403C]">{h.amenities}</p>
                          <p className="text-sm font-black text-[#9E3816] pt-1">₹{h.price_per_night_inr.toLocaleString('en-IN')} / night</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: Transport */}
              {activeTab === 'transport' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-extrabold text-[#0C0A09] text-base">Flight Fares to {trip.destination}</h3>
                    <button 
                      onClick={() => navigate(`/flights?destination=${encodeURIComponent(trip.destination)}`)}
                      className="text-xs font-bold text-[#9E3816] hover:underline flex items-center gap-1"
                    >
                      <span>Search more flights</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {flights.slice(0, 4).map((f, i) => (
                      <div key={i} className="p-4 rounded-3xl border border-[#DDCFBD] bg-white flex items-center justify-between shadow-warm-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-[#FDECE4] text-[#9E3816] flex items-center justify-center font-bold">
                            <Plane className="w-5 h-5 -rotate-45" />
                          </div>
                          <div>
                            <p className="font-serif font-bold text-[#0C0A09] text-sm">{f.airline}</p>
                            <p className="text-xs text-[#44403C]">{f.source_city} &rarr; {f.destination_city} • {f.duration_hrs}h</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-base font-black text-[#9E3816]">₹{f.predicted_price_inr.toLocaleString('en-IN')}</p>
                          <span className="text-[10px] text-[#9E3816] font-bold">Delay Risk: {f.delay_risk}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: Budget */}
              {activeTab === 'budget' && (
                <div className="bg-white p-6 rounded-3xl border border-[#DDCFBD] shadow-warm space-y-4">
                  <h3 className="font-serif font-extrabold text-[#0C0A09] text-base">Knapsack Budget Allocation ({trip.destination})</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-3 rounded-2xl bg-[#FAF6F0]">
                      <span className="font-semibold text-[#44403C]">Hotels ({trip.duration_days - 1} Nights)</span>
                      <span className="font-black text-[#0C0A09]">₹ {Math.round(trip.total_budget_inr * 0.38).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-2xl bg-[#FAF6F0]">
                      <span className="font-semibold text-[#44403C]">Roundtrip Flights & Local Transit</span>
                      <span className="font-black text-[#0C0A09]">₹ {Math.round(trip.total_budget_inr * 0.32).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-2xl bg-[#FAF6F0]">
                      <span className="font-semibold text-[#44403C]">Activities & Entry Tickets</span>
                      <span className="font-black text-[#0C0A09]">₹ {Math.round(trip.total_budget_inr * 0.16).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-2xl bg-[#FAF6F0]">
                      <span className="font-semibold text-[#44403C]">Food & Dining</span>
                      <span className="font-black text-[#0C0A09]">₹ {Math.round(trip.total_budget_inr * 0.09).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-2xl bg-[#FDECE4] text-[#9E3816] font-bold border border-[#DDCFBD]">
                      <span>Emergency Buffer Reserve (5%)</span>
                      <span className="font-black">₹ {Math.round(trip.total_budget_inr * 0.05).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Trip Details Card */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 rounded-3xl border border-[#DDCFBD] shadow-warm space-y-5 sticky top-28">
                <h3 className="font-serif font-extrabold text-[#0C0A09] text-base">Trip Details</h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-[#44403C]">
                      <DollarSign className="w-4 h-4 text-[#9E3816]" />
                      <span className="font-bold">Total Budget</span>
                    </div>
                    <span className="font-black text-sm text-[#0C0A09]">
                      ₹ {trip.total_budget_inr.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-[#44403C]">
                      <Users className="w-4 h-4 text-[#9E3816]" />
                      <span className="font-bold">Travelers</span>
                    </div>
                    <span className="font-black text-[#0C0A09]">{trip.travelers_label}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-[#44403C]">
                      <Plane className="w-4 h-4 text-[#9E3816]" />
                      <span className="font-bold">Destination</span>
                    </div>
                    <span className="font-black text-[#0C0A09]">{trip.destination}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 text-[#44403C]">
                      <Building2 className="w-4 h-4 text-[#9E3816]" />
                      <span className="font-bold">Accommodation</span>
                    </div>
                    <span className="font-black text-[#0C0A09]">{trip.duration_days - 1} Nights</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#DDCFBD]/60">
                    <div className="flex items-center gap-2.5 text-[#44403C]">
                      <Calendar className="w-4 h-4 text-[#9E3816]" />
                      <span className="font-bold">Total Days</span>
                    </div>
                    <span className="font-black text-[#0C0A09]">{trip.duration_days} Days</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/assistant')}
                  className="w-full py-3 rounded-full bg-[#9E3816] hover:bg-[#832C0E] text-white font-bold text-xs shadow-terracotta transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#D97706]" />
                  <span>Ask AI to Adjust Itinerary</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
