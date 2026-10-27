import { Plus, Menu, X, LogOut, User } from 'lucide-react';
import { StudentProfile } from '../../services/firebaseAuth';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenCreate: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  currentStudent: StudentProfile | null;
  onLogout: () => void;
}

export function Navbar({
  currentTab,
  onSelectTab,
  onOpenCreate,
  mobileMenuOpen,
  onToggleMobileMenu,
  currentStudent,
  onLogout,
}: NavbarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'assignments', label: 'Assignments' },
    { id: 'subjects', label: 'Subjects' },
    { id: 'backend', label: 'Java Backend' },
    { id: 'guide', label: 'Viva Prep' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden text-slate-600 hover:text-slate-900 p-1"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectTab('dashboard');
            }}
            className="text-lg font-bold tracking-tight text-indigo-700 whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black">
              T
            </span>
            <span>Taskora</span>
          </a>
        </div>

        {/* Zone 2: 4-5 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                  isActive
                    ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + student avatar */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCreate}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Assignment</span>
          </button>

          {currentStudent && (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              {currentStudent.photoURL ? (
                <img
                  src={currentStudent.photoURL}
                  alt={currentStudent.displayName}
                  className="w-7 h-7 rounded-full border border-slate-200 object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-200">
                  {currentStudent.displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-left text-xs max-w-[110px] truncate">
                <div className="font-semibold text-slate-800 truncate leading-tight">
                  {currentStudent.displayName}
                </div>
                <div className="text-3xs text-slate-400 truncate">
                  {currentStudent.rollNumber || 'Google User'}
                </div>
              </div>
              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
