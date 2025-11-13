import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { KanbanTask as KanbanTaskType } from '../types';

interface KanbanTaskProps {
  task: KanbanTaskType;
  index: number;
  columnId: string | number;
}

export const KanbanTask: React.FC<KanbanTaskProps> = ({ task, index, columnId }) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      columnId,
      index,
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="card bg-base-100 shadow-md mb-3 cursor-move"
    >
      <div className="card-body p-4">
        <h3 className="card-title text-sm font-medium">{task.title}</h3>
        {task.description && (
          <p className="text-xs text-gray-500">{task.description}</p>
        )}
        <div className="text-xs text-gray-400 mt-2">
          {task.createdAt.toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default KanbanTask;
