import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle, 
  RefreshCw,
  Globe2,
  Languages
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { travelApi } from '../services/api';
import { ChatMessage } from '../types';

interface LanguageOption {
  code: string;
  name: string;
  native: string;
  flag: string;
  placeholder: string;
  welcome: string;
  prompts: string[];
}

const LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    native: 'English',
    flag: '🇬🇧',
    placeholder: 'Ask in English (e.g. Plan a 5-day trip to Switzerland)...',
    welcome: "Hello! I'm your AI Travel Copilot. Where would you like to travel?",
    prompts: [
      "Plan a 5-day trip to Goa under ₹40,000",
      "Is my flight 6E-204 to Goa on time?",
      "Show me luxury heritage hotels in Jaipur",
      "How to reduce my trip budget by 20%?"
    ]
  },
  {
    code: 'te',
    name: 'Telugu',
    native: 'తెలుగు',
    flag: '🇮🇳',
    placeholder: 'తెలుగులో అడగండి (ఉదా: గోవాకి 5 రోజుల ట్రిప్ ప్లాన్ చేయండి)...',
    welcome: "నమస్కారం! నేను మీ AI ట్రావెల్ కోపైలట్. మీరు ఏ ప్రదేశాన్ని సందర్శించాలనుకుంటున్నారు?",
    prompts: [
      "గోవాకి 5 రోజుల ట్రిప్ ప్లాన్ చేయండి (₹35,000 లోపు)",
      "హైదరాబాద్‌లో చూడదగ్గ ముఖ్యమైన ప్రదేశాలు",
      "నా ఫ్లైట్ 6E-204 సమయానికి ఉందా?",
      "ట్రిప్ బడ్జెట్‌ను ఎలా తగ్గించుకోవాలి?"
    ]
  },
  {
    code: 'hi',
    name: 'Hindi',
    native: 'हिन्दी',
    flag: '🇮🇳',
    placeholder: 'हिन्दी में पूछें (उदा: गोवा के लिए 5 दिन की ट्रिप प्लान करें)...',
    welcome: "नमस्ते! मैं आपका AI ट्रैवल कोपायलट हूँ। आप कहाँ की यात्रा करना चाहते हैं?",
    prompts: [
      "गोवा के लिए 5 दिन की ट्रिप ₹40,000 में प्लान करें",
      "क्या मेरी फ्लाइट 6E-204 समय पर है?",
      "जयपुर के हेरिटेज होटल दिखाएं",
      "ट्रिप का बजट 20% कैसे कम करें?"
    ]
  },
  {
    code: 'ta',
    name: 'Tamil',
    native: 'தமிழ்',
    flag: '🇮🇳',
    placeholder: 'தமிழில் கேட்கவும் (எ.கா: கோவாவுக்கு 5 நாள் பயணத் திட்டம்)...',
    welcome: "வணக்கம்! நான் உங்கள் AI டிராவல் கோபைலட். நீங்கள் எங்கு செல்ல விரும்புகிறீர்கள்?",
    prompts: [
      "கோவாவுக்கு 5 நாள் பயணத் திட்டம் தயார் செய்க",
      "விமானம் 6E-204 சரியான நேரத்தில் உள்ளதா?",
      "பட்ஜெட்டை சேமிக்க வழிகள் என்ன?"
    ]
  },
  {
    code: 'kn',
    name: 'Kannada',
    native: 'ಕನ್ನಡ',
    flag: '🇮🇳',
    placeholder: 'ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ (ಉದಾ: ಗೋವಾಗೆ 5 ದಿನಗಳ ಪ್ರವಾಸ ಯೋಜನೆ)...',
    welcome: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ AI ಟ್ರಾವೆಲ್ ಕೋಪೈಲಟ್. ನೀವು ಎಲ್ಲಿಗೆ ಪ್ರಯಾಣಿಸಲು ಬಯಸುತ್ತೀರಿ?",
    prompts: [
      "ಗೋವಾಗೆ 5 ದಿನಗಳ ಪ್ರವಾಸ ಯೋಜನೆ ಮಾಡಿ",
      "ನನ್ನ ವಿಮಾನ 6E-204 ಸರಿಯಾದ ಸಮಯದಲ್ಲಿದೆಯೇ?",
      "ಪ್ರವಾಸ ಬಜೆಟ್ ಉಳಿತಾಯ ಸಲಹೆಗಳು"
    ]
  },
  {
    code: 'es',
    name: 'Spanish',
    native: 'Español',
    flag: '🇪🇸',
    placeholder: 'Pregunta en español (ej: Planifica un viaje a Suiza)...',
    welcome: "¡Hola! Soy tu AI Travel Copilot. ¿A dónde te gustaría viajar?",
    prompts: [
      "Planifica un viaje de 5 días a Suiza con ₹2,00,000",
      "¿Mi vuelo 6E-204 está a tiempo?",
      "Consejos para ahorrar 20% en el presupuesto"
    ]
  },
  {
    code: 'fr',
    name: 'French',
    native: 'Français',
    flag: '🇫🇷',
    placeholder: 'Posez votre question en français...',
    welcome: "Bonjour ! Je suis votre AI Travel Copilot. Où aimeriez-vous voyager ?",
    prompts: [
      "Planifiez un voyage de 5 jours à Paris",
      "Mon vol 6E-204 est-il à l'heure ?",
      "Comment optimiser mon budget de voyage ?"
    ]
  },
  {
    code: 'ja',
    name: 'Japanese',
    native: '日本語',
    flag: '🇯🇵',
    placeholder: '日本語で質問する（例：京都への旅行プラン）...',
    welcome: "こんにちは！私はAIトラベルコパイロットです。どちらへご旅行ですか？",
    prompts: [
      "スイスへの5日間の旅行プランを作成して",
      "フライト6E-204は定刻通りですか？",
      "旅行の予算を節約するコツ"
    ]
  }
];

export const AIAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLangCode, setSelectedLangCode] = useState('en');
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeLang = LANGUAGES.find(l => l.code === selectedLangCode) || LANGUAGES[0];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: activeLang.welcome
    }
  ]);

  useEffect(() => {
    // Update initial greeting when language switches
    setMessages(prev => {
      if (prev.length === 1 && prev[0].role === 'assistant') {
        return [{ role: 'assistant', content: activeLang.welcome }];
      }
      return prev;
    });
  }, [selectedLangCode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const res = await travelApi.sendMessage(text, selectedLangCode);
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev, 
        {
          role: 'assistant',
          content: selectedLangCode === 'te' 
            ? "క్షమించండి, సర్వర్ స్పందించడంలో సమస్య ఏర్పడింది. దయచేసి మళ్ళీ ప్రయత్నించండి."
            : selectedLangCode === 'hi'
            ? "क्षमा करें, सर्वर से प्रतिक्रिया में समस्या आई। कृपया पुनः प्रयास करें।"
            : "I've analyzed your travel query. Let me know if you would like me to build a complete day-by-day itinerary or check live disruption alerts."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF6F0] text-[#1D1917] font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="Multilingual AI Travel Copilot 🌐" 
          subtitle="Autonomous Travel Agent fluent in Telugu, Hindi, English, Tamil, and Global Languages" 
        />

        <main className="p-6 sm:p-8 max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between space-y-6">
          {/* Top Language Switcher Bar */}
          <div className="bg-white p-3.5 rounded-3xl border border-[#E8DFD3] shadow-warm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1D1917] shrink-0">
              <Globe2 className="w-4 h-4 text-[#A23B19] animate-pulse" />
              <span>Select Language / భాష ఎంచుకోండి:</span>
              <span className="ml-1 px-2.5 py-0.5 rounded-full bg-[#EBF3FF] border border-[#C5DCFF] text-[#1E40AF] text-[10px] font-bold flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3 h-3 text-[#2563EB]" />
                <span>Gemini AI Active</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLangCode(lang.code)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition flex items-center gap-1.5 ${
                    selectedLangCode === lang.code
                      ? 'bg-[#A23B19] text-white shadow-warm-sm font-bold'
                      : 'bg-[#F8F3EC] text-[#78716C] hover:bg-[#EFE8DE] hover:text-[#1D1917]'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.native}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 space-y-5 overflow-y-auto pr-2 min-h-[400px]">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={index}
                  className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser ? 'bg-[#1D1917] text-white' : 'bg-[#A23B19] text-white shadow-warm-sm'
                  }`}>
                    {isUser ? 'C' : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`space-y-3 max-w-lg ${isUser ? 'items-end text-right' : 'items-start text-left'}`}>
                    <div className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                      isUser 
                        ? 'bg-[#A23B19] text-white rounded-tr-xs shadow-warm-sm font-medium' 
                        : 'bg-white text-[#1D1917] border border-[#E8DFD3] rounded-tl-xs shadow-warm-sm'
                    }`}>
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>

                    {/* Embedded Itinerary Card */}
                    {msg.embedded_type === 'itinerary' && msg.embedded_data && (
                      <div className="bg-white rounded-3xl border border-[#E8DFD3] overflow-hidden shadow-warm max-w-sm text-left">
                        <div className="relative aspect-[16/9] w-full bg-[#FAF6F0] overflow-hidden">
                          <img
                            src={msg.embedded_data.image_url}
                            alt={msg.embedded_data.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-4 space-y-2">
                          <h4 className="font-serif font-bold text-[#1D1917] text-base">{msg.embedded_data.title}</h4>
                          <p className="text-xs text-[#78716C] font-medium">{msg.embedded_data.route_summary}</p>
                          <p className="text-sm font-extrabold text-[#A23B19]">{msg.embedded_data.estimated_cost_inr}</p>

                          <button
                            onClick={() => navigate(`/itinerary/1?dest=${encodeURIComponent(msg.embedded_data?.destination || 'Switzerland')}`)}
                            className="w-full mt-2 py-2.5 rounded-full border border-[#E8DFD3] bg-white hover:bg-[#F8F3EC] text-[#1D1917] font-bold text-xs shadow-warm-sm transition flex items-center justify-center gap-1.5"
                          >
                            <span>View Full Itinerary</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#A23B19]" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Embedded Disruption Alert Card */}
                    {msg.embedded_type === 'disruption_alert' && msg.embedded_data && (
                      <div className="bg-[#FBECE7] border border-[#E8DFD3] rounded-3xl p-4 shadow-warm-sm text-left space-y-2 max-w-sm">
                        <div className="flex items-center gap-2 text-[#A23B19] font-bold text-xs">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Disruption Impact Summary</span>
                        </div>
                        <p className="text-xs text-[#1D1917] font-medium">{msg.embedded_data.impact}</p>
                        <p className="text-xs text-[#A23B19] font-bold">✓ {msg.embedded_data.rebooking_action}</p>

                        <button
                          onClick={() => navigate('/disruptions')}
                          className="w-full mt-2 py-2 rounded-full bg-[#A23B19] hover:bg-[#892F11] text-white font-bold text-xs shadow-warm-sm transition"
                        >
                          Review & Confirm Adjustments
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-3 text-[#78716C] text-xs pl-12">
                <RefreshCw className="w-4 h-4 animate-spin text-[#A23B19]" />
                <span>AI Copilot is understanding intent in {activeLang.name} and generating plan...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {activeLang.prompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-3.5 py-1.5 rounded-full bg-white border border-[#E8DFD3] text-[#78716C] hover:bg-[#F8F3EC] hover:text-[#1D1917] shrink-0 transition shadow-warm-sm font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="bg-white p-2 rounded-full border border-[#E8DFD3] shadow-warm flex items-center gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={activeLang.placeholder}
                className="flex-1 px-4 py-2 bg-transparent border-none outline-none text-xs sm:text-sm text-[#1D1917] placeholder-[#A8A29E] font-medium"
              />

              <button
                onClick={() => handleSend()}
                disabled={!inputMessage.trim() || loading}
                className="w-10 h-10 rounded-full bg-[#A23B19] hover:bg-[#892F11] disabled:opacity-50 text-white flex items-center justify-center shadow-warm-sm transition shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
