
export enum UserRole {
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT'
}

export type SubmissionStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'REVIEWED' | 'COMPLETED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  // Student specific fields
  branch?: string;
  year?: string;
  mentor?: string;
  badges?: string[];
  // Teacher specific fields
  experience?: number; // years
  expertise?: string[];
  sectionsHandled?: number;
}

export interface Team {
  id: string;
  name: string;
  section: string;
  memberIds: string[];
  avatar: string;
}

export interface RubricCriteria {
  id: string;
  title: string;
  description: string;
  maxPoints: number;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string; // ISO date string
  rubric: RubricCriteria[];
  assignedTo: string[]; // User IDs (students)
  assignedTeams?: string[]; // Team IDs
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string; // Text content
  submittedAt: string | null;
  status: SubmissionStatus;
  files: string[]; // File names
}

export interface PeerReview {
  id: string;
  submissionId: string;
  reviewerId: string; // Student who is reviewing
  authorId: string; // Student who wrote the submission
  assignmentId: string;
  feedback: string;
  scores: Record<string, number>; // criteriaId -> score
  isConstructive?: boolean;
  aiAnalysis?: string; // AI feedback on the review itself
  status: 'DRAFT' | 'SUBMITTED';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  assignmentId: string; // Chat grouped by assignment
  text: string;
  timestamp: string;
}

export interface Feedback {
  id: string;
  userName: string;
  role?: string;
  message: string;
  timestamp: string;
}
