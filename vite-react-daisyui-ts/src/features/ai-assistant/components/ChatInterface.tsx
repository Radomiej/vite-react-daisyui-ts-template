import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, AlertCircle } from 'lucide-react';
import { useAIProvider } from '../hooks/useAIProvider';
import type { AIProviderConfig, ChatMessage } from '../types';

interface ChatInterfaceProps {
  provider: AIProviderConfig;
  useProduction: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  provider,
  useProduction,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { sendMessage, streamMessage, testConnection, isLoading, error } = useAIProvider({
    config: provider,
    useProduction,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || isStreaming) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      provider: provider.name,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Try streaming first for LiteLLM
    if (provider.type === 'litellm') {
      const stream = streamMessage([...messages, userMessage], {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
      });

      if (stream) {
        setIsStreaming(true);
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          provider: provider.name,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        try {
          for await (const chunk of stream) {
            setMessages((prev) => {
              const updated = [...prev];
              const lastMsg = updated[updated.length - 1];
              if (lastMsg.role === 'assistant') {
                lastMsg.content += chunk;
              }
              return updated;
            });
          }
        } catch (err) {
          console.error('Streaming error:', err);
        } finally {
          setIsStreaming(false);
        }
        return;
      }
    }

    // Fallback to regular message
    try {
      const response = await sendMessage([...messages, userMessage], {
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
      });

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        provider: provider.name,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Send message error:', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTestConnection = async () => {
    const result = await testConnection();
    const testMessage: ChatMessage = {
      id: `system-${Date.now()}`,
      role: 'system',
      content: result
        ? `✅ Connection to ${provider.name} successful!`
        : `❌ Connection to ${provider.name} failed.`,
      timestamp: new Date(),
      provider: provider.name,
    };
    setMessages((prev) => [...prev, testMessage]);
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header - flex-shrink-0 to prevent shrinking */}
      <div className="bg-base-200 p-4 border-b border-base-300 flex justify-between items-center flex-shrink-0">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{provider.name}</h3>
            <span className={`badge badge-sm ${useProduction ? 'badge-error' : 'badge-success'}`}>
              {useProduction ? '🔴 PRODUCTION' : '🟢 TEST'}
            </span>
          </div>
          <p className="text-xs opacity-60 truncate">
            {useProduction ? provider.productionUrl : provider.testUrl}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-sm btn-ghost"
            onClick={handleTestConnection}
            disabled={isLoading}
          >
            <RefreshCw size={16} />
            Test
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={clearChat}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Messages Area - flex-1 to grow and fill space, overflow-y-auto for scrolling */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-base-content/60 mt-8">
              <p className="text-lg font-semibold">Welcome to AI Assistant!</p>
              <p className="text-sm mt-2">
                Start a conversation or test the connection to {provider.name}
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`chat ${
                message.role === 'user'
                  ? 'chat-end'
                  : message.role === 'system'
                  ? 'chat-start'
                  : 'chat-start'
              }`}
            >
              <div className="chat-header">
                {message.role === 'user' ? 'You' : message.role === 'system' ? 'System' : 'Assistant'}
                <time className="text-xs opacity-50 ml-2">
                  {message.timestamp.toLocaleTimeString()}
                </time>
              </div>
              <div
                className={`chat-bubble ${
                  message.role === 'user'
                    ? 'chat-bubble-primary'
                    : message.role === 'system'
                    ? 'chat-bubble-info'
                    : 'chat-bubble-secondary'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}

          {(isLoading || isStreaming) && (
            <div className="chat chat-start">
              <div className="chat-bubble chat-bubble-secondary">
                <span className="loading loading-dots loading-sm"></span>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-error">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom with flex-shrink-0 to prevent compression */}
      <div className="bg-base-200 border-t border-base-300 flex-shrink-0">
        <div className="p-4 flex gap-2">
          <textarea
            ref={textareaRef}
            className="textarea textarea-bordered flex-1 resize-none"
            placeholder="Type your message... (Shift+Enter for new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            disabled={isLoading || isStreaming}
          />
          <button
            className="btn btn-primary"
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading || isStreaming}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
