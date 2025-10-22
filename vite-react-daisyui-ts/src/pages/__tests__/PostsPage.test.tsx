import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { PostsPage } from '../PostsPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock tylko nasz PostsList component - nie testujemy logiki fetchu
vi.mock('../features/posts', () => ({
  PostsList: () => <div data-testid="posts-list">Posts List Component</div>
}));

describe('PostsPage', () => {
  const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
    },
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={createTestQueryClient()}>
        {ui}
      </QueryClientProvider>
    );
  };

  it('renders page title correctly', () => {
    renderWithProvider(<PostsPage />);
    
    // Testujemy czy nasz tytuł się renderuje
    expect(screen.getByRole('heading', { name: /posts/i })).toBeInTheDocument();
  });

  // Nie testujemy PostsList - to zewnętrzny komponent
  // Testujemy tylko strukturę naszej strony

  it('has correct page layout structure', () => {
    renderWithProvider(<PostsPage />);
    
    // Testujemy strukturę naszej strony
    const title = screen.getByRole('heading', { name: /posts/i });
    const pageContainer = title.closest('div');
    
    expect(pageContainer).toHaveClass('container', 'mx-auto');
    
    // Testujemy czy jest kontener dla PostsList
    const listContainer = document.querySelector('.max-w-6xl.mx-auto');
    expect(listContainer).toBeInTheDocument();
  });
});
