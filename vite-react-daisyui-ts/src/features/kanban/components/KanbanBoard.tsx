import { useState } from 'react';
import { 
  DndContext, 
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { KanbanContainer, KanbanItem, KanbanState } from '../types';
import { DroppableContainer } from './DroppableContainer';
import { SortableItem } from './SortableItem';

// Initial demo data
const initialData: KanbanState = {
  containers: [
    {
      id: 'todo',
      title: 'To Do'
    },
    {
      id: 'in-progress',
      title: 'In Progress'
    },
    {
      id: 'done',
      title: 'Done'
    }
  ],
  items: [
    {
      id: 'task-1',
      content: 'Research project requirements',
      containerId: 'todo'
    },
    {
      id: 'task-2',
      content: 'Create project structure',
      containerId: 'todo'
    },
    {
      id: 'task-3',
      content: 'Design UI components',
      containerId: 'in-progress'
    },
    {
      id: 'task-4',
      content: 'Implement authentication',
      containerId: 'in-progress'
    },
    {
      id: 'task-5',
      content: 'Write documentation',
      containerId: 'done'
    }
  ]
};

export function KanbanBoard() {
  const [items, setItems] = useState<KanbanItem[]>(initialData.items);
  const [containers] = useState<KanbanContainer[]>(initialData.containers);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Find the active item for the drag overlay
  const activeItem = activeId ? items.find(item => item.id === activeId) : null;

  // Group items by container
  const itemsByContainer = containers.reduce<Record<string, KanbanItem[]>>((acc, container) => {
    acc[container.id] = items.filter(item => item.containerId === container.id);
    return acc;
  }, {});

  // Handle drag start
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
  }

  // Handle drag over - this is where we handle moving items between containers
  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find the active item
    const activeItem = items.find(item => item.id === activeId);
    
    // If we can't find the item or the over element is the same as the active container, do nothing
    if (!activeItem) return;
    
    // Check if we're hovering over a container
    const isOverContainer = containers.some(container => container.id === overId);
    
    if (isOverContainer) {
      // If we're hovering over a container and the item isn't already in that container
      if (activeItem.containerId !== overId) {
        setItems(items => {
          return items.map(item => {
            if (item.id === activeId) {
              return { ...item, containerId: overId };
            }
            return item;
          });
        });
      }
    } else {
      // We're hovering over another item
      const overItem = items.find(item => item.id === overId);
      
      // If we can't find the item or the items are in different containers, do nothing
      if (!overItem || overItem.containerId !== activeItem.containerId) return;
      
      // Reorder items in the same container
      setItems(items => {
        const oldIndex = items.findIndex(item => item.id === activeId);
        const newIndex = items.findIndex(item => item.id === overId);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  // Handle drag end
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find the containers for the active and over items
    const activeContainer = items.find(item => item.id === activeId)?.containerId;
    
    // Check if we're dropping over a container
    const isOverContainer = containers.some(container => container.id === overId);
    
    if (isOverContainer) {
      // If we're dropping over a container and the item isn't already in that container
      if (activeContainer !== overId) {
        setItems(items => {
          return items.map(item => {
            if (item.id === activeId) {
              return { ...item, containerId: overId };
            }
            return item;
          });
        });
      }
    } else {
      // We're dropping over another item
      const overContainer = items.find(item => item.id === overId)?.containerId;
      
      // If the containers are different, move the item to the new container
      if (activeContainer !== overContainer) {
        setItems(items => {
          return items.map(item => {
            if (item.id === activeId) {
              return { ...item, containerId: overContainer! };
            }
            return item;
          });
        });
      } else {
        // Reorder items in the same container
        setItems(items => {
          const oldIndex = items.findIndex(item => item.id === activeId);
          const newIndex = items.findIndex(item => item.id === overId);
          
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    }
    
    setActiveId(null);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {containers.map(container => (
            <DroppableContainer
              key={container.id}
              container={container}
              items={itemsByContainer[container.id] || []}
            />
          ))}
        </div>

        <DragOverlay>
          {activeItem ? <SortableItem item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
