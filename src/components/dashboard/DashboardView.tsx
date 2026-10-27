import { useMemo } from 'react';
import { Assignment, Subject } from '../../types';
import { formatDate, formatShortDate, getDeadlineInfo, getPriorityBadge, getStatusBadge } from '../../utils/formatters';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Plus,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface DashboardViewProps {
  assignments: Assignment[];
  subjects: Subject[];
  onOpenCreate: () => void;
  onNavigateToAssignments: (subjectId?: number) => void;
  onOpenDetails: (assignment: Assignment) => void;
  onToggleComplete: (id: number) => void;
}

export function DashboardView({
  assignments,
  subjects,
  onOpenCreate,
  onNavigateToAssignments,
  onOpenDetails,
  onToggleComplete,
}: DashboardViewProps) {
  // Compute Dashboard Statistics
  const stats = useMemo(() => {
    const total = assignments.length;
    let pending = 0;
    let inProgress = 0;
    let completed = 0;
    let overdue = 0;
    let dueSoon = 0;

    const now = new Date().getTime();

    assignments.forEach((a) => {
      if (a.status === 'COMPLETED') {
        completed++;
      } else {
        if (a.status === 'PENDING') pending++;
        if (a.status === 'IN_PROGRESS') inProgress++;

        const due = new Date(a.dueDate).getTime();
        if (due < now) {
          overdue++;
        } else if (due - now <= 48 * 3600 * 1000) {
          dueSoon++;
        }
      }
    });

    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, pending, inProgress, completed, overdue, dueSoon, completionRate };
  }, [assignments]);

  // Upcoming deadlines (ordered by due date, incomplete only)
  const upcomingAssignments = useMemo(() => {
    return assignments
      .filter((a) => a.status !== 'COMPLETED')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [assignments]);

  // Subject statistics
  const subjectStats = useMemo(() => {
    return subjects.map((sub) => {
      const subAssignments = assignments.filter((a) => a.subjectId === sub.id);
      const subTotal = subAssignments.length;
      const subCompleted = subAssignments.filter((a) => a.status === 'COMPLETED').length;
      const subPending = subTotal - subCompleted;
      const subProgress = subTotal > 0 ? Math.round((subCompleted / subTotal) * 100) : 0;
      return {
        id: sub.id,
        name: sub.name,
        total: subTotal,
        pending: subPending,
        completed: subCompleted,
        progress: subProgress,
      };
    });
  }, [assignments, subjects]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner / Quick Summary */}
      <div className="bg-linear-to-r from-indigo-700 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-indigo-200 text-xs font-medium mb-1">
            <span>Academic Semester Tracking</span>
            <span>·</span>
            <span>Spring Boot + MySQL</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Assignment Command Center</h2>
          <p className="text-indigo-100 text-xs mt-1 max-w-xl leading-relaxed">
            Stay on top of upcoming university submissions, prioritize urgent coursework, and track progress across all enrolled subjects.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Assignment</span>
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Assignments */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-medium">Total Assignments</p>
            <h3 className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              {stats.total}
            </h3>
            <p className="text-3xs text-slate-400 mt-0.5">Across {subjects.length} subjects</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-medium">Pending Tasks</p>
            <h3 className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              {stats.pending + stats.inProgress}
            </h3>
            <p className="text-3xs text-slate-400 mt-0.5">
              <span className="text-indigo-600 font-semibold">{stats.inProgress}</span> in progress
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-medium">Completed</p>
            <h3 className="text-2xl font-bold text-emerald-600 font-mono tabular-nums mt-1">
              {stats.completed}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
              <span className="text-3xs font-mono text-slate-500 font-medium">
                {stats.completionRate}%
              </span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Upcoming / Overdue */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-medium">Deadlines & Alerts</p>
            <h3 className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
              {stats.overdue > 0 ? (
                <span className="text-rose-600">{stats.overdue} Overdue</span>
              ) : (
                <span className="text-slate-900">{stats.dueSoon} Due Soon</span>
              )}
            </h3>
            <p className="text-3xs text-slate-400 mt-0.5">
              {stats.overdue > 0 ? `${stats.dueSoon} due within 48h` : 'No overdue assignments'}
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              stats.overdue > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Upcoming Deadlines + Subjects Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Urgent Deadlines */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Upcoming Deadlines</h3>
              <p className="text-3xs text-slate-400">Chronological list of next due assignments</p>
            </div>
            <button
              onClick={() => onNavigateToAssignments()}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingAssignments.length === 0 ? (
            <div className="py-8 text-center text-slate-500 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="font-medium text-slate-700">All caught up!</p>
              <p className="text-slate-400 text-3xs mt-0.5">No pending assignments or overdue deadlines.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {upcomingAssignments.map((a) => {
                const deadline = getDeadlineInfo(a.dueDate, a.status);
                const priority = getPriorityBadge(a.priority);

                return (
                  <div
                    key={a.id}
                    onClick={() => onOpenDetails(a)}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleComplete(a.id);
                        }}
                        title="Mark as Completed"
                        className="w-5 h-5 rounded-full border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50 flex items-center justify-center text-transparent hover:text-emerald-600 transition-colors shrink-0"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="min-w-0">
                        <h4 className="text-xs font-semibold text-slate-900 truncate">{a.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-3xs text-slate-500">
                          <span className="font-medium text-indigo-700">{a.subjectName}</span>
                          <span>·</span>
                          <span className={priority.className + ' px-1.5 py-0.2 rounded'}>
                            {priority.label}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono tabular-nums text-xs font-medium text-slate-800">
                        {formatShortDate(a.dueDate)}
                      </div>
                      <div
                        className={`text-3xs font-semibold ${
                          deadline.isOverdue
                            ? 'text-rose-600'
                            : deadline.isDueSoon
                            ? 'text-amber-600'
                            : 'text-slate-500'
                        }`}
                      >
                        {deadline.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Column: Subject Breakdown */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Subject Progress</h3>
              <p className="text-3xs text-slate-400">Assignments per enrolled course</p>
            </div>
          </div>

          {subjectStats.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No subjects created yet.</p>
          ) : (
            <div className="space-y-3.5">
              {subjectStats.map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onNavigateToAssignments(sub.id)}
                  className="p-2.5 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-800 group-hover:text-indigo-700 truncate">
                      {sub.name}
                    </span>
                    <span className="text-3xs font-mono text-slate-500 tabular-nums shrink-0 ml-2">
                      {sub.completed}/{sub.total}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${sub.progress}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-3xs text-slate-400 mt-1">
                    <span>{sub.pending} pending</span>
                    <span>{sub.progress}% done</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
