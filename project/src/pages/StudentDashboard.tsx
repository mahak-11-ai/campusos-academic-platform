import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  MessageSquare,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { dashboardService, type StudentStats } from '@/services/dashboardService';
import { resourceService, type Resource } from '@/services/resourceService';
import ResourceCard from '@/components/ResourceCard';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [latest, setLatest] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, l] = await Promise.all([
          dashboardService.getStudentStats(),
          resourceService.getLatest(),
        ]);
        setStats(s);
        setLatest(l.slice(0, 4));
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = [
    { label: 'Total Resources', value: stats?.totalResources ?? 0, icon: FileText, color: 'from-blue-500 to-blue-600' },
    { label: 'Subjects', value: stats?.totalSubjects ?? 0, icon: BookOpen, color: 'from-cyan-500 to-cyan-600' },
    { label: 'My Questions', value: stats?.myQuestions ?? 0, icon: MessageSquare, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Pending Answers', value: stats?.pendingQuestions ?? 0, icon: Clock, color: 'from-amber-500 to-amber-600' },
  ];

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
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="mt-1 text-slate-500">Here's your academic overview</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color}`}>
              <card.icon className="h-5 w-5 text-white" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{card.value}</p>
            <p className="text-sm text-slate-500">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Link
          to="/browse"
          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
        >
          <div>
            <p className="font-semibold text-slate-900">Browse Resources</p>
            <p className="text-sm text-slate-500">Search by subject or topic</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
        </Link>
        <Link
          to="/subjects"
          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
        >
          <div>
            <p className="font-semibold text-slate-900">Explore Subjects</p>
            <p className="text-sm text-slate-500">Browse all available subjects</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
        </Link>
        <Link
          to="/ask"
          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
        >
          <div>
            <p className="font-semibold text-slate-900">Ask a Question</p>
            <p className="text-sm text-slate-500">Get help from teachers</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
        </Link>
      </div>

      {/* Latest Resources */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Recently Uploaded</h2>
          </div>
          <Link to="/latest" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View all
          </Link>
        </div>
        {latest.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((r) => (
              <ResourceCard key={r._id} resource={r} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <FileText className="mx-auto mb-3 h-8 w-8 text-slate-400" />
            <p className="text-slate-500">No resources uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
