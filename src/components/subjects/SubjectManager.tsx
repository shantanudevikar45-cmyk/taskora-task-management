import { useState } from 'react';
import { Subject, Assignment } from '../../types';
import { BookOpen, Plus, Trash2, ArrowRight, Layers, FileText } from 'lucide-react';

interface SubjectManagerProps {
  subjects: Subject[];
  assignments: Assignment[];
  isLoading: boolean;
  onAddSubject: (name: string) => Promise<void>;
  onDeleteSubject: (subject: Subject) => void;
  onViewSubjectAssignments: (subjectId: number) => void;
}

export function SubjectManager({
  subjects,
  assignments,
  isLoading,
  onAddSubject,
  onDeleteSubject,
  onViewSubjectAssignments,
}: SubjectManagerProps) {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newSubjectName.trim();
    if (!trimmed) {
      setError('Please enter a subject name');
      return;
    }

    if (subjects.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('A subject with this name already exists');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onAddSubject(trimmed);
      setNewSubjectName('');
    } catch (err: any) {
      setError(err.message || 'Failed to add subject');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Subject Form */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">Course & Subject Management</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize coursework into university courses or syllabus modules.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <BookOpen className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Enter subject name (e.g., Computer Graphics, Cloud Computing)"
              value={newSubjectName}
              onChange={(e) => {
                setNewSubjectName(e.target.value);
                if (error) setError(null);
              }}
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !newSubjectName.trim()}
            className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-2xs"
          >
            {isSubmitting ? (
              <span className="inline-block w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            <span>Add Subject</span>
          </button>
        </form>

        {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
      </div>

      {/* Subject Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            All Subjects ({subjects.length})
          </h4>
        </div>

        {subjects.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
            <Layers className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-slate-700">No subjects found</p>
            <p className="text-slate-400 text-3xs mt-0.5">Use the form above to add your first course.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map((subject) => {
              const subjectAssignments = assignments.filter((a) => a.subjectId === subject.id);
              const pendingCount = subjectAssignments.filter((a) => a.status !== 'COMPLETED').length;
              const completedCount = subjectAssignments.filter((a) => a.status === 'COMPLETED').length;

              return (
                <div
                  key={subject.id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-indigo-300 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
                          {subject.name.charAt(0).toUpperCase()}
                        </div>
                        <h4 className="font-semibold text-slate-900 text-sm leading-snug">
                          {subject.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => onDeleteSubject(subject)}
                        title="Delete Subject"
                        className="text-slate-300 hover:text-rose-600 p-1 rounded-md hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center text-xs">
                      <div>
                        <div className="font-mono tabular-nums font-semibold text-slate-800">
                          {subjectAssignments.length}
                        </div>
                        <div className="text-3xs text-slate-400">Total</div>
                      </div>
                      <div>
                        <div className="font-mono tabular-nums font-semibold text-amber-600">
                          {pendingCount}
                        </div>
                        <div className="text-3xs text-slate-400">Pending</div>
                      </div>
                      <div>
                        <div className="font-mono tabular-nums font-semibold text-emerald-600">
                          {completedCount}
                        </div>
                        <div className="text-3xs text-slate-400">Done</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 flex items-center justify-between">
                    <button
                      onClick={() => onViewSubjectAssignments(subject.id)}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Assignments</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <span className="text-3xs text-slate-400 font-mono">ID: {subject.id}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
