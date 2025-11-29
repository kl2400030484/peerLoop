
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { authService } from './services/authService';

// Dashboard Components
import { TeacherDashboard } from './components/TeacherDashboard';
import { TeacherAssignments } from './components/TeacherAssignments';
import { TeacherProfile } from './components/TeacherProfile';
import { TeacherStatistics } from './components/TeacherStatistics';
import { StudentWorkspace } from './components/StudentWorkspace';
import { StudentReviews } from './components/StudentReviews';
import { StudentProfile } from './components/StudentProfile';
import { ReviewInterface } from './components/ReviewInterface';
import { CollaborationHub } from './components/CollaborationHub';

import { User, UserRole, Assignment, Submission, PeerReview, ChatMessage, Team } from './types';
import { Loader2 } from 'lucide-react';

// --- MOCK DATA SEEDING ---
const mockUsers: User[] = [
  { 
    id: 'u1', 
    name: 'Dr. Sarah Smith', 
    email: 'sarah.smith@univ.edu',
    role: UserRole.TEACHER, 
    avatar: 'https://picsum.photos/id/20/200/200',
    experience: 12,
    expertise: ['Modern History', 'European Politics', 'Research Methodology'],
    sectionsHandled: 4
  },
  { 
    id: 'u2', 
    name: 'Alice Johnson', 
    email: 'alice.j@student.edu',
    role: UserRole.STUDENT, 
    avatar: 'https://picsum.photos/id/32/200/200',
    branch: 'Computer Science',
    year: '3',
    mentor: 'Prof. Alan Turing'
  },
  { 
    id: 'u3', 
    name: 'Bob Williams', 
    email: 'bob.w@student.edu',
    role: UserRole.STUDENT, 
    avatar: 'https://picsum.photos/id/64/200/200',
    branch: 'History',
    year: '2',
    mentor: 'Dr. Indiana Jones'
  },
  { 
    id: 'u4', 
    name: 'Charlie Brown', 
    email: 'charlie@student.edu',
    role: UserRole.STUDENT, 
    avatar: 'https://picsum.photos/id/100/200/200',
    branch: 'History',
    year: '2',
    mentor: 'Dr. Sarah Smith'
  },
];

const mockTeams: Team[] = [
  {
    id: 't1',
    name: 'History Alpha',
    section: 'A',
    memberIds: ['u3', 'u4'],
    avatar: 'HA'
  },
  {
    id: 't2',
    name: 'CS Beta',
    section: 'B',
    memberIds: ['u2'],
    avatar: 'CB'
  },
  {
    id: 't3',
    name: 'Research Gamma',
    section: 'A',
    memberIds: [],
    avatar: 'RG'
  }
];

const initialAssignments: Assignment[] = [
  {
    id: 'a1',
    title: 'The Industrial Revolution Essay',
    description: 'Write a 1000-word essay analyzing the socio-economic impacts of the Industrial Revolution in 19th-century Britain.',
    dueDate: '2023-11-15',
    rubric: [
      { id: 'r1', title: 'Thesis Statement', description: 'Clear and arguable thesis statement.', maxPoints: 10 },
      { id: 'r2', title: 'Historical Accuracy', description: 'Accurate use of historical facts and dates.', maxPoints: 20 },
      { id: 'r3', title: 'Analysis', description: 'Depth of analysis regarding socio-economic impacts.', maxPoints: 20 }
    ],
    assignedTo: ['u2', 'u3'],
    assignedTeams: ['t1', 't2']
  },
  {
    id: 'a2',
    title: 'Modern Art Critique',
    description: 'Analyze a piece of modern art from the provided gallery list.',
    dueDate: '2023-11-20',
    rubric: [
       { id: 'r1', title: 'Observation', description: 'Detailed observation of visual elements.', maxPoints: 15 },
       { id: 'r2', title: 'Interpretation', description: 'Creative interpretation of meaning.', maxPoints: 15 }
    ],
    assignedTo: ['u2'],
    assignedTeams: ['t2']
  }
];

const initialSubmissions: Submission[] = [
  {
    id: 's1',
    assignmentId: 'a1',
    studentId: 'u3', // Bob's submission
    content: "The Industrial Revolution, spanning from the late 18th to the early 19th century, marked a major turning point in history...",
    submittedAt: '2023-11-10T10:00:00Z',
    status: 'SUBMITTED',
    files: ['essay_draft_v1.pdf']
  }
];

const initialReviews: PeerReview[] = [
  {
    id: 'pr1',
    assignmentId: 'a1',
    submissionId: 's1',
    reviewerId: 'u2', // Alice reviews Bob
    authorId: 'u3',
    feedback: "Good start on the intro. You cover the main points well.",
    scores: { 'r1': 8 },
    status: 'DRAFT'
  }
];

// --- APP COMPONENT ---

const App: React.FC = () => {
  // --- GLOBAL STATE ---
  // Controls top-level routing (landing, auth, app)
  const [currentRoute, setCurrentRoute] = useState('landing');
  
  // Controls internal dashboard view
  const [dashboardView, setDashboardView] = useState('dashboard');

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Data State
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
  const [reviews, setReviews] = useState<PeerReview[]>(initialReviews);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  
  // Modal States
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = () => {
    const session = authService.getCurrentSession();
    if (session) {
      // If we have a role, auto-login to that role
      if (session.role) {
        initializeUserSession(session.role, session.email, session.name);
      } else {
        // Fallback for legacy users without role (should likely not happen with new flow)
        setCurrentRoute('role-select');
      }
    } else {
      setCurrentRoute('landing');
    }
    setIsLoading(false);
  };

  const initializeUserSession = (role: UserRole, email: string, name?: string) => {
    // 1. Try to find a mock profile to seed initial data for demo purposes
    const mockProfile = mockUsers.find(u => u.role === role && u.email === email);
    
    // 2. Fetch extended profile data from auth service storage if it exists (for edits)
    const storedProfile = authService.getUserProfile(email);
    
    // 3. Construct the user object
    let finalUser: User;

    if (mockProfile) {
       finalUser = {
         ...mockProfile,
         // Override mock with stored data if available
         ...(storedProfile || {}),
         email: email,
         role: role,
         name: storedProfile?.name || mockProfile.name || name || email.split('@')[0]
       };
    } else {
      // New user or no mock match
      finalUser = {
        id: `user-${Date.now()}`,
        name: storedProfile?.name || name || email.split('@')[0],
        email: email,
        role: role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(storedProfile?.name || name || email)}&background=random`,
        // Default empty fields that can be edited
        ...(role === UserRole.TEACHER ? {
          experience: 0,
          expertise: [],
          sectionsHandled: 0
        } : {
          branch: '',
          year: '',
          mentor: ''
        }),
        // Merge any stored profile updates
        ...(storedProfile || {})
      };
    }
      
    setCurrentUser(finalUser);
    // Set default view based on role
    setDashboardView(role === UserRole.TEACHER ? 'dashboard' : 'workspace');
    setCurrentRoute('app');
  };

  // --- NAVIGATION HANDLERS ---
  const handleNavigate = (page: string) => {
    setCurrentRoute(page);
  };

  const handleLoginSuccess = () => {
    // Re-check session to get the newly stored role and user
    checkSession();
  };

  // Deprecated for normal flow, kept as fallback
  const handleRoleSelection = (role: UserRole) => {
    const session = authService.getCurrentSession();
    if (session) {
      initializeUserSession(role, session.email, session.name);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentRoute('landing');
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    
    // Update local state immediately for UI responsiveness
    setCurrentUser({ ...currentUser, ...updates });
    
    // Persist to storage
    authService.updateProfile(currentUser.email, updates);
    
    // Show feedback (simple alert for now)
    alert("Profile updated successfully!");
  };

  // --- DASHBOARD ACTIONS ---
  const handleCreateAssignment = (newAssignment: Assignment) => {
    setAssignments(prev => [newAssignment, ...prev]);
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const handleUploadWork = (assignmentId: string, files: FileList) => {
    if (!currentUser) return;
    
    const existingSub = submissions.find(s => s.assignmentId === assignmentId && s.studentId === currentUser.id);
    if (existingSub) {
      setSubmissions(prev => prev.map(s => 
        s.id === existingSub.id 
          ? { ...s, status: 'IN_PROGRESS', files: [...s.files, files[0].name] } 
          : s
      ));
    } else {
      const newSub: Submission = {
        id: `sub-${Date.now()}`,
        assignmentId,
        studentId: currentUser.id,
        content: "Draft content...", 
        submittedAt: null,
        status: 'IN_PROGRESS',
        files: [files[0].name]
      };
      setSubmissions(prev => [...prev, newSub]);
    }
    alert(`File "${files[0].name}" uploaded. Status: In Progress`);
  };

  const handleSubmitForReview = (assignmentId: string) => {
    if (!currentUser) return;
    setSubmissions(prev => prev.map(s => 
       s.assignmentId === assignmentId && s.studentId === currentUser.id
       ? { ...s, status: 'SUBMITTED', submittedAt: new Date().toISOString() }
       : s
    ));
    alert("Assignment submitted! It is now available for peer review.");
  };

  const handleSubmitReview = (updatedReview: PeerReview) => {
    setReviews(prev => prev.map(r => r.id === updatedReview.id ? updatedReview : r));
    const subId = updatedReview.submissionId;
    setSubmissions(prev => prev.map(s => 
      s.id === subId ? { ...s, status: 'REVIEWED' } : s
    ));
    setActiveReviewId(null);
  };

  const handleSendMessage = (text: string) => {
    if (!currentUser) return;
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      assignmentId: 'group-1', 
      text,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // --- RENDER HELPERS ---
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    );
  }

  // --- ROUTING LOGIC ---

  // 1. Landing Page
  if (currentRoute === 'landing') {
    return <LandingPage onNavigate={handleNavigate} />;
  }

  // 2. Auth Pages
  if (currentRoute === 'login') {
    return <LoginPage onNavigate={handleNavigate} onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentRoute === 'signup') {
    return <SignupPage onNavigate={handleNavigate} />;
  }

  // 3. Role Selection (Legacy Fallback)
  if (currentRoute === 'role-select') {
    if (!authService.isAuthenticated()) {
       handleNavigate('login');
       return null;
    }
    return <RoleSelectionPage onSelectRole={handleRoleSelection} onNavigate={handleNavigate} />;
  }

  // 4. Main App Dashboard (Protected)
  if (currentRoute === 'app' && currentUser) {
    const renderDashboardContent = () => {
      // Route Protection Guard
      if (currentUser.role === UserRole.TEACHER) {
        // Teacher Logic
        switch (dashboardView) {
          case 'dashboard':
            return <TeacherDashboard teams={teams} assignments={assignments} submissions={submissions} reviews={reviews} />;
          case 'assignments':
            return <TeacherAssignments assignments={assignments} teams={teams} submissions={submissions} onCreateAssignment={handleCreateAssignment} onDeleteAssignment={handleDeleteAssignment} />;
          case 'statistics':
            return <TeacherStatistics teams={teams} assignments={assignments} submissions={submissions} />;
          case 'profile':
            return <TeacherProfile user={currentUser} teams={teams} onUpdateProfile={handleUpdateProfile} />;
          default:
            return <TeacherDashboard teams={teams} assignments={assignments} submissions={submissions} reviews={reviews} />;
        }
      } else {
        // Student Logic
        switch (dashboardView) {
          case 'workspace':
            return <StudentWorkspace assignments={assignments} submissions={submissions.filter(s => s.studentId === currentUser.id)} onUpload={handleUploadWork} onSubmit={handleSubmitForReview} />;
          case 'reviews':
            return <StudentReviews assignments={assignments} pendingReviews={reviews.filter(r => r.reviewerId === currentUser.id)} onStartReview={(id) => setActiveReviewId(id)} />;
          case 'profile':
            return <StudentProfile user={currentUser} completedTasks={submissions.filter(s => s.studentId === currentUser.id && (s.status === 'COMPLETED' || s.status === 'REVIEWED')).length} totalTasks={assignments.length} reviewsCompleted={reviews.filter(r => r.reviewerId === currentUser.id && r.status === 'SUBMITTED').length} onUpdateProfile={handleUpdateProfile} />;
          case 'collaborate':
            return <CollaborationHub currentUser={currentUser} messages={messages} onSendMessage={handleSendMessage} />;
          default:
            return <StudentWorkspace assignments={assignments} submissions={submissions.filter(s => s.studentId === currentUser.id)} onUpload={handleUploadWork} onSubmit={handleSubmitForReview} />;
        }
      }
    };

    const renderReviewModal = () => {
      if (!activeReviewId) return null;
      const review = reviews.find(r => r.id === activeReviewId);
      if (!review) return null;
      const assignment = assignments.find(a => a.id === review.assignmentId);
      const submission = submissions.find(s => s.id === review.submissionId);
      if (!assignment || !submission) return null;

      return (
        <ReviewInterface 
          review={review}
          assignment={assignment}
          submission={submission}
          onClose={() => setActiveReviewId(null)}
          onSubmitReview={handleSubmitReview}
        />
      );
    };

    return (
      <Layout 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        currentView={dashboardView}
        onNavigate={setDashboardView}
      >
        {renderDashboardContent()}
        {renderReviewModal()}
      </Layout>
    );
  }

  // Fallback
  return <LandingPage onNavigate={handleNavigate} />;
};

export default App;
