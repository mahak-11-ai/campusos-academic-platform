import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, ArrowRight, Code2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { subjectService, type Subject } from '@/services/subjectService';
import { resourceService, type Resource } from '@/services/resourceService';
import ResourceCard from '@/components/ResourceCard';

export default function Subjects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [subs, res] = await Promise.all([
          subjectService.getAll(),
          resourceService.getLatest(),
        ]);
        setSubjects(subs);
        setResources(res);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function getResourcesForSubject(subjectId: string) {
    return resources.filter((r) => r.subject === subjectId);
  }

  async function handleCreateSubject(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const created = await subjectService.create(form.name, form.code, form.description);
      setSubjects([...subjects, created].sort((a, b) => a.name.localeCompare(b.name)));
      setForm({ name: '', code: '', description: '' });
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create subject');
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subjects</h1>
          <p className="mt-1 text-slate-500">Browse resources by subject</p>
        </div>
        {user?.role === 'teacher' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Subject
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateSubject}
          className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Subject Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Data Structures"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Subject Code</label>
              <input
                type="text"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. CS301"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Description (optional)</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Brief description of the subject"
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              Create Subject
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {subjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <BookOpen className="mx-auto mb-3 h-8 w-8 text-slate-400" />
          <p className="text-slate-500">No subjects available yet</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => {
            const count = getResourcesForSubject(subject._id).length;
            return (
              <div
                key={subject._id}
                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5"
                onClick={() => navigate(`/browse?subject=${subject._id}`)}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 ring-1 ring-blue-100">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    <Code2 className="h-3 w-3" />
                    {subject.code}
                  </span>
                </div>
                <h3 className="mb-1 font-semibold text-slate-900 group-hover:text-blue-700">{subject.name}</h3>
                <p className="mb-4 line-clamp-2 text-sm text-slate-500">
                  {subject.description || 'No description available'}
                </p>
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <span className="text-sm text-slate-500">{count} resource{count !== 1 ? 's' : ''}</span>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
