import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  User,
  Calendar,
  Tag,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { resourceService, type Resource } from '@/services/resourceService';
import { ResourceTypeBadge, formatDate } from '@/components/ResourceTypeBadge';

export default function ResourceDetail() {
  const { id } = useParams<{ id: string }>();
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    resourceService
      .getById(id)
      .then((r) => setResource(r))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load resource'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-slate-500">{error || 'Resource not found'}</p>
        <Link to="/browse" className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
          Back to Browse
        </Link>
      </div>
    );
  }

const backendUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/api$/, '');

const downloadUrl =
  resource.fileUrl ||
  (resource.filePath ? `${backendUrl}${resource.filePath}` : '');

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/browse" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-600">
        <ArrowLeft className="h-4 w-4" />
        Back to Browse
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-4">
          <ResourceTypeBadge type={resource.resourceType} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{resource.title}</h1>
        <p className="mt-3 text-slate-600">{resource.description || 'No description provided.'}</p>

        <div className="mt-6 grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500">Subject:</span>
            <span className="font-medium text-slate-900">{resource.subjectName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Tag className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500">Topic:</span>
            <span className="font-medium text-slate-900">{resource.topic}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500">Uploaded by:</span>
            <span className="font-medium text-slate-900">{resource.uploaderName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span className="text-slate-500">Date:</span>
            <span className="font-medium text-slate-900">{formatDate(resource.createdAt)}</span>
          </div>
        </div>

        {downloadUrl && (
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Download Resource
            </a>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
            >
              <ExternalLink className="h-4 w-4" />
              Open in new tab
            </a>
          </div>
        )}

        {!downloadUrl && (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-sm text-slate-500">
            No downloadable file attached to this resource.
          </div>
        )}
      </div>
    </div>
  );
}
