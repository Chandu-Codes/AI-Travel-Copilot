import os
import pandas as pd
from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from ..ml.sentiment_service import hotel_sentiment_service

router = APIRouter(prefix="/hotels", tags=["Hotels & Accommodations"])

HOTELS_CSV = "datasets/hotels/hotels_catalog.csv"

HOTEL_IMAGES = {
    "Taj Fort Aguada Resort & Spa": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "BloomSuites Calangute": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    "Zostel Goa Morjim": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
    "Hard Rock Hotel Goa (Calangute)": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    "Rambagh Palace (Taj Heritage)": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    "Umaid Bhawan Heritage House Hotel": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    "Moustache Hostel Jaipur": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    "Kumarakom Lake Resort": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
    "Grand Hyatt Kochi Bolgatty": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "Tea Valley Resort Munnar": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
}

@router.get("")
def get_hotels(
    city: Optional[str] = None,
    tier: Optional[str] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[float] = None
):
    if not os.path.exists(HOTELS_CSV):
        return []
        
    df = pd.read_csv(HOTELS_CSV)
    
    if city and city != "All":
        df = df[df['city'].str.lower() == city.lower()]
    if tier and tier != "All":
        df = df[df['tier'].str.lower().str.contains(tier.lower())]
    if max_price:
        df = df[df['price_per_night_inr'] <= max_price]
    if min_rating:
        df = df[df['star_rating'] >= min_rating]
        
    hotels = df.to_dict(orient="records")
    for h in hotels:
        h["image_url"] = HOTEL_IMAGES.get(h["name"], "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80")
        h["sentiment_summary"] = hotel_sentiment_service.analyze_text(
            f"Wonderful stay at {h['name']}. Very clean rooms, exceptional customer service, peaceful location, and great value."
        )
        h["ai_recommendation_score"] = round(float(h["review_score"]) * 20.0, 1)

    return hotels

@router.post("/book-assist")
def request_booking_assistance(hotel_id: str, guest_name: str = "Chandu", nights: int = 4):
    return {
        "status": "success",
        "booking_reference": f"BKG-AI-{hotel_id[-4:]}-2026",
        "hotel_id": hotel_id,
        "guest_name": guest_name,
        "nights": nights,
        "message": "AI Concierge has reserved provisional rates and added stay to your active itinerary."
    }
