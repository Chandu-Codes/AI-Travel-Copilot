import os
import json
import logging
from typing import Dict, Any, Optional, List
from ..config import settings
from ..rag.rag_engine import RAGEngine
from ..nlp.multilingual_engine import multilingual_engine, SUPPORTED_LANGUAGES

logger = logging.getLogger("gemini_service")

class GeminiTravelService:
    def __init__(self):
        self.rag = RAGEngine()
        self.model = None
        self._init_client()

    def _init_client(self):
        """Configures the google.generativeai client using the provided Gemini key."""
        api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY", "")
        if not api_key:
            logger.warning("No GEMINI_API_KEY found. Local Multilingual RAG mode active.")
            return

        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            
            # Primary ultra-fast and capable models supported for this API key
            candidate_models = ["gemini-3.5-flash", "gemini-3.7-flash", "gemini-flash-latest", "gemini-3-flash-preview", "gemini-pro-latest"]
            for m_name in candidate_models:
                try:
                    self.model = genai.GenerativeModel(m_name)
                    logger.info(f"Gemini API successfully connected with model: {m_name}")
                    break
                except Exception as e:
                    logger.warning(f"Could not initialize {m_name}: {e}")
                    continue
        except Exception as e:
            logger.warning(f"Error configuring Gemini client: {e}")
            self.model = None

    def is_available(self) -> bool:
        return self.model is not None

    def chat_with_gemini(
        self,
        user_message: str,
        language: str = "en",
        destination_hint: Optional[str] = None,
        duration_days: Optional[int] = None,
        budget_inr: Optional[float] = None,
        itinerary_days: Optional[List[Dict[str, Any]]] = None
    ) -> Optional[str]:
        """
        Calls Gemini API with grounded RAG knowledge and multilingual instructions.
        Returns the localized natural language response from Gemini.
        """
        if not self.model:
            self._init_client()

        if not self.model:
            return None

        lang_info = SUPPORTED_LANGUAGES.get(language, SUPPORTED_LANGUAGES["en"])
        target_lang = lang_info["name"]
        target_native = lang_info["native"]

        # 1. Retrieve RAG grounded data
        grounding_data = ""
        if destination_hint:
            docs = self.rag.query(destination_hint, top_k=15)
            if docs:
                grounding_data += f"\n--- VERIFIED DATASET ATTRACTIONS FOR {destination_hint.upper()} ---\n"
                for i, d in enumerate(docs[:10], 1):
                    grounding_data += f"{i}. {d.get('name')}: {d.get('category')} | Best Time: {d.get('time_of_day', 'Morning')} | Cost: ₹{d.get('cost_inr', 0)} | Desc: {d.get('description', '')[:100]}\n"

        if itinerary_days:
            grounding_data += f"\n--- GENERATED ROUTE SEQUENCE ---\n"
            for d in itinerary_days:
                day_num = d.get('day_number', 1)
                theme = d.get('theme', '')
                acts = [a.get('name', '') for a in d.get('activities', [])]
                grounding_data += f"Day {day_num} ({theme}): {', '.join(acts)}\n"

        # 2. System Instructions
        system_instructions = (
            f"You are the 'AI Travel Copilot', an expert autonomous multilingual travel intelligence assistant.\n"
            f"USER LANGUAGE: {target_lang} ({target_native}).\n"
            f"CRITICAL MANDATE: You MUST write your entire response naturally, fluently, and engagingly in {target_lang} ({target_native}).\n"
            f"- If the language is Telugu (తెలుగు), reply in pure, natural Telugu script.\n"
            f"- If the language is Hindi (हिन्दी), reply in natural Devanagari Hindi script.\n"
            f"- If the language is Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Spanish, French, Japanese, or English, reply fluently in that respective language.\n\n"
            f"GROUNDED TRAVEL DATASET:\n{grounding_data}\n\n"
            f"RESPONSE GUIDELINES:\n"
            f"1. Directly address the user's query and travel intentions with warmth and domain expertise.\n"
            f"2. When planning trips or giving recommendations, reference the verified sights and practical timings from the grounded data.\n"
            f"3. Include local culinary delicacies, weather tips, travel safety advice, and budget breakdowns formatted in Indian Rupees (₹).\n"
            f"4. Format your response cleanly with bold titles, bullet points, and numbered steps.\n"
        )

        full_prompt = f"{system_instructions}\nUser Query: {user_message}"

        try:
            response = self.model.generate_content(
                full_prompt,
                request_options={"timeout": 35.0}
            )
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            logger.error(f"Gemini generation call failed: {e}")
            return None

        return None

gemini_service = GeminiTravelService()
