import os
import joblib
import pandas as pd
import numpy as np
from typing import List, Dict, Any
from ..utils.path_helper import resolve_path

PRICE_MODEL_PATH = "models/flight_price_model.joblib"
DELAY_MODEL_PATH = "models/flight_delay_model.joblib"

DESTINATION_AIRPORT_MAP = {
    # Metros & Key Hubs
    "hyderabad": {"code": "HYD", "airport_name": "Rajiv Gandhi International (Hyderabad)", "domestic": True, "base_fare": 3800, "duration": 1.8},
    "visakhapatnam": {"code": "VTZ", "airport_name": "Visakhapatnam International (Vizag)", "domestic": True, "base_fare": 4200, "duration": 2.0},
    "vizag": {"code": "VTZ", "airport_name": "Visakhapatnam International (Vizag)", "domestic": True, "base_fare": 4200, "duration": 2.0},
    "bengaluru": {"code": "BLR", "airport_name": "Kempegowda International (Bengaluru)", "domestic": True, "base_fare": 3600, "duration": 1.5},
    "bangalore": {"code": "BLR", "airport_name": "Kempegowda International (Bengaluru)", "domestic": True, "base_fare": 3600, "duration": 1.5},
    "mumbai": {"code": "BOM", "airport_name": "Chhatrapati Shivaji Maharaj Intl (Mumbai)", "domestic": True, "base_fare": 3900, "duration": 2.0},
    "delhi": {"code": "DEL", "airport_name": "Indira Gandhi International (New Delhi)", "domestic": True, "base_fare": 3500, "duration": 1.5},
    "chennai": {"code": "MAA", "airport_name": "Chennai International Airport", "domestic": True, "base_fare": 3800, "duration": 2.2},
    "kolkata": {"code": "CCU", "airport_name": "Netaji Subhash Chandra Bose Intl (Kolkata)", "domestic": True, "base_fare": 4100, "duration": 2.1},
    "pune": {"code": "PNQ", "airport_name": "Pune International Airport", "domestic": True, "base_fare": 3700, "duration": 1.9},
    "ahmedabad": {"code": "AMD", "airport_name": "Sardar Vallabhbhai Patel Intl", "domestic": True, "base_fare": 3400, "duration": 1.6},
    
    # Tourism & Leisure Hotspots
    "goa": {"code": "GOI/GOX", "airport_name": "Goa Dabolim / Mopa Intl", "domestic": True, "base_fare": 4800, "duration": 2.5},
    "manali": {"code": "KUU", "airport_name": "Kullu-Bhuntar Airport (Manali)", "domestic": True, "base_fare": 6800, "duration": 1.5},
    "jaipur": {"code": "JAI", "airport_name": "Jaipur International Airport", "domestic": True, "base_fare": 3200, "duration": 1.0},
    "udaipur": {"code": "UDR", "airport_name": "Maharana Pratap Airport Udaipur", "domestic": True, "base_fare": 4100, "duration": 1.4},
    "kerala": {"code": "COK", "airport_name": "Cochin International Airport", "domestic": True, "base_fare": 5200, "duration": 3.0},
    "munnar": {"code": "COK", "airport_name": "Cochin International Airport (Munnar)", "domestic": True, "base_fare": 5200, "duration": 3.0},
    "ladakh": {"code": "IXL", "airport_name": "Leh Kushok Bakula Rimpochee", "domestic": True, "base_fare": 7500, "duration": 1.5},
    "leh": {"code": "IXL", "airport_name": "Leh Kushok Bakula Rimpochee", "domestic": True, "base_fare": 7500, "duration": 1.5},
    "kashmir": {"code": "SXR", "airport_name": "Srinagar International Airport", "domestic": True, "base_fare": 5800, "duration": 1.5},
    "srinagar": {"code": "SXR", "airport_name": "Srinagar International Airport", "domestic": True, "base_fare": 5800, "duration": 1.5},
    "rishikesh": {"code": "DED", "airport_name": "Dehradun Jolly Grant Airport", "domestic": True, "base_fare": 3800, "duration": 1.0},
    "ooty": {"code": "CJB", "airport_name": "Coimbatore International Airport", "domestic": True, "base_fare": 4600, "duration": 2.8},
    "coorg": {"code": "MYQ", "airport_name": "Mysuru / Mangaluru Airport", "domestic": True, "base_fare": 4400, "duration": 2.5},
    "hampi": {"code": "VDY", "airport_name": "Jindal Vijayanagar Vidyanagar Airport", "domestic": True, "base_fare": 5100, "duration": 2.0},
    "andaman": {"code": "IXZ", "airport_name": "Port Blair Veer Savarkar Intl", "domestic": True, "base_fare": 8900, "duration": 3.5},
    "agra": {"code": "AGR", "airport_name": "Agra Kheria Airport", "domestic": True, "base_fare": 2900, "duration": 0.8},
    "varanasi": {"code": "VNS", "airport_name": "Lal Bahadur Shastri Intl Airport", "domestic": True, "base_fare": 4200, "duration": 1.4},
    "amritsar": {"code": "ATQ", "airport_name": "Sri Guru Ram Dass Jee Intl", "domestic": True, "base_fare": 3500, "duration": 1.0},

    # International Gateways
    "paris": {"code": "CDG", "airport_name": "Paris Charles de Gaulle (France)", "domestic": False, "base_fare": 42000, "duration": 9.5},
    "switzerland": {"code": "ZRH", "airport_name": "Zurich International (Switzerland)", "domestic": False, "base_fare": 46000, "duration": 9.0},
    "japan": {"code": "HND", "airport_name": "Tokyo Haneda International (Japan)", "domestic": False, "base_fare": 48000, "duration": 9.5},
    "tokyo": {"code": "HND", "airport_name": "Tokyo Haneda International (Japan)", "domestic": False, "base_fare": 48000, "duration": 9.5},
    "bali": {"code": "DPS", "airport_name": "Ngurah Rai Bali Intl (Indonesia)", "domestic": False, "base_fare": 24000, "duration": 8.0},
    "dubai": {"code": "DXB", "airport_name": "Dubai International (UAE)", "domestic": False, "base_fare": 19500, "duration": 3.8},
    "maldives": {"code": "MLE", "airport_name": "Velana International (Male)", "domestic": False, "base_fare": 22000, "duration": 3.2},
    "singapore": {"code": "SIN", "airport_name": "Singapore Changi Airport", "domestic": False, "base_fare": 21000, "duration": 4.5},
    "london": {"code": "LHR", "airport_name": "London Heathrow International (UK)", "domestic": False, "base_fare": 44000, "duration": 9.0},
    "rome": {"code": "FCO", "airport_name": "Rome Fiumicino Leonardo da Vinci", "domestic": False, "base_fare": 41000, "duration": 8.5}
}

AIRLINES_CATALOG = {
    "domestic": [
        {"name": "IndiGo", "code": "6E", "logo": "✈️"},
        {"name": "Air India", "code": "AI", "logo": "🇮🇳"},
        {"name": "Vistara", "code": "UK", "logo": "✨"},
        {"name": "Akasa Air", "code": "QP", "logo": "🚀"}
    ],
    "international": [
        {"name": "Emirates", "code": "EK", "logo": "🌍"},
        {"name": "Air France", "code": "AF", "logo": "🇫🇷"},
        {"name": "Swiss International", "code": "LX", "logo": "🇨🇭"},
        {"name": "Singapore Airlines", "code": "SQ", "logo": "🇸🇬"},
        {"name": "Air India", "code": "AI", "logo": "🇮🇳"}
    ]
}

class FlightMLService:
    def __init__(self):
        self.price_model = None
        self.delay_model = None
        self._load_models()

    def _load_models(self):
        p_path = resolve_path(PRICE_MODEL_PATH)
        if os.path.exists(p_path):
            try:
                self.price_model = joblib.load(p_path)
            except Exception as e:
                print(f"Error loading flight price model: {e}")
        d_path = resolve_path(DELAY_MODEL_PATH)
        if os.path.exists(d_path):
            try:
                self.delay_model = joblib.load(d_path)
            except Exception as e:
                print(f"Error loading flight delay model: {e}")

    def get_destination_meta(self, destination: str) -> Dict[str, Any]:
        dest_clean = destination.strip().lower()
        for key, meta in DESTINATION_AIRPORT_MAP.items():
            if key in dest_clean or dest_clean in key:
                return meta
        return {"code": f"{destination[:3].upper()}X", "airport_name": f"{destination.title()} Airport", "domestic": True, "base_fare": 5000, "duration": 2.5}

    def predict_flight(self, airline="IndiGo", source_city="Delhi", destination_city="Goa", 
                       departure_time="Morning", stops="zero", arrival_time="Afternoon", 
                       cabin_class="Economy", duration=2.5, days_left=15):
        meta = self.get_destination_meta(destination_city)
        base_price = meta["base_fare"] * (1.0 + max(0, 20 - days_left) * 0.015)
        
        if cabin_class == "Business":
            base_price *= 2.8

        # Delay risk classification
        delay_risk = "Low"
        delay_prob = 12.0
        if self.delay_model and meta["domestic"]:
            df_d_input = pd.DataFrame([{
                'airline': airline,
                'departure_time': departure_time,
                'route': f"{source_city[:3].upper()}-{meta['code'][:3].upper()}",
                'weather_condition': 'Clear'
            }])
            try:
                delay_risk = self.delay_model.predict(df_d_input)[0]
                probs = self.delay_model.predict_proba(df_d_input)[0]
                delay_prob = round(float(np.max(probs)) * 100, 1)
            except Exception:
                delay_risk = "Low"

        badge = "Cheapest" if base_price < 5500 else ("Best Value" if delay_risk == "Low" else "Fastest")

        return {
            "predicted_price_inr": round(base_price, 2),
            "price_range_inr": f"₹{int(base_price*0.93):,} - ₹{int(base_price*1.12):,}",
            "airline": airline,
            "source_city": source_city,
            "destination_city": destination_city,
            "destination_airport": f"{meta['airport_name']} ({meta['code']})",
            "departure_time": departure_time,
            "duration_hrs": duration or meta["duration"],
            "stops": stops,
            "cabin_class": cabin_class,
            "delay_risk": delay_risk,
            "delay_probability_pct": delay_prob,
            "recommended_badge": badge,
            "is_live_api": False
        }

    def search_multiple_flights(self, source_city="Delhi", destination_city="Goa", days_left=15):
        meta = self.get_destination_meta(destination_city)
        airline_list = AIRLINES_CATALOG["international"] if not meta["domestic"] else AIRLINES_CATALOG["domestic"]
        
        results = []
        durations = [meta["duration"], meta["duration"] + 0.5, meta["duration"] + 1.0, meta["duration"] + 1.8]
        times = ["06:15 AM - Morning", "11:30 AM - Afternoon", "05:45 PM - Evening", "09:10 PM - Night"]
        stops_list = ["Non-stop (Direct)", "Non-stop (Direct)", "1 Stop (Via Transit)", "Non-stop (Direct)"]
        
        for idx, al in enumerate(airline_list[:4]):
            flight_num = f"{al['code']}-{100 + (idx * 23) + (len(destination_city) * 7)}"
            res = self.predict_flight(
                airline=al["name"],
                source_city=source_city,
                destination_city=destination_city,
                departure_time=times[idx % len(times)],
                duration=durations[idx % len(durations)],
                stops=stops_list[idx % len(stops_list)],
                days_left=days_left
            )
            res["flight_number"] = flight_num
            results.append(res)
            
        results.sort(key=lambda x: x["predicted_price_inr"])
        if results:
            results[0]["recommended_badge"] = "Cheapest Flight"
            if len(results) > 1:
                results[1]["recommended_badge"] = "AI Recommended"
        return results

flight_ml_service = FlightMLService()
