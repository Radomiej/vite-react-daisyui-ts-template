import type { Node, Edge } from 'reactflow';

export const getLayoutedElements = async (
  nodes: Node[], 
  edges: Edge[]
): Promise<{ nodes: Node[]; edges: Edge[] }> => {
  // Mock implementation for tests
  return Promise.resolve({
    nodes: [...nodes],
    edges: [...edges]
  });
};
