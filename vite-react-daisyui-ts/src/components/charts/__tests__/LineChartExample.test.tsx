import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { LineChartExample } from '../LineChartExample';

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

describe('LineChartExample', () => {
  it('renders with title', () => {
    render(<LineChartExample />);
    expect(screen.getByRole('heading', { name: /line chart example/i })).toBeInTheDocument();
  });

  it('renders the chart container', () => {
    render(<LineChartExample />);
    const chart = screen.getByTestId('responsive-container');
    expect(chart).toBeInTheDocument();
  });

  it('displays chart legend', () => {
    render(<LineChartExample />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByText(/value/i)).toBeInTheDocument();
  });
});
