import React from 'react';
import { KanbanBoard } from '../features/kanban';

const KanbanPage: React.FC = () => {
  // Sample initial data for the Kanban board
  const initialBoard = {
    columns: [
      {
        id: 'todo',
        title: 'To Do',
        tasks: [
          {
            id: 'task-1',
            title: 'Research dnd-kit',
            description: 'Look into the dnd-kit documentation and examples',
            createdAt: new Date('2025-07-20'),
          },
          {
            id: 'task-2',
            title: 'Design Kanban structure',
            description: 'Plan the component hierarchy and data flow',
            createdAt: new Date('2025-07-21'),
          },
        ],
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        tasks: [
          {
            id: 'task-3',
            title: 'Implement drag and drop',
            description: 'Add the drag and drop functionality to the Kanban board',
            createdAt: new Date('2025-07-22'),
          },
        ],
      },
      {
        id: 'done',
        title: 'Done',
        tasks: [
          {
            id: 'task-4',
            title: 'Set up project structure',
            description: 'Create the necessary folders and files for the Kanban feature',
            createdAt: new Date('2025-07-23'),
          },
        ],
      },
    ],
  };

  return (
    <div className="container mx-auto py-8">
      <KanbanBoard initialBoard={initialBoard} />
    </div>
  );
};

export default KanbanPage;
