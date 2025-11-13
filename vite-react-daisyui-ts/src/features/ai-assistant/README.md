# AI Assistant Feature

A flexible AI chat assistant implementation with support for multiple providers including LiteLLM and N8n webhooks.

## Features

- **Multiple Provider Support**: Switch between LiteLLM and N8n providers
- **Provider Management**: Add, edit, and remove providers with inline forms
- **Custom Provider Configuration**: Add your own providers with custom URLs and API keys
- **Test & Production Modes**: Each provider can have separate test and production endpoints
- **Visual Mode Indicators**: Clear badges showing 🔴 PRODUCTION or 🟢 TEST mode
- **Streaming Support**: LiteLLM provider supports streaming responses
- **Session Management**: N8n provider maintains conversation sessions
- **Fixed Chat Layout**: Proper flexbox layout with input always at bottom
- **Connection Testing**: Test provider connections before use
- **Beautiful UI**: Built with DaisyUI components and Tailwind CSS
- **TypeScript**: Full type safety throughout the codebase

## Architecture

### Providers

#### LiteLLMProvider
Connects to LiteLLM proxy server for unified access to multiple LLM providers.

**Features:**
- Chat completions
- Streaming responses
- Model selection
- Token usage tracking
- Connection testing

**Configuration:**
```typescript
{
  name: 'LiteLLM',
  type: 'litellm',
  testUrl: 'http://localhost:4000',
  productionUrl: 'https://api.litellm.com',
  apiKey: 'your-api-key', // optional
  headers: { // optional
    'Custom-Header': 'value'
  }
}
```

#### N8nProvider
Connects to N8n webhooks for custom AI workflows.

**Features:**
- Webhook integration
- Session management
- Agent selection
- Custom payload support
- Connection testing

**Configuration:**
```typescript
{
  name: 'N8n Webhook',
  type: 'n8n',
  testUrl: 'http://localhost:5678/webhook/test',
  productionUrl: 'https://your-n8n.com/webhook/prod',
  apiKey: 'your-api-key', // optional
  headers: { // optional
    'Custom-Header': 'value'
  }
}
```

## Usage

### Basic Usage

```tsx
import { AIAssistant } from '../features/ai-assistant';

function App() {
  return <AIAssistant />;
}
```

### Using Providers Directly

```typescript
import { LiteLLMProvider, N8nProvider } from '../features/ai-assistant/providers';

// LiteLLM
const litellm = new LiteLLMProvider({
  name: 'LiteLLM',
  type: 'litellm',
  testUrl: 'http://localhost:4000',
  productionUrl: 'https://api.litellm.com',
  apiKey: 'sk-...',
}, false); // false = use test URL

const messages = [
  { id: '1', role: 'user', content: 'Hello!', timestamp: new Date() }
];

// Regular request
const response = await litellm.sendMessage(messages, 'gpt-3.5-turbo');

// Streaming request
for await (const chunk of litellm.streamMessage(messages, 'gpt-3.5-turbo')) {
  console.log(chunk);
}

// N8n
const n8n = new N8nProvider({
  name: 'N8n',
  type: 'n8n',
  testUrl: 'http://localhost:5678/webhook/test',
  productionUrl: 'https://your-n8n.com/webhook/prod',
}, false);

const response = await n8n.sendMessage('Hello!', 'agent-name', 'agent-id');
```

### Using the Hook

```tsx
import { useAIProvider } from '../features/ai-assistant/hooks/useAIProvider';

function ChatComponent() {
  const { sendMessage, isLoading, error } = useAIProvider({
    config: {
      name: 'LiteLLM',
      type: 'litellm',
      testUrl: 'http://localhost:4000',
      productionUrl: 'https://api.litellm.com',
    },
    useProduction: false,
  });

  const handleSend = async () => {
    const messages = [
      { id: '1', role: 'user', content: 'Hello!', timestamp: new Date() }
    ];
    const response = await sendMessage(messages, { model: 'gpt-3.5-turbo' });
    console.log(response);
  };

  return (
    <button onClick={handleSend} disabled={isLoading}>
      {isLoading ? 'Sending...' : 'Send'}
    </button>
  );
}
```

## Components

### AIAssistant
Main container component that manages providers and chat interface.

### ProviderSelector
Sidebar component for selecting and managing providers.

**Features:**
- List all available providers
- Add new providers with form
- Edit existing providers inline
- Remove providers with confirmation
- Select active provider
- Visual feedback for selection (checkmark icon)

### ChatInterface
Main chat interface with message display and input.

**Features:**
- Message history with chat bubbles
- Real-time streaming (LiteLLM)
- Fixed bottom input (proper flexbox layout)
- Production/Test mode badge in header
- Connection testing
- Clear chat functionality
- Error handling with retry
- Auto-scroll to latest message
- Loading indicators

## Types

```typescript
interface AIProviderConfig {
  name: string;
  type: 'litellm' | 'n8n';
  testUrl: string;
  productionUrl: string;
  apiKey?: string;
  headers?: Record<string, string>;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  provider?: string;
}

interface LiteLLMRequest {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

interface N8nRequest {
  message: string;
  sessionId: string;
  agentName?: string;
  agentId?: string;
}
```

## API Reference

### LiteLLMProvider

#### `sendMessage(messages, model, options)`
Send a chat completion request.

**Parameters:**
- `messages: ChatMessage[]` - Array of chat messages
- `model: string` - Model name (default: 'gpt-3.5-turbo')
- `options?: { temperature?, max_tokens?, stream? }` - Optional parameters

**Returns:** `Promise<LiteLLMResponse>`

#### `streamMessage(messages, model, options)`
Send a streaming chat completion request.

**Parameters:**
- `messages: ChatMessage[]` - Array of chat messages
- `model: string` - Model name (default: 'gpt-3.5-turbo')
- `options?: { temperature?, max_tokens? }` - Optional parameters

**Returns:** `AsyncGenerator<string, void, unknown>`

#### `getModels()`
Get available models from LiteLLM.

**Returns:** `Promise<string[]>`

#### `testConnection()`
Test connection to LiteLLM server.

**Returns:** `Promise<boolean>`

### N8nProvider

#### `sendMessage(message, agentName?, agentId?)`
Send a message to N8n webhook.

**Parameters:**
- `message: string` - Message content
- `agentName?: string` - Optional agent name
- `agentId?: string` - Optional agent ID

**Returns:** `Promise<string>`

#### `sendMessageWithHistory(messages, agentName?, agentId?)`
Send a message with conversation history.

**Parameters:**
- `messages: ChatMessage[]` - Array of chat messages
- `agentName?: string` - Optional agent name
- `agentId?: string` - Optional agent ID

**Returns:** `Promise<string>`

#### `resetSession()`
Reset session ID (start new conversation).

#### `getSessionId()`
Get current session ID.

**Returns:** `string`

#### `testConnection()`
Test connection to N8n webhook.

**Returns:** `Promise<boolean>`

## Environment Variables

You can configure default providers using environment variables:

```env
VITE_LITELLM_TEST_URL=http://localhost:4000
VITE_LITELLM_PROD_URL=https://api.litellm.com
VITE_LITELLM_API_KEY=sk-...

VITE_N8N_TEST_URL=http://localhost:5678/webhook/test
VITE_N8N_PROD_URL=https://your-n8n.com/webhook/prod
```

## Testing

Run tests:
```bash
yarn test
```

Run E2E tests:
```bash
yarn test:e2e
```

## Future Enhancements

- [ ] Message persistence (localStorage/IndexedDB)
- [ ] Export/Import conversations
- [ ] Voice input/output
- [ ] File attachments
- [ ] Code syntax highlighting in messages
- [ ] Markdown rendering in messages
- [ ] Provider health monitoring
- [ ] Rate limiting
- [ ] Cost tracking
- [ ] Multi-language support
