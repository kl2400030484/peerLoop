
import React, { useState, useEffect } from 'react';
import { PublicNavbar } from '../components/PublicNavbar';
import { feedbackService } from '../services/feedbackService';
import { authService } from '../services/authService';
import { Feedback } from '../types';
import { ArrowRight, CheckCircle, Users, Zap, Shield, Star, MessageSquare, Send } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [newFeedback, setNewFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFeedbacks(feedbackService.getFeedbacks());
  }, []);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeedback.trim()) return;

    setSubmitting(true);
    // Simulate slight network delay
    setTimeout(() => {
      const session = authService.getCurrentSession();
      const userName = session ? session.name : 'Guest';
      const userRole = session ? session.role : undefined;

      const added = feedbackService.addFeedback(userName, newFeedback, userRole);
      setFeedbacks(prev => [added, ...prev]);
      setNewFeedback('');
      setSubmitting(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <PublicNavbar onNavigate={onNavigate} />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap size={12} /> Revolutionizing Student Collaboration
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Elevate Learning with <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">Peer Reviews</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            A collaborative platform where students grow through constructive feedback and teachers monitor progress in real-time.
          </p>
          <div className="flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <button 
              onClick={() => onNavigate('signup')}
              className="px-8 py-3.5 bg-indigo-600 text-white text-lg font-bold rounded-full hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => onNavigate('login')}
              className="px-8 py-3.5 bg-white text-slate-700 border border-slate-200 text-lg font-bold rounded-full hover:bg-slate-50 transition-all shadow-sm"
            >
              Login
            </button>
          </div>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-32 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">How It Helps Learners</h2>
            <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
              PeerLoop isn't just a submission portal. It's an ecosystem designed to foster critical thinking and collaborative growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Collaboration First</h3>
              <p className="text-slate-600 leading-relaxed">
                Work in teams, discuss ideas in real-time, and build projects together. Learning is better when it's shared.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                <Star size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Quality Feedback</h3>
              <p className="text-slate-600 leading-relaxed">
                Receive structured reviews from peers. Learn to give and take constructive criticism to refine your work.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                <Shield size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">AI Assisted</h3>
              <p className="text-slate-600 leading-relaxed">
                Our AI analyzes feedback tone to ensure it's helpful and constructive, creating a safe learning environment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback / Testimonials */}
      <section id="feedback" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What People Say</h2>
              <p className="text-indigo-200 text-lg mb-8">
                See what students and teachers are sharing about their experience with PeerLoop.
              </p>
              
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                 {feedbacks.length === 0 ? (
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-center">
                       <p className="text-slate-400">No feedback yet. Be the first to share!</p>
                    </div>
                 ) : (
                    feedbacks.map(fb => (
                       <div key={fb.id} className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors animate-in slide-in-from-left-2 fade-in">
                          <p className="text-slate-200 italic mb-4">"{fb.message}"</p>
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                                {fb.userName.charAt(0)}
                             </div>
                             <div>
                                <p className="font-bold text-sm text-white">{fb.userName}</p>
                                <p className="text-xs text-indigo-300">
                                   {fb.role ? fb.role : 'Guest'} • {new Date(fb.timestamp).toLocaleDateString()}
                                </p>
                             </div>
                          </div>
                       </div>
                    ))
                 )}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/10 sticky top-24">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                 <MessageSquare size={20} className="text-indigo-400" />
                 Share Your Feedback
              </h3>
              <form onSubmit={handleSubmitFeedback}>
                 <textarea 
                   value={newFeedback}
                   onChange={e => setNewFeedback(e.target.value)}
                   placeholder="How has PeerLoop helped you? Share your thoughts..." 
                   className="w-full h-32 bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 transition-all"
                 />
                 <button 
                   type="submit"
                   disabled={submitting || !newFeedback.trim()}
                   className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                   {submitting ? 'Submitting...' : <>Submit Feedback <Send size={16} /></>}
                 </button>
              </form>
              <p className="text-xs text-indigo-300/60 mt-4 text-center">
                 Your feedback helps us improve the platform for everyone.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Choose Your Plan</h2>
            <p className="mt-4 text-lg text-slate-500">Flexible pricing for institutions of all sizes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all relative">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Starter</h3>
              <div className="text-4xl font-extrabold text-slate-900 mb-6">$0<span className="text-lg font-medium text-slate-500">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-600"><CheckCircle size={18} className="text-green-500" /> Up to 20 Students</li>
                <li className="flex items-center gap-3 text-slate-600"><CheckCircle size={18} className="text-green-500" /> Basic Peer Reviews</li>
                <li className="flex items-center gap-3 text-slate-600"><CheckCircle size={18} className="text-green-500" /> 1 GB Storage</li>
              </ul>
              <button onClick={() => onNavigate('signup')} className="w-full py-3 border-2 border-slate-900 text-slate-900 font-bold rounded-lg hover:bg-slate-900 hover:text-white transition-colors">Select Plan</button>
            </div>

            {/* Standard Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-indigo-600 shadow-xl relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">Most Popular</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Standard</h3>
              <div className="text-4xl font-extrabold text-slate-900 mb-6">$29<span className="text-lg font-medium text-slate-500">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-600"><CheckCircle size={18} className="text-indigo-600" /> Up to 100 Students</li>
                <li className="flex items-center gap-3 text-slate-600"><CheckCircle size={18} className="text-indigo-600" /> AI Feedback Analysis</li>
                <li className="flex items-center gap-3 text-slate-600"><CheckCircle size={18} className="text-indigo-600" /> 50 GB Storage</li>
                <li className="flex items-center gap-3 text-slate-600"><CheckCircle size={18} className="text-indigo-600" /> Priority Support</li>
              </ul>
              <button onClick={() => onNavigate('signup')} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">Select Plan</button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all relative">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Institution</h3>
              <div className="text-4xl font-extrabold text-slate-900 mb-6">Custom</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-600"><CheckCircle size={18} className="text-green-500" /> Unlimited Students</li>
                <li className="flex items-center gap-3 text-slate-600"><CheckCircle size={18} className="text-green-500" /> Advanced Analytics</li>
                <li className="flex items-center gap-3 text-slate-600"><CheckCircle size={18} className="text-green-500" /> SSO Integration</li>
                <li className="flex items-center gap-3 text-slate-600"><CheckCircle size={18} className="text-green-500" /> Dedicated Manager</li>
              </ul>
              <button className="w-full py-3 border-2 border-slate-200 text-slate-500 font-bold rounded-lg hover:border-slate-900 hover:text-slate-900 transition-colors">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
           <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg">P</div>
            <span className="font-bold text-xl text-white tracking-tight">PeerLoop</span>
          </div>
          <div className="text-sm">
            © {new Date().getFullYear()} PeerLoop Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
