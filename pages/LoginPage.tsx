import React, { useState } from 'react';
import { PublicNavbar } from '../components/PublicNavbar';
import { authService } from '../services/authService';
import { LogIn, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    // Simulate network
    setTimeout(async () => {
      const isValid = await authService.login(email, password);
      setIsLoading(false);

      if (isValid) {
        onLoginSuccess();
      } else {
        setError('Invalid credentials. Please try again.');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicNavbar onNavigate={onNavigate} />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden flex flex-col">
          <div className="p-8 bg-slate-900 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
            <p className="text-slate-400 text-sm">Sign in to continue your progress.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

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
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <button type="button" className="text-xs text-indigo-600 hover:underline">Forgot password?</button>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : (
                <>Login <LogIn size={18} /></>
              )}
            </button>
            
            <p className="text-center text-sm text-slate-500">
              Don't have an account? <button type="button" onClick={() => onNavigate('signup')} className="text-indigo-600 font-bold hover:underline">Sign up</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};