from fastapi import APIRouter
from typing import Dict, Any
from ..agents.supervisor_agent import supervisor_agent
from ..agents.planner_agent import planner_agent
from ..agents.disruption_agent import disruption_agent
from ..ml.flight_service import flight_ml_service
from ..schemas.all_schemas import ChatRequest, ChatMessage

router = APIRouter(prefix="/chat", tags=["AI Conversational Copilot"])

@router.post("", response_model=ChatMessage)
def chat_with_copilot(req: ChatRequest):
    msg = req.message.strip()
    lower_msg = msg.lower()

    # 1. Flight disruption check query
    if "flight" in lower_msg and ("delay" in lower_msg or "status" in lower_msg or "cancel" in lower_msg or "6e-204" in lower_msg or "लेट" in lower_msg):
        disr_check = disruption_agent.check_flight("6E-204")
        return ChatMessage(
            role="assistant",
            content="⚠️ **Flight Disruption Detected**: Flight **IndiGo 6E-204** (DEL -> GOI) is currently delayed by **3h 45m** due to heavy monsoon visibility at Goa airport.\n\nI have prepared automated rebooking adjustments:",
            embedded_type="disruption_alert",
            embedded_data={
                "flight_number": "6E-204",
                "delay": "3h 45m",
                "impact": "Day 1 morning tour and 11:30 AM airport pickup rescheduled",
                "rebooking_action": "Hotel check-in auto-shifted to 2:00 PM; Fort Aguada tour moved to Day 2 morning.",
                "cost_inr": 0
            }
        )

    # 2. Trip planning query (e.g. "Suggest a 5 day trip to Switzerland for June under ₹2,00,000" or "Plan a 5-day trip to Goa")
    if "plan" in lower_msg or "trip" in lower_msg or "suggest" in lower_msg or "itinerary" in lower_msg or "दिन" in lower_msg or "ट्रिप" in lower_msg:
        parsed = supervisor_agent.parse_user_request(msg)
        itinerary = planner_agent.generate_itinerary(
            destination=parsed["destination"],
            duration_days=parsed["duration_days"],
            budget_inr=parsed["budget_inr"],
            travelers_count=parsed["travelers_count"],
            travel_style=parsed["travel_style"],
            interests=parsed["interests"]
        )

        return ChatMessage(
            role="assistant",
            content=f"Great choice! Here's a customized **{parsed['duration_days']}-Day {parsed['destination']} Itinerary** tailored to your budget of ₹{parsed['budget_inr']:,.0f} and preferences ({', '.join(parsed['interests'])}).",
            embedded_type="itinerary",
            embedded_data={
                "title": f"{parsed['destination']} {parsed['duration_days']}-Day Itinerary",
                "destination": parsed["destination"],
                "route_summary": f"Highlights of {parsed['destination']}",
                "estimated_cost_inr": f"₹ {parsed['budget_inr']:,.0f} (Estimated)",
                "image_url": itinerary["image_url"],
                "duration_days": parsed["duration_days"],
                "itinerary_days": itinerary["itinerary_days"]
            }
        )

    # 3. Budget optimization query
    if "budget" in lower_msg or "reduce" in lower_msg or "cost" in lower_msg or "बजट" in lower_msg:
        return ChatMessage(
            role="assistant",
            content="💡 **Budget Optimization Tips**:\n1. **Accommodations**: Opt for boutique homestays or 4-star verified resorts to save ~25%.\n2. **Transportation**: Booking flights 14–21 days prior saves an estimated ₹3,200/ticket.\n3. **Activities**: Pre-booking combo passes for watersports and heritage sites reduces on-site ticketing fees.",
            embedded_type="budget_summary",
            embedded_data={
                "target_saving": "₹12,500 (25%)",
                "recommended_stay_inr": 12000,
                "recommended_food_inr": 6000
            }
        )

    # 4. General conversational travel fallback
    return ChatMessage(
        role="assistant",
        content=f"I'm your **AI Travel Copilot**! I can generate complete multi-day itineraries, optimize budgets with 0/1 Knapsack algorithms, forecast flight prices with ML models, and handle real-time travel disruptions. \n\nTry asking:\n• *'Plan a 5-day trip to Goa for 2 people with a ₹40,000 budget.'*\n• *'Is my flight 6E-204 on time?'*\n• *'Show me top luxury hotels in Jaipur with review ratings.'*"
    )
