import React, { useState, useEffect } from 'react';
import { Search, Globe2, Compass, Sparkles, MapPin, SlidersHorizontal } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { DestinationCard } from '../components/DestinationCard';
import { travelApi } from '../services/api';
import { DestinationCard as IDestinationCard } from '../types';

export const ExplorePage: React.FC = () => {
  const [destinations, setDestinations] = useState<IDestinationCard[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const regions = ['All', 'India', 'Europe', 'Asia', 'Middle East', 'Americas'];
  const categories = ['All', 'Beaches', 'Alps', 'Culture', 'Temples', 'Luxury', 'Adventure', 'Food'];

  useEffect(() => {
    travelApi.getFeaturedDestinations()
      .then(res => setDestinations(res.data))
      .catch(err => console.error("Explore error:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = destinations.filter(d => {
    const matchesRegion = selectedRegion === 'All' || (d.region && d.region.toLowerCase() === selectedRegion.toLowerCase()) || (selectedRegion === 'India' && d.country === 'India');
    const matchesCat = selectedCategory === 'All' || d.tags.some(t => t.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesSearch = !searchQuery || 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRegion && matchesCat && matchesSearch;
  });

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Explore Global & Indian Destinations 🌍" 
          subtitle="Discover world-famous wonders, serene islands, alpine peaks, and cultural heritage" 
        />

        <main className="p-8 max-w-7xl w-full space-y-6">
          {/* Header Bar with Region Tabs */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-lg">Top Global Hotspots</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                {filtered.length} Destinations
              </span>
            </div>

            {/* Region Selector Pills */}
            <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-2xl">
              {regions.map((reg) => (
                <button
                  key={reg}
                  onClick={() => setSelectedRegion(reg)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                    selectedRegion === reg
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {reg}
                </button>
              ))}
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country, city, sights (e.g. Japan, Eiffel, Goa)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filtered.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};
