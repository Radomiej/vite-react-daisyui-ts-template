export interface ViewInstance {
  id: string;
  url: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  reloadKey?: number;
}

export interface ViewContainerProps {
  view: ViewInstance;
  onRemove: (id: string) => void;
  onReload: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export interface ControlPanelProps {
  url: string;
  onUrlChange: (url: string) => void;
  viewCount: number;
  onViewCountChange: (count: number) => void;
  gridCols: number;
  onGridColsChange: (cols: number) => void;
  onRun: () => void;
  onAddView: () => void;
  onClearAll: () => void;
  onToggleDebug: () => void;
  showDebug: boolean;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  viewsCount: number;
}

export interface DebugPanelProps {
  views: ViewInstance[];
}
