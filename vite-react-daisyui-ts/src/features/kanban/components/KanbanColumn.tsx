import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { KanbanColumn as KanbanColumnType, KanbanTask as KanbanTaskType } from '../types';
import KanbanTask from './KanbanTask';

interface KanbanColumnProps {
  column: KanbanColumnType;
  onAddTask?: (columnId: string | number, taskTitle: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, onAddTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      columnId: column.id,
    },
  });

  const handleAddTask = () => {
    if (newTaskTitle.trim() && onAddTask) {
      onAddTask(column.id, newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  return (
    <div className="flex flex-col w-72 bg-base-200 rounded-lg p-3 mr-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-lg">{column.title}</h2>
        <span className="badge badge-neutral">{column.tasks.length}</span>
      </div>
      
      <div 
        ref={setNodeRef} 
        className="flex-1 min-h-[200px] flex flex-col"
      >
        <SortableContext 
          items={column.tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.tasks.map((task: KanbanTaskType, index: number) => (
            <KanbanTask 
              key={task.id.toString()} 
              task={task} 
              index={index} 
              columnId={column.id} 
            />
          ))}
        </SortableContext>
      </div>
      
      <div className="mt-3">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Add new task..."
            className="input input-sm input-bordered w-full"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className="btn btn-sm btn-primary ml-2" 
            onClick={handleAddTask}
            disabled={!newTaskTitle.trim()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
