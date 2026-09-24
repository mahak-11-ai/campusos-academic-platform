import { useEffect, useState, type FormEvent } from 'react';
import { MessageSquare, Send, Clock, CheckCircle2, User, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { subjectService, type Subject } from '@/services/subjectService';
import { questionService, type Question } from '@/services/questionService';

export default function AskQuestion() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [question, setQuestion] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [topic, setTopic] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [subs, qs] = await Promise.all([
          subjectService.getAll(),
          questionService.getMine(),
        ]);
        setSubjects(subs);
        setQuestions(qs);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    setError('');
    setSubmitting(true);
    try {
      const q = await questionService.ask(question, subjectId || undefined, topic || undefined);
      setQuestions([q, ...questions]);
      setQuestion('');
      setSubjectId('');
      setTopic('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit question');
    } finally {
      setSubmitting(false);
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
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">AI Study Assistant</h1>
        </div>
        <p className="text-slate-500">
          Ask an academic question — teachers in the community will provide answers.
        </p>
      </div>

      {/* Question form */}
      <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Your Question *</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            rows={3}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="e.g. What is the time complexity of merge sort and why?"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Subject (optional)</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
            >
              <option value="">General</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Topic (optional)</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="e.g. Sorting Algorithms"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {submitting ? 'Sending...' : 'Ask Question'}
          </button>
        </div>
      </form>

      {/* My Questions */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-900">My Questions</h2>
        </div>

        {questions.length > 0 ? (
          <div className="space-y-3">
            {questions.map((q) => (
              <div key={q._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <p className="font-medium text-slate-900">{q.question}</p>
                  {q.status === 'answered' ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      <CheckCircle2 className="h-3 w-3" />
                      Answered
                    </span>
                  ) : (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                      <Clock className="h-3 w-3" />
                      Pending
                    </span>
                  )}
                </div>
                {q.topic && (
                  <p className="mb-2 text-xs text-slate-400">Topic: {q.topic}</p>
                )}
                {q.answer && (
                  <div className="mt-3 rounded-lg bg-slate-50 p-4">
                    <div className="mb-1 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <User className="h-3 w-3" />
                      {q.answeredBy}
                    </div>
                    <p className="text-sm text-slate-700">{q.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <MessageSquare className="mx-auto mb-3 h-8 w-8 text-slate-400" />
            <p className="text-slate-500">You haven't asked any questions yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
