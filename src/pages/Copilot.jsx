import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, Loader2, Brain, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ReactMarkdown from 'react-markdown';
import { base44 } from '@/api/base44Client';

const suggestions = [
  "What happens if the Strait of Hormuz closes for 20 days?",
  "Explain India's current energy risk score",
  "Recommend alternative suppliers for Red Sea disruption",
  "What is the current strategic reserve coverage?",
  "Generate a weekly risk intelligence briefing",
  "Compare Saudi Aramco vs ADNOC reliability",
];

export default function Copilot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm your **EnerShield AI Copilot**. I can help you understand risk scores, analyze disruption scenarios, generate reports, and recommend strategic actions.\n\nTry asking me about current threats, supply chain status, or what-if scenarios." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const context = `You are the EnerShield AI Copilot — an expert AI assistant for India's energy supply chain resilience platform. 
You have deep knowledge of:
- India's crude oil imports (~4.7M bbl/day, 87% dependency)
- Key supply routes: Strait of Hormuz (35% of India's supply), Red Sea/Suez, Malacca Strait
- Major suppliers: Saudi Arabia, Iraq, UAE, Kuwait, Russia, Nigeria
- Strategic Petroleum Reserves: Vizag (11.22 MMT), Mangalore (11.22 MMT), Padur (17.28 MMT), Chandikhol (13.31 MMT) — ~42 days coverage
- Key refineries: Jamnagar (1.36M bpd), Paradip, Kochi, Mangalore, Mathura, Panipat
- Current risk scores: Global 73/100, Red Sea 78, Hormuz 85, India ports 30
- Brent crude: $82.4/bbl

Provide detailed, data-rich responses with specific numbers. Use markdown formatting. Be authoritative but concise.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `${context}\n\nUser question: ${text}\n\nProvide a detailed, expert response with specific data points and actionable insights.`,
      });

      setMessages(prev => [...prev, { role: "assistant", content: result }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: "I apologize, but I encountered an error processing your request. Please try again." }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-48px)]">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">AI Copilot</h1>
        <p className="text-white/40 text-sm mt-1">Ask questions, explore scenarios, and get AI-powered insights</p>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass rounded-2xl flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-lavender/20' : 'bg-mint/20'}`}>
                  {msg.role === 'user' ? <User className="w-4 h-4 text-lavender" /> : <Brain className="w-4 h-4 text-mint" />}
                </div>
                <div className={`rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-lavender/10 border border-lavender/20' : 'bg-white/[0.03] border border-white/5'}`}>
                  <ReactMarkdown className="text-sm text-white/80 prose prose-sm prose-invert max-w-none [&_p]:mb-2 [&_ul]:ml-4 [&_li]:text-white/70 [&_strong]:text-white [&_h3]:text-white [&_h3]:text-base [&_code]:text-mint [&_code]:bg-white/5 [&_code]:px-1 [&_code]:rounded">
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-mint/20 flex items-center justify-center">
                  <Brain className="w-4 h-4 text-mint" />
                </div>
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-mint" />
                  <span className="text-white/40 text-sm">Analyzing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-5 pb-3">
            <p className="text-white/30 text-xs mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors border border-white/5"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-white/5">
          <form
            onSubmit={e => { e.preventDefault(); sendMessage(input); }}
            className="flex gap-3"
          >
            <Input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about risks, scenarios, or recommendations..."
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30 h-11"
              disabled={loading}
            />
            <Button type="submit" disabled={!input.trim() || loading} className="bg-mint hover:bg-mint-dark text-black h-11 px-5">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}