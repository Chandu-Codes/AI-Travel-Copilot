import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Calendar, 
  ArrowRight, 
  MapPin, 
  DollarSign, 
  AlertTriangle,
  RefreshCw,
  Compass
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { Navbar } from '../components/Navbar';
import { travelApi } from '../services/api';
import { ChatMessage } from '../types';

export const AIAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial chat history exactly matching reference UI
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI Travel Assistant. How can I help you today?"
    },
    {
      role: 'user',
      content: "Suggest a 5 day trip to Switzerland for June under ₹2,00,000"
    },
    {
      role: 'assistant',
      content: "Great choice! Here's a perfect 5-day Switzerland itinerary for you.",
      embedded_type: 'itinerary',
      embedded_data: {
        title: "Switzerland 5-Day Itinerary",
        route_summary: "Interlaken – Lucerne – Zurich",
        estimated_cost_inr: "₹ 1,80,000 (Estimated)",
        image_url: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80",
        destination: "Switzerland"
      }
    }
  ]);

  const suggestedPrompts = [
    "Plan a 5-day trip to Goa under ₹40,000",
    "Is my flight 6E-204 to Goa on time?",
    "Show me luxury heritage hotels in Jaipur",
    "How to reduce my trip budget by 20%?"
  ];

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
      const res = await travelApi.sendMessage(text);
      setMessages(prev => [...prev, res.data]);
    } catch (err) {
      console.error("Chat error:", err);
      // Fallback
      setMessages(prev => [
        ...prev, 
        {
          role: 'assistant',
          content: "I've analyzed your travel query. Let me know if you would like me to build a complete day-by-day itinerary or check live disruption alerts."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar 
          title="AI Travel Assistant" 
          subtitle="Ask me anything about travel, destinations, or your trip." 
        />

        <main className="p-8 max-w-4xl mx-auto w-full flex-1 flex flex-col justify-between space-y-6">
          {/* Header Banner */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold text-slate-900">AI Travel Assistant</h2>
            <p className="text-xs text-slate-500">Ask me anything about travel, destinations, or your trip.</p>
          </div>

          {/* Chat Messages Container */}
          <div className="flex-1 space-y-5 overflow-y-auto pr-2 min-h-[420px]">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div 
                  key={index}
                  className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  }`}>
                    {isUser ? 'C' : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Bubble */}
                  <div className={`space-y-3 max-w-lg ${isUser ? 'items-end text-right' : 'items-start text-left'}`}>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser 
                        ? 'bg-blue-600 text-white rounded-tr-xs shadow-md shadow-blue-500/20 font-medium' 
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs shadow-xs'
                    }`}>
                      <p className="whitespace-pre-line">{msg.content}</p>
                    </div>

                    {/* Embedded Itinerary Card (Matching Reference UI) */}
                    {msg.embedded_type === 'itinerary' && msg.embedded_data && (
                      <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-lg max-w-sm text-left">
                        <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                          <img
                            src={msg.embedded_data.image_url}
                            alt={msg.embedded_data.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-4 space-y-2">
                          <h4 className="font-bold text-slate-900 text-base">{msg.embedded_data.title}</h4>
                          <p className="text-xs text-slate-500 font-medium">{msg.embedded_data.route_summary}</p>
                          <p className="text-sm font-extrabold text-emerald-600">{msg.embedded_data.estimated_cost_inr}</p>

                          <button
                            onClick={() => navigate('/itinerary/1')}
                            className="w-full mt-2 py-2.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-white text-slate-800 hover:text-blue-600 font-bold text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                          >
                            <span>View Full Itinerary</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Embedded Disruption Alert Card */}
                    {msg.embedded_type === 'disruption_alert' && msg.embedded_data && (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm text-left space-y-2 max-w-sm">
                        <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                          <AlertTriangle className="w-4 h-4" />
                          <span>Disruption Impact Summary</span>
                        </div>
                        <p className="text-xs text-amber-900 font-medium">{msg.embedded_data.impact}</p>
                        <p className="text-xs text-emerald-700 font-bold">✓ {msg.embedded_data.rebooking_action}</p>

                        <button
                          onClick={() => navigate('/disruptions')}
                          className="w-full mt-2 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition"
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
              <div className="flex items-center gap-3 text-slate-400 text-xs pl-12">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span>AI Copilot is researching and generating recommendations...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600 shrink-0 transition shadow-2xs font-medium"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 flex items-center gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask anything about travel, flights, hotels, or itineraries..."
                className="flex-1 px-3 py-2 bg-transparent border-none outline-none text-sm text-slate-800 placeholder-slate-400 font-medium"
              />

              <button
                onClick={() => handleSend()}
                disabled={!inputMessage.trim() || loading}
                className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white flex items-center justify-center shadow-md shadow-blue-500/20 transition shrink-0"
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
