import sys
import os

# Add backend to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.agents.planner_agent import planner_agent

destinations_to_test = [
    "Tamil Nadu",
    "Nepal",
    "Mumbai",
    "Bali",
    "USA",
    "Mexico",
    "Hyderabad",
    "Visakhapatnam",
    "Bengaluru",
    "Delhi",
    "Goa",
    "Manali",
    "Jaipur",
    "Maldives",
    "Switzerland",
    "Paris",
    "Dubai"
]

def run_tests():
    print("=" * 65)
    print("TESTING 6-DAY ITINERARY UNIQUENESS ACROSS PAN-INDIA & GLOBAL")
    print("=" * 65)
    
    all_passed = True
    for dest in destinations_to_test:
        it = planner_agent.generate_itinerary(dest, duration_days=6)
        all_activities = []
        for day in it["itinerary_days"]:
            for act in day["activities"]:
                all_activities.append(act["name"])
                
        total_count = len(all_activities)
        unique_count = len(set(all_activities))
        has_duplicates = total_count != unique_count
        
        status = "PASSED" if not has_duplicates else "FAILED"
        print(f"[{status}] Destination: {dest:<14} | Total: {total_count} | Unique: {unique_count} | Duplicates: {total_count - unique_count}")
        
        if has_duplicates:
            all_passed = False
            print("  Duplicate items found:")
            from collections import Counter
            counts = Counter(all_activities)
            for item, c in counts.items():
                if c > 1:
                    print(f"    - {item} (x{c})")
                    
    print("=" * 65)
    if all_passed:
        print("SUCCESS: 100% of all places across all 6 days are distinct and unique!")
    else:
        print("FAILURE: Some duplicate places were detected.")
    print("=" * 65)

if __name__ == "__main__":
    run_tests()
