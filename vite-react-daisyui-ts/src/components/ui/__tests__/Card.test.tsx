import { render, screen, cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
afterEach(cleanup);
import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { Card } from '../Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Card className="custom">X</Card>);
    const card = screen.getByTestId('card');
    expect(card.className).toMatch(/custom/);
    // Upewniamy się, że jest tylko jeden Card
    expect(screen.getAllByTestId('card')).toHaveLength(1);
  });

  it('edge: renders with empty children', () => {
    render(<Card>{''}</Card>);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('failure: does not render content if falsy', () => {
    render(<Card>{null as any}</Card>);
    expect(screen.getByTestId('card').textContent).toBe('');
  });
});
