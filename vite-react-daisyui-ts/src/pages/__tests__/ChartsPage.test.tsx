import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { ChartsPage } from '../ChartsPage';

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

describe('ChartsPage', () => {
  it('renders page title and section headers', () => {
    render(<ChartsPage />);
    
    expect(screen.getByRole('heading', { name: /recharts examples/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /about recharts/i })).toBeInTheDocument();
  });

  it('renders all chart components with their titles', () => {
    render(<ChartsPage />);
    
    const chartTitles = [
      'Line Chart Example',
      'Bar Chart Example',
      'Pie Chart Example'
    ];
    
    chartTitles.forEach(title => {
      expect(screen.getByRole('heading', { name: title, level: 2 })).toBeInTheDocument();
    });
  });

  it('has working documentation links that open in new tabs', () => {
    render(<ChartsPage />);
    
    const docLink = screen.getByRole('link', { name: /recharts documentation/i });
    const examplesLink = screen.getByRole('link', { name: /more examples/i });
    
    // Test link destinations
    expect(docLink).toHaveAttribute('href', 'https://recharts.org/en-US/');
    expect(examplesLink).toHaveAttribute('href', 'https://recharts.org/en-US/examples');
    
    // Test link attributes for security and behavior
    [docLink, examplesLink].forEach(link => {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
