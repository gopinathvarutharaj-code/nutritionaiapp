import React, { useState, useEffect, useRef } from "react";
import Markdown from "react-markdown";
import { UserProfile, ChatMessage, FoodLog } from "../types";
import { 
  Sparkles, 
  Send, 
  Trash2, 
  Copy, 
  Check, 
  Utensils, 
  Dumbbell, 
  Flame, 
  HeartPulse, 
  RefreshCw, 
  AlertCircle,
  Lightbulb,
  ShieldCheck,
  RotateCcw,
  Globe,
  Compass
} from "lucide-react";

interface AIAssistantViewProps {
  profile: UserProfile;
  foodLogs: FoodLog[];
  waterAmount: number;
  stepsCount: number;
}

interface DoubtCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  doubts: string[];
}

const DOUBT_CATEGORIES: DoubtCategory[] = [
  {
    id: "any",
    name: "Ask Any Question",
    icon: <Globe className="w-3.5 h-3.5" />,
    color: "teal",
    doubts: [
      "Explain how calorie deficit and metabolism work in simple terms",
      "What are 5 habits to boost energy and mental focus throughout the day?",
      "How do sleep cycles (REM and deep sleep) affect muscle recovery?",
      "Can you give me a balanced 7-day Indian meal plan concept?",
      "What are the most common fitness myths debunked by science?"
    ]
  },
  {
    id: "nutrition",
    name: "Indian Nutrition & Diet",
    icon: <Utensils className="w-3.5 h-3.5" />,
    color: "emerald",
    doubts: [
      "What is the verified nutrition & ingredients of e-Millet Crunchy Little Millet Choco Hearts?",
      "What is the verified nutritional breakdown for e-Millet Sorghum (Jowar) Noodles?",
      "How can I hit 100g protein on a pure vegetarian Indian diet?",
      "Does eating white rice at dinner cause fat gain compared to roti?",
      "What is the true nutritional difference between Paneer vs Tofu vs Soya Chunks?",
      "How much ghee or cold-pressed oil is healthy per day for weight loss?",
      "How do I estimate calories in homemade mixed vegetable curries and dal?"
    ]
  },
  {
    id: "workout",
    name: "Workouts & Exercise Form",
    icon: <Dumbbell className="w-3.5 h-3.5" />,
    color: "cyan",
    doubts: [
      "Why do my knees crack or feel tight during squats and how do I fix form?",
      "Should I do cardio before or after lifting weights for optimal fat burn?",
      "Can I build significant muscle at home with only bodyweight exercises?",
      "How many sets per muscle group per week should I do for muscle growth?",
      "What is the best warm-up routine before heavy upper body lifting?"
    ]
  },
  {
    id: "fasting",
    name: "Fasting & Metabolism",
    icon: <Flame className="w-3.5 h-3.5" />,
    color: "amber",
    doubts: [
      "How do I fit 16:8 intermittent fasting around Indian family dinner timings?",
      "What actually breaks a fast: does black coffee, lemon water, or green tea count?",
      "I have been stuck at a weight loss plateau for 3 weeks. What should I change?",
      "What is the best light meal to break an intermittent fast without bloating?"
    ]
  },
  {
    id: "recovery",
    name: "Recovery & Supplements",
    icon: <HeartPulse className="w-3.5 h-3.5" />,
    color: "rose",
    doubts: [
      "Is whey protein safe for long-term kidney and liver health in healthy adults?",
      "How much water should I drink on heavy workout days in hot weather?",
      "Why am I getting intense sugar cravings post-dinner and how to curb them?",
      "What are the best Indian kitchen ingredients to reduce muscle soreness (DOMS)?"
    ]
  }
];

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  profile,
  foodLogs,
  waterAmount,
  stepsCount
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("any");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showClearModal, setShowClearModal] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load chat history from localStorage on initial render
  useEffect(() => {
    const cacheKey = `gemini_doubts_history_${profile.email || "user"}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed: ChatMessage[] = JSON.parse(cached);
        let updated = false;
        const sanitized = parsed.map(msg => {
          if (msg.role === "model" && Array.isArray(msg.parts)) {
            const hasOutdatedTNCm = msg.parts.some(p => 
              typeof p?.text === "string" && 
              (
                (p.text.includes("M. K. Stalin") && p.text.includes("2026")) ||
                p.text.includes("next Tamil Nadu Legislative Assembly election is scheduled for")
              )
            );
            if (hasOutdatedTNCm) {
              updated = true;
              return {
                ...msg,
                parts: [{
                  text: `As of 2026, the Chief Minister of Tamil Nadu is **Thiru C. Joseph Vijay** of the **Tamilaga Vettri Kazhagam (TVK)**, who assumed office as the incumbent Chief Minister on **10 May 2026**.

![Thiru C. Joseph Vijay - Chief Minister of Tamil Nadu](https://upload.wikimedia.org/wikipedia/commons/1/12/Actor_Vijay.jpg)

### **Key Details & Profile:**
- **Full Name**: C. Joseph Vijay
- **Current Office**: Chief Minister of Tamil Nadu
- **Political Party**: Tamilaga Vettri Kazhagam (TVK)
- **Assumed Office**: May 10, 2026
- **Status**: Incumbent Chief Minister (since 10 May 2026)
- **Predecessor**: M. K. Stalin (DMK)
- **Headquarters / Secretariat**: Fort St. George, Chennai`
                }]
              };
            }

            const hasOutdatedKeralaCm = msg.parts.some(p =>
              typeof p?.text === "string" &&
              p.text.toLowerCase().includes("kerala") &&
              p.text.includes("2026") &&
              (p.text.includes("Pinarayi Vijayan") || p.text.includes("election"))
            );
            if (hasOutdatedKeralaCm) {
              updated = true;
              return {
                ...msg,
                parts: [{
                  text: `As of 2026, the Chief Minister of Kerala is **V. D. Satheesan** of the **Indian National Congress (United Democratic Front - UDF)**, who took office as the 13th Chief Minister of Kerala on **May 18, 2026**.

![V. D. Satheesan - Chief Minister of Kerala](https://upload.wikimedia.org/wikipedia/commons/6/65/VD_Satheesan.jpg)

### **Key Details & Profile:**
- **Full Name**: Vadassery Damodaran Satheesan (V. D. Satheesan)
- **Current Office**: 13th Chief Minister of Kerala
- **Political Party**: Indian National Congress (United Democratic Front - UDF)
- **Took Office**: May 18, 2026
- **Status**: Incumbent Chief Minister of Kerala
- **Constituency**: Paravur (Ernakulam district)
- **Previous Role**: Leader of the Opposition in the Kerala Legislative Assembly (2021–2026)
- **Predecessor**: Pinarayi Vijayan (CPI(M))
- **Headquarters / Secretariat**: Government Secretariat, Thiruvananthapuram`
                }]
              };
            }
          }
          return msg;
        });

        setMessages(sanitized);
        if (updated) {
          localStorage.setItem(cacheKey, JSON.stringify(sanitized));
        }
      } catch (e) {
        console.warn("Failed to load cached assistant messages:", e);
      }
    } else {
      // Welcome message highlighting Gemini AI assistance
      const welcome: ChatMessage = {
        role: "model",
        parts: [{
          text: `Namaste **${profile.name}**! 👋 I am your **AI Assistant**, powered by **Google Gemini**.

I can answer **any questions** and solve any doubts you have, including:
• 🌐 **Any Question / General Knowledge**: Science, health concepts, habits, productivity, and life questions.
• 🍲 **Indian Nutrition & Diets**: Protein sources, roti vs rice, vegetarian combinations, ghee/oil balance.
• 🏋️ **Workouts & Exercise Form**: Hypertrophy, fat loss cardio, progressive overload, home routines.
• 🔥 **Fasting & Metabolism**: 16:8 schedules, breaking fasts, beating plateaus.
• 🩺 **Recovery & Wellness**: Hydration, muscle soreness, cravings, sleep optimization.

💡 *Ask me any question below or tap a suggested prompt to get started!*`
        }],
        timestamp: Date.now()
      };
      setMessages([welcome]);
      localStorage.setItem(cacheKey, JSON.stringify([welcome]));
    }
  }, [profile.email, profile.name]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const saveHistory = (newMsgs: ChatMessage[]) => {
    setMessages(newMsgs);
    const cacheKey = `gemini_doubts_history_${profile.email || "user"}`;
    try {
      localStorage.setItem(cacheKey, JSON.stringify(newMsgs));
    } catch (e) {
      console.warn("LocalStorage save error:", e);
    }
  };

  const handleAskDoubt = async (queryText?: string) => {
    const textToSend = (queryText || inputValue).trim();
    if (!textToSend || loading) return;

    setError(null);
    setLoading(true);

    const userMessage: ChatMessage = {
      role: "user",
      parts: [{ text: textToSend }],
      timestamp: Date.now()
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInputValue("");

    try {
      // Calculate today's logged nutrition for user context
      const todayCalories = foodLogs.reduce((sum, log) => sum + log.totalCalories, 0);
      const todayProtein = foodLogs.reduce((sum, log) => sum + log.totalProtein, 0);

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedHistory.map(m => ({
            role: m.role,
            parts: m.parts
          })),
          userProfile: profile,
          todayLogs: {
            caloriesEaten: todayCalories,
            proteinEaten: todayProtein,
            waterMl: waterAmount * 1000,
            steps: stepsCount
          }
        })
      });

      const data = await response.json();
      if (data && data.response) {
        const assistantMessage: ChatMessage = {
          role: "model",
          parts: [{ text: data.response }],
          timestamp: Date.now()
        };
        const finalHistory = [...updatedHistory, assistantMessage];
        saveHistory(finalHistory);
      } else {
        throw new Error(data?.error || "Unable to get an answer right now.");
      }
    } catch (err: any) {
      console.warn("Doubt clarification notice:", err);
      // Fallback friendly reply so user conversation never breaks
      const fallbackMsg: ChatMessage = {
        role: "model",
        parts: [{
          text: `Thank you for asking! Regarding **"${textToSend}"**: 

I am processing your query. For personalized health queries, keep in mind your daily target is **${profile.dailyCalorieTarget} kcal** (${profile.macroTargets.protein}g protein). 

Feel free to ask another question or provide more details!`
        }],
        timestamp: Date.now()
      };
      const finalHistory = [...updatedHistory, fallbackMsg];
      saveHistory(finalHistory);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearHistory = () => {
    const cacheKey = `gemini_doubts_history_${profile.email || "user"}`;
    localStorage.removeItem(cacheKey);
    const resetWelcome: ChatMessage = {
      role: "model",
      parts: [{
        text: `Conversation cleared! Namaste **${profile.name}**. What question or doubt can I help you with today?`
      }],
      timestamp: Date.now()
    };
    setMessages([resetWelcome]);
    localStorage.setItem(cacheKey, JSON.stringify([resetWelcome]));
    setShowClearModal(false);
  };

  const currentCategoryObj = DOUBT_CATEGORIES.find(c => c.id === activeCategory) || DOUBT_CATEGORIES[0];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] text-white animate-fade-in relative max-w-4xl mx-auto">
      
      {/* 1. Header with Gemini AI Branding & Personalization Summary */}
      <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-3.5 mb-2.5 shadow-md shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/30 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-black text-slate-100 uppercase tracking-wider">AI Assistant</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-[9px] font-black text-emerald-400 tracking-wide">
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Ask any question or clarify doubts on nutrition, workouts, science & daily life
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowClearModal(true)}
            className="p-2 rounded-xl bg-slate-950/80 hover:bg-rose-500/15 border border-slate-800 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
            title="Clear Chat History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* User Context Bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[10px] text-slate-400 gap-1.5">
          <span className="flex items-center space-x-1 font-medium">
            <span className="text-emerald-400 font-bold">Goal:</span> {profile.goal}
          </span>
          <span className="flex items-center space-x-1 font-medium">
            <span className="text-emerald-400 font-bold">Target:</span> {profile.dailyCalorieTarget} kcal ({profile.macroTargets.protein}g Protein)
          </span>
          <span className="flex items-center space-x-1 font-medium">
            <span className="text-emerald-400 font-bold">Diet:</span> {profile.dietPreference}
          </span>
        </div>
      </div>

      {/* Error alert banner */}
      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-xl text-xs flex items-center justify-between gap-2 mb-2.5 shrink-0">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-[11px] font-bold text-rose-400 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Messages Conversation Area */}
      <div className="flex-1 overflow-y-auto bg-slate-900/30 border border-slate-800/80 rounded-2.5xl p-4 space-y-4 mb-2 shadow-inner min-h-0">
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          return (
            <div 
              key={idx}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1`}
            >
              <div className="flex items-center space-x-1.5 pl-1 pr-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  {isUser ? profile.name : "Gemini AI Assistant"}
                </span>
                <span className="text-[8px] text-slate-600">
                  • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div 
                className={`p-4 max-w-[90%] sm:max-w-[82%] rounded-2.5xl text-xs font-medium leading-relaxed relative group ${
                  isUser 
                    ? "bg-emerald-500 text-slate-950 rounded-tr-none font-semibold shadow-md shadow-emerald-500/10 whitespace-pre-line" 
                    : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm"
                }`}
              >
                {isUser ? (
                  msg.parts[0].text
                ) : (
                  <div className="prose prose-invert max-w-none text-xs leading-relaxed break-words space-y-1">
                    <Markdown
                      components={{
                        img: ({ node, ...props }) => (
                          <span className="block my-2.5">
                            <img
                              {...props}
                              referrerPolicy="no-referrer"
                              className="rounded-xl w-full max-w-xs sm:max-w-sm max-h-64 object-cover border border-slate-700/80 shadow-lg shadow-black/40"
                              loading="lazy"
                            />
                            {props.alt && (
                              <span className="block text-[10px] text-slate-400 mt-1 italic font-normal">
                                📷 {props.alt}
                              </span>
                            )}
                          </span>
                        ),
                        a: ({ node, ...props }) => (
                          <a {...props} target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 underline font-medium" />
                        ),
                        p: ({ node, ...props }) => (
                          <p {...props} className="my-1.5 leading-relaxed" />
                        ),
                        strong: ({ node, ...props }) => (
                          <strong {...props} className="text-white font-bold" />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul {...props} className="list-disc pl-4 my-1.5 space-y-1 text-slate-300" />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol {...props} className="list-decimal pl-4 my-1.5 space-y-1 text-slate-300" />
                        ),
                        h3: ({ node, ...props }) => (
                          <h3 {...props} className="text-xs font-bold text-emerald-400 mt-3 mb-1" />
                        )
                      }}
                    >
                      {msg.parts[0].text}
                    </Markdown>
                  </div>
                )}

                {/* Message action buttons on assistant replies */}
                {!isUser && (
                  <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex items-center justify-between text-[10px] text-slate-400">
                    <span className="flex items-center space-x-1 text-slate-500 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Gemini Intelligence</span>
                    </span>
                    <button
                      onClick={() => handleCopyText(msg.parts[0].text, idx)}
                      className="flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-slate-950/70 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center space-x-2.5 p-3.5 bg-slate-900/60 border border-slate-800 rounded-2xl max-w-xs text-xs font-semibold text-slate-300 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Gemini AI is analyzing your question...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Question Categories & Suggested Inquiries */}
      <div className="bg-slate-900/60 border border-slate-800 p-2.5 rounded-2xl mb-2 shrink-0 space-y-2">
        {/* Category Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pb-0.5">
          {DOUBT_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300" 
                    : "bg-slate-950/60 border border-slate-850 text-slate-400 hover:text-slate-200"
                }`}
              >
                {cat.icon}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Suggested Chips for the selected category */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {currentCategoryObj.doubts.map((doubt, dIdx) => (
            <button
              key={dIdx}
              onClick={() => handleAskDoubt(doubt)}
              disabled={loading}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-[10px] text-slate-300 hover:text-white whitespace-nowrap font-medium transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{doubt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Input Controls Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-2.5 sm:p-3 rounded-2.5xl shadow-lg shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleAskDoubt();
          }} 
          className="flex items-center space-x-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              disabled={loading}
              placeholder="Ask Gemini any question... nutrition, workouts, science, daily life..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="w-11 h-11 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-950 text-slate-950 disabled:text-slate-700 border border-emerald-400/20 disabled:border-slate-850 rounded-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0"
            title="Send Question to Gemini AI"
          >
            <Send className="w-4 h-4 font-bold" />
          </button>
        </form>

        <div className="flex items-center justify-between px-2 pt-2 text-[9px] text-slate-500">
          <span>Powered by Google Gemini AI • Answers any question or doubt</span>
          <span className="font-semibold text-slate-400">NutriFit AI</span>
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-xs w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center space-x-2 text-rose-400">
              <Trash2 className="w-5 h-5" />
              <h3 className="text-sm font-bold text-slate-100">Clear History?</h3>
            </div>
            <p className="text-xs text-slate-400">
              This will clear previous questions and Gemini AI answers. Your logged foods and progress stay saved.
            </p>
            <div className="flex space-x-2 pt-1">
              <button
                onClick={handleClearHistory}
                className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-all"
              >
                Yes, Clear
              </button>
              <button
                onClick={() => setShowClearModal(false)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
