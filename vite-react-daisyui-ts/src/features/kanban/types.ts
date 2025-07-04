export interface KanbanItem {
  id: string;
  content: string;
  containerId: string;
}

export interface KanbanContainer {
  id: string;
  title: string;
  milestoneId: string;
}

export interface Milestone {
  id: string;
  title: string;
}

export interface KanbanState {
  items: KanbanItem[];
  containers: KanbanContainer[];
  milestones: Milestone[];
}
