import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, Active, Over } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import type { KanbanState } from '../types';
import { DroppableContainer } from './DroppableContainer';
import { SortableItem } from './SortableItem';

// New initial data with milestones
const initialData: KanbanState = {
  milestones: [
    { id: 'milestone-1', title: 'Q3 2024' },
    { id: 'milestone-2', title: 'Q4 2024' },
    { id: 'milestone-3', title: 'Backlog' },
  ],
  containers: [
    { id: 'todo', title: 'To Do', milestoneId: 'milestone-1' },
    { id: 'in-progress', title: 'In Progress', milestoneId: 'milestone-1' },
    { id: 'done', title: 'Done', milestoneId: 'milestone-2' },
  ],
  items: [
    { id: 'task-1', content: 'Research project requirements', containerId: 'todo' },
    { id: 'task-2', content: 'Create project structure', containerId: 'todo' },
    { id: 'task-3', content: 'Design UI components', containerId: 'in-progress' },
    { id: 'task-4', content: 'Implement authentication', containerId: 'in-progress' },
    { id: 'task-5', content: 'Write documentation', containerId: 'done' },
  ],
};

export function KanbanBoard() {
  const [kanbanState, setKanbanState] = useState<KanbanState>(initialData);
  const { items, containers, milestones } = kanbanState;
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeItem = activeId ? items.find((item) => item.id === activeId) : null;
  const activeContainer = activeId ? containers.find((container) => container.id === activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id as string);
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    if (!over) {
      setActiveId(null);
      return;
    }

    if (active.id === over.id) {
      setActiveId(null);
      return;
    }

    const activeIsContainer = active.data.current?.type === 'Container';

    if (activeIsContainer) {
      handleContainerDragEnd(active, over);
    } else {
      handleItemDragEnd(active, over);
    }

    setActiveId(null);
  }

  function handleContainerDragEnd(active: Active, over: Over) {
    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeContainerIndex = containers.findIndex((c) => c.id === activeId);

    // Determine the target milestone and index
    let overMilestoneId: string | undefined;
    let overContainerIndex: number;

    if (over.data.current?.type === 'Container') {
      overContainerIndex = containers.findIndex((c) => c.id === overId);
      if (overContainerIndex === -1) return;
      overMilestoneId = containers[overContainerIndex].milestoneId;
    } else if (over.data.current?.type === 'Milestone') {
      overMilestoneId = overId;
      // Find the last container in the target milestone to drop after it
      const lastContainerInMilestone = [...containers].reverse().find(c => c.milestoneId === overMilestoneId);
      overContainerIndex = lastContainerInMilestone ? containers.indexOf(lastContainerInMilestone) + 1 : activeContainerIndex;
    } else {
      return; // Not a valid drop target
    }

    setKanbanState((prev) => {
      const newContainers = [...prev.containers];
      // Update the milestone ID of the dragged container
      newContainers[activeContainerIndex].milestoneId = overMilestoneId;

      // Reorder the containers array
      return {
        ...prev,
        containers: arrayMove(newContainers, activeContainerIndex, overContainerIndex),
      };
    });
  }

  function handleItemDragEnd(active: Active, over: Over) {
    const activeItemId = active.id as string;
    const overId = over.id as string;
    
    const activeIndex = items.findIndex(item => item.id === activeItemId);
    const overIsContainer = over.data.current?.type === 'Container';
    
    let newContainerId: string;
    let overIndex: number;

    if (overIsContainer) {
      newContainerId = overId;
      overIndex = items.filter(i => i.containerId === newContainerId).length;
    } else {
      const overItemIndex = items.findIndex(item => item.id === overId);
      newContainerId = items[overItemIndex].containerId;
      overIndex = overItemIndex;
    }

    setKanbanState(prev => {
      const newItems = [...prev.items];
      newItems[activeIndex] = { ...newItems[activeIndex], containerId: newContainerId };
      return { ...prev, items: arrayMove(newItems, activeIndex, overIndex) };
    });
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-8 p-4 bg-base-300">
          {milestones.map((milestone) => (
            <DroppableContainer
              key={milestone.id}
              id={milestone.id}
              title={milestone.title}
              isMilestone

            >
              <SortableContext items={containers.filter(c => c.milestoneId === milestone.id).map(c => c.id)}>
                <div className="flex flex-col md:flex-row gap-4">
                  {containers
                    .filter((c) => c.milestoneId === milestone.id)
                    .map((container) => (
                      <DroppableContainer
                        key={container.id}
                        id={container.id}
                        title={container.title}

                      >
                        <SortableContext items={items.filter(item => item.containerId === container.id).map(i => i.id)}>
                          {items
                            .filter((item) => item.containerId === container.id)
                            .map((item) => (
                              <SortableItem key={item.id} id={item.id}>
                                {item.content}
                              </SortableItem>
                            ))}
                        </SortableContext>
                      </DroppableContainer>
                    ))}
                </div>
              </SortableContext>
            </DroppableContainer>
          ))}
        </div>
        <DragOverlay>
          {activeContainer ? (
            <DroppableContainer
              id={activeContainer.id}
              title={activeContainer.title}
              isOverlay
            >
              {items.filter(i => i.containerId === activeContainer.id).map(item => (
                <SortableItem key={item.id} id={item.id} isOverlay>
                  {item.content}
                </SortableItem>
              ))}
            </DroppableContainer>
          ) : activeItem ? (
            <SortableItem id={activeItem.id} isOverlay>
              {activeItem.content}
            </SortableItem>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
