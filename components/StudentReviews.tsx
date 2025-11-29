import React from 'react';
import { Assignment, PeerReview } from '../types';
import { AlertCircle, ArrowRight, CheckCircle, FileText, ListChecks } from 'lucide-react';

interface StudentReviewsProps {
  assignments: Assignment[];
  pendingReviews: PeerReview[];
  onStartReview: (reviewId: string) => void;
}

export const StudentReviews: React.FC<StudentReviewsProps> = ({
  assignments,
  pendingReviews,
  onStartReview
}) => {
  return (
    <div className="space-y-6">
       <div className="flex items-center gap-3">
         <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
           <ListChecks size={24} />
         </div>
         <div>
           <h2 className="text-2xl font-bold text-slate-800">Peer Review System</h2>
           <p className="text-slate-500">Provide constructive feedback to your peers.</p>
         </div>
       </div>

       <div className="grid grid-cols-1 gap-6">
          {/* Pending Reviews */}
          <div className="space-y-4">
             <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
               <AlertCircle size={18} className="text-amber-500" /> 
               Pending Reviews
             </h3>
             {pendingReviews.filter(r => r.status === 'DRAFT').length === 0 ? (
                <div className="bg-slate-50 rounded-xl p-8 text-center border border-slate-200 border-dashed">
                   <CheckCircle className="mx-auto text-green-400 mb-2" size={32} />
                   <p className="text-slate-600 font-medium">All caught up! No pending reviews.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingReviews.filter(r => r.status === 'DRAFT').map(review => {
                    const assignment = assignments.find(a => a.id === review.assignmentId);
                    return (
                      <div key={review.id} className="bg-white p-6 rounded-xl border-l-4 border-amber-400 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between h-full">
                        <div>
                          <div className="flex justify-between items-start mb-3">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                              Needs Action
                            </span>
                          </div>
                          <h4 className="font-bold text-slate-900 mb-1 line-clamp-2">{assignment?.title}</h4>
                          <p className="text-sm text-slate-500 mb-4">
                            Help your peer improve by evaluating their submission against the rubric.
                          </p>
                          
                          {/* Rubric Preview */}
                          <div className="mb-4 bg-slate-50 p-3 rounded border border-slate-100">
                             <p className="text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                               <FileText size={10} /> Rubric Criteria Preview:
                             </p>
                             <ul className="text-xs text-slate-500 space-y-1 pl-3 list-disc">
                                {assignment?.rubric.slice(0, 2).map(r => (
                                   <li key={r.id} className="truncate">{r.title}</li>
                                ))}
                                {assignment && assignment.rubric.length > 2 && <li>+{assignment.rubric.length - 2} more...</li>}
                             </ul>
                          </div>
                        </div>

                        <button 
                          onClick={() => onStartReview(review.id)}
                          className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 group"
                        >
                          Start Review <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    );
                  })}
                </div>
             )}
          </div>

          {/* Completed Reviews History */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
             <h3 className="text-lg font-bold text-slate-700">Review History</h3>
             <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="px-6 py-3 font-medium">Assignment</th>
                      <th className="px-6 py-3 font-medium">Feedback Quality</th>
                      <th className="px-6 py-3 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                     {pendingReviews.filter(r => r.status === 'SUBMITTED').map(review => {
                        const assignment = assignments.find(a => a.id === review.assignmentId);
                        return (
                           <tr key={review.id} className="hover:bg-slate-50">
                              <td className="px-6 py-3 font-medium text-slate-800">{assignment?.title}</td>
                              <td className="px-6 py-3">
                                 {review.isConstructive ? (
                                    <span className="text-green-600 text-xs font-bold px-2 py-0.5 bg-green-50 rounded-full border border-green-100">Helpful</span>
                                 ) : (
                                    <span className="text-slate-500 text-xs">Standard</span>
                                 )}
                              </td>
                              <td className="px-6 py-3 text-right">
                                 <span className="text-slate-500 flex items-center justify-end gap-1">
                                    <CheckCircle size={14} className="text-green-500" /> Submitted
                                 </span>
                              </td>
                           </tr>
                        );
                     })}
                     {pendingReviews.filter(r => r.status === 'SUBMITTED').length === 0 && (
                        <tr>
                           <td colSpan={3} className="px-6 py-8 text-center text-slate-400">
                              No history available.
                           </td>
                        </tr>
                     )}
                  </tbody>
                </table>
             </div>
          </div>
       </div>
    </div>
  );
};