import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Trash2, FileText, AlertCircle } from 'lucide-react';
import { resourceService, type Resource } from '@/services/resourceService';
import { ResourceTypeBadge, formatDate } from '@/components/ResourceTypeBadge';

export default function MyResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const res = await resourceService.getMine();
      setResources(res);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    setDeleteId(id);
    setError('');
    try {
      await resourceService.delete(id);
      setResources(resources.filter((r) => r._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setDeleteId(null);
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
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Resources</h1>
          <p className="mt-1 text-slate-500">Manage your uploaded materials</p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700"
        >
          <Upload className="h-4 w-4" />
          Upload New
        </Link>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {resources.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="hidden px-4 py-3 sm:table-cell">Subject</th>
                <th className="hidden px-4 py-3 md:table-cell">Type</th>
                <th className="hidden px-4 py-3 md:table-cell">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {resources.map((r) => (
                <tr key={r._id} className="transition-colors hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link to={`/resources/${r._id}`} className="font-medium text-slate-900 hover:text-blue-600">
                      {r.title}
                    </Link>
                    <p className="text-xs text-slate-400">{r.topic}</p>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">{r.subjectName}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <ResourceTypeBadge type={r.resourceType} />
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 md:table-cell">{formatDate(r.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(r._id)}
                      disabled={deleteId === r._id}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <FileText className="mx-auto mb-3 h-8 w-8 text-slate-400" />
          <p className="mb-4 text-slate-500">You haven't uploaded any resources yet</p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Upload className="h-4 w-4" />
            Upload your first resource
          </Link>
        </div>
      )}
    </div>
  );
}
