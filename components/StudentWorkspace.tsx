import React, { useRef } from 'react';
import { Assignment, Submission, SubmissionStatus } from '../types';
import { CheckCircle, Clock, Upload, FileText, ArrowRight, Activity, AlertCircle } from 'lucide-react';

interface StudentWorkspaceProps {
  assignments: Assignment[];
  submissions: Submission[];
  onUpload: (assignmentId: string, files: FileList) => void;
  onSubmit: (assignmentId: string) => void;
}

export const StudentWorkspace: React.FC<StudentWorkspaceProps> = ({
  assignments,
  submissions,
  onUpload,
  onSubmit
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = React.useState<string | null>(null);

  const getStatusColor = (status: SubmissionStatus) => {
    switch (status) {
      case 'NOT_STARTED': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'IN_PROGRESS': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'SUBMITTED': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'REVIEWED': return 'bg-purple-50 text-purple-600 border-purple-200';
      case 'COMPLETED': return 'bg-green-50 text-green-600 border-green-200';
      default: return 'bg-slate-100';
    }
  };

  const getStatusLabel = (status: SubmissionStatus) => {
    return status.replace('_', ' ');
  };

  const handleFileClick = (assignmentId: string) => {
    setSelectedAssignmentId(assignmentId);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && selectedAssignmentId) {
      onUpload(selectedAssignmentId, e.target.files);
    }
  };

  // Timeline Data Generation
  const completedCount = submissions.filter(s => s.status === 'COMPLETED').length;
  const reviewedCount = submissions.filter(s => s.status === 'REVIEWED').length;
  const submittedCount = submissions.filter(s => s.status === 'SUBMITTED').length;
  const inProgressCount = submissions.filter(s => s.status === 'IN_PROGRESS').length;
  
  // Simple SVG Graph Data
  const graphHeight = 100;
  const graphPoints = [
    { label: 'Start', value: 10 },
    { label: 'Drafts', value: 10 + (inProgressCount * 10) },
    { label: 'Subs', value: 10 + (inProgressCount * 10) + (submittedCount * 15) },
    { label: 'Reviews', value: 10 + (inProgressCount * 10) + (submittedCount * 15) + (reviewedCount * 20) },
    { label: 'Done', value: 10 + (inProgressCount * 10) + (submittedCount * 15) + (reviewedCount * 20) + (completedCount * 25) }
  ];
  
  const polylinePoints = graphPoints.map((p, i) => `${i * 100},${graphHeight - p.value}`).join(' ');

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">My Workspace</h2>
           <p className="text-slate-500">Track your progress and manage submissions.</p>
        </div>
        <div className="flex gap-2">
           <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-medium text-slate-600 shadow-sm">
             {assignments.length} Total
           </span>
           <span className="px-3 py-1 bg-green-50 border border-green-100 rounded-full text-xs font-medium text-green-700 shadow-sm">
             {completedCount} Completed
           </span>
        </div>
      </div>

      {/* Activity Timeline Graph */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Activity className="text-indigo-600" size={20} />
          <h3 className="font-bold text-slate-700">Growth Timeline</h3>
        </div>
        <div className="h-32 w-full flex items-end justify-between px-4 relative">
          {/* SVG Line */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible px-4" preserveAspectRatio="none">
             <polyline 
               points={polylinePoints} 
               fill="none" 
               stroke="#6366f1" 
               strokeWidth="3"
               strokeLinecap="round"
               className="drop-shadow-md"
             />
          </svg>
          
          {graphPoints.map((point, idx) => (
             <div key={idx} className="flex flex-col items-center gap-2 z-10">
                <div className="w-4 h-4 rounded-full bg-white border-4 border-indigo-600 shadow-sm"></div>
                <span className="text-xs font-medium text-slate-500">{point.label}</span>
             </div>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-4">
        {assignments.map(assignment => {
          const submission = submissions.find(s => s.assignmentId === assignment.id);
          const status = submission ? submission.status : 'NOT_STARTED';
          const isLate = new Date(assignment.dueDate) < new Date();

          return (
            <div key={assignment.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                   {status === 'COMPLETED' ? <CheckCircle size={24} /> : <FileText size={24} />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-800">{assignment.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(status)}`}>
                      {getStatusLabel(status)}
                    </span>
                    {isLate && status !== 'COMPLETED' && (
                       <span className="flex items-center gap-1 text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100">
                         <AlertCircle size={10} /> OVERDUE
                       </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-1 mb-2">{assignment.description}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                     <span className="flex items-center gap-1"><Clock size={12} /> Due: {assignment.dueDate}</span>
                     {submission && submission.files.length > 0 && (
                        <span>• {submission.files.length} file(s) uploaded</span>
                     )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                 />
                 
                 {/* Action Buttons Logic */}
                 {status === 'NOT_STARTED' && (
                   <button 
                     onClick={() => handleFileClick(assignment.id)}
                     className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                   >
                     <Upload size={16} /> Upload Work
                   </button>
                 )}

                 {status === 'IN_PROGRESS' && (
                   <>
                     <button 
                       onClick={() => handleFileClick(assignment.id)}
                       className="px-4 py-2 text-slate-500 hover:text-indigo-600 text-sm font-medium transition-colors"
                     >
                       Change File
                     </button>
                     <button 
                       onClick={() => onSubmit(assignment.id)}
                       className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
                     >
                       Submit for Review <ArrowRight size={16} />
                     </button>
                   </>
                 )}

                 {(status === 'SUBMITTED' || status === 'REVIEWED') && (
                    <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed">
                       Awaiting Review
                    </button>
                 )}

                 {status === 'COMPLETED' && (
                    <button className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium flex items-center gap-2">
                       <CheckCircle size={16} /> Done
                    </button>
                 )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};