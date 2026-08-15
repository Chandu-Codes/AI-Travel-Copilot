from fastapi import APIRouter
from typing import Dict, Any

router = APIRouter(prefix="/weather", tags=["Weather & Alerts"])

CITY_WEATHER_DATA = {
    "Goa": {
        "city": "Goa, India",
        "current_temp_c": 29,
        "condition": "Partly Cloudy",
        "rain_probability_pct": 20,
        "humidity_pct": 74,
        "wind_speed_kmh": 14,
        "alert": None,
        "forecast_5_days": [
            {"day": "Mon", "temp_c": 29, "condition": "Sunny", "rain_pct": 10},
            {"day": "Tue", "temp_c": 30, "condition": "Partly Cloudy", "rain_pct": 20},
            {"day": "Wed", "temp_c": 28, "condition": "Scattered Showers", "rain_pct": 45},
            {"day": "Thu", "temp_c": 29, "condition": "Sunny", "rain_pct": 15},
            {"day": "Fri", "temp_c": 31, "condition": "Sunny", "rain_pct": 5}
        ]
    },
    "Jaipur": {
        "city": "Jaipur, India",
        "current_temp_c": 31,
        "condition": "Sunny / Clear",
        "rain_probability_pct": 5,
        "humidity_pct": 42,
        "wind_speed_kmh": 10,
        "alert": None,
        "forecast_5_days": [
            {"day": "Mon", "temp_c": 32, "condition": "Sunny", "rain_pct": 0},
            {"day": "Tue", "temp_c": 33, "condition": "Clear", "rain_pct": 5},
            {"day": "Wed", "temp_c": 31, "condition": "Sunny", "rain_pct": 0},
            {"day": "Thu", "temp_c": 30, "condition": "Clear", "rain_pct": 0},
            {"day": "Fri", "temp_c": 32, "condition": "Sunny", "rain_pct": 10}
        ]
    },
    "Switzerland": {
        "city": "Zurich / Interlaken, Switzerland",
        "current_temp_c": 18,
        "condition": "Alpine Breeze",
        "rain_probability_pct": 15,
        "humidity_pct": 55,
        "wind_speed_kmh": 8,
        "alert": None,
        "forecast_5_days": [
            {"day": "Mon", "temp_c": 19, "condition": "Sunny", "rain_pct": 10},
            {"day": "Tue", "temp_c": 18, "condition": "Partly Cloudy", "rain_pct": 20},
            {"day": "Wed", "temp_c": 16, "condition": "Light Rain", "rain_pct": 60},
            {"day": "Thu", "temp_c": 17, "condition": "Sunny", "rain_pct": 10},
            {"day": "Fri", "temp_c": 20, "condition": "Sunny", "rain_pct": 5}
        ]
    }
}

@router.get("")
def get_destination_weather(destination: str = "Goa") -> Dict[str, Any]:
    dest_key = "Goa"
    for k in CITY_WEATHER_DATA:
        if k.lower() in destination.lower():
            dest_key = k
            break
            
    weather_info = CITY_WEATHER_DATA.get(dest_key, CITY_WEATHER_DATA["Goa"])
    
    # Check if rain detected to advise indoor reroute
    indoor_recommendation = None
    if weather_info["rain_probability_pct"] >= 40:
        indoor_recommendation = {
            "advisory": "High rain probability detected. AI Planner recommends substituting open beach activities with indoor heritage museums or cafe tours.",
            "indoor_alternatives": ["Goa State Museum", "Houses of Goa Architecture Museum", "Art Cafe Spice Plantation"]
        }
        
    return {
        "weather": weather_info,
        "indoor_rerouting": indoor_recommendation
    }
