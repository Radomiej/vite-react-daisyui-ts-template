import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { describe, it, expect } from 'vitest';
import { Navbar } from '../Navbar';
import { MemoryRouter } from 'react-router-dom';

describe('Navbar', () => {
  it('renders Navbar with navigation role', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });




});
