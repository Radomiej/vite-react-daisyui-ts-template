import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Terminal } from '../Terminal';

// Mock Tauri API
vi.mock('@tauri-apps/api/core', () => ({
  invoke: vi.fn(),
}));

describe('Terminal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders terminal component with title', () => {
    render(<Terminal />);
    
    const title = screen.getByText(/Desktop Terminal/i);
    expect(title).toBeDefined();
  });

  it('renders shell type selector with CMD and PowerShell options', () => {
    render(<Terminal />);
    
    const cmdRadio = screen.getByLabelText(/CMD/i);
    const powershellRadio = screen.getByLabelText(/PowerShell/i);
    
    expect(cmdRadio).toBeDefined();
    expect(powershellRadio).toBeDefined();
  });

  it('renders command input field', () => {
    render(<Terminal />);
    
    const input = screen.getByPlaceholderText(/e.g., dir/i);
    expect(input).toBeDefined();
  });

  it('renders execute button', () => {
    render(<Terminal />);
    
    const button = screen.getByRole('button', { name: /Execute/i });
    expect(button).toBeDefined();
  });

  it('disables execute button when command is empty', () => {
    render(<Terminal />);
    
    const button = screen.getByRole('button', { name: /Execute/i });
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  it('enables execute button when command is entered', () => {
    render(<Terminal />);
    
    const input = screen.getByPlaceholderText(/e.g., dir/i);
    const button = screen.getByRole('button', { name: /Execute/i });
    
    fireEvent.change(input, { target: { value: 'dir' } });
    
    expect(button.hasAttribute('disabled')).toBe(false);
  });

  it('changes placeholder when switching to PowerShell', () => {
    render(<Terminal />);
    
    const powershellRadio = screen.getByLabelText(/PowerShell/i);
    fireEvent.click(powershellRadio);
    
    const input = screen.getByPlaceholderText(/Get-Process/i);
    expect(input).toBeDefined();
  });

  it('renders system info button', () => {
    render(<Terminal />);
    
    const button = screen.getByRole('button', { name: /System Info/i });
    expect(button).toBeDefined();
  });

  it('renders clear history button', () => {
    render(<Terminal />);
    
    const button = screen.getByRole('button', { name: /Clear History/i });
    expect(button).toBeDefined();
  });

  it('renders output textarea', () => {
    render(<Terminal />);
    
    const textarea = screen.getByPlaceholderText(/Command output will appear here/i);
    expect(textarea).toBeDefined();
  });

  it('renders security warning', () => {
    render(<Terminal />);
    
    const warning = screen.getByText(/Security Warning/i);
    expect(warning).toBeDefined();
  });

  it('updates command input value on change', () => {
    render(<Terminal />);
    
    const input = screen.getByPlaceholderText(/e.g., dir/i) as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'echo test' } });
    
    expect(input.value).toBe('echo test');
  });
});
