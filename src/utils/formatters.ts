import { Priority, Status } from '../types';

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatShortDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export interface DeadlineInfo {
  isOverdue: boolean;
  isDueToday: boolean;
  isDueSoon: boolean; // within 48h
  label: string;
}

export function getDeadlineInfo(dueDateString: string, status: Status): DeadlineInfo {
  if (status === 'COMPLETED') {
    return {
      isOverdue: false,
      isDueToday: false,
      isDueSoon: false,
      label: 'Completed',
    };
  }

  const now = new Date();
  const due = new Date(dueDateString);
  const diffMs = due.getTime() - now.getTime();
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffMs < 0) {
    const daysAgo = Math.abs(diffDays);
    return {
      isOverdue: true,
      isDueToday: false,
      isDueSoon: false,
      label: daysAgo <= 1 ? 'Overdue today' : `Overdue by ${daysAgo} days`,
    };
  }

  if (diffHours <= 24) {
    return {
      isOverdue: false,
      isDueToday: true,
      isDueSoon: true,
      label: diffHours <= 1 ? 'Due in <1 hour' : `Due in ${diffHours} hours`,
    };
  }

  if (diffDays <= 2) {
    return {
      isOverdue: false,
      isDueToday: false,
      isDueSoon: true,
      label: `Due in ${diffDays} days`,
    };
  }

  return {
    isOverdue: false,
    isDueToday: false,
    isDueSoon: false,
    label: `Due in ${diffDays} days`,
  };
}

export function getPriorityBadge(priority: Priority): { label: string; className: string } {
  switch (priority) {
    case 'HIGH':
      return {
        label: 'High',
        className: 'text-rose-700 bg-rose-50 border border-rose-200/80 font-medium',
      };
    case 'MEDIUM':
      return {
        label: 'Medium',
        className: 'text-amber-700 bg-amber-50 border border-amber-200/80 font-medium',
      };
    case 'LOW':
      return {
        label: 'Low',
        className: 'text-emerald-700 bg-emerald-50 border border-emerald-200/80 font-medium',
      };
    default:
      return {
        label: priority,
        className: 'text-slate-600 bg-slate-50 border border-slate-200 font-medium',
      };
  }
}

export function getStatusBadge(status: Status): { label: string; className: string } {
  switch (status) {
    case 'COMPLETED':
      return {
        label: 'Completed',
        className: 'text-emerald-700 bg-emerald-50/70 border border-emerald-200/60 font-medium',
      };
    case 'IN_PROGRESS':
      return {
        label: 'In Progress',
        className: 'text-indigo-700 bg-indigo-50/70 border border-indigo-200/60 font-medium',
      };
    case 'PENDING':
      return {
        label: 'Pending',
        className: 'text-slate-700 bg-slate-100 border border-slate-200/80 font-medium',
      };
    default:
      return {
        label: status,
        className: 'text-slate-600 bg-slate-100 border border-slate-200 font-medium',
      };
  }
}
