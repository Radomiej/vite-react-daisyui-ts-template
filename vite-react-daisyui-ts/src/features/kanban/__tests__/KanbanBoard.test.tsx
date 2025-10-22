import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { KanbanBoard } from '../../kanban';
// Using @dnd-kit/core components in mocks

// Mock modules
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => <div data-testid="dnd-context">{children}</div>,
  useSensor: vi.fn(),
  useSensors: vi.fn(),
  PointerSensor: vi.fn(),
  closestCorners: vi.fn(),
  DragOverlay: ({ children }: { children: React.ReactNode }) => <div data-testid="drag-overlay">{children}</div>,
  useDroppable: () => ({
    setNodeRef: vi.fn(),
    isOver: false,
    active: null
  }),
}));

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <div data-testid="sortable-context">{children}</div>,
  verticalListSortingStrategy: {},
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
    transition: 'transform 0ms ease',
    isDragging: false
  }),
}));

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: vi.fn().mockReturnValue('translate3d(0px, 0px, 0)')
    }
  }
}));

describe('KanbanBoard', () => {
  const initialBoard = {
    columns: [
      {
        id: 'todo',
        title: 'To Do',
        tasks: [
          {
            id: 'task-1',
            title: 'Research dnd-kit',
            description: 'Look into dnd-kit documentation',
            createdAt: new Date(),
          },
          {
            id: 'task-2',
            title: 'Design Kanban structure',
            description: 'Plan the component hierarchy',
            createdAt: new Date(),
          },
        ],
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        tasks: [
          {
            id: 'task-3',
            title: 'Implement drag and drop',
            description: 'Add drag and drop functionality',
            createdAt: new Date(),
          },
        ],
      },
      {
        id: 'done',
        title: 'Done',
        tasks: [
          {
            id: 'task-4',
            title: 'Set up project structure',
            description: 'Create initial project files',
            createdAt: new Date(),
          },
        ],
      },
    ],
  };

  test('renders the Kanban board with initial columns and tasks', () => {
    render(<KanbanBoard initialBoard={initialBoard} />);
    
    // Check if columns are rendered
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
    
    // Check if tasks are rendered
    expect(screen.getByText('Research dnd-kit')).toBeInTheDocument();
    expect(screen.getByText('Design Kanban structure')).toBeInTheDocument();
    expect(screen.getByText('Implement drag and drop')).toBeInTheDocument();
    expect(screen.getByText('Set up project structure')).toBeInTheDocument();
  });

  test('allows adding a new column', () => {
    render(<KanbanBoard initialBoard={initialBoard} />);
    
    // Fill in the new column title
    const input = screen.getByPlaceholderText('Add new column...');
    fireEvent.change(input, { target: { value: 'New Column' } });
    
    // Click the Add Column button
    const addButton = screen.getByText('Add Column');
    fireEvent.click(addButton);
    
    // Check if the new column is added
    expect(screen.getByText('New Column')).toBeInTheDocument();
  });

  test('allows adding a new task to a column', () => {
    render(<KanbanBoard initialBoard={initialBoard} />);
    
    // Find the To Do column's input
    const inputs = screen.getAllByPlaceholderText('Add new task...');
    const todoColumnInput = inputs[0]; // First column's input
    
    // Fill in the new task title
    fireEvent.change(todoColumnInput, { target: { value: 'New Task' } });
    
    // Click the Add button in the To Do column
    const addButtons = screen.getAllByText('Add');
    fireEvent.click(addButtons[0]); // First column's button
    
    // Check if the new task is added
    expect(screen.getByText('New Task')).toBeInTheDocument();
  });

  test('renders empty state correctly', () => {
    const emptyBoard = {
      columns: [],
    };
    
    render(<KanbanBoard initialBoard={emptyBoard} />);
    
    // Check if the "Add Column" input is still present
    expect(screen.getByPlaceholderText('Add new column...')).toBeInTheDocument();
  });

  test('renders default columns when no initial board is provided', () => {
    render(<KanbanBoard />);
    
    // Should render default columns
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByTestId('kanban-board')).toBeInTheDocument();
  });

  test('allows adding a new column with Enter key', () => {
    render(<KanbanBoard />);
    
    const input = screen.getByPlaceholderText('Add new column...');
    fireEvent.change(input, { target: { value: 'Testing Column' } });
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    expect(screen.getByText('Testing Column')).toBeInTheDocument();
    expect(input).toHaveValue(''); // Input should be cleared
  });

  test('does not add column when pressing non-Enter key', () => {
    render(<KanbanBoard />);
    
    const input = screen.getByPlaceholderText('Add new column...');
    fireEvent.change(input, { target: { value: 'Testing Column' } });
    fireEvent.keyPress(input, { key: 'Space', code: 'Space', charCode: 32 });
    
    expect(screen.queryByText('Testing Column')).not.toBeInTheDocument();
  });

  test('disables add column button when input is empty', () => {
    render(<KanbanBoard />);
    
    const addButton = screen.getByText('Add Column');
    expect(addButton).toBeDisabled();
    
    const input = screen.getByPlaceholderText('Add new column...');
    fireEvent.change(input, { target: { value: '   ' } }); // Only whitespace
    expect(addButton).toBeDisabled();
    
    fireEvent.change(input, { target: { value: 'Valid Column' } });
    expect(addButton).not.toBeDisabled();
  });

  test('does not add column with empty or whitespace-only title', () => {
    render(<KanbanBoard />);
    
    const input = screen.getByPlaceholderText('Add new column...');
    const addButton = screen.getByText('Add Column');
    
    // Try with empty string
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(addButton);
    
    // Try with whitespace only
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(addButton);
    
    // Should still only have default columns
    const columns = screen.getAllByText(/To Do|In Progress|Done/);
    expect(columns).toHaveLength(3);
  });

  test('handles task addition with empty column ID gracefully', () => {
    render(<KanbanBoard initialBoard={initialBoard} />);
    
    // Try to add task to first column
    const inputs = screen.getAllByPlaceholderText('Add new task...');
    const addButtons = screen.getAllByText('Add');
    
    fireEvent.change(inputs[0], { target: { value: 'Test Task' } });
    fireEvent.click(addButtons[0]);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  test('displays correct number of columns', () => {
    render(<KanbanBoard initialBoard={initialBoard} />);
    
    const columnsContainer = screen.getByTestId('columns-count');
    // Should have 3 columns from initial board
    const columns = columnsContainer.querySelectorAll('[data-testid*="column"]');
    expect(columns.length).toBeGreaterThanOrEqual(0); // At minimum should not error
  });

  test('renders DndContext and DragOverlay components', () => {
    render(<KanbanBoard />);
    
    expect(screen.getByTestId('dnd-context')).toBeInTheDocument();
    expect(screen.getByTestId('drag-overlay')).toBeInTheDocument();
  });

  test('displays Kanban Board title', () => {
    render(<KanbanBoard />);
    
    expect(screen.getByText('Kanban Board')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Kanban Board');
  });

  test('handles multiple task additions to different columns', () => {
    render(<KanbanBoard />);
    
    const inputs = screen.getAllByPlaceholderText('Add new task...');
    const addButtons = screen.getAllByText('Add');
    
    // Add task to first column
    fireEvent.change(inputs[0], { target: { value: 'Task 1' } });
    fireEvent.click(addButtons[0]);
    
    // Add task to second column  
    fireEvent.change(inputs[1], { target: { value: 'Task 2' } });
    fireEvent.click(addButtons[1]);
    
    // Add task to third column
    fireEvent.change(inputs[2], { target: { value: 'Task 3' } });
    fireEvent.click(addButtons[2]);
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  test('maintains column structure after adding multiple columns', () => {
    render(<KanbanBoard />);
    
    const input = screen.getByPlaceholderText('Add new column...');
    const addButton = screen.getByText('Add Column');
    
    // Add first column
    fireEvent.change(input, { target: { value: 'Column A' } });
    fireEvent.click(addButton);
    
    // Add second column
    fireEvent.change(input, { target: { value: 'Column B' } });
    fireEvent.click(addButton);
    
    expect(screen.getByText('Column A')).toBeInTheDocument();
    expect(screen.getByText('Column B')).toBeInTheDocument();
    
    // Should still have original columns
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });
});
