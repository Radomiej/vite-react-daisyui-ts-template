import { describe, it, expect } from 'vitest';
import { store } from '../store';
import { increment, decrement } from '../../features/counter/store/counterSlice';

describe('Redux Store', () => {
  it('should have correct initial state', () => {
    const state = store.getState();
    expect(state).toHaveProperty('counter');
    expect(state.counter.value).toBe(0);
  });

  it('should handle counter actions', () => {
    // Test increment
    store.dispatch(increment());
    expect(store.getState().counter.value).toBe(1);
    
    // Test decrement
    store.dispatch(decrement());
    expect(store.getState().counter.value).toBe(0);
  });

  it('should maintain state across dispatches', () => {
    const initialState = store.getState();
    store.dispatch(increment());
    store.dispatch(increment());
    
    const newState = store.getState();
    expect(newState.counter.value).toBe(2);
    expect(initialState).not.toBe(newState);
  });
});
