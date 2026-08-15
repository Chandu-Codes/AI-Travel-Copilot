import os
import json
import pandas as pd
from fastapi import APIRouter, Query
from typing import List, Optional
from ..agents.planner_agent import DESTINATION_IMAGES
from ..ml.recommender_service import recommender_service

router = APIRouter(prefix="/destinations", tags=["Destinations"])

DESTINATIONS_CSV = "datasets/destinations/destinations_attractions.csv"

# Global high-resolution curated destination cards
FEATURED_GLOBAL_CARDS = [
    {
        "id": "DEST_JAPAN",
        "name": "Japan",
        "country": "Japan",
        "region": "Asia",
        "image_url": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
        "rating": 4.9,
        "avg_cost_inr": "₹1,40,000",
        "ai_score": 98.4,
        "tags": ["Culture", "Food", "Cherry Blossoms", "Tech"]
    },
    {
        "id": "DEST_SWISS",
        "name": "Switzerland",
        "country": "Switzerland",
        "region": "Europe",
        "image_url": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
        "rating": 4.9,
        "avg_cost_inr": "₹1,80,000",
        "ai_score": 99.2,
        "tags": ["Alps", "Lakes", "Glaciers", "Scenic Trains"]
    },
    {
        "id": "DEST_BALI",
        "name": "Bali",
        "country": "Indonesia",
        "region": "Asia",
        "image_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
        "rating": 4.8,
        "avg_cost_inr": "₹45,000",
        "ai_score": 97.5,
        "tags": ["Beaches", "Temples", "Rice Terraces", "Sunsets"]
    },
    {
        "id": "DEST_PARIS",
        "name": "Paris",
        "country": "France",
        "region": "Europe",
        "image_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
        "rating": 4.9,
        "avg_cost_inr": "₹1,50,000",
        "ai_score": 98.8,
        "tags": ["Eiffel Tower", "Art & Louvre", "Romance", "Pastries"]
    },
    {
        "id": "DEST_MALDIVES",
        "name": "Maldives",
        "country": "Maldives",
        "region": "Asia",
        "image_url": "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
        "rating": 4.9,
        "avg_cost_inr": "₹1,20,000",
        "ai_score": 96.8,
        "tags": ["Overwater Villas", "Snorkeling", "Luxury", "Sandbanks"]
    },
    {
        "id": "DEST_DUBAI",
        "name": "Dubai",
        "country": "UAE",
        "region": "Middle East",
        "image_url": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
        "rating": 4.8,
        "avg_cost_inr": "₹80,000",
        "ai_score": 95.0,
        "tags": ["Burj Khalifa", "Desert Safari", "Luxury", "Skyline"]
    },
    {
        "id": "DEST_GOA",
        "name": "Goa",
        "country": "India",
        "region": "India",
        "image_url": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
        "rating": 4.7,
        "avg_cost_inr": "₹25,000",
        "ai_score": 96.0,
        "tags": ["Beaches", "Watersports", "Portuguese Heritage", "Nightlife"]
    },
    {
        "id": "DEST_JAIPUR",
        "name": "Jaipur",
        "country": "India",
        "region": "India",
        "image_url": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
        "rating": 4.8,
        "avg_cost_inr": "₹20,000",
        "ai_score": 95.4,
        "tags": ["Amber Fort", "Pink City", "Palaces", "Bazaars"]
    },
    {
        "id": "DEST_KERALA",
        "name": "Kerala",
        "country": "India",
        "region": "India",
        "image_url": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
        "rating": 4.9,
        "avg_cost_inr": "₹32,000",
        "ai_score": 97.2,
        "tags": ["Alleppey Houseboats", "Munnar Tea Hills", "Ayurveda", "Lakes"]
    },
    {
        "id": "DEST_ROME",
        "name": "Rome",
        "country": "Italy",
        "region": "Europe",
        "image_url": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
        "rating": 4.9,
        "avg_cost_inr": "₹1,60,000",
        "ai_score": 98.1,
        "tags": ["Colosseum", "Vatican", "Pasta", "Ancient Ruins"]
    },
    {
        "id": "DEST_LONDON",
        "name": "London",
        "country": "United Kingdom",
        "region": "Europe",
        "image_url": "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
        "rating": 4.8,
        "avg_cost_inr": "₹1,75,000",
        "ai_score": 97.6,
        "tags": ["Big Ben", "Tower Bridge", "Museums", "Royalty"]
    },
    {
        "id": "DEST_NYC",
        "name": "New York",
        "country": "USA",
        "region": "Americas",
        "image_url": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
        "rating": 4.8,
        "avg_cost_inr": "₹2,10,000",
        "ai_score": 98.0,
        "tags": ["Statue of Liberty", "Broadway", "Central Park", "Skyscrapers"]
    }
]

@router.get("")
def get_destinations(
    query: Optional[str] = None,
    category: Optional[str] = None,
    region: Optional[str] = None,
    city: Optional[str] = None
):
    if not os.path.exists(DESTINATIONS_CSV):
        return []
        
    df = pd.read_csv(DESTINATIONS_CSV)
    
    if query:
        q = query.lower()
        df = df[
            df['name'].str.lower().str.contains(q, na=False) | 
            df['city'].str.lower().str.contains(q, na=False) | 
            df['country'].str.lower().str.contains(q, na=False) | 
            df['tags'].str.lower().str.contains(q, na=False)
        ]
    if category and category != "All":
        df = df[df['category'].str.lower().str.contains(category.lower(), na=False)]
    if region and region != "All":
        df = df[df['region'].str.lower() == region.lower()]
    if city:
        df = df[df['city'].str.lower() == city.lower()]
        
    results = df.to_dict(orient="records")
    for r in results:
        r["image_url"] = DESTINATION_IMAGES.get(r.get("city"), DESTINATION_IMAGES.get(r.get("country"), DESTINATION_IMAGES["Goa"]))
        r["ai_recommendation_score"] = round(float(r.get("rating", 4.5)) * 19.5, 1)
        
    return results

@router.get("/featured")
def get_featured_cards():
    return FEATURED_GLOBAL_CARDS
