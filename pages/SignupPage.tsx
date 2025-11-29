
import React, { useState } from 'react';
import { PublicNavbar } from '../components/PublicNavbar';
import { authService } from '../services/authService';
import { UserPlus, AlertCircle, CheckCircle, BookOpen, UserCircle } from 'lucide-react';
import { UserRole } from '../types';

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!name || !email || !password || !confirmPassword || !role) {
      setError('All fields are required, including Full Name and Account Type.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    // Simulate network delay
    setTimeout(async () => {
      const result = await authService.signup(name, email, password, role);
      setIsLoading(false);

      if (result) {
        setSuccess(true);
        // Redirect after delay
        setTimeout(() => {
          onNavigate('landing');
        }, 2000);
      } else {
        setError('Email already registered or service unavailable.');
      }
    }, 1000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <PublicNavbar onNavigate={onNavigate} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h2>
            <p className="text-slate-500 mb-6">Welcome to PeerLoop, {name}. Redirecting you to home...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicNavbar onNavigate={onNavigate} />
      
      <div className="flex-1 flex items-center justify-center p-4 my-8">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden flex flex-col">
          <div className="p-8 bg-indigo-600 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">Create Account</h1>
            <p className="text-indigo-100 text-sm">Join thousands of students improving together.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="you@university.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole(UserRole.TEACHER)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${role === UserRole.TEACHER ? 'bg-indigo-50 border-indigo-500 text-indigo-700 ring-1 ring-indigo-500' : 'border-slate-200 text-slate-500 hover:border-indigo-200 hover:bg-slate-50'}`}
                >
                  <BookOpen size={20} />
                  <span className="text-sm font-bold">Teacher</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole(UserRole.STUDENT)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${role === UserRole.STUDENT ? 'bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500' : 'border-slate-200 text-slate-500 hover:border-purple-200 hover:bg-slate-50'}`}
                >
                  <UserCircle size={20} />
                  <span className="text-sm font-bold">Student</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Creating Account...' : (
                <>Create Account <UserPlus size={18} /></>
              )}
            </button>
            
            <p className="text-center text-sm text-slate-500">
              Already have an account? <button type="button" onClick={() => onNavigate('login')} className="text-indigo-600 font-bold hover:underline">Log in</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
