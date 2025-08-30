import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
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
});
