
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Award, Mail, Book, Calendar, User as UserIcon, TrendingUp, Star, Shield, Zap, Edit2, Save, X } from 'lucide-react';

interface StudentProfileProps {
  user: User;
  completedTasks: number;
  totalTasks: number;
  reviewsCompleted: number;
  onUpdateProfile: (updates: Partial<User>) => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ 
  user, 
  completedTasks, 
  totalTasks,
  reviewsCompleted,
  onUpdateProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    branch: user.branch || '',
    year: user.year || '',
    mentor: user.mentor || ''
  });

  // Sync form data if user prop changes
  useEffect(() => {
    setFormData({
      name: user.name,
      branch: user.branch || '',
      year: user.year || '',
      mentor: user.mentor || ''
    });
  }, [user]);

  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Badge Logic
  const totalActivity = completedTasks + reviewsCompleted;
  let badge = "Beginner";
  let badgeColor = "bg-slate-100 text-slate-600 border-slate-200";
  let BadgeIcon = Shield;

  if (totalActivity >= 20) {
    badge = "Leader";
    badgeColor = "bg-purple-100 text-purple-700 border-purple-200";
    BadgeIcon = Award;
  } else if (totalActivity >= 10) {
    badge = "Proactive";
    badgeColor = "bg-indigo-100 text-indigo-700 border-indigo-200";
    BadgeIcon = Zap;
  } else if (totalActivity >= 5) {
    badge = "Performer";
    badgeColor = "bg-blue-100 text-blue-700 border-blue-200";
    BadgeIcon = Star;
  }

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      branch: user.branch || '',
      year: user.year || '',
      mentor: user.mentor || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">My Profile</h2>
        {!isEditing ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
            >
              <X size={16} /> Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 items-center md:items-start relative">
          <div className="relative">
             <img 
               src={user.avatar} 
               alt={user.name} 
               className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" 
             />
             <div className={`absolute -bottom-3 -right-3 px-3 py-1 rounded-full text-xs font-bold border ${badgeColor} shadow-sm flex items-center gap-1`}>
                <BadgeIcon size={12} />
                {badge}
             </div>
          </div>
          
          <div className="flex-1 space-y-4 text-center md:text-left w-full">
            <div>
              {isEditing ? (
                <div className="mb-2">
                   <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
                   <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="text-2xl font-bold text-slate-900 border-b-2 border-indigo-200 focus:border-indigo-500 outline-none w-full bg-transparent"
                   />
                </div>
              ) : (
                <h3 className="text-2xl font-bold text-slate-900">{user.name}</h3>
              )}

              <div className="flex flex-col gap-3 mt-4 text-sm text-slate-600">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-slate-400" /> 
                  <span className="text-slate-500">{user.email}</span>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <Book size={16} className="text-slate-400" /> 
                    {isEditing ? (
                      <input 
                        type="text"
                        value={formData.branch}
                        onChange={e => setFormData({...formData, branch: e.target.value})}
                        placeholder="Branch/Dept"
                        className="border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                      />
                    ) : (
                      <span>{user.branch || 'Branch N/A'}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" /> 
                    {isEditing ? (
                      <input 
                        type="text"
                        value={formData.year}
                        onChange={e => setFormData({...formData, year: e.target.value})}
                        placeholder="Year"
                        className="border border-slate-300 rounded px-2 py-1 text-sm w-20 focus:ring-2 focus:ring-indigo-200 outline-none"
                      />
                    ) : (
                      <span>Year {user.year || 'N/A'}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-xl border transition-colors ${isEditing ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-center gap-2 mb-2">
                <UserIcon size={16} className="text-indigo-600" />
                <span className="text-sm font-semibold text-slate-700">Assigned Mentor</span>
              </div>
              {isEditing ? (
                <input 
                  type="text"
                  value={formData.mentor}
                  onChange={e => setFormData({...formData, mentor: e.target.value})}
                  placeholder="Mentor Name"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              ) : (
                <p className="text-lg font-medium text-slate-900">{user.mentor || 'No mentor assigned'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-700">Overall Progress</h4>
            <TrendingUp className="text-green-500" size={20} />
          </div>

          <div className="space-y-6">
            <div>
               <div className="flex justify-between text-sm mb-1">
                 <span className="text-slate-500">Work Completed</span>
                 <span className="font-bold text-slate-900">{progressPercentage}%</span>
               </div>
               <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out" 
                   style={{ width: `${progressPercentage}%` }}
                 />
               </div>
               <p className="text-xs text-slate-400 mt-2 text-right">{completedTasks} / {totalTasks} Tasks</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
               <div className="text-center">
                 <p className="text-2xl font-bold text-slate-800">{completedTasks}</p>
                 <p className="text-xs text-slate-500 uppercase tracking-wide">Submissions</p>
               </div>
               <div className="text-center border-l border-slate-100">
                 <p className="text-2xl font-bold text-slate-800">{reviewsCompleted}</p>
                 <p className="text-xs text-slate-500 uppercase tracking-wide">Reviews</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold mb-2">Current Status: {badge}</h3>
            <p className="text-indigo-200 max-w-lg">
              Keep submitting assignments and reviewing peers to unlock the "Scholar" badge and gain access to advanced mentorship sessions.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <BadgeIcon size={48} className="text-yellow-400" />
          </div>
        </div>
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl"></div>
      </div>
    </div>
  );
};
