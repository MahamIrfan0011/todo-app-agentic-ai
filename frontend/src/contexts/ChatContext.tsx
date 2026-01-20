'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChatMessage } from '../components/MessageList';

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (sender: 'user' | 'agent', text: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider component that wraps the application
export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'agent', text: "Hello! How can I help you manage your tasks today?" }
  ]);

  const addMessage = (sender: 'user' | 'agent', text: string) => {
    setMessages(prevMessages => [...prevMessages, { sender, text }]);
  };

  return (
    <ChatContext.Provider value={{ messages, addMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

// Custom hook to use the ChatContext
export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
