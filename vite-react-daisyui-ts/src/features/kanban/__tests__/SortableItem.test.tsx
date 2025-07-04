import { render, screen } from '@testing-library/react';
import { SortableItem } from '../components/SortableItem';
import { describe, it, expect, vi } from 'vitest';
import * as sortable from '@dnd-kit/sortable';
import '@testing-library/jest-dom/vitest';

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
    const id = 'test-1';
    const content = 'Test Item';

    render(<SortableItem id={id}>{content}</SortableItem>);
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it('applies the correct styling', () => {
    const id = 'test-2';
    const content = 'Another Test Item';

    const { container } = render(<SortableItem id={id}>{content}</SortableItem>);
    const itemElement = container.firstChild as HTMLElement;

    // Check if the item has the correct classes
    expect(itemElement.className).toContain('card');
    expect(itemElement.className).toContain('bg-base-100');
    expect(itemElement.className).toContain('shadow-md');
    expect(itemElement.className).toContain('cursor-grab');
  });

  it('uses the useSortable hook with the correct id', () => {
    const spy = vi.spyOn(sortable, 'useSortable');

    const id = 'test-3';
    const content = 'Spy Test Item';

    render(<SortableItem id={id}>{content}</SortableItem>);

    expect(spy).toHaveBeenCalledWith({ id: 'test-3', data: { type: 'Task' } });
    spy.mockRestore();
  });
});
