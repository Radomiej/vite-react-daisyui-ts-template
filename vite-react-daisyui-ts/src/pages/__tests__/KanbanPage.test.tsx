import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import KanbanPage from '../KanbanPage';

// Mock KanbanBoard component
vi.mock('../features/kanban', () => ({
  KanbanBoard: ({ initialBoard }) => (
    <div data-testid="kanban-board">
      <div data-testid="columns-count">{initialBoard.columns.length}</div>
      <div data-testid="tasks-count">
        {initialBoard.columns.reduce((acc, col) => acc + col.tasks.length, 0)}
      </div>
    </div>
  )
}));

describe('KanbanPage', () => {
  it('renders KanbanBoard component', () => {
    render(<KanbanPage />);
    
    expect(screen.getByTestId('kanban-board')).toBeInTheDocument();
  });

  it('passes initial board data to KanbanBoard', () => {
    render(<KanbanPage />);
    
    // Sprawdzamy, czy przekazano odpowiednią liczbę kolumn (3: To Do, In Progress, Done)
    expect(screen.getByTestId('columns-count').textContent).toBe('3');
    
    // Sprawdzamy, czy przekazano odpowiednią liczbę zadań (4 zadania w sumie)
    expect(screen.getByTestId('tasks-count').textContent).toBe('4');
  });

  it('has correct container styling', () => {
    render(<KanbanPage />);
    
    // Sprawdzamy, czy strona ma odpowiednią strukturę i style
    const container = screen.getByTestId('kanban-board').closest('div');
    expect(container).toHaveClass('container');
    expect(container).toHaveClass('mx-auto');
    expect(container).toHaveClass('py-8');
  });
});
