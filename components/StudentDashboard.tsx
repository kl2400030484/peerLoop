import React from 'react';
import { Assignment, Submission, PeerReview } from '../types';
import { Clock, CheckCircle, AlertCircle, ArrowRight, PenTool } from 'lucide-react';

interface StudentDashboardProps {
  assignments: Assignment[];
  submissions: Submission[];
  pendingReviews: PeerReview[];
  onSelectAssignment: (assignmentId: string) => void;
  onSelectReview: (reviewId: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  assignments,
  submissions,
  pendingReviews,
  onSelectAssignment,
  onSelectReview
}) => {
  // Helper to check status
  const getSubmissionStatus = (assignmentId: string) => {
    return submissions.find(s => s.assignmentId === assignmentId);
  };

  return (
    <div className="space-y-8">
      {/* Pending Reviews Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="text-amber-500" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Pending Peer Reviews</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingReviews.filter(r => r.status === 'DRAFT').map(review => {
            const assignment = assignments.find(a => a.id === review.assignmentId);
            return (
              <div key={review.id} className="bg-white p-5 rounded-xl border-l-4 border-amber-400 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-1 rounded">Needs Review</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-1">{assignment?.title || 'Unknown Assignment'}</h3>
                <p className="text-sm text-slate-500 mb-4">Review your peer's submission provided.</p>
                <button 
                  onClick={() => onSelectReview(review.id)}
                  className="w-full py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                >
                  Start Review <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
          {pendingReviews.filter(r => r.status === 'DRAFT').length === 0 && (
            <div className="col-span-full bg-slate-50 p-6 rounded-xl text-center border border-slate-200">
              <CheckCircle className="mx-auto text-green-500 mb-2" size={32} />
              <p className="text-slate-600 font-medium">You're all caught up on reviews!</p>
            </div>
          )}
        </div>
      </section>

      {/* Active Assignments Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <PenTool className="text-indigo-600" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Your Assignments</h2>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Assignment</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Due Date</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map(assignment => {
                const submission = getSubmissionStatus(assignment.id);
                return (
                  <tr key={assignment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{assignment.title}</div>
                      <div className="text-slate-500 text-xs mt-0.5 truncate max-w-xs">{assignment.description}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {assignment.dueDate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {submission ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle size={12} /> Submitted
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          Not Started
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {submission ? (
                        <button 
                          disabled
                          className="text-slate-400 text-xs font-medium cursor-not-allowed"
                        >
                          View Submission
                        </button>
                      ) : (
                        <button 
                          onClick={() => onSelectAssignment(assignment.id)}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-xs border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded transition-colors"
                        >
                          Start Working
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};