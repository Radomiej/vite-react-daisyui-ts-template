# Kanban Board Feature

A Trello-like Kanban board implementation using React, TypeScript, DaisyUI, and dnd-kit for drag-and-drop functionality.

## Features

- Create and manage multiple Kanban columns (boards)
- Create tasks within each column
- Drag and drop tasks between columns
- Responsive design using DaisyUI components
- TypeScript support for type safety

## Components

### KanbanBoard

The main container component that manages the state of columns and tasks, and handles drag-and-drop operations.

```tsx
import { KanbanBoard } from '../features/kanban';

// Example usage
const MyComponent = () => {
  const initialBoard = {
    columns: [
      {
        id: 'todo',
        title: 'To Do',
        tasks: [
          {
            id: 'task-1',
            title: 'Example Task',
            description: 'This is an example task',
            createdAt: new Date(),
          },
        ],
      },
      // More columns...
    ],
  };

  return <KanbanBoard initialBoard={initialBoard} />;
};
```

### KanbanColumn

Represents a single column in the Kanban board. Contains tasks and provides UI for adding new tasks.

### KanbanTask

Represents a single task card that can be dragged between columns.

## Types

```typescript
// KanbanTask represents a single task card
interface KanbanTask {
  id: UniqueIdentifier;
  title: string;
  description?: string;
  createdAt: Date;
}

// KanbanColumn represents a column containing tasks
interface KanbanColumn {
  id: UniqueIdentifier;
  title: string;
  tasks: KanbanTask[];
}

// KanbanBoard represents the entire board with columns
interface KanbanBoard {
  columns: KanbanColumn[];
}
```

## Implementation Details

This Kanban board implementation uses:

- **@dnd-kit/core**: For drag-and-drop functionality
- **@dnd-kit/sortable**: For sortable lists
- **@dnd-kit/utilities**: For utility functions
- **DaisyUI**: For UI components and styling
- **TypeScript**: For type safety

The drag-and-drop functionality is implemented using the `DndContext`, `useDraggable`, and `useDroppable` hooks from dnd-kit.

## Testing

The Kanban board feature includes comprehensive Playwright tests that verify:

- Initial rendering of columns and tasks
- Creating new tasks
- Creating new columns
- Dragging and dropping tasks between columns
- Edge cases (empty columns)
- Failure cases (invalid drag operations)

To run the tests:

```bash
npx playwright test
```

## Future Enhancements

Potential future enhancements for the Kanban board feature:

- Task editing and deletion
- Column reordering
- Task filtering and searching
- Task labels and priorities
- User assignments
- Due dates and reminders
