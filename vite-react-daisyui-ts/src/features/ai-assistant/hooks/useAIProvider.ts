import { useState, useCallback } from 'react';
import { LiteLLMProvider, N8nProvider } from '../providers';
import type { AIProviderConfig, ChatMessage } from '../types';

export interface UseAIProviderOptions {
  config: AIProviderConfig;
  useProduction?: boolean;
}

export interface UseAIProviderReturn {
  sendMessage: (messages: ChatMessage[], options?: any) => Promise<string>;
  streamMessage: (messages: ChatMessage[], options?: any) => AsyncGenerator<string, void, unknown> | null;
  testConnection: () => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  provider: LiteLLMProvider | N8nProvider;
}

export function useAIProvider({ config, useProduction = false }: UseAIProviderOptions): UseAIProviderReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize provider based on type
  const provider = config.type === 'litellm' 
    ? new LiteLLMProvider(config, useProduction)
    : new N8nProvider(config, useProduction);

  const sendMessage = useCallback(async (messages: ChatMessage[], options?: any): Promise<string> => {
    setIsLoading(true);
    setError(null);

    try {
      if (config.type === 'litellm') {
        const litellmProvider = provider as LiteLLMProvider;
        const response = await litellmProvider.sendMessage(
          messages,
          options?.model,
          {
            temperature: options?.temperature,
            max_tokens: options?.max_tokens,
            stream: false,
          }
        );
        return response.choices[0]?.message?.content || '';
      } else {
        const n8nProvider = provider as N8nProvider;
        return await n8nProvider.sendMessageWithHistory(
          messages,
          options?.agentName,
          options?.agentId
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [config.type, provider]);

  const streamMessage = useCallback((messages: ChatMessage[], options?: any) => {
    if (config.type === 'litellm') {
      const litellmProvider = provider as LiteLLMProvider;
      return litellmProvider.streamMessage(
        messages,
        options?.model,
        {
          temperature: options?.temperature,
          max_tokens: options?.max_tokens,
        }
      );
    }
    // N8n doesn't support streaming in this implementation
    return null;
  }, [config.type, provider]);

  const testConnection = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      return await provider.testConnection();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Connection test failed';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [provider]);

  return {
    sendMessage,
    streamMessage,
    testConnection,
    isLoading,
    error,
    provider,
  };
}
