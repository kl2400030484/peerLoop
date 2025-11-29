import React, { useState } from 'react';
import { Assignment, RubricCriteria, Team, Submission } from '../types';
import { generateRubric } from '../services/geminiService';
import { Plus, Sparkles, Loader2, Calendar, FileText, Trash2, Users, AlertTriangle } from 'lucide-react';

interface TeacherAssignmentsProps {
  assignments: Assignment[];
  teams: Team[];
  submissions: Submission[];
  onCreateAssignment: (assignment: Assignment) => void;
  onDeleteAssignment: (id: string) => void;
}

export const TeacherAssignments: React.FC<TeacherAssignmentsProps> = ({ 
  assignments, 
  teams,
  submissions,
  onCreateAssignment,
  onDeleteAssignment
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [loadingRubric, setLoadingRubric] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [rubric, setRubric] = useState<RubricCriteria[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const handleGenerateRubric = async () => {
    if (!title || !description) return;
    setLoadingRubric(true);
    const generated = await generateRubric(title, description);
    setRubric(generated);
    setLoadingRubric(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      title,
      description,
      dueDate,
      rubric,
      assignedTo: [], // Logic to map team members to students would happen here
      assignedTeams: selectedTeams
    };
    onCreateAssignment(newAssignment);
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate('');
    setRubric([]);
    setSelectedTeams([]);
  };

  const toggleTeamSelection = (teamId: string) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]
    );
  };

  // Helper to calculate progress for an assignment across all teams
  const getAssignmentProgress = (assignmentId: string) => {
    // Total submissions expected (approx by assigned teams members, assuming for demo)
    // Simplified: Look at total submissions in the system for this assignment
    const assSubmissions = submissions.filter(s => s.assignmentId === assignmentId);
    if (assSubmissions.length === 0) return 0;
    const completed = assSubmissions.filter(s => ['COMPLETED', 'REVIEWED', 'SUBMITTED'].includes(s.status)).length;
    return Math.round((completed / assSubmissions.length) * 100); // Simplified calculation
  };

  if (isCreating) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Create New Assignment</h2>
          <button onClick={() => setIsCreating(false)} className="text-slate-500 hover:text-slate-700">Cancel</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="e.g. Renaissance Art History Essay"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  placeholder="Describe the requirements..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input 
                  type="date" 
                  required
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Assign to Teams</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border border-slate-200 rounded-lg bg-slate-50">
                  {teams.map(team => (
                    <label key={team.id} className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200 cursor-pointer hover:border-indigo-300 transition-colors">
                      <input 
                        type="checkbox"
                        checked={selectedTeams.includes(team.id)}
                        onChange={() => toggleTeamSelection(team.id)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-slate-700">{team.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <FileText size={18} />
                  Rubric Criteria
                </h3>
                <button 
                  type="button"
                  onClick={handleGenerateRubric}
                  disabled={loadingRubric || !title || !description}
                  className="flex items-center gap-2 text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loadingRubric ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  Generate with AI
                </button>
              </div>

              {rubric.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">
                  <p>No criteria yet.</p>
                  <p>Fill in details and click Generate.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {rubric.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border border-slate-200 shadow-sm text-sm">
                      <div className="flex justify-between font-medium text-slate-800">
                        <span>{item.title}</span>
                        <span className="text-indigo-600">{item.maxPoints} pts</span>
                      </div>
                      <p className="text-slate-500 mt-1 text-xs">{item.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
             <button 
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={selectedTeams.length === 0}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Plus size={18} />
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Assignment Management</h2>
          <p className="text-slate-500">Create, assign, and track all student work here.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-all"
        >
          <Plus size={20} />
          Create New
        </button>
      </div>

      {/* Stats Dashboard for Assignments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Active Assignments</p>
            <p className="text-2xl font-bold text-slate-800">{assignments.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Assigned Teams</p>
            <p className="text-2xl font-bold text-slate-800">{teams.length}</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Overdue Alerts</p>
            <p className="text-2xl font-bold text-slate-800">
               {assignments.filter(a => new Date(a.dueDate) < new Date()).length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {assignments.map(assignment => {
          const progress = getAssignmentProgress(assignment.id);
          const isOverdue = new Date(assignment.dueDate) < new Date();
          const assignedTeamNames = teams.filter(t => assignment.assignedTeams?.includes(t.id)).map(t => t.name).join(', ');

          return (
            <div key={assignment.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 bg-slate-50 text-slate-600 rounded-lg">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg text-slate-900">{assignment.title}</h3>
                    {isOverdue && <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold border border-red-200">OVERDUE</span>}
                  </div>
                  <p className="text-sm text-slate-500 mt-1"><span className="font-semibold text-slate-700">Teams:</span> {assignedTeamNames || 'All Teams'}</p>
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><Calendar size={14} /> Due {assignment.dueDate}</span>
                    <span>•</span>
                    <span>{assignment.rubric.length} Criteria</span>
                  </div>
                </div>
              </div>

              {/* Progress Section */}
              <div className="w-full md:w-64">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Completion</span>
                  <span className="font-bold text-slate-700">{progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <button 
                  onClick={() => onDeleteAssignment(assignment.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Assignment"
                 >
                   <Trash2 size={18} />
                 </button>
              </div>
            </div>
          );
        })}
        {assignments.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500">No assignments created yet.</p>
            <button onClick={() => setIsCreating(true)} className="text-indigo-600 font-medium hover:underline mt-2">Get started by creating one.</button>
          </div>
        )}
      </div>
    </div>
  );
};