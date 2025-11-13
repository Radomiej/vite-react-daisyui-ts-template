import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LiteLLMProvider } from '../providers/LiteLLMProvider';
import type { AIProviderConfig, ChatMessage } from '../types';

describe('LiteLLMProvider', () => {
  let provider: LiteLLMProvider;
  let config: AIProviderConfig;

  beforeEach(() => {
    config = {
      name: 'Test LiteLLM',
      type: 'litellm',
      testUrl: 'http://localhost:4000',
      productionUrl: 'https://api.litellm.com',
      apiKey: 'test-key',
    };
    provider = new LiteLLMProvider(config, false);
  });

  describe('constructor', () => {
    it('should create provider with test URL', () => {
      expect(provider).toBeDefined();
    });

    it('should create provider with production URL', () => {
      const prodProvider = new LiteLLMProvider(config, true);
      expect(prodProvider).toBeDefined();
    });
  });

  describe('sendMessage', () => {
    it('should send message successfully', async () => {
      const messages: ChatMessage[] = [
        {
          id: '1',
          role: 'user',
          content: 'Hello',
          timestamp: new Date(),
        },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 'test-id',
          object: 'chat.completion',
          created: Date.now(),
          model: 'gpt-3.5-turbo',
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: 'Hello! How can I help you?',
              },
              finish_reason: 'stop',
            },
          ],
        }),
      });

      const response = await provider.sendMessage(messages);
      expect(response.choices[0].message.content).toBe('Hello! How can I help you?');
    });

    it('should handle API errors', async () => {
      const messages: ChatMessage[] = [
        {
          id: '1',
          role: 'user',
          content: 'Hello',
          timestamp: new Date(),
        },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });

      await expect(provider.sendMessage(messages)).rejects.toThrow('LiteLLM API error');
    });
  });

  describe('testConnection', () => {
    it('should return true for successful connection', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
      });

      const result = await provider.testConnection();
      expect(result).toBe(true);
    });

    it('should return false for failed connection', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const result = await provider.testConnection();
      expect(result).toBe(false);
    });
  });

  describe('getModels', () => {
    it('should fetch available models', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          data: [
            { id: 'gpt-3.5-turbo' },
            { id: 'gpt-4' },
          ],
        }),
      });

      const models = await provider.getModels();
      expect(models).toEqual(['gpt-3.5-turbo', 'gpt-4']);
    });

    it('should return empty array on error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const models = await provider.getModels();
      expect(models).toEqual([]);
    });
  });
});
