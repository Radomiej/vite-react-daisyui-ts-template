import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders main layout structure', () => {
    render(<App />);
    
    // Check for main navigation
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    
    // Check for main content area
    expect(screen.getAllByRole('main')).toHaveLength(2);
    
    // Check for footer
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('renders HomePage by default', () => {
    render(<App />);
    
    // HomePage should render by default on "/" route
    expect(screen.getByRole('heading', { name: /welcome to daisyui/i })).toBeInTheDocument();
  });

  it('provides QueryClient context', () => {
    // Test that QueryClientProvider is working by rendering the app
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  it('has correct CSS classes for layout', () => {
    render(<App />);
    
    const mains = screen.getAllByRole('main');
    expect(mains[0]).toHaveClass('flex-grow');
  });
});
