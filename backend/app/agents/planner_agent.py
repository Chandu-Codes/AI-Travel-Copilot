import datetime
from typing import Dict, Any, List, Set
from ..rag.rag_engine import rag_engine
from ..optimization.route_optimizer import route_optimizer
from ..optimization.budget_optimizer import budget_optimizer

# Curated high-resolution destination image mappings for all Indian and International Hotspots
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
    "Dharamshala": "https://images.unsplash.com/photo-1582650625119-3a31f841839d?w=1200&q=80",
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
    "Delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80",
    "Mumbai": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80",
    "Bangalore": "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&q=80",
    "Hyderabad": "https://images.unsplash.com/photo-1605649487212-47bdab064df8?w=1200&q=80",
    "Ooty": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1200&q=80",
    "Coorg": "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=1200&q=80",
    "Hampi": "https://images.unsplash.com/photo-1600100397608-f010f443b708?w=1200&q=80",
    "Gokarna": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80",
    "Darjeeling": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
    "Sikkim": "https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80",
    "Meghalaya": "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200&q=80",
    "Andaman": "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=1200&q=80",
    "Amritsar": "https://images.unsplash.com/photo-1588096344356-9a2c3a504381?w=1200&q=80",

    # ------------------- GLOBAL -------------------
    "Japan": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&q=80",
    "Switzerland": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=1200&q=80",
    "Bali": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&q=80",
    "Paris": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=80",
    "Maldives": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200&q=80",
    "Dubai": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200&q=80",
    "Santorini": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80",
    "Rome": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80",
    "London": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80",
    "New York": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80",
    "Singapore": "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80",
    "Thailand": "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=1200&q=80"
}

# Thematic daily archetypes for unique multi-day trip sequencing
DAY_THEMES = [
    {
        "theme": "Historic Landmarks & Cultural Heritage",
        "title_suffix": "Heritage, Ancient Quarters & Iconic Sights",
        "morning": ("Historic Old Town & Ancient Landmark", "Walk through historic squares, stone gates, and ancient monuments.", "Heritage & Culture", 150, 2.5),
        "afternoon": ("Grand Palace & National Heritage Museum", "Explore royal halls, historical artifacts, and classical architecture.", "History & Museums", 250, 2.5),
        "evening": ("Heritage Bazaar & Traditional Street Walk", "Stroll through lantern-lit artisan lanes and sample traditional delicacies.", "Culture & Food", 200, 2.0)
    },
    {
        "theme": "Panoramic Horizons & Scenic Vistas",
        "title_suffix": "Skyline Viewpoints, Towers & Scenic Districts",
        "morning": ("Iconic Observation Deck & Cable Car Viewpoint", "Ascend to panoramic observation towers for 360-degree vistas across the region.", "Skyline & Views", 600, 2.5),
        "afternoon": ("Futuristic Design & Contemporary Art Hub", "Discover cutting-edge interactive installations, architectural marvels, and modern galleries.", "Modern Arts & Tech", 400, 2.5),
        "evening": ("Illuminated Promenade & Waterfront Plaza", "Enjoy vibrant evening city lights, waterfront dining, and modern plazas.", "Nightlife & Dining", 300, 2.0)
    },
    {
        "theme": "Nature, Waterfalls & Mountain Landscapes",
        "title_suffix": "Natural Landscapes, Botanical Wonders & Valleys",
        "morning": ("Lush Botanical Gardens & Nature Valley Trail", "Morning trek through tranquil gardens, tea plantations, and scenic nature paths.", "Nature & Scenery", 100, 3.0),
        "afternoon": ("Cascading Waterfalls & Pine Valley Walk", "Witness majestic mountain waterfalls and picturesque suspension bridges.", "Adventure & Nature", 200, 2.5),
        "evening": ("Sunset Hilltop & Valley Overlook", "Watch golden hour across valleys and mountain ridges with artisan snacks.", "Scenic Sunset", 100, 2.0)
    },
    {
        "theme": "Culinary Journey & Local Gastronomy",
        "title_suffix": "Gourmet Markets, Street Food & Culinary Secrets",
        "morning": ("Famous Central Morning Food Market", "Taste fresh local produce, artisan breakfast specialties, and farm cheeses.", "Culinary & Markets", 300, 2.5),
        "afternoon": ("Spice Plantation & Artisan Masterclass", "Learn traditional spice blending and authentic recipe preparation with local experts.", "Culinary & Workshop", 600, 2.5),
        "evening": ("Atmospheric Food Alley & Night Market Crawl", "Sample iconic street delicacies, regional platters, and specialty desserts.", "Food Tour", 400, 2.5)
    },
    {
        "theme": "Lakes, Coastlines & Waterway Adventures",
        "title_suffix": "Waterfront Harbor, Boat Cruises & Coastal Bays",
        "morning": ("Scenic Coastal Bay & Island Ferry", "Cruise along sparkling waters past caves, lighthouse bluffs, and fishing harbors.", "Marine & Scenic", 500, 3.0),
        "afternoon": ("Beachfront Relaxation & Watersport Coves", "Enjoy snorkeling, swimming in calm waters, or paddleboarding along pristine shores.", "Beach & Watersports", 800, 2.5),
        "evening": ("Sunset Boat Cruise & Local Feast", "Sail into the sunset with chilled beverages, live acoustic music, and fresh local dinners.", "Sunset Cruise", 900, 2.5)
    }
]

class PlannerAgent:
    def generate_itinerary(self, destination: str, duration_days: int = 5, 
                           start_date: str = "2025-06-10", budget_inr: float = 35000.0, 
                           travelers_count: int = 2, travel_style: str = "Balanced", 
                           interests: List[str] = None) -> Dict[str, Any]:
        
        # 1. Retrieve all authentic POIs for destination via RAG
        search_query = f"{destination} {' '.join(interests or [])} top sights attractions tour"
        retrieved_pois = rag_engine.query(search_query, city=destination, top_k=40)

        # 2. Optimize budget
        budget_plan = budget_optimizer.optimize_budget(budget_inr, travel_style, duration_days, travelers_count)

        # 3. Assemble Days and Activities with Strict Non-Repetition
        itinerary_days = []
        used_poi_names: Set[str] = set()
        available_pois = [p for p in retrieved_pois]
        
        try:
            current_date = datetime.datetime.strptime(start_date, "%Y-%m-%d")
        except:
            current_date = datetime.datetime.now() + datetime.timedelta(days=14)

        is_domestic = destination in [
            "Goa", "Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Kerala", "Munnar", 
            "Alleppey", "Kochi", "Wayanad", "Varkala", "Manali", "Shimla", "Dharamshala", 
            "Spiti Valley", "Kasol", "Rishikesh", "Nainital", "Auli", "Corbett", 
            "Kashmir", "Srinagar", "Gulmarg", "Ladakh", "Leh", "Agra", "Varanasi", 
            "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Ooty", "Coorg", "Hampi", 
            "Gokarna", "Darjeeling", "Sikkim", "Meghalaya", "Andaman", "Amritsar"
        ]

        for day_num in range(1, duration_days + 1):
            day_date_str = current_date.strftime("%d %b %Y")
            current_date += datetime.timedelta(days=1)

            # Assign theme for the day
            theme_info = DAY_THEMES[(day_num - 1) % len(DAY_THEMES)]
            day_activities = []
            slots = [("Morning", "09:30 AM"), ("Afternoon", "02:00 PM"), ("Evening", "06:30 PM")]
            
            for slot_idx, (slot_name, slot_time) in enumerate(slots):
                selected_poi = None
                
                # Check if we have an unused authentic POI from RAG
                for p in available_pois:
                    p_name = p.get("name", "").strip()
                    if p_name and p_name not in used_poi_names:
                        selected_poi = p
                        used_poi_names.add(p_name)
                        break

                # If no unused RAG POI is left, generate a unique themed activity
                if not selected_poi:
                    if slot_idx == 0:
                        tpl = theme_info["morning"]
                    elif slot_idx == 1:
                        tpl = theme_info["afternoon"]
                    else:
                        tpl = theme_info["evening"]

                    synth_name = f"{destination} {tpl[0]}"
                    if synth_name in used_poi_names:
                        synth_name = f"{destination} {tpl[0]} (Day {day_num} Highlight)"
                    used_poi_names.add(synth_name)

                    selected_poi = {
                        "name": synth_name,
                        "description": f"{tpl[1]} Specially curated for Day {day_num} of your {destination} tour.",
                        "category": tpl[2],
                        "cost_inr": tpl[3],
                        "ideal_duration_hrs": tpl[4],
                        "rating": round(4.6 + (day_num * 0.05) % 0.4, 1),
                        "lat": 15.5000 + (day_num * 0.02) + (slot_idx * 0.01),
                        "lon": 73.8000 + (day_num * 0.02) + (slot_idx * 0.01)
                    }

                activity = {
                    "order_index": len(day_activities),
                    "time_slot": slot_name,
                    "name": selected_poi.get("name", f"Explore {destination}"),
                    "description": selected_poi.get("description", f"Visit famous attractions in {destination}"),
                    "category": selected_poi.get("category", "Sightseeing"),
                    "cost_inr": float(selected_poi.get("cost_inr", selected_poi.get("entry_fee_inr", 150))),
                    "duration_hrs": float(selected_poi.get("ideal_duration_hrs", 2.0)),
                    "rating": float(selected_poi.get("rating", 4.7)),
                    "lat": float(selected_poi.get("lat", 0.0)),
                    "lon": float(selected_poi.get("lon", 0.0)),
                    "image_url": DESTINATION_IMAGES.get(destination, DESTINATION_IMAGES.get(selected_poi.get("city"), DESTINATION_IMAGES["Goa"])),
                    "location_name": f"{selected_poi.get('name')}, {destination}"
                }
                day_activities.append(activity)

            # Optimize the day's route via TSP
            optimized_activities = route_optimizer.optimize_daily_sequence(day_activities)

            # Day Title reflects the actual primary attraction visited on that day
            main_attraction = day_activities[0]['name'].split('&')[0].strip()
            itinerary_days.append({
                "day_number": day_num,
                "title": f"Day {day_num}: {main_attraction} & {theme_info['title_suffix']}",
                "theme": f"{theme_info['theme']} in {destination}",
                "description": f"Day {day_num} focuses on {theme_info['theme'].lower()} across {destination} with non-repeating morning, afternoon, and evening highlights.",
                "date_str": day_date_str,
                "activities": optimized_activities
            })

        banner_img = DESTINATION_IMAGES.get(destination, DESTINATION_IMAGES["Goa"])

        return {
            "title": f"{destination} Vacation Tour",
            "destination": destination,
            "country": "India" if is_domestic else "International",
            "start_date": start_date,
            "end_date": (current_date - datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
            "duration_days": duration_days,
            "travelers_count": travelers_count,
            "travelers_label": f"{travelers_count} Adults",
            "total_budget_inr": budget_inr,
            "estimated_cost_inr": budget_plan["total_estimated_inr"],
            "travel_style": travel_style,
            "interests": interests or ["Sightseeing", "Food", "Heritage"],
            "image_url": banner_img,
            "status": "upcoming",
            "itinerary_days": itinerary_days,
            "budget_breakdown": budget_plan
        }

planner_agent = PlannerAgent()
