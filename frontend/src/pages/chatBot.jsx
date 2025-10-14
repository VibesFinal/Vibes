import React, { useState, useRef, useEffect } from "react";
 
export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! You can tell me about your feelings!" },
  ]);
 
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
 
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
 
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);
 
  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);
    try {
      const conversationHistory = messages.slice(1);
      const res = await fetch("http://localhost:7777/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: conversationHistory
        }),
      });
      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't generate a response.";
      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Error: failed to fetch response." },
      ]);
    }
    setLoading(false);
  };
 
  return (
<div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#F0F0F0] relative overflow-hidden">
      {/* Modern gradient background */}
<div className="absolute inset-0 bg-gradient-to-br from-[#9FD6E2]/20 via-[#F0F0F0] to-[#DCC6A0]/10"></div>
      {/* Geometric background elements */}
<div className="absolute inset-0 overflow-hidden pointer-events-none">
<div className="absolute top-1/4 -right-20 w-80 h-80 bg-[#B8E986]/10 rounded-full blur-3xl"></div>
<div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-[#73C174]/10 rounded-full blur-3xl"></div>
<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#9FD6E2]/10 rounded-full blur-3xl"></div>
</div>
 
      <div className="w-full max-w-2xl relative z-10">
        {/* Minimalist header */}
<div className="mb-8 text-center">
<div className="w-16 h-16 bg-gradient-to-br from-[#73C174] to-[#B8E986] rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
</svg>
</div>
<h1 className="text-3xl font-bold text-gray-800 mb-2">Mindful Chat</h1>
<p className="text-gray-600 text-sm">Talk with Vibes</p>
</div>
 
        {/* Chat container */}
<div className="bg-white rounded-2xl shadow-2xl shadow-gray-400/20 overflow-hidden flex flex-col h-[600px] border border-gray-100/80 backdrop-blur-sm">
          {/* Status bar */}
<div className="px-6 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-3 h-3 bg-[#73C174] rounded-full animate-pulse"></div>
<span className="text-sm font-medium text-gray-700">Online</span>
</div>
<div className="text-xs text-gray-500">Always here to listen</div>
</div>
</div>
          {/* Messages area */}
<div className="flex-1 overflow-y-auto px-6 py-6 space-y-4 bg-gradient-to-b from-white to-gray-50/30">
            {messages.map((msg, idx) => (
<div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-300`}
>
<div
                  className={`max-w-[85%] rounded-2xl p-4 transition-all duration-300 hover:shadow-md ${
                    msg.sender === "user"
                      ? "bg-gradient-to-br from-[#73C174] to-[#B8E986] text-white rounded-br-md"
                      : "bg-gray-50 border border-gray-100 text-gray-700 rounded-bl-md"
                  }`}
>
<div className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
<div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                      msg.sender === "user"
                        ? "bg-white/20 text-white"
                        : "bg-gradient-to-br from-[#9FD6E2] to-[#DCC6A0] text-white"
                    }`}>
                      {msg.sender === "user" ? "You" : "AI"}
</div>
<div className="flex-1 leading-relaxed">
                      {msg.text}
</div>
</div>
</div>
</div>
            ))}
            {loading && (
<div className="flex justify-start animate-in fade-in duration-300">
<div className="max-w-[85%] bg-gray-50 border border-gray-100 rounded-2xl rounded-bl-md p-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-semibold bg-gradient-to-br from-[#9FD6E2] to-[#DCC6A0] text-white flex-shrink-0">
                      AI
</div>
<div className="flex gap-2">
<div className="w-2 h-2 bg-[#73C174] rounded-full animate-bounce"></div>
<div className="w-2 h-2 bg-[#9FD6E2] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
<div className="w-2 h-2 bg-[#B8E986] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
</div>
</div>
</div>
</div>
            )}
<div ref={messagesEndRef} />
</div>
          {/* Input area */}
<div className="p-6 bg-white border-t border-gray-100">
<div className="flex items-center gap-3">
<input
                type="text"
                placeholder="Share what's on your mind..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 px-5 py-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#73C174]/30 focus:border-[#73C174] transition-all duration-300 placeholder-gray-400"
                disabled={loading}
              />
<button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-6 py-4 bg-gradient-to-r from-[#73C174] to-[#B8E986] text-white font-semibold rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 min-w-[100px] justify-center"
>
                {loading ? (
<>
<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
<span>Sending</span>
</>
                ) : (
<>
<span>Send</span>
<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
</svg>
</>
                )}
</button>
</div>
            {/* Privacy assurance */}
<div className="flex items-center justify-center gap-2 mt-3">
<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
</svg>
<p className="text-xs text-gray-500 text-center">
                Your conversations are private and secure
</p>
</div>
</div>
</div>
 

</div>
</div>
  );
}