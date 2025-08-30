import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReactFlowExample from '../ReactFlowExample';
import type { Node, Edge } from 'reactflow';

// Mock ReactFlow
vi.mock('reactflow', () => ({
  __esModule: true,
  default: ({ nodes, edges }: { nodes: Node[], edges: Edge[] }) => (
    <div data-testid="react-flow-mock">
      <div className="nodes">
        {nodes.map((node) => (
          <div key={node.id} data-testid={`node-${node.id}`}>
            {node.data.label}
          </div>
        ))}
      </div>
      <div className="edges">
        {edges.map((edge) => (
          <div key={edge.id} data-testid={`edge-${edge.id}`}>
            {edge.label}
          </div>
        ))}
      </div>
    </div>
  ),
}));

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

const initialNodes: Node[] = [
  { id: '1', data: { label: 'Node 1' }, position: { x: 5, y: 5 }, type: 'input' },
  { id: '2', data: { label: 'Node 2' }, position: { x: 5, y: 100 } },
  { id: '3', data: { label: 'Node 3' }, position: { x: 200, y: 100 }, type: 'output' },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', label: 'an edge' },
  { id: 'e2-3', source: '2', target: '3', animated: true },
];

const defaultProps = {
  nodes: initialNodes,
  edges: initialEdges,
  onNodesChange: () => {},
  onEdgesChange: () => {},
  onConnect: () => {},
};

describe('ReactFlowExample', () => {
  test('renders the React Flow component wrapper', () => {
    render(<ReactFlowExample {...defaultProps} />);
    const wrapperElement = screen.getByTestId('rf-example-wrapper');
    expect(wrapperElement).toBeInTheDocument();
    expect(wrapperElement).toHaveStyle('height: 500px');
  });

  test('renders initial nodes', () => {
    render(<ReactFlowExample {...defaultProps} />);
    expect(screen.getByText('Node 1')).toBeInTheDocument();
    expect(screen.getByText('Node 2')).toBeInTheDocument();
    expect(screen.getByText('Node 3')).toBeInTheDocument();
  });

  test('renders initial edges', () => {
    render(<ReactFlowExample {...defaultProps} />);
    expect(screen.getByTestId('edge-e1-2')).toBeInTheDocument();
  });
});
