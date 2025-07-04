import { render, screen } from '@testing-library/react';
import { DroppableContainer } from '../components/DroppableContainer';
import { describe, it, expect, vi } from 'vitest';
import * as dndCore from '@dnd-kit/core';

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
    useSortable: () => ({
      attributes: {},
      listeners: {},
      setNodeRef: vi.fn(),
      transform: null,
      transition: null,
    }),
  };
});

describe('DroppableContainer', () => {
  it('renders the container title', () => {
    render(
      <DroppableContainer id="todo" title="To Do">
        <div>Child</div>
      </DroppableContainer>,
    );
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('renders children within the container', () => {
    render(
      <DroppableContainer id="in-progress" title="In Progress">
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </DroppableContainer>,
    );
    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });

  it('uses the useDroppable hook with the correct id', () => {
    const spy = vi.spyOn(dndCore, 'useDroppable');

    render(
      <DroppableContainer id="test-container" title="Test Container">
        <div>Child</div>
      </DroppableContainer>,
    );

    expect(spy).toHaveBeenCalledWith({ id: 'test-container', data: { type: 'Container' } });
    spy.mockRestore();
  });

  it('applies default container styling', () => {
    const { getByTestId } = render(
      <DroppableContainer id="default" title="Default">
        <div />
      </DroppableContainer>,
    );
    const container = getByTestId('droppable-container-default');
    expect(container.className).toContain('bg-base-200');
    expect(container.className).toContain('p-4');
    expect(container.className).toContain('rounded-box');
  });

  it('applies milestone styling when isMilestone is true', () => {
    const { getByTestId } = render(
      <DroppableContainer id="milestone" title="Milestone" isMilestone>
        <div />
      </DroppableContainer>,
    );
    const container = getByTestId('droppable-container-milestone');
    expect(container.className).toContain('bg-base-300');
    expect(container.className).toContain('p-6');
  });
});
