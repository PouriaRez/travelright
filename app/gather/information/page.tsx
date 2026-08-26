// app/travel-chat/page.tsx
'use client';

import { useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

export default function TravelChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: input },
    ];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        // handles 400 / 429 / 500 — all return { error: string }
        console.log(`error ${data}, ${res}`);
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: data.error ?? 'Something went wrong, try again.',
          },
        ]);
        return;
      }

      // success — { content: string }
      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.content },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Something went wrong, try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-[80%] ${
              m.role === 'user'
                ? 'bg-blue-500 text-white ml-auto'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && (
          <div className="bg-gray-100 text-gray-500 p-3 rounded-lg max-w-[80%]">
            Thinking...
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Where do you want to go?"
          className="flex-1 border rounded-lg px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
