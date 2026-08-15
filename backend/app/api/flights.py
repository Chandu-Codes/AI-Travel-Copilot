from fastapi import APIRouter, Query
from typing import Optional, List
from ..ml.flight_service import flight_ml_service
from ..schemas.all_schemas import FlightSearchRequest, FlightPredictionResponse

router = APIRouter(prefix="/flights", tags=["Flights & Fares"])

@router.get("/search")
def search_flights(
    source_city: str = "Delhi",
    destination_city: str = "Goa",
    days_left: int = 15
):
    flights = flight_ml_service.search_multiple_flights(
        source_city=source_city,
        destination_city=destination_city,
        days_left=days_left
    )
    return {
        "source": source_city,
        "destination": destination_city,
        "days_left": days_left,
        "results_count": len(flights),
        "flights": flights
    }

@router.post("/predict", response_model=FlightPredictionResponse)
def predict_single_flight(req: FlightSearchRequest):
    return flight_ml_service.predict_flight(
        airline=req.airline or "IndiGo",
        source_city=req.source_city,
        destination_city=req.destination_city,
        departure_time=req.departure_time or "Morning",
        stops=req.stops or "zero",
        cabin_class=req.cabin_class or "Economy",
        days_left=req.days_left or 15
    )
