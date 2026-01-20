'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';
import { useTask } from '../contexts/TaskContext';
import MessageList from './MessageList';

// A simple form for sending messages to the chatbot.
export default function ChatWindow() {
  const [message, setMessage] = useState('');
  const { messages, addMessage } = useChat();
  const { user } = useAuth();
  const { fetchTasks } = useTask();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '' || !user) return;

    const userMessage = message;
    addMessage('user', userMessage);
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': user.email,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(`Network response was not ok. Status: ${response.status}. Message: ${errorData.error}`);
      }

      const data = await response.json();
      addMessage('agent', data.reply);
      console.log('Chatbot reply:', data.reply); // Log the exact reply

      // If the agent's reply indicates a task was added, deleted, updated, or failed, refresh the task list
      const replyLower = data.reply.toLowerCase();
      if (
        replyLower.includes('added') ||
        replyLower.includes('deleted') ||
        replyLower.includes('cleared') ||
        replyLower.includes('marked') ||
        replyLower.includes('changed') ||
        replyLower.includes('failed to') // Catch failures to ensure refresh or at least indicate something happened
      ) {
        console.log("Calling fetchTasks() due to keyword match."); // Confirm fetchTasks is called
        fetchTasks();
      }

    } catch (error) {
      console.error('Failed to send message:', error);
      addMessage('agent', 'Sorry, I encountered an error. Please try again.');
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold text-white mb-2 flex items-center space-x-2"><span>TaskBot</span> <span className="text-2xl">🤖</span></h3>
      <div className="h-64 bg-gray-900 rounded-md p-2 overflow-y-auto mb-4">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g., add task: buy milk"
            className="flex-grow bg-gray-700 text-white rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={!user}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md text-sm transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
