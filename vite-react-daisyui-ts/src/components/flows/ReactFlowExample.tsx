import React from 'react';
import ReactFlow from 'reactflow';
import type {
  Node,
  Edge,
  FitViewOptions,
  OnConnect,
  OnNodesChange,
  OnEdgesChange,
  DefaultEdgeOptions,
} from 'reactflow';
import 'reactflow/dist/style.css';

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

interface ReactFlowExampleProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

export const ReactFlowExample: React.FC<ReactFlowExampleProps> = ({ nodes, edges, onNodesChange, onEdgesChange, onConnect }) => {
  return (
    <div style={{ height: '500px', width: '100%' }} data-testid="rf-example-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}
      />
    </div>
  );
};

export default ReactFlowExample;
