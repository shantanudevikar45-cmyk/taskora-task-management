import { useState, useEffect } from 'react';
import { Assignment, AssignmentFormData, Priority, Status, Subject } from '../../types';
import { X, Calendar, BookOpen, AlertCircle, Plus } from 'lucide-react';

interface AssignmentModalProps {
  isOpen: boolean;
  assignment?: Assignment | null; // null if creating, populated if editing
  subjects: Subject[];
  isLoading?: boolean;
  onSave: (data: AssignmentFormData) => Promise<void>;
  onClose: () => void;
  onQuickAddSubject: (name: string) => Promise<Subject>;
}

export function AssignmentModal({
  isOpen,
  assignment,
  subjects,
  isLoading = false,
  onSave,
  onClose,
  onQuickAddSubject,
}: AssignmentModalProps) {
  const isEditing = Boolean(assignment);

  const [formData, setFormData] = useState<AssignmentFormData>({
    title: '',
    description: '',
    subjectId: '',
    dueDate: '',
    priority: 'MEDIUM',
    status: 'PENDING',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showQuickSubjectInput, setShowQuickSubjectInput] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isAddingSubject, setIsAddingSubject] = useState(false);

  useEffect(() => {
    if (assignment) {
      // Format date for datetime-local (YYYY-MM-DDTHH:mm)
      let formattedDate = assignment.dueDate;
      try {
        const d = new Date(assignment.dueDate);
        if (!isNaN(d.getTime())) {
          const tzOffset = d.getTimezoneOffset() * 60000;
          formattedDate = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
        }
      } catch {
        formattedDate = assignment.dueDate;
      }

      setFormData({
        title: assignment.title,
        description: assignment.description || '',
        subjectId: assignment.subjectId,
        dueDate: formattedDate,
        priority: assignment.priority,
        status: assignment.status,
      });
    } else {
      // Default due date: tomorrow at 23:59
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(23, 59, 0, 0);
      const tzOffset = tomorrow.getTimezoneOffset() * 60000;
      const defaultDue = new Date(tomorrow.getTime() - tzOffset).toISOString().slice(0, 16);

      setFormData({
        title: '',
        description: '',
        subjectId: subjects.length > 0 ? subjects[0].id : '',
        dueDate: defaultDue,
        priority: 'MEDIUM',
        status: 'PENDING',
      });
    }
    setErrors({});
    setShowQuickSubjectInput(false);
    setNewSubjectName('');
  }, [assignment, isOpen, subjects]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) {
      errs.title = 'Assignment title is required';
    } else if (formData.title.trim().length < 3) {
      errs.title = 'Title must be at least 3 characters';
    }

    if (!formData.subjectId) {
      errs.subjectId = 'Please select a subject';
    }

    if (!formData.dueDate) {
      errs.dueDate = 'Due date and time are required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSave(formData);
  };

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    try {
      setIsAddingSubject(true);
      const created = await onQuickAddSubject(newSubjectName.trim());
      setFormData((prev) => ({ ...prev, subjectId: created.id }));
      setNewSubjectName('');
      setShowQuickSubjectInput(false);
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, subjectId: err.message || 'Failed to add subject' }));
    } finally {
      setIsAddingSubject(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h3 className="font-semibold text-slate-900 text-lg">
              {isEditing ? 'Edit Assignment' : 'Add New Assignment'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing ? 'Update assignment details and deadline' : 'Track and manage your upcoming coursework'}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Assignment Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Relational Schema Normalization Lab"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors ${
                errors.title ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-600'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* Subject */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Subject / Course <span className="text-rose-500">*</span>
              </label>
              {!showQuickSubjectInput && (
                <button
                  type="button"
                  onClick={() => setShowQuickSubjectInput(true)}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>New Subject</span>
                </button>
              )}
            </div>

            {showQuickSubjectInput ? (
              <div className="flex items-center gap-2 mb-2 p-2 bg-indigo-50/50 rounded-lg border border-indigo-100">
                <input
                  type="text"
                  placeholder="New subject name (e.g., Computer Networks)"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="grow px-3 py-1.5 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                />
                <button
                  type="button"
                  disabled={isAddingSubject || !newSubjectName.trim()}
                  onClick={handleCreateSubject}
                  className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
                >
                  {isAddingSubject ? 'Adding...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickSubjectInput(false);
                    setNewSubjectName('');
                  }}
                  className="px-2 py-1.5 text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>
            ) : null}

            <select
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value ? Number(e.target.value) : '' })}
              className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors ${
                errors.subjectId ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-600'
              }`}
            >
              <option value="">-- Select Subject --</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
            {errors.subjectId && <p className="text-xs text-rose-500 mt-1">{errors.subjectId}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Description / Instructions
            </label>
            <textarea
              rows={3}
              placeholder="Add key deliverables, submission link, rubric notes or guidelines..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors"
            />
          </div>

          {/* Due Date & Time */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Due Date & Time <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className={`w-full px-3.5 py-2 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-colors font-mono tabular-nums ${
                  errors.dueDate ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-indigo-600'
                }`}
              />
            </div>
            {errors.dueDate && <p className="text-xs text-rose-500 mt-1">{errors.dueDate}</p>}
          </div>

          {/* Priority & Status in two columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Priority Level
              </label>
              <div className="flex rounded-lg border border-slate-200 p-1 bg-slate-50 gap-1">
                {(['LOW', 'MEDIUM', 'HIGH'] as Priority[]).map((p) => {
                  const isActive = formData.priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: p })}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors text-center ${
                        isActive
                          ? p === 'HIGH'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : p === 'MEDIUM'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      {p.charAt(0) + p.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors flex items-center gap-2 shadow-xs"
            >
              {isLoading && <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Assignment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
