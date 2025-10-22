import type { 
  AIProviderConfig, 
  N8nRequest,
  ChatMessage 
} from '../types';

export class N8nProvider {
  private config: AIProviderConfig;
  private useProduction: boolean;
  private sessionId: string;

  constructor(config: AIProviderConfig, useProduction: boolean = false) {
    this.config = config;
    this.useProduction = useProduction;
    this.sessionId = this.generateSessionId();
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

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }

  /**
   * Send a message to n8n webhook
   */
  async sendMessage(
    message: string,
    agentName?: string,
    agentId?: string
  ): Promise<string> {
    const request: N8nRequest = {
      message,
      sessionId: this.sessionId,
      agentName,
      agentId,
    };

    const response = await fetch(this.getUrl(), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify([request]), // n8n expects array
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`N8n API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Handle different response formats
    if (Array.isArray(data) && data.length > 0) {
      if (typeof data[0] === 'string') {
        return data[0];
      }
      if (data[0].output) {
        return data[0].output;
      }
    }
    
    if (typeof data === 'string') {
      return data;
    }

    if (data.output) {
      return data.output;
    }

    return JSON.stringify(data);
  }

  /**
   * Send a message with conversation history
   */
  async sendMessageWithHistory(
    messages: ChatMessage[],
    agentName?: string,
    agentId?: string
  ): Promise<string> {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.role !== 'user') {
      throw new Error('Last message must be from user');
    }

    // For n8n, we typically send just the last user message
    // But you can modify this to send full history if your n8n workflow supports it
    return this.sendMessage(lastMessage.content, agentName, agentId);
  }

  /**
   * Reset session ID (start new conversation)
   */
  resetSession(): void {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Get current session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Set custom session ID
   */
  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  /**
   * Test the connection to n8n webhook
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.getUrl(), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify([{
          message: 'test',
          sessionId: 'test_session',
        }]),
      });
      return response.ok;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  /**
   * Send a message with custom payload
   */
  async sendCustomPayload(payload: Record<string, any>): Promise<any> {
    const response = await fetch(this.getUrl(), {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify([payload]),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`N8n API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }
}
