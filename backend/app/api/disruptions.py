from fastapi import APIRouter, HTTPException
from typing import List, Optional
from ..agents.disruption_agent import disruption_agent
from ..schemas.all_schemas import DisruptionItem

router = APIRouter(prefix="/disruptions", tags=["Travel Disruptions & Rebooking"])

@router.get("", response_model=List[DisruptionItem])
def get_active_disruptions():
    return disruption_agent.get_all_disruptions()

@router.get("/check-flight")
def check_flight_status(flight_number: str = "6E-204"):
    return disruption_agent.check_flight(flight_number)

@router.post("/rebook-simulation")
def simulate_rebooking(flight_number: str = "6E-204"):
    check = disruption_agent.check_flight(flight_number)
    return {
        "status": "success",
        "flight_checked": flight_number,
        "disruption_detected": check.get("is_disrupted", False),
        "impact_analysis": "Day 1 morning tour and 11:30 AM airport transfer affected due to 3h 45m flight delay.",
        "rebooking_action_taken": "Automated hotel check-in rescheduled to 2:00 PM. Morning attraction Fort Aguada moved to Day 2 with zero additional charges.",
        "savings_inr": 0,
        "new_estimated_arrival": "01:15 PM"
    }
