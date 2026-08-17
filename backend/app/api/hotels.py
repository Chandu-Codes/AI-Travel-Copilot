import os
import pandas as pd
from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from ..ml.sentiment_service import hotel_sentiment_service
from ..utils.path_helper import resolve_path

router = APIRouter(prefix="/hotels", tags=["Hotels & Accommodations"])

HOTELS_CSV = "datasets/hotels/hotels_catalog.csv"

@router.get("")
def get_hotels(
    city: Optional[str] = None,
    tier: Optional[str] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None
):
    resolved = resolve_path(HOTELS_CSV)
    if not os.path.exists(resolved):
        return []
        
    df = pd.read_csv(resolved)
    
    if city and city.strip() and city.lower() != "all":
        city_clean = city.strip().lower()
        # Direct match or partial match on city/country/address
        matching = df[
            df['city'].str.lower().str.contains(city_clean) | 
            df['country'].str.lower().str.contains(city_clean) |
            df['address'].str.lower().str.contains(city_clean)
        ]
        if not matching.empty:
            df = matching
        else:
            # Fallback: find if query contains city keyword
            for c in df['city'].unique():
                if c.lower() in city_clean or city_clean in c.lower():
                    df = df[df['city'].str.lower() == c.lower()]
                    break
                    
    if tier and tier.strip() and tier.lower() != "all":
        df = df[df['tier'].str.lower().str.contains(tier.strip().lower())]
    if max_price:
        df = df[df['price_per_night_inr'] <= max_price]
    if min_rating:
        df = df[df['star_rating'] >= min_rating]
        
    hotels = df.to_dict(orient="records")
    for h in hotels:
        if not h.get("image_url") or str(h.get("image_url")) == "nan":
            h["image_url"] = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80"
            
        h["sentiment_summary"] = hotel_sentiment_service.analyze_text(
            f"Wonderful stay at {h['name']}. Very clean rooms, exceptional customer service, peaceful location, and great value."
        )
        h["ai_recommendation_score"] = round(float(h["review_score"]) * 20.0, 1)

    return hotels

@router.post("/book-assist")
def request_booking_assistance(hotel_id: str, guest_name: str = "Chandu", nights: int = 4):
    return {
        "status": "confirmed",
        "booking_reference": f"TCP-HTL-{hotel_id[:4].upper()}-992",
        "message": f"Pre-booking inquiry registered for {guest_name}. Hotel will hold best rates for {nights} nights."
    }
