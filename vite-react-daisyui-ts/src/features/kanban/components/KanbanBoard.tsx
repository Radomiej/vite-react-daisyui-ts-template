import { useState } from 'react';
import { 
  DndContext, 
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  CollisionDetection,
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
  // We don't need to track active and over containers separately anymore
  // as we're using dnd-kit's native placeholder/ghost functionality

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
    const activeId = active.id as string;
    setActiveId(activeId);
    
    // Find the container of the active item
    const activeItem = items.find(item => item.id === activeId);
    if (activeItem) {
      // We now rely on dnd-kit's native tracking of active items
    }
  }

  // Custom collision detection strategy that prioritizes detecting collisions with the cursor
  const collisionDetectionStrategy: CollisionDetection = (args) => {
    // First, let's check if there are any collisions with the pointer
    const pointerCollisions = pointerWithin(args);
    
    if (pointerCollisions.length > 0) {
      // If there are pointer collisions, return those
      return pointerCollisions;
    }
    
    // If no pointer collisions, use rectangle intersection
    return rectIntersection(args);
  };

  // Handle drag over - this is where we handle moving items between containers
  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    
    if (!over) {
      // No need to track over container state anymore
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find the active item
    const activeItem = items.find(item => item.id === activeId);
    
    // If we can't find the item, do nothing
    if (!activeItem) return;
    
    // Check if we're hovering over a container
    const isOverContainer = containers.some(container => container.id === overId);
    
    if (isOverContainer) {
      // We're hovering over a container - dnd-kit handles the placeholder
      
      // If we're hovering over a container and the item isn't already in that container
      if (activeItem.containerId !== overId) {
        // Move the item to the end of the target container while dragging
        setItems(items => {
          const activeIndex = items.findIndex(item => item.id === activeId);
          
          // Create a new array with the active item moved to the new container
          return items.map((item, index) => {
            if (index === activeIndex) {
              return { ...item, containerId: overId };
            }
            return item;
          });
        });
      }
    } else {
      // We're hovering over another item
      const overItem = items.find(item => item.id === overId);
      
      if (!overItem) return;
      
      // We're hovering over an item - dnd-kit handles the placeholder
      
      // If the items are in the same container, reorder them
      if (overItem.containerId === activeItem.containerId) {
        // Reorder items in the same container
        setItems(items => {
          const oldIndex = items.findIndex(item => item.id === activeId);
          const newIndex = items.findIndex(item => item.id === overId);
          
          return arrayMove(items, oldIndex, newIndex);
        });
      } else {
        // Cross-container drag - move the item to the new container at the position of the over item
        setItems(items => {
          const oldIndex = items.findIndex(item => item.id === activeId);
          const newIndex = items.findIndex(item => item.id === overId);
          
          // Create a new array with the active item removed
          const newItems = [...items];
          const [movedItem] = newItems.splice(oldIndex, 1);
          
          // Update the container of the moved item
          movedItem.containerId = overItem.containerId;
          
          // Insert the moved item at the new position
          newItems.splice(newIndex, 0, movedItem);
          
          return newItems;
        });
      }
    }
  }

  // Handle drag end
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      // Reset only the active ID
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find the containers for the active and over items
    const activeItemContainer = items.find(item => item.id === activeId)?.containerId;
    
    // Check if we're dropping over a container
    const isOverContainer = containers.some(container => container.id === overId);
    
    if (isOverContainer) {
      // If we're dropping over a container and the item isn't already in that container
      if (activeItemContainer !== overId) {
        // Move the item to the end of the target container
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
      const overItem = items.find(item => item.id === overId);
      if (!overItem) {
        setActiveId(null);
        // Reset only the active ID
        return;
      }
      
      const overItemContainer = overItem.containerId;
      
      // If the containers are different, move the item to the new container and position
      if (activeItemContainer !== overItemContainer) {
        setItems(items => {
          // Calculate insertion position based on the over item's position in its container
          
          // Create a new array with the active item moved to the new container at the right position
          const newItems = items.filter(item => item.id !== activeId);
          
          // Insert the active item at the correct position in the new container
          const activeItem = items.find(item => item.id === activeId)!;
          const updatedActiveItem = { ...activeItem, containerId: overItemContainer };
          
          // Insert the active item at the position after the over item
          let insertIndex = newItems.findIndex(item => item.id === overId) + 1;
          newItems.splice(insertIndex, 0, updatedActiveItem);
          
          return newItems;
        });
      } else {
        // Reorder items in the same container (already handled in handleDragOver)
      }
    }
    
    // Reset all drag states
    setActiveId(null);
    // Reset only the active ID
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>
      
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
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
              activeId={activeId}
            />
          ))}
        </div>

        <DragOverlay>
          {activeItem ? <SortableItem item={activeItem} isActive={true} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
