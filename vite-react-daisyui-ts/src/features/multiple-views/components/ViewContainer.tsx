import React, { useState, useRef, useEffect } from 'react';
import { X, RotateCcw, Copy, ExternalLink } from 'lucide-react';
import type { ViewContainerProps } from '../types/view.types';

export const ViewContainer: React.FC<ViewContainerProps> = ({
  view,
  onRemove,
  onReload,
  onDuplicate,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
  }, [view.reloadKey]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Nie udało się załadować zawartości');
  };

  const handleOpenInNewTab = () => {
    window.open(view.url, '_blank');
  };

  const isExternalUrl = view.url.startsWith('http://') || view.url.startsWith('https://');
  const isSameSite = isExternalUrl && new URL(view.url).origin === window.location.origin;

  return (
    <div className="card bg-base-100 shadow-md border border-base-300 overflow-hidden flex flex-col h-full min-h-96">
      {/* Header */}
      <div className="card-body p-3 pb-2 bg-base-200 border-b border-base-300">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate" title={view.title}>
              {view.title}
            </h3>
            <p className="text-xs text-base-content/60 truncate" title={view.url}>
              {view.url}
            </p>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => onReload(view.id)}
              className="btn btn-xs btn-ghost"
              title="Przeładuj widok"
              disabled={isLoading}
            >
              <RotateCcw className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDuplicate(view.id)}
              className="btn btn-xs btn-ghost"
              title="Duplikuj widok"
            >
              <Copy className="w-3 h-3" />
            </button>
            {isExternalUrl && (
              <button
                onClick={handleOpenInNewTab}
                className="btn btn-xs btn-ghost"
                title="Otwórz w nowej karcie"
              >
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={() => onRemove(view.id)}
              className="btn btn-xs btn-ghost text-error"
              title="Usuń widok"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 relative overflow-hidden bg-base-50">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-base-100/50 z-10">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-error/10 z-10">
            <div className="text-center">
              <p className="text-error text-sm font-semibold">{error}</p>
              <button
                onClick={() => onReload(view.id)}
                className="btn btn-xs btn-error mt-2"
              >
                Spróbuj ponownie
              </button>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          key={view.reloadKey}
          src={view.url}
          title={view.title}
          className="w-full h-full border-none"
          sandbox={isSameSite ? 'allow-scripts allow-same-origin allow-forms allow-popups' : 'allow-scripts allow-forms allow-popups'}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>

      {/* Footer */}
      <div className="px-3 py-2 bg-base-200 border-t border-base-300 text-xs text-base-content/60">
        <span>Utworzono: {new Date(view.createdAt).toLocaleTimeString('pl-PL')}</span>
      </div>
    </div>
  );
};
