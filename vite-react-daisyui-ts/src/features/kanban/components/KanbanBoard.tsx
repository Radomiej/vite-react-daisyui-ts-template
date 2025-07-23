import React, { useState } from 'react';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent, DragOverEvent, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import type { KanbanBoard as KanbanBoardType, KanbanColumn as KanbanColumnType, KanbanTask as KanbanTaskType } from '../types';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  initialBoard?: KanbanBoardType;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialBoard }) => {
  const [columns, setColumns] = useState<KanbanColumnType[]>(
    initialBoard?.columns || [
      {
        id: 'todo',
        title: 'To Do',
        tasks: [],
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        tasks: [],
      },
      {
        id: 'done',
        title: 'Done',
        tasks: [],
      },
    ]
  );
  
  const [activeTask, setActiveTask] = useState<KanbanTaskType | null>(null);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const { id } = active;
    
    // Find the task being dragged
    const draggedTask = findTaskById(id);
    if (draggedTask) {
      setActiveTask(draggedTask);
    }
  };
  
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    // Find the columns
    const activeColumnId = active.data?.current?.columnId;
    const overColumnId = findColumnIdByTaskId(overId) || overId;
    
    // If task is dropped in the same column, do nothing during dragOver
    if (activeColumnId === overColumnId) return;
    
    setColumns(prevColumns => {
      // Find the source and destination columns
      const activeColumnIndex = prevColumns.findIndex(col => col.id === activeColumnId);
      const overColumnIndex = prevColumns.findIndex(col => col.id === overColumnId);
      
      if (activeColumnIndex === -1 || overColumnIndex === -1) {
        return prevColumns;
      }
      
      const activeColumn = prevColumns[activeColumnIndex];
      
      // Find the task in the source column
      const taskIndex = activeColumn.tasks.findIndex(task => task.id === activeId);
      if (taskIndex === -1) {
        return prevColumns;
      }
      
      // Create a new array of columns
      const newColumns = [...prevColumns];
      
      // Remove the task from the source column
      const [removedTask] = newColumns[activeColumnIndex].tasks.splice(taskIndex, 1);
      
      // Add the task to the destination column
      // If the over item is a column, add to the end
      if (over.data?.current?.type === 'column') {
        newColumns[overColumnIndex].tasks.push(removedTask);
      } else {
        // If the over item is a task, find its index and insert before it
        const overTaskIndex = newColumns[overColumnIndex].tasks.findIndex(
          task => task.id === overId
        );
        
        if (overTaskIndex !== -1) {
          newColumns[overColumnIndex].tasks.splice(overTaskIndex, 0, removedTask);
        } else {
          // Fallback: add to the end
          newColumns[overColumnIndex].tasks.push(removedTask);
        }
      }
      
      return newColumns;
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    // Reset active states
    setActiveTask(null);
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;
    
    // Find the columns
    const activeColumnId = active.data?.current?.columnId;
    const overColumnId = findColumnIdByTaskId(overId) || overId;
    
    // If task is dropped in the same column, handle reordering
    if (activeColumnId === overColumnId) {
      // Same column reordering
      setColumns(prevColumns => {
        const columnIndex = prevColumns.findIndex(col => col.id === activeColumnId);
        if (columnIndex === -1) return prevColumns;
        
        const column = prevColumns[columnIndex];
        const activeIndex = column.tasks.findIndex(task => task.id === activeId);
        const overIndex = column.tasks.findIndex(task => task.id === overId);
        
        if (activeIndex === -1 || overIndex === -1) return prevColumns;
        
        // Create new columns array
        const newColumns = [...prevColumns];
        
        // Create new tasks array with reordered tasks
        newColumns[columnIndex] = {
          ...column,
          tasks: arrayMove(column.tasks, activeIndex, overIndex)
        };
        
        return newColumns;
      });
    } else {
      // Cross-column movement
      setColumns(prevColumns => {
        // Find the source and destination columns
        const activeColumnIndex = prevColumns.findIndex(col => col.id === activeColumnId);
        const overColumnIndex = prevColumns.findIndex(col => col.id === overColumnId);
        
        if (activeColumnIndex === -1 || overColumnIndex === -1) {
          return prevColumns;
        }
        
        const activeColumn = prevColumns[activeColumnIndex];
        const overColumn = prevColumns[overColumnIndex];
        
        // Find the task in the source column
        const taskIndex = activeColumn.tasks.findIndex(task => task.id === activeId);
        if (taskIndex === -1) {
          return prevColumns;
        }
        
        // Create a new array of columns
        const newColumns = [...prevColumns];
        
        // Remove the task from the source column
        const [removedTask] = newColumns[activeColumnIndex].tasks.splice(taskIndex, 1);
        
        // Determine where to insert the task in the destination column
        if (overId === overColumnId) {
          // Dropped directly on the column - add to the end
          newColumns[overColumnIndex].tasks.push(removedTask);
        } else {
          // Dropped on a task - find its position and insert there
          const overTaskIndex = overColumn.tasks.findIndex(task => task.id === overId);
          
          if (overTaskIndex !== -1) {
            // Insert at the specific position
            newColumns[overColumnIndex].tasks.splice(overTaskIndex, 0, removedTask);
          } else {
            // Fallback - add to the end
            newColumns[overColumnIndex].tasks.push(removedTask);
          }
        }
        
        return newColumns;
      });
    }
  };

  const findTaskById = (id: UniqueIdentifier): KanbanTaskType | null => {
    for (const column of columns) {
      const task = column.tasks.find(task => task.id === id);
      if (task) {
        return task;
      }
    }
    return null;
  };

  const findColumnIdByTaskId = (taskId: UniqueIdentifier): UniqueIdentifier | null => {
    for (const column of columns) {
      const taskExists = column.tasks.some(task => task.id === taskId);
      if (taskExists) {
        return column.id;
      }
    }
    return null;
  };

  const handleAddTask = (columnId: string | number, taskTitle: string) => {
    setColumns(prevColumns => {
      const columnIndex = prevColumns.findIndex(col => col.id === columnId);
      if (columnIndex === -1) {
        return prevColumns;
      }
      
      const newColumns = [...prevColumns];
      const newTask: KanbanTaskType = {
        id: `task-${Date.now()}`,
        title: taskTitle,
        createdAt: new Date(),
      };
      
      newColumns[columnIndex].tasks.push(newTask);
      return newColumns;
    });
  };

  const handleAddColumn = () => {
    if (newColumnTitle.trim()) {
      const newColumn: KanbanColumnType = {
        id: `column-${Date.now()}`,
        title: newColumnTitle.trim(),
        tasks: [],
      };
      
      setColumns(prevColumns => [...prevColumns, newColumn]);
      setNewColumnTitle('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddColumn();
    }
  };

  return (
    <div className="flex flex-col">
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCorners}
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>
          
          <div className="flex mb-6">
            <input
              type="text"
              placeholder="Add new column..."
              className="input input-bordered w-64"
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="btn btn-primary ml-2" 
              onClick={handleAddColumn}
              disabled={!newColumnTitle.trim()}
            >
              Add Column
            </button>
          </div>
          
          <div className="flex overflow-x-auto pb-4">
            {columns.map(column => (
              <KanbanColumn
                key={column.id.toString()}
                column={column}
                onAddTask={handleAddTask}
              />
            ))}
          </div>
          
          <DragOverlay>
            {activeTask ? (
              <div className="card bg-base-100 shadow-xl w-72 opacity-80">
                <div className="card-body">
                  <h3 className="card-title">{activeTask.title}</h3>
                  {activeTask.description && <p>{activeTask.description}</p>}
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
