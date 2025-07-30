import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { DemoPage } from '../DemoPage';

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Info: () => <div data-testid="info-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
}));

describe('DemoPage', () => {
  it('renders page title correctly', () => {
    render(<DemoPage />);
    
    expect(screen.getByRole('heading', { name: /demo page/i, level: 1 })).toBeInTheDocument();
  });

  it('renders all section headers', () => {
    render(<DemoPage />);
    
    const sectionHeaders = ['Buttons', 'Cards', 'Form Elements'];
    
    sectionHeaders.forEach(header => {
      expect(screen.getByRole('heading', { name: header, level: 2 })).toBeInTheDocument();
    });
  });

  it('renders all button variants', () => {
    render(<DemoPage />);
    
    const buttonVariants = ['Default', 'Primary', 'Secondary', 'Accent', 'Outline', 'Ghost'];
    
    buttonVariants.forEach(variant => {
      expect(screen.getByRole('button', { name: variant })).toBeInTheDocument();
    });
  });

  it('renders cards with correct content', () => {
    render(<DemoPage />);
    
    expect(screen.getByText('Info Card')).toBeInTheDocument();
    expect(screen.getByText('This is a simple card component with some example content.')).toBeInTheDocument();
    
    expect(screen.getByText('With Actions')).toBeInTheDocument();
    expect(screen.getByText('This card has action buttons in the footer.')).toBeInTheDocument();
    
    // Sprawdzamy przyciski akcji w karcie
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('renders form elements with icons', () => {
    render(<DemoPage />);
    
    // Sprawdzamy pola formularza
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    
    // Sprawdzamy ikony
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
    
    // Sprawdzamy przycisk submit
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('updates form data when inputs change', () => {
    render(<DemoPage />);
    
    // Pobieramy pola formularza
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    
    // Wprowadzamy dane do formularza
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    // Sprawdzamy, czy wartości zostały zaktualizowane
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(passwordInput).toHaveValue('password123');
  });
});
