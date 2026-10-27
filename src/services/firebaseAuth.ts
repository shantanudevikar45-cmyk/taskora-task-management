import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance safely (singleton pattern)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');

export interface StudentProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  rollNumber?: string;
  department?: string;
  authProvider: 'google' | 'student-id';
}

// In-memory token cache (never stored in localStorage or sessionStorage per security guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Custom student login state (for demo / lab viva evaluation where Google popup may be restricted)
const STUDENT_DEMO_KEY = 'taskora_student_local_session';

export function getCachedStudentSession(): StudentProfile | null {
  try {
    const raw = sessionStorage.getItem(STUDENT_DEMO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCachedStudentSession(profile: StudentProfile | null): void {
  if (profile) {
    sessionStorage.setItem(STUDENT_DEMO_KEY, JSON.stringify(profile));
  } else {
    sessionStorage.removeItem(STUDENT_DEMO_KEY);
  }
}

/**
 * Initialize authentication listener
 */
export const initAuth = (
  onAuthSuccess: (student: StudentProfile, token: string | null) => void,
  onAuthFailure: () => void
) => {
  // Check if a local student session exists first
  const localStudent = getCachedStudentSession();
  if (localStudent) {
    onAuthSuccess(localStudent, cachedAccessToken);
    return () => {};
  }

  return onAuthStateChanged(auth, async (firebaseUser: User | null) => {
    if (firebaseUser) {
      const student: StudentProfile = {
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName || 'Student',
        email: firebaseUser.email || '',
        photoURL: firebaseUser.photoURL || undefined,
        department: 'Computer Science & Engineering',
        authProvider: 'google',
      };
      setCachedStudentSession(student);
      onAuthSuccess(student, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      const demo = getCachedStudentSession();
      if (!demo) {
        onAuthFailure();
      }
    }
  });
};

/**
 * Sign in using Google OAuth with popup
 */
export const signInWithGoogle = async (): Promise<{ student: StudentProfile; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);

    cachedAccessToken = credential?.accessToken || null;

    const student: StudentProfile = {
      uid: result.user.uid,
      displayName: result.user.displayName || 'Student',
      email: result.user.email || '',
      photoURL: result.user.photoURL || undefined,
      department: 'Computer Science & Engineering',
      authProvider: 'google',
    };

    setCachedStudentSession(student);
    return { student, accessToken: cachedAccessToken || '' };
  } catch (error: any) {
    console.error('Google Sign-in failed:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Direct Student ID Login for college viva demo
 */
export const loginWithStudentID = (
  name: string,
  rollNumber: string,
  department: string = 'Computer Science & Engineering'
): StudentProfile => {
  const student: StudentProfile = {
    uid: `student-${Date.now()}`,
    displayName: name.trim() || 'Alex Morgan',
    email: `${(rollNumber || 'cs2024').toLowerCase().replace(/\s+/g, '')}@college.edu`,
    rollNumber: rollNumber.trim() || 'CS-2024-042',
    department: department.trim(),
    authProvider: 'student-id',
  };

  setCachedStudentSession(student);
  return student;
};

/**
 * Sign out user
 */
export const logoutStudent = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('Firebase signout error:', e);
  }
  cachedAccessToken = null;
  setCachedStudentSession(null);
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};
