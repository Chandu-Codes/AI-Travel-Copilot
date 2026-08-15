import os
import pandas as pd
from typing import Dict, Any, List

DISRUPTIONS_CSV = "datasets/disruptions/travel_disruptions.csv"

class DisruptionAgent:
    def __init__(self):
        self.disruptions = []
        self._load_disruptions()

    def _load_disruptions(self):
        if os.path.exists(DISRUPTIONS_CSV):
            try:
                df = pd.read_csv(DISRUPTIONS_CSV)
                self.disruptions = df.to_dict(orient="records")
            except Exception as e:
                print(f"Error loading disruptions: {e}")

    def get_all_disruptions(self) -> List[Dict[str, Any]]:
        return self.disruptions

    def check_flight(self, flight_number: str) -> Dict[str, Any]:
        fn_clean = flight_number.strip().upper()
        for d in self.disruptions:
            if fn_clean in str(d.get("flight_number", "")).upper():
                return {
                    "is_disrupted": True,
                    "event": d,
                    "recommended_action": d.get("rebooking_action", "Check alternative flights.")
                }
        return {
            "is_disrupted": False,
            "flight_number": flight_number,
            "status": "On Time",
            "message": "No active delays or weather disruptions detected for this flight."
        }

    def generate_rescheduled_itinerary(self, original_itinerary: Dict[str, Any], delay_hours: float = 3.5) -> Dict[str, Any]:
        updated = original_itinerary.copy()
        days = updated.get("itinerary_days", [])
        if days:
            # Shift Day 1 morning activities to Day 2 or evening
            day1 = days[0].copy()
            acts = day1.get("activities", [])
            if len(acts) > 1:
                # Postpone first activity and add hotel check-in buffer
                acts[0]["time_slot"] = "Late Afternoon"
                acts[0]["description"] = f"[Rescheduled due to {delay_hours}h flight delay] " + acts[0]["description"]
            day1["description"] = f"Adjusted schedule for {delay_hours}h flight delay: Hotel check-in moved to 2:00 PM."
            days[0] = day1
            updated["itinerary_days"] = days
        return updated

disruption_agent = DisruptionAgent()
