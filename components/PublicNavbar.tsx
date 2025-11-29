import React from 'react';

interface PublicNavbarProps {
  onNavigate: (page: string) => void;
}

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ onNavigate }) => {
  const scrollToSection = (id: string) => {
    // If we are not on the landing page (e.g. login page), navigate there first
    // For this simple router, we'll just navigate to 'landing' and let the page handle scroll
    onNavigate('landing');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate('landing')}
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg shadow-sm">P</div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">PeerLoop</span>
          </div>

          {/* Links - Desktop */}
          <div className="hidden md:flex space-x-8 items-center">
            <button onClick={() => onNavigate('landing')} className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Home</button>
            <button onClick={() => scrollToSection('about')} className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">About</button>
            <button onClick={() => scrollToSection('feedback')} className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Feedback</button>
            <button onClick={() => scrollToSection('plans')} className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Plans</button>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onNavigate('login')}
              className="hidden md:block text-slate-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Login
            </button>
            <button 
              onClick={() => onNavigate('signup')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium shadow-sm transition-all hover:shadow-md"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};