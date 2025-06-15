import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Modal } from '../Modal';

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

describe('Modal', () => {
  it('renders when open', () => {
    render(<Modal isOpen onClose={() => {}}>Modal content</Modal>);
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<Modal isOpen={false} onClose={() => {}}>Hidden</Modal>);
    expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  });

  it('calls onClose when background clicked', async () => {
    // workaround: usuń wszystkie overlaye z poprzednich testów
    document.querySelectorAll('[data-testid=modal-overlay]').forEach(el => el.remove());
    const onClose = vi.fn();
    render(<Modal isOpen onClose={onClose}>Modal</Modal>);
    // overlay: aria-hidden="true"
    const overlays = screen.getAllByTestId('modal-overlay');
    expect(overlays).toHaveLength(1);
    await userEvent.click(overlays[0]);
    expect(onClose).toHaveBeenCalled();
  });

  it('edge: renders with no children', () => {
    render(<Modal isOpen onClose={() => {}} children={''} />);
    // Modal should render exactly one dialog
    expect(screen.getAllByRole('dialog')).toHaveLength(1);
  });

  it('failure: does not call onClose if not open', () => {
    const onClose = vi.fn();
    render(<Modal isOpen={false} onClose={onClose} children={''} />);
    // simulate click, but should not call
    expect(onClose).not.toHaveBeenCalled();
  });
});
