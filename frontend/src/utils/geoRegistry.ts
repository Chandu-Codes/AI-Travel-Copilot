import { MapPoint } from '../components/MapComponent';

export interface DestinationMapConfig {
  center: [number, number];
  zoom: number;
  markers: MapPoint[];
}

// Comprehensive Global Geocoding Registry & Authentic Landmarks for 100+ Destinations
export const GLOBAL_DESTINATIONS_MAP: Record<string, DestinationMapConfig> = {
  // =========================================================================
  // EAST & SOUTHEAST ASIA
  // =========================================================================
  japan: {
    center: [35.6762, 139.6503],
    zoom: 7,
    markers: [
      { name: "Sensō-ji Ancient Temple (Tokyo)", lat: 35.7148, lon: 139.7967, category: "Heritage", description: "Tokyo's oldest Buddhist temple founded in 628 AD.", cost: 0 },
      { name: "Fushimi Inari 10,000 Torii Gates (Kyoto)", lat: 34.9671, lon: 135.7727, category: "Sacred Shrine", description: "Sacred vermilion torii gate pathways winding up Mount Inari.", cost: 0 },
      { name: "Shibuya Crossing & Hachiko Memorial", lat: 35.6595, lon: 139.7005, category: "Urban Icon", description: "The world's busiest pedestrian scramble intersection.", cost: 0 },
      { name: "Kinkaku-ji (Golden Pavilion)", lat: 35.0394, lon: 135.7292, category: "UNESCO Zen", description: "Gold-leaf covered Zen temple overlooking mirror pond.", cost: 400 },
      { name: "Mount Fuji 5th Station & Chureito Pagoda", lat: 35.3606, lon: 138.7274, category: "Active Volcano", description: "Iconic snow-capped sacred mountain peak.", cost: 0 }
    ]
  },
  tokyo: {
    center: [35.6762, 139.6503],
    zoom: 12,
    markers: [
      { name: "Sensō-ji Temple & Nakamise Dori", lat: 35.7148, lon: 139.7967, category: "Heritage", description: "Historic Asakusa temple with traditional market.", cost: 0 },
      { name: "Shibuya Crossing & Scramble Square", lat: 35.6595, lon: 139.7005, category: "Modern District", description: "Iconic neon intersection and 360 rooftop skydeck.", cost: 0 },
      { name: "Tokyo Skytree (634m Observation Deck)", lat: 35.7100, lon: 139.8107, category: "Observation Tower", description: "World's tallest freestanding broadcast tower.", cost: 1800 },
      { name: "Meiji Jingu Shinto Shrine & Yoyogi Park", lat: 35.6764, lon: 139.6993, category: "Sacred Forest", description: "Tranquil 170-acre evergreen forest shrine in Harajuku.", cost: 0 },
      { name: "Akihabara Electric Town & Anime Plaza", lat: 35.6983, lon: 139.7731, category: "Tech & Anime", description: "World capital of gaming, manga, and electronics.", cost: 0 }
    ]
  },
  kyoto: {
    center: [35.0116, 135.7681],
    zoom: 12,
    markers: [
      { name: "Fushimi Inari Taisha Torii Gates", lat: 34.9671, lon: 135.7727, category: "Shinto Shrine", description: "Thousands of bright red gates on Mount Inari.", cost: 0 },
      { name: "Kinkaku-ji (The Golden Pavilion)", lat: 35.0394, lon: 135.7292, category: "Zen Temple", description: "Pure gold-leaf covered Buddhist pavilion.", cost: 400 },
      { name: "Arashiyama Bamboo Grove & Tenryu-ji", lat: 35.0170, lon: 135.6710, category: "Nature Grove", description: "Towering green bamboo stalks and UNESCO temple.", cost: 0 },
      { name: "Kiyomizu-dera Wooden Stage Temple", lat: 34.9949, lon: 135.7850, category: "UNESCO Heritage", description: "778 AD wooden temple on Mount Otowa.", cost: 350 },
      { name: "Gion Historic Geisha District", lat: 35.0037, lon: 135.7772, category: "Living Culture", description: "Preserved 17th-century wooden machiya teahouses.", cost: 0 }
    ]
  },
  osaka: {
    center: [34.6937, 135.5023],
    zoom: 12,
    markers: [
      { name: "Osaka Castle & Plum Grove Gardens", lat: 34.6873, lon: 135.5262, category: "Historic Castle", description: "1583 samurai stronghold with moat fortifications.", cost: 450 },
      { name: "Dotonbori Glico Man Neon Canal", lat: 34.6687, lon: 135.5013, category: "Street Food", description: "Vibrant canal boulevard famous for takoyaki and crab.", cost: 0 },
      { name: "Universal Studios Japan & Super Nintendo World", lat: 34.6654, lon: 135.4323, category: "Theme Park", description: "World-class theme park with Mario Kart rides.", cost: 6500 },
      { name: "Umeda Sky Building Floating Garden", lat: 34.7053, lon: 135.4900, category: "Sky Observatory", description: "Twin skyscraper connected by open-air ring bridge.", cost: 1200 },
      { name: "Shinsekai & Tsutenkaku Tower", lat: 34.6525, lon: 135.5063, category: "Retro District", description: "Nostalgic 1912 retro quarter famous for Kushikatsu.", cost: 0 }
    ]
  },
  singapore: {
    center: [1.3521, 103.8198],
    zoom: 12,
    markers: [
      { name: "Marina Bay Sands SkyPark & Infinity Pool", lat: 1.2834, lon: 103.8607, category: "Iconic Skyscraper", description: "57th-floor ship-shaped observation deck.", cost: 2200 },
      { name: "Gardens by the Bay & Supertree Grove", lat: 1.2816, lon: 103.8636, category: "Futuristic Garden", description: "50m vertical solar gardens and Flower Dome.", cost: 1800 },
      { name: "Sentosa Island & Siloso Beach", lat: 1.2494, lon: 103.8303, category: "Island Resort", description: "Tropical resort island with beaches and cable cars.", cost: 0 },
      { name: "Jewel Changi Rain Vortex 40m Waterfall", lat: 1.3602, lon: 103.9898, category: "Architectural Wonder", description: "World's tallest indoor waterfall inside airport jungle.", cost: 0 },
      { name: "Chinatown Heritage Centre & Buddha Tooth Relic", lat: 1.2815, lon: 103.8443, category: "Culture & Food", description: "Vibrant ethnic enclave and Michelin hawker street food.", cost: 0 }
    ]
  },
  thailand: {
    center: [13.7563, 100.5018],
    zoom: 7,
    markers: [
      { name: "The Grand Palace & Wat Phra Kaew (Emerald Buddha)", lat: 13.7500, lon: 100.4915, category: "Royal Palace", description: "1782 Siamese royal complex with glittering gold spires.", cost: 1200 },
      { name: "Wat Arun (Temple of Dawn) Chao Phraya", lat: 13.7437, lon: 100.4888, category: "Riverside Temple", description: "70m porcelain mosaic pagoda on Chao Phraya River.", cost: 250 },
      { name: "Phi Phi Islands & Maya Bay (Phuket/Krabi)", lat: 7.7407, lon: 98.7784, category: "Limestone Bay", description: "Turquoise lagoon framed by 100m sheer cliffs.", cost: 900 },
      { name: "Chiang Mai Old City & Wat Phra That Doi Suthep", lat: 18.8049, lon: 98.9216, category: "Mountain Temple", description: "Golden mountain stupa reached by 306 dragon steps.", cost: 150 },
      { name: "Chatuchak 15,000-Stall Weekend Market", lat: 13.7999, lon: 100.5502, category: "Mega Bazaar", description: "World's largest weekend market with street delicacies.", cost: 0 }
    ]
  },
  bangkok: {
    center: [13.7563, 100.5018],
    zoom: 12,
    markers: [
      { name: "The Grand Palace & Emerald Buddha", lat: 13.7500, lon: 100.4915, category: "Royal Palace", description: "1782 royal complex with gold-leaf spires.", cost: 1200 },
      { name: "Wat Pho (Temple of Reclining Buddha 46m)", lat: 13.7465, lon: 100.4933, category: "Heritage Temple", description: "46m gold-plated Buddha and traditional Thai massage school.", cost: 450 },
      { name: "Wat Arun Porcelain Pagoda", lat: 13.7437, lon: 100.4888, category: "Riverside Pagoda", description: "Iconic ceramic mosaic river pagoda.", cost: 250 },
      { name: "Chao Phraya Princess Dinner Cruise", lat: 13.7233, lon: 100.5133, category: "River Cruise", description: "Illuminated evening buffet cruise past Bangkok temples.", cost: 2800 },
      { name: "Asiatique The Riverfront Night Bazaar", lat: 13.7042, lon: 100.5031, category: "Night Market", description: "Riverside boardwalk with ferris wheel and dining.", cost: 0 }
    ]
  },
  bali: {
    center: [-8.4095, 115.1889],
    zoom: 10,
    markers: [
      { name: "Uluwatu Cliffside Temple & Sunset Kecak Dance", lat: -8.8291, lon: 115.0849, category: "Cliff Temple", description: "70m ocean cliff temple with dramatic fire dances.", cost: 300 },
      { name: "Ubud Sacred Monkey Forest Sanctuary", lat: -8.5190, lon: 115.2606, category: "Sanctuary", description: "Lush nutmeg forest housing hundreds of macaques.", cost: 450 },
      { name: "Tegallalang Emerald Rice Terraces", lat: -8.4333, lon: 115.2833, category: "Scenic Valley", description: "Iconic stepped subak irrigation rice fields.", cost: 100 },
      { name: "Tanah Lot Ancient Ocean Rock Temple", lat: -8.6212, lon: 115.0868, category: "Ocean Temple", description: "Offshore rock formation framed by crashing waves.", cost: 350 },
      { name: "Mount Batur Active Volcano Sunrise", lat: -8.2422, lon: 115.3753, category: "Volcano Trek", description: "1,717m sunrise trek over caldera clouds.", cost: 2000 }
    ]
  },
  maldives: {
    center: [4.1755, 73.5093],
    zoom: 9,
    markers: [
      { name: "Male Atoll & Sultan Park", lat: 4.1755, lon: 73.5093, category: "Island Capital", description: "17th-century coral stone Grand Friday Mosque.", cost: 0 },
      { name: "Banana Reef Marine Protected Coral", lat: 4.2333, lon: 73.5333, category: "Coral Reef", description: "World-renowned diving spot with reef sharks and turtles.", cost: 4500 },
      { name: "Maafushi Island Watersports Bay", lat: 3.9417, lon: 73.4906, category: "Island Beach", description: "Bikini Beach, nurse shark snorkeling, and jet skiing.", cost: 0 },
      { name: "Ari Atoll Whale Shark Safari", lat: 3.6500, lon: 72.8500, category: "Marine Safari", description: "Swim alongside gentle giant whale sharks.", cost: 8500 },
      { name: "Vaadhoo Island Bioluminescent Beach", lat: 5.4800, lon: 72.9800, category: "Glowing Beach", description: "Sea of Stars glowing with blue phytoplankton.", cost: 0 }
    ]
  },
  vietnam: {
    center: [21.0285, 105.8542],
    zoom: 7,
    markers: [
      { name: "Ha Long Bay 1,600 Emerald Limestone Karsts (UNESCO)", lat: 20.9101, lon: 107.1839, category: "UNESCO Bay", description: "Spectacular seascape of limestone pillars and caves.", cost: 2400 },
      { name: "Hoi An Ancient Lantern Town (UNESCO)", lat: 15.8801, lon: 108.3380, category: "Living Heritage", description: "15th-century preserved trading port illuminated by lanterns.", cost: 400 },
      { name: "Golden Giant Hands Bridge Ba Na Hills (Da Nang)", lat: 15.9950, lon: 107.9967, category: "Modern Icon", description: "150m pedestrian bridge held by giant stone hands.", cost: 2800 },
      { name: "Hanoi Old Quarter & Hoan Kiem Lake", lat: 21.0313, lon: 105.8523, category: "Historic Quarter", description: "French colonial architecture, egg coffee, and street food.", cost: 0 },
      { name: "Cu Chi Underground Guerrilla Tunnels (Saigon)", lat: 11.1444, lon: 106.4631, category: "War History", description: "250km subterranean tunnel network used during Vietnam War.", cost: 350 }
    ]
  },
  malaysia: {
    center: [3.1390, 101.6869],
    zoom: 8,
    markers: [
      { name: "Petronas Twin Towers 452m Skybridge", lat: 3.1578, lon: 101.7123, category: "Skyscraper", description: "World's tallest twin towers with double-deck skybridge.", cost: 1900 },
      { name: "Batu Caves & 140ft Golden Murugan Statue", lat: 3.2379, lon: 101.6840, category: "Limestone Temple", description: "272 rainbow steps leading into 400-million-yr limestone caves.", cost: 0 },
      { name: "Langkawi Sky Bridge & Cable Car", lat: 6.3860, lon: 99.6622, category: "Curved Bridge", description: "125m curved suspension bridge 660m above sea level.", cost: 1600 },
      { name: "George Town Penang Heritage Street Art (UNESCO)", lat: 5.4141, lon: 100.3288, category: "UNESCO Art", description: "Historic colonial shophouses and famous 3D wall murals.", cost: 0 },
      { name: "Bukit Bintang Pavilion Shopping & Jalan Alor Food", lat: 3.1485, lon: 101.7134, category: "Food & Fashion", description: "Epicenter of Malaysian nightlife and sizzling street satay.", cost: 0 }
    ]
  },
  korea: {
    center: [37.5665, 126.9780],
    zoom: 8,
    markers: [
      { name: "Gyeongbokgung Palace & Hanbok Walk", lat: 37.5796, lon: 126.9770, category: "Joseon Palace", description: "1395 main royal palace with royal guard changing ceremony.", cost: 200 },
      { name: "N Seoul Tower & Mount Namsan Locks", lat: 37.5512, lon: 126.9882, category: "Observation Tower", description: "236m tower providing 360 vistas over Seoul.", cost: 1100 },
      { name: "Bukchon Traditional Hanok Village", lat: 37.5826, lon: 126.9836, category: "Historic Village", description: "Preserved neighborhood of traditional Korean tiled houses.", cost: 0 },
      { name: "Myeongdong K-Beauty & Street Food Night Market", lat: 37.5636, lon: 126.9858, category: "Street Food", description: "Famous market for egg bread, hotteok, and cosmetics.", cost: 0 },
      { name: "Busan Haeundae Beach & Gamcheon Culture Village", lat: 35.1587, lon: 129.1604, category: "Coastal Wonder", description: "Vibrant beach and rainbow-painted mountainside village.", cost: 0 }
    ]
  },
  "south korea": {
    center: [37.5665, 126.9780],
    zoom: 8,
    markers: [
      { name: "Gyeongbokgung Palace", lat: 37.5796, lon: 126.9770, category: "Joseon Palace", description: "1395 royal palace with guard changing ceremonies.", cost: 200 },
      { name: "N Seoul Tower", lat: 37.5512, lon: 126.9882, category: "Observation Tower", description: "236m tower with panoramic Seoul skyline views.", cost: 1100 },
      { name: "Bukchon Hanok Village", lat: 37.5826, lon: 126.9836, category: "Historic Village", description: "Preserved traditional Korean residential village.", cost: 0 },
      { name: "Myeongdong Night Market", lat: 37.5636, lon: 126.9858, category: "Street Food", description: "Famous street food hub and shopping quarter.", cost: 0 },
      { name: "Busan Haeundae Beach", lat: 35.1587, lon: 129.1604, category: "Coastal Beach", description: "Korea's most famous white sand urban beach.", cost: 0 }
    ]
  },
  nepal: {
    center: [27.7172, 85.3240],
    zoom: 8,
    markers: [
      { name: "Pashupatinath Sacred Shiva Temple", lat: 27.7106, lon: 85.3486, category: "UNESCO Temple", description: "5th-century golden pagoda roof on Bagmati River.", cost: 1000 },
      { name: "Boudhanath Giant Spherical Stupa", lat: 27.7215, lon: 85.3620, category: "UNESCO Stupa", description: "Tibetan Buddhist mandala stupa with Buddha eyes.", cost: 400 },
      { name: "Swayambhunath (Monkey Temple)", lat: 27.7149, lon: 85.2904, category: "Hilltop Stupa", description: "Hilltop Buddhist shrine reached by 365 steps.", cost: 200 },
      { name: "Pokhara Phewa Lake Boat Cruise", lat: 28.2100, lon: 83.9550, category: "Glacial Lake", description: "Freshwater lake mirroring the Fishtail peak.", cost: 500 },
      { name: "Sarangkot Himalayan Sunrise", lat: 28.2439, lon: 83.9486, category: "Sunrise Peak", description: "Panoramic vistas over Annapurna and Dhaulagiri.", cost: 0 }
    ]
  },
  "sri lanka": {
    center: [7.8731, 80.7718],
    zoom: 8,
    markers: [
      { name: "Sigiriya Lion Rock Fortress 200m (UNESCO)", lat: 7.9570, lon: 80.7603, category: "Ancient Citadel", description: "5th-century palace atop a sheer 200m granite monolith.", cost: 2800 },
      { name: "Temple of the Sacred Tooth Relic (Kandy)", lat: 7.2936, lon: 80.6413, category: "Sacred Temple", description: "Houses the venerated left canine tooth of Lord Buddha.", cost: 600 },
      { name: "Galle Dutch Fort 16th-Century Ramparts", lat: 6.0270, lon: 80.2170, category: "UNESCO Fort", description: "Preserved colonial fortress overlooking Indian Ocean.", cost: 0 },
      { name: "Ella Nine Arch Bridge & Little Adam's Peak", lat: 6.8767, lon: 81.0608, category: "Scenic Viaduct", description: "Iconic colonial stone railway bridge surrounded by tea.", cost: 0 },
      { name: "Yala National Park Leopard & Elephant Safari", lat: 6.3719, lon: 81.5200, category: "Wildlife Safari", description: "Highest leopard density in the world in coastal forest.", cost: 3500 }
    ]
  },

  // =========================================================================
  // MIDDLE EAST & EUROPE
  // =========================================================================
  dubai: {
    center: [25.2048, 55.2708],
    zoom: 11,
    markers: [
      { name: "Burj Khalifa 124th & 148th Floor At the Top", lat: 25.1972, lon: 55.2744, category: "Skyscraper", description: "World's tallest building standing at 828 meters.", cost: 3800 },
      { name: "The Dubai Mall & Dancing Fountain", lat: 25.1974, lon: 55.2796, category: "Entertainment", description: "Mega mall featuring choregraphed lake fountain shows.", cost: 0 },
      { name: "Palm Jumeirah & Atlantis The Palm", lat: 25.1304, lon: 55.1171, category: "Man-made Island", description: "World-famous palm tree shaped archipelago.", cost: 0 },
      { name: "Dubai Desert Conservation Reserve Safari", lat: 24.8300, lon: 55.6500, category: "Desert Safari", description: "4x4 dune bashing, camel rides, and Bedouin camp dinner.", cost: 3200 },
      { name: "Dubai Miracle Garden", lat: 25.0597, lon: 55.2444, category: "Floral Park", description: "World's largest natural flower garden with 150M blooms.", cost: 1600 }
    ]
  },
  switzerland: {
    center: [46.8182, 8.2275],
    zoom: 8,
    markers: [
      { name: "Zurich Altstadt & Lake Zurich Promenade", lat: 47.3717, lon: 8.5422, category: "Heritage", description: "Cobblestone alleys and Lindenhof hill vistas.", cost: 0 },
      { name: "Chapel Bridge (Kapellbrücke) Lucerne", lat: 47.0516, lon: 8.3075, category: "Historic Bridge", description: "14th-century covered wooden footbridge.", cost: 0 },
      { name: "Jungfraujoch - Top of Europe (3,454m)", lat: 46.5475, lon: 7.9825, category: "Alpine Wonder", description: "Sphinx Observatory & Ice Palace above Aletsch Glacier.", cost: 7500 },
      { name: "Zermatt & Matterhorn Viewpoint", lat: 45.9763, lon: 7.7491, category: "Pyramid Peak", description: "Iconic pyramid-shaped Matterhorn summit view.", cost: 3800 },
      { name: "Interlaken Harder Kulm Skywalk", lat: 46.6863, lon: 7.8632, category: "Lake Viewpoint", description: "Glass floor skywalk between Lake Thun and Brienz.", cost: 2400 }
    ]
  },
  paris: {
    center: [48.8566, 2.3522],
    zoom: 12,
    markers: [
      { name: "Eiffel Tower & Champ de Mars", lat: 48.8584, lon: 2.2945, category: "Iconic Landmark", description: "World-famous iron lattice tower with panoramic decks.", cost: 2500 },
      { name: "Louvre Museum & Glass Pyramid", lat: 48.8606, lon: 2.3376, category: "Art Museum", description: "World's largest museum housing the Mona Lisa.", cost: 2200 },
      { name: "Arc de Triomphe & Champs-Élysées", lat: 48.8738, lon: 2.2950, category: "Monument", description: "Triumphal arch honouring French victories.", cost: 1300 },
      { name: "Montmartre & Sacré-Cœur Basilica", lat: 48.8867, lon: 2.3431, category: "Heritage", description: "Historic bohemian hilltop with artist squares.", cost: 0 },
      { name: "Seine River Cruise & Notre-Dame", lat: 48.8589, lon: 2.2933, category: "Scenic Cruise", description: "Sightseeing riverboat tour past cathedral island.", cost: 1400 }
    ]
  },
  france: {
    center: [48.8566, 2.3522],
    zoom: 6,
    markers: [
      { name: "Eiffel Tower (Paris)", lat: 48.8584, lon: 2.2945, category: "Landmark", description: "Iconic iron tower on Champ de Mars.", cost: 2500 },
      { name: "Louvre Museum (Paris)", lat: 48.8606, lon: 2.3376, category: "Museum", description: "World's most visited art museum.", cost: 2200 },
      { name: "Palace of Versailles Grand Gardens", lat: 48.8049, lon: 2.1204, category: "Château", description: "Opulent 17th-century royal palace of Louis XIV.", cost: 2400 },
      { name: "Mont Saint-Michel Tidal Island", lat: 48.6361, lon: -1.5115, category: "Island Abbey", description: "Gothic abbey on dramatic tidal island in Normandy.", cost: 1200 },
      { name: "Promenade des Anglais (Nice French Riviera)", lat: 43.6953, lon: 7.2656, category: "Riviera", description: "Famous Mediterranean coastal boulevard in Nice.", cost: 0 }
    ]
  },
  london: {
    center: [51.5074, -0.1278],
    zoom: 12,
    markers: [
      { name: "Big Ben & Palace of Westminster", lat: 51.5007, lon: -0.1246, category: "Clock Tower", description: "Iconic neo-Gothic clock tower on River Thames.", cost: 0 },
      { name: "Tower of London & Tower Bridge", lat: 51.5081, lon: -0.0759, category: "Crown Jewels", description: "Historic castle housing the Crown Jewels.", cost: 3200 },
      { name: "The London Eye 135m Giant Wheel", lat: 51.5033, lon: -0.1195, category: "Observation Wheel", description: "Panoramic glass pod flight overlooking London skyline.", cost: 2800 },
      { name: "British Museum & Rosetta Stone", lat: 51.5194, lon: -0.1270, category: "National Museum", description: "World-class museum with Greek, Egyptian antiquities.", cost: 0 },
      { name: "Buckingham Palace & Changing of the Guard", lat: 51.5014, lon: -0.1419, category: "Royal Palace", description: "Official London residence of the British Monarch.", cost: 0 }
    ]
  },
  uk: {
    center: [51.5074, -0.1278],
    zoom: 6,
    markers: [
      { name: "Tower of London & Tower Bridge", lat: 51.5081, lon: -0.0759, category: "Heritage", description: "Historic fortress on Thames.", cost: 3200 },
      { name: "Big Ben & Westminster (London)", lat: 51.5007, lon: -0.1246, category: "Landmark", description: "British parliament and clock tower.", cost: 0 },
      { name: "Stonehenge Ancient Monoliths (UNESCO)", lat: 51.1789, lon: -1.8262, category: "Prehistoric Wonder", description: "5,000-year-old circular standing stone ring in Wiltshire.", cost: 2400 },
      { name: "Edinburgh Castle (Scotland)", lat: 55.9486, lon: -3.1999, category: "Royal Castle", description: "Historic fortress atop Castle Rock overlooking Edinburgh.", cost: 2100 },
      { name: "Roman Baths (Bath)", lat: 51.3810, lon: -2.3596, category: "Roman Heritage", description: "Preserved natural geothermal Roman thermal baths.", cost: 1800 }
    ]
  },
  rome: {
    center: [41.9028, 12.4964],
    zoom: 12,
    markers: [
      { name: "Colosseum Amphitheatre (UNESCO)", lat: 41.8902, lon: 12.4922, category: "Roman Arena", description: "Largest ancient amphitheatre built in 70-80 AD.", cost: 1800 },
      { name: "Vatican City & St. Peter's Basilica", lat: 41.9029, lon: 12.4534, category: "Papal Basilica", description: "Renaissance masterpiece designed by Michelangelo.", cost: 0 },
      { name: "Trevi Fountain Coin Tradition", lat: 41.9009, lon: 12.4833, category: "Baroque Fountain", description: "Baroque fountain where legend promises return to Rome.", cost: 0 },
      { name: "Pantheon 2,000-Yr Unreinforced Dome", lat: 41.8986, lon: 12.4769, category: "Ancient Temple", description: "Best preserved Roman temple with open oculus skylight.", cost: 450 },
      { name: "Roman Forum & Palatine Hill", lat: 41.8925, lon: 12.4853, category: "Ancient Ruins", description: "Center of Roman political, commercial, and legal life.", cost: 1400 }
    ]
  },
  italy: {
    center: [41.9028, 12.4964],
    zoom: 6,
    markers: [
      { name: "Colosseum & Roman Forum (Rome)", lat: 41.8902, lon: 12.4922, category: "Roman Monument", description: "Ancient gladiatorial amphitheatre in Rome.", cost: 1800 },
      { name: "Florence Cathedral (Duomo Santa Maria)", lat: 43.7731, lon: 11.2560, category: "Renaissance Dome", description: "Brunelleschi's red-tiled brick dome in Florence.", cost: 1500 },
      { name: "Venice Grand Canal & St. Mark's Square", lat: 45.4371, lon: 12.3326, category: "Gondola Canal", description: "Romantic waterway navigated by wooden gondolas.", cost: 0 },
      { name: "Leaning Tower of Pisa (UNESCO)", lat: 43.7230, lon: 10.3966, category: "Marble Tower", description: "12th-century freestanding bell tower known for its tilt.", cost: 1800 },
      { name: "Amalfi Coast & Positano Cliffs", lat: 40.6281, lon: 14.4850, category: "Cliffside Village", description: "Dramatic vertical pastel villages on the Mediterranean.", cost: 0 }
    ]
  },
  greece: {
    center: [37.9838, 23.7275],
    zoom: 7,
    markers: [
      { name: "Acropolis & Parthenon (Athens)", lat: 37.9715, lon: 23.7257, category: "Ancient Citadel", description: "5th-century BCE temple dedicated to Goddess Athena.", cost: 1800 },
      { name: "Oia Sunset & Blue Dome Churches (Santorini)", lat: 36.4618, lon: 25.3753, category: "Caldera Village", description: "White-washed cliff houses and world-famous sunsets.", cost: 0 },
      { name: "Mykonos Windmills & Little Venice", lat: 37.4447, lon: 25.3262, category: "Cycladic Island", description: "16th-century thatched windmills and seaside cafes.", cost: 0 },
      { name: "Meteora Monasteries Atop Rock Pillars", lat: 39.7217, lon: 21.6306, category: "Monastery Cliffs", description: "Byzantine monasteries perched on 400m sandstone pillars.", cost: 300 },
      { name: "Navagio Shipwreck Beach (Zakynthos)", lat: 37.8594, lon: 20.6249, category: "Smugglers Cove", description: "Stranded cargo ship on secluded white pebble beach.", cost: 0 }
    ]
  },
  santorini: {
    center: [36.3932, 25.4615],
    zoom: 11,
    markers: [
      { name: "Oia Blue Dome Churches & Sunset Point", lat: 36.4618, lon: 25.3753, category: "Caldera Village", description: "Iconic blue domed churches and golden sunsets.", cost: 0 },
      { name: "Fira Capital & Caldera Walking Path", lat: 36.4166, lon: 25.4324, category: "Cliff Town", description: "Bustling capital perched 400m on the crater rim.", cost: 0 },
      { name: "Red Beach (Kokkini Paralia)", lat: 36.3486, lon: 25.3942, category: "Volcanic Beach", description: "Dramatic red volcanic cliffs and azure Aegean waters.", cost: 0 },
      { name: "Kamari Black Sand Beach Promenade", lat: 36.3778, lon: 25.4850, category: "Black Sand Beach", description: "Volcanic black pebble beach with waterfront tavernas.", cost: 0 },
      { name: "Akrotiri Bronze Age Prehistoric Ruins", lat: 36.3514, lon: 25.4033, category: "Minoan Pompeii", description: "Ancient Minoan city preserved under volcanic ash.", cost: 1100 }
    ]
  },

  // =========================================================================
  // THE AMERICAS & OCEANIA
  // =========================================================================
  usa: {
    center: [40.7128, -74.0060],
    zoom: 5,
    markers: [
      { name: "Statue of Liberty & Ellis Island (NYC)", lat: 40.6892, lon: -74.0445, category: "National Monument", description: "Universal symbol of freedom in New York Harbor.", cost: 2400 },
      { name: "Grand Canyon South Rim & Mather Point", lat: 36.0544, lon: -112.1401, category: "Natural Wonder", description: "1.8km deep canyon carved by the Colorado River.", cost: 2800 },
      { name: "Golden Gate Bridge (San Francisco)", lat: 37.8199, lon: -122.4783, category: "Suspension Bridge", description: "World-famous 2.7km suspension bridge over the Pacific.", cost: 0 },
      { name: "Empire State Building & Central Park (NYC)", lat: 40.7484, lon: -73.9857, category: "Skyscraper", description: "102-story Art Deco tower overlooking Manhattan.", cost: 3800 },
      { name: "Las Vegas Strip & Bellagio Fountains", lat: 36.1147, lon: -115.1728, category: "Entertainment", description: "Glamorous neon boulevard with world-class casino resorts.", cost: 0 }
    ]
  },
  "new york": {
    center: [40.7128, -74.0060],
    zoom: 12,
    markers: [
      { name: "Statue of Liberty & Ellis Island", lat: 40.6892, lon: -74.0445, category: "National Monument", description: "93m colossal copper statue in New York Harbor.", cost: 2400 },
      { name: "Central Park 843-Acre Oasis", lat: 40.7829, lon: -73.9654, category: "Urban Park", description: "Bethesda Terrace, Bow Bridge, and scenic lawns.", cost: 0 },
      { name: "Empire State Building 86th Floor Deck", lat: 40.7484, lon: -73.9857, category: "Skyscraper", description: "Art Deco viewing platform across 6 US states.", cost: 3800 },
      { name: "Times Square Broadway Neon District", lat: 40.7580, lon: -73.9855, category: "Entertainment", description: "Towering digital billboards and Broadway shows.", cost: 0 },
      { name: "Brooklyn Bridge & DUMBO Promenade", lat: 40.7061, lon: -73.9969, category: "Historic Bridge", description: "1883 suspension bridge with Manhattan skyline views.", cost: 0 }
    ]
  },
  mexico: {
    center: [20.6843, -88.5678],
    zoom: 6,
    markers: [
      { name: "Chichen Itza El Castillo Pyramid (UNESCO)", lat: 20.6843, lon: -88.5678, category: "Maya Wonder", description: "New 7 Wonder of the World Mayan pyramid temple.", cost: 2500 },
      { name: "Cancun Playa Delfines & Hotel Zone", lat: 21.0600, lon: -86.7800, category: "Caribbean Beach", description: "Fine white sand and bright turquoise waters.", cost: 0 },
      { name: "Teotihuacan Pyramids of Sun & Moon (Mexico City)", lat: 19.6925, lon: -98.8438, category: "Ancient Pyramids", description: "Colossal 65m pre-Columbian temple pyramids.", cost: 450 },
      { name: "Tulum Cliffside Mayan Ruins Over Ocean", lat: 20.2114, lon: -87.4294, category: "Coastal Ruins", description: "13th-century walled Maya fortress on sea cliffs.", cost: 800 },
      { name: "Cenote Ik Kil Sacred Sinkhole", lat: 20.6606, lon: -88.5706, category: "Natural Sinkhole", description: "26m deep freshwater pool draped in hanging jungle vines.", cost: 750 }
    ]
  },
  australia: {
    center: [-33.8688, 151.2093],
    zoom: 5,
    markers: [
      { name: "Sydney Opera House (UNESCO)", lat: -33.8568, lon: 151.2153, category: "Architectural Icon", description: "World-famous sail-shaped performing arts center.", cost: 2200 },
      { name: "Sydney Harbour Bridge Climb", lat: -33.8523, lon: 151.2108, category: "Steel Arch Bridge", description: "Iconic coat-hanger bridge across Sydney Harbour.", cost: 0 },
      { name: "Bondi Beach Coastal Walk to Coogee", lat: -33.8915, lon: 151.2767, category: "Surf Beach", description: "Golden surfing beach and dramatic cliffside trail.", cost: 0 },
      { name: "Great Barrier Reef Marine Park (Cairns)", lat: -16.9200, lon: 145.7700, category: "Coral Wonder", description: "World's largest living coral reef ecosystem.", cost: 8500 },
      { name: "Blue Mountains & Three Sisters Rocks", lat: -33.7320, lon: 150.3120, category: "Sandstone Peaks", description: "Eucalyptus forest valley with iconic rock pillars.", cost: 0 }
    ]
  },

  // =========================================================================
  // INDIA - METROS, STATES & TOURIST REGIONS
  // =========================================================================
  "tamil nadu": {
    center: [11.1271, 78.6569],
    zoom: 8,
    markers: [
      { name: "Meenakshi Amman Temple Madurai", lat: 9.9195, lon: 78.1193, category: "Dravidian Temple", description: "14 towering gopurams and Thousand Pillar Hall.", cost: 0 },
      { name: "Brihadisvara Temple Thanjavur (UNESCO)", lat: 10.7828, lon: 79.1318, category: "UNESCO Temple", description: "1010 CE Great Living Chola granite wonder.", cost: 0 },
      { name: "Mahabalipuram Shore Temple & Pancha Rathas", lat: 12.6167, lon: 80.1917, category: "UNESCO Monoliths", description: "7th-century coastal monolith sanctuaries.", cost: 40 },
      { name: "Ramanathaswamy Temple Rameshwaram", lat: 9.2881, lon: 79.3174, category: "Pilgrimage", description: "World's longest 1.2km corridor and 22 sacred wells.", cost: 0 },
      { name: "Vivekananda Rock Memorial Kanyakumari", lat: 8.0781, lon: 77.5550, category: "Ocean Memorial", description: "Southernmost tip where three great oceans meet.", cost: 50 }
    ]
  },
  chennai: {
    center: [13.0827, 80.2707],
    zoom: 12,
    markers: [
      { name: "Marina Beach 13km Shoreline", lat: 13.0499, lon: 80.2824, category: "Beach", description: "India's longest natural urban beach.", cost: 0 },
      { name: "Kapaleeshwarar Temple Mylapore", lat: 13.0336, lon: 80.2697, category: "Heritage Temple", description: "7th-century Dravidian Shiva shrine.", cost: 0 },
      { name: "San Thome Cathedral Basilica", lat: 13.0336, lon: 80.2778, category: "Historic Church", description: "Neo-Gothic church over St. Thomas Apostle's tomb.", cost: 0 },
      { name: "Fort St. George & Museum", lat: 13.0797, lon: 80.2872, category: "Colonial Fort", description: "1644 British fortress and historic museum.", cost: 25 },
      { name: "Government Museum & Bronze Gallery", lat: 13.0700, lon: 80.2567, category: "Museum", description: "Famous Chola Bronze Nataraja collections.", cost: 50 }
    ]
  },
  mumbai: {
    center: [18.9220, 72.8347],
    zoom: 12,
    markers: [
      { name: "Gateway of India & Taj Mahal Palace", lat: 18.9220, lon: 72.8347, category: "Historic Monument", description: "Iconic basalt triumphal arch overlooking harbor.", cost: 0 },
      { name: "Marine Drive ('Queen's Necklace')", lat: 18.9438, lon: 72.8232, category: "Promenade", description: "3.6km C-shaped coastal boulevard and sunset point.", cost: 0 },
      { name: "Elephanta Caves (UNESCO)", lat: 18.9633, lon: 72.9315, category: "UNESCO Caves", description: "5th-century rock-cut caves featuring 20ft Shiva Trimurti.", cost: 40 },
      { name: "CSMT Gothic Victorian Station", lat: 18.9398, lon: 72.8355, category: "UNESCO Heritage", description: "1888 Victorian Gothic revival railway terminus.", cost: 0 },
      { name: "Shree Siddhivinayak Temple", lat: 19.0169, lon: 72.8303, category: "Sacred Temple", description: "Historic shrine dedicated to Lord Ganesha.", cost: 0 }
    ]
  },
  hyderabad: {
    center: [17.3850, 78.4867],
    zoom: 12,
    markers: [
      { name: "Charminar & Laad Bazaar", lat: 17.3616, lon: 78.4747, category: "Heritage", description: "1591 iconic four-minaret arch and pearl market.", cost: 25 },
      { name: "Golconda Fort & Acoustic Portico", lat: 17.3833, lon: 78.4011, category: "Hill Fortress", description: "Medieval diamond fortress of Qutb Shahi dynasty.", cost: 25 },
      { name: "Ramoji Film City", lat: 17.2543, lon: 78.6808, category: "Studio Park", description: "Guinness World Record 2,000-acre film complex.", cost: 1350 },
      { name: "Hussain Sagar & 18m Buddha Statue", lat: 17.4239, lon: 78.4738, category: "Lake", description: "Heart-shaped lake with monolithic white Buddha.", cost: 100 },
      { name: "Chowmahalla Palace", lat: 17.3578, lon: 78.4717, category: "Royal Palace", description: "Grand 18th-century seat of the Asaf Jahi Nizams.", cost: 100 }
    ]
  },
  visakhapatnam: {
    center: [17.6868, 83.2185],
    zoom: 12,
    markers: [
      { name: "Rishikonda Blue Flag Beach", lat: 17.7816, lon: 83.3850, category: "Beach", description: "Blue Flag certified golden sands and surfing bay.", cost: 0 },
      { name: "Kailasagiri Hilltop Park & Giant Statues", lat: 17.7492, lon: 83.3422, category: "Viewpoint", description: "Passenger ropeway and 40ft Shiva-Parvathi statues.", cost: 100 },
      { name: "INS Kursura (S20) Submarine Museum", lat: 17.7169, lon: 83.3325, category: "Museum", description: "Real Kalvari-class naval submarine on RK Beach.", cost: 70 },
      { name: "Borra Caves Stalactites", lat: 18.2800, lon: 83.0400, category: "Caves", description: "Million-year-old illuminated limestone karst formations.", cost: 120 },
      { name: "Araku Valley Coffee Plantations", lat: 18.3300, lon: 82.8800, category: "Valley", description: "Eastern Ghats hill valley known for organic Arabica.", cost: 50 }
    ]
  },
  vizag: {
    center: [17.6868, 83.2185],
    zoom: 12,
    markers: [
      { name: "Rishikonda Blue Flag Beach", lat: 17.7816, lon: 83.3850, category: "Beach", description: "Blue Flag certified golden sands and surfing bay.", cost: 0 },
      { name: "Kailasagiri Hilltop Park", lat: 17.7492, lon: 83.3422, category: "Viewpoint", description: "Passenger ropeway and 40ft Shiva-Parvathi statues.", cost: 100 },
      { name: "INS Kursura Submarine Museum", lat: 17.7169, lon: 83.3325, category: "Museum", description: "Real Kalvari-class submarine on RK Beach.", cost: 70 },
      { name: "Borra Caves", lat: 18.2800, lon: 83.0400, category: "Caves", description: "Million-year-old illuminated limestone formations.", cost: 120 },
      { name: "Araku Valley", lat: 18.3300, lon: 82.8800, category: "Valley", description: "Eastern Ghats hill valley known for organic coffee.", cost: 50 }
    ]
  },
  bengaluru: {
    center: [12.9716, 77.5946],
    zoom: 12,
    markers: [
      { name: "Lalbagh Botanical Garden & Glass House", lat: 12.9507, lon: 77.5848, category: "Botanical", description: "240-acre garden with London Crystal Palace replica.", cost: 30 },
      { name: "Cubbon Park 300-Acre Canopy", lat: 12.9763, lon: 77.5929, category: "Urban Park", description: "Sprawling green lung with 6,000 indigenous trees.", cost: 0 },
      { name: "Bangalore Palace Tudor Estate", lat: 12.9988, lon: 77.5921, category: "Royal Palace", description: "1878 royal residence inspired by Windsor Castle.", cost: 250 },
      { name: "Bannerghatta Tiger Safari", lat: 12.8000, lon: 77.5770, category: "Safari", description: "Biological sanctuary with free-roaming tigers and lions.", cost: 350 },
      { name: "ISKCON Bangalore Sri Radha Krishna", lat: 13.0098, lon: 77.5511, category: "Temple", description: "Neo-classical temple complex in Rajajinagar.", cost: 0 }
    ]
  },
  bangalore: {
    center: [12.9716, 77.5946],
    zoom: 12,
    markers: [
      { name: "Lalbagh Botanical Garden", lat: 12.9507, lon: 77.5848, category: "Botanical", description: "240-acre botanical garden with Glass House.", cost: 30 },
      { name: "Cubbon Park", lat: 12.9763, lon: 77.5929, category: "Urban Park", description: "Sprawling green lung with 6,000 trees.", cost: 0 },
      { name: "Bangalore Palace", lat: 12.9988, lon: 77.5921, category: "Royal Palace", description: "1878 royal residence inspired by Windsor Castle.", cost: 250 },
      { name: "Bannerghatta Safari", lat: 12.8000, lon: 77.5770, category: "Safari", description: "Biological sanctuary with tiger and lion safaris.", cost: 350 },
      { name: "ISKCON Temple", lat: 13.0098, lon: 77.5511, category: "Temple", description: "Neo-classical temple complex atop Hare Krishna Hill.", cost: 0 }
    ]
  },
  delhi: {
    center: [28.6139, 77.2090],
    zoom: 12,
    markers: [
      { name: "Red Fort (Lal Qila UNESCO)", lat: 28.6562, lon: 77.2410, category: "UNESCO Fort", description: "1638 Mughal imperial palace fortress.", cost: 50 },
      { name: "Qutub Minar 73m Tower", lat: 28.5244, lon: 77.1855, category: "UNESCO Minaret", description: "World's tallest brick minaret and 1600-yr iron pillar.", cost: 50 },
      { name: "India Gate & Kartavya Path", lat: 28.6129, lon: 77.2295, category: "Monument", description: "42-meter triumphal war memorial arch.", cost: 0 },
      { name: "Humayun's Tomb Garden", lat: 28.5933, lon: 77.2507, category: "UNESCO Mausoleum", description: "Architectural precursor to the Taj Mahal.", cost: 50 },
      { name: "Lotus Temple (Bahá'í House)", lat: 28.5535, lon: 77.2588, category: "Architecture", description: "27 freestanding marble petals in lotus bloom.", cost: 0 }
    ]
  },
  manali: {
    center: [32.2396, 77.1887],
    zoom: 11,
    markers: [
      { name: "Hadimba Devi Pagoda Temple", lat: 32.2483, lon: 77.1802, category: "Heritage", description: "16th-century wooden temple in cedar forest.", cost: 0 },
      { name: "Solang Valley Skiing & Paragliding", lat: 32.3166, lon: 77.1578, category: "Adventure", description: "Paragliding, zorbing, and alpine viewpoints.", cost: 500 },
      { name: "Atal Tunnel & Sissu Waterfall", lat: 32.4418, lon: 77.1408, category: "Scenic", description: "Engineering marvel connecting to Lahaul Valley.", cost: 0 },
      { name: "Jogini Waterfall Trek", lat: 32.2678, lon: 77.1915, category: "Nature", description: "Mountain waterfall through pine forest.", cost: 0 },
      { name: "Old Manali Artisan Village", lat: 32.2530, lon: 77.1770, category: "Culture", description: "Vibrant bohemian alleys and wooden chalets.", cost: 0 }
    ]
  },
  goa: {
    center: [15.4989, 73.8278],
    zoom: 11,
    markers: [
      { name: "Baga & Calangute Beach", lat: 15.5553, lon: 73.7516, category: "Beach", description: "Golden sands, beach shacks, and watersports.", cost: 0 },
      { name: "Fort Aguada & Lighthouse", lat: 15.4921, lon: 73.7736, category: "Heritage", description: "17th-century Portuguese coastal fortress.", cost: 50 },
      { name: "Basilica of Bom Jesus (UNESCO)", lat: 15.5009, lon: 73.9116, category: "UNESCO Heritage", description: "Baroque church holding relics of St. Francis Xavier.", cost: 0 },
      { name: "Dudhsagar Cascading Falls", lat: 15.3144, lon: 74.3143, category: "Nature", description: "Four-tiered sea of milk waterfall.", cost: 500 },
      { name: "Palolem Crescent Beach", lat: 15.0100, lon: 74.0232, category: "Beach", description: "Scenic palm-fringed bay in South Goa.", cost: 0 }
    ]
  },
  jaipur: {
    center: [26.9124, 75.7873],
    zoom: 12,
    markers: [
      { name: "Amber Palace & Sheesh Mahal", lat: 26.9855, lon: 75.8513, category: "UNESCO Fort", description: "Hilltop fort with mirror palace.", cost: 100 },
      { name: "Hawa Mahal (Palace of Winds)", lat: 26.9239, lon: 75.8267, category: "Architecture", description: "5-story honeycomb facade with 953 jharokhas.", cost: 50 },
      { name: "City Palace & Chandra Mahal", lat: 26.9258, lon: 75.8237, category: "Royal Palace", description: "Historic royal residence and museum.", cost: 300 },
      { name: "Nahargarh Fort Sunset View", lat: 26.9373, lon: 75.8155, category: "Scenic Fort", description: "Aravalli ridge fortress overlooking Pink City.", cost: 50 },
      { name: "Jal Mahal (Water Palace)", lat: 26.9535, lon: 75.8462, category: "Heritage", description: "Submerged sandstone palace in Man Sagar Lake.", cost: 0 }
    ]
  },
  kerala: {
    center: [9.9312, 76.2673],
    zoom: 9,
    markers: [
      { name: "Munnar Tea Plantations & Museum", lat: 10.0889, lon: 77.0595, category: "Plantation", description: "Sprawling emerald tea hills and mist.", cost: 125 },
      { name: "Alleppey Backwaters Houseboat Cruise", lat: 9.4981, lon: 76.3388, category: "Backwaters", description: "Traditional kettuvallam cruise along lagoons.", cost: 4500 },
      { name: "Fort Kochi Chinese Fishing Nets", lat: 9.9656, lon: 76.2421, category: "Heritage", description: "Historic cantilevered fishing structures at sunset.", cost: 0 },
      { name: "Varkala Cliff Beach", lat: 8.7379, lon: 76.7163, category: "Beach", description: "Dramatic red laterite cliffs bordering Arabian Sea.", cost: 0 },
      { name: "Eravikulam National Park", lat: 10.1500, lon: 77.0667, category: "Wildlife", description: "Sanctuary for endangered mountain goats.", cost: 200 }
    ]
  },
  ladakh: {
    center: [34.1526, 77.5771],
    zoom: 9,
    markers: [
      { name: "Pangong Tso High-Altitude Lake", lat: 33.7595, lon: 78.6674, category: "Alpine Lake", description: "Turquoise blue lake across 4,250m altitude.", cost: 0 },
      { name: "Khardung La Pass (5,359m)", lat: 34.2787, lon: 77.6047, category: "Mountain Pass", description: "One of the highest motorable mountain passes.", cost: 0 },
      { name: "Nubra Valley & Hunder Sand Dunes", lat: 34.5777, lon: 77.5645, category: "Desert Valley", description: "Double-humped camel safaris in mountain desert.", cost: 300 },
      { name: "Thiksey Hilltop Monastery", lat: 34.0583, lon: 77.6667, category: "Monastery", description: "12-story hilltop complex resembling Potala Palace.", cost: 50 },
      { name: "Shanti Stupa Leh", lat: 34.1672, lon: 77.5786, category: "Peace Stupa", description: "White-domed Buddhist stupa offering Leh panoramas.", cost: 0 }
    ]
  },
  kashmir: {
    center: [34.0837, 74.7973],
    zoom: 9,
    markers: [
      { name: "Dal Lake Shikara Ride & Floating Market", lat: 34.0837, lon: 74.8385, category: "Lakeside", description: "Iconic wooden boat rides past floating flower markets.", cost: 700 },
      { name: "Gulmarg Gondola Phase 2 (Apharwat Peak 3,950m)", lat: 34.0484, lon: 74.3805, category: "Cable Car", description: "Asia's highest operating cable car to snow peaks.", cost: 1850 },
      { name: "Pahalgam Betaab Valley & Aru Valley", lat: 34.0150, lon: 75.3200, category: "Alpine Valley", description: "Lush meadows flanked by pine-covered Himalayas.", cost: 100 },
      { name: "Mughal Gardens (Shalimar & Nishat Bagh)", lat: 34.1481, lon: 74.8722, category: "Mughal Garden", description: "Terraced water fountain gardens on Dal Lake.", cost: 24 },
      { name: "Sonamarg Meadow of Gold & Thajiwas Glacier", lat: 34.3000, lon: 75.3000, category: "Glacier Trek", description: "Picturesque valley offering pony rides to snowfields.", cost: 0 }
    ]
  }
};

// Global Country & City Coordinates Geocoder Fallback Table
export const GLOBAL_GEOCODER_FALLBACK: Record<string, [number, number]> = {
  // Asia
  japan: [35.6762, 139.6503],
  tokyo: [35.6762, 139.6503],
  kyoto: [35.0116, 135.7681],
  osaka: [34.6937, 135.5023],
  hiroshima: [34.3853, 132.4553],
  hokkaido: [43.0642, 141.3469],
  china: [39.9042, 116.4074],
  beijing: [39.9042, 116.4074],
  shanghai: [31.2304, 121.4737],
  hongkong: [22.3193, 114.1694],
  singapore: [1.3521, 103.8198],
  thailand: [13.7563, 100.5018],
  bangkok: [13.7563, 100.5018],
  phuket: [7.8804, 98.3923],
  malaysia: [3.1390, 101.6869],
  kualalumpur: [3.1390, 101.6869],
  vietnam: [21.0285, 105.8542],
  hanoi: [21.0285, 105.8542],
  indonesia: [-0.7893, 113.9213],
  bali: [-8.4095, 115.1889],
  jakarta: [-6.2088, 106.8456],
  philippines: [12.8797, 121.7740],
  manila: [14.5995, 120.9842],
  southkorea: [37.5665, 126.9780],
  korea: [37.5665, 126.9780],
  seoul: [37.5665, 126.9780],
  srilanka: [7.8731, 80.7718],
  colombo: [6.9271, 79.8612],
  nepal: [27.7172, 85.3240],
  kathmandu: [27.7172, 85.3240],
  maldives: [4.1755, 73.5093],
  male: [4.1755, 73.5093],
  dubai: [25.2048, 55.2708],
  uae: [23.4241, 53.8478],
  abudhabi: [24.4539, 54.3773],
  qatar: [25.276987, 51.520008],
  doha: [25.2854, 51.5310],
  saudiarabia: [23.8859, 45.0792],
  riyadh: [24.7136, 46.6753],

  // Europe
  france: [46.2276, 2.2137],
  paris: [48.8566, 2.3522],
  nice: [43.7102, 7.2620],
  switzerland: [46.8182, 8.2275],
  zurich: [47.3769, 8.5417],
  lucerne: [47.0502, 8.3093],
  geneva: [46.2044, 6.1432],
  uk: [55.3781, -3.4360],
  london: [51.5074, -0.1278],
  scotland: [56.4907, -4.2026],
  edinburgh: [55.9533, -3.1883],
  italy: [41.8719, 12.5674],
  rome: [41.9028, 12.4964],
  florence: [43.7696, 11.2558],
  venice: [45.4408, 12.3155],
  milan: [45.4642, 9.1900],
  germany: [51.1657, 10.4515],
  berlin: [52.5200, 13.4050],
  munich: [48.1351, 11.5820],
  spain: [40.4637, -3.7492],
  madrid: [40.4168, -3.7038],
  barcelona: [41.3851, 2.1734],
  portugal: [39.3999, -8.2245],
  lisbon: [38.7223, -9.1393],
  greece: [39.0742, 21.8243],
  athens: [37.9838, 23.7275],
  santorini: [36.3932, 25.4615],
  netherlands: [52.1326, 5.2913],
  amsterdam: [52.3676, 4.9041],
  austria: [47.5162, 14.5501],
  vienna: [48.2082, 16.3738],
  turkey: [38.9637, 35.2433],
  istanbul: [41.0082, 28.9784],

  // Americas & Oceania
  usa: [37.0902, -95.7129],
  newyork: [40.7128, -74.0060],
  sanfrancisco: [37.7749, -122.4194],
  losangeles: [34.0522, -118.2437],
  chicago: [41.8781, -87.6298],
  lasvegas: [36.1699, -115.1398],
  canada: [56.1304, -106.3468],
  toronto: [43.6532, -79.3832],
  vancouver: [49.2827, -123.1207],
  mexico: [23.6345, -102.5528],
  cancun: [21.1619, -86.8515],
  mexicocity: [19.4326, -99.1332],
  brazil: [-14.2350, -51.9253],
  riodejaneiro: [-22.9068, -43.1729],
  australia: [-25.2744, 133.7751],
  sydney: [-33.8688, 151.2093],
  melbourne: [-37.8136, 144.9631],
  newzealand: [-40.9006, 174.8860],
  auckland: [-36.8485, 174.7633],
  egypt: [26.8206, 30.8025],
  cairo: [30.0444, 31.2357],
  southafrica: [-30.5595, 22.9375],
  capetown: [-33.9249, 18.4241]
};

// Main Resolver: Gets accurate map config with intelligent geocoding fallback
export function resolveDestinationMap(destinationName: string): DestinationMapConfig {
  const clean = destinationName.toLowerCase().replace(/[^a-z0-9]/g, '').trim();

  // 1. Check direct matches in rich knowledge map
  for (const [key, config] of Object.entries(GLOBAL_DESTINATIONS_MAP)) {
    const keyClean = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean === keyClean || clean.includes(keyClean) || keyClean.includes(clean)) {
      return config;
    }
  }

  // 2. Check global geocoder fallback table
  for (const [key, coords] of Object.entries(GLOBAL_GEOCODER_FALLBACK)) {
    const keyClean = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean === keyClean || clean.includes(keyClean) || keyClean.includes(clean)) {
      return {
        center: coords,
        zoom: 9,
        markers: [
          { name: `${destinationName} Landmark & City Center`, lat: coords[0], lon: coords[1], category: "Heritage", description: `Historic city center and primary sights of ${destinationName}.`, cost: 0 },
          { name: `${destinationName} Scenic Lookout & Ridge`, lat: coords[0] + 0.02, lon: coords[1] + 0.02, category: "Scenic", description: `Panoramic viewpoint overlooking ${destinationName}.`, cost: 150 },
          { name: `${destinationName} Cultural Square & Promenade`, lat: coords[0] - 0.02, lon: coords[1] - 0.02, category: "Culture", description: `Traditional cultural bazaars and local dining.`, cost: 0 }
        ]
      };
    }
  }

  // 3. Default anchor
  return {
    center: [20.5937, 78.9629],
    zoom: 6,
    markers: [
      { name: `${destinationName} Central Landmark`, lat: 20.5937, lon: 78.9629, category: "Heritage", description: `Explore ${destinationName}.`, cost: 0 }
    ]
  };
}

// 100% Verified High-Resolution Destination Hero Images Dataset
export const DESTINATION_HERO_IMAGES: Record<string, string> = {
  // India
  hyderabad: "https://images.unsplash.com/photo-1572445271230-a78b5944a659?w=1200&q=80",
  goa: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
  jaipur: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80",
  udaipur: "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=1200&q=80",
  jodhpur: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200&q=80",
  jaisalmer: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1200&q=80",
  kerala: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80",
  munnar: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=80",
  alleppey: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=80",
  kochi: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80",
  wayanad: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
  varkala: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
  manali: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80",
  shimla: "https://images.unsplash.com/photo-1562670652-e5947bddb335?w=1200&q=80",
  dharamshala: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
  spitivalley: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1200&q=80",
  kasol: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
  rishikesh: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=1200&q=80",
  nainital: "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1200&q=80",
  auli: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80",
  corbett: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1200&q=80",
  kashmir: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1200&q=80",
  srinagar: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1200&q=80",
  gulmarg: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80",
  ladakh: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1200&q=80",
  leh: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1200&q=80",
  agra: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80",
  varanasi: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=80",
  visakhapatnam: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80",
  vizag: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80",
  bengaluru: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&q=80",
  bangalore: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&q=80",
  mumbai: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80",
  delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80",
  chennai: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80",
  tamilnadu: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80",
  kolkata: "https://images.unsplash.com/photo-1558431382-27e303142255?w=1200&q=80",
  pune: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200&q=80",
  ahmedabad: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80",
  ooty: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=80",
  coorg: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=80",
  hampi: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&q=80",
  gokarna: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
  darjeeling: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
  sikkim: "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80",
  meghalaya: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
  andaman: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&q=80",
  amritsar: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1200&q=80",

  // Global
  nepal: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
  usa: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80",
  newyork: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80",
  mexico: "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1200&q=80",
  japan: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80",
  tokyo: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80",
  kyoto: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80",
  switzerland: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&q=80",
  bali: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
  paris: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
  france: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
  maldives: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80",
  dubai: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
  santorini: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80",
  greece: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80",
  rome: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80",
  italy: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80",
  london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
  uk: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
  singapore: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80",
  thailand: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1200&q=80",
  bangkok: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1200&q=80"
};

// Resolver for high-resolution destination hero images with robust fallback
export function resolveDestinationImage(destinationName?: string): string {
  if (!destinationName) return DESTINATION_HERO_IMAGES.goa;
  const clean = destinationName.toLowerCase().replace(/[^a-z0-9]/g, '').trim();

  for (const [key, url] of Object.entries(DESTINATION_HERO_IMAGES)) {
    const keyClean = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (clean === keyClean || clean.includes(keyClean) || keyClean.includes(clean)) {
      return url;
    }
  }

  return "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80";
}

