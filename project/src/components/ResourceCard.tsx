import { Link } from 'react-router-dom';
import { Download, User, Calendar } from 'lucide-react';
import type { Resource } from '@/services/resourceService';
import { ResourceTypeBadge, formatDate } from './ResourceTypeBadge';

export default function ResourceCard({ resource }: { resource: Resource }) {
  const downloadUrl =
    resource.fileUrl ||
    (resource.filePath ? resource.filePath : '');

  return (
    <Link
      to={`/resources/${resource._id}`}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <ResourceTypeBadge type={resource.resourceType} />
        {downloadUrl && (
          <Download className="h-4 w-4 text-slate-400 transition-colors group-hover:text-blue-600" />
        )}
      </div>
      <h3 className="mb-1 line-clamp-2 font-semibold text-slate-900 group-hover:text-blue-700">
        {resource.title}
      </h3>
      <p className="mb-4 line-clamp-2 flex-1 text-sm text-slate-500">{resource.description || 'No description'}</p>
      <div className="space-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <p className="font-medium text-slate-700">{resource.subjectName}</p>
        <p>Topic: {resource.topic}</p>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {resource.uploaderName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(resource.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
