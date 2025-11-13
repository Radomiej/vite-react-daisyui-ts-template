import React from 'react';
import { AIAssistant } from '../features/ai-assistant';

const AIAssistantPage: React.FC = () => {
  return (
    <div className="h-screen flex flex-col">
      <AIAssistant />
    </div>
  );
};

export default AIAssistantPage;
