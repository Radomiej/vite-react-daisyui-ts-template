import { render, screen } from '@testing-library/react';
import { KanbanBoard } from '../components/KanbanBoard';
import { describe, it, expect } from 'vitest';

describe('KanbanBoard', () => {
  it('renders the kanban board with initial columns', () => {
    render(<KanbanBoard />);
    
    // Check if the title is rendered
    expect(screen.getByText('Kanban Board')).toBeInTheDocument();
    
    // Check if all three columns are rendered
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });
  
  it('renders initial tasks in the correct columns', () => {
    render(<KanbanBoard />);
    
    // Check if tasks are rendered
    expect(screen.getByText('Research project requirements')).toBeInTheDocument();
    expect(screen.getByText('Create project structure')).toBeInTheDocument();
    expect(screen.getByText('Design UI components')).toBeInTheDocument();
    expect(screen.getByText('Implement authentication')).toBeInTheDocument();
    expect(screen.getByText('Write documentation')).toBeInTheDocument();
  });
  
  it('renders the board with the correct structure', () => {
    const { container } = render(<KanbanBoard />);
    
    // Check if the board has the correct structure
    const columns = container.querySelectorAll('.card.bg-base-200');
    expect(columns.length).toBe(3);
    
    // Check if there are tasks in the columns
    const tasks = container.querySelectorAll('.card.bg-base-100');
    expect(tasks.length).toBe(5);
  });
});
