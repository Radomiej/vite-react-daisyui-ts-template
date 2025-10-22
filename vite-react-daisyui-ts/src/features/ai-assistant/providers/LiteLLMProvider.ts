import type { 
  AIProviderConfig, 
  LiteLLMRequest, 
  LiteLLMResponse,
  ChatMessage 
} from '../types';

export class LiteLLMProvider {
  private config: AIProviderConfig;
  private useProduction: boolean;

  constructor(config: AIProviderConfig, useProduction: boolean = false) {
    this.config = config;
    this.useProduction = useProduction;
  }

  private getUrl(): string {
    return this.useProduction ? this.config.productionUrl : this.config.testUrl;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...this.config.headers,
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    return headers;
  }

  /**
   * Send a chat completion request to LiteLLM
   */
  async sendMessage(
    messages: ChatMessage[],
    model: string = 'gpt-3.5-turbo',
    options?: {
      temperature?: number;
      max_tokens?: number;
      stream?: boolean;
    }
  ): Promise<LiteLLMResponse> {
    const request: LiteLLMRequest = {
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      stream: options?.stream ?? false,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens,
    };

    const response = await fetch(`${this.getUrl()}/chat/completions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LiteLLM API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Send a streaming chat completion request to LiteLLM
   */
  async *streamMessage(
    messages: ChatMessage[],
    model: string = 'gpt-3.5-turbo',
    options?: {
      temperature?: number;
      max_tokens?: number;
    }
  ): AsyncGenerator<string, void, unknown> {
    const request: LiteLLMRequest = {
      model,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      stream: true,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens,
    };

    const response = await fetch(`${this.getUrl()}/chat/completions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LiteLLM API error: ${response.status} - ${errorText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Response body is not readable');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine === '' || trimmedLine === 'data: [DONE]') continue;
          if (!trimmedLine.startsWith('data: ')) continue;

          try {
            const jsonStr = trimmedLine.slice(6);
            const data = JSON.parse(jsonStr);
            const content = data.choices?.[0]?.delta?.content;
            if (content) {
              yield content;
            }
          } catch (e) {
            console.error('Error parsing SSE line:', trimmedLine, e);
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  /**
   * Get available models from LiteLLM
   */
  async getModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.getUrl()}/models`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data = await response.json();
      return data.data?.map((model: any) => model.id) || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      return [];
    }
  }

  /**
   * Test the connection to LiteLLM
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.getUrl()}/models`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }
}
