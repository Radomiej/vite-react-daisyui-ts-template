import { render, screen, cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
afterEach(cleanup);
import '@testing-library/jest-dom/vitest';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../Input';

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="Type here" />);
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('accepts value and onChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input value="abc" onChange={handleChange} />);
    const inp = screen.getByRole('textbox');
    expect(inp).toHaveValue('abc');
    await user.type(inp, 'd');
    expect(handleChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('edge: renders with no props', () => {
    render(<Input />);
    // Sprawdzamy, że jest dokładnie jeden textbox
    expect(screen.getAllByRole('textbox')).toHaveLength(1);
  });

  it('failure: does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input disabled onChange={handleChange} />);
    const inp = screen.getByRole('textbox');
    await user.type(inp, 'x');
    expect(handleChange).not.toHaveBeenCalled();
  });
});
