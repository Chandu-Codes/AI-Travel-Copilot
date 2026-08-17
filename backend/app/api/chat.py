from fastapi import APIRouter
from typing import Dict, Any
from ..agents.supervisor_agent import supervisor_agent
from ..agents.planner_agent import planner_agent
from ..agents.disruption_agent import disruption_agent
from ..ml.flight_service import flight_ml_service
from ..nlp.multilingual_engine import multilingual_engine, SUPPORTED_LANGUAGES
from ..services.gemini_service import gemini_service
from ..schemas.all_schemas import ChatRequest, ChatMessage

router = APIRouter(prefix="/chat", tags=["AI Conversational Copilot"])

@router.post("", response_model=ChatMessage)
def chat_with_copilot(req: ChatRequest):
    msg = req.message.strip()
    lower_msg = msg.lower()
    
    # 1. Detect language (Telugu, Hindi, Tamil, Kannada, English, etc.)
    lang = multilingual_engine.detect_language(msg, req.language)

    # 2. Flight disruption check query
    flight_keywords = ["flight", "delay", "status", "cancel", "6e-204", "ఫ్లైట్", "విమానం", "ఆలస్యం", "फ़्लाइट", "फ्लाइट", "देरी", "விமானம்", "தாமதம்", "ವಿಮಾನ", "ವೇಳೆ"]
    if any(k in lower_msg for k in flight_keywords) and any(d in lower_msg for d in ["delay", "status", "cancel", "6e-204", "late", "ఆలస్యం", "ఎప్పుడు", "देरी", "लेट", "தாமதம்", "ವೇಳೆ"]):
        disr_check = disruption_agent.check_flight("6E-204")
        
        # Try calling Gemini for rich conversational explanation
        gemini_reply = gemini_service.chat_with_gemini(
            user_message=msg,
            language=lang,
            destination_hint="Goa"
        )
        
        content_txt = gemini_reply if gemini_reply else multilingual_engine.get_template(
            lang, 
            "flight_alert", 
            flight="IndiGo 6E-204 (DEL -> GOI)", 
            delay="3h 45m"
        )
        
        return ChatMessage(
            role="assistant",
            content=content_txt,
            embedded_type="disruption_alert",
            embedded_data={
                "flight_number": "6E-204",
                "delay": "3h 45m",
                "impact": "Day 1 morning tour and 11:30 AM airport pickup rescheduled",
                "rebooking_action": "Hotel check-in auto-shifted to 2:00 PM; Fort Aguada tour moved to Day 2 morning.",
                "cost_inr": 0
            }
        )

    # 3. Trip planning query (e.g. "హైదరాబాద్‌కు 3 రోజుల ట్రిప్", "गोवा के लिए 5 दिन की ट्रिप", "Suggest a 5 day trip to Switzerland")
    plan_keywords = ["plan", "trip", "suggest", "itinerary", "ప్లాన్", "ట్రిప్", "ప్రయాణం", "రోజుల", "యोजना", "ट्रिप", "दिन", "திட்டம்", "பயணம்", "ಪ್ರವಾಸ", "ಯೋಜನೆ"]
    if any(k in lower_msg for k in plan_keywords) or any(d in lower_msg for d in ["day", "days", "రోజులు", "दिन", "நாட்கள்", "ದಿನಗಳು"]):
        # Extract vernacular or standard destination name
        normalized_dest = multilingual_engine.normalize_destination(msg)
        parsed = supervisor_agent.parse_user_request(msg)
        target_destination = normalized_dest if normalized_dest else parsed["destination"]
        
        # Generate authentic itinerary using our rich dataset and planner agent
        itinerary = planner_agent.generate_itinerary(
            destination=target_destination,
            duration_days=parsed["duration_days"],
            budget_inr=parsed["budget_inr"],
            travelers_count=parsed["travelers_count"],
            travel_style=parsed["travel_style"],
            interests=parsed["interests"]
        )

        # Call Gemini for a grounded, personalized itinerary narrative in the user's language
        gemini_reply = gemini_service.chat_with_gemini(
            user_message=msg,
            language=lang,
            destination_hint=target_destination,
            duration_days=parsed["duration_days"],
            budget_inr=parsed["budget_inr"],
            itinerary_days=itinerary.get("itinerary_days", [])
        )

        intro_txt = gemini_reply if gemini_reply else multilingual_engine.get_template(
            lang,
            "plan_intro",
            days=parsed["duration_days"],
            dest=target_destination,
            budget=parsed["budget_inr"]
        )

        return ChatMessage(
            role="assistant",
            content=intro_txt,
            embedded_type="itinerary",
            embedded_data={
                "title": f"{target_destination} {parsed['duration_days']}-Day Itinerary",
                "destination": target_destination,
                "route_summary": f"Highlights of {target_destination}",
                "estimated_cost_inr": f"₹ {parsed['budget_inr']:,.0f} (Estimated)",
                "image_url": itinerary["image_url"],
                "duration_days": parsed["duration_days"],
                "itinerary_days": itinerary["itinerary_days"]
            }
        )

    # 4. Budget optimization query
    budget_keywords = ["budget", "reduce", "cost", "save", "బడ్జెట్", "ఆదా", "తగ్గించ", "बजट", "खर्च", "कम", "பட்ஜெட்", "சேமிப்பு", "ಬಜೆಟ್", "ಉಳಿತಾಯ"]
    if any(k in lower_msg for k in budget_keywords):
        gemini_reply = gemini_service.chat_with_gemini(
            user_message=msg,
            language=lang
        )
        tips_txt = gemini_reply if gemini_reply else multilingual_engine.get_template(lang, "budget_tips")
        return ChatMessage(
            role="assistant",
            content=tips_txt,
            embedded_type="budget_summary",
            embedded_data={
                "target_saving": "₹12,500 (25%)",
                "recommended_stay_inr": 12000,
                "recommended_food_inr": 6000
            }
        )

    # 5. General conversational travel query (e.g. food advice, best season, culture, packing tips)
    gemini_reply = gemini_service.chat_with_gemini(
        user_message=msg,
        language=lang
    )
    if gemini_reply:
        return ChatMessage(
            role="assistant",
            content=gemini_reply
        )

    welcome_txt = multilingual_engine.get_template(lang, "welcome")
    return ChatMessage(
        role="assistant",
        content=welcome_txt
    )
