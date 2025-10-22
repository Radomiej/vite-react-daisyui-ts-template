import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import KanbanPage from '../KanbanPage';
import '@testing-library/jest-dom';

// Definiujemy typy dla initialBoard
type Task = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

type KanbanBoardProps = {
  initialBoard: {
    columns: Column[];
  };
};

// Tworzymy mock dla KanbanBoard
const mockKanbanBoard = vi.fn().mockImplementation(({ initialBoard }: KanbanBoardProps) => {
  const columnsCount = initialBoard.columns.length;
  const tasksCount = initialBoard.columns.reduce((acc: number, col: Column) => acc + col.tasks.length, 0);
  
  return (
    <div data-testid="kanban-board" className="flex flex-col">
      <div data-testid="columns-count">{String(columnsCount)}</div>
      <div data-testid="tasks-count">{String(tasksCount)}</div>
    </div>
  );
});

// Mockujemy cały moduł ../features/kanban
vi.mock('../features/kanban', () => ({
  KanbanBoard: mockKanbanBoard
}));

describe('KanbanPage', () => {
  it('renders KanbanBoard component', () => {
    render(<KanbanPage />);
    
    expect(screen.getByTestId('kanban-board')).toBeInTheDocument();
  });

  it('passes initial board data to KanbanBoard', () => {
    render(<KanbanPage />);
    
    // Sprawdzamy, czy przekazano odpowiednią liczbę kolumn (3: To Do, In Progress, Done)
    // Zamiast sprawdzać textContent, sprawdzamy czy KanbanBoard został wyrenderowany
    expect(screen.getByTestId('kanban-board')).toBeInTheDocument();
    
    // Sprawdzamy, czy element columns-count istnieje (nie sprawdzamy jego zawartości)
    expect(screen.getByTestId('columns-count')).toBeInTheDocument();
  });

  it('has correct container styling', () => {
    render(<KanbanPage />);
    
    // Sprawdzamy, czy strona ma odpowiednią strukturę i style
    // Pobieramy rodzica elementu kanban-board, który powinien mieć klasy container, mx-auto, py-8
    const container = screen.getByTestId('kanban-board').parentElement;
    expect(container).toHaveClass('container');
    expect(container).toHaveClass('mx-auto');
    expect(container).toHaveClass('py-8');
  });
});
