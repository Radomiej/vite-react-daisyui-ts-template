import { render, screen } from '@testing-library/react';
import { DroppableContainer } from '../components/DroppableContainer';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Mock the useDroppable hook
vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual('@dnd-kit/core');
  return {
    ...actual as any,
    useDroppable: vi.fn().mockReturnValue({
      setNodeRef: vi.fn(),
      isOver: false,
      active: null,
      over: null,
      rect: { current: { top: 0, left: 0, width: 100, height: 100 } }
    }),
  };
});

// Mock the SortableContext component
vi.mock('@dnd-kit/sortable', async () => {
  const actual = await vi.importActual('@dnd-kit/sortable');
  return {
    ...actual as any,
    SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    verticalListSortingStrategy: {},
  };
});

// Mock the SortableItem component
vi.mock('../components/SortableItem', () => ({
  SortableItem: ({ item, isActive }: any) => (
    <div data-testid={`sortable-item-${item.id}`} data-is-active={isActive}>
      {item.content}
    </div>
  ),
}));

describe('DroppableContainer Cross-Container Drag UX', () => {
  it('renders correctly when dragging from another container', () => {
    const container = {
      id: 'in-progress',
      title: 'In Progress',
    };
    
    const items = [
      {
        id: 'task-3',
        content: 'Design UI components',
        containerId: 'in-progress',
      },
      {
        id: 'task-4',
        content: 'Implement authentication',
        containerId: 'in-progress',
      },
    ];

    render(
      <DroppableContainer 
        container={container} 
        items={items} 
        activeId="task-1" 
      />
    );

    // Check if the container is rendered correctly
    expect(screen.getByTestId('droppable-container-in-progress')).toBeInTheDocument();
    
    // Check if all items are rendered
    expect(screen.getByTestId('sortable-item-task-3')).toBeInTheDocument();
    expect(screen.getByTestId('sortable-item-task-4')).toBeInTheDocument();
  });

  it('marks active item correctly when dragging', () => {
    const container = {
      id: 'todo',
      title: 'To Do',
    };
    
    const items = [
      {
        id: 'task-1',
        content: 'Research project requirements',
        containerId: 'todo',
      },
      {
        id: 'task-2',
        content: 'Create project structure',
        containerId: 'todo',
      },
    ];

    render(
      <DroppableContainer 
        container={container} 
        items={items} 
        activeId="task-1" 
      />
    );

    // Check if the active item is marked correctly
    const activeItem = screen.getByTestId('sortable-item-task-1');
    expect(activeItem.getAttribute('data-is-active')).toBe('true');
    
    // Check if the non-active item is not marked as active
    const nonActiveItem = screen.getByTestId('sortable-item-task-2');
    expect(nonActiveItem.getAttribute('data-is-active')).toBe('false');
  });

  it('renders empty container correctly when dragging', () => {
    const container = {
      id: 'done',
      title: 'Done',
    };
    
    const items: any[] = [];

    render(
      <DroppableContainer 
        container={container} 
        items={items} 
        activeId="task-1" 
      />
    );

    // Check if the empty container is rendered correctly
    expect(screen.getByTestId('droppable-container-done')).toBeInTheDocument();
    
    // Check if the empty message is displayed
    expect(screen.getByText('Drop items here')).toBeInTheDocument();
  });

  it('renders all items correctly when dragging within the same container', () => {
    const container = {
      id: 'todo',
      title: 'To Do',
    };
    
    const items = [
      {
        id: 'task-1',
        content: 'Research project requirements',
        containerId: 'todo',
      },
      {
        id: 'task-2',
        content: 'Create project structure',
        containerId: 'todo',
      },
    ];

    render(
      <DroppableContainer 
        container={container} 
        items={items} 
        activeId="task-1" 
      />
    );

    // Check that all items are rendered
    expect(screen.getByTestId('sortable-item-task-1')).toBeInTheDocument();
    expect(screen.getByTestId('sortable-item-task-2')).toBeInTheDocument();
    
    // Check that the container title is rendered
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('renders correctly when not dragging', () => {
    const container = {
      id: 'todo',
      title: 'To Do',
    };
    
    const items = [
      {
        id: 'task-1',
        content: 'Research project requirements',
        containerId: 'todo',
      },
      {
        id: 'task-2',
        content: 'Create project structure',
        containerId: 'todo',
      },
    ];

    render(
      <DroppableContainer 
        container={container} 
        items={items} 
        activeId={null} 
      />
    );

    // Check that all items are rendered
    expect(screen.getByTestId('sortable-item-task-1')).toBeInTheDocument();
    expect(screen.getByTestId('sortable-item-task-2')).toBeInTheDocument();
    
    // Check that no items are marked as active
    const item1 = screen.getByTestId('sortable-item-task-1');
    const item2 = screen.getByTestId('sortable-item-task-2');
    expect(item1.getAttribute('data-is-active')).toBe('false');
    expect(item2.getAttribute('data-is-active')).toBe('false');
  });
});
