import os
import joblib
import pandas as pd
import numpy as np

PRICE_MODEL_PATH = "models/flight_price_model.joblib"
DELAY_MODEL_PATH = "models/flight_delay_model.joblib"

class FlightMLService:
    def __init__(self):
        self.price_model = None
        self.delay_model = None
        self._load_models()

    def _load_models(self):
        if os.path.exists(PRICE_MODEL_PATH):
            try:
                self.price_model = joblib.load(PRICE_MODEL_PATH)
            except Exception as e:
                print(f"Error loading flight price model: {e}")
        if os.path.exists(DELAY_MODEL_PATH):
            try:
                self.delay_model = joblib.load(DELAY_MODEL_PATH)
            except Exception as e:
                print(f"Error loading flight delay model: {e}")

    def predict_flight(self, airline="IndiGo", source_city="Delhi", destination_city="Goa", 
                       departure_time="Morning", stops="zero", arrival_time="Afternoon", 
                       cabin_class="Economy", duration=2.5, days_left=15):
        # Default baseline if model missing
        base_price = 5400.0
        if self.price_model:
            df_input = pd.DataFrame([{
                'airline': airline,
                'source_city': source_city,
                'destination_city': destination_city,
                'departure_time': departure_time,
                'stops': stops,
                'arrival_time': arrival_time,
                'class': cabin_class,
                'duration': float(duration),
                'days_left': int(days_left)
            }])
            try:
                pred = self.price_model.predict(df_input)[0]
                base_price = max(1200.0, float(pred))
            except Exception as e:
                print(f"Price prediction error: {e}")

        # Delay risk classification
        delay_risk = "Low"
        delay_prob = 15.0
        if self.delay_model:
            df_d_input = pd.DataFrame([{
                'airline': airline,
                'departure_time': departure_time,
                'route': f"{source_city[:3].upper()}-{destination_city[:3].upper()}",
                'weather_condition': 'Clear'
            }])
            try:
                delay_risk = self.delay_model.predict(df_d_input)[0]
                probs = self.delay_model.predict_proba(df_d_input)[0]
                delay_prob = round(float(np.max(probs)) * 100, 1)
            except Exception as e:
                print(f"Delay risk error: {e}")

        badge = "Cheapest" if base_price < 4500 else ("Best Value" if delay_risk == "Low" else "Fastest")

        return {
            "predicted_price_inr": round(base_price, 2),
            "price_range_inr": f"₹{int(base_price*0.92):,} - ₹{int(base_price*1.12):,}",
            "airline": airline,
            "source_city": source_city,
            "destination_city": destination_city,
            "departure_time": departure_time,
            "duration_hrs": duration,
            "stops": stops,
            "cabin_class": cabin_class,
            "delay_risk": delay_risk,
            "delay_probability_pct": delay_prob,
            "recommended_badge": badge,
            "is_live_api": False
        }

    def search_multiple_flights(self, source_city="Delhi", destination_city="Goa", days_left=15):
        airlines = ["IndiGo", "Air India", "Vistara", "SpiceJet"]
        results = []
        durations = [2.2, 2.5, 2.7, 3.1]
        times = ["Morning", "Afternoon", "Evening", "Night"]
        
        for idx, al in enumerate(airlines):
            res = self.predict_flight(
                airline=al,
                source_city=source_city,
                destination_city=destination_city,
                departure_time=times[idx % len(times)],
                duration=durations[idx % len(durations)],
                days_left=days_left
            )
            results.append(res)
            
        results.sort(key=lambda x: x["predicted_price_inr"])
        if results:
            results[0]["recommended_badge"] = "Cheapest Option"
            if len(results) > 1:
                results[1]["recommended_badge"] = "AI Recommended"
        return results

flight_ml_service = FlightMLService()
