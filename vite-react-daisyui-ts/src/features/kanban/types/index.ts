import type { UniqueIdentifier } from '@dnd-kit/core';

export interface KanbanTask {
  id: UniqueIdentifier;
  title: string;
  description?: string;
  createdAt: Date;
}

export interface KanbanColumn {
  id: UniqueIdentifier;
  title: string;
  tasks: KanbanTask[];
}

export interface KanbanBoard {
  columns: KanbanColumn[];
}

export type KanbanDragEndEvent = {
  active: {
    id: UniqueIdentifier;
    data?: {
      current: {
        columnId: UniqueIdentifier;
        index: number;
        task: KanbanTask;
      };
    };
  };
  over?: {
    id: UniqueIdentifier;
    data?: {
      current: {
        columnId: UniqueIdentifier;
        index: number;
      };
    };
  };
};
