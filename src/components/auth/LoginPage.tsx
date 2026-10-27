import { useState } from 'react';
import { signInWithGoogle, loginWithStudentID, StudentProfile } from '../../services/firebaseAuth';
import {
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (student: StudentProfile) => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Roll number student login form
  const [studentName, setStudentName] = useState('Alex Morgan');
  const [rollNumber, setRollNumber] = useState('CS-2024-042');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [loginTab, setLoginTab] = useState<'google' | 'studentId'>('google');

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      setErrorMessage(null);
      const { student } = await signInWithGoogle();
      onLoginSuccess(student);
    } catch (err: any) {
      console.error('Google login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMessage('Sign-in cancelled. You can retry or use the Student ID login below.');
      } else if (err.code === 'auth/popup-blocked') {
        setErrorMessage('Browser popup was blocked. Please allow popups or use Student ID login.');
      } else {
        setErrorMessage(err.message || 'Google authentication failed. You can sign in using Student ID.');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleStudentIdLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !rollNumber.trim()) {
      setErrorMessage('Please provide both student name and roll number.');
      return;
    }
    const student = loginWithStudentID(studentName, rollNumber, department);
    onLoginSuccess(student);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Background Decorative Gradient */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white shadow-md mb-3">
          <span className="font-bold text-xl">T</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Taskora Student Portal
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Smart Assignment Deadline Manager & Academic Tracker
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-sm border border-slate-200 rounded-2xl space-y-6">
          {/* Login Mode Segmented Control */}
          <div className="flex p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => {
                setLoginTab('google');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-md transition-colors text-center ${
                loginTab === 'google'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Google Sign-In
            </button>
            <button
              type="button"
              onClick={() => {
                setLoginTab('studentId');
                setErrorMessage(null);
              }}
              className={`flex-1 py-1.5 rounded-md transition-colors text-center ${
                loginTab === 'studentId'
                  ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              College Roll No Login
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {loginTab === 'google' ? (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed text-center">
                Sign in with your university or personal Google account to track coursework, deadlines, and syllabus subjects.
              </p>

              {/* Official Google Material Style Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs shadow-2xs transition-colors hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
              >
                {isGoogleLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg
                    className="w-4 h-4 shrink-0"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                )}
                <span>{isGoogleLoading ? 'Connecting to Google...' : 'Sign in with Google'}</span>
              </button>

              <div className="pt-2 text-center">
                <span className="text-3xs text-slate-400">
                  Secured via Google Identity Services & Firebase Authentication
                </span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleStudentIdLogin} className="space-y-3.5">
              <div>
                <label className="block text-3xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Student Full Name
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600 bg-white"
                />
              </div>

              <div>
                <label className="block text-3xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  College Roll Number / ID
                </label>
                <input
                  type="text"
                  required
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="e.g. CS-2024-042"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600 bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-3xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-600 bg-white"
                >
                  <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Data Science & AI">Data Science & AI</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Enter Student Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Quick Features List */}
          <div className="pt-4 border-t border-slate-100 space-y-2 text-3xs text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Full CRUD assignment and deadline synchronization</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Connected to Java Spring Boot REST API & MySQL 8</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Automatic overdue alerts & priority categorizations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
