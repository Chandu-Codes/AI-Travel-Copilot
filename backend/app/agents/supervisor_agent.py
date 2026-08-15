import re
from typing import Dict, Any

class SupervisorAgent:
    def parse_user_request(self, user_text: str) -> Dict[str, Any]:
        text = user_text.lower()
        
        # Detect destination
        destination = "Goa"
        destinations_map = {
            "goa": "Goa", "jaipur": "Jaipur", "kerala": "Kerala", "munnar": "Munnar",
            "kochi": "Kochi", "alleppey": "Alleppey", "manali": "Manali", "dubai": "Dubai",
            "paris": "Paris", "switzerland": "Switzerland", "bali": "Bali", "maldives": "Maldives", "japan": "Japan"
        }
        for k, v in destinations_map.items():
            if k in text:
                destination = v
                break
                
        # Detect duration (e.g. "5 day", "5-day", "3 days")
        duration = 5
        duration_match = re.search(r'(\d+)\s*(?:-|\s*)day', text)
        if duration_match:
            duration = int(duration_match.group(1))
            
        # Detect budget (e.g. "40,000", "40000", "40k", "2 lakh", "2,00,000")
        budget = 40000.0
        if "40k" in text or "40,000" in text or "40000" in text:
            budget = 40000.0
        elif "20k" in text or "20,000" in text or "20000" in text:
            budget = 20000.0
        elif "2 lakh" in text or "2,00,000" in text or "200000" in text:
            budget = 200000.0
        elif "1.5 lakh" in text or "1,50,000" in text or "150000" in text:
            budget = 150000.0
        else:
            num_match = re.search(r'₹?\s*([\d,]+)(?:\s*k|\s*thousand|\s*rupees)?', text)
            if num_match:
                try:
                    val = float(num_match.group(1).replace(",", ""))
                    if val > 1000:
                        budget = val
                except:
                    pass

        # Detect travelers
        travelers = 2
        travelers_match = re.search(r'(\d+)\s*(?:people|person|traveler|adult)', text)
        if travelers_match:
            travelers = int(travelers_match.group(1))

        # Detect travel style & interests
        interests = []
        if "beach" in text: interests.append("Beaches")
        if "food" in text or "restaurant" in text or "culinary" in text: interests.append("Food")
        if "nightlife" in text or "party" in text or "club" in text: interests.append("Nightlife")
        if "history" in text or "fort" in text or "heritage" in text: interests.append("History")
        if "adventure" in text or "trek" in text or "water sport" in text: interests.append("Adventure")
        if "nature" in text or "hills" in text or "waterfall" in text: interests.append("Nature")
        
        if not interests:
            interests = ["Sightseeing", "Food", "Relaxation"]

        return {
            "destination": destination,
            "duration_days": duration,
            "budget_inr": budget,
            "travelers_count": travelers,
            "travelers_label": f"{travelers} Adults",
            "interests": interests,
            "travel_style": "Balanced"
        }

supervisor_agent = SupervisorAgent()
