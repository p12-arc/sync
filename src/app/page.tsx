import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { Zap, CheckCircle, Shield, Search, ArrowRight, Lock, Database } from "lucide-react";

const FEATURES = [
  {
    icon: Shield,
    title: "Secure by Default",
    desc: "JWT in HTTP-only cookies, AES-256-GCM encrypted task descriptions, bcrypt passwords.",
  },
  {
    icon: CheckCircle,
    title: "Full Task CRUD",
    desc: "Create, edit, delete tasks with title, description, status, and creation date.",
  },
  {
    icon: Search,
    title: "Search & Filter",
    desc: "Instant search by title, filter by status (Todo / In Progress / Done), paginated results.",
  },
  {
    icon: Lock,
    title: "Private by Design",
    desc: "Every user sees only their own tasks — strict authorization on every API endpoint.",
  },
  {
    icon: Database,
    title: "MongoDB Backend",
    desc: "Mongoose ODM with compound indexes for fast, scalable task queries per user.",
  },
  {
    icon: Zap,
    title: "Blazing Fast",
    desc: "Next.js 14 App Router with Edge middleware and serverless API routes on Vercel.",
  },
];

export default function LandingPage() {
  const cookieStore = cookies();
  const token = cookieStore.get("tm_token")?.value;
  const user = token ? verifyToken(token) : null;

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <header className="border-b border-white/[0.06] bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-500/20 border border-brand-500/30">
              <Zap className="w-5 h-5 text-brand-500" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">TaskFlow</span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard" className="btn-primary flex items-center gap-2">
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost py-2 px-4 text-sm">Sign In</Link>
                <Link href="/register" className="btn-primary py-2 px-4 text-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 text-brand-400 text-sm font-medium mb-8">
          <Zap className="w-3.5 h-3.5" />
          Production-ready · JWT · AES-256-GCM · MongoDB
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
          Manage Tasks
          <br />
          <span className="bg-gradient-to-r from-brand-500 to-purple-500 bg-clip-text text-transparent">
            Securely &amp; Simply
          </span>
        </h1>

        <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          A full-stack task manager with enterprise-grade security — JWT authentication,
          encrypted storage, and a clean UI to keep your work organized.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            id="hero-cta"
            className="btn-primary flex items-center gap-2 text-base px-8 py-3"
          >
            Start for Free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="/login" className="btn-ghost flex items-center gap-2 text-base px-8 py-3">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="text-center text-3xl font-bold text-white mb-3">Everything you need</h2>
        <p className="text-center text-gray-500 mb-12">Built for developers who care about security and clean architecture.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card p-6 hover:border-white/[0.15] transition-all duration-200 hover:-translate-y-1">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-brand-500" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="glass-card p-10 text-center bg-gradient-to-br from-brand-500/10 to-purple-600/10">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to get organized?</h2>
          <p className="text-gray-400 mb-6">Create a free account and start managing your tasks in seconds.</p>
          <Link href="/register" className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-base">
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-6 text-center text-gray-600 text-sm">
        TaskFlow · Built with Next.js 14, MongoDB &amp; ❤️
      </footer>
    </div>
  );
}
