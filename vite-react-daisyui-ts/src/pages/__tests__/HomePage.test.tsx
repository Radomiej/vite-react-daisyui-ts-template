import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { HomePage } from '../HomePage';
import { MemoryRouter } from 'react-router-dom';

describe('HomePage', () => {
  it('renders page title and description', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    
    expect(screen.getByRole('heading', { name: /welcome to daisyui/i })).toBeInTheDocument();
    expect(screen.getByText(/a clean, customizable, and accessible component library/i)).toBeInTheDocument();
  });

  it('renders navigation buttons with correct links', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    
    const demoButton = screen.getByRole('link', { name: /view demo/i });
    const postsButton = screen.getByRole('link', { name: /view posts/i });
    
    expect(demoButton).toHaveAttribute('href', '/demo');
    expect(postsButton).toHaveAttribute('href', '/posts');
  });

  it('has correct button variants', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    
    const demoButton = screen.getByRole('button', { name: /view demo/i });
    const postsButton = screen.getByRole('button', { name: /view posts/i });
    
    // Sprawdzamy klasy CSS, które odpowiadają za warianty przycisków
    expect(demoButton.className).toContain('btn-primary');
    expect(postsButton.className).toContain('btn-outline');
  });
});
