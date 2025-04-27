// App.js

import React, { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hello! I am YourEnglishTutor. Let\'s practice English together!' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={`my-2 ${m.role === 'assistant' ? 'text-blue-600' : 'text-black'}`}>
            <strong>{m.role === 'assistant' ? 'Tutor:' : 'You:'}</strong> {m.content}
          </div>
        ))}
        {loading && <div className="text-gray-500">Typing...</div>}
      </div>
      <div className="flex p-4 bg-white">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 border rounded p-2 mr-2"
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
