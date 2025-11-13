import { describe, it, expect } from 'vitest';
import counterReducer, { 
  increment, 
  decrement, 
  incrementByAmount, 
  type CounterState 
} from '../counterSlice';

describe('counterSlice', () => {
  const initialState: CounterState = {
    value: 0,
  };

  it('should handle initial state', () => {
    expect(counterReducer(undefined, { type: 'unknown' })).toEqual({
      value: 0,
    });
  });

  it('should handle increment', () => {
    const actual = counterReducer(initialState, increment());
    expect(actual.value).toEqual(1);
  });

  it('should handle decrement', () => {
    const actual = counterReducer(initialState, decrement());
    expect(actual.value).toEqual(-1);
  });

  it('should handle incrementByAmount', () => {
    const actual = counterReducer(initialState, incrementByAmount(5));
    expect(actual.value).toEqual(5);
  });

  it('should handle incrementByAmount with negative value', () => {
    const actual = counterReducer(initialState, incrementByAmount(-3));
    expect(actual.value).toEqual(-3);
  });

  it('should handle multiple operations', () => {
    let state = counterReducer(initialState, increment());
    state = counterReducer(state, increment());
    state = counterReducer(state, incrementByAmount(5));
    state = counterReducer(state, decrement());
    
    expect(state.value).toEqual(6);
  });

  it('should preserve state immutability', () => {
    const state: CounterState = { value: 10 };
    const newState = counterReducer(state, increment());
    
    expect(state.value).toEqual(10); // Original state unchanged
    expect(newState.value).toEqual(11); // New state has changed value
    expect(state).not.toBe(newState); // Different object references
  });
});
