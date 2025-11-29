import React, { useState } from 'react';
import { Team, Assignment, Submission, PeerReview } from '../types';
import { Users, ChevronRight, LayoutGrid, Clock, CheckCircle, AlertCircle, ArrowLeft, BarChart2 } from 'lucide-react';

interface TeacherDashboardProps {
  teams: Team[];
  assignments: Assignment[];
  submissions: Submission[];
  reviews: PeerReview[];
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  teams, 
  assignments, 
  submissions,
  reviews 
}) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  // Stats Logic
  const totalTeams = teams.length;
  const totalProjects = assignments.length;
  const pendingReviews = reviews.filter(r => r.status === 'DRAFT').length;

  const getTeamProgress = (team: Team) => {
    // Simplified average progress across all assignments for this team
    // In a real app, this would be more complex
    const teamSubmissions = submissions.filter(s => team.memberIds.includes(s.studentId));
    if (teamSubmissions.length === 0) return 0;
    const completed = teamSubmissions.filter(s => ['COMPLETED', 'REVIEWED'].includes(s.status)).length;
    return Math.round((completed / (assignments.length * team.memberIds.length)) * 100) || 0;
  };

  const getProjectStatusForTeam = (team: Team, assignment: Assignment) => {
    // Check if any member has submitted or if all have
    // Simplified: Show aggregate status based on majority
    const sub = submissions.find(s => s.assignmentId === assignment.id && team.memberIds.includes(s.studentId));
    return sub ? sub.status : 'NOT_STARTED';
  };

  const getProjectProgressPercentage = (team: Team, assignment: Assignment) => {
    // Calculate how many members completed this assignment
    const teamSubs = submissions.filter(s => s.assignmentId === assignment.id && team.memberIds.includes(s.studentId));
    const completedCount = teamSubs.filter(s => ['COMPLETED', 'REVIEWED', 'SUBMITTED'].includes(s.status)).length;
    return Math.round((completedCount / team.memberIds.length) * 100);
  };

  const renderStatusBadge = (status: string) => {
     const styles: Record<string, string> = {
       'NOT_STARTED': 'bg-slate-100 text-slate-500',
       'IN_PROGRESS': 'bg-amber-100 text-amber-700',
       'SUBMITTED': 'bg-blue-100 text-blue-700',
       'REVIEWED': 'bg-purple-100 text-purple-700',
       'COMPLETED': 'bg-green-100 text-green-700'
     };
     return (
       <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${styles[status] || styles['NOT_STARTED']}`}>
         {status.replace('_', ' ')}
       </span>
     );
  };

  // --- VIEW: TEAM DETAILS ---
  if (selectedTeam) {
    const teamProgress = getTeamProgress(selectedTeam);

    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
        <button 
          onClick={() => setSelectedTeam(null)} 
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors mb-4"
        >
          <ArrowLeft size={18} /> Back to Teams
        </button>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
           <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl font-bold">
               {selectedTeam.avatar || selectedTeam.name.substring(0,2)}
             </div>
             <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedTeam.name}</h2>
                <p className="text-slate-500 flex items-center gap-2">
                   <Users size={14} /> {selectedTeam.memberIds.length} Members
                   <span className="text-slate-300">|</span>
                   Section {selectedTeam.section}
                </p>
             </div>
           </div>
           <div className="text-right">
              <p className="text-sm text-slate-500 mb-1">Overall Progress</p>
              <div className="text-3xl font-bold text-indigo-600">{teamProgress}%</div>
           </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 mt-8 mb-4">Assigned Projects</h3>
        <div className="space-y-4">
          {assignments.filter(a => a.assignedTeams?.includes(selectedTeam.id)).map(assignment => {
             const status = getProjectStatusForTeam(selectedTeam, assignment);
             const progress = getProjectProgressPercentage(selectedTeam, assignment);
             
             return (
               <div key={assignment.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <h4 className="font-bold text-lg text-slate-800">{assignment.title}</h4>
                        <p className="text-sm text-slate-500">{assignment.description}</p>
                     </div>
                     {renderStatusBadge(status)}
                  </div>
                  
                  <div className="flex items-center gap-4">
                     <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                           <span className="text-slate-500 font-medium">Completion</span>
                           <span className="font-bold text-slate-700">{progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div 
                             className={`h-full rounded-full transition-all duration-500 ${progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} 
                             style={{ width: `${progress}%` }} 
                           />
                        </div>
                     </div>
                     <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-medium rounded-lg border border-slate-200 transition-colors">
                        View Details
                     </button>
                  </div>
               </div>
             );
          })}
          {assignments.filter(a => a.assignedTeams?.includes(selectedTeam.id)).length === 0 && (
             <div className="text-center py-10 bg-slate-50 rounded-xl text-slate-400">
               <p>No projects assigned to this team.</p>
             </div>
          )}
        </div>
      </div>
    );
  }

  // --- VIEW: DASHBOARD OVERVIEW ---
  return (
    <div className="space-y-8">
      {/* Overview Statistics Panel */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
           <div className="flex items-start justify-between">
              <div>
                 <p className="text-slate-500 text-sm font-medium">Total Teams</p>
                 <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalTeams}</h3>
              </div>
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                 <Users size={20} />
              </div>
           </div>
           <div className="mt-4 text-xs text-indigo-600 font-medium flex items-center gap-1">
             <CheckCircle size={12} /> Active & Monitored
           </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
           <div className="flex items-start justify-between">
              <div>
                 <p className="text-slate-500 text-sm font-medium">Projects Supervised</p>
                 <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalProjects}</h3>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                 <LayoutGrid size={20} />
              </div>
           </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
           <div className="flex items-start justify-between">
              <div>
                 <p className="text-slate-500 text-sm font-medium">Pending Reviews</p>
                 <h3 className="text-3xl font-bold text-slate-900 mt-1">{pendingReviews}</h3>
              </div>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                 <AlertCircle size={20} />
              </div>
           </div>
           <div className="mt-4 text-xs text-amber-600 font-medium">Requires attention</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
           <div className="flex items-start justify-between">
              <div>
                 <p className="text-indigo-100 text-sm font-medium">Team Performance</p>
                 <h3 className="text-3xl font-bold mt-1">Good</h3>
              </div>
              <div className="p-2 bg-white/20 rounded-lg text-white">
                 <BarChart2 size={20} />
              </div>
           </div>
           <p className="mt-4 text-xs text-indigo-100 opacity-80">75% teams on track</p>
        </div>
      </section>

      {/* Team List Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
           <h2 className="text-xl font-bold text-slate-800">Assigned Teams</h2>
           <div className="flex gap-2">
              <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                 Section A
              </span>
              <span className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                 Section B
              </span>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {teams.map(team => {
             const progress = getTeamProgress(team);
             return (
               <div 
                 key={team.id} 
                 onClick={() => setSelectedTeam(team)}
                 className="group bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer relative overflow-hidden"
               >
                 <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-lg group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                       {team.avatar}
                    </div>
                    <div>
                       <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{team.name}</h3>
                       <p className="text-xs text-slate-500">Section {team.section}</p>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <div className="flex justify-between text-sm text-slate-600">
                       <span className="flex items-center gap-1"><Users size={14} /> Members</span>
                       <span className="font-bold">{team.memberIds.length}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                       <span className="flex items-center gap-1"><Clock size={14} /> Active Projects</span>
                       <span className="font-bold">{assignments.filter(a => a.assignedTeams?.includes(team.id)).length}</span>
                    </div>
                 </div>

                 <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-xs mb-1">
                       <span className="text-slate-500 font-medium">Overall Progress</span>
                       <span className="text-indigo-600 font-bold">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                 </div>
                 
                 <div className="mt-4 flex justify-end">
                    <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                       View Details <ChevronRight size={12} />
                    </span>
                 </div>
               </div>
             );
           })}
        </div>
      </section>
    </div>
  );
};