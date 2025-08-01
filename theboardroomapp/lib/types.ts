export interface Task {
    id: number;
    organization_id: number;
    project_id: number;
    task_title: string;
    assigned_to?: string;
    status: 'Open' | 'In Progress' | 'Done';
    due_date?: string;
    created_at: string;
  }