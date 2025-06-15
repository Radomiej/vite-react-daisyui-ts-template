import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { PieChartExample } from '../PieChartExample';

// Mock ResponsiveContainer to avoid issues with width/height in tests
vi.mock('recharts', async () => {
  const OriginalModule = await vi.importActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => (
      <div data-testid="responsive-container" {...props}>
        {children}
      </div>
    ),
  };
});

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

  it('displays chart legend with group names', () => {
    render(<PieChartExample />);
    expect(screen.getByText('Group A')).toBeInTheDocument();
    expect(screen.getByText('Group B')).toBeInTheDocument();
    expect(screen.getByText('Group C')).toBeInTheDocument();
    expect(screen.getByText('Group D')).toBeInTheDocument();
  });
});
