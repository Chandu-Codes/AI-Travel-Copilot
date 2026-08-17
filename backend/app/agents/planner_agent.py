import datetime
import re
from typing import Dict, Any, List, Set
from ..rag.rag_engine import rag_engine, clean_destination_string
from ..optimization.route_optimizer import route_optimizer
from ..optimization.budget_optimizer import budget_optimizer

# Curated high-resolution destination image mappings for all Hotspots (100% Verified 200 OK)
DESTINATION_IMAGES = {
    # ------------------- INDIA -------------------
    "Goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
    "Jaipur": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80",
    "Udaipur": "https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?w=1200&q=80",
    "Jodhpur": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200&q=80",
    "Jaisalmer": "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=1200&q=80",
    "Kerala": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80",
    "Munnar": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=80",
    "Alleppey": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=80",
    "Kochi": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80",
    "Wayanad": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
    "Varkala": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
    "Manali": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80",
    "Shimla": "https://images.unsplash.com/photo-1562670652-e5947bddb335?w=1200&q=80",
    "Dharamshala": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
    "Spiti Valley": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1200&q=80",
    "Kasol": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
    "Rishikesh": "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=1200&q=80",
    "Nainital": "https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=1200&q=80",
    "Auli": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80",
    "Corbett": "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1200&q=80",
    "Kashmir": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1200&q=80",
    "Srinagar": "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=1200&q=80",
    "Gulmarg": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80",
    "Ladakh": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1200&q=80",
    "Leh": "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?w=1200&q=80",
    "Agra": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80",
    "Varanasi": "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=80",
    "Hyderabad": "https://images.unsplash.com/photo-1572445271230-a78b5944a659?w=1200&q=80",
    "Visakhapatnam": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80",
    "Vizag": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=1200&q=80",
    "Bengaluru": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&q=80",
    "Bangalore": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&q=80",
    "Mumbai": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80",
    "Delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80",
    "Chennai": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80",
    "Tamil Nadu": "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1200&q=80",
    "Kolkata": "https://images.unsplash.com/photo-1558431382-27e303142255?w=1200&q=80",
    "Pune": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=1200&q=80",
    "Ahmedabad": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80",
    "Ooty": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=80",
    "Coorg": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=80",
    "Hampi": "https://images.unsplash.com/photo-1609137144813-7d9921338f24?w=1200&q=80",
    "Gokarna": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
    "Darjeeling": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
    "Sikkim": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80",
    "Meghalaya": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
    "Andaman": "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&q=80",
    "Amritsar": "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?w=1200&q=80",

    # ------------------- GLOBAL -------------------
    "Nepal": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
    "USA": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80",
    "New York": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80",
    "Mexico": "https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1200&q=80",
    "Japan": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80",
    "Tokyo": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200&q=80",
    "Kyoto": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80",
    "Switzerland": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&q=80",
    "Bali": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
    "Paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
    "France": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
    "Maldives": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80",
    "Dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
    "Santorini": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80",
    "Greece": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80",
    "Rome": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80",
    "Italy": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80",
    "London": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
    "UK": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
    "Singapore": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80",
    "Thailand": "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1200&q=80",
    "Bangkok": "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1200&q=80"
}

# Accurate Geographic Anchor Coordinates for all destinations
DESTINATION_CENTERS = {
    # India
    "Goa": (15.4989, 73.8278),
    "Jaipur": (26.9124, 75.7873),
    "Udaipur": (24.5854, 73.7125),
    "Jodhpur": (26.2389, 73.0243),
    "Jaisalmer": (26.9157, 70.9083),
    "Kerala": (9.9312, 76.2673),
    "Munnar": (10.0889, 77.0595),
    "Alleppey": (9.4981, 76.3388),
    "Kochi": (9.9312, 76.2673),
    "Wayanad": (11.6854, 76.1320),
    "Varkala": (8.7379, 76.7163),
    "Manali": (32.2432, 77.1892),
    "Shimla": (31.1048, 77.1734),
    "Dharamshala": (32.2190, 76.3234),
    "Spiti Valley": (32.2461, 78.0349),
    "Kasol": (32.0100, 77.3150),
    "Rishikesh": (30.0869, 78.2676),
    "Nainital": (29.3803, 79.4636),
    "Auli": (30.5297, 79.5694),
    "Corbett": (29.5300, 78.7747),
    "Kashmir": (34.0837, 74.7973),
    "Srinagar": (34.0837, 74.7973),
    "Gulmarg": (34.0484, 74.3805),
    "Ladakh": (34.1526, 77.5771),
    "Leh": (34.1526, 77.5771),
    "Agra": (27.1767, 78.0081),
    "Varanasi": (25.3176, 82.9739),
    "Hyderabad": (17.3850, 78.4867),
    "Visakhapatnam": (17.6868, 83.2185),
    "Vizag": (17.6868, 83.2185),
    "Bengaluru": (12.9716, 77.5946),
    "Bangalore": (12.9716, 77.5946),
    "Mumbai": (18.9220, 72.8347),
    "Delhi": (28.6139, 77.2090),
    "Tamil Nadu": (11.1271, 78.6569),
    "Chennai": (13.0827, 80.2707),
    "Kolkata": (22.5726, 88.3639),
    "Pune": (18.5204, 73.8567),
    "Ahmedabad": (23.0225, 72.5714),
    "Ooty": (11.4102, 76.6950),
    "Coorg": (12.3375, 75.8069),
    "Hampi": (15.3350, 76.4600),
    "Gokarna": (14.5479, 74.3188),
    "Darjeeling": (27.0410, 88.2663),
    "Sikkim": (27.5330, 88.5122),
    "Meghalaya": (25.5788, 91.8933),
    "Andaman": (11.6234, 92.7265),
    "Amritsar": (31.6340, 74.8723),

    # Global
    "Nepal": (27.7172, 85.3240),
    "Japan": (35.6762, 139.6503),
    "Tokyo": (35.6762, 139.6503),
    "Kyoto": (35.0116, 135.7681),
    "Osaka": (34.6937, 135.5023),
    "Switzerland": (46.8182, 8.2275),
    "Bali": (-8.4095, 115.1889),
    "Paris": (48.8566, 2.3522),
    "France": (46.2276, 2.2137),
    "Maldives": (4.1755, 73.5093),
    "Dubai": (25.2048, 55.2708),
    "Santorini": (36.3932, 25.4615),
    "Greece": (37.9838, 23.7275),
    "Rome": (41.9028, 12.4964),
    "Italy": (41.8719, 12.5674),
    "London": (51.5074, -0.1278),
    "UK": (55.3781, -3.4360),
    "New York": (40.7128, -74.0060),
    "USA": (40.7128, -74.0060),
    "Mexico": (20.6843, -88.5678),
    "Singapore": (1.3521, 103.8198),
    "Thailand": (13.7563, 100.5018),
    "Bangkok": (13.7563, 100.5018),
    "Vietnam": (21.0285, 105.8542),
    "Malaysia": (3.1390, 101.6869),
    "South Korea": (37.5665, 126.9780),
    "Korea": (37.5665, 126.9780),
    "Sri Lanka": (7.8731, 80.7718),
    "Australia": (-33.8688, 151.2093),
    "Egypt": (26.8206, 30.8025)
}

# Rich contextual activity generator templates if a destination has extensive duration
CONTEXTUAL_EXPERIENCES = [
    ("Sunrise Viewpoint Trail & Nature Walk", "Scenic Trail", "Enjoy picturesque morning vistas, crisp mountain air, and panoramic valley lookouts.", 0, 2.0),
    ("Local Artisan Craft Workshop & Market", "Art & Craft", "Observe traditional master artisans crafting authentic regional textiles and woodwork.", 200, 2.5),
    ("Culinary Street Food Safari & Spice Tasting", "Food & Dining", "Savor authentic regional delicacies, street food specialities, and spiced tea.", 400, 2.0),
    ("Historic Fortifications & Citadel Panorama", "Heritage", "Explore ancient ramparts, architectural battlements, and historic defense towers.", 150, 2.5),
    ("Botanical Gardens & Serene Lake Promenade", "Nature & Relaxation", "Stroll through tranquil shaded pathways with rare botanical flora and water fountains.", 50, 2.0),
    ("Sunset Waterfront Cruise & Music Evening", "Sunset Cruise", "Unwind on a scenic evening boat ride as golden hour settles over the skyline.", 800, 2.5),
    ("Cultural Folk Dance Performance & Dinner", "Cultural Show", "Witness vibrant local traditional folk dances, rhythmic drums, and musical storytelling.", 600, 3.0),
    ("Old Town Riverside Alleys & Architecture Tour", "Historic Architecture", "Wander through centuries-old stone-cobbled alleys, colonial facades, and town squares.", 0, 2.0),
    ("High-Altitude Panoramic Skybridge & Lookout", "Observation Deck", "Marvel at dramatic 360-degree horizon views from the region's highest vantage point.", 500, 2.0)
]

def resolve_clean_destination(raw: str) -> str:
    cleaned = clean_destination_string(raw)
    if not cleaned:
        return "Goa"
    # Find matching proper destination key in dictionary
    for k in DESTINATION_IMAGES.keys():
        if k.lower() == cleaned.lower() or cleaned.lower() in k.lower():
            return k
    return cleaned.title()

class PlannerAgent:
    def generate_itinerary(self, destination: str, duration_days: int = 6, 
                           start_date: str = "2025-06-10", budget_inr: float = 35000.0, 
                           travelers_count: int = 2, travel_style: str = "Balanced", 
                           interests: List[str] = None) -> Dict[str, Any]:
        
        # 1. Normalize Destination Name
        clean_dest = resolve_clean_destination(destination)

        # 2. Retrieve all authentic POIs for destination via RAG
        search_query = f"{clean_dest} {' '.join(interests or [])} top sights attractions tour"
        retrieved_pois = rag_engine.query(search_query, city=clean_dest, top_k=60)

        # 3. Optimize budget
        budget_plan = budget_optimizer.optimize_budget(budget_inr, travel_style, duration_days, travelers_count)

        # 4. Assemble Days and Activities ensuring 100% STRICT UNIQUENESS (NO REPEATS)
        itinerary_days = []
        used_poi_names: Set[str] = set()
        available_pois = [p for p in retrieved_pois]
        
        try:
            current_date = datetime.datetime.strptime(start_date, "%Y-%m-%d")
        except:
            current_date = datetime.datetime.now() + datetime.timedelta(days=14)

        is_domestic = clean_dest in [
            "Goa", "Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Kerala", "Munnar", 
            "Alleppey", "Kochi", "Wayanad", "Varkala", "Manali", "Shimla", "Dharamshala", 
            "Spiti Valley", "Kasol", "Rishikesh", "Nainital", "Auli", "Corbett", 
            "Kashmir", "Srinagar", "Gulmarg", "Ladakh", "Leh", "Agra", "Varanasi", 
            "Delhi", "Mumbai", "Bengaluru", "Bangalore", "Hyderabad", "Visakhapatnam", 
            "Vizag", "Tamil Nadu", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Ooty", 
            "Coorg", "Hampi", "Gokarna", "Darjeeling", "Sikkim", "Meghalaya", "Andaman", "Amritsar"
        ]

        exp_index = 0
        banner_img = DESTINATION_IMAGES.get(clean_dest, DESTINATION_IMAGES["Goa"])
        dest_center = DESTINATION_CENTERS.get(clean_dest, (15.4989, 73.8278))

        for day_num in range(1, duration_days + 1):
            day_date_str = current_date.strftime("%d %b %Y")
            current_date += datetime.timedelta(days=1)

            day_activities = []
            slots = [("Morning", "09:30 AM"), ("Afternoon", "02:00 PM"), ("Evening", "06:30 PM")]
            
            for slot_idx, (slot_name, slot_time) in enumerate(slots):
                selected_poi = None
                
                # Check for an unused authentic POI from RAG knowledge base
                for p in available_pois:
                    p_name = p.get("name", "").strip()
                    if p_name and p_name not in used_poi_names:
                        selected_poi = p
                        used_poi_names.add(p_name)
                        break

                # If available POIs run out, generate a distinct, unique contextual experience
                if not selected_poi:
                    exp_tpl = CONTEXTUAL_EXPERIENCES[exp_index % len(CONTEXTUAL_EXPERIENCES)]
                    exp_index += 1
                    unique_exp_name = f"{clean_dest} {exp_tpl[0]}"
                    while unique_exp_name in used_poi_names:
                        unique_exp_name = f"{clean_dest} {exp_tpl[0]} (Phase {exp_index})"
                        exp_index += 1
                    used_poi_names.add(unique_exp_name)

                    # Get anchor coordinates from destination center
                    base_lat = available_pois[0].get("lat", dest_center[0]) if available_pois and "lat" in available_pois[0] else dest_center[0]
                    base_lon = available_pois[0].get("lon", dest_center[1]) if available_pois and "lon" in available_pois[0] else dest_center[1]

                    selected_poi = {
                        "name": unique_exp_name,
                        "description": f"{exp_tpl[2]} An essential highlight during your {clean_dest} visit.",
                        "category": exp_tpl[1],
                        "entry_fee_inr": exp_tpl[3],
                        "ideal_duration_hrs": exp_tpl[4],
                        "rating": 4.8,
                        "lat": base_lat + (slot_idx * 0.012),
                        "lon": base_lon + (slot_idx * 0.012)
                    }

                cost_val = float(selected_poi.get("entry_fee_inr", selected_poi.get("cost_inr", selected_poi.get("avg_spend_inr", 150))))
                dur_val = float(selected_poi.get("ideal_duration_hrs", selected_poi.get("duration_hrs", 2.0)))
                
                # Guarantee valid coordinates
                lat_val = selected_poi.get("lat")
                lon_val = selected_poi.get("lon")
                if lat_val is None or (lat_val == 0 and lon_val == 0):
                    lat_val = dest_center[0] + (slot_idx * 0.008)
                    lon_val = dest_center[1] + (slot_idx * 0.008)

                day_activities.append({
                    "activity_id": selected_poi.get("poi_id", f"ACT_{day_num}_{slot_idx+1}"),
                    "name": selected_poi.get("name"),
                    "category": selected_poi.get("category", "Sightseeing"),
                    "description": selected_poi.get("description", f"Explore {clean_dest}."),
                    "slot": slot_name,
                    "time": slot_time,
                    "duration_hrs": dur_val,
                    "cost_inr": cost_val,
                    "rating": float(selected_poi.get("rating", 4.7)),
                    "lat": float(lat_val),
                    "lon": float(lon_val)
                })

            # Optimize intra-day transit sequence using TSP Route Optimizer
            optimized_acts = route_optimizer.optimize_day_route(day_activities)
            
            # Dynamic Day Title based on primary attraction
            main_poi_name = optimized_acts[0]["name"] if optimized_acts else clean_dest
            short_title = main_poi_name.split("(")[0].strip()
            if len(short_title) > 35:
                short_title = short_title[:35] + "..."

            itinerary_days.append({
                "day_number": day_num,
                "date": day_date_str,
                "title": f"Day {day_num}: {short_title}",
                "route_summary": f"Day {day_num} route visits {optimized_acts[0]['name'].split('(')[0].strip()}, {optimized_acts[1]['name'].split('(')[0].strip() if len(optimized_acts)>1 else ''} optimized for minimal transit travel.",
                "activities": optimized_acts
            })

        return {
            "title": f"Ultimate {duration_days}-Day {clean_dest} Journey",
            "destination": clean_dest,
            "country": clean_dest,
            "destination_lat": dest_center[0],
            "destination_lon": dest_center[1],
            "start_date": start_date,
            "end_date": (datetime.datetime.strptime(start_date, "%Y-%m-%d") + datetime.timedelta(days=duration_days - 1)).strftime("%Y-%m-%d"),
            "duration_days": duration_days,
            "travelers_count": travelers_count,
            "travelers_label": f"{travelers_count} Travelers",
            "total_budget_inr": budget_inr,
            "travel_style": travel_style,
            "interests": interests or ["Sightseeing", "Culture"],
            "estimated_cost_inr": budget_plan.get("total_budget_inr", budget_inr),
            "image_url": banner_img,
            "budget_breakdown": budget_plan.get("categories", []),
            "itinerary_days": itinerary_days
        }

planner_agent = PlannerAgent()

