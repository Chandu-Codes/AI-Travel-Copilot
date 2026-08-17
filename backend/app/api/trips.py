import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models.entities import Trip, ItineraryDay, Activity, User
from ..schemas.all_schemas import TripCreateRequest, TripResponse
from ..agents.planner_agent import planner_agent, resolve_clean_destination

router = APIRouter(prefix="/trips", tags=["Trips & Itineraries"])

@router.post("/plan", response_model=TripResponse)
def generate_and_save_trip(req: TripCreateRequest, db: Session = Depends(get_db)):
    clean_dest = resolve_clean_destination(req.destination)
    
    # Calculate duration
    try:
        start_d = datetime.datetime.strptime(req.start_date, "%Y-%m-%d")
        end_d = datetime.datetime.strptime(req.end_date, "%Y-%m-%d")
        duration = max(1, (end_d - start_d).days + 1)
    except:
        duration = 5

    # 1. Call Planner Agent
    itinerary_data = planner_agent.generate_itinerary(
        destination=clean_dest,
        duration_days=duration,
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
        title=itinerary_data.get("title", f"Trip to {clean_dest}"),
        destination=itinerary_data.get("destination", clean_dest),
        country=itinerary_data.get("country", clean_dest),
        start_date=itinerary_data.get("start_date", req.start_date),
        end_date=itinerary_data.get("end_date", req.end_date),
        duration_days=itinerary_data.get("duration_days", duration),
        travelers_count=itinerary_data.get("travelers_count", req.travelers_count),
        travelers_label=itinerary_data.get("travelers_label", f"{req.travelers_count} Travelers"),
        total_budget_inr=itinerary_data.get("total_budget_inr", req.budget_inr),
        estimated_cost_inr=itinerary_data.get("estimated_cost_inr", req.budget_inr),
        travel_style=itinerary_data.get("travel_style", req.travel_style),
        interests=itinerary_data.get("interests", req.interests),
        image_url=itinerary_data.get("image_url", ""),
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
    if not trips:
        demo_req = TripCreateRequest(
            destination="Goa",
            start_date="2025-06-10",
            end_date="2025-06-15",
            travelers_count=2,
            travelers_label="2 Adults",
            budget_inr=35000.0,
            travel_style="Balanced",
            interests=["Beaches", "Heritage", "Sightseeing", "Food"]
        )
        demo_trip = generate_and_save_trip(demo_req, db)
        return [demo_trip]
    return trips

@router.get("/{trip_id}", response_model=TripResponse)
def get_trip_by_id(trip_id: int, dest: Optional[str] = Query(None), db: Session = Depends(get_db)):
    if dest:
        clean_dest = resolve_clean_destination(dest)
        existing = db.query(Trip).filter(Trip.destination.ilike(f"%{clean_dest}%")).order_by(Trip.created_at.desc()).first()
        if existing:
            return existing
        
        # Auto-generate fresh itinerary for this destination
        new_req = TripCreateRequest(
            destination=clean_dest,
            start_date="2025-06-10",
            end_date="2025-06-15",
            travelers_count=2,
            travelers_label="2 Adults",
            budget_inr=35000.0,
            travel_style="Balanced",
            interests=["Beaches", "Heritage", "Sightseeing", "Food"]
        )
        return generate_and_save_trip(new_req, db)

    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        # Fallback to create demo trip
        demo_req = TripCreateRequest(
            destination="Goa",
            start_date="2025-06-10",
            end_date="2025-06-15",
            travelers_count=2,
            travelers_label="2 Adults",
            budget_inr=35000.0,
            travel_style="Balanced",
            interests=["Beaches", "Heritage", "Sightseeing", "Food"]
        )
        return generate_and_save_trip(demo_req, db)
    return trip

@router.delete("/{trip_id}")
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    trip = db.query(Trip).filter(Trip.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.delete(trip)
    db.commit()
    return {"message": "Trip deleted successfully"}
