import { describe, it, expect } from 'vitest';
import { queryClient } from '../queryClient';

describe('QueryClient', () => {
  it('should be instance of QueryClient', () => {
    expect(queryClient).toBeDefined();
    expect(queryClient.getQueryCache).toBeDefined();
    expect(queryClient.getMutationCache).toBeDefined();
  });

  it('should have correct default options', () => {
    const defaultOptions = queryClient.getDefaultOptions();
    
    expect(defaultOptions.queries?.refetchOnWindowFocus).toBe(false);
    expect(defaultOptions.queries?.retry).toBe(1);
    expect(defaultOptions.queries?.staleTime).toBe(5 * 60 * 1000); // 5 minutes
  });

  it('should allow querying', () => {
    expect(typeof queryClient.fetchQuery).toBe('function');
    expect(typeof queryClient.getQueryData).toBe('function');
    expect(typeof queryClient.setQueryData).toBe('function');
  });

  it('should have proper cache methods', () => {
    expect(typeof queryClient.invalidateQueries).toBe('function');
    expect(typeof queryClient.removeQueries).toBe('function');
    expect(typeof queryClient.clear).toBe('function');
  });
});
