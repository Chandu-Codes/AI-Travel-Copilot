import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))
from app.agents.planner_agent import planner_agent

destinations = ['Tamil Nadu', 'Nepal', 'Mumbai', 'Bali', 'USA', 'Mexico']
for dest in destinations:
    it = planner_agent.generate_itinerary(dest, duration_days=2)
    print(f"=== DESTINATION: {dest} (Center: {it['destination_lat']}, {it['destination_lon']}) ===")
    for day in it['itinerary_days']:
        print(f"  {day['title']}")
        for act in day['activities']:
            print(f"    - {act['name']} [{act['category']}] -> GPS: ({act['lat']}, {act['lon']})")
    print()
