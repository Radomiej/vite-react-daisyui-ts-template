import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { BarChartExample } from '../BarChartExample';

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

describe('BarChartExample', () => {
  it('renders with title', () => {
    render(<BarChartExample />);
    expect(screen.getByRole('heading', { name: /bar chart example/i })).toBeInTheDocument();
  });

  it('renders the chart container', () => {
    render(<BarChartExample />);
    const chart = screen.getByTestId('responsive-container');
    expect(chart).toBeInTheDocument();
  });

  it('renders chart with bars', () => {
    render(<BarChartExample />);
    const chart = screen.getByTestId('responsive-container');
    expect(chart).toBeInTheDocument();
    
    // Check if chart has rendered by looking for bars
    const bars = document.querySelectorAll('.recharts-bar-rectangle');
    expect(bars.length).toBeGreaterThan(0);
  });
});
