import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import FlowPage from '../FlowPage';

// Mock tylko nasz component - nie testujemy ReactFlow internals  
vi.mock('../components/flows/ReactFlowExample', () => ({
  ReactFlowExample: () => <div data-testid="react-flow-example">Mocked ReactFlow Component</div>
}));

// Mock layout utils - testujemy tylko czy funkcja zostanie wywołana
vi.mock('../utils/layout', () => ({
  getLayoutedElements: vi.fn(() => Promise.resolve({
    nodes: [],
    edges: []
  }))
}));

describe('FlowPage', () => {
  it('renders layout selection dropdown with correct options', () => {
    render(<FlowPage />);
    
    // Testujemy czy nasze dropdown się renderuje z prawidłowymi opcjami
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    
    // Sprawdzamy wszystkie opcje layoutów
    expect(screen.getByRole('option', { name: 'Dagre' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'D3-Hierarchy' })).toBeInTheDocument(); 
    expect(screen.getByRole('option', { name: 'ELK' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'D3-Force' })).toBeInTheDocument();
  });

  // Nie testujemy ReactFlowExample - to biblioteka zewnętrzna
  // Testujemy tylko naszą logikę UI

  it('changes dropdown value when option is selected', () => {
    render(<FlowPage />);
    
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    
    // Domyślnie powinno być 'dagre'
    expect(select.value).toBe('dagre');
    
    // Testujemy zmianę wartości - nasza logika UI
    fireEvent.change(select, { target: { value: 'elk' } });
    expect(select.value).toBe('elk');
  });

  it('has correct page layout structure', () => {
    render(<FlowPage />);
    
    // Testujemy strukturę naszej strony
    const container = document.querySelector('.flex.flex-col.h-full');
    expect(container).toBeInTheDocument();
    
    const headerSection = document.querySelector('.p-4.bg-base-200');
    expect(headerSection).toBeInTheDocument();
    
    const contentSection = document.querySelector('.flex-grow');
    expect(contentSection).toBeInTheDocument();
  });

  it('renders label with correct association', () => {
    render(<FlowPage />);
    
    // Testujemy czy label jest poprawnie powiązany z selectem
    const label = screen.getByText('Select Layout');
    expect(label).toBeInTheDocument();
    
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('id', 'layout-select');
  });
});
