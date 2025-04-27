// pages/index.js

import React, { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '👋 Hi there! I am YourEnglishTutor. Feel free to chat with me in English or Vietnamese!' }
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
    <div className="flex flex-col h-screen bg-gradient-to-b from-blue-100 to-white">
      <div className="flex-1 overflow-auto p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'} mb-2`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl ${
                m.role === 'assistant' ? 'bg-white text-gray-800' : 'bg-blue-500 text-white'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-2">
            <div className="bg-white text-gray-500 px-4 py-2 rounded-2xl animate-pulse">
              Typing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="flex p-4 bg-white border-t">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border border-gray-300 rounded-full p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type in English or Vietnamese..."
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-5 py-2 text-sm font-semibold"
        >
          Send
        </button>
      </div>
    </div>
  );
}
