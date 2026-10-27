import { Assignment, AssignmentFormData, Subject } from '../types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Initial starter data used strictly when user explicitly enables Demo Mode
const DEMO_SUBJECTS: Subject[] = [
  { id: 1, name: 'Database Management Systems' },
  { id: 2, name: 'Computer Networks' },
  { id: 3, name: 'Operating Systems' },
  { id: 4, name: 'Software Engineering' },
  { id: 5, name: 'Web Technologies' },
  { id: 6, name: 'Advanced Java Programming' },
  { id: 7, name: 'Cellular Network' },
  { id: 8, name: 'Microcontroller' },
  { id: 9, name: 'Machine Learning' },
  { id: 10, name: 'VLSI' },
  { id: 11, name: 'IPR' },
];

const now = new Date();
const addDays = (days: number, hours = 17) => {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  d.setHours(hours, 0, 0, 0);
  return d.toISOString().slice(0, 16);
};

const DEMO_ASSIGNMENTS: Assignment[] = [
  {
    id: 1,
    title: 'ER Diagram & Relational Schema Design',
    description: 'Design comprehensive Entity-Relationship diagrams for an e-commerce platform and normalize tables up to 3NF/BCNF.',
    subjectId: 1,
    subjectName: 'Database Management Systems',
    dueDate: addDays(2, 23),
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 2,
    title: 'Socket Programming in Java (TCP/UDP Client-Server)',
    description: 'Implement a multi-threaded chat server and client in Java demonstrating socket communication and packet transmission.',
    subjectId: 2,
    subjectName: 'Computer Networks',
    dueDate: addDays(4, 18),
    priority: 'MEDIUM',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 3,
    title: 'CPU Scheduling Algorithms Simulation',
    description: 'Write simulations for FCFS, SJF, and Round Robin (quantum=2ms). Compute average waiting time and turnaround time.',
    subjectId: 3,
    subjectName: 'Operating Systems',
    dueDate: addDays(-1, 14), // Overdue
    priority: 'HIGH',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 4,
    title: 'SRS Document & UML Use Case Diagrams',
    description: 'Prepare Software Requirements Specification (IEEE 830 standard) and draw sequence diagrams in StarUML.',
    subjectId: 4,
    subjectName: 'Software Engineering',
    dueDate: addDays(7, 20),
    priority: 'LOW',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 5,
    title: 'Responsive Dashboard with Tailwind CSS',
    description: 'Construct a responsive student dashboard utilizing flexbox, grid, and dark mode theme switching.',
    subjectId: 5,
    subjectName: 'Web Technologies',
    dueDate: addDays(1, 16),
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 6,
    title: 'JDBC Connection Pooling & Spring Data JPA Demo',
    description: 'Develop a high-throughput Java application integrating HikariCP connection pooling, transactions, and custom JPA queries.',
    subjectId: 6,
    subjectName: 'Advanced Java Programming',
    dueDate: addDays(3, 15),
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 7,
    title: 'Cellular Handoff & 5G Beamforming Protocol Analysis',
    description: 'Compare hard and soft handoff mechanisms in 4G LTE/5G NR cells. Calculate carrier-to-interference ratio (C/I).',
    subjectId: 7,
    subjectName: 'Cellular Network',
    dueDate: addDays(5, 12),
    priority: 'MEDIUM',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 8,
    title: '8051 / ARM Timer Interrupts & Stepper Motor Driver',
    description: 'Write embedded C code to generate 1kHz PWM pulses using Timer 0 to control 4-phase stepper motor speed and direction.',
    subjectId: 8,
    subjectName: 'Microcontroller',
    dueDate: addDays(2, 19),
    priority: 'HIGH',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 9,
    title: 'Gradient Descent & Decision Trees Classification',
    description: 'Train logistic regression and random forest models in Python. Plot ROC-AUC curves and compute confusion matrix metrics.',
    subjectId: 9,
    subjectName: 'Machine Learning',
    dueDate: addDays(6, 23),
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 10,
    title: 'CMOS Inverter Stick Diagram & SPICE Transient Analysis',
    description: 'Design physical layout of CMOS inverter in Cadence/Microwind adhering to lambda design rules. Calculate propagation delay tpHL and tpLH.',
    subjectId: 10,
    subjectName: 'VLSI',
    dueDate: addDays(8, 17),
    priority: 'MEDIUM',
    status: 'PENDING',
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 11,
    title: 'Patent Prior Art Search & WIPO Case Study',
    description: 'Conduct patent claim analysis on Google Patents and prepare an intellectual property compliance report on open-source licenses.',
    subjectId: 11,
    subjectName: 'IPR',
    dueDate: addDays(10, 18),
    priority: 'LOW',
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 9 * 86400000).toISOString(),
  },
];

// In-memory demo store
let demoAssignments = [...DEMO_ASSIGNMENTS];
let demoSubjects = [...DEMO_SUBJECTS];
let nextAssignmentId = 12;
let nextSubjectId = 12;

// Mode preference stored in sessionStorage
const DEMO_MODE_STORAGE_KEY = 'taskora_demo_mode_active';

export function isDemoModeActive(): boolean {
  return localStorage.getItem(DEMO_MODE_STORAGE_KEY) === 'true';
}

export function setDemoModeActive(active: boolean): void {
  localStorage.setItem(DEMO_MODE_STORAGE_KEY, active ? 'true' : 'false');
}

export interface BackendCheckResult {
  isOnline: boolean;
  message: string;
}

/**
 * Checks if the Java Spring Boot backend is reachable at http://localhost:8080/api/assignments
 */
export async function checkBackendHealth(): Promise<BackendCheckResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${API_BASE_URL}/assignments`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return { isOnline: true, message: `Connected to Spring Boot backend at ${API_BASE_URL}` };
    }
    return {
      isOnline: false,
      message: `Spring Boot responded with HTTP status ${res.status}. Verify database and endpoint configuration.`,
    };
  } catch (error: any) {
    return {
      isOnline: false,
      message: `Unable to reach Spring Boot backend at ${API_BASE_URL}. Ensure the Spring Boot app is running on port 8080.`,
    };
  }
}

/**
 * Subject API Endpoints
 */
export async function fetchSubjects(): Promise<Subject[]> {
  if (isDemoModeActive()) {
    return Promise.resolve([...demoSubjects]);
  }

  const res = await fetch(`${API_BASE_URL}/subjects`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch subjects: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function createSubject(name: string): Promise<Subject> {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error('Subject name cannot be empty');
  }

  if (isDemoModeActive()) {
    const newSubject: Subject = {
      id: nextSubjectId++,
      name: trimmed,
    };
    demoSubjects.push(newSubject);
    return Promise.resolve(newSubject);
  }

  const res = await fetch(`${API_BASE_URL}/subjects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ name: trimmed }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Failed to create subject: HTTP ${res.status}`);
  }

  return res.json();
}

export async function deleteSubject(id: number): Promise<void> {
  if (isDemoModeActive()) {
    demoSubjects = demoSubjects.filter((s) => s.id !== id);
    return Promise.resolve();
  }

  const res = await fetch(`${API_BASE_URL}/subjects/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to delete subject: HTTP ${res.status}`);
  }
}

/**
 * Assignment API Endpoints
 */
export async function fetchAssignments(): Promise<Assignment[]> {
  if (isDemoModeActive()) {
    // Map subject names onto assignments
    return Promise.resolve(
      demoAssignments.map((a) => {
        const sub = demoSubjects.find((s) => s.id === a.subjectId);
        return {
          ...a,
          subjectName: sub ? sub.name : a.subjectName || 'Unknown Subject',
        };
      })
    );
  }

  const res = await fetch(`${API_BASE_URL}/assignments`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch assignments: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function fetchAssignmentById(id: number): Promise<Assignment> {
  if (isDemoModeActive()) {
    const found = demoAssignments.find((a) => a.id === id);
    if (!found) throw new Error(`Assignment with ID ${id} not found`);
    const sub = demoSubjects.find((s) => s.id === found.subjectId);
    return Promise.resolve({
      ...found,
      subjectName: sub ? sub.name : found.subjectName,
    });
  }

  const res = await fetch(`${API_BASE_URL}/assignments/${id}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Assignment not found: HTTP ${res.status}`);
  }

  return res.json();
}

export async function createAssignment(data: AssignmentFormData): Promise<Assignment> {
  if (!data.title.trim()) throw new Error('Assignment title is required');
  if (!data.subjectId) throw new Error('Please select a subject');
  if (!data.dueDate) throw new Error('Due date is required');

  if (isDemoModeActive()) {
    const sub = demoSubjects.find((s) => s.id === Number(data.subjectId));
    const newAssignment: Assignment = {
      id: nextAssignmentId++,
      title: data.title.trim(),
      description: data.description.trim(),
      subjectId: Number(data.subjectId),
      subjectName: sub ? sub.name : 'Unknown Subject',
      dueDate: data.dueDate,
      priority: data.priority,
      status: data.status,
      createdAt: new Date().toISOString(),
    };
    demoAssignments.unshift(newAssignment);
    return Promise.resolve(newAssignment);
  }

  const res = await fetch(`${API_BASE_URL}/assignments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      title: data.title.trim(),
      description: data.description.trim(),
      subjectId: Number(data.subjectId),
      dueDate: data.dueDate,
      priority: data.priority,
      status: data.status,
    }),
  });

  if (!res.ok) {
    const errorMsg = await res.text();
    throw new Error(errorMsg || `Failed to create assignment: HTTP ${res.status}`);
  }

  return res.json();
}

export async function updateAssignment(id: number, data: AssignmentFormData): Promise<Assignment> {
  if (!data.title.trim()) throw new Error('Assignment title is required');
  if (!data.subjectId) throw new Error('Please select a subject');
  if (!data.dueDate) throw new Error('Due date is required');

  if (isDemoModeActive()) {
    const index = demoAssignments.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Assignment not found');
    const sub = demoSubjects.find((s) => s.id === Number(data.subjectId));
    const updated: Assignment = {
      ...demoAssignments[index],
      title: data.title.trim(),
      description: data.description.trim(),
      subjectId: Number(data.subjectId),
      subjectName: sub ? sub.name : 'Unknown Subject',
      dueDate: data.dueDate,
      priority: data.priority,
      status: data.status,
    };
    demoAssignments[index] = updated;
    return Promise.resolve(updated);
  }

  const res = await fetch(`${API_BASE_URL}/assignments/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      title: data.title.trim(),
      description: data.description.trim(),
      subjectId: Number(data.subjectId),
      dueDate: data.dueDate,
      priority: data.priority,
      status: data.status,
    }),
  });

  if (!res.ok) {
    const errorMsg = await res.text();
    throw new Error(errorMsg || `Failed to update assignment: HTTP ${res.status}`);
  }

  return res.json();
}

export async function deleteAssignment(id: number): Promise<void> {
  if (isDemoModeActive()) {
    demoAssignments = demoAssignments.filter((a) => a.id !== id);
    return Promise.resolve();
  }

  const res = await fetch(`${API_BASE_URL}/assignments/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok && res.status !== 204) {
    throw new Error(`Failed to delete assignment: HTTP ${res.status}`);
  }
}

export async function markAssignmentComplete(id: number): Promise<Assignment> {
  if (isDemoModeActive()) {
    const item = demoAssignments.find((a) => a.id === id);
    if (!item) throw new Error('Assignment not found');
    item.status = item.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    return Promise.resolve({ ...item });
  }

  const res = await fetch(`${API_BASE_URL}/assignments/${id}/complete`, {
    method: 'PATCH',
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) {
    throw new Error(`Failed to update assignment status: HTTP ${res.status}`);
  }

  return res.json();
}
