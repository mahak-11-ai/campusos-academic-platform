import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Upload,
  FileText,
  BookOpen,
  MessageSquare,
  ArrowRight,
  Inbox,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { dashboardService, type TeacherStats } from '@/services/dashboardService';
import { resourceService, type Resource } from '@/services/resourceService';
import { questionService, type Question } from '@/services/questionService';
import { formatDate } from '@/components/ResourceTypeBadge';
import { ResourceTypeBadge } from '@/components/ResourceTypeBadge';

export default function TeacherDashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [myResources, setMyResources] = useState<Resource[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, r, q] = await Promise.all([
          dashboardService.getTeacherStats(),
          resourceService.getMine(),
          questionService.getAll(),
        ]);

        setStats(s);
        setMyResources(r.slice(0, 5));
        setQuestions(q);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleAnswer = async (questionId: string) => {
    const answer = answers[questionId]?.trim();

    if (!answer) {
      window.alert('Please write an answer first.');
      return;
    }

    try {
      setAnsweringId(questionId);

      const updatedQuestion = await questionService.answer(
        questionId,
        answer
      );

      setQuestions((current) =>
        current.map((q) =>
          q._id === questionId ? updatedQuestion : q
        )
      );

      setAnswers((current) => ({
        ...current,
        [questionId]: '',
      }));

      setStats((current) =>
        current
          ? {
              ...current,
              pendingQuestions: Math.max(
                0,
                current.pendingQuestions - 1
              ),
            }
          : current
      );
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Failed to submit answer.'
      );
    } finally {
      setAnsweringId(null);
    }
  };

  const cards = [
    {
      label: 'My Uploads',
      value: stats?.myResources ?? 0,
      icon: Upload,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Total Resources',
      value: stats?.totalResources ?? 0,
      icon: FileText,
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      label: 'Subjects',
      value: stats?.totalSubjects ?? 0,
      icon: BookOpen,
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Pending Questions',
      value: stats?.pendingQuestions ?? 0,
      icon: MessageSquare,
      color: 'from-amber-500 to-amber-600',
    },
  ];

  const pendingQuestions = questions.filter(
    (q) => q.status === 'pending'
  );

  const answeredQuestions = questions.filter(
    (q) => q.status === 'answered'
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome, {user?.name?.split(' ')[0]}
          </h1>
          <p className="mt-1 text-slate-500">
            Manage your academic resources and student questions
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700"
        >
          <Upload className="h-4 w-4" />
          Upload Resource
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${card.color}`}
            >
              <card.icon className="h-5 w-5 text-white" />
            </div>

            <p className="text-3xl font-bold text-slate-900">
              {card.value}
            </p>

            <p className="text-sm text-slate-500">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">

        <Link
          to="/upload"
          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
        >
          <div>
            <p className="font-semibold text-slate-900">
              Upload Resource
            </p>
            <p className="text-sm text-slate-500">
              Share notes, papers, references
            </p>
          </div>

          <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
        </Link>

        <Link
          to="/my-resources"
          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
        >
          <div>
            <p className="font-semibold text-slate-900">
              My Resources
            </p>
            <p className="text-sm text-slate-500">
              View and manage uploads
            </p>
          </div>

          <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
        </Link>

        <Link
          to="/subjects"
          className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
        >
          <div>
            <p className="font-semibold text-slate-900">
              Add Subject
            </p>
            <p className="text-sm text-slate-500">
              Create new subject entries
            </p>
          </div>

          <ArrowRight className="h-5 w-5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
        </Link>
      </div>

      {/* Student Questions */}
      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              Student Questions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Answer questions submitted by students
            </p>
          </div>

          <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
            {pendingQuestions.length} Pending
          </span>
        </div>

        {pendingQuestions.length > 0 ? (
          <div className="space-y-4">
            {pendingQuestions.map((q) => (
              <div
                key={q._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                {/* Question */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Question
                    </span>

                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                      Pending
                    </span>
                  </div>

                  <p className="text-base font-semibold text-slate-900">
                    {q.question}
                  </p>

                  <p className="mt-2 text-sm text-slate-500">
                    Asked by: {q.askerName}
                    {q.topic ? ` • ${q.topic}` : ''}
                  </p>
                </div>

                {/* Answer */}
                <textarea
                  value={answers[q._id] ?? ''}
                  onChange={(e) =>
                    setAnswers((current) => ({
                      ...current,
                      [q._id]: e.target.value,
                    }))
                  }
                  placeholder="Write your answer for the student..."
                  rows={4}
                  className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleAnswer(q._id)}
                    disabled={answeringId === q._id}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {answeringId === q._id
                      ? 'Submitting...'
                      : 'Submit Answer'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
            <MessageSquare className="mx-auto mb-3 h-8 w-8 text-slate-400" />

            <p className="font-medium text-slate-700">
              No pending questions
            </p>

            <p className="mt-1 text-sm text-slate-500">
              New student questions will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Answered Questions */}
      {answeredQuestions.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Recently Answered
          </h2>

          <div className="space-y-3">
            {answeredQuestions.slice(0, 5).map((q) => (
              <div
                key={q._id}
                className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">
                      {q.question}
                    </p>

                    <p className="mt-2 text-sm text-slate-600">
                      {q.answer}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Answered by {q.answeredBy}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    Answered
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Uploads */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            My Recent Uploads
          </h2>

          <Link
            to="/my-resources"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        </div>

        {myResources.length > 0 ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="hidden px-4 py-3 sm:table-cell">
                    Subject
                  </th>
                  <th className="hidden px-4 py-3 md:table-cell">
                    Type
                  </th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {myResources.map((r) => (
                  <tr
                    key={r._id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <Link
                        to={`/resources/${r._id}`}
                        className="hover:text-blue-600"
                      >
                        {r.title}
                      </Link>
                    </td>

                    <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                      {r.subjectName}
                    </td>

                    <td className="hidden px-4 py-3 md:table-cell">
                      <ResourceTypeBadge type={r.resourceType} />
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      {formatDate(r.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <Inbox className="mx-auto mb-3 h-8 w-8 text-slate-400" />

            <p className="mb-4 text-slate-500">
              You haven't uploaded any resources yet
            </p>

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
    </div>
  );
}