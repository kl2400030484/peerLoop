import React from 'react';
import { Team, Assignment, Submission } from '../types';
import { BarChart2, TrendingUp, PieChart, CheckCircle, Clock } from 'lucide-react';

interface TeacherStatisticsProps {
  teams: Team[];
  assignments: Assignment[];
  submissions: Submission[];
}

export const TeacherStatistics: React.FC<TeacherStatisticsProps> = ({ teams, assignments, submissions }) => {
  
  // Calculate status distribution
  const statusCounts = {
    NOT_STARTED: 0,
    IN_PROGRESS: 0,
    SUBMITTED: 0,
    REVIEWED: 0,
    COMPLETED: 0
  };

  submissions.forEach(s => {
    if (statusCounts[s.status] !== undefined) {
      statusCounts[s.status]++;
    }
  });

  // Calculate team progress
  const teamProgress = teams.map(team => {
    // Find submissions by members of this team
    const teamSubmissions = submissions.filter(s => team.memberIds.includes(s.studentId));
    // Approximate progress: (Completed + Reviewed) / (Total Assignments * Members)
    // Simplified: Just count completed/reviewed vs total submissions expected
    // Assuming each member does each assignment (simplified)
    const totalExpected = assignments.length * team.memberIds.length;
    const completed = teamSubmissions.filter(s => ['COMPLETED', 'REVIEWED'].includes(s.status)).length;
    const progress = totalExpected > 0 ? Math.round((completed / totalExpected) * 100) : 0;
    
    return { name: team.name, progress };
  });

  const maxCount = Math.max(...Object.values(statusCounts), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Statistics & Analytics</h2>
           <p className="text-slate-500">Real-time data on student and team performance.</p>
        </div>
        <div className="flex gap-2">
           <span className="text-xs font-medium px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-500 flex items-center gap-1">
             <Clock size={12} /> Live Updates
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Status Distribution Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="text-indigo-600" size={20} />
            <h3 className="font-bold text-slate-700">Submission Status Distribution</h3>
          </div>
          
          <div className="space-y-4">
             {Object.entries(statusCounts).map(([status, count]) => {
                const percentage = Math.round((count / (submissions.length || 1)) * 100);
                let colorClass = 'bg-slate-200';
                if (status === 'COMPLETED') colorClass = 'bg-green-500';
                if (status === 'REVIEWED') colorClass = 'bg-purple-500';
                if (status === 'SUBMITTED') colorClass = 'bg-blue-500';
                if (status === 'IN_PROGRESS') colorClass = 'bg-amber-500';

                return (
                  <div key={status} className="group">
                    <div className="flex justify-between text-xs mb-1 font-medium">
                       <span className="text-slate-600 capitalize">{status.replace('_', ' ')}</span>
                       <span className="text-slate-900">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                       <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
             })}
          </div>
        </div>

        {/* Team Progress Comparison */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-green-600" size={20} />
            <h3 className="font-bold text-slate-700">Team Progress Leaderboard</h3>
          </div>
          
          <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2">
            {teamProgress.sort((a,b) => b.progress - a.progress).map((team, idx) => (
               <div key={idx} className="flex items-center gap-4">
                  <span className="text-sm font-bold text-slate-400 w-4">{idx + 1}</span>
                  <div className="flex-1">
                     <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-slate-700">{team.name}</span>
                        <span className="font-bold text-indigo-600">{team.progress}%</span>
                     </div>
                     <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-500 rounded-full" 
                          style={{ width: `${team.progress}%` }}
                        />
                     </div>
                  </div>
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* Assignment Completion Trends (Mock Visual) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
         <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="text-blue-600" size={20} />
            <h3 className="font-bold text-slate-700">Assignment Completion Trends</h3>
         </div>
         <div className="h-48 flex items-end justify-between gap-2 px-2">
            {[45, 60, 30, 75, 50, 80, 65, 90].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                 <div 
                    className="w-full bg-blue-100 hover:bg-blue-200 rounded-t-sm transition-all relative group-hover:shadow-md"
                    style={{ height: `${h}%` }}
                 >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                       {h}% Completion
                    </div>
                 </div>
                 <span className="text-[10px] text-slate-400">Wk {i+1}</span>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};