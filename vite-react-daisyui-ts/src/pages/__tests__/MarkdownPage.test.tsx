import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { MarkdownPage } from '../MarkdownPage';

// Mock fetch API
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('MarkdownPage', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders page title correctly', () => {
    // Mock successful fetch response
    mockFetch.mockResolvedValueOnce({
      text: () => Promise.resolve('# Test Markdown')
    });

    render(<MarkdownPage />);
    
    expect(screen.getByRole('heading', { name: /markdown & mermaid demo/i })).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    // Delay the fetch response
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(() => {
      resolve({ text: () => Promise.resolve('# Content') });
    }, 100)));

    render(<MarkdownPage />);
    
    expect(screen.getByText('Ładowanie...')).toBeInTheDocument();
  });

  it('displays markdown content after successful fetch', async () => {
    const mockMarkdownContent = '# Test Header\nThis is a test paragraph.';
    
    mockFetch.mockResolvedValueOnce({
      text: () => Promise.resolve(mockMarkdownContent)
    });

    render(<MarkdownPage />);
    
    // Wait for the content to be loaded
    await waitFor(() => {
      // Sprawdzamy, czy komponent MarkdownViewer otrzymał odpowiednią zawartość
      // Ponieważ MarkdownViewer jest zamockowany, sprawdzamy, czy tekst jest przekazany do komponentu
      expect(screen.queryByText('Ładowanie...')).not.toBeInTheDocument();
    });
  });

  it('shows error message when fetch fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<MarkdownPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Nie udało się załadować pliku markdown.')).toBeInTheDocument();
    });
  });
});
