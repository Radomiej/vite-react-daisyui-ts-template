import React from 'react';
import { Copy, Check } from 'lucide-react';
import type { DebugPanelProps } from '../types/view.types';

export const DebugPanel: React.FC<DebugPanelProps> = ({ views }) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyJson = (id: string) => {
    const view = views.find(v => v.id === id);
    if (view) {
      navigator.clipboard.writeText(JSON.stringify(view, null, 2));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCopyAllJson = () => {
    navigator.clipboard.writeText(JSON.stringify(views, null, 2));
    setCopiedId('all');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="card bg-warning/10 border border-warning shadow-lg">
      <div className="card-body p-4">
        <h3 className="card-title text-lg mb-4 flex items-center gap-2">
          🐛 Debug Panel
          <span className="badge badge-warning">{views.length} widoków</span>
        </h3>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {views.length === 0 ? (
            <p className="text-base-content/60 text-sm">Brak widoków do wyświetlenia</p>
          ) : (
            views.map((view) => (
              <div key={view.id} className="bg-base-100 p-3 rounded-lg border border-base-300">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs font-semibold text-primary truncate">
                      {view.id}
                    </p>
                    <p className="text-xs text-base-content/70 truncate">
                      URL: {view.url}
                    </p>
                    <p className="text-xs text-base-content/70">
                      Utworzono: {new Date(view.createdAt).toLocaleString('pl-PL')}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyJson(view.id)}
                    className="btn btn-xs btn-ghost"
                    title="Skopiuj JSON"
                  >
                    {copiedId === view.id ? (
                      <Check className="w-3 h-3 text-success" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>

                <div className="bg-base-200 p-2 rounded text-xs font-mono overflow-x-auto">
                  <pre className="whitespace-pre-wrap break-words">
                    {JSON.stringify(
                      {
                        id: view.id,
                        url: view.url,
                        title: view.title,
                        isActive: view.isActive,
                        createdAt: view.createdAt,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>

        {views.length > 0 && (
          <div className="mt-4 pt-4 border-t border-warning/30">
            <button
              onClick={handleCopyAllJson}
              className="btn btn-sm btn-outline btn-warning w-full gap-2"
            >
              {copiedId === 'all' ? (
                <>
                  <Check className="w-4 h-4" />
                  Skopiowano!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Skopiuj wszystkie dane
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
