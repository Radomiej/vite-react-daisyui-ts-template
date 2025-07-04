import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { KanbanItem } from '../types';

interface SortableItemProps {
  item: KanbanItem;
  isActive?: boolean;
  disabled?: boolean;
}

export function SortableItem({ item, isActive = false, disabled = false }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: item.id,
    disabled
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1, // Make the original item semi-transparent when dragging
  };

  // Apply different styles based on the item's state
  const cardClasses = [
    'card',
    isDragging ? 'bg-base-300' : isActive ? 'bg-base-200' : 'bg-base-100',
    'shadow-md',
    'mb-3',
    disabled ? 'cursor-default' : 'cursor-move',
    // Add a placeholder class when the item is being dragged
    isDragging ? 'border-2 border-dashed border-primary' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cardClasses}
      data-testid={`sortable-item-${item.id}`}
      data-is-dragging={isDragging || undefined}
      data-is-disabled={disabled || undefined}
    >
      <div className="card-body p-4">
        <p className="text-sm">{item.content}</p>
      </div>
    </div>
  );
}
