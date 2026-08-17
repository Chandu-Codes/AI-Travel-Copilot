import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Compass, 
  MapPin, 
  Star, 
  SlidersHorizontal,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { DestinationCard } from '../components/DestinationCard';
import { travelApi } from '../services/api';
import { DestinationCard as IDestinationCard } from '../types';

export const ExplorePage: React.FC = () => {
  const [destinations, setDestinations] = useState<IDestinationCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const regions = ['All', 'India - North', 'India - South', 'India - West', 'Europe', 'Southeast Asia', 'Middle East'];
  const categories = ['All', 'Beaches', 'Mountains & Snow', 'Heritage & Royal', 'Adventure', 'Nature & Wildlife'];

  useEffect(() => {
    setLoading(true);
    const fetchCall = selectedRegion !== 'All' 
      ? travelApi.getDestinations({ region: selectedRegion }) 
      : travelApi.getFeaturedDestinations();

    fetchCall
      .then(res => setDestinations(res.data))
      .catch(err => console.error("Error fetching destinations:", err))
      .finally(() => setLoading(false));
  }, [selectedRegion]);

  const filtered = destinations.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || (d.category && d.category === selectedCategory) || (d.tags && d.tags.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen bg-[#FAF6F0] text-[#1D1917] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Explore Global Destinations 🌍" 
          subtitle="Curated Travel Escapes with Hybrid Content-Persona Matching" 
        />

        <main className="p-6 sm:p-8 max-w-7xl w-full space-y-6">
          {/* Search & Region Filter Bar */}
          <div className="bg-white p-5 rounded-3xl border border-[#E8DFD3] shadow-warm space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-[#A23B19] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by destination name, country, scenery..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#E8DFD3] bg-[#F8F3EC] text-xs sm:text-sm font-medium text-[#1D1917] outline-none focus:border-[#A23B19]"
              />
            </div>

            {/* Region Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider shrink-0">Region:</span>
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition ${
                    selectedRegion === region
                      ? 'bg-[#A23B19] text-white shadow-warm-sm'
                      : 'bg-[#F8F3EC] text-[#78716C] hover:bg-[#EFE8DE]'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Category Tags */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[11px] font-bold text-[#78716C] uppercase tracking-wider shrink-0">Type:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition ${
                    selectedCategory === cat
                      ? 'bg-white border border-[#A23B19] text-[#A23B19] font-bold shadow-xs'
                      : 'bg-white border border-[#E8DFD3] text-[#78716C] hover:border-[#A23B19]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Destinations Grid */}
          {loading ? (
            <div className="py-12 text-center text-xs font-semibold text-[#78716C]">
              Fetching destinations with live real-time tourist popularity indexes...
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-[#E8DFD3] text-center text-xs font-medium text-[#78716C]">
              No destinations match your search. Try resetting the filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((dest) => (
                <DestinationCard key={dest.id} destination={dest} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
