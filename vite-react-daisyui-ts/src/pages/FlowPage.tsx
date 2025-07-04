import React, { useState, useCallback, useEffect } from 'react';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import type {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Connection,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import { ReactFlowExample } from '../components/flows/ReactFlowExample';
import { initialNodes, initialEdges, cyclicEdges } from '../data/graphData';
import { getLayoutedElements } from '../utils/layout';

const layoutOptions = ['Dagre', 'D3-Hierarchy', 'ELK', 'D3-Force'];
const layoutsWithCycleSupport = ['elk', 'd3-force'];

const FlowPage: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [layout, setLayout] = useState('dagre');

  useEffect(() => {
    const selectedEdges = layoutsWithCycleSupport.includes(layout) ? cyclicEdges : initialEdges;
    getLayoutedElements(initialNodes, selectedEdges, layout).then(({ nodes: layoutedNodes, edges: layoutedEdges }) => {
      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    });
  }, [layout]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleLayoutChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLayout(event.target.value);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-base-200">
        <label className="label">
          <span className="label-text">Select Layout</span>
        </label>
        <select className="select select-bordered w-full max-w-xs" value={layout} onChange={handleLayoutChange}>
          {layoutOptions.map((option) => (
            <option key={option} value={option.toLowerCase()}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-grow">
        <ReactFlowExample
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        />
      </div>
    </div>
  );
};

export default FlowPage;
