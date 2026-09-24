import { useEffect, useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { resourceService, type Resource } from '@/services/resourceService';
import ResourceCard from '@/components/ResourceCard';

export default function LatestResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resourceService
      .getLatest()
      .then(setResources)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">Latest Resources</h1>
        </div>
        <p className="text-slate-500">Most recently uploaded academic materials</p>
      </div>

      {resources.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resources.map((r) => (
            <ResourceCard key={r._id} resource={r} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <p className="text-slate-500">No resources uploaded yet</p>
        </div>
      )}
    </div>
  );
}
