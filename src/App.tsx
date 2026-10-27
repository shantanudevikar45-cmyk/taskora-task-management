import { useState, useEffect, useCallback } from 'react';
import { Assignment, AssignmentFormData, Subject } from './types';
import {
  fetchAssignments,
  fetchSubjects,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  markAssignmentComplete,
  createSubject,
  deleteSubject,
  setDemoModeActive,
  isDemoModeActive,
  API_BASE_URL,
} from './services/api';
import {
  initAuth,
  logoutStudent,
  StudentProfile,
  getCachedStudentSession,
} from './services/firebaseAuth';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { LoginPage } from './components/auth/LoginPage';
import { BackendStatusBar } from './components/common/BackendStatusBar';
import { DashboardView } from './components/dashboard/DashboardView';
import { AssignmentList } from './components/assignments/AssignmentList';
import { SubjectManager } from './components/subjects/SubjectManager';
import { AssignmentModal } from './components/assignments/AssignmentModal';
import { AssignmentDetailsModal } from './components/assignments/AssignmentDetailsModal';
import { ConfirmModal } from './components/common/ConfirmModal';
import { BackendCodeViewer } from './components/backend/BackendCodeViewer';
import { VivaGuide } from './components/guide/VivaGuide';
import { AlertCircle, X } from 'lucide-react';

export default function App() {
  // Authentication State
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(() => getCachedStudentSession());
  const [authInitialized, setAuthInitialized] = useState<boolean>(false);

  // App Navigation & Data State
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState<boolean>(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [isSavingAssignment, setIsSavingAssignment] = useState<boolean>(false);

  const [detailsAssignment, setDetailsAssignment] = useState<Assignment | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [subjectFilterForList, setSubjectFilterForList] = useState<number | 'ALL'>('ALL');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (student) => {
        setCurrentStudent(student);
        setAuthInitialized(true);
      },
      () => {
        if (!getCachedStudentSession()) {
          setCurrentStudent(null);
        }
        setAuthInitialized(true);
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Load assignments and subjects from Spring Boot API or Demo mode
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const [loadedSubjects, loadedAssignments] = await Promise.all([
        fetchSubjects(),
        fetchAssignments(),
      ]);

      setSubjects(loadedSubjects);
      setAssignments(loadedAssignments);
    } catch (err: any) {
      console.warn('Backend fetch failed:', err);
      // Auto fallback to demo mode with informative banner
      if (!isDemoModeActive()) {
        setDemoModeActive(true);
        try {
          const [loadedSubjects, loadedAssignments] = await Promise.all([
            fetchSubjects(),
            fetchAssignments(),
          ]);
          setSubjects(loadedSubjects);
          setAssignments(loadedAssignments);
          setErrorMessage(
            `Backend offline at ${API_BASE_URL}. Showing interactive Demo Mode for preview. Run your Java backend on port 8080 to sync MySQL data!`
          );
        } catch (innerErr: any) {
          setErrorMessage(innerErr.message || 'Failed to load initial data');
        }
      } else {
        setErrorMessage(err.message || 'Unable to connect to API');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentStudent) {
      loadData();
    }
  }, [currentStudent, loadData]);

  // Handle Logout
  const handleLogout = async () => {
    await logoutStudent();
    setCurrentStudent(null);
  };

  // Handle Create or Update Assignment
  const handleSaveAssignment = async (formData: AssignmentFormData) => {
    try {
      setIsSavingAssignment(true);
      if (editingAssignment) {
        await updateAssignment(editingAssignment.id, formData);
      } else {
        await createAssignment(formData);
      }
      setIsAssignmentModalOpen(false);
      setEditingAssignment(null);
      await loadData();
    } catch (err: any) {
      alert(`Error saving assignment: ${err.message}`);
    } finally {
      setIsSavingAssignment(false);
    }
  };

  // Handle Quick Add Subject directly from Assignment Modal
  const handleQuickAddSubject = async (name: string): Promise<Subject> => {
    const created = await createSubject(name);
    await loadData();
    return created;
  };

  // Handle Delete Assignment
  const handleConfirmDeleteAssignment = async () => {
    if (!assignmentToDelete) return;
    try {
      setIsDeleting(true);
      await deleteAssignment(assignmentToDelete.id);
      setAssignmentToDelete(null);
      await loadData();
    } catch (err: any) {
      alert(`Error deleting assignment: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Toggle Complete
  const handleToggleComplete = async (id: number) => {
    try {
      await markAssignmentComplete(id);
      await loadData();
    } catch (err: any) {
      alert(`Error updating assignment: ${err.message}`);
    }
  };

  // Handle Add Subject
  const handleAddSubject = async (name: string) => {
    await createSubject(name);
    await loadData();
  };

  // Handle Delete Subject
  const handleConfirmDeleteSubject = async () => {
    if (!subjectToDelete) return;
    try {
      setIsDeleting(true);
      await deleteSubject(subjectToDelete.id);
      setSubjectToDelete(null);
      await loadData();
    } catch (err: any) {
      alert(`Error deleting subject: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Navigate to assignments tab with optional subject filter
  const handleNavigateToAssignments = (subjectId?: number) => {
    if (subjectId) {
      setSubjectFilterForList(subjectId);
    } else {
      setSubjectFilterForList('ALL');
    }
    setCurrentTab('assignments');
  };

  const pendingCount = assignments.filter((a) => a.status !== 'COMPLETED').length;

  // Show login screen if student is not signed in
  if (!currentStudent) {
    return <LoginPage onLoginSuccess={(student) => setCurrentStudent(student)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCreate={() => {
          setEditingAssignment(null);
          setIsAssignmentModalOpen(true);
        }}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        currentStudent={currentStudent}
        onLogout={handleLogout}
      />

      {/* Backend Status Bar */}
      <BackendStatusBar
        onRefreshData={loadData}
        onOpenSetupGuide={() => setCurrentTab('guide')}
      />

      {/* Notice Alert if backend is offline */}
      {errorMessage && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-amber-700 hover:text-amber-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Body Layout with Fixed Sidebar on Desktop */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          assignmentCount={assignments.length}
          pendingCount={pendingCount}
          subjectCount={subjects.length}
          isOpenMobile={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          currentStudent={currentStudent}
          onLogout={handleLogout}
        />

        {/* Content Viewport */}
        <main className="flex-1 md:pl-64 p-4 sm:p-6 lg:p-8 min-w-0">
          {currentTab === 'dashboard' && (
            <DashboardView
              assignments={assignments}
              subjects={subjects}
              onOpenCreate={() => {
                setEditingAssignment(null);
                setIsAssignmentModalOpen(true);
              }}
              onNavigateToAssignments={handleNavigateToAssignments}
              onOpenDetails={(assignment) => {
                setDetailsAssignment(assignment);
                setIsDetailsModalOpen(true);
              }}
              onToggleComplete={handleToggleComplete}
            />
          )}

          {currentTab === 'assignments' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Assignments & Deadlines</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    View, search, filter, and organize all university coursework submissions.
                  </p>
                </div>
              </div>

              <AssignmentList
                assignments={assignments}
                subjects={subjects}
                isLoading={isLoading}
                onOpenCreate={() => {
                  setEditingAssignment(null);
                  setIsAssignmentModalOpen(true);
                }}
                onOpenEdit={(assignment) => {
                  setEditingAssignment(assignment);
                  setIsAssignmentModalOpen(true);
                }}
                onOpenDelete={(assignment) => setAssignmentToDelete(assignment)}
                onOpenDetails={(assignment) => {
                  setDetailsAssignment(assignment);
                  setIsDetailsModalOpen(true);
                }}
                onToggleComplete={handleToggleComplete}
                initialSubjectFilter={subjectFilterForList}
              />
            </div>
          )}

          {currentTab === 'subjects' && (
            <SubjectManager
              subjects={subjects}
              assignments={assignments}
              isLoading={isLoading}
              onAddSubject={handleAddSubject}
              onDeleteSubject={(subject) => setSubjectToDelete(subject)}
              onViewSubjectAssignments={handleNavigateToAssignments}
            />
          )}

          {currentTab === 'backend' && <BackendCodeViewer />}

          {currentTab === 'guide' && <VivaGuide />}
        </main>
      </div>

      {/* Assignment Create / Edit Modal */}
      <AssignmentModal
        isOpen={isAssignmentModalOpen}
        assignment={editingAssignment}
        subjects={subjects}
        isLoading={isSavingAssignment}
        onSave={handleSaveAssignment}
        onClose={() => {
          setIsAssignmentModalOpen(false);
          setEditingAssignment(null);
        }}
        onQuickAddSubject={handleQuickAddSubject}
      />

      {/* Assignment Details Modal */}
      <AssignmentDetailsModal
        isOpen={isDetailsModalOpen}
        assignment={detailsAssignment}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setDetailsAssignment(null);
        }}
        onEdit={(assignment) => {
          setEditingAssignment(assignment);
          setIsAssignmentModalOpen(true);
        }}
        onToggleComplete={handleToggleComplete}
      />

      {/* Delete Assignment Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(assignmentToDelete)}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${assignmentToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Assignment"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteAssignment}
        onCancel={() => setAssignmentToDelete(null)}
      />

      {/* Delete Subject Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(subjectToDelete)}
        title="Delete Subject"
        message={`Are you sure you want to delete "${subjectToDelete?.name}"? All assignments belonging to this subject will also be removed in accordance with MySQL foreign key cascading.`}
        confirmLabel="Delete Subject"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteSubject}
        onCancel={() => setSubjectToDelete(null)}
      />
    </div>
  );
}
