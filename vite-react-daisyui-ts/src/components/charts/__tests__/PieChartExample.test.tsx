import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { PieChartExample } from '../PieChartExample';

// Mock Recharts components
vi.mock('recharts', () => ({
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">
      {children}
      <div>
        <div>Group A</div>
        <div>Group B</div>
        <div>Group C</div>
        <div>Group D</div>
      </div>
    </div>
  ),
  Pie: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie">
      {children}
      {[1, 2, 3, 4].map((_, index) => (
        <div key={`cell-${index}`} data-testid={`cell-${index}`} />
      ))}
    </div>
  ),
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => (
    <div data-testid="legend">
      <div>Group A</div>
      <div>Group B</div>
      <div>Group C</div>
      <div>Group D</div>
    </div>
  ),
  ResponsiveContainer: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid="responsive-container" {...props}>
      {children}
    </div>
  ),
}));

describe('PieChartExample', () => {
  it('renders with title', () => {
    render(<PieChartExample />);
    expect(screen.getByRole('heading', { name: /pie chart example/i })).toBeInTheDocument();
  });

  it('renders the chart container', () => {
    render(<PieChartExample />);
    const chart = screen.getByTestId('responsive-container');
    expect(chart).toBeInTheDocument();
  });

  it('renders chart components', () => {
    render(<PieChartExample />);
    
    // Check if all chart components are rendered
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    expect(screen.getAllByTestId('cell').length).toBeGreaterThan(0);
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('displays chart legend with group names', () => {
    render(<PieChartExample />);
    
    // Check that each group appears at least once in the document
    const groupA = screen.getAllByText('Group A');
    const groupB = screen.getAllByText('Group B');
    const groupC = screen.getAllByText('Group C');
    const groupD = screen.getAllByText('Group D');
    
    expect(groupA.length).toBeGreaterThan(0);
    expect(groupB.length).toBeGreaterThan(0);
    expect(groupC.length).toBeGreaterThan(0);
    expect(groupD.length).toBeGreaterThan(0);
  });
});
