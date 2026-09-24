import { Link } from 'react-router-dom';
import {
  GraduationCap,
  BookOpen,
  FileSearch,
  Upload,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Landing() {
  const { user } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Subject-wise Browsing',
      desc: 'Explore resources organized by subject and topic for quick access to exactly what you need.',
    },
    {
      icon: FileSearch,
      title: 'Smart Search',
      desc: 'Find notes, previous-year papers, and references across the entire library instantly.',
    },
    {
      icon: Upload,
      title: 'Teacher Uploads',
      desc: 'Teachers can upload and manage academic resources with full metadata and categorization.',
    },
    {
      icon: MessageSquare,
      title: 'AI Study Assistant',
      desc: 'Ask academic questions and get them routed to teachers for expert answers.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute right-1/4 top-20 h-72 w-72 translate-x-1/2 rounded-full bg-cyan-200/40 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              <Sparkles className="h-4 w-4" />
              The academic OS for college students & teachers
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Your entire campus,
              <span className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                one platform.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
              CampusOS centralizes academic resources — notes, previous-year papers, and references —
              in one searchable, subject-organized platform built for students and teachers.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {user ? (
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700"
                >
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700"
                  >
                    Get Started Free
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Everything you need to succeed</h2>
          <p className="mt-4 text-slate-600">
            Built specifically for the academic workflow — from finding the right notes to asking the right questions.
          </p>
        </div>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 transition-colors group-hover:bg-blue-100">
                <f.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 font-semibold text-slate-900">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 px-8 py-16 text-center shadow-xl">
          <div className="absolute inset-0 -z-10 opacity-20">
            <div className="absolute left-0 top-0 h-48 w-48 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-white blur-3xl" />
          </div>
          <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-white" />
          <h2 className="text-3xl font-bold text-white">Role-based access for everyone</h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-50">
            Students get a personalized dashboard and search. Teachers get upload and management tools.
            Secure authentication keeps everything protected.
          </p>
          {!user && (
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-blue-600 shadow-lg transition-all hover:bg-blue-50"
            >
              Create your account
              <ArrowRight className="h-5 w-5" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">CampusOS</span>
            </div>
            <p className="text-sm text-slate-500">Built for the college hackathon demo.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
