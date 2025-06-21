import React from 'react';
import ReactFlowExample from '../components/flows/ReactFlowExample';

const FlowPage: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">React Flow Example</h1>
      <div className="border rounded-lg shadow-lg">
        <ReactFlowExample />
      </div>
    </div>
  );
};

export default FlowPage;
