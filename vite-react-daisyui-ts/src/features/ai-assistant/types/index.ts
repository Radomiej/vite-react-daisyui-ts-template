export interface AIProviderConfig {
  name: string;
  type: 'litellm' | 'n8n';
  testUrl: string;
  productionUrl: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  provider?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  provider: AIProviderConfig;
  createdAt: Date;
  updatedAt: Date;
}

export interface LiteLLMRequest {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

export interface LiteLLMResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface N8nRequest {
  message: string;
  sessionId: string;
  agentName?: string;
  agentId?: string;
}

export interface N8nResponse {
  output: string;
}

export interface StreamChunk {
  content: string;
  done: boolean;
}
