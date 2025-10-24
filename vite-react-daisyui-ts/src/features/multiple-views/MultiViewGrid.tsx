import React, { useState, useCallback } from 'react';
import { ViewContainer } from './components/ViewContainer';
import { ControlPanel } from './components/ControlPanel';
import { DebugPanel } from './components/DebugPanel';
import type { ViewInstance } from './types/view.types';

export const MultiViewGrid: React.FC = () => {
  const [url, setUrl] = useState('');
  const [viewCount, setViewCount] = useState(1);
  const [views, setViews] = useState<ViewInstance[]>([]);
  const [showDebug, setShowDebug] = useState(false);
  const [gridCols, setGridCols] = useState(2);

  const handleRun = useCallback(() => {
    if (!url.trim()) {
      alert('Proszę podaj URL lub ścieżkę');
      return;
    }

    const newViews = Array.from({ length: viewCount }, (_, i) => ({
      id: `view-${Date.now()}-${i}`,
      url: url.trim(),
      title: `${url.split('/').pop() || 'View'} #${i + 1}`,
      isActive: true,
      createdAt: new Date().toISOString(),
    }));

    setViews(newViews);
  }, [url, viewCount]);

  const handleAddView = useCallback(() => {
    if (!url.trim()) {
      alert('Proszę podaj URL lub ścieżkę');
      return;
    }

    const newView: ViewInstance = {
      id: `view-${Date.now()}`,
      url: url.trim(),
      title: `${url.split('/').pop() || 'View'} #${Date.now()}`,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    setViews(prevViews => [...prevViews, newView]);
  }, [url]);

  const handleRemoveView = useCallback((id: string) => {
    setViews(prevViews => prevViews.filter(v => v.id !== id));
  }, []);

  const handleReloadView = useCallback((id: string) => {
    setViews(prevViews => prevViews.map(v => 
      v.id === id ? { ...v, reloadKey: Date.now() } : v
    ));
  }, []);

  const handleClearAll = useCallback(() => {
    if (window.confirm('Czy na pewno chcesz usunąć wszystkie widoki?')) {
      setViews([]);
    }
  }, []);

  const handleDuplicateView = useCallback((id: string) => {
    setViews(prevViews => {
      const viewToDuplicate = prevViews.find(v => v.id === id);
      if (viewToDuplicate) {
        const newView: ViewInstance = {
          ...viewToDuplicate,
          id: `view-${Date.now()}`,
          title: `${viewToDuplicate.title} (copy)`,
          createdAt: new Date().toISOString(),
        };
        return [...prevViews, newView];
      }
      return prevViews;
    });
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleRun();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-base-200 p-4 gap-4">
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">🎮 Multiple Views Manager</h2>
          
          <ControlPanel
            url={url}
            onUrlChange={setUrl}
            viewCount={viewCount}
            onViewCountChange={setViewCount}
            gridCols={gridCols}
            onGridColsChange={setGridCols}
            onRun={handleRun}
            onAddView={handleAddView}
            onClearAll={handleClearAll}
            onToggleDebug={() => setShowDebug(!showDebug)}
            showDebug={showDebug}
            onKeyPress={handleKeyPress}
            viewsCount={views.length}
          />
        </div>
      </div>

      {showDebug && <DebugPanel views={views} />}

      <div className="flex-1 overflow-auto">
        {views.length === 0 ? (
          <div className="card bg-base-100 shadow-lg h-full flex items-center justify-center">
            <div className="card-body text-center">
              <h3 className="text-xl font-semibold mb-2">Brak otwartych widoków</h3>
              <p className="text-base-content/70">
                Podaj URL/ścieżkę powyżej i kliknij "Run" aby otworzyć widoki
              </p>
            </div>
          </div>
        ) : (
          <div
            className="grid gap-4 auto-rows-max"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
            }}
          >
            {views.map((view) => (
              <ViewContainer
                key={view.id}
                view={view}
                onRemove={handleRemoveView}
                onReload={handleReloadView}
                onDuplicate={handleDuplicateView}
              />
            ))}
          </div>
        )}
      </div>

      <div className="stats stats-vertical lg:stats-horizontal shadow-lg bg-base-100">
        <div className="stat">
          <div className="stat-title">Aktywne widoki</div>
          <div className="stat-value text-primary">{views.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Kolumny grid</div>
          <div className="stat-value text-secondary">{gridCols}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Bieżący URL</div>
          <div className="stat-value text-sm truncate">{url || 'Brak'}</div>
        </div>
      </div>
    </div>
  );
};

export default MultiViewGrid;
