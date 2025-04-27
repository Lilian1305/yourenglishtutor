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
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161c57936?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80)' }}
    >
      <div className="flex flex-col h-[600px] w-[380px] sm:w-[450px] bg-white/90 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex-1 overflow-auto p-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex items-end ${m.role === 'assistant' ? 'justify-start' : 'justify-end'} mb-4`}>
              {m.role === 'assistant' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center mr-2 text-blue-500 text-sm">
                  🤖
                </div>
              )}
              <div
                className={`max-w-xs px-4 py-3 rounded-3xl relative shadow ${
                  m.role === 'assistant' ? 'bg-white text-gray-800' : 'bg-blue-500 text-white'
                }`}
                style={{
                  borderBottomLeftRadius: m.role === 'assistant' ? '0.75rem' : '1.5rem',
                  borderBottomRightRadius: m.role === 'user' ? '0.75rem' : '1.5rem',
                }}
              >
                {m.content}
              </div>
              {m.role === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center ml-2 text-white text-sm">
                  😃
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex items-end justify-start mb-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center mr-2 text-blue-500 text-sm">
                🤖
              </div>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="flex p-3 border-t bg-white">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border border-gray-300 rounded-full p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Type in English or Vietnamese..."
          />
          <button
            onClick={sendMessage}
            className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 text-sm font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
