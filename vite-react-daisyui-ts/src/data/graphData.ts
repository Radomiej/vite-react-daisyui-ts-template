import type { Node, Edge } from 'reactflow';

const position = { x: 0, y: 0 };

export const initialNodes: Node[] = [
  { id: '1', data: { label: 'Start' }, position, type: 'input' },
  { id: '2', data: { label: 'Step 2' }, position },
  { id: '3', data: { label: 'Step 3' }, position },
  { id: '4', data: { label: 'Decision' }, position },
  { id: '5a', data: { label: 'Option A' }, position },
  { id: '5b', data: { label: 'Option B' }, position },
  { id: '6', data: { label: 'Sub-Process' }, position },
  { id: '7', data: { label: 'Step 7' }, position },
  { id: '8', data: { label: 'End' }, position, type: 'output' },
  { id: '9', data: { label: 'Feedback' }, position },
];

export const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4' },
  { id: 'e4-5a', source: '4', target: '5a', label: 'Yes' },
  { id: 'e4-5b', source: '4', target: '5b', label: 'No' },
  { id: 'e5a-6', source: '5a', target: '6' },
  { id: 'e5b-7', source: '5b', target: '7' },
  { id: 'e6-8', source: '6', target: '8' },
  { id: 'e7-8', source: '7', target: '8' },
  { id: 'e8-9', source: '8', target: '9' },
];

export const cyclicEdges: Edge[] = [
  ...initialEdges,
  { id: 'e9-4', source: '9', target: '4', label: 'Cycle', animated: true, type: 'smoothstep' },
];
