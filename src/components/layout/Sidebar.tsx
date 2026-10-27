import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Code2,
  GraduationCap,
  Sparkles,
  LogOut,
  User,
} from 'lucide-react';
import { StudentProfile } from '../../services/firebaseAuth';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  assignmentCount: number;
  pendingCount: number;
  subjectCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  currentStudent: StudentProfile | null;
  onLogout: () => void;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  assignmentCount,
  pendingCount,
  subjectCount,
  isOpenMobile,
  onCloseMobile,
  currentStudent,
  onLogout,
}: SidebarProps) {
  const links = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: CheckSquare,
      badge: pendingCount > 0 ? `${pendingCount} due` : null,
      badgeColor: pendingCount > 0 ? 'bg-amber-100 text-amber-800' : '',
    },
    {
      id: 'subjects',
      label: 'Subjects',
      icon: BookOpen,
      badge: subjectCount.toString(),
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'backend',
      label: 'Java Spring Boot',
      icon: Code2,
      badge: 'API',
      badgeColor: 'bg-indigo-100 text-indigo-700',
    },
    {
      id: 'guide',
      label: 'Viva & Project Guide',
      icon: GraduationCap,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-14 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-40 flex flex-col justify-between p-4 transition-transform duration-200 md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6">
          {/* Student Profile Overview */}
          {currentStudent && (
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                {currentStudent.photoURL ? (
                  <img
                    src={currentStudent.photoURL}
                    alt={currentStudent.displayName}
                    className="w-8 h-8 rounded-full border border-indigo-200 object-cover shrink-0"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {currentStudent.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 truncate">
                    {currentStudent.displayName}
                  </h4>
                  <p className="text-3xs text-slate-500 truncate">
                    {currentStudent.rollNumber || currentStudent.email}
                  </p>
                </div>
              </div>

              <button
                onClick={onLogout}
                title="Log Out"
                className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-white transition-colors shrink-0"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            <p className="px-3 pb-2 text-3xs font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </p>
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;

              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onSelectTab(link.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className={`text-3xs font-mono px-1.5 py-0.5 rounded ${link.badgeColor}`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Student Mini-Project Card */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-700 font-semibold text-3xs uppercase tracking-wide">
            <Sparkles className="w-3 h-3 text-indigo-600" />
            <span>College Mini-Project</span>
          </div>
          <p className="text-slate-700 font-medium">Taskora v1.0</p>
          <p className="text-3xs text-slate-500 leading-normal">
            Spring Boot 3 + MySQL 8 + Google OAuth Auth.
          </p>
        </div>
      </aside>
    </>
  );
}
