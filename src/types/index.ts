export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface Subject {
  id: number;
  name: string;
  assignmentCount?: number;
}

export interface Assignment {
  id: number;
  title: string;
  description: string;
  subjectId: number;
  subjectName?: string;
  dueDate: string; // ISO date-time string YYYY-MM-DDTHH:mm
  priority: Priority;
  status: Status;
  createdAt: string;
}

export interface AssignmentFormData {
  title: string;
  description: string;
  subjectId: number | '';
  dueDate: string;
  priority: Priority;
  status: Status;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  dueSoon: number; // due in next 48 hours
}

export interface FilterOptions {
  searchQuery: string;
  subjectId: number | 'ALL';
  priority: Priority | 'ALL';
  status: Status | 'ALL';
  sortBy: 'dueDateAsc' | 'dueDateDesc' | 'priorityDesc' | 'titleAsc';
}
