import { render, screen } from '@testing-library/react';
import { KanbanBoard } from '../components/KanbanBoard';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('KanbanBoard', () => {
  it('renders the kanban board with initial columns', () => {
    render(<KanbanBoard />);
    
    // Check if the title is rendered
    expect(screen.getByText('Kanban Board')).toBeDefined();
    
    // Check if all three columns are rendered
    expect(screen.getByText('To Do')).toBeDefined();
    expect(screen.getByText('In Progress')).toBeDefined();
    expect(screen.getByText('Done')).toBeDefined();
  });
  
  it('renders initial tasks in the correct columns', () => {
    render(<KanbanBoard />);
    
    // Check if tasks are rendered
    expect(screen.getByText('Research project requirements')).toBeDefined();
    expect(screen.getByText('Create project structure')).toBeDefined();
    expect(screen.getByText('Design UI components')).toBeDefined();
    expect(screen.getByText('Implement authentication')).toBeDefined();
    expect(screen.getByText('Write documentation')).toBeDefined();
  });
  
  it('renders the board with the correct structure', () => {
    const { container } = render(<KanbanBoard />);
    
    // Check if the board has the correct structure
    const columns = container.querySelectorAll('.bg-base-200');
    expect(columns.length).toBe(3);
    
    // Check if there are tasks in the columns
    const tasks = container.querySelectorAll('.bg-base-100');
    expect(tasks.length).toBe(5);
  });
});
