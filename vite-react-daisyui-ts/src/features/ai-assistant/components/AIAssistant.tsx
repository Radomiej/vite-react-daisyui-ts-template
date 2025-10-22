import React, { useState } from 'react';
import { ProviderSelector } from './ProviderSelector';
import { ChatInterface } from './ChatInterface';
import type { AIProviderConfig } from '../types';

// Default provider configurations
const DEFAULT_PROVIDERS: AIProviderConfig[] = [
  {
    name: 'LiteLLM (Test)',
    type: 'litellm',
    testUrl: 'http://localhost:4000',
    productionUrl: 'https://api.litellm.com',
  },
  {
    name: 'N8n Webhook (Test)',
    type: 'n8n',
    testUrl: 'http://localhost:5678/webhook/test',
    productionUrl: 'https://your-n8n-instance.com/webhook/prod',
  },
];

export const AIAssistant: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<AIProviderConfig>(DEFAULT_PROVIDERS[0]);
  const [useProduction, setUseProduction] = useState(false);
  const [customProviders, setCustomProviders] = useState<AIProviderConfig[]>(DEFAULT_PROVIDERS);

  const handleAddProvider = (provider: AIProviderConfig) => {
    setCustomProviders(prev => [...prev, provider]);
  };

  const handleRemoveProvider = (providerName: string) => {
    setCustomProviders(prev => prev.filter(p => p.name !== providerName));
    if (selectedProvider.name === providerName) {
      setSelectedProvider(customProviders[0] || DEFAULT_PROVIDERS[0]);
    }
  };

  const handleUpdateProvider = (oldName: string, newProvider: AIProviderConfig) => {
    setCustomProviders(prev => prev.map(p => p.name === oldName ? newProvider : p));
    if (selectedProvider.name === oldName) {
      setSelectedProvider(newProvider);
    }
  };

  return (
    <div className="flex flex-col h-full bg-base-100">
      {/* Header */}
      <div className="navbar bg-base-200 shadow-lg">
        <div className="flex-1">
          <h1 className="text-2xl font-bold ml-4">AI Assistant</h1>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <label className="label cursor-pointer gap-2">
              <span className="label-text">Production</span>
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={useProduction}
                onChange={(e) => setUseProduction(e.target.checked)}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Provider Selector */}
        <div className="w-80 bg-base-200 border-r border-base-300 overflow-y-auto">
          <ProviderSelector
            providers={customProviders}
            selectedProvider={selectedProvider}
            onSelectProvider={setSelectedProvider}
            onAddProvider={handleAddProvider}
            onRemoveProvider={handleRemoveProvider}
            onUpdateProvider={handleUpdateProvider}
          />
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            provider={selectedProvider}
            useProduction={useProduction}
          />
        </div>
      </div>
    </div>
  );
};
