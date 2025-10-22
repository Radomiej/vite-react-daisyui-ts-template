import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Counter } from '../Counter';
import counterReducer from "../../store/counterSlice";

const createMockStore = (initialState = { value: 0 }) => {
  return configureStore({
    reducer: {
      counter: counterReducer,
    },
    preloadedState: {
      counter: initialState,
    },
  });
};

const renderWithStore = (component: React.ReactElement, initialState?: { value: number }) => {
  const store = createMockStore(initialState);
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('Counter', () => {
  it('renders counter with initial value 0', () => {
    renderWithStore(<Counter />);
    
    expect(screen.getByRole('heading', { name: /licznik redux/i })).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders counter with custom initial value', () => {
    renderWithStore(<Counter />, { value: 5 });
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('increments counter when + button is clicked', () => {
    const { store } = renderWithStore(<Counter />);
    
    const incrementButton = screen.getByLabelText(/zwiększ/i);
    fireEvent.click(incrementButton);
    
    expect(store.getState().counter.value).toBe(1);
  });

  it('decrements counter when - button is clicked', () => {
    const { store } = renderWithStore(<Counter />, { value: 5 });
    
    const decrementButton = screen.getByLabelText(/zmniejsz/i);
    fireEvent.click(decrementButton);
    
    expect(store.getState().counter.value).toBe(4);
  });

  it('increments by 5 when "Dodaj 5" button is clicked', () => {
    const { store } = renderWithStore(<Counter />);
    
    const addFiveButton = screen.getByText(/dodaj 5/i);
    fireEvent.click(addFiveButton);
    
    expect(store.getState().counter.value).toBe(5);
  });

  it('has correct CSS classes', () => {
    renderWithStore(<Counter />);
    
    const card = screen.getByRole('heading').closest('.card');
    expect(card).toHaveClass('w-96', 'bg-base-100', 'shadow-xl');
  });

  it('displays current count correctly after multiple operations', () => {
    const { store } = renderWithStore(<Counter />);
    
    // Increment twice
    const incrementButton = screen.getByLabelText(/zwiększ/i);
    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    
    // Add 5
    const addFiveButton = screen.getByText(/dodaj 5/i);
    fireEvent.click(addFiveButton);
    
    // Decrement once
    const decrementButton = screen.getByLabelText(/zmniejsz/i);
    fireEvent.click(decrementButton);
    
    expect(store.getState().counter.value).toBe(6);
  });
});
