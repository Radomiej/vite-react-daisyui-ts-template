import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import React from 'react';

interface DroppableContainerProps {
  id: string;
  title: string;
  children: React.ReactNode;
  isMilestone?: boolean;
  isOverlay?: boolean;
}

export function DroppableContainer({
  id,
  title,
  children,
  isMilestone,
  isOverlay,
}: DroppableContainerProps) {
  const { setNodeRef: droppableSetNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: isMilestone ? 'Milestone' : 'Container',
    },
  });

  const { 
    attributes, 
    listeners, 
    setNodeRef: sortableSetNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({
    id,
    data: {
      type: isMilestone ? 'Milestone' : 'Container',
    },
  });

  const setNodeRef = (node: HTMLElement | null) => {
    droppableSetNodeRef(node);
    sortableSetNodeRef(node);
  };

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : undefined,
  };

  const containerClasses = `
    flex flex-col rounded-box shadow-md 
    ${isMilestone ? 'bg-base-300 w-auto p-6 min-h-[10rem]' : 'bg-base-200 w-80 p-4'}
    ${isOverlay ? 'ring-2 ring-primary' : ''}
    ${isOver ? 'ring-2 ring-secondary' : ''}
  `;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={containerClasses}
      data-testid={`container-${id}`}
    >
      <h2 {...attributes} {...listeners} className="text-lg font-bold mb-4 cursor-grab">
        {title}
      </h2>
      <div className="flex flex-col gap-2 flex-grow">
        {children}
      </div>
    </div>
  );
}
