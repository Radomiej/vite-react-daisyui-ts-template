import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('applies variant and size classes', () => {
    render(<Button variant="secondary" size="lg">Test</Button>);
    const btn = screen.getAllByRole('button').find(b => b.textContent === 'Test');
    expect(btn).toBeDefined();
    expect(btn!.className).toMatch(/btn-secondary/);
    expect(btn!.className).toMatch(/btn-lg/);
  });

  it('shows loading spinner and disables button', () => {
    render(<Button loading>Load</Button>);
    const btn = screen.getAllByRole('button').find(b => b.textContent === 'Load');
    expect(btn).toBeDefined();
    expect(btn).toBeDisabled();
    expect(btn!.querySelector('svg')).toBeInTheDocument();
  });

  it('renders left and right icons', () => {
    render(<Button leftIcon={<span data-testid="left">L</span>} rightIcon={<span data-testid="right">R</span>}>IconBtn</Button>);
    expect(screen.getByTestId('left')).toBeInTheDocument();
    expect(screen.getByTestId('right')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    const btn = screen.getAllByRole('button').find(b => b.textContent === 'Click');
    expect(btn).toBeDefined();
    await user.click(btn!);
    expect(onClick).toHaveBeenCalled();
  });

  it('renders as fullWidth', () => {
    render(<Button fullWidth>Full</Button>);
    const btn = screen.getAllByRole('button').find(b => b.textContent === 'Full');
    expect(btn).toBeDefined();
    expect(btn!.className).toMatch(/w-full/);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const btn = screen.getAllByRole('button').find(b => b.textContent === 'Disabled');
    expect(btn).toBeDefined();
    expect(btn).toBeDisabled();
  });

  it('edge case: renders with no children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getAllByRole('button').find(b => b.textContent === 'Click me')).toBeInTheDocument();
  });

  it('failure: does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button disabled onClick={onClick}>NoClick</Button>);
    const btn = screen.getAllByRole('button').find(b => b.textContent === 'NoClick');
    expect(btn).toBeDefined();
    await user.click(btn!);
    expect(onClick).not.toHaveBeenCalled();
  });
});
