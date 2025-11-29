import React from 'react';
import { UserRole } from '../types';
import { UserCircle, BookOpen } from 'lucide-react';
import { PublicNavbar } from '../components/PublicNavbar';

interface RoleSelectionPageProps {
  onSelectRole: (role: UserRole) => void;
  onNavigate: (page: string) => void;
}

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({ onSelectRole, onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicNavbar onNavigate={onNavigate} />
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Select your role to continue</h1>
          <p className="text-slate-500">Choose how you want to access PeerLoop today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl w-full">
          {/* Teacher Card */}
          <button 
            onClick={() => onSelectRole(UserRole.TEACHER)}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all group text-left animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100"
          >
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">Teacher Login</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Access your dashboard to manage teams, create assignments, and monitor student progress analytics.
            </p>
          </button>

          {/* Student Card */}
          <button 
            onClick={() => onSelectRole(UserRole.STUDENT)}
            className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:border-purple-500 hover:shadow-xl hover:-translate-y-1 transition-all group text-left animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200"
          >
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <UserCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-purple-600 transition-colors">Student Login</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Enter your workspace to submit assignments, review peer work, and collaborate with your team.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};