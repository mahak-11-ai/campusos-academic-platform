import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, AlertCircle, CheckCircle, Link as LinkIcon, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { subjectService, type Subject } from '@/services/subjectService';
import { resourceService, type ResourceType } from '@/services/resourceService';

export default function UploadResource() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: '',
    description: '',
    subjectId: '',
    topic: '',
    resourceType: 'notes' as ResourceType,
    fileUrl: '',
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    subjectService.getAll().then(setSubjects).catch(() => {});
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resourceService.create({
        title: form.title,
        description: form.description,
        subjectId: form.subjectId,
        topic: form.topic,
        resourceType: form.resourceType,
        fileUrl: form.fileUrl,
      }, file || undefined);
      setSuccess(true);
      setTimeout(() => navigate('/my-resources'), 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  const typeOptions: { value: ResourceType; label: string }[] = [
    { value: 'notes', label: 'Notes' },
    { value: 'previous-paper', label: 'Previous Year Paper' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'reference', label: 'Reference Material' },
  ];

  if (success) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Resource uploaded!</h1>
        <p className="mt-2 text-slate-500">Redirecting to your resources...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Upload Resource</h1>
        <p className="mt-1 text-slate-500">Share academic materials with students</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        {error && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="e.g. Introduction to Dynamic Programming"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Brief description of the resource content..."
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Subject *</label>
            <select
              value={form.subjectId}
              onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="">Select a subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Topic *</label>
            <input
              type="text"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="e.g. Graph Algorithms"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Resource Type *</label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {typeOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, resourceType: opt.value })}
                className={`rounded-xl border-2 p-3 text-sm font-medium transition-all ${
                  form.resourceType === opt.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Upload File</label>
          <div className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center transition-colors hover:border-blue-400">
            <FileText className="mx-auto mb-2 h-8 w-8 text-slate-400" />
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip"
            />
            <label htmlFor="file-upload" className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700">
              {file ? file.name : 'Click to choose a file'}
            </label>
            <p className="mt-1 text-xs text-slate-400">PDF, DOC, PPT, TXT, ZIP (max 25MB)</p>
          </div>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-700">
            <LinkIcon className="h-3.5 w-3.5" />
            Or provide a URL
          </label>
          <input
            type="url"
            value={form.fileUrl}
            onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="https://drive.google.com/..."
          />
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-5">
          <p className="text-xs text-slate-400">Uploading as {user?.name}</p>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 disabled:opacity-60"
          >
            <Upload className="h-4 w-4" />
            {loading ? 'Uploading...' : 'Upload Resource'}
          </button>
        </div>
      </form>
    </div>
  );
}
