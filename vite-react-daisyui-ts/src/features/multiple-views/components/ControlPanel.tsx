import React from 'react';
import { Play, Plus, Trash2, Bug } from 'lucide-react';
import type { ControlPanelProps } from '../types/view.types';

export const ControlPanel: React.FC<ControlPanelProps> = ({
  url,
  onUrlChange,
  viewCount,
  onViewCountChange,
  gridCols,
  onGridColsChange,
  onRun,
  onAddView,
  onClearAll,
  onToggleDebug,
  showDebug,
  onKeyPress,
  viewsCount,
}) => {
  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">URL lub ścieżka do strony</span>
        </label>
        <input
          type="text"
          placeholder="np. https://example.com lub /demo"
          className="input input-bordered w-full"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          onKeyPress={onKeyPress}
        />
        <label className="label">
          <span className="label-text-alt">
            Wpisz URL lub ścieżkę względną do strony którą chcesz wyświetlić
          </span>
        </label>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* View Count Slider */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Liczba widoków</span>
            <span className="badge badge-primary">{viewCount}</span>
          </label>
          <input
            type="range"
            min="1"
            max="12"
            value={viewCount}
            onChange={(e) => onViewCountChange(parseInt(e.target.value))}
            className="range range-sm"
          />
          <label className="label">
            <span className="label-text-alt">1</span>
            <span className="label-text-alt">12</span>
          </label>
        </div>

        {/* Grid Columns Slider */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-semibold">Kolumny grid</span>
            <span className="badge badge-secondary">{gridCols}</span>
          </label>
          <input
            type="range"
            min="1"
            max="4"
            value={gridCols}
            onChange={(e) => onGridColsChange(parseInt(e.target.value))}
            className="range range-sm"
          />
          <label className="label">
            <span className="label-text-alt">1</span>
            <span className="label-text-alt">4</span>
          </label>
        </div>

        {/* Status */}
        <div className="form-control justify-end">
          <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-200 text-sm">
            <div className="stat px-3 py-2">
              <div className="stat-title text-xs">Aktywne</div>
              <div className="stat-value text-lg text-primary">{viewsCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onRun}
          className="btn btn-primary gap-2 flex-1 min-w-32"
          disabled={!url.trim()}
        >
          <Play className="w-4 h-4" />
          Uruchom ({viewCount})
        </button>

        <button
          onClick={onAddView}
          className="btn btn-info gap-2 flex-1 min-w-32"
          disabled={!url.trim()}
        >
          <Plus className="w-4 h-4" />
          Dodaj widok
        </button>

        <button
          onClick={onClearAll}
          className="btn btn-error gap-2 flex-1 min-w-32"
          disabled={viewsCount === 0}
        >
          <Trash2 className="w-4 h-4" />
          Wyczyść wszystko
        </button>

        <button
          onClick={onToggleDebug}
          className={`btn gap-2 flex-1 min-w-32 ${showDebug ? 'btn-warning' : 'btn-ghost'}`}
        >
          <Bug className="w-4 h-4" />
          Debug {showDebug ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Info Box */}
      <div className="alert alert-info">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="stroke-current shrink-0 w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <div>
          <h3 className="font-bold">Wskazówka</h3>
          <div className="text-xs">
            Każdy widok jest izolowany w iframe. Możesz testować multiplayer, gry Phaser i React aplikacje jednocześnie.
            Użyj suwaka do zmiany liczby widoków i kolumn grid.
          </div>
        </div>
      </div>
    </div>
  );
};
