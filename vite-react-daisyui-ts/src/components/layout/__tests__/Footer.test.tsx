import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { Footer } from '../Footer';

describe('Footer', () => {
  it('renders Footer', () => {
    render(<Footer />);
    const contentinfos = screen.getAllByRole('contentinfo');
    expect(contentinfos.length).toBeGreaterThan(0);
  });

  it('has role contentinfo', () => {
    render(<Footer />);
    const contentinfos = screen.getAllByRole('contentinfo');
    expect(contentinfos.length).toBeGreaterThan(0);
  });




});
