// pages/api/chat.js

import { systemPrompt } from '../../systemPrompt'; // 🔥 đã fix đúng đường dẫn!

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  const { messages } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // hoặc 'gpt-3.5-turbo' nếu bạn muốn tiết kiệm chi phí
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    const data = await response.json();
    const reply = data.choices[0]?.message?.content ||
