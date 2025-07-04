import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { KanbanContainer, KanbanItem } from '../types';
import { SortableItem } from './SortableItem';

interface DroppableContainerProps {
  container: KanbanContainer;
  items: KanbanItem[];
}

export function DroppableContainer({ container, items }: DroppableContainerProps) {
  const { setNodeRef } = useDroppable({
    id: container.id,
  });

  return (
    <div 
      ref={setNodeRef}
      className="card bg-base-200 w-72 p-4 flex-shrink-0"
    >
      <div className="card-title mb-4 text-lg font-bold">
        {container.title}
      </div>
      <SortableContext 
        items={items.map(item => item.id)} 
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
          {items.length === 0 && (
            <div className="text-sm text-base-content/50 p-4 text-center">
              Drop items here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
