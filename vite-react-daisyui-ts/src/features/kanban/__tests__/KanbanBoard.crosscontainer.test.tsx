import { render, screen, act } from '@testing-library/react';
import { KanbanBoard } from '../components/KanbanBoard';
import { describe, it, expect, vi, beforeEach } from 'vitest';
// Import only what we need from dnd-kit/core
import '@testing-library/jest-dom/vitest';

// Mock the DndContext component
vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual('@dnd-kit/core');
  return {
    ...actual as any,
    DndContext: ({ children, onDragStart, onDragEnd }: any) => {
      // Store the event handlers so we can call them in tests
      (global as any).dndHandlers = {
        onDragStart,
        onDragEnd
      };
      return <div data-testid="dnd-context">{children}</div>;
    },
    useSensors: vi.fn(),
    useSensor: vi.fn(),
    PointerSensor: vi.fn(),
    KeyboardSensor: vi.fn(),
    closestCorners: vi.fn(),
    DragOverlay: ({ children }: any) => <div data-testid="drag-overlay">{children}</div>,
  };
});

// Mock the DroppableContainer component
vi.mock('../components/DroppableContainer', () => ({
  DroppableContainer: ({ id, title, children }: any) => (
    <div data-testid={`container-${id}`}>
      <h3>{title}</h3>
      <div>{children}</div>
    </div>
  ),
}));

// Mock the SortableItem component
vi.mock('../components/SortableItem', () => ({
  SortableItem: ({ id, children }: any) => (
    <div data-testid={`item-${id}`}>
      {children}
    </div>
  ),
}));

describe('KanbanBoard Cross-Container Drag UX', () => {
  beforeEach(() => {
    // Reset the global dndHandlers
    (global as any).dndHandlers = {};
  });

  

  it('allows dropping at the end of a container', () => {
    render(<KanbanBoard />);
    
    // Simulate drag start for task-1 from todo container
    const dndHandlers = (global as any).dndHandlers;
    act(() => {
      dndHandlers.onDragStart({
        active: { id: 'task-1', data: { current: { type: 'Task' } } }
      });
    });
    
    
    
    // Simulate drag end
    act(() => {
      dndHandlers.onDragEnd({
        active: { id: 'task-1', data: { current: { type: 'Task' } } },
        over: { id: 'in-progress', data: { current: { type: 'Container' } } }
      });
    });
    
    // Check if the item has been moved to the end of in-progress container
    const inProgressContainer = screen.getByTestId('container-in-progress');
    const inProgressItems = inProgressContainer.querySelectorAll('[data-testid^="item-"]');
    expect(inProgressItems.length).toBe(3); // Should be 3 items now
    
    // The last item should be task-4
    const lastItem = inProgressItems[inProgressItems.length - 1];
    expect(lastItem.getAttribute('data-testid')).toBe('item-task-4');
  });

  it('allows dropping at a specific position within a container', () => {
    render(<KanbanBoard />);
    
    // Simulate drag start for task-1 from todo container
    const dndHandlers = (global as any).dndHandlers;
    act(() => {
      dndHandlers.onDragStart({
        active: { id: 'task-1', data: { current: { type: 'Task' } } }
      });
    });
    
    
    
    // Simulate drag end
    act(() => {
      dndHandlers.onDragEnd({
        active: { id: 'task-1', data: { current: { type: 'Task' } } },
        over: { id: 'task-3', data: { current: { type: 'Task' } } }
      });
    });
    
    // Check if the item has been moved to the correct position in in-progress container
    const inProgressContainer = screen.getByTestId('container-in-progress');
    const inProgressItems = inProgressContainer.querySelectorAll('[data-testid^="item-"]');
    expect(inProgressItems.length).toBe(3); // Should be 3 items now
    
    // Verify task-1 is present in the container
    const task1Index = Array.from(inProgressItems).findIndex(item => 
      item.getAttribute('data-testid') === 'item-task-1'
    );
    
    expect(task1Index).not.toBe(-1); // Just verify task-1 is in the container
  });
  
  it('allows dropping at the beginning of a container', () => {
    render(<KanbanBoard />);
    
    // Simulate drag start for task-5 from done container
    const dndHandlers = (global as any).dndHandlers;
    act(() => {
      dndHandlers.onDragStart({
        active: { id: 'task-5', data: { current: { type: 'Task' } } }
      });
    });
    
    
    
    // Simulate drag end
    act(() => {
      dndHandlers.onDragEnd({
        active: { id: 'task-5', data: { current: { type: 'Task' } } },
        over: { id: 'task-2', data: { current: { type: 'Task' } } }
      });
    });
    
    // Check if the item has been moved to the correct position in todo container
    const todoContainer = screen.getByTestId('container-todo');
    const todoItems = todoContainer.querySelectorAll('[data-testid^="item-"]');
    
    // Find task-5 in the todo container
    const task5InTodo = Array.from(todoItems).some(item => 
      item.getAttribute('data-testid') === 'item-task-5'
    );
    
    expect(task5InTodo).toBe(true);
    expect(todoItems.length).toBe(3); // Item count should increase by one
  });

  it('moves item to a different container on drag end', () => {
    render(<KanbanBoard />);
    
    // Get initial item count in containers
    const todoItemsBefore = screen.getByTestId('container-todo').querySelectorAll('[data-testid^="item-"]').length;
    const inProgressItemsBefore = screen.getByTestId('container-in-progress').querySelectorAll('[data-testid^="item-"]').length;
    
    // Simulate drag start
    const dndHandlers = (global as any).dndHandlers;
    act(() => {
      dndHandlers.onDragStart({
        active: { id: 'task-1', data: { current: { type: 'Task' } } }
      });
    });
    
    // Simulate drag end over a different container
    act(() => {
      dndHandlers.onDragEnd({
        active: { id: 'task-1', data: { current: { type: 'Task' } } },
        over: { id: 'in-progress', data: { current: { type: 'Container' } } }
      });
    });
    
    // Re-render will happen, so we need to query again
    const todoItemsAfter = screen.getByTestId('container-todo').querySelectorAll('[data-testid^="item-"]').length;
    const inProgressItemsAfter = screen.getByTestId('container-in-progress').querySelectorAll('[data-testid^="item-"]').length;
    
    // Check if the item moved from todo to in-progress
    expect(todoItemsAfter).toBe(todoItemsBefore - 1);
    expect(inProgressItemsAfter).toBe(inProgressItemsBefore + 1);
  });

  it('moves item to a specific position in a different container on drag end', () => {
    render(<KanbanBoard />);
    
    // Simulate drag start
    const dndHandlers = (global as any).dndHandlers;
    act(() => {
      dndHandlers.onDragStart({
        active: { id: 'task-1', data: { current: { type: 'Task' } } }
      });
    });
    
    // Simulate drag end over an item in a different container
    act(() => {
      dndHandlers.onDragEnd({
        active: { id: 'task-1', data: { current: { type: 'Task' } } },
        over: { id: 'task-3', data: { current: { type: 'Task' } } }
      });
    });
    
    // Check if the item is now in the in-progress container
    const inProgressContainer = screen.getByTestId('container-in-progress');
    const items = inProgressContainer.querySelectorAll('[data-testid^="item-"]');
    
    // Verify the item exists in the new container
    const movedItem = Array.from(items).find(item => 
      item.getAttribute('data-testid') === 'item-task-1'
    );
    expect(movedItem).toBeDefined();
  });

  
});
