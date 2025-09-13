import React, { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Hi! You can tell me about your feelings!" },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:7777/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn’t generate a response.";

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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-[600px]">
        {/* Chat Box */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white ml-auto rounded-br-none"
                  : "bg-gray-100 text-gray-800 mr-auto rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          ))}

          {loading && (
            <div className="max-w-[75%] bg-gray-100 text-gray-600 px-4 py-3 rounded-2xl mr-auto rounded-bl-none text-sm">
              Typing...
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex items-center border-t border-gray-200 p-3 bg-white">
          <input
            type="text"
            placeholder="I’m your AI helper — they say I'm a good listener..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-3 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-shadow"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="ml-3 px-6 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}