import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, FileSearch } from 'lucide-react';
import { subjectService, type Subject } from '@/services/subjectService';
import { resourceService, type Resource, type ResourceType } from '@/services/resourceService';
import ResourceCard from '@/components/ResourceCard';

const typeLabels: Record<string, string> = {
  notes: 'Notes',
  'previous-paper': 'Previous Papers',
  assignment: 'Assignments',
  reference: 'References',
};

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [subjectFilter, setSubjectFilter] = useState(searchParams.get('subject') || '');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || '');

  useEffect(() => {
    subjectService.getAll().then(setSubjects).catch(() => {});
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const filters: Record<string, string> = {};
        if (search) filters.search = search;
        if (subjectFilter) filters.subject = subjectFilter;
        if (typeFilter) filters.type = typeFilter;
        const res = await resourceService.getAll(filters);
        setResources(res);
      } catch {
        setResources([]);
      } finally {
        setLoading(false);
      }
    }
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search, subjectFilter, typeFilter]);

  function updateUrl(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  function clearFilters() {
    setSearch('');
    setSubjectFilter('');
    setTypeFilter('');
    setSearchParams(new URLSearchParams());
  }

  const hasFilters = search || subjectFilter || typeFilter;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Browse Resources</h1>
        <p className="mt-1 text-slate-500">Search and filter academic resources</p>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              updateUrl('search', e.target.value);
            }}
            placeholder="Search by title, topic, or description..."
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <Filter className="h-4 w-4" />
          Filters:
        </div>
        <select
          value={subjectFilter}
          onChange={(e) => {
            setSubjectFilter(e.target.value);
            updateUrl('subject', e.target.value);
          }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
        >
          <option value="">All Subjects</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>{s.name}</option>
          ))}
        </select>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            updateUrl('type', e.target.value);
          }}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-500"
        >
          <option value="">All Types</option>
          {Object.entries(typeLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        </div>
      ) : resources.length > 0 ? (
        <>
          <p className="mb-4 text-sm text-slate-500">{resources.length} resource{resources.length !== 1 ? 's' : ''} found</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {resources.map((r) => (
              <ResourceCard key={r._id} resource={r} />
            ))}
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
          <FileSearch className="mx-auto mb-3 h-8 w-8 text-slate-400" />
          <p className="text-slate-500">No resources match your search</p>
          {hasFilters && (
            <button onClick={clearFilters} className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700">
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
