// pages/index.js

import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '👋 Hi there! Welcome to YourEnglishTutor. Feel free to chat in English or Vietnamese!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Oops! Something went wrong. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-100"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="flex-1 flex flex-col items-center justify-start pt-10 backdrop-blur-md bg-white/70 min-h-screen">
        <div className="w-full max-w-2xl flex flex-col p-4 space-y-4 overflow-auto">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
              <div className={`p-4 rounded-2xl shadow ${m.role === 'assistant' ? 'bg-white text-gray-800' : 'bg-blue-500 text-white'}`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="p-4 rounded-2xl shadow bg-white text-gray-400 italic">
                Typing...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="w-full max-w-2xl p-4 flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-semibold text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
