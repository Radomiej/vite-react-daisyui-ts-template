
import { KanbanBoard } from './components/KanbanBoard';

export function KanbanDemo() {
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Trello-like Kanban Board</h1>
          <p className="text-base-content/70">
            A demonstration of drag and drop functionality using dnd-kit
          </p>
        </div>
        
        <div className="divider"></div>
        
        <div className="bg-base-100 rounded-box p-4">
          <KanbanBoard />
        </div>
        
        <div className="mt-8 bg-base-200 p-4 rounded-box">
          <h2 className="text-xl font-bold mb-4">How to use</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Drag and drop tasks between columns</li>
            <li>Reorder tasks within a column</li>
            <li>Tasks maintain their position when dragged</li>
            <li>Works with keyboard navigation (use Tab to focus, Space to select, Arrow keys to move)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
