import re
from typing import Dict, Any, Optional

# Comprehensive mapping of destination aliases to canonical destination names
DESTINATIONS_MAP = {
    # ------------------- INDIA - WEST & SOUTH -------------------
    "mumbai": "Mumbai", "bombay": "Mumbai",
    "pune": "Pune",
    "goa": "Goa", "north goa": "Goa", "south goa": "Goa", "panaji": "Goa", "panjim": "Goa", "calangute": "Goa", "baga": "Goa",
    "gokarna": "Gokarna",
    "hyderabad": "Hyderabad", "hyd": "Hyderabad", "secunderabad": "Hyderabad",
    "bengaluru": "Bengaluru", "bangalore": "Bengaluru",
    "mysore": "Mysore", "mysuru": "Mysore",
    "coorg": "Coorg", "kodagu": "Coorg",
    "hampi": "Hampi",
    "chennai": "Chennai", "madras": "Chennai",
    "ooty": "Ooty", "udhagamandalam": "Ooty",
    "kerala": "Kerala", "gods own country": "Kerala",
    "munnar": "Munnar",
    "kochi": "Kochi", "cochin": "Kochi", "fort kochi": "Kochi",
    "alleppey": "Alleppey", "alappuzha": "Alleppey",
    "wayanad": "Wayanad",
    "varkala": "Varkala",
    "tamil nadu": "Tamil Nadu",
    "visakhapatnam": "Visakhapatnam", "vizag": "Visakhapatnam",
    "andaman": "Andaman", "andaman and nicobar": "Andaman", "port blair": "Andaman", "havelock": "Andaman",

    # ------------------- INDIA - NORTH & CENTRAL -------------------
    "delhi": "Delhi", "new delhi": "Delhi", "ncr": "Delhi",
    "jaipur": "Jaipur", "pink city": "Jaipur",
    "udaipur": "Udaipur", "city of lakes": "Udaipur",
    "jodhpur": "Jodhpur", "blue city": "Jodhpur",
    "jaisalmer": "Jaisalmer", "golden city": "Jaisalmer",
    "rajasthan": "Jaipur",
    "agra": "Agra", "taj mahal": "Agra",
    "varanasi": "Varanasi", "kashi": "Varanasi", "banaras": "Varanasi",
    "amritsar": "Amritsar", "golden temple": "Amritsar",
    "ahmedabad": "Ahmedabad",
    "manali": "Manali", "kullu manali": "Manali", "kullu": "Manali",
    "shimla": "Shimla",
    "dharamshala": "Dharamshala", "dharamsala": "Dharamshala", "mcleodganj": "Dharamshala",
    "spiti valley": "Spiti Valley", "spiti": "Spiti Valley",
    "kasol": "Kasol",
    "himachal": "Manali", "himachal pradesh": "Manali",
    "rishikesh": "Rishikesh",
    "nainital": "Nainital",
    "auli": "Auli",
    "corbett": "Corbett", "jim corbett": "Corbett",
    "uttarakhand": "Rishikesh",
    "kashmir": "Kashmir", "srinagar": "Srinagar", "gulmarg": "Gulmarg", "pahalgam": "Kashmir",
    "ladakh": "Ladakh", "leh": "Ladakh", "leh ladakh": "Ladakh",

    # ------------------- INDIA - EAST & NORTH-EAST -------------------
    "kolkata": "Kolkata", "calcutta": "Kolkata",
    "darjeeling": "Darjeeling",
    "sikkim": "Sikkim", "gangtok": "Sikkim",
    "meghalaya": "Meghalaya", "shillong": "Meghalaya",

    # ------------------- GLOBAL HOTSPOTS -------------------
    "switzerland": "Switzerland", "swiss": "Switzerland", "zurich": "Switzerland", "geneva": "Switzerland", "lucerne": "Switzerland", "interlaken": "Switzerland", "zermatt": "Switzerland",
    "paris": "Paris", "france": "Paris",
    "dubai": "Dubai", "uae": "Dubai", "abu dhabi": "Dubai",
    "bali": "Bali", "indonesia": "Bali", "ubud": "Bali",
    "maldives": "Maldives", "male": "Maldives",
    "japan": "Japan", "tokyo": "Tokyo", "kyoto": "Kyoto", "osaka": "Japan",
    "singapore": "Singapore",
    "thailand": "Thailand", "bangkok": "Bangkok", "phuket": "Thailand", "pattaya": "Thailand",
    "rome": "Rome", "italy": "Italy", "venice": "Italy", "florence": "Italy",
    "london": "London", "uk": "UK", "united kingdom": "UK", "england": "London",
    "santorini": "Santorini", "greece": "Greece", "athens": "Greece",
    "new york": "New York", "nyc": "New York", "usa": "USA", "united states": "USA", "america": "USA",
    "nepal": "Nepal", "kathmandu": "Nepal", "pokhara": "Nepal",
    "mexico": "Mexico", "cancun": "Mexico",
    "vietnam": "Vietnam", "hanoi": "Vietnam", "da nang": "Vietnam", "ho chi minh": "Vietnam",
    "malaysia": "Malaysia", "kuala lumpur": "Malaysia",
    "south korea": "South Korea", "korea": "South Korea", "seoul": "South Korea",
    "sri lanka": "Sri Lanka", "colombo": "Sri Lanka",
    "australia": "Australia", "sydney": "Australia", "melbourne": "Australia",
    "egypt": "Egypt", "cairo": "Egypt"
}

# Sort keys by descending length so multi-word keys match first
SORTED_DESTINATION_KEYS = sorted(DESTINATIONS_MAP.keys(), key=lambda k: len(k), reverse=True)

class SupervisorAgent:
    def parse_user_request(self, user_text: str) -> Dict[str, Any]:
        text = user_text.lower().strip()
        
        # 1. Detect Destination using word-boundary matching over known dictionary
        destination = None
        for k in SORTED_DESTINATION_KEYS:
            pattern = rf'(?:^|[^\w]){re.escape(k)}(?:$|[^\w])'
            if re.search(pattern, text):
                destination = DESTINATIONS_MAP[k]
                break

        # 2. If not matched, try dynamic phrase extraction for new/unlisted destinations
        if not destination:
            extraction_patterns = [
                r'(?:plan\s*(?:a\s*)?(?:trip|itinerary|vacation|holidays?|tour)?\s*(?:for|to|in|at)|trip\s*(?:to|for|in)|visit|explore|travel\s*(?:to|for|in)|guide\s*(?:to|for))\s+([a-zA-Z\s]+?)(?:\s+(?:for|under|with|in|\d+\s*day|budget|₹|\$|usd|inr|$|\.))',
                r'(?:itinerary|package|sightseeing)\s*(?:for|of|in|to)\s+([a-zA-Z\s]+?)(?:\s+(?:for|under|with|in|\d+\s*day|budget|₹|$|\.))',
                r'\b(?:in|for|to)\s+([a-zA-Z]{3,20})(?:\s+for|\s+under|\s+with|\s+trip|\s+plan|\s*\?|$)'
            ]
            for p in extraction_patterns:
                match = re.search(p, text, re.IGNORECASE)
                if match:
                    candidate = match.group(1).strip()
                    # Filter out common stop words
                    stop_words = {"a", "the", "me", "my", "our", "us", "good", "best", "some", "few", "days", "day", "budget", "trip", "tour", "vacation"}
                    words = [w for w in candidate.split() if w.lower() not in stop_words]
                    if words:
                        clean_candidate = " ".join(words).title()
                        if len(clean_candidate) >= 3:
                            destination = clean_candidate
                            break

        # Fallback destination if none detected at all
        if not destination:
            destination = "Goa"

        # 3. Detect Duration (e.g. "5 days", "5-day", "3 nights", "1 week", "weekend")
        duration = 5
        duration_match = re.search(r'(\d+)\s*(?:-|\s*)(?:day|days|d\b|night|nights)', text)
        if duration_match:
            duration = max(1, min(14, int(duration_match.group(1))))
        elif re.search(r'\b1\s*week\b|\ba\s*week\b', text):
            duration = 7
        elif re.search(r'\b2\s*weeks\b', text):
            duration = 14
        elif re.search(r'\bweekend\b', text):
            duration = 3

        # 4. Detect Budget (e.g. "₹40,000", "40k", "2 lakh", "1.5L", "25000", "under 50k")
        budget = 40000.0
        if "lakh" in text or "lac" in text or re.search(r'\d+(?:\.\d+)?\s*l\b', text):
            lakh_match = re.search(r'(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|l\b)', text)
            if lakh_match:
                try:
                    budget = float(lakh_match.group(1)) * 100000.0
                except:
                    budget = 150000.0
            else:
                budget = 150000.0
        elif re.search(r'(\d+(?:\.\d+)?)\s*k\b', text):
            k_match = re.search(r'(\d+(?:\.\d+)?)\s*k\b', text)
            if k_match:
                try:
                    budget = float(k_match.group(1)) * 1000.0
                except:
                    budget = 40000.0
        else:
            num_match = re.search(r'(?:₹|rs\.?|inr)?\s*([\d,]{4,10})', text)
            if num_match:
                try:
                    val = float(num_match.group(1).replace(",", ""))
                    if val >= 1000:
                        budget = val
                except:
                    pass

        # 5. Detect Travelers
        travelers = 2
        travelers_match = re.search(r'(\d+)\s*(?:people|persons?|travelers?|adults?|guests?|friends?|members?)', text)
        if travelers_match:
            travelers = max(1, min(10, int(travelers_match.group(1))))
        elif re.search(r'\b(?:solo|alone|myself|single)\b', text):
            travelers = 1
        elif re.search(r'\b(?:couple|with my (?:wife|husband|partner|girlfriend|boyfriend))\b', text):
            travelers = 2
        elif re.search(r'\b(?:family|with family)\b', text):
            travelers = 4

        # 6. Detect Travel Style & Interests
        interests = []
        if any(w in text for w in ["beach", "sea", "ocean", "coastal", "sand"]): interests.append("Beaches")
        if any(w in text for w in ["food", "restaurant", "culinary", "dining", "street food", "cafe"]): interests.append("Food")
        if any(w in text for w in ["nightlife", "party", "club", "pub", "bar"]): interests.append("Nightlife")
        if any(w in text for w in ["history", "fort", "heritage", "palace", "monument", "temple", "museum", "culture"]): interests.append("History")
        if any(w in text for w in ["adventure", "trek", "water sport", "hiking", "rafting", "safari"]): interests.append("Adventure")
        if any(w in text for w in ["nature", "hills", "waterfall", "mountain", "lake", "scenic", "viewpoint", "garden"]): interests.append("Nature")
        if any(w in text for w in ["luxury", "resort", "spa", "fine dining", "5 star"]): interests.append("Luxury")
        if any(w in text for w in ["relax", "peace", "calm", "leisure"]): interests.append("Relaxation")
        
        if not interests:
            interests = ["Sightseeing", "Food", "Relaxation"]

        # Travel Style
        travel_style = "Balanced"
        if any(w in text for w in ["budget", "cheap", "backpacker", "economic", "low cost"]):
            travel_style = "Budget"
        elif any(w in text for w in ["luxury", "premium", "5 star", "deluxe", "comfort"]):
            travel_style = "Luxury"

        return {
            "destination": destination,
            "duration_days": duration,
            "budget_inr": budget,
            "travelers_count": travelers,
            "travelers_label": f"{travelers} {'Adult' if travelers == 1 else 'Adults'}",
            "interests": interests,
            "travel_style": travel_style
        }

supervisor_agent = SupervisorAgent()

