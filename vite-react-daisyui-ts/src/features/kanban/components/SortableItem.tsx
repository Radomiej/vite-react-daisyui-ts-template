import { useSortable } from '@dnd-kit/sortable';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  isOverlay?: boolean;
}

export function SortableItem({ id, children, isOverlay }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: {
      type: 'Task',
    },
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const itemClasses = isOverlay
    ? `card p-4 bg-primary text-primary-content rounded-box shadow-lg cursor-grabbing`
    : `card p-4 bg-base-100 rounded-box shadow-md cursor-grab`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={itemClasses}
      data-testid={`sortable-item-${id}`}
    >
      {children}
    </div>
  );
}
