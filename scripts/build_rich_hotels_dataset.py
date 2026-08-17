import pandas as pd
import os

HOTELS_DATA = [
    # ------------------- HYDERABAD -------------------
    {
        "hotel_id": "HTL_HYD_01", "name": "Taj Falaknuma Palace ('Mirror of the Sky')", "city": "Hyderabad", "country": "India",
        "tier": "Luxury Palace 5-Star", "price_per_night_inr": 38000, "star_rating": 5.0, "review_score": 5.0,
        "amenities": "Horse Carriage Arrival, Palace Historian Tour, 101-Seat Dining, Jiva Spa, Italian Marble Terrace",
        "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
        "address": "Engine Bowli, Falaknuma, Hyderabad, Telangana"
    },
    {
        "hotel_id": "HTL_HYD_02", "name": "ITC Kohenur Luxury Collection Hitec City", "city": "Hyderabad", "country": "India",
        "tier": "Luxury 5-Star", "price_per_night_inr": 14500, "star_rating": 4.9, "review_score": 4.9,
        "amenities": "Durgam Cheruvu Lake View, Kaya Kalp Spa, Golconda Pavilion, Rooftop Sky Bar, Infinity Pool",
        "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        "address": "Knowledge City, Madhapur, Hitec City, Hyderabad"
    },
    {
        "hotel_id": "HTL_HYD_03", "name": "Taj Krishna Banjara Hills", "city": "Hyderabad", "country": "India",
        "tier": "Luxury 5-Star", "price_per_night_inr": 10500, "star_rating": 4.8, "review_score": 4.8,
        "amenities": "Manicured Lawns, Firdaus Hyderabadi Cuisine, Large Outdoor Pool, Banqueting, Central Location",
        "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
        "address": "Road No. 1, Banjara Hills, Hyderabad"
    },
    {
        "hotel_id": "HTL_HYD_04", "name": "The Park Hyderabad (Hussain Sagar Lakefront)", "city": "Hyderabad", "country": "India",
        "tier": "Boutique Design 4-Star", "price_per_night_inr": 5500, "star_rating": 4.6, "review_score": 4.6,
        "amenities": "Lake View Infinity Pool, Aqua Night Lounge, Aish Nawabi Dining, Modern Art Decor, Free Wifi",
        "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
        "address": "22 Raj Bhavan Road, Somajiguda, Hyderabad"
    },
    {
        "hotel_id": "HTL_HYD_05", "name": "Zostel Hyderabad Hitec City", "city": "Hyderabad", "country": "India",
        "tier": "Budget / Backpacker", "price_per_night_inr": 950, "star_rating": 4.5, "review_score": 4.5,
        "amenities": "Air-Conditioned Dorms, Co-Working Desks, Community Cafe, Gaming Area, High Speed Wifi",
        "image_url": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
        "address": "Kondapur, Near Botanical Garden, Hitec City, Hyderabad"
    },

    # ------------------- VISAKHAPATNAM / VIZAG -------------------
    {
        "hotel_id": "HTL_VTZ_01", "name": "Radisson Blu Resort Visakhapatnam Beachfront", "city": "Visakhapatnam", "country": "India",
        "tier": "Luxury 5-Star", "price_per_night_inr": 11500, "star_rating": 4.9, "review_score": 4.9,
        "amenities": "Panoramic Ocean Views, Private Beach Access, Infinity Pool, 3 Restaurants, Spa & Gym",
        "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        "address": "Rishikonda Beach Road, Visakhapatnam, Andhra Pradesh"
    },
    {
        "hotel_id": "HTL_VTZ_02", "name": "The Gateway Hotel Beach Road (Taj Group)", "city": "Visakhapatnam", "country": "India",
        "tier": "Luxury 5-Star", "price_per_night_inr": 8500, "star_rating": 4.8, "review_score": 4.8,
        "amenities": "Bay of Bengal Sea Facing Rooms, Lawson's Bar, Ming Garden Chinese, Outdoor Pool, Seaside Lawn",
        "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
        "address": "Dr. NTR Beach Road, Pandurangapuram, Visakhapatnam"
    },
    {
        "hotel_id": "HTL_VTZ_03", "name": "Novotel Visakhapatnam Varun Beach", "city": "Visakhapatnam", "country": "India",
        "tier": "Luxury 5-Star", "price_per_night_inr": 9200, "star_rating": 4.8, "review_score": 4.8,
        "amenities": "Ocean Edge Infinity Pool, Executive Lounge, Teppanyaki Dining, Jogging Track Over Sea",
        "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
        "address": "Beach Road, Maharani Peta, Visakhapatnam"
    },
    {
        "hotel_id": "HTL_VTZ_04", "name": "Keys Lite by Lemon Tree Hotels Vizag", "city": "Visakhapatnam", "country": "India",
        "tier": "Mid-Range / Comfort", "price_per_night_inr": 2800, "star_rating": 4.5, "review_score": 4.5,
        "amenities": "Central City Hub, Free Breakfast Buffet, Fitness Room, 24/7 Room Service, High Speed Wifi",
        "image_url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
        "address": "Daba Gardens, Central Visakhapatnam"
    },
    {
        "hotel_id": "HTL_VTZ_05", "name": "Hotel Supreme Beach Road Vizag", "city": "Visakhapatnam", "country": "India",
        "tier": "Budget / Family Beach", "price_per_night_inr": 1800, "star_rating": 4.4, "review_score": 4.4,
        "amenities": "Opposite RK Beach, Sea View Balcony, Andhra Seafood Restaurant, Travel Desk to Araku",
        "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
        "address": "RK Beach Road, Visakhapatnam"
    },

    # ------------------- BENGALURU -------------------
    {
        "hotel_id": "HTL_BLR_01", "name": "The Leela Palace Bengaluru (Royal Luxury)", "city": "Bengaluru", "country": "India",
        "tier": "Luxury Palace 5-Star", "price_per_night_inr": 22000, "star_rating": 5.0, "review_score": 5.0,
        "amenities": "Vijayanagara Palace Architecture, 9-Acre Cascading Gardens, Zen Pan-Asian, Cigar Lounge, Spa",
        "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
        "address": "23 HAL Airport Road, Kodihalli, Bengaluru"
    },
    {
        "hotel_id": "HTL_BLR_02", "name": "The Oberoi Bengaluru MG Road", "city": "Bengaluru", "country": "India",
        "tier": "Luxury 5-Star", "price_per_night_inr": 17500, "star_rating": 4.9, "review_score": 4.9,
        "amenities": "Centuries-Old Rain Trees, Private Balconies over Tropical Gardens, Rim Naam Thai Dining, Luxury Spa",
        "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        "address": "37-39 MG Road, Bengaluru, Karnataka"
    },
    {
        "hotel_id": "HTL_BLR_03", "name": "JW Marriott Hotel Bengaluru Vittal Mallya", "city": "Bengaluru", "country": "India",
        "tier": "Luxury 5-Star", "price_per_night_inr": 15000, "star_rating": 4.8, "review_score": 4.8,
        "amenities": "Overlooking Cubbon Park, Rooftop Alba Italian, Heated Outdoor Pool, Spa by JW, UB City 200m",
        "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
        "address": "24/1 Vittal Mallya Road, Bengaluru"
    },
    {
        "hotel_id": "HTL_BLR_04", "name": "Bloomrooms @ Indiranagar 100ft Road", "city": "Bengaluru", "country": "India",
        "tier": "Boutique / Comfort", "price_per_night_inr": 3400, "star_rating": 4.6, "review_score": 4.6,
        "amenities": "Signature CloudBeds, High Speed Wifi, Cafe, 100ft Road Shopping & Pub Walkway",
        "image_url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
        "address": "100 Feet Road, Indiranagar, Bengaluru"
    },
    {
        "hotel_id": "HTL_BLR_05", "name": "Zostel Bangalore Koramangala", "city": "Bengaluru", "country": "India",
        "tier": "Budget / Backpacker", "price_per_night_inr": 900, "star_rating": 4.5, "review_score": 4.5,
        "amenities": "Rooftop Common Room, Co-Working Pods, Night Board Games, Walking Tours, Pub Crawls",
        "image_url": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
        "address": "8th Main Road, 4th Block, Koramangala, Bengaluru"
    },

    # ------------------- MUMBAI -------------------
    {
        "hotel_id": "HTL_BOM_01", "name": "The Taj Mahal Palace & Tower Mumbai (1903 Historic)", "city": "Mumbai", "country": "India",
        "tier": "Luxury Palace 5-Star", "price_per_night_inr": 28000, "star_rating": 5.0, "review_score": 5.0,
        "amenities": "Gateway of India Direct Harbor View, Wasabi by Morimoto, Sea Lounge High Tea, Jiva Grand Spa",
        "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
        "address": "Apollo Bunder, Colaba, Mumbai, Maharashtra"
    },
    {
        "hotel_id": "HTL_BOM_02", "name": "The Oberoi Mumbai Marine Drive", "city": "Mumbai", "country": "India",
        "tier": "Luxury 5-Star", "price_per_night_inr": 24000, "star_rating": 4.9, "review_score": 4.9,
        "amenities": "Direct Queen's Necklace Sea Views, Glass Jewel Box Atrium, Ziya Indian Dining, Heated Ocean Pool",
        "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        "address": "Nariman Point, Marine Drive, Mumbai"
    },
    {
        "hotel_id": "HTL_BOM_03", "name": "JW Marriott Mumbai Juhu Beachfront", "city": "Mumbai", "country": "India",
        "tier": "Luxury 5-Star", "price_per_night_inr": 18000, "star_rating": 4.8, "review_score": 4.8,
        "amenities": "Direct Juhu Beach Access, Infinity Saltwater Pool, Lotus Cafe, Quan Spa, Celebrity Spotting",
        "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
        "address": "Juhu Tara Road, Juhu Beach, Mumbai"
    },
    {
        "hotel_id": "HTL_BOM_04", "name": "Residency Hotel Fort Mumbai", "city": "Mumbai", "country": "India",
        "tier": "Mid-Range / Heritage Comfort", "price_per_night_inr": 4800, "star_rating": 4.6, "review_score": 4.6,
        "amenities": "Walking Distance to CSMT & Flora Fountain, Historic Architecture, Breakfast Buffet, Free Wifi",
        "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
        "address": "DN Road, Fort Heritage District, Mumbai"
    },
    {
        "hotel_id": "HTL_BOM_05", "name": "Zostel Mumbai Andheri", "city": "Mumbai", "country": "India",
        "tier": "Budget / Backpacker", "price_per_night_inr": 1100, "star_rating": 4.5, "review_score": 4.5,
        "amenities": "Bollywood Theme Murals, Rooftop Bollywood Cafe, High Speed Wifi, Metro Station 500m",
        "image_url": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
        "address": "Marol, Andheri East, Mumbai"
    },

    # ------------------- DELHI -------------------
    {
        "hotel_id": "HTL_DEL_01", "name": "The Imperial New Delhi (1936 Art Deco Palace)", "city": "Delhi", "country": "India",
        "tier": "Luxury Palace 5-Star", "price_per_night_inr": 24000, "star_rating": 5.0, "review_score": 5.0,
        "amenities": "Art Deco Victorian Verandahs, 24-Pillar Durbar Hall, Spice Route Fine Dining, Imperial Spa",
        "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
        "address": "Janpath, Connaught Place, New Delhi"
    },
    {
        "hotel_id": "HTL_DEL_02", "name": "The Leela Palace New Delhi Chanakyapuri", "city": "Delhi", "country": "India",
        "tier": "Luxury 5-Star", "price_per_night_inr": 22000, "star_rating": 4.9, "review_score": 4.9,
        "amenities": "Rooftop Temperature-Controlled Infinity Pool, Diplomatic Enclave, MEGU Japanese, ESPA Spa",
        "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        "address": "Diplomatic Enclave, Chanakyapuri, New Delhi"
    },
    {
        "hotel_id": "HTL_DEL_03", "name": "Bloomrooms @ Janpath Connaught Place", "city": "Delhi", "country": "India",
        "tier": "Boutique / Comfort", "price_per_night_inr": 3600, "star_rating": 4.6, "review_score": 4.6,
        "amenities": "Minimalist Yellow Decor, High Speed Wifi, Cafe, Metro Station Adjacent, Clean Bathrooms",
        "image_url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
        "address": "1 Janpath Lane, Connaught Place, New Delhi"
    },
    {
        "hotel_id": "HTL_DEL_04", "name": "Zostel Delhi Paharganj Rooftop", "city": "Delhi", "country": "India",
        "tier": "Budget / Backpacker", "price_per_night_inr": 850, "star_rating": 4.5, "review_score": 4.5,
        "amenities": "Rooftop Cafe, Old Delhi Street Food Tours, Co-Working Desks, 500m to New Delhi Railway Station",
        "image_url": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80",
        "address": "Ara Kashan Road, Paharganj, New Delhi"
    }
]

def update_hotels_catalog():
    csv_path = "datasets/hotels/hotels_catalog.csv"
    existing_df = pd.DataFrame()
    if os.path.exists(csv_path):
        existing_df = pd.read_csv(csv_path)

    new_df = pd.DataFrame(HOTELS_DATA)
    if not existing_df.empty:
        # Keep existing hotels whose IDs don't conflict
        filtered_existing = existing_df[~existing_df["hotel_id"].isin(new_df["hotel_id"])]
        final_df = pd.concat([new_df, filtered_existing], ignore_index=True)
    else:
        final_df = new_df

    final_df.to_csv(csv_path, index=False)
    print(f"Successfully updated hotels catalog at {csv_path} with {len(final_df)} total properties!")

if __name__ == "__main__":
    update_hotels_catalog()
