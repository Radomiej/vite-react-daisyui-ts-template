import { describe, it, expect, beforeEach, vi } from 'vitest';
import { N8nProvider } from '../providers/N8nProvider';
import type { AIProviderConfig, ChatMessage } from '../types';

describe('N8nProvider', () => {
  let provider: N8nProvider;
  let config: AIProviderConfig;

  beforeEach(() => {
    config = {
      name: 'Test N8n',
      type: 'n8n',
      testUrl: 'http://localhost:5678/webhook/test',
      productionUrl: 'https://n8n.example.com/webhook/prod',
    };
    provider = new N8nProvider(config, false);
  });

  describe('constructor', () => {
    it('should create provider with test URL', () => {
      expect(provider).toBeDefined();
    });

    it('should generate session ID', () => {
      const sessionId = provider.getSessionId();
      expect(sessionId).toMatch(/^session_/);
    });
  });

  describe('sendMessage', () => {
    it('should send message successfully with array response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ output: 'Response from N8n' }],
      });

      const response = await provider.sendMessage('Hello');
      expect(response).toBe('Response from N8n');
    });

    it('should send message successfully with string response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ['Direct string response'],
      });

      const response = await provider.sendMessage('Hello');
      expect(response).toBe('Direct string response');
    });

    it('should handle API errors', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => 'Internal Server Error',
      });

      await expect(provider.sendMessage('Hello')).rejects.toThrow('N8n API error');
    });
  });

  describe('sendMessageWithHistory', () => {
    it('should send last user message', async () => {
      const messages: ChatMessage[] = [
        {
          id: '1',
          role: 'user',
          content: 'First message',
          timestamp: new Date(),
        },
        {
          id: '2',
          role: 'assistant',
          content: 'Response',
          timestamp: new Date(),
        },
        {
          id: '3',
          role: 'user',
          content: 'Second message',
          timestamp: new Date(),
        },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [{ output: 'Response' }],
      });

      const response = await provider.sendMessageWithHistory(messages);
      expect(response).toBe('Response');
    });

    it('should throw error if last message is not from user', async () => {
      const messages: ChatMessage[] = [
        {
          id: '1',
          role: 'assistant',
          content: 'Response',
          timestamp: new Date(),
        },
      ];

      await expect(provider.sendMessageWithHistory(messages)).rejects.toThrow(
        'Last message must be from user'
      );
    });
  });

  describe('session management', () => {
    it('should reset session ID', () => {
      const oldSessionId = provider.getSessionId();
      provider.resetSession();
      const newSessionId = provider.getSessionId();
      
      expect(newSessionId).not.toBe(oldSessionId);
      expect(newSessionId).toMatch(/^session_/);
    });

    it('should set custom session ID', () => {
      const customId = 'custom-session-123';
      provider.setSessionId(customId);
      
      expect(provider.getSessionId()).toBe(customId);
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
});
