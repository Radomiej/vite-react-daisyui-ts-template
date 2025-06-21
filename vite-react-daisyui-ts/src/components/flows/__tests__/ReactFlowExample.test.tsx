import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReactFlowExample from '../ReactFlowExample';

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserver;

describe('ReactFlowExample', () => {
  test('renders the React Flow component wrapper', () => {
    render(<ReactFlowExample />);
    const wrapperElement = screen.getByTestId('rf-example-wrapper');
    expect(wrapperElement).toBeInTheDocument();
    expect(wrapperElement).toHaveStyle('height: 500px');
  });

  test('renders initial nodes', () => {
    render(<ReactFlowExample />);
    // React Flow renders nodes with specific class names and text content
    // Check for the presence of text from initialNodes
    expect(screen.getByText('Node 1')).toBeInTheDocument();
    expect(screen.getByText('Node 2')).toBeInTheDocument();
    expect(screen.getByText('Node 3')).toBeInTheDocument();
  });

  test('renders initial edges', () => {
    render(<ReactFlowExample />);
    // Edges are typically SVG elements. We can check for the label of an edge.
    expect(screen.getByText('an edge')).toBeInTheDocument();
  });
});
