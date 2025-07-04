import { render, screen } from '@testing-library/react';
import { DroppableContainer } from '../components/DroppableContainer';
import { describe, it, expect, vi } from 'vitest';
import * as dndCore from '@dnd-kit/core';
import * as dndSortable from '@dnd-kit/sortable';
import '@testing-library/jest-dom/vitest';

// Mock the useDroppable hook
vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual('@dnd-kit/core');
  return {
    ...actual,
    useDroppable: () => ({
      setNodeRef: vi.fn(),
    }),
  };
});

// Mock the SortableContext
vi.mock('@dnd-kit/sortable', async () => {
  const actual = await vi.importActual('@dnd-kit/sortable');
  return {
    ...actual,
    SortableContext: ({ children }: { children: React.ReactNode }) => <div data-testid="sortable-context">{children}</div>,
  };
});

// Mock the SortableItem component
vi.mock('../components/SortableItem', () => ({
  SortableItem: ({ item }: { item: { id: string; content: string; containerId: string } }) => (
    <div data-testid={`sortable-item-${item.id}`}>{item.content}</div>
  ),
}));

describe('DroppableContainer', () => {
  it('renders the container title', () => {
    const container = {
      id: 'todo',
      title: 'To Do',
    };
    
    const items = [
      { id: 'task-1', content: 'Task 1', containerId: 'todo' },
      { id: 'task-2', content: 'Task 2', containerId: 'todo' },
    ];

    render(
      <DroppableContainer
        container={container}
        items={items}
        activeId={null}
      />
    );
    expect(screen.getByText('To Do')).toBeDefined();
  });

  it('renders items within the container', () => {
    const container = {
      id: 'in-progress',
      title: 'In Progress',
    };
    
    const items = [
      { id: 'task-3', content: 'Task 3', containerId: 'in-progress' },
      { id: 'task-4', content: 'Task 4', containerId: 'in-progress' },
    ];

    render(
      <DroppableContainer
        container={container}
        items={items}
        activeId={null}
      />
    );
    expect(screen.getByTestId('sortable-item-task-3')).toBeDefined();
    expect(screen.getByTestId('sortable-item-task-4')).toBeDefined();
  });

  it('displays a placeholder when no items are present', () => {
    const container = {
      id: 'done',
      title: 'Done',
    };
    
    const items: any[] = [];

    render(
      <DroppableContainer
        container={container}
        items={items}
        activeId={null}
      />
    );
    expect(screen.getByText('Drop items here')).toBeDefined();
  });

  it('uses the useDroppable hook with the correct id', () => {
    const spy = vi.spyOn(dndCore, 'useDroppable');
    
    const container = {
      id: 'test-container',
      title: 'Test Container',
    };
    
    const items: any[] = [];

    render(
      <DroppableContainer
        container={container}
        items={items}
        activeId={null}
      />
    );
    
    expect(spy).toHaveBeenCalledWith({ id: 'test-container' });
    spy.mockRestore();
  });

  it('passes the correct items to SortableContext', () => {
    const spy = vi.spyOn(dndSortable, 'SortableContext');
    
    const container = {
      id: 'test-container-2',
      title: 'Test Container 2',
    };
    
    const items = [
      { id: 'task-5', content: 'Task 5', containerId: 'test-container-2' },
      { id: 'task-6', content: 'Task 6', containerId: 'test-container-2' },
    ];

    render(
      <DroppableContainer
        container={container}
        items={items}
        activeId={null}
      />
    );
    
    expect(spy).toHaveBeenCalled();
    const callArgs = spy.mock.calls[0][0];
    expect(callArgs.items).toEqual(['task-5', 'task-6']);
    expect(typeof callArgs.strategy).toBe('function');
    
    spy.mockRestore();
  });
});
