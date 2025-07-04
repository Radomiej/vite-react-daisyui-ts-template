import { render, screen } from '@testing-library/react';
import { SortableItem } from '../components/SortableItem';
import { describe, it, expect, vi } from 'vitest';
import * as sortable from '@dnd-kit/sortable';

// Mock the useSortable hook
vi.mock('@dnd-kit/sortable', async () => {
  const actual = await vi.importActual('@dnd-kit/sortable');
  return {
    ...actual,
    useSortable: () => ({
      attributes: { 'data-test': 'sortable-item' },
      listeners: { 'data-test': 'sortable-listeners' },
      setNodeRef: vi.fn(),
      transform: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
      transition: 'transform 250ms ease',
    }),
  };
});

describe('SortableItem', () => {
  it('renders the item content', () => {
    const item = {
      id: 'test-1',
      content: 'Test Item',
      containerId: 'todo',
    };

    render(<SortableItem item={item} />);
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('applies the correct styling', () => {
    const item = {
      id: 'test-2',
      content: 'Another Test Item',
      containerId: 'in-progress',
    };

    const { container } = render(<SortableItem item={item} />);
    const itemElement = container.firstChild;
    
    // Check if the item has the correct classes
    expect(itemElement).toHaveClass('card');
    expect(itemElement).toHaveClass('bg-base-100');
    expect(itemElement).toHaveClass('shadow-md');
    expect(itemElement).toHaveClass('cursor-move');
  });

  it('uses the useSortable hook with the correct id', () => {
    const spy = vi.spyOn(sortable, 'useSortable');
    
    const item = {
      id: 'test-3',
      content: 'Spy Test Item',
      containerId: 'done',
    };

    render(<SortableItem item={item} />);
    
    expect(spy).toHaveBeenCalledWith({ id: 'test-3' });
    spy.mockRestore();
  });
});
