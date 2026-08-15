from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models.entities import Trip, ItineraryDay, Activity, User
from ..schemas.all_schemas import TripCreateRequest, TripResponse
from ..agents.planner_agent import planner_agent

router = APIRouter(prefix="/trips", tags=["Trips & Itineraries"])

@router.post("/plan", response_model=TripResponse)
def generate_and_save_trip(req: TripCreateRequest, db: Session = Depends(get_db)):
    # 1. Call Planner Agent
    itinerary_data = planner_agent.generate_itinerary(
        destination=req.destination,
        duration_days=(len(req.start_date) > 0 and 5) or 5,
        start_date=req.start_date,
        budget_inr=req.budget_inr,
        travelers_count=req.travelers_count,
        travel_style=req.travel_style,
        interests=req.interests
    )

    # 2. Get or create default user
    user = db.query(User).first()
    user_id = user.id if user else None

    # 3. Save Trip in Database
    new_trip = Trip(
        user_id=user_id,
        title=itinerary_data["title"],
        destination=itinerary_data["destination"],
        country=itinerary_data["country"],
        start_date=itinerary_data["start_date"],
        end_date=itinerary_data["end_date"],
        duration_days=itinerary_data["duration_days"],
        travelers_count=itinerary_data["travelers_count"],
        travelers_label=itinerary_data["travelers_label"],
        total_budget_inr=itinerary_data["total_budget_inr"],
        estimated_cost_inr=itinerary_data["estimated_cost_inr"],
        travel_style=itinerary_data["travel_style"],
        interests=itinerary_data["interests"],
        image_url=itinerary_data["image_url"],
        status="upcoming"
    )
    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)

    # 4. Save Days and Activities
    for day in itinerary_data["itinerary_days"]:
        db_day = ItineraryDay(
            trip_id=new_trip.id,
            day_number=day["day_number"],
            title=day["title"],
            theme=day.get("theme", ""),
            description=day.get("description", ""),
            date_str=day.get("date_str", "")
        )
        db.add(db_day)
        db.commit()
        db.refresh(db_day)

        for idx, act in enumerate(day.get("activities", [])):
            db_act = Activity(
                day_id=db_day.id,
                order_index=idx,
                time_slot=act.get("time_slot", "Morning"),
                name=act.get("name", "Attraction"),
                description=act.get("description", ""),
                category=act.get("category", "Sightseeing"),
                cost_inr=act.get("cost_inr", 0.0),
                duration_hrs=act.get("duration_hrs", 2.0),
                rating=act.get("rating", 4.5),
                lat=act.get("lat", 0.0),
                lon=act.get("lon", 0.0),
                image_url=act.get("image_url", itinerary_data["image_url"]),
                location_name=act.get("location_name", "")
            )
            db.add(db_act)
        db.commit()

    db.refresh(new_trip)
    return new_trip

@router.get("", response_model=List[TripResponse])
def get_all_trips(db: Session = Depends(get_db)):
    trips = db.query(Trip).order_by(Trip.created_at.desc()).all()
    # If DB is empty on first boot, initialize with the Greek Island Adventure demo trip
    if not trips:
        demo_req = TripCreateRequest(
            destination="Santorini",
            start_date="2025-06-14",
            end_date="2025-06-21",
            travelers_count=2,
            travelers_label="2 Adults",
            budget_inr=180000.0,
            travel_style="Balanced",
            interests=["Beaches", "Food", "Photography", "Sightseeing"]
        )
        demo_trip = generate_and_save_trip(demo_req, db)
        demo_trip.title = "Greek Island Adventure"
        demo_trip.image_url = "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1200&q=80"
        db.commit()
        db.refresh(demo_trip)
        return [demo_trip]
    return trips

@router.get("/{trip_id}", response_model=TripResponse)
def get_trip_by_id(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.delete("/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.delete(trip)
    db.commit()
    return {"message": "Trip deleted successfully"}
