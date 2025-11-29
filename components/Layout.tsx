import React from 'react';
import { User, UserRole } from '../types';
import { 
  BookOpen, 
  Users, 
  LogOut, 
  LayoutDashboard, 
  PenTool,
  MessageSquare,
  UserCircle,
  Briefcase,
  BarChart2
} from 'lucide-react';

interface LayoutProps {
  currentUser: User;
  onLogout: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ 
  currentUser, 
  onLogout, 
  currentView, 
  onNavigate,
  children 
}) => {
  const isTeacher = currentUser.role === UserRole.TEACHER;

  const teacherLinks = [
    { id: 'dashboard', label: 'Team Dashboard', icon: LayoutDashboard },
    { id: 'assignments', label: 'Assignments', icon: BookOpen },
    { id: 'statistics', label: 'Statistics', icon: BarChart2 },
    { id: 'profile', label: 'My Profile', icon: UserCircle },
  ];

  const studentLinks = [
    { id: 'workspace', label: 'My Workspace', icon: Briefcase },
    { id: 'reviews', label: 'Peer Reviews', icon: PenTool },
    { id: 'collaborate', label: 'Team Chat', icon: MessageSquare },
    { id: 'profile', label: 'My Profile', icon: UserCircle },
  ];

  const links = isTeacher ? teacherLinks : studentLinks;

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-950 text-white flex flex-col fixed h-full z-10 border-r border-indigo-900 shadow-xl">
        <div className="p-6 flex items-center gap-3 bg-indigo-900/50">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-inner">P</div>
          <h1 className="text-xl font-bold tracking-tight">PeerLoop</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 translate-x-1' 
                    : 'text-indigo-300 hover:bg-indigo-900/50 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-indigo-400 group-hover:text-white transition-colors'} />
                <span className="font-medium">{link.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-indigo-900 bg-indigo-950">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className="w-10 h-10 rounded-full border-2 border-indigo-500 shadow-sm"
            />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-white">{currentUser.name}</p>
              <p className="text-xs text-indigo-400 uppercase tracking-wider">{currentUser.role}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-indigo-300 hover:text-white hover:bg-indigo-900/50 rounded-md transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-slate-50">
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};