import React, { useState } from 'react';
import { Plus, Trash2, Check } from 'lucide-react';
import type { AIProviderConfig } from '../types';

interface ProviderSelectorProps {
  providers: AIProviderConfig[];
  selectedProvider: AIProviderConfig;
  onSelectProvider: (provider: AIProviderConfig) => void;
  onAddProvider: (provider: AIProviderConfig) => void;
  onRemoveProvider: (providerName: string) => void;
}

export const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  providers,
  selectedProvider,
  onSelectProvider,
  onAddProvider,
  onRemoveProvider,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProvider, setNewProvider] = useState<Partial<AIProviderConfig>>({
    type: 'litellm',
  });

  const handleSubmitNewProvider = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProvider.name && newProvider.testUrl && newProvider.productionUrl) {
      onAddProvider(newProvider as AIProviderConfig);
      setNewProvider({ type: 'litellm' });
      setShowAddForm(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Providers</h2>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* Add Provider Form */}
      {showAddForm && (
        <div className="card bg-base-300 shadow-xl mb-4">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">New Provider</h3>
            <form onSubmit={handleSubmitNewProvider} className="space-y-3">
              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs">Name</span>
                </label>
                <input
                  type="text"
                  className="input input-sm input-bordered"
                  value={newProvider.name || ''}
                  onChange={(e) => setNewProvider({ ...newProvider, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs">Type</span>
                </label>
                <select
                  className="select select-sm select-bordered"
                  value={newProvider.type}
                  onChange={(e) => setNewProvider({ ...newProvider, type: e.target.value as 'litellm' | 'n8n' })}
                >
                  <option value="litellm">LiteLLM</option>
                  <option value="n8n">N8n</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs">Test URL</span>
                </label>
                <input
                  type="url"
                  className="input input-sm input-bordered"
                  value={newProvider.testUrl || ''}
                  onChange={(e) => setNewProvider({ ...newProvider, testUrl: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs">Production URL</span>
                </label>
                <input
                  type="url"
                  className="input input-sm input-bordered"
                  value={newProvider.productionUrl || ''}
                  onChange={(e) => setNewProvider({ ...newProvider, productionUrl: e.target.value })}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label py-1">
                  <span className="label-text text-xs">API Key (optional)</span>
                </label>
                <input
                  type="password"
                  className="input input-sm input-bordered"
                  value={newProvider.apiKey || ''}
                  onChange={(e) => setNewProvider({ ...newProvider, apiKey: e.target.value })}
                />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="btn btn-sm btn-primary flex-1">
                  Add Provider
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Provider List */}
      <div className="space-y-2">
        {providers.map((provider) => (
          <div
            key={provider.name}
            className={`card cursor-pointer transition-all ${
              selectedProvider.name === provider.name
                ? 'bg-primary text-primary-content shadow-lg'
                : 'bg-base-300 hover:bg-base-200'
            }`}
            onClick={() => onSelectProvider(provider)}
          >
            <div className="card-body p-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    {provider.name}
                    {selectedProvider.name === provider.name && (
                      <Check size={14} />
                    )}
                  </h3>
                  <p className="text-xs opacity-70 mt-1">
                    Type: {provider.type.toUpperCase()}
                  </p>
                </div>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveProvider(provider.name);
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="text-xs opacity-60 mt-2">
                <div className="truncate">Test: {provider.testUrl}</div>
                <div className="truncate">Prod: {provider.productionUrl}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
