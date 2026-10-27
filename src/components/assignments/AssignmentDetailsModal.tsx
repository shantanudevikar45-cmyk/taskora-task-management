import { Assignment } from '../../types';
import { formatDate, getDeadlineInfo, getPriorityBadge, getStatusBadge } from '../../utils/formatters';
import { X, Calendar, Clock, BookOpen, CheckCircle, Edit3, AlertCircle } from 'lucide-react';

interface AssignmentDetailsModalProps {
  assignment: Assignment | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (assignment: Assignment) => void;
  onToggleComplete: (id: number) => void;
}

export function AssignmentDetailsModal({
  assignment,
  isOpen,
  onClose,
  onEdit,
  onToggleComplete,
}: AssignmentDetailsModalProps) {
  if (!isOpen || !assignment) return null;

  const deadline = getDeadlineInfo(assignment.dueDate, assignment.status);
  const priorityBadge = getPriorityBadge(assignment.priority);
  const statusBadge = getStatusBadge(assignment.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">#{assignment.id}</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-medium text-indigo-700">{assignment.subjectName || 'Coursework'}</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{assignment.title}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className={`text-xs px-2.5 py-0.5 rounded-md ${priorityBadge.className}`}>
                {priorityBadge.label} Priority
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-md ${statusBadge.className}`}>
                {statusBadge.label}
              </span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-md ${
                deadline.isOverdue
                  ? 'bg-rose-100 text-rose-800 font-medium'
                  : deadline.isDueSoon
                  ? 'bg-amber-100 text-amber-800 font-medium'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {deadline.label}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 space-y-2 border border-slate-200/70 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Deadline Due:</span>
              </span>
              <span className="font-mono tabular-nums font-semibold text-slate-800">
                {formatDate(assignment.dueDate)}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-200/50">
              <span className="text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Subject:</span>
              </span>
              <span className="font-medium text-slate-800">{assignment.subjectName}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Created At:</span>
              </span>
              <span className="font-mono tabular-nums text-slate-600">
                {formatDate(assignment.createdAt)}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Assignment Description
            </h4>
            <div className="text-sm text-slate-600 bg-white p-3.5 rounded-lg border border-slate-200 leading-relaxed whitespace-pre-wrap">
              {assignment.description ? assignment.description : <span className="italic text-slate-400">No additional description provided.</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            type="button"
            onClick={() => onToggleComplete(assignment.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
              assignment.status === 'COMPLETED'
                ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{assignment.status === 'COMPLETED' ? 'Mark as Incomplete' : 'Mark as Completed'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(assignment);
              }}
              className="px-3.5 py-1.5 text-xs font-medium text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
