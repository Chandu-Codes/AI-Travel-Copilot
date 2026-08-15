import json
import os
import pulp

BENCHMARK_PATH = "datasets/budgets/budget_benchmarks.json"

class BudgetOptimizer:
    def __init__(self):
        self.benchmarks = self._load_benchmarks()

    def _load_benchmarks(self):
        if os.path.exists(BENCHMARK_PATH):
            try:
                with open(BENCHMARK_PATH, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception as e:
                print(f"Error loading budget benchmarks: {e}")
        return {
            "budget_split_rules": {
                "Budget_Backpacker": {"stay_pct": 25, "transport_pct": 35, "activities_pct": 20, "food_pct": 15, "buffer_pct": 5},
                "Mid_Range_Explorer": {"stay_pct": 35, "transport_pct": 25, "activities_pct": 20, "food_pct": 15, "buffer_pct": 5},
                "Luxury_Leisure": {"stay_pct": 50, "transport_pct": 20, "activities_pct": 15, "food_pct": 10, "buffer_pct": 5}
            }
        }

    def optimize_budget(self, total_budget_inr: float, travel_style: str = "Mid_Range_Explorer", 
                        duration_days: int = 5, travelers_count: int = 2):
        # Normalize travel style key
        style_key = "Mid_Range_Explorer"
        if "budget" in travel_style.lower() or "backpacker" in travel_style.lower() or "relaxed" in travel_style.lower():
            style_key = "Budget_Backpacker"
        elif "lux" in travel_style.lower() or "packed" in travel_style.lower():
            style_key = "Luxury_Leisure"

        splits = self.benchmarks["budget_split_rules"].get(style_key, self.benchmarks["budget_split_rules"]["Mid_Range_Explorer"])

        stay_alloc = round(total_budget_inr * (splits["stay_pct"] / 100.0), 2)
        transport_alloc = round(total_budget_inr * (splits["transport_pct"] / 100.0), 2)
        activities_alloc = round(total_budget_inr * (splits["activities_pct"] / 100.0), 2)
        food_alloc = round(total_budget_inr * (splits["food_pct"] / 100.0), 2)
        buffer_alloc = round(total_budget_inr * (splits["buffer_pct"] / 100.0), 2)

        total_estimated = stay_alloc + transport_alloc + activities_alloc + food_alloc
        remaining = buffer_alloc

        categories = [
            {"category": "Hotels & Stay", "allocated_inr": stay_alloc, "percentage": splits["stay_pct"], "description": f"₹{int(stay_alloc/duration_days):,}/night for {duration_days} nights ({travelers_count} guests)"},
            {"category": "Flights & Transport", "allocated_inr": transport_alloc, "percentage": splits["transport_pct"], "description": "Roundtrip flights + local cabs/scooters"},
            {"category": "Activities & Sights", "allocated_inr": activities_alloc, "percentage": splits["activities_pct"], "description": "Entry tickets, water sports, guided tours"},
            {"category": "Food & Dining", "allocated_inr": food_alloc, "percentage": splits["food_pct"], "description": f"₹{int(food_alloc/duration_days):,}/day for multi-cuisine meals & beach cafes"},
            {"category": "Emergency Buffer", "allocated_inr": buffer_alloc, "percentage": splits["buffer_pct"], "description": "Contingency reserve for spontaneous plans"}
        ]

        suggestions = [
            f"Allocating {splits['stay_pct']}% (₹{stay_alloc:,.0f}) to accommodations allows booking top-rated {style_key.replace('_', ' ')} properties.",
            f"Pre-booking flights 14 days in advance can save up to 18% on transportation.",
            f"Dining at recommended local cafes keeps daily food expense well within ₹{int(food_alloc/duration_days):,}."
        ]

        return {
            "total_budget_inr": total_budget_inr,
            "total_estimated_inr": total_estimated,
            "remaining_buffer_inr": remaining,
            "status": "Optimal",
            "categories": categories,
            "optimization_suggestions": suggestions
        }

budget_optimizer = BudgetOptimizer()
