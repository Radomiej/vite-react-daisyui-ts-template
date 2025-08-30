import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import FlowPage from '../FlowPage';

// Mock reactflow
vi.mock('reactflow', () => ({
  addEdge: vi.fn((connection: any, edges: any[]) => [...edges, { id: 'new-edge', source: connection.source, target: connection.target }]),
  applyNodeChanges: vi.fn((changes: any[], nodes: any[]) => nodes),
  applyEdgeChanges: vi.fn((changes: any[], edges: any[]) => edges),
}));

// Mock ReactFlowExample component
vi.mock('../components/flows/ReactFlowExample', () => ({
  ReactFlowExample: ({ nodes, edges, onNodesChange, onEdgesChange, onConnect }: {
    nodes: any[];
    edges: any[];
    onNodesChange: (changes: any[]) => void;
    onEdgesChange: (changes: any[]) => void;
    onConnect: (connection: { source: string; target: string }) => void;
  }) => (
    <div data-testid="react-flow-example">
      <div data-testid="nodes-count">{nodes.length}</div>
      <div data-testid="edges-count">{edges.length}</div>
      <button 
        data-testid="trigger-nodes-change" 
        onClick={() => onNodesChange([{ type: 'add', item: { id: 'test-node' } }])}
      >
        Change Nodes
      </button>
      <button 
        data-testid="trigger-edges-change" 
        onClick={() => onEdgesChange([{ type: 'add', item: { id: 'test-edge' } }])}
      >
        Change Edges
      </button>
      <button 
        data-testid="trigger-connect" 
        onClick={() => onConnect({ source: 'node-1', target: 'node-2' })}
      >
        Connect Nodes
      </button>
    </div>
  ),
}));

// Mock data and utils
vi.mock('../data/graphData', () => ({
  initialNodes: [{ id: 'node-1' }, { id: 'node-2' }],
  initialEdges: [{ id: 'edge-1', source: 'node-1', target: 'node-2' }],
  cyclicEdges: [
    { id: 'edge-1', source: 'node-1', target: 'node-2' },
    { id: 'edge-2', source: 'node-2', target: 'node-1' }
  ],
}));

vi.mock('../utils/layout', () => ({
  getLayoutedElements: vi.fn().mockImplementation((nodes: any[], edges: any[], layout: string) => 
    Promise.resolve({ 
      nodes: [...nodes], 
      edges: [...edges] 
    })
  ),
}));

describe('FlowPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ReactFlowExample component', async () => {
    render(<FlowPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('react-flow-example')).toBeInTheDocument();
    });
  });

  it('renders layout selection dropdown with options', async () => {
    render(<FlowPage />);
    
    const selectElement = screen.getByRole('combobox');
    expect(selectElement).toBeInTheDocument();
    
    // Sprawdzamy, czy są wszystkie opcje layoutu
    expect(screen.getByRole('option', { name: 'Dagre' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'D3-Hierarchy' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'ELK' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'D3-Force' })).toBeInTheDocument();
  });

  it('changes layout when dropdown value changes', async () => {
    const { getLayoutedElements } = await import('../utils/layout');
    render(<FlowPage />);
    
    // Zmieniamy layout na ELK
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'elk' } });
    
    // Sprawdzamy, czy getLayoutedElements został wywołany z nowym layoutem
    await waitFor(() => {
      expect(getLayoutedElements).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        'elk'
      );
    });
  });

  it('handles node changes correctly', async () => {
    const { applyNodeChanges } = await import('reactflow');
    render(<FlowPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('trigger-nodes-change')).toBeInTheDocument();
    });
    
    // Wywołujemy zmianę węzłów
    fireEvent.click(screen.getByTestId('trigger-nodes-change'));
    
    // Sprawdzamy, czy applyNodeChanges został wywołany
    expect(applyNodeChanges).toHaveBeenCalled();
  });

  it('handles edge changes correctly', async () => {
    const { applyEdgeChanges } = await import('reactflow');
    render(<FlowPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('trigger-edges-change')).toBeInTheDocument();
    });
    
    // Wywołujemy zmianę krawędzi
    fireEvent.click(screen.getByTestId('trigger-edges-change'));
    
    // Sprawdzamy, czy applyEdgeChanges został wywołany
    expect(applyEdgeChanges).toHaveBeenCalled();
  });

  it('handles connections correctly', async () => {
    const { addEdge } = await import('reactflow');
    render(<FlowPage />);
    
    await waitFor(() => {
      expect(screen.getByTestId('trigger-connect')).toBeInTheDocument();
    });
    
    // Wywołujemy połączenie węzłów
    fireEvent.click(screen.getByTestId('trigger-connect'));
    
    // Sprawdzamy, czy addEdge został wywołany
    expect(addEdge).toHaveBeenCalled();
  });
});
