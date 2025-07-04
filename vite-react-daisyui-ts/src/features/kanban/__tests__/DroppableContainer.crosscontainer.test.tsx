import { render } from '@testing-library/react';

import * as dndSortable from '@dnd-kit/sortable';
import { DroppableContainer } from '../components/DroppableContainer';
import { describe, it, expect, vi } from 'vitest';
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

// Mock the useSortable hook
vi.mock('@dnd-kit/sortable', async () => {
  const actual = await vi.importActual('@dnd-kit/sortable');
  return {
    ...actual,
    useSortable: vi.fn().mockReturnValue({
      attributes: { 'data-sortable-attr': 'true' },
      listeners: { 'data-testid': 'sortable-listeners' },
      setNodeRef: vi.fn(),
      transform: null,
      transition: null,
    }),
  };
});

describe('DroppableContainer Sortable Behavior', () => {
  it('calls useSortable with correct parameters for a regular container', () => {
    render(
      <DroppableContainer id="container-1" title="Container 1">
        <div />
      </DroppableContainer>,
    );

    expect(dndSortable.useSortable).toHaveBeenCalledWith({
      id: 'container-1',
      data: {
        type: 'Container',
      },
    });
  });

  it('calls useSortable with correct parameters for a milestone', () => {
    render(
      <DroppableContainer id="milestone-1" title="Milestone 1" isMilestone>
        <div />
      </DroppableContainer>,
    );

    expect(dndSortable.useSortable).toHaveBeenCalledWith({
      id: 'milestone-1',
      data: {
        type: 'Milestone',
      },
    });
  });

  it('applies sortable attributes to the container', () => {
    const { getByTestId } = render(
      <DroppableContainer id="container-2" title="Container 2">
        <div />
      </DroppableContainer>,
    );

    const container = getByTestId('droppable-container-container-2');
    expect(container).toHaveAttribute('data-sortable-attr', 'true');
  });
});
