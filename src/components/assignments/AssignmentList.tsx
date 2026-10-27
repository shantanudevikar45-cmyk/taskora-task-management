import { useState, useMemo } from 'react';
import { Assignment, FilterOptions, Priority, Status, Subject } from '../../types';
import { formatDate, formatShortDate, getDeadlineInfo, getPriorityBadge, getStatusBadge } from '../../utils/formatters';
import {
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Circle,
  Clock,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Plus,
  LayoutGrid,
  List as ListIcon,
  AlertCircle,
  Calendar,
} from 'lucide-react';

interface AssignmentListProps {
  assignments: Assignment[];
  subjects: Subject[];
  isLoading: boolean;
  onOpenCreate: () => void;
  onOpenEdit: (assignment: Assignment) => void;
  onOpenDelete: (assignment: Assignment) => void;
  onOpenDetails: (assignment: Assignment) => void;
  onToggleComplete: (id: number) => void;
  initialSubjectFilter?: number | 'ALL';
}

export function AssignmentList({
  assignments,
  subjects,
  isLoading,
  onOpenCreate,
  onOpenEdit,
  onOpenDelete,
  onOpenDetails,
  onToggleComplete,
  initialSubjectFilter = 'ALL',
}: AssignmentListProps) {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: '',
    subjectId: initialSubjectFilter,
    priority: 'ALL',
    status: 'ALL',
    sortBy: 'dueDateAsc',
  });

  // Filter and sort assignments
  const filteredAssignments = useMemo(() => {
    return assignments
      .filter((item) => {
        // Search query
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(q);
          const matchesDesc = item.description?.toLowerCase().includes(q) || false;
          const matchesSubject = item.subjectName?.toLowerCase().includes(q) || false;
          if (!matchesTitle && !matchesDesc && !matchesSubject) return false;
        }

        // Subject filter
        if (filters.subjectId !== 'ALL' && item.subjectId !== filters.subjectId) {
          return false;
        }

        // Status filter
        if (filters.status !== 'ALL' && item.status !== filters.status) {
          return false;
        }

        // Priority filter
        if (filters.priority !== 'ALL' && item.priority !== filters.priority) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'dueDateAsc') {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (filters.sortBy === 'dueDateDesc') {
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        }
        if (filters.sortBy === 'priorityDesc') {
          const weights: Record<Priority, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return weights[b.priority] - weights[a.priority];
        }
        if (filters.sortBy === 'titleAsc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [assignments, filters]);

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      subjectId: 'ALL',
      priority: 'ALL',
      status: 'ALL',
      sortBy: 'dueDateAsc',
    });
  };

  const hasActiveFilters =
    filters.searchQuery.trim() !== '' ||
    filters.subjectId !== 'ALL' ||
    filters.priority !== 'ALL' ||
    filters.status !== 'ALL';

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search assignments by title or description..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters({ ...filters, searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
              <button
                onClick={() => setViewMode('table')}
                title="Table View"
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'table' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                title="Card Grid View"
                className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === 'cards' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Add Assignment Button */}
            <button
              onClick={onOpenCreate}
              className="px-3.5 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Assignment</span>
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters:</span>
          </div>

          {/* Subject Filter */}
          <select
            value={filters.subjectId}
            onChange={(e) =>
              setFilters({
                ...filters,
                subjectId: e.target.value === 'ALL' ? 'ALL' : Number(e.target.value),
              })
            }
            className="px-2.5 py-1.5 text-xs rounded-md border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
          >
            <option value="ALL">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as Status | 'ALL' })}
            className="px-2.5 py-1.5 text-xs rounded-md border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value as Priority | 'ALL' })}
            className="px-2.5 py-1.5 text-xs rounded-md border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
          >
            <option value="ALL">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          {/* Sort By */}
          <div className="flex items-center gap-1 ml-auto">
            <span className="text-slate-400 flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" />
              <span>Sort:</span>
            </span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="px-2.5 py-1.5 text-xs rounded-md border border-slate-300 bg-white focus:outline-none focus:border-indigo-600"
            >
              <option value="dueDateAsc">Due Date (Earliest first)</option>
              <option value="dueDateDesc">Due Date (Latest first)</option>
              <option value="priorityDesc">Priority (High to Low)</option>
              <option value="titleAsc">Title (A-Z)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-indigo-600 hover:text-indigo-800 text-xs font-medium ml-2"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Assignment List Content */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="inline-block w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-xs text-slate-500">Loading assignments...</p>
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">
            {hasActiveFilters ? 'No assignments match your filters' : 'No assignments yet'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {hasActiveFilters
              ? 'Try adjusting your search criteria, selected subject, or clear all filters.'
              : 'Add your coursework assignments, deadlines, and project deliverables to stay organized.'}
          </p>
          <div className="pt-2">
            {hasActiveFilters ? (
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={onOpenCreate}
                className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              >
                Add Your First Assignment
              </button>
            )}
          </div>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4 w-10 text-center">Done</th>
                  <th className="py-3 px-4">Assignment Title</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssignments.map((assignment) => {
                  const deadline = getDeadlineInfo(assignment.dueDate, assignment.status);
                  const priority = getPriorityBadge(assignment.priority);
                  const status = getStatusBadge(assignment.status);
                  const isDone = assignment.status === 'COMPLETED';

                  return (
                    <tr
                      key={assignment.id}
                      className="hover:bg-slate-50/60 transition-colors group cursor-pointer"
                      onClick={() => onOpenDetails(assignment)}
                    >
                      {/* Checkbox Complete */}
                      <td
                        className="py-3 px-4 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleComplete(assignment.id);
                        }}
                      >
                        <button
                          type="button"
                          className="text-slate-400 hover:text-indigo-600 transition-colors"
                          title={isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300 group-hover:text-slate-400" />
                          )}
                        </button>
                      </td>

                      {/* Title & Preview */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          <span className={isDone ? 'line-through text-slate-400' : ''}>
                            {assignment.title}
                          </span>
                        </div>
                        {assignment.description && (
                          <div className="text-slate-400 text-3xs line-clamp-1 mt-0.5">
                            {assignment.description}
                          </div>
                        )}
                      </td>

                      {/* Subject */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="text-slate-700 font-medium">
                          {assignment.subjectName || 'General'}
                        </span>
                      </td>

                      {/* Due Date & Urgency Indicator */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-mono tabular-nums text-slate-800">
                          {formatShortDate(assignment.dueDate)}
                        </div>
                        <div
                          className={`text-3xs font-medium ${
                            deadline.isOverdue
                              ? 'text-rose-600 font-semibold'
                              : deadline.isDueSoon
                              ? 'text-amber-600 font-semibold'
                              : 'text-slate-400'
                          }`}
                        >
                          {deadline.label}
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-3xs ${priority.className}`}>
                          {priority.label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-3xs ${status.className}`}>
                          {status.label}
                        </span>
                      </td>

                      {/* Row Actions */}
                      <td
                        className="py-3 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                          <button
                            onClick={() => onOpenDetails(assignment)}
                            title="View Details"
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenEdit(assignment)}
                            title="Edit Assignment"
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onOpenDelete(assignment)}
                            title="Delete Assignment"
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>
              Showing <strong className="font-semibold text-slate-700 font-mono tabular-nums">{filteredAssignments.length}</strong> of{' '}
              <span className="font-mono tabular-nums">{assignments.length}</span> assignments
            </span>
          </div>
        </div>
      ) : (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredAssignments.map((assignment) => {
            const deadline = getDeadlineInfo(assignment.dueDate, assignment.status);
            const priority = getPriorityBadge(assignment.priority);
            const status = getStatusBadge(assignment.status);
            const isDone = assignment.status === 'COMPLETED';

            return (
              <div
                key={assignment.id}
                onClick={() => onOpenDetails(assignment)}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:border-indigo-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-3xs uppercase tracking-wider font-semibold text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded">
                      {assignment.subjectName || 'Course'}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-3xs ${priority.className}`}>
                      {priority.label}
                    </span>
                  </div>

                  <h4 className="font-semibold text-slate-900 text-sm line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    <span className={isDone ? 'line-through text-slate-400' : ''}>
                      {assignment.title}
                    </span>
                  </h4>

                  {assignment.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                      {assignment.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <span className="font-mono tabular-nums text-slate-700 font-medium">
                        {formatShortDate(assignment.dueDate)}
                      </span>
                      <span
                        className={`ml-1.5 text-3xs font-medium ${
                          deadline.isOverdue
                            ? 'text-rose-600'
                            : deadline.isDueSoon
                            ? 'text-amber-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {deadline.label}
                      </span>
                    </div>
                  </div>

                  <div
                    className="flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onToggleComplete(assignment.id)}
                      title={isDone ? 'Mark as Incomplete' : 'Mark as Completed'}
                      className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onOpenEdit(assignment)}
                      title="Edit"
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onOpenDelete(assignment)}
                      title="Delete"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
