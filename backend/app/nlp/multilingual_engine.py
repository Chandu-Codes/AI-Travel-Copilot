import re
from typing import Dict, Any, Tuple, Optional

# Supported language codes and names
SUPPORTED_LANGUAGES = {
    "en": {"name": "English", "native": "English", "flag": "🇬🇧"},
    "te": {"name": "Telugu", "native": "తెలుగు", "flag": "🇮🇳"},
    "hi": {"name": "Hindi", "native": "हिन्दी", "flag": "🇮🇳"},
    "ta": {"name": "Tamil", "native": "தமிழ்", "flag": "🇮🇳"},
    "kn": {"name": "Kannada", "native": "ಕನ್ನಡ", "flag": "🇮🇳"},
    "es": {"name": "Spanish", "native": "Español", "flag": "🇪🇸"},
    "fr": {"name": "French", "native": "Français", "flag": "🇫🇷"},
    "de": {"name": "German", "native": "Deutsch", "flag": "🇩🇪"},
    "ja": {"name": "Japanese", "native": "日本語", "flag": "🇯🇵"}
}

# Multilingual Destination Name Normalizer Dictionary
MULTILINGUAL_DESTINATION_MAP = {
    # Telugu
    "హైదరాబాద్": "Hyderabad",
    "హైదరాబాదు": "Hyderabad",
    "గోవా": "Goa",
    "మనాలి": "Manali",
    "జైపూర్": "Jaipur",
    "కేరళ": "Kerala",
    "ముంబై": "Mumbai",
    "చెన్నై": "Chennai",
    "బెంగళూరు": "Bengaluru",
    "ఢిల్లీ": "Delhi",
    "లడఖ్": "Ladakh",
    "కాశీ": "Varanasi",
    "వారణాసి": "Varanasi",
    "ఆగ్రా": "Agra",
    "వైజాగ్": "Visakhapatnam",
    "విశాఖపట్నం": "Visakhapatnam",
    "స్విట్జర్లాండ్": "Switzerland",
    "స్విట్జర్లాండు": "Switzerland",
    "పారిస్": "Paris",
    "జపాన్": "Japan",
    "టోక్యో": "Tokyo",
    "దుబాయ్": "Dubai",
    "బాలి": "Bali",
    "మాల్దీవులు": "Maldives",
    "లండన్": "London",
    "రోమ్": "Rome",
    "సింగపూర్": "Singapore",
    "థాయిలాండ్": "Thailand",
    "నేపాల్": "Nepal",
    "అమెరికా": "USA",

    # Hindi
    "हैदराबाद": "Hyderabad",
    "गोवा": "Goa",
    "मनाली": "Manali",
    "जयपुर": "Jaipur",
    "केरल": "Kerala",
    "मुंबई": "Mumbai",
    "चेन्नई": "Chennai",
    "बेंगलुरु": "Bengaluru",
    "दिल्ली": "Delhi",
    "लद्दाख": "Ladakh",
    "वाराणसी": "Varanasi",
    "आगरा": "Agra",
    "विशाखापत्तनम": "Visakhapatnam",
    "स्विट्जरलैंड": "Switzerland",
    "पेरिस": "Paris",
    "जापान": "Japan",
    "टोक्यो": "Tokyo",
    "दुबई": "Dubai",
    "बाली": "Bali",
    "मालदीव": "Maldives",
    "लंदन": "London",
    "रोम": "Rome",
    "सिंगापुर": "Singapore",
    "थाईलैंड": "Thailand",
    "नेपाल": "Nepal",
    "अमेरिका": "USA",

    # Tamil
    "ஹைதராபாத்": "Hyderabad",
    "கோவா": "Goa",
    "மணாலி": "Manali",
    "ஜெய்ப்பூர்": "Jaipur",
    "கேரளா": "Kerala",
    "மும்பை": "Mumbai",
    "சென்னை": "Chennai",
    "சுவிட்சர்லாந்து": "Switzerland",
    "பாரிஸ்": "Paris",
    "ஜப்பான்": "Japan",
    "துபாய்": "Dubai",

    # Kannada
    "ಹೈದರಾಬಾದ್": "Hyderabad",
    "ಗೋವಾ": "Goa",
    "ಮನಾಲೀ": "Manali",
    "ಜೈಪುರ": "Jaipur",
    "ಕೇರಳ": "Kerala",
    "ಮುಂಬೈ": "Mumbai",
    "ಬೆಂಗಳೂರು": "Bengaluru",
    "ಸ್ವಿಟ್ಜರ್ಲೆಂಡ್": "Switzerland",
    "ಪ್ಯಾರಿಸ್": "Paris",
    "ಜಪಾನ್": "Japan",
    "ದುಬೈ": "Dubai"
}

# Multilingual Response Templates
TEMPLATES = {
    "en": {
        "welcome": "Hello! I am your **AI Travel Copilot**. I can plan multi-day trips, optimize your budgets, track flight delays, and provide real-time suggestions in English, Telugu, Hindi, Tamil, and more.\n\nTry asking:\n• *'Plan a 5-day trip to Switzerland under ₹2,00,000'*\n• *'Is my flight 6E-204 on time?'*\n• *'How can I optimize my travel budget by 20%?'*",
        "plan_intro": "Great choice! Here is your customized **{days}-Day {dest} Itinerary** tailored to your budget of ₹{budget:,.0f}.",
        "flight_alert": "⚠️ **Flight Disruption Detected**: Flight **{flight}** is delayed by **{delay}**.\n\nAutomated adjustments have been applied to your itinerary:",
        "budget_tips": "💡 **Budget Optimization Tips**:\n1. **Accommodations**: Choosing verified boutique homestays saves ~25%.\n2. **Flights**: Booking 14–21 days in advance saves up to ₹3,500/ticket.\n3. **Activities**: Pre-booking combo passes saves up to 30% on entrance fees."
    },
    "te": {
        "welcome": "నమస్కారం! నేను మీ **AI ట్రావెల్ కోపైలట్**. మీకోసం ట్రిప్ ప్లాన్లు రూపొందించడం, బడ్జెట్ ఆప్టిమైజ్ చేయడం, ఫ్లైట్ వివరాలు మరియు లైవ్ అప్‌డేట్స్ అందించడంలో నేను సహాయపడతాను.\n\nనన్ను ఇలా అడగండి:\n• *'గోవాకి 5 రోజుల ట్రిప్ ప్లాన్ చేయండి'* (లేదా) *'స్విట్జర్లాండ్‌కు ₹2,00,000 బడ్జెట్‌లో ట్రిప్ ప్లాన్ చేయండి'*\n• *'నా ఫ్లైట్ 6E-204 సమయానికి ఉందా?'*\n• *'హైదరాబాద్‌లో చూడదగ్గ ముఖ్యమైన ప్రదేశాలు ఏమిటి?'*",
        "plan_intro": "అద్భుతమైన ప్రదేశం! మీ ₹{budget:,.0f} బడ్జెట్‌కు అనుగుణంగా రూపొందించిన **{days} రోజుల {dest} ప్రయాణ ప్రణాళిక (Itinerary)** ఇక్కడ సిద్ధంగా ఉంది.",
        "flight_alert": "⚠️ **విమాన ఆలస్యం హెచ్చరిక**: ఫ్లైట్ **{flight}** సుమారు **{delay}** ఆలస్యంగా నడుస్తోంది.\n\nమీ ట్రిప్ షెడ్యూల్‌లో స్వయంచాలక మార్పులు చేయబడ్డాయి:",
        "budget_tips": "💡 **బడ్జెట్ ఆదా సూచనలు**:\n1. **వసతి**: ధృవీకరించబడిన హోమ్‌స్టేలు ఎంచుకోవడం ద్వారా 25% వరకు ఆదా చేయవచ్చు.\n2. **విమానాలు**: ప్రయాణానికి 2-3 వారాల ముందే బుక్ చేసుకుంటే తక్కువ ధరలో లభిస్తాయి.\n3. **సందర్శన**: ఆన్‌లైన్ కాంబో పాస్‌ల ద్వారా ప్రవేశ రుసుములలో 30% వరకు ఆదా అవుతుంది."
    },
    "hi": {
        "welcome": "नमस्ते! मैं आपका **AI ट्रैवल कोपायलट** हूँ। मैं आपके लिए यात्रा योजनाएँ बनाने, बजट अनुकूलित करने, फ़्लाइट स्थिति ट्रैक करने और यात्रा संबंधी सभी जानकारी देने में सक्षम हूँ।\n\nआप मुझसे पूछ सकते हैं:\n• *'स्विट्जरलैंड के लिए 5 दिन की ट्रिप ₹2,00,000 के बजट में प्लान करें'*\n• *'क्या मेरी फ्लाइट 6E-204 समय पर है?'*\n• *'गोवा में घूमने की सबसे अच्छी जगहें कौन सी हैं?'*",
        "plan_intro": "शानदार चुनाव! आपके ₹{budget:,.0f} के बजट के अनुसार तैयार की गई **{days} दिवसीय {dest} यात्रा योजना (Itinerary)** यहाँ है।",
        "flight_alert": "⚠️ **फ़्लाइट विलंब सूचना**: फ़्लाइट **{flight}** लगभग **{delay}** की देरी से चल रही है।\n\nआपकी यात्रा योजना में स्वतः समायोजन कर दिए गए हैं:",
        "budget_tips": "💡 **बजट बचत के सुझाव**:\n1. **होटल**: बुटीक होमस्टे या 4-स्टार होटल चुनकर 25% तक बचत करें।\n2. **उड़ानें**: 14-21 दिन पहले बुकिंग करने पर टिकटों पर अच्छी छूट मिलती है।\n3. **गतिविधियाँ**: पर्यटन स्थलों के कॉम्बो पास पहले से बुक करें।"
    },
    "ta": {
        "welcome": "வணக்கம்! நான் உங்கள் **AI டிராவல் கோபைலட்**. உங்கள் பயணத் திட்டங்களை உருவாக்கவும், பட்ஜெட்டை சீரமைக்கவும், விமான விவரங்களை அறியவும் நான் உங்களுக்கு உதவுவேன்.\n\nஎடுத்துக்காட்டு:\n• *'கோவாவுக்கு 5 நாள் பயணத் திட்டம் தயார் செய்க'*\n• *'விமானம் 6E-204 சரியான நேரத்தில் உள்ளதா?'*",
        "plan_intro": "சிறந்த தேர்வு! உங்கள் ₹{budget:,.0f} பட்ஜெட்டுக்கு ஏற்ற **{days} நாட்கள் {dest} பயணத் திட்டம்** இதோ.",
        "flight_alert": "⚠️ **விமான தாமத எச்சரிக்கை**: விமானம் **{flight}** சுமார் **{delay}** தாமதமாக இயங்குகிறது.",
        "budget_tips": "💡 **பட்ஜெட் சேமிப்பு குறிப்புகள்**:\n1. முன்பதிவு செய்வதன் மூலம் 25% வரை சேமிக்கலாம்.\n2. சுற்றுலா தலங்களுக்கு காம்போ பாஸ்களைப் பயன்படுத்துங்கள்."
    },
    "kn": {
        "welcome": "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ **AI ಟ್ರಾವೆಲ್ ಕೋಪೈಲಟ್**. ನಿಮ್ಮ ಪ್ರವಾಸ ಯೋಜನೆ, ಬಜೆಟ್ ನಿರ್ವಹಣೆ ಮತ್ತು ವಿಮಾನ ವಿವರಗಳನ್ನು ಸುಲಭವಾಗಿ ಒದಗಿಸುತ್ತೇನೆ.\n\nನೀವು ಕೇಳಬಹುದು:\n• *'ಗೋವಾಗೆ 5 ದಿನಗಳ ಪ್ರವಾಸ ಯೋಜನೆ ಮಾಡಿ'*\n• *'ನನ್ನ ವಿಮಾನ 6E-204 ಸರಿಯಾದ ಸಮಯದಲ್ಲಿದೆಯೇ?'*",
        "plan_intro": "ಅತ್ಯುತ್ತಮ ಆಯ್ಕೆ! ನಿಮ್ಮ ₹{budget:,.0f} ಬಜೆಟ್‌ಗೆ ತಕ್ಕಂತೆ ತಯಾರಿಸಿದ **{days} ದಿನಗಳ {dest} ಪ್ರವಾಸ ಯೋಜನೆ** ಇಲ್ಲಿದೆ.",
        "flight_alert": "⚠️ **ವಿಮಾನ ವಿಳಂಬ ಸೂಚನೆ**: ವಿಮಾನ **{flight}** ಸುಮಾರು **{delay}** ವಿಳಂಬವಾಗಿದೆ.",
        "budget_tips": "💡 **ಬಜೆಟ್ ಉಳಿತಾಯ ಸಲಹೆಗಳು**:\n1. ಮುಂಚಿತವಾಗಿ ಬುಕಿಂಗ್ ಮಾಡುವ ಮೂಲಕ 25% ವರೆಗೆ ಉಳಿಸಿ.\n2. ಕಾಂಬೊ ಪಾಸ್‌ಗಳನ್ನು ಬಳಸಿ."
    },
    "es": {
        "welcome": "¡Hola! Soy tu **AI Travel Copilot**. Puedo planificar itinerarios completos, optimizar presupuestos y rastrear vuelos.\n\nPrueba a preguntar:\n• *'Planifica un viaje de 5 días a Suiza con ₹2,00,000'*\n• *'¿Mi vuelo 6E-204 está a tiempo?'*",
        "plan_intro": "¡Excelente elección! Aquí tienes tu **Itinerario de {days} Días en {dest}** adaptado a tu presupuesto de ₹{budget:,.0f}.",
        "flight_alert": "⚠️ **Disrupción de Vuelo Detectada**: El vuelo **{flight}** tiene un retraso de **{delay}**.",
        "budget_tips": "💡 **Consejos de Optimización de Presupuesto**:\n1. Reserva estancias boutique para ahorrar un 25%.\n2. Reserva vuelos con 2-3 semanas de antelación."
    },
    "fr": {
        "welcome": "Bonjour ! Je suis votre **AI Travel Copilot**. Je peux créer des itinéraires personnalisés, optimiser votre budget et suivre les vols.\n\nEssayez de demander :\n• *'Planifiez un voyage de 5 jours en Suisse pour ₹2,00,000'*\n• *'Mon vol 6E-204 est-il à l'heure ?'*",
        "plan_intro": "Excellent choix ! Voici votre **Itinéraire de {days} jours à {dest}** adapté à votre budget de ₹{budget:,.0f}.",
        "flight_alert": "⚠️ **Perturbation de vol détectée** : Le vol **{flight}** est retardé de **{delay}**.",
        "budget_tips": "💡 **Astuces Budgétaires** :\n1. Réservez des séjours authentiques pour économiser 25%.\n2. Réservez vos billets d'avion à l'avance."
    },
    "ja": {
        "welcome": "こんにちは！私はあなたの **AI トラベル コパイロット** です。旅行プランの作成、予算の最適化、フライト情報の確認などを多言語でサポートします。\n\n質問例：\n• *'スイスへの5日間の旅行プランを作成して'*\n• *'フライト6E-204は定刻通りですか？'*",
        "plan_intro": "素晴らしい選択です！ご予算 ₹{budget:,.0f} に合わせた **{dest} {days}日間の旅行日程 (Itinerary)** を作成しました。",
        "flight_alert": "⚠️ **フライト遅延のお知らせ**: 便名 **{flight}** は **{delay}** 遅延しています。",
        "budget_tips": "💡 **予算節約のアドバイス**:\n1. 早期予約で宿泊費を最大25%節約。\n2. 観光施設のセット券を活用。"
    }
}

class MultilingualEngine:
    def detect_language(self, text: str, user_lang: Optional[str] = None) -> str:
        """Detects language script from user text or respects explicit user_lang code."""
        if user_lang and user_lang in SUPPORTED_LANGUAGES:
            return user_lang

        # Telugu Unicode Range [\u0C00-\u0C7F]
        if re.search(r'[\u0C00-\u0C7F]', text):
            return "te"
        # Hindi/Devanagari Unicode Range [\u0900-\u097F]
        if re.search(r'[\u0900-\u097F]', text):
            return "hi"
        # Tamil Unicode Range [\u0B80-\u0BFF]
        if re.search(r'[\u0B80-\u0BFF]', text):
            return "ta"
        # Kannada Unicode Range [\u0C80-\u0CFF]
        if re.search(r'[\u0C80-\u0CFF]', text):
            return "kn"
        # Japanese Unicode Range [\u3040-\u30FF\u4E00-\u9FAF]
        if re.search(r'[\u3040-\u30FF\u4E00-\u9FAF]', text):
            return "ja"

        return "en"

    def normalize_destination(self, text: str) -> Optional[str]:
        """Maps non-English or vernacular destination names into standard English entity names."""
        for native_name, std_name in MULTILINGUAL_DESTINATION_MAP.items():
            if native_name.lower() in text.lower():
                return std_name
        return None

    def get_template(self, lang_code: str, key: str, **kwargs) -> str:
        """Retrieves and formats a localized response string."""
        lang_dict = TEMPLATES.get(lang_code, TEMPLATES["en"])
        tmpl = lang_dict.get(key, TEMPLATES["en"].get(key, ""))
        try:
            return tmpl.format(**kwargs)
        except Exception:
            return tmpl

multilingual_engine = MultilingualEngine()
