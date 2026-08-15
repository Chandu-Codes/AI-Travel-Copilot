import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Compass, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  BrainCircuit,
  Sliders,
  Globe2,
  Navigation,
  Layers
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { MapComponent, MapPoint } from '../components/MapComponent';
import { travelApi } from '../services/api';

// Comprehensive authentic attractions & GPS coordinates dictionary for dynamic real-time map preview
const DESTINATION_MAP_KNOWLEDGE: Record<string, { center: [number, number]; zoom: number; markers: MapPoint[] }> = {
  manali: {
    center: [32.2396, 77.1887],
    zoom: 11,
    markers: [
      { name: "Hadimba Devi Ancient Pagoda Temple", lat: 32.2483, lon: 77.1802, category: "Heritage", description: "16th-century wooden temple surrounded by cedar forest.", cost: 0 },
      { name: "Solang Valley Adventure & Skiing", lat: 32.3166, lon: 77.1578, category: "Adventure", description: "Paragliding, zorbing, and alpine viewpoints.", cost: 500 },
      { name: "Atal Tunnel & Sissu Waterfall", lat: 32.4418, lon: 77.1408, category: "Scenic", description: "Engineering marvel connecting Kullu to Lahaul Valley.", cost: 0 },
      { name: "Jogini Waterfall Trek (Vashisht)", lat: 32.2678, lon: 77.1915, category: "Nature", description: "Cascading mountain waterfall through pine forest.", cost: 0 },
      { name: "Old Manali Artisan Village & Cafes", lat: 32.2530, lon: 77.1770, category: "Culture", description: "Vibrant bohemian alleys and wooden chalets.", cost: 0 }
    ]
  },
  goa: {
    center: [15.4989, 73.8278],
    zoom: 11,
    markers: [
      { name: "Baga & Calangute Beach", lat: 15.5553, lon: 73.7516, category: "Beach", description: "Golden sands, beach shacks, and watersports.", cost: 0 },
      { name: "Fort Aguada & Lighthouse", lat: 15.4921, lon: 73.7736, category: "Heritage", description: "17th-century Portuguese coastal fortress.", cost: 50 },
      { name: "Basilica of Bom Jesus", lat: 15.5009, lon: 73.9116, category: "UNESCO Heritage", description: "World Heritage Baroque church holding relics of St. Francis Xavier.", cost: 0 },
      { name: "Dudhsagar Cascading Falls", lat: 15.3144, lon: 74.3143, category: "Nature", description: "Four-tiered sea of milk waterfall inside Bhagwan Mahavir Sanctuary.", cost: 500 },
      { name: "Palolem Crescent Beach", lat: 15.0100, lon: 74.0232, category: "Beach", description: "Scenic palm-fringed bay in South Goa.", cost: 0 }
    ]
  },
  paris: {
    center: [48.8566, 2.3522],
    zoom: 12,
    markers: [
      { name: "Eiffel Tower & Champ de Mars", lat: 48.8584, lon: 2.2945, category: "Iconic Landmark", description: "World-famous iron lattice tower with panoramic viewing decks.", cost: 2500 },
      { name: "Louvre Museum & Glass Pyramid", lat: 48.8606, lon: 2.3376, category: "Art & Culture", description: "World's largest museum housing the Mona Lisa and Venus de Milo.", cost: 2200 },
      { name: "Arc de Triomphe & Champs-Élysées", lat: 48.8738, lon: 2.2950, category: "Monument", description: "Triumphal arch honouring French victories.", cost: 1300 },
      { name: "Montmartre & Sacré-Cœur Basilica", lat: 48.8867, lon: 2.3431, category: "Heritage", description: "Historic bohemian hilltop with artist squares.", cost: 0 },
      { name: "Seine River Promenade Cruise", lat: 48.8589, lon: 2.2933, category: "Scenic Cruise", description: "Sightseeing riverboat tour past Notre-Dame.", cost: 1400 }
    ]
  },
  switzerland: {
    center: [47.0502, 8.3093],
    zoom: 9,
    markers: [
      { name: "Zurich Altstadt (Old Town)", lat: 47.3717, lon: 8.5422, category: "Heritage", description: "Cobblestone alleys, Lindenhof hill, and Lake Zurich.", cost: 0 },
      { name: "Chapel Bridge (Kapellbrücke) Lucerne", lat: 47.0516, lon: 8.3075, category: "Historic Bridge", description: "14th-century covered wooden footbridge over Reuss River.", cost: 0 },
      { name: "Mount Pilatus Golden Roundtrip", lat: 46.9792, lon: 8.2536, category: "Alpine Peak", description: "World's steepest cogwheel railway and panoramic cable car.", cost: 4200 },
      { name: "Jungfraujoch - Top of Europe", lat: 46.5475, lon: 7.9825, category: "Wonder", description: "Sphinx Observatory & Ice Palace at 3,454m elevation.", cost: 7500 },
      { name: "Zermatt & Matterhorn Viewpoint", lat: 45.9763, lon: 7.7491, category: "Alpine Wonder", description: "Iconic pyramid-shaped Matterhorn peak view.", cost: 3800 }
    ]
  },
  jaipur: {
    center: [26.9124, 75.7873],
    zoom: 12,
    markers: [
      { name: "Amber Palace & Sheesh Mahal", lat: 26.9855, lon: 75.8513, category: "UNESCO Fort", description: "Majestic hilltop fort with intricate mirror palace.", cost: 100 },
      { name: "Hawa Mahal (Palace of Winds)", lat: 26.9239, lon: 75.8267, category: "Architecture", description: "5-story pink honeycomb facade with 953 jharokhas.", cost: 50 },
      { name: "City Palace & Chandra Mahal", lat: 26.9258, lon: 75.8237, category: "Royal Palace", description: "Historic royal residence and museum.", cost: 300 },
      { name: "Nahargarh Fort Sunset Viewpoint", lat: 26.9373, lon: 75.8155, category: "Scenic Fort", description: "Aravalli ridge fortress overlooking the Pink City.", cost: 50 },
      { name: "Jal Mahal (Water Palace)", lat: 26.9535, lon: 75.8462, category: "Heritage", description: "Submerged sandstone palace in the middle of Man Sagar Lake.", cost: 0 }
    ]
  },
  ladakh: {
    center: [34.1526, 77.5771],
    zoom: 9,
    markers: [
      { name: "Pangong Tso High-Altitude Lake", lat: 33.7595, lon: 78.6674, category: "Alpine Lake", description: "Turquoise blue lake changing shades across 4,250m altitude.", cost: 0 },
      { name: "Khardung La Mountain Pass", lat: 34.2787, lon: 77.6047, category: "Mountain Pass", description: "One of the world's highest motorable passes at 5,359m.", cost: 0 },
      { name: "Nubra Valley & Hunder Sand Dunes", lat: 34.5777, lon: 77.5645, category: "Desert Valley", description: "Double-humped Bactrian camel safaris in mountain desert.", cost: 300 },
      { name: "Thiksey Monastery", lat: 34.0583, lon: 77.6667, category: "Monastery", description: "12-story hilltop complex resembling the Potala Palace.", cost: 50 },
      { name: "Shanti Stupa Leh", lat: 34.1672, lon: 77.5786, category: "Peace Stupa", description: "White-domed Buddhist stupa offering 360-degree Leh panoramas.", cost: 0 }
    ]
  },
  kerala: {
    center: [10.0889, 77.0595],
    zoom: 10,
    markers: [
      { name: "Munnar Tea Plantations & Museum", lat: 10.0889, lon: 77.0595, category: "Plantation", description: "Sprawling emerald tea hills and tea manufacturing history.", cost: 125 },
      { name: "Eravikulam National Park (Nilgiri Tahr)", lat: 10.1500, lon: 77.0667, category: "Wildlife", description: "Sanctuary for endangered mountain goats and Anamudi Peak.", cost: 200 },
      { name: "Alleppey Backwaters Houseboat Cruise", lat: 9.4981, lon: 76.3388, category: "Backwaters", description: "Traditional kettuvallam cruise along tranquil palm lagoons.", cost: 4500 },
      { name: "Fort Kochi Chinese Fishing Nets", lat: 9.9656, lon: 76.2421, category: "Heritage", description: "Historic cantilevered fishing structures at sunset.", cost: 0 },
      { name: "Mattupetty Dam & Echo Point", lat: 10.1065, lon: 77.1245, category: "Lake", description: "Scenic reservoir with speedboat rides and mountain mist.", cost: 50 }
    ]
  },
  japan: {
    center: [35.6762, 139.6503],
    zoom: 11,
    markers: [
      { name: "Sensō-ji Ancient Buddhist Temple (Asakusa)", lat: 35.7148, lon: 139.7967, category: "Heritage", description: "Tokyo's oldest temple with iconic Kaminarimon gate.", cost: 0 },
      { name: "Shibuya Crossing & Hachiko Statue", lat: 35.6595, lon: 139.7004, category: "Urban Icon", description: "World's busiest pedestrian scramble intersection.", cost: 0 },
      { name: "Tokyo Skytree Panoramic Deck", lat: 35.7101, lon: 139.8107, category: "Skyline", description: "Tallest broadcasting tower offering 360-degree Mount Fuji vistas.", cost: 1800 },
      { name: "Fushimi Inari-taisha Thousand Torii Gates", lat: 34.9671, lon: 135.7727, category: "Shrine", description: "Thousands of vermillion torii gates winding up sacred Mount Inari.", cost: 0 },
      { name: "Mount Fuji 5th Station & Chureito Pagoda", lat: 35.3606, lon: 138.7274, category: "Nature Wonder", description: "Iconic snow-capped volcanic cone.", cost: 1000 }
    ]
  },
  bali: {
    center: [-8.5069, 115.2625],
    zoom: 11,
    markers: [
      { name: "Sacred Ubud Monkey Forest Sanctuary", lat: -8.5194, lon: 115.2606, category: "Nature", description: "Lush jungle sanctuary with playful macaques and moss-covered temples.", cost: 450 },
      { name: "Tegallalang Stepped Rice Terraces", lat: -8.4344, lon: 115.2778, category: "Landscape", description: "Ancient subak irrigation stepped terraces and jungle swings.", cost: 250 },
      { name: "Uluwatu Cliffside Temple & Kecak Dance", lat: -8.8291, lon: 115.0849, category: "Sunset Temple", description: "Perched atop a 70m ocean cliff with sunset fire dance.", cost: 350 },
      { name: "Tanah Lot Sea Rock Temple", lat: -8.6212, lon: 115.0868, category: "Sea Temple", description: "Iconic offshore rock formation shaped by ocean waves.", cost: 300 }
    ]
  },
  dubai: {
    center: [25.2048, 55.2708],
    zoom: 12,
    markers: [
      { name: "Burj Khalifa Observation Deck", lat: 25.1972, lon: 55.2744, category: "Skyline", description: "World's tallest skyscraper standing at 828m.", cost: 3800 },
      { name: "The Dubai Mall & Fountain Show", lat: 25.1975, lon: 55.2796, category: "Shopping & Show", description: "World-class destination with choreographed fountain lights.", cost: 0 },
      { name: "Palm Jumeirah & Atlantis", lat: 25.1304, lon: 55.1171, category: "Luxury Island", description: "Iconic tree-shaped archipelago jutting into Persian Gulf.", cost: 0 },
      { name: "Dubai Desert Safari & Dune Bashing", lat: 24.8333, lon: 55.5500, category: "Adventure", description: "Sunset camel rides, 4x4 dune bashing, and Bedouin camp.", cost: 2400 }
    ]
  },
  maldives: {
    center: [4.1755, 73.5093],
    zoom: 10,
    markers: [
      { name: "Male Atoll Luxury Overwater Lagoon", lat: 4.1755, lon: 73.5093, category: "Luxury Resort", description: "Turquoise lagoons with direct private reef swimming.", cost: 0 },
      { name: "Banana Reef Coral Snorkeling Sanctuary", lat: 4.2360, lon: 73.5410, category: "Marine Life", description: "Pristine coral caves with manta rays and reef sharks.", cost: 1800 },
      { name: "Maafushi Island Watersports Hub", lat: 3.9416, lon: 73.4907, category: "Island Tour", description: "Vibrant local island with scuba diving and dolphin safaris.", cost: 1200 }
    ]
  },
  rishikesh: {
    center: [30.0869, 78.2676],
    zoom: 12,
    markers: [
      { name: "Laxman Jhula & Ram Jhula Suspension Bridges", lat: 30.1245, lon: 78.3283, category: "Heritage", description: "Iconic iron suspension footbridges across holy river Ganga.", cost: 0 },
      { name: "Triveni Ghat Evening Ganga Aarti", lat: 30.1030, lon: 78.2936, category: "Spiritual", description: "Devotional evening lamp ceremonies and chanting.", cost: 0 },
      { name: "Shivpuri White Water River Rafting", lat: 30.1378, lon: 78.3900, category: "Adventure", description: "Grade III/IV adrenaline river rafting rapids.", cost: 900 },
      { name: "The Beatles Ashram (Chaurasi Kutia)", lat: 30.1175, lon: 78.3150, category: "Culture", description: "Historic meditation retreat visited by The Beatles in 1968.", cost: 150 }
    ]
  },
  varanasi: {
    center: [25.3176, 82.9739],
    zoom: 13,
    markers: [
      { name: "Dashashwamedh Ghat Grand Ganga Aarti", lat: 25.3069, lon: 83.0104, category: "Spiritual Ceremony", description: "Spectacular ritual of fire and incense on sacred riverfront.", cost: 0 },
      { name: "Kashi Vishwanath Golden Temple", lat: 25.3109, lon: 83.0107, category: "Sacred Shrine", description: "One of the twelve revered Jyotirlinga shrines in India.", cost: 0 },
      { name: "Sarnath Deer Park & Dhamek Stupa", lat: 25.3811, lon: 83.0227, category: "Buddhist Heritage", description: "Where Lord Buddha gave his very first sermon.", cost: 25 }
    ]
  },
  ooty: {
    center: [11.4102, 76.6950],
    zoom: 12,
    markers: [
      { name: "Government Botanical Garden Ooty", lat: 11.4189, lon: 76.7119, category: "Nature", description: "55-acre terraced garden with exotic botanical flora.", cost: 50 },
      { name: "Nilgiri Mountain Railway (Toy Train)", lat: 11.4064, lon: 76.7027, category: "UNESCO Rail", description: "Heritage steam railway climbing through Nilgiri tea hills.", cost: 200 },
      { name: "Doddabetta Peak Viewpoint", lat: 11.4011, lon: 76.7364, category: "Highest Peak", description: "Highest point in the Nilgiris at 2,637m altitude.", cost: 30 },
      { name: "Pykara Lake & Waterfalls", lat: 11.4900, lon: 76.5950, category: "Scenic Lake", description: "Boat club and cascading shola forest waterfalls.", cost: 100 }
    ]
  },
  agra: {
    center: [27.1767, 78.0081],
    zoom: 13,
    markers: [
      { name: "Taj Mahal White Marble Wonder", lat: 27.1751, lon: 78.0421, category: "World Wonder", description: "UNESCO World Heritage white marble mausoleum built by Shah Jahan.", cost: 50 },
      { name: "Agra Fort Red Sandstone Fortress", lat: 27.1795, lon: 78.0211, category: "Mughal Heritage", description: "Massive royal citadel overlooking the Yamuna River.", cost: 50 },
      { name: "Mehtab Bagh Moonlight Garden", lat: 27.1800, lon: 78.0420, category: "Sunset View", description: "Symmetrical charbagh garden across the river from the Taj Mahal.", cost: 25 }
    ]
  }
};

export const TripPlannerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [destination, setDestination] = useState(searchParams.get('dest') || localStorage.getItem('travel_copilot_active_destination') || 'Manali');
  const [startDate, setStartDate] = useState('2025-06-10');
  const [endDate, setEndDate] = useState('2025-06-15');
  const [travelers, setTravelers] = useState('2 Adults');
  const [budget, setBudget] = useState<number>(35000);
  const [travelStyle, setTravelStyle] = useState('Balanced');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Sightseeing', 'Food', 'Heritage', 'Beaches', 'Adventure'
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const popularIndianPlaces = [
    'Manali', 'Goa', 'Jaipur', 'Munnar', 'Ladakh', 'Kerala', 'Varanasi', 'Ooty', 'Rishikesh', 'Udaipur', 'Agra', 'Andaman'
  ];

  const popularGlobalPlaces = [
    'Paris', 'Switzerland', 'Japan', 'Bali', 'Dubai', 'Maldives'
  ];

  const interestOptions = [
    'Sightseeing', 'Food', 'Heritage', 'Adventure', 'Beaches', 'Nature', 'Nightlife', 'Shopping'
  ];

  const travelStyleOptions = ['Relaxed', 'Balanced', 'Packed', 'Luxury'];

  const aiSteps = [
    "Understanding your travel persona and constraints...",
    "Retrieving verified POIs & historical guides via RAG...",
    "Solving 0/1 Knapsack for hotel and activity budget allocation...",
    "Optimizing daily visiting sequence with TSP routing...",
    "Checking live weather forecasts & disruption risks...",
    "Finalizing structured non-repeating itinerary schema..."
  ];

  // Helper to dynamically get markers and map center for the entered destination
  const getDestinationMapData = () => {
    const destClean = destination.toLowerCase().trim();
    for (const [key, data] of Object.entries(DESTINATION_MAP_KNOWLEDGE)) {
      if (destClean.includes(key) || key.includes(destClean)) {
        return data;
      }
    }
    // Default fallback: generate dynamic representative coordinates around India Center
    return {
      center: [20.5937, 78.9629] as [number, number],
      zoom: 6,
      markers: [
        { name: `${destination} Central Heritage Quarter`, lat: 20.5937, lon: 78.9629, category: "Heritage", description: `Historic city center and landmarks of ${destination}.`, cost: 0 },
        { name: `${destination} Scenic Observation Deck`, lat: 20.6500, lon: 79.0100, category: "Scenic", description: `Panoramic viewing platform overlooking ${destination}.`, cost: 150 },
        { name: `${destination} Cultural Artisan Market`, lat: 20.5400, lon: 78.9100, category: "Culture", description: `Traditional handicraft bazaars and cuisine.`, cost: 0 }
      ]
    };
  };

  const currentMapData = getDestinationMapData();

  useEffect(() => {
    const dest = searchParams.get('dest');
    if (dest) {
      setDestination(dest);
      const d = dest.toLowerCase();
      if (['goa', 'jaipur', 'munnar', 'manali', 'varanasi', 'ooty', 'rishikesh', 'udaipur', 'agra', 'kerala'].some(k => d.includes(k))) {
        setBudget(35000);
      } else if (['switzerland', 'paris', 'japan'].some(k => d.includes(k))) {
        setBudget(160000);
      } else {
        setBudget(85000);
      }
    }
  }, [searchParams]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSelectPopular = (place: string) => {
    setDestination(place);
    const d = place.toLowerCase();
    if (['goa', 'jaipur', 'munnar', 'manali', 'varanasi', 'ooty', 'rishikesh', 'udaipur', 'agra', 'kerala'].some(k => d.includes(k))) {
      setBudget(35000);
    } else if (['switzerland', 'paris', 'japan'].some(k => d.includes(k))) {
      setBudget(160000);
    } else {
      setBudget(85000);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setCurrentStep(0);

    const targetCity = destination.split(',')[0].trim();
    localStorage.setItem('travel_copilot_active_destination', targetCity);

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < aiSteps.length - 1) return prev + 1;
        return prev;
      });
    }, 600);

    try {
      const travelersCount = parseInt(travelers.split(' ')[0]) || 2;
      const res = await travelApi.planTrip({
        destination: targetCity,
        start_date: startDate,
        end_date: endDate,
        travelers_count: travelersCount,
        travelers_label: travelers,
        budget_inr: budget,
        travel_style: travelStyle,
        interests: selectedInterests
      });

      clearInterval(interval);
      const tripId = res.data.id || 1;
      localStorage.setItem('travel_copilot_active_trip_id', String(tripId));
      setTimeout(() => {
        navigate(`/itinerary/${tripId}?dest=${encodeURIComponent(targetCity)}`);
      }, 500);
    } catch (err) {
      console.error("Trip planning error:", err);
      clearInterval(interval);
      setIsGenerating(false);
      navigate(`/itinerary/1?dest=${encodeURIComponent(targetCity)}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Plan Your Dream Vacation ✈️" 
          subtitle="Generate tailored AI itineraries with live interactive map routing across India & worldwide" 
        />

        <main className="p-8 max-w-7xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form Card with Perfect Alignment (Matching Mockup) */}
            <div className="lg:col-span-6 bg-white p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              {/* Destination Search Section */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Destination
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4 text-blue-600" />
                  </div>
                  <input
                    type="text"
                    required
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where to? (e.g. Manali, Paris, Goa, Switzerland, Bali)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm font-bold text-slate-900 bg-slate-50/50 outline-none transition"
                  />
                </div>
              </div>

              {/* Popular Destination Quick Chips */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Popular destinations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[...popularIndianPlaces.slice(0, 5), ...popularGlobalPlaces.slice(0, 3)].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handleSelectPopular(p)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                        destination.toLowerCase() === p.toLowerCase()
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4 pt-1">
                {/* Dates Row: Balanced 2-Column Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Start Date</span>
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-slate-50/50 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>End Date</span>
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 bg-slate-50/50 outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Travelers Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    <span>Travelers</span>
                  </label>
                  <select
                    value={travelers}
                    onChange={(e) => setTravelers(e.target.value)}
                    className="w-full pl-3 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-slate-50/50 outline-none focus:border-blue-500"
                  >
                    <option>1 Solo Traveler</option>
                    <option>2 Adults</option>
                    <option>2 Adults, 1 Child</option>
                    <option>Family (4 People)</option>
                    <option>Group (5+ People)</option>
                  </select>
                </div>

                {/* Travel Style Segmented Pills */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-blue-600" />
                    <span>Travel Style</span>
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-2xl">
                    {travelStyleOptions.map((style) => {
                      const isSelected = travelStyle === style;
                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() => setTravelStyle(style)}
                          className={`py-1.5 rounded-xl text-xs font-bold transition text-center ${
                            isSelected
                              ? 'bg-white text-blue-600 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {style}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Budget Slider with Right-Aligned Live Value */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Budget</span>
                    </label>
                    <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-lg">
                      ₹ {budget.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="300000"
                    step="5000"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] font-medium text-slate-400 mt-1">
                    <span>₹10,000</span>
                    <span>₹1,50,000</span>
                    <span>₹3,00,000</span>
                  </div>
                </div>

                {/* Interest Tags */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Interest Tags
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {interestOptions.map((interest) => {
                      const isSelected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition ${
                            isSelected
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 mt-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate AI Itinerary</span>
                </button>
              </form>
            </div>

            {/* Right Column: Dynamic Interactive Map & Frosted Vacation Summary Card */}
            <div className="lg:col-span-6 relative flex flex-col space-y-4">
              {/* Map Container with Live Dynamic POIs */}
              <div className="h-[540px] w-full rounded-3xl overflow-hidden shadow-sm border border-slate-200/80 relative">
                <MapComponent 
                  center={currentMapData.center} 
                  zoom={currentMapData.zoom} 
                  markers={currentMapData.markers}
                  showRoute={true}
                />

                {/* Map Active Header Pill */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-md z-20 flex items-center gap-2 pointer-events-none">
                  <Navigation className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                  <span className="text-xs font-bold text-slate-800">
                    Live Route: {destination.toUpperCase()} ({currentMapData.markers.length} Sights)
                  </span>
                </div>

                {/* Floating Frosted Glass Vacation Summary Card (Matching Mockup) */}
                <div className="absolute bottom-4 right-4 max-w-[280px] w-full p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border border-slate-200/90 z-20 space-y-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Vacation Summary
                  </span>

                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm leading-tight">{destination} Trip</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">5 Days | 4 Nights Planned</p>
                  </div>

                  <div className="border-t border-slate-100 pt-2 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span className="font-medium text-[11px]">Travelers</span>
                      <span className="font-bold text-slate-900">{travelers}</span>
                    </div>

                    <div className="flex justify-between items-baseline pt-1">
                      <span className="font-medium text-[11px] text-slate-600">Total Budget</span>
                      <span className="font-black text-sm text-emerald-600">₹ {budget.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Animated AI Planning Reasoning Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner animate-bounce">
              <BrainCircuit className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">AI Copilot is Planning</h3>
              <p className="text-xs text-slate-500 mt-1">Generating unique non-repeating attractions for {destination}</p>
            </div>

            <div className="space-y-3 text-left">
              {aiSteps.map((step, idx) => {
                const isPassed = idx < currentStep;
                const isCurrent = idx === currentStep;
                return (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                      isPassed ? 'text-emerald-600 font-medium' : isCurrent ? 'text-blue-600 font-bold' : 'text-slate-300'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-200 shrink-0" />
                    )}
                    <span>{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
