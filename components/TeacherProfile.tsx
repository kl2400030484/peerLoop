
import React, { useState, useEffect } from 'react';
import { User, Team } from '../types';
import { Mail, Briefcase, Award, Users, BookOpen, Layers, Trophy, Edit2, Save, X } from 'lucide-react';

interface TeacherProfileProps {
  user: User;
  teams: Team[];
  onUpdateProfile: (updates: Partial<User>) => void;
}

export const TeacherProfile: React.FC<TeacherProfileProps> = ({ user, teams, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    experience: user.experience || 0,
    expertise: user.expertise?.join(', ') || '',
    sectionsHandled: user.sectionsHandled || 0
  });

  useEffect(() => {
    setFormData({
      name: user.name,
      experience: user.experience || 0,
      expertise: user.expertise?.join(', ') || '',
      sectionsHandled: user.sectionsHandled || 0
    });
  }, [user]);

  // Mock calculations for performance summary
  const totalStudents = teams.reduce((acc, team) => acc + team.memberIds.length, 0);

  const handleSave = () => {
    onUpdateProfile({
      name: formData.name,
      experience: Number(formData.experience),
      sectionsHandled: Number(formData.sectionsHandled),
      expertise: formData.expertise.split(',').map(s => s.trim()).filter(s => s)
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      experience: user.experience || 0,
      expertise: user.expertise?.join(', ') || '',
      sectionsHandled: user.sectionsHandled || 0
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
        <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="relative">
             <img 
               src={user.avatar} 
               alt={user.name} 
               className="w-32 h-32 rounded-full border-4 border-indigo-50 shadow-lg object-cover" 
             />
             <div className="absolute -bottom-3 -right-3 px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-sm flex items-center gap-1">
                <Award size={12} />
                Faculty
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
              
              <div className="flex flex-col md:flex-row gap-4 mt-2 text-sm text-slate-500 justify-center md:justify-start">
                <div className="flex items-center gap-1.5">
                  <Mail size={16} /> {user.email}
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase size={16} /> 
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <input 
                        type="number"
                        value={formData.experience}
                        onChange={e => setFormData({...formData, experience: Number(e.target.value)})}
                        className="w-16 border border-slate-300 rounded px-1 py-0.5 text-center focus:ring-2 focus:ring-indigo-200 outline-none"
                      />
                      <span>Years Exp.</span>
                    </div>
                  ) : (
                    <span>{user.experience} Years Experience</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {isEditing ? (
                 <div className="w-full">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Expertise (comma separated)</label>
                    <input 
                      type="text"
                      value={formData.expertise}
                      onChange={e => setFormData({...formData, expertise: e.target.value})}
                      className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                 </div>
              ) : (
                user.expertise?.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                    {skill}
                  </span>
                ))
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
               <div className="p-3 bg-indigo-50 rounded-lg text-center">
                  {isEditing ? (
                    <input 
                      type="number"
                      value={formData.sectionsHandled}
                      onChange={e => setFormData({...formData, sectionsHandled: Number(e.target.value)})}
                      className="w-16 text-xl font-bold text-indigo-700 bg-white border border-indigo-200 rounded text-center mx-auto block mb-1"
                    />
                  ) : (
                    <p className="text-2xl font-bold text-indigo-700">{user.sectionsHandled}</p>
                  )}
                  <p className="text-xs text-indigo-400 uppercase tracking-wide font-semibold">Sections</p>
               </div>
               <div className="p-3 bg-indigo-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-indigo-700">{teams.length}</p>
                  <p className="text-xs text-indigo-400 uppercase tracking-wide font-semibold">Teams Mapped</p>
               </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="text-amber-500" size={20} />
            <h4 className="font-bold text-slate-700">Performance Summary</h4>
          </div>

          <div className="space-y-6 flex-1 flex flex-col justify-center">
             <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-1">75%</div>
                <p className="text-sm text-slate-500">Teams Performing Above Average</p>
             </div>
             
             <div className="space-y-3">
                <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                   <span className="flex items-center gap-2 text-slate-600">
                     <Users size={16} /> Students Mentored
                   </span>
                   <span className="font-bold text-slate-900">{totalStudents}</span>
                </div>
                <div className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-lg">
                   <span className="flex items-center gap-2 text-slate-600">
                     <Layers size={16} /> Active Projects
                   </span>
                   <span className="font-bold text-slate-900">{teams.length * 2}</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Achievements / Awards */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Achievements & Certifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="p-3 bg-yellow-100 text-yellow-700 rounded-full">
                 <Award size={24} />
              </div>
              <div>
                 <p className="font-bold text-slate-800">Best Mentor 2023</p>
                 <p className="text-xs text-slate-500">Awarded by University Board</p>
              </div>
           </div>
           <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-full">
                 <BookOpen size={24} />
              </div>
              <div>
                 <p className="font-bold text-slate-800">Innovative Curriculum Design</p>
                 <p className="text-xs text-slate-500">For Modern History Course 2022</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
