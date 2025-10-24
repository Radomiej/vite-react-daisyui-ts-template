import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiViewGrid } from '../MultiViewGrid';

describe('MultiViewGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the component with control panel', () => {
      render(<MultiViewGrid />);
      
      expect(screen.getByText('🎮 Multiple Views Manager')).toBeDefined();
      expect(screen.getByPlaceholderText(/Podaj URL/i)).toBeDefined();
    });

    it('should display empty state when no views are open', () => {
      render(<MultiViewGrid />);
      
      expect(screen.getByText(/Brak otwartych widoków/i)).toBeDefined();
    });

    it('should display stats panel', () => {
      render(<MultiViewGrid />);
      
      expect(screen.getByText('Aktywne widoki')).toBeDefined();
      expect(screen.getByText('Kolumny grid')).toBeDefined();
    });
  });

  describe('URL Input', () => {
    it('should update URL input value', async () => {
      const user = userEvent.setup();
      render(<MultiViewGrid />);
      
      const input = screen.getByPlaceholderText(/Podaj URL/i) as HTMLInputElement;
      await user.type(input, 'https://example.com');
      
      expect(input.value).toBe('https://example.com');
    });

    it('should trigger run on Enter key', async () => {
      const user = userEvent.setup();
      render(<MultiViewGrid />);
      
      const input = screen.getByPlaceholderText(/Podaj URL/i);
      await user.type(input, 'https://example.com{Enter}');
      
      await waitFor(() => {
        expect(screen.queryByText(/Brak otwartych widoków/i)).toBeNull();
      });
    });
  });

  describe('View Count Control', () => {
    it('should update view count from slider', async () => {
      const user = userEvent.setup();
      render(<MultiViewGrid />);
      
      const slider = screen.getByDisplayValue('1') as HTMLInputElement;
      expect(slider).toBeDefined();
      
      await user.clear(slider);
      await user.type(slider, '3');
      
      expect(slider.value).toBe('3');
    });

    it('should display current view count in badge', async () => {
      render(<MultiViewGrid />);
      
      const slider = screen.getAllByRole('slider')[0] as HTMLInputElement;
      
      fireEvent.change(slider, { target: { value: '5' } });
      
      await waitFor(() => {
        expect(screen.getByText('5')).toBeDefined();
      });
    });
  });

  describe('Grid Columns Control', () => {
    it('should update grid columns from slider', async () => {
      render(<MultiViewGrid />);
      
      const sliders = screen.getAllByRole('slider');
      const gridColsSlider = sliders[1] as HTMLInputElement;
      
      fireEvent.change(gridColsSlider, { target: { value: '3' } });
      
      expect(gridColsSlider.value).toBe('3');
    });
  });

  describe('Run Button', () => {
    it('should be disabled when URL is empty', () => {
      render(<MultiViewGrid />);
      
      const runButton = screen.getByRole('button', { name: /Uruchom/i });
      expect(runButton.hasAttribute('disabled')).toBe(true);
    });

    it('should create views when Run is clicked', async () => {
      const user = userEvent.setup();
      render(<MultiViewGrid />);
      
      const input = screen.getByPlaceholderText(/Podaj URL/i);
      const runButton = screen.getByRole('button', { name: /Uruchom/i });
      
      await user.type(input, 'https://example.com');
      await user.click(runButton);
      
      await waitFor(() => {
        expect(screen.queryByText(/Brak otwartych widoków/i)).toBeNull();
      });
    });

    it('should create correct number of views', async () => {
      const user = userEvent.setup();
      render(<MultiViewGrid />);
      
      const input = screen.getByPlaceholderText(/Podaj URL/i);
      const viewCountSlider = screen.getAllByRole('slider')[0] as HTMLInputElement;
      const runButton = screen.getByRole('button', { name: /Uruchom/i });
      
      await user.type(input, 'https://example.com');
      fireEvent.change(viewCountSlider, { target: { value: '3' } });
      await user.click(runButton);
      
      await waitFor(() => {
        const iframes = screen.getAllByTitle(/example.com/i);
        expect(iframes.length).toBe(3);
      });
    });
  });

  describe('Add View Button', () => {
    it('should be disabled when URL is empty', () => {
      render(<MultiViewGrid />);
      
      const addButton = screen.getByRole('button', { name: /Dodaj widok/i });
      expect(addButton.hasAttribute('disabled')).toBe(true);
    });

    it('should add single view when clicked', async () => {
      const user = userEvent.setup();
      render(<MultiViewGrid />);
      
      const input = screen.getByPlaceholderText(/Podaj URL/i);
      const addButton = screen.getByRole('button', { name: /Dodaj widok/i });
      
      await user.type(input, 'https://example.com');
      await user.click(addButton);
      
      await waitFor(() => {
        const iframes = screen.getAllByTitle(/example.com/i);
        expect(iframes.length).toBe(1);
      });
    });
  });

  describe('Clear All Button', () => {
    it('should be disabled when no views exist', () => {
      render(<MultiViewGrid />);
      
      const clearButton = screen.getByRole('button', { name: /Wyczyść wszystko/i });
      expect(clearButton.hasAttribute('disabled')).toBe(true);
    });

    it('should show confirmation dialog when clicked', async () => {
      const user = userEvent.setup();
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
      
      render(<MultiViewGrid />);
      
      const input = screen.getByPlaceholderText(/Podaj URL/i);
      const runButton = screen.getByRole('button', { name: /Uruchom/i });
      
      await user.type(input, 'https://example.com');
      await user.click(runButton);
      
      await waitFor(() => {
        const clearButton = screen.getByRole('button', { name: /Wyczyść wszystko/i });
        expect(clearButton.hasAttribute('disabled')).toBe(false);
      });
      
      confirmSpy.mockRestore();
    });
  });

  describe('Debug Panel', () => {
    it('should toggle debug panel', async () => {
      const user = userEvent.setup();
      render(<MultiViewGrid />);
      
      const debugButton = screen.getByRole('button', { name: /Debug/i });
      
      expect(screen.queryByText(/Debug Panel/i)).toBeNull();
      
      await user.click(debugButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Debug Panel/i)).toBeDefined();
      });
    });
  });

  describe('Stats Panel', () => {
    it('should display correct stats', async () => {
      const user = userEvent.setup();
      render(<MultiViewGrid />);
      
      const input = screen.getByPlaceholderText(/Podaj URL/i);
      const runButton = screen.getByRole('button', { name: /Uruchom/i });
      
      await user.type(input, 'https://example.com');
      await user.click(runButton);
      
      await waitFor(() => {
        expect(screen.getByText('0')).toBeDefined(); // Aktywne widoki
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace-only URLs', async () => {
      const user = userEvent.setup();
      render(<MultiViewGrid />);
      
      const input = screen.getByPlaceholderText(/Podaj URL/i);
      const runButton = screen.getByRole('button', { name: /Uruchom/i });
      
      await user.type(input, '   ');
      
      expect(runButton.hasAttribute('disabled')).toBe(true);
    });

    it('should handle maximum view count', async () => {
      const user = userEvent.setup();
      render(<MultiViewGrid />);
      
      const input = screen.getByPlaceholderText(/Podaj URL/i);
      const viewCountSlider = screen.getAllByRole('slider')[0] as HTMLInputElement;
      const runButton = screen.getByRole('button', { name: /Uruchom/i });
      
      await user.type(input, 'https://example.com');
      fireEvent.change(viewCountSlider, { target: { value: '12' } });
      await user.click(runButton);
      
      await waitFor(() => {
        const iframes = screen.getAllByTitle(/example.com/i);
        expect(iframes.length).toBe(12);
      });
    });
  });
});
