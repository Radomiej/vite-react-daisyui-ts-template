import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { PostsPage } from '../PostsPage';

// Mock PostsList component
vi.mock('../../../features/posts', () => ({
  PostsList: () => <div data-testid="posts-list">Mocked Posts List</div>
}));

describe('PostsPage', () => {
  it('renders page title correctly', () => {
    render(<PostsPage />);
    
    expect(screen.getByRole('heading', { name: /posts/i })).toBeInTheDocument();
  });

  it('renders PostsList component', () => {
    render(<PostsPage />);
    
    expect(screen.getByTestId('posts-list')).toBeInTheDocument();
  });

  it('has correct layout structure', () => {
    render(<PostsPage />);
    
    // Sprawdzamy, czy strona ma odpowiednią strukturę
    const container = screen.getByText(/posts/i).closest('div');
    expect(container).toHaveClass('container');
    
    const listContainer = screen.getByTestId('posts-list').closest('div');
    expect(listContainer).toHaveClass('max-w-6xl');
  });
});
