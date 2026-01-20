'use client';

import React from 'react';

// Defines the structure of a single message
export interface ChatMessage {
  sender: 'user' | 'agent';
  text: string;
}

interface MessageListProps {
  messages: ChatMessage[];
}

// Renders a list of chat messages.
export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`max-w-xs md:max-w-md p-3 rounded-lg ${
            msg.sender === 'user'
              ? 'bg-purple-800 self-end'
              : 'bg-gray-700 self-start'
          }`}
        >
          <p className="text-sm text-white">{msg.text}</p>
        </div>
      ))}
    </div>
  );
}
