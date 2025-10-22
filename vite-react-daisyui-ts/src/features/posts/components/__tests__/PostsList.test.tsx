import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PostsList from '../PostsList';
import * as usePostsHook from '../../hooks/usePosts';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockPosts = [
  {
    id: 1,
    title: 'Test Post 1',
    body: 'This is the body of test post 1. It contains some text to test rendering.',
    userId: 1,
  },
  {
    id: 2,
    title: 'Test Post 2',
    body: 'This is the body of test post 2. Another post for testing purposes.',
    userId: 2,
  },
  {
    id: 3,
    title: 'Test Post 3',
    body: 'This is the body of test post 3. Yet another test post.',
    userId: 1,
  },
];

describe('PostsList', () => {
  it('shows loading spinner when posts are loading', () => {
    vi.spyOn(usePostsHook, 'usePosts').mockReturnValue({
      posts: [],
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    render(<PostsList />, { wrapper: createWrapper() });
    
    expect(document.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('shows error message when there is an error', () => {
    vi.spyOn(usePostsHook, 'usePosts').mockReturnValue({
      posts: [],
      isLoading: false,
      error: new Error('Failed to fetch'),
      refetch: vi.fn(),
    });

    render(<PostsList />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/error while loading posts/i)).toBeInTheDocument();
    expect(document.querySelector('.alert-error')).toBeInTheDocument();
  });

  it('renders posts when data is loaded successfully', () => {
    vi.spyOn(usePostsHook, 'usePosts').mockReturnValue({
      posts: mockPosts,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<PostsList />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/latest posts/i)).toBeInTheDocument();
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    expect(screen.getByText('Test Post 3')).toBeInTheDocument();
  });

  it('displays post details correctly', () => {
    vi.spyOn(usePostsHook, 'usePosts').mockReturnValue({
      posts: mockPosts,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<PostsList />, { wrapper: createWrapper() });

    // Check titles
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 2')).toBeInTheDocument();
    
    // Check bodies
    expect(screen.getByText(/this is the body of test post 1/i)).toBeInTheDocument();

    // Check badges - use getAllByText for multiple instances
    expect(screen.getAllByText(/User 1/)).toHaveLength(2);
  });

  it('limits posts to maximum 6 items', () => {
    const manyPosts = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Test Post ${i + 1}`,
      body: `Body for post ${i + 1}`,
      userId: i + 1,
    }));

    vi.spyOn(usePostsHook, 'usePosts').mockReturnValue({
      posts: manyPosts,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<PostsList />, { wrapper: createWrapper() });
    
    // Should only show first 6 posts
    expect(screen.getByText('Test Post 1')).toBeInTheDocument();
    expect(screen.getByText('Test Post 6')).toBeInTheDocument();
    expect(screen.queryByText('Test Post 7')).not.toBeInTheDocument();
    expect(screen.queryByText('Test Post 10')).not.toBeInTheDocument();
  });

  it('handles empty posts array', () => {
    vi.spyOn(usePostsHook, 'usePosts').mockReturnValue({
      posts: [],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<PostsList />, { wrapper: createWrapper() });
    
    expect(screen.getByText(/latest posts/i)).toBeInTheDocument();
    expect(screen.queryByText('Test Post 1')).not.toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    vi.spyOn(usePostsHook, 'usePosts').mockReturnValue({
      posts: mockPosts,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    render(<PostsList />, { wrapper: createWrapper() });
    
    const grid = screen.getByText('Test Post 1').closest('.grid');
    expect(grid).toHaveClass('gap-6', 'md:grid-cols-2', 'lg:grid-cols-3');
  });
});
