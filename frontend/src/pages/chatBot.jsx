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
    <div className="flex flex-col h-full bg-gradient-to-b from-pink-50 to-white">
      {/* Lightweight header */}
      <div className="px-6 py-4 border-b border-pink-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-[#C05299] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-700">Online</span>
          </div>
          <div className="text-xs text-gray-500">Always here to listen</div>
        </div>
      </div>

      {/* Messages area - OPTIMIZED */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-[#C05299] to-[#d666ae] text-white rounded-br-md"
                  : "bg-pink-50 text-gray-800 rounded-bl-md border border-pink-100"
              }`}
            >
              <div className={`flex items-start gap-2 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                  msg.sender === "user"
                    ? "bg-white/20 text-white"
                    : "bg-gradient-to-br from-[#C05299] to-[#d666ae] text-white"
                }`}>
                  {msg.sender === "user" ? "U" : "AI"}
                </div>
                <div className="flex-1 leading-relaxed text-sm">
                  {msg.text}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] bg-pink-50 border border-pink-100 rounded-2xl rounded-bl-md p-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold bg-gradient-to-br from-[#C05299] to-[#d666ae] text-white flex-shrink-0">
                  AI
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-[#C05299] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#d666ae] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-[#e080c0] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area - SIMPLIFIED */}
      <div className="p-4 bg-white border-t border-pink-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Share what's on your mind..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-3 text-sm text-gray-700 bg-pink-50 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C05299]/30 focus:border-[#C05299] transition-colors placeholder-gray-400"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-gradient-to-r from-[#C05299] to-[#d666ae] text-white text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity flex items-center gap-2"
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
        
        {/* Privacy note - simplified */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-xs text-gray-500">Your conversations are private</p>
        </div>
      </div>
    </div>
  );
}