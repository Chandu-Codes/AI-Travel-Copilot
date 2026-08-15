from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/weather", tags=["Weather & Alerts"])

CITY_WEATHER_DATA = {
    "goa": {
        "city": "Goa, India",
        "current_temp_c": 29,
        "condition": "Tropical / Sunny",
        "rain_probability_pct": 20,
        "humidity_pct": 74,
        "wind_speed_kmh": 14,
        "clothing_tip": "Light cottons, sunglasses, swimwear, and sunscreen.",
        "forecast_5_days": [
            {"day": "Mon", "temp_c": 29, "condition": "Sunny", "rain_pct": 10},
            {"day": "Tue", "temp_c": 30, "condition": "Partly Cloudy", "rain_pct": 20},
            {"day": "Wed", "temp_c": 28, "condition": "Scattered Showers", "rain_pct": 45},
            {"day": "Thu", "temp_c": 29, "condition": "Sunny", "rain_pct": 15},
            {"day": "Fri", "temp_c": 31, "condition": "Sunny", "rain_pct": 5}
        ]
    },
    "manali": {
        "city": "Manali, Himachal Pradesh",
        "current_temp_c": 14,
        "condition": "Crisp Mountain Breeze",
        "rain_probability_pct": 10,
        "humidity_pct": 50,
        "wind_speed_kmh": 12,
        "clothing_tip": "Warm fleece jacket, thermals for Rohtang/Solang, and comfortable trekking boots.",
        "forecast_5_days": [
            {"day": "Mon", "temp_c": 15, "condition": "Sunny Mountain", "rain_pct": 5},
            {"day": "Tue", "temp_c": 13, "condition": "Crisp / Clear", "rain_pct": 10},
            {"day": "Wed", "temp_c": 12, "condition": "Light Mist", "rain_pct": 25},
            {"day": "Thu", "temp_c": 14, "condition": "Sunny", "rain_pct": 0},
            {"day": "Fri", "temp_c": 16, "condition": "Sunny / Clear", "rain_pct": 5}
        ]
    },
    "paris": {
        "city": "Paris, France",
        "current_temp_c": 21,
        "condition": "Pleasant / Mild",
        "rain_probability_pct": 15,
        "humidity_pct": 58,
        "wind_speed_kmh": 10,
        "clothing_tip": "Smart-casual layers, light trench coat, and comfortable walking shoes for cobblestones.",
        "forecast_5_days": [
            {"day": "Mon", "temp_c": 22, "condition": "Sunny", "rain_pct": 10},
            {"day": "Tue", "temp_c": 20, "condition": "Partly Cloudy", "rain_pct": 20},
            {"day": "Wed", "temp_c": 19, "condition": "Scattered Rain", "rain_pct": 40},
            {"day": "Thu", "temp_c": 21, "condition": "Sunny", "rain_pct": 10},
            {"day": "Fri", "temp_c": 23, "condition": "Clear Blue", "rain_pct": 5}
        ]
    },
    "switzerland": {
        "city": "Zurich & Interlaken, Switzerland",
        "current_temp_c": 17,
        "condition": "Alpine Sun",
        "rain_probability_pct": 15,
        "humidity_pct": 55,
        "wind_speed_kmh": 9,
        "clothing_tip": "Waterproof windbreaker, sturdy hiking boots, sunglasses, and warm layers for peaks.",
        "forecast_5_days": [
            {"day": "Mon", "temp_c": 18, "condition": "Sunny Alpine", "rain_pct": 10},
            {"day": "Tue", "temp_c": 17, "condition": "Partly Cloudy", "rain_pct": 15},
            {"day": "Wed", "temp_c": 15, "condition": "Light Rain", "rain_pct": 50},
            {"day": "Thu", "temp_c": 17, "condition": "Sunny", "rain_pct": 10},
            {"day": "Fri", "temp_c": 19, "condition": "Clear / Sunny", "rain_pct": 5}
        ]
    },
    "jaipur": {
        "city": "Jaipur, Rajasthan",
        "current_temp_c": 31,
        "condition": "Sunny / Dry",
        "rain_probability_pct": 5,
        "humidity_pct": 40,
        "wind_speed_kmh": 11,
        "clothing_tip": "Breathable cottons, wide-brim hat, sunscreen, and scarf for fort visits.",
        "forecast_5_days": [
            {"day": "Mon", "temp_c": 32, "condition": "Sunny", "rain_pct": 0},
            {"day": "Tue", "temp_c": 33, "condition": "Clear", "rain_pct": 5},
            {"day": "Wed", "temp_c": 31, "condition": "Sunny", "rain_pct": 0},
            {"day": "Thu", "temp_c": 30, "condition": "Clear", "rain_pct": 0},
            {"day": "Fri", "temp_c": 32, "condition": "Sunny", "rain_pct": 5}
        ]
    },
    "kerala": {
        "city": "Munnar & Alleppey, Kerala",
        "current_temp_c": 26,
        "condition": "Tropical Green Breeze",
        "rain_probability_pct": 25,
        "humidity_pct": 78,
        "wind_speed_kmh": 10,
        "clothing_tip": "Light breathable shirts, umbrella for mist showers, and comfortable backwater footwear.",
        "forecast_5_days": [
            {"day": "Mon", "temp_c": 26, "condition": "Partly Sunny", "rain_pct": 20},
            {"day": "Tue", "temp_c": 27, "condition": "Gentle Showers", "rain_pct": 40},
            {"day": "Wed", "temp_c": 25, "condition": "Mist / Overcast", "rain_pct": 30},
            {"day": "Thu", "temp_c": 26, "condition": "Sunny", "rain_pct": 15},
            {"day": "Fri", "temp_c": 28, "condition": "Clear", "rain_pct": 10}
        ]
    },
    "japan": {
        "city": "Tokyo & Kyoto, Japan",
        "current_temp_c": 22,
        "condition": "Clear Spring Sky",
        "rain_probability_pct": 10,
        "humidity_pct": 52,
        "wind_speed_kmh": 8,
        "clothing_tip": "Layered jacket, comfortable slip-on shoes for temple visits, and pocket umbrella.",
        "forecast_5_days": [
            {"day": "Mon", "temp_c": 22, "condition": "Sunny", "rain_pct": 10},
            {"day": "Tue", "temp_c": 23, "condition": "Clear", "rain_pct": 5},
            {"day": "Wed", "temp_c": 20, "condition": "Partly Cloudy", "rain_pct": 25},
            {"day": "Thu", "temp_c": 21, "condition": "Sunny", "rain_pct": 5},
            {"day": "Fri", "temp_c": 24, "condition": "Sunny", "rain_pct": 0}
        ]
    },
    "bali": {
        "city": "Ubud & Kuta, Bali",
        "current_temp_c": 28,
        "condition": "Tropical Warmth",
        "rain_probability_pct": 20,
        "humidity_pct": 72,
        "wind_speed_kmh": 12,
        "clothing_tip": "Light linens, swimwear, sarong for temple visits, and sandals.",
        "forecast_5_days": [
            {"day": "Mon", "temp_c": 28, "condition": "Sunny", "rain_pct": 10},
            {"day": "Tue", "temp_c": 29, "condition": "Partly Cloudy", "rain_pct": 20},
            {"day": "Wed", "temp_c": 27, "condition": "Short Tropical Shower", "rain_pct": 35},
            {"day": "Thu", "temp_c": 28, "condition": "Sunny", "rain_pct": 15},
            {"day": "Fri", "temp_c": 30, "condition": "Sunny Beach Day", "rain_pct": 10}
        ]
    },
    "ladakh": {
        "city": "Leh, Ladakh",
        "current_temp_c": 11,
        "condition": "High-Altitude Crisp Sun",
        "rain_probability_pct": 0,
        "humidity_pct": 25,
        "wind_speed_kmh": 15,
        "clothing_tip": "Heavy winter jacket, UV-protected sunglasses, high SPF sunscreen, lip balm, and hydration pack.",
        "forecast_5_days": [
            {"day": "Mon", "temp_c": 12, "condition": "Bright Sun", "rain_pct": 0},
            {"day": "Tue", "temp_c": 10, "condition": "Clear Blue Sky", "rain_pct": 0},
            {"day": "Wed", "temp_c": 9, "condition": "Cold Breeze", "rain_pct": 5},
            {"day": "Thu", "temp_c": 11, "condition": "Sunny", "rain_pct": 0},
            {"day": "Fri", "temp_c": 13, "condition": "Clear", "rain_pct": 0}
        ]
    }
}

@router.get("")
def get_destination_weather(destination: str = "Goa") -> Dict[str, Any]:
    dest_clean = destination.strip().lower()
    dest_key = None
    for k in CITY_WEATHER_DATA:
        if k in dest_clean or dest_clean in k:
            dest_key = k
            break
            
    if dest_key:
        weather_info = CITY_WEATHER_DATA[dest_key]
    else:
        # Dynamic fallback for any other city
        weather_info = {
            "city": f"{destination.title()}, Tourism Region",
            "current_temp_c": 24,
            "condition": "Fair / Pleasant",
            "rain_probability_pct": 15,
            "humidity_pct": 60,
            "wind_speed_kmh": 10,
            "clothing_tip": "Comfortable travel clothing, light jacket for evenings, and walking shoes.",
            "forecast_5_days": [
                {"day": "Mon", "temp_c": 25, "condition": "Sunny", "rain_pct": 10},
                {"day": "Tue", "temp_c": 24, "condition": "Partly Cloudy", "rain_pct": 15},
                {"day": "Wed", "temp_c": 23, "condition": "Clear", "rain_pct": 5},
                {"day": "Thu", "temp_c": 24, "condition": "Sunny", "rain_pct": 10},
                {"day": "Fri", "temp_c": 26, "condition": "Pleasant", "rain_pct": 10}
            ]
        }
    
    indoor_recommendation = None
    if weather_info["rain_probability_pct"] >= 40:
        indoor_recommendation = {
            "advisory": f"Rain detected in {destination.title()}. AI Planner recommends indoor heritage museums or cafe tours.",
            "indoor_alternatives": [f"{destination.title()} Heritage Museum", f"{destination.title()} Art Gallery & Cafe", "Cultural Artisan Centre"]
        }
        
    return {
        "weather": weather_info,
        "indoor_rerouting": indoor_recommendation
    }
