import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { KanbanItem } from '../types';

interface SortableItemProps {
  item: KanbanItem;
}

export function SortableItem({ item }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="card bg-base-100 shadow-md mb-3 cursor-move"
    >
      <div className="card-body p-4">
        <p className="text-sm">{item.content}</p>
      </div>
    </div>
  );
}
