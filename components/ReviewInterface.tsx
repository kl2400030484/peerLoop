import React, { useState } from 'react';
import { PeerReview, Assignment, Submission, RubricCriteria } from '../types';
import { analyzeFeedbackTone } from '../services/geminiService';
import { Sparkles, Send, AlertTriangle, ThumbsUp, Loader2, ChevronRight, X } from 'lucide-react';

interface ReviewInterfaceProps {
  review: PeerReview;
  assignment: Assignment;
  submission: Submission;
  onClose: () => void;
  onSubmitReview: (review: PeerReview) => void;
}

export const ReviewInterface: React.FC<ReviewInterfaceProps> = ({
  review,
  assignment,
  submission,
  onClose,
  onSubmitReview
}) => {
  const [feedback, setFeedback] = useState(review.feedback);
  const [scores, setScores] = useState<Record<string, number>>(review.scores || {});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<{constructive: boolean, suggestions: string, score: number} | null>(null);

  const handleScoreChange = (criteriaId: string, val: number) => {
    setScores(prev => ({ ...prev, [criteriaId]: val }));
  };

  const handleAnalyze = async () => {
    if (feedback.length < 20) return; // Too short to analyze
    setIsAnalyzing(true);
    setAiAnalysisResult(null);

    // Create a context string from the rubric
    const rubricContext = assignment.rubric.map(r => `${r.title}: ${r.description}`).join('\n');
    
    const result = await analyzeFeedbackTone(feedback, rubricContext);
    setAiAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleSubmit = () => {
    onSubmitReview({
      ...review,
      feedback,
      scores,
      status: 'SUBMITTED',
      isConstructive: aiAnalysisResult?.constructive
    });
    onClose();
  };

  // Calculate total progress
  const criteriaIds = assignment.rubric.map(r => r.id);
  const scoredCount = criteriaIds.filter(id => scores[id] !== undefined).length;
  const isComplete = scoredCount === criteriaIds.length && feedback.length > 20;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Left Side: Student Submission */}
        <div className="w-1/2 bg-slate-50 border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
            <div>
              <h3 className="font-bold text-slate-800">{assignment.title}</h3>
              <p className="text-xs text-slate-500">Submission by Peer</p>
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-medium">Read Only</span>
          </div>
          <div className="p-8 overflow-y-auto flex-1 font-serif leading-relaxed text-slate-800 whitespace-pre-wrap">
            {submission.content}
          </div>
        </div>

        {/* Right Side: Review Form */}
        <div className="w-1/2 flex flex-col bg-white">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="text-indigo-500" size={18} />
              Your Review
            </h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Rubric Section */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Rubric Evaluation</h4>
              {assignment.rubric.map(criteria => (
                <div key={criteria.id} className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label className="text-sm font-medium text-slate-700">{criteria.title}</label>
                    <span className="text-sm font-bold text-indigo-600">
                      {scores[criteria.id] || 0} <span className="text-slate-400 font-normal">/ {criteria.maxPoints}</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{criteria.description}</p>
                  <input 
                    type="range"
                    min="0"
                    max={criteria.maxPoints}
                    value={scores[criteria.id] || 0}
                    onChange={(e) => handleScoreChange(criteria.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  />
                </div>
              ))}
            </div>

            <hr className="border-slate-100" />

            {/* Written Feedback Section */}
            <div className="space-y-3">
               <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Written Feedback</h4>
                  <button 
                    onClick={handleAnalyze}
                    disabled={feedback.length < 20 || isAnalyzing}
                    className="text-xs flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full hover:bg-indigo-100 disabled:opacity-50 transition-colors font-medium"
                  >
                     {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                     AI Constructiveness Check
                  </button>
               </div>
               <textarea 
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide constructive feedback here. Focus on strengths and areas for improvement..."
                  className="w-full h-40 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none text-sm leading-relaxed"
               />
               
               {/* AI Feedback Analysis Result */}
               {aiAnalysisResult && (
                 <div className={`p-4 rounded-lg border text-sm animate-in fade-in slide-in-from-top-2 ${aiAnalysisResult.constructive ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="flex items-start gap-3">
                      {aiAnalysisResult.constructive ? (
                        <ThumbsUp className="text-green-600 mt-0.5" size={16} />
                      ) : (
                        <AlertTriangle className="text-amber-600 mt-0.5" size={16} />
                      )}
                      <div>
                        <p className={`font-semibold ${aiAnalysisResult.constructive ? 'text-green-800' : 'text-amber-800'}`}>
                          Review Quality Score: {aiAnalysisResult.score}/100
                        </p>
                        <p className={`mt-1 ${aiAnalysisResult.constructive ? 'text-green-700' : 'text-amber-700'}`}>
                          {aiAnalysisResult.suggestions}
                        </p>
                      </div>
                    </div>
                 </div>
               )}
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-slate-600 font-medium hover:text-slate-900">
              Save Draft
            </button>
            <button 
              onClick={handleSubmit}
              disabled={!isComplete}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-sm hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
            >
              Submit Review <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};