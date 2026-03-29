"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  Bell,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Eye,
  EyeOff,
  FileText,
  GitBranch,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Lock,
  Menu,
  Moon,
  Receipt,
  Search,
  Settings,
  Settings2,
  ShieldCheck,
  Sun,
  TrendingUp,
  Twitter,
  Upload,
  UserCheck,
  X,
  XCircle,
} from "lucide-react";

type RoleKey = "admin" | "manager" | "employee";

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Features", href: "#features" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Contact", href: "#contact" },
];

const problems = [
  {
    icon: Clock,
    title: "Manual & Time-Consuming",
    desc: "Paper-based forms, manual data entry, and chasing signatures waste hours every month.",
    color: "bg-peach text-peach-deep",
  },
  {
    icon: EyeOff,
    title: "Lack of Transparency",
    desc: "No visibility into where expense requests are stuck or who needs to take action.",
    color: "bg-lavender text-lavender-deep",
  },
  {
    icon: AlertTriangle,
    title: "Error-Prone Reimbursements",
    desc: "Duplicate entries, wrong amounts, and missed receipts slow down finance operations.",
    color: "bg-yellow-pastel text-yellow-pastel-deep",
  },
  {
    icon: Lock,
    title: "No Flexible Approval System",
    desc: "Rigid approval chains can't adapt to different departments, amounts, or special cases.",
    color: "bg-mint text-mint-deep",
  },
];

const solutions = [
  {
    icon: ShieldCheck,
    title: "Authentication & Role Management",
    desc: "Secure sign-up with company setup and role assignment for Admin, Manager, and Employee.",
    color: "bg-lavender text-lavender-deep",
  },
  {
    icon: Receipt,
    title: "Expense Submission",
    desc: "Submit category, date, and amount quickly with attachments and status tracking.",
    color: "bg-mint text-mint-deep",
  },
  {
    icon: GitBranch,
    title: "Multi-level Approval System",
    desc: "Sequential approvals from Manager → Finance → Director with full traceability.",
    color: "bg-baby-blue text-baby-blue-deep",
  },
  {
    icon: Settings2,
    title: "Conditional Approval Rules",
    desc: "Support percentage-based, specific approver, and hybrid routing conditions.",
    color: "bg-peach text-peach-deep",
  },
  {
    icon: Globe,
    title: "Multi-currency Support",
    desc: "Handle global reimbursement with automatic conversion and real-time rate updates.",
    color: "bg-yellow-pastel text-yellow-pastel-deep",
  },
];

const rolesData: Record<
  RoleKey,
  { emoji: string; title: string; subtitle: string; color: string; activeBg: string; features: { icon: typeof ShieldCheck; text: string }[] }
> = {
  admin: {
    emoji: "👨‍💼",
    title: "Admin",
    subtitle: "Full control over company settings and policies",
    color: "text-lavender-deep",
    activeBg: "bg-lavender",
    features: [
      { icon: Settings, text: "Manage company settings & policies" },
      { icon: ShieldCheck, text: "Define approval rules & sequences" },
      { icon: UserCheck, text: "Assign roles to team members" },
      { icon: Eye, text: "View all company expenses" },
      { icon: BarChart3, text: "Generate reports & analytics" },
    ],
  },
  manager: {
    emoji: "🧑‍💼",
    title: "Manager",
    subtitle: "Review and approve team expense requests",
    color: "text-mint-deep",
    activeBg: "bg-mint",
    features: [
      { icon: ClipboardCheck, text: "Approve or reject team expenses" },
      { icon: Eye, text: "View team expense reports" },
      { icon: FileText, text: "Add comments & request changes" },
      { icon: BarChart3, text: "Track team spending trends" },
      { icon: Bell, text: "Get notified on new submissions" },
    ],
  },
  employee: {
    emoji: "👩‍💻",
    title: "Employee",
    subtitle: "Submit expenses and track approval status",
    color: "text-purple-deep",
    activeBg: "bg-purple-pastel",
    features: [
      { icon: Upload, text: "Submit new expense requests" },
      { icon: FileText, text: "Upload receipts via OCR scanning" },
      { icon: Search, text: "Track approval status in real-time" },
      { icon: Eye, text: "View personal expense history" },
      { icon: Bell, text: "Get notified on status changes" },
    ],
  },
};

const tabs: { key: RoleKey; label: string; color: string; activeColor: string }[] = [
  { key: "admin", label: "Admin", color: "text-muted-foreground", activeColor: "text-lavender-deep bg-lavender" },
  { key: "manager", label: "Manager", color: "text-muted-foreground", activeColor: "text-mint-deep bg-mint" },
  { key: "employee", label: "Employee", color: "text-muted-foreground", activeColor: "text-purple-deep bg-purple-pastel" },
];

const statusCards = [
  { label: "Approved", value: "124", icon: CheckCircle2, color: "text-mint-deep", bg: "bg-mint" },
  { label: "Pending", value: "38", icon: Clock, color: "text-peach-deep", bg: "bg-peach" },
  { label: "Rejected", value: "7", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
];

const timeline = [
  { text: "Travel expense #1042 approved by Sarah", time: "2 min ago", dot: "bg-mint-deep" },
  { text: "Office supplies #1041 submitted by Mark", time: "15 min ago", dot: "bg-baby-pink-deep" },
  { text: "Client dinner #1040 pending review", time: "1 hr ago", dot: "bg-lavender-deep" },
  { text: "Software license #1039 approved", time: "3 hrs ago", dot: "bg-purple-deep" },
];

const bars = [65, 45, 80, 55, 70, 90, 60];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

const footerLinks = {
  Product: ["Features", "Dashboard", "Pricing"],
  Company: ["Contact", "About"],
  Legal: ["Privacy Policy"],
};

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Instagram, href: "#", label: "Instagram" },
];

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`glass-card ${className}`}>{children}</div>;
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleDark = () => {
    setIsDark((p) => !p);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all ${scrolled ? "py-2" : "py-4"}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <GlassCard className="rounded-2xl px-4 py-3">
          <nav className="flex items-center justify-between">
            <a href="#" className="font-display text-xl font-bold text-foreground md:text-2xl">
              Flow<span className="text-primary">Expence</span>
            </a>

            <div className="hidden items-center gap-7 md:flex">
              {navLinks.map((l) => (
                <a key={l.label} href={l.href} className="text-sm font-medium text-muted-foreground transition hover:text-foreground">
                  {l.label}
                </a>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <button onClick={toggleDark} className="relative flex h-7 w-14 items-center rounded-full bg-muted px-1 transition hover:bg-accent" aria-label="Toggle theme">
                <Sun size={14} className="absolute left-1.5 text-peach-deep" />
                <Moon size={14} className="absolute right-1.5 text-lavender-deep" />
                <span className={`relative z-10 h-5 w-5 rounded-full bg-card shadow-sm transition-transform ${isDark ? "translate-x-7" : "translate-x-0"}`} />
              </button>
              <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">Login</Link>
              <Link href="/signup" className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Sign Up</Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button onClick={toggleDark} className="rounded-xl bg-muted p-2" aria-label="Toggle theme">{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
              <button onClick={() => setIsOpen((p) => !p)} className="p-2" aria-label="Menu">{isOpen ? <X size={22} /> : <Menu size={22} />}</button>
            </div>
          </nav>
        </GlassCard>

        {isOpen && (
          <GlassCard className="mt-2 rounded-2xl p-4 md:hidden animate-fade-up">
            {navLinks.map((l) => (
              <a key={l.label} href={l.href} className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground" onClick={() => setIsOpen(false)}>
                {l.label}
              </a>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/login" className="rounded-xl border border-border px-3 py-2 text-center text-sm font-medium text-foreground" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link href="/signup" className="rounded-xl bg-primary px-3 py-2 text-center text-sm font-semibold text-primary-foreground" onClick={() => setIsOpen(false)}>
                Sign Up
              </Link>
            </div>
          </GlassCard>
        )}
      </div>
    </header>
  );
}

const Hero = () => (
  <section className="section-padding relative overflow-hidden pt-32 md:pt-44">
    <div className="absolute -left-40 top-20 h-120 w-120 rounded-full bg-lavender/40 blur-[100px]" />
    <div className="absolute -right-44 top-20 h-120 w-120 rounded-full bg-mint/40 blur-[100px]" />

    <div className="relative mx-auto max-w-7xl">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display animate-fade-up text-4xl font-extrabold leading-[1.08] text-foreground md:text-6xl">
          Smart Expense & Reimbursement Management
        </h1>
        <p className="animate-fade-up mt-5 text-lg text-muted-foreground md:text-xl">
          Automate approvals, reduce errors, and manage expenses efficiently.
        </p>
        <div className="animate-fade-up mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/signup" className="rounded-2xl bg-primary px-8 py-3.5 text-lg font-semibold text-primary-foreground shadow-glass transition hover:scale-[1.03] hover:shadow-glass-lg">Get Started</Link>
          <a href="#dashboard" className="rounded-2xl border border-border bg-card px-8 py-3.5 text-lg font-semibold text-foreground transition hover:scale-[1.03]">Go to Dashboard</a>
        </div>
      </div>

      <GlassCard className="mx-auto mt-14 max-w-5xl rounded-3xl p-4 animate-fade-up">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-lavender/50 p-4">
            <p className="text-xs text-muted-foreground">Total Claims</p>
            <p className="font-display mt-2 text-3xl font-bold">$48,320</p>
            <p className="mt-1 flex items-center gap-1 text-xs text-mint-deep"><TrendingUp size={13} /> +8.4%</p>
          </div>
          <div className="rounded-2xl bg-mint/50 p-4">
            <p className="text-xs text-muted-foreground">Approval Rate</p>
            <p className="font-display mt-2 text-3xl font-bold">92%</p>
            <div className="mt-3 h-2 rounded-full bg-white/60"><div className="h-2 w-[92%] rounded-full bg-mint-deep" /></div>
          </div>
          <div className="rounded-2xl bg-baby-blue/50 p-4">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="font-display mt-2 text-3xl font-bold">38</p>
            <p className="mt-1 text-xs text-muted-foreground">Needs review</p>
          </div>
        </div>
      </GlassCard>
    </div>
  </section>
);

const ProblemSection = () => (
  <section className="section-padding bg-muted/35">
    <div className="mx-auto max-w-7xl">
      <div className="mb-14 text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Problems with Traditional Expense Systems</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {problems.map((p) => (
          <GlassCard key={p.title} className="group rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-glass-lg">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${p.color}`}><p.icon size={22} /></div>
            <h3 className="font-display mb-2 text-lg font-semibold">{p.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  </section>
);

const SolutionSection = () => (
  <section id="features" className="section-padding">
    <div className="mx-auto max-w-7xl">
      <div className="mb-14 text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Our Smart Solution</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {solutions.map((s) => (
          <GlassCard key={s.title} className="group rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-glass-lg">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${s.color}`}><s.icon size={22} /></div>
            <h3 className="font-display mb-2 text-lg font-semibold">{s.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  </section>
);

/* Role section kept as requested */
const RolesSection = () => {
  const [active, setActive] = useState<RoleKey>("admin");
  const role = rolesData[active];

  return (
    <section className="section-padding bg-muted/40">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-primary font-semibold text-sm uppercase tracking-wider mb-3">
            Roles & Access
          </p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">
            Built for Every Role
          </h2>
          <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
            Granular permissions tailored for admins, managers, and employees.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="glass-card rounded-2xl p-1.5 inline-flex gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActive(t.key)}
                className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  active === t.key ? t.activeColor : `${t.color} hover:text-foreground`
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-lg mx-auto">
          <div key={active} className="glass-card p-8 shadow-glass-lg animate-fade-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="text-4xl">{role.emoji}</div>
              <div>
                <h3 className={`font-display font-bold text-xl ${role.color}`}>{role.title}</h3>
                <p className="text-muted-foreground text-sm">{role.subtitle}</p>
              </div>
            </div>
            <ul className="space-y-3">
              {role.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                  <div className={`w-8 h-8 rounded-xl ${role.activeBg} flex items-center justify-center shrink-0`}>
                    <f.icon size={15} className={role.color} />
                  </div>
                  {f.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

const DashboardPreview = () => (
  <section id="dashboard" className="section-padding">
    <div className="mx-auto max-w-7xl">
      <div className="mb-14 text-center">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Real-time Expense Analytics</h2>
      </div>

      <GlassCard className="mx-auto max-w-5xl rounded-3xl p-6 md:p-8">
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {statusCards.map((s) => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-5 flex items-center justify-between`}>
              <div>
                <p className="text-sm font-medium text-foreground/70">{s.label}</p>
                <p className="text-2xl font-display font-bold text-foreground">{s.value}</p>
              </div>
              <s.icon className={s.color} size={28} />
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-card p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="font-display text-sm font-semibold">Expense Trends</h4>
              <span className="flex items-center gap-1 text-mint-deep text-xs font-semibold"><TrendingUp size={13} /> +12.5%</span>
            </div>
            <div className="flex h-36 items-end gap-2.5">
              {bars.map((h, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="w-full rounded-md bg-linear-to-t from-primary to-baby-blue transition-opacity hover:opacity-80" style={{ height: `${h}%` }} />
                  <span className="text-[10px] text-muted-foreground">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-card p-6 shadow-soft">
            <h4 className="font-display mb-5 text-sm font-semibold">Recent Activity</h4>
            <div className="space-y-3.5">
              {timeline.map((t, i) => (
                <div key={i} className="group flex items-start gap-3">
                  <div className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${t.dot}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm leading-snug text-foreground">{t.text}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{t.time}</p>
                  </div>
                  <ArrowUpRight size={13} className="mt-1 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  </section>
);

const CtaSection = () => (
  <section className="section-padding pt-6">
    <div className="mx-auto max-w-4xl">
      <GlassCard className="rounded-3xl p-10 text-center">
        <h3 className="font-display text-3xl font-bold text-foreground">Start managing expenses smarter today</h3>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/signup" className="rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">Sign Up</Link>
          <a href="#dashboard" className="rounded-2xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted">Try Demo</a>
        </div>
      </GlassCard>
    </div>
  </section>
);

const Footer = () => (
  <footer id="contact" className="section-padding border-t border-border pb-8!">
    <div className="mx-auto max-w-7xl">
      <div className="mb-10 grid grid-cols-2 gap-8 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <a href="#" className="font-display text-xl font-bold text-foreground">Flow<span className="text-primary">Expence</span></a>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">Smart expense management for modern teams.</p>
          <div className="mt-5 flex gap-2">
            {socials.map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-muted-foreground transition hover:bg-accent hover:text-foreground">
                <s.icon size={16} />
              </a>
            ))}
          </div>
        </div>
        {Object.entries(footerLinks).map(([title, items]) => (
          <div key={title}>
            <h4 className="mb-3 text-sm font-semibold text-foreground">{title}</h4>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item}><a href="#" className="text-sm text-muted-foreground hover:text-foreground">{item}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-6 text-xs text-muted-foreground">© 2026 FlowExpence. All rights reserved.</div>
    </div>
  </footer>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <RolesSection />
      <DashboardPreview />
      <CtaSection />
      <Footer />
      <style jsx global>{`
        :root {
          --fx-bg: #fffaf6;
          --fx-fg: #2a2840;
          --fx-card: #ffffff;
          --fx-muted: #fff2ea;
          --fx-muted-fg: #756f8f;
          --fx-border: #f2dde9;
          --fx-primary: #ffd866;
          --fx-primary-fg: #3a2b00;
          --fx-destructive: #ef4444;
          --fx-lavender: #ece4ff;
          --fx-lavender-deep: #7a67d9;
          --fx-mint: #dcf7ee;
          --fx-mint-deep: #2f9f83;
          --fx-baby-blue: #ffdcec;
          --fx-baby-blue-deep: #d55f92;
          --fx-peach: #ffe9de;
          --fx-peach-deep: #cc7b55;
          --fx-yellow-pastel: #fff2bf;
          --fx-yellow-pastel-deep: #b88600;
          --fx-baby-pink: #ffd9e8;
          --fx-baby-pink-deep: #c75488;
          --fx-purple-pastel: #e6dcff;
          --fx-purple-deep: #7452cf;
        }

        .dark {
          --fx-bg: #161221;
          --fx-fg: #f8efff;
          --fx-card: #241a2e;
          --fx-muted: #2a1f36;
          --fx-muted-fg: #d4bdd6;
          --fx-border: #3a2a47;
          --fx-primary: #ffd86a;
          --fx-primary-fg: #2f2300;
          --fx-destructive: #f26d6d;
          --fx-lavender: #3b2b4b;
          --fx-lavender-deep: #b39cff;
          --fx-mint: #243f39;
          --fx-mint-deep: #7de7cb;
          --fx-baby-blue: #4a2d3b;
          --fx-baby-blue-deep: #ff9ac2;
          --fx-peach: #4a3127;
          --fx-peach-deep: #ffb997;
          --fx-yellow-pastel: #524620;
          --fx-yellow-pastel-deep: #ffd86a;
          --fx-baby-pink: #4e3042;
          --fx-baby-pink-deep: #ff9fcc;
          --fx-purple-pastel: #3d3054;
          --fx-purple-deep: #c6a6ff;
        }

        .bg-background { background-color: var(--fx-bg) !important; }
        .text-foreground { color: var(--fx-fg) !important; }
        .bg-card { background-color: var(--fx-card) !important; }
        .bg-muted { background-color: var(--fx-muted) !important; }
        .text-muted-foreground { color: var(--fx-muted-fg) !important; }
        .bg-accent { background-color: #e8ebf8 !important; }
        .border-border { border-color: var(--fx-border) !important; }
        .bg-primary { background-color: var(--fx-primary) !important; }
        .text-primary { color: var(--fx-primary) !important; }
        .text-primary-foreground { color: var(--fx-primary-fg) !important; }
        .text-destructive { color: var(--fx-destructive) !important; }
        .bg-destructive\/10 { background-color: color-mix(in srgb, var(--fx-destructive) 14%, transparent) !important; }

        .font-display { font-family: Poppins, Inter, system-ui, sans-serif !important; }
        .section-padding { padding: 4.5rem 1rem; }
        @media (min-width: 640px) { .section-padding { padding-inline: 1.5rem; } }
        @media (min-width: 768px) { .section-padding { padding-block: 6rem; } }
        @media (min-width: 1024px) { .section-padding { padding-inline: 2rem; } }

        .glass-card {
          background: color-mix(in srgb, var(--fx-card) 78%, transparent) !important;
          border: 1px solid color-mix(in srgb, var(--fx-border) 70%, white) !important;
          border-radius: 1rem !important;
          backdrop-filter: blur(12px) !important;
          box-shadow: 0 14px 34px rgba(77, 86, 130, 0.16) !important;
        }

        .gradient-text {
          background-image: linear-gradient(90deg, var(--fx-primary), var(--fx-baby-blue-deep), var(--fx-mint-deep));
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .bg-lavender { background-color: var(--fx-lavender) !important; }
        .text-lavender-deep { color: var(--fx-lavender-deep) !important; }
        .bg-mint { background-color: var(--fx-mint) !important; }
        .text-mint-deep { color: var(--fx-mint-deep) !important; }
        .bg-baby-blue { background-color: var(--fx-baby-blue) !important; }
        .bg-baby-blue\/50 { background-color: color-mix(in srgb, var(--fx-baby-blue) 50%, transparent) !important; }
        .text-baby-blue-deep { color: var(--fx-baby-blue-deep) !important; }
        .bg-peach { background-color: var(--fx-peach) !important; }
        .text-peach-deep { color: var(--fx-peach-deep) !important; }
        .bg-yellow-pastel { background-color: var(--fx-yellow-pastel) !important; }
        .text-yellow-pastel-deep { color: var(--fx-yellow-pastel-deep) !important; }
        .bg-baby-pink { background-color: var(--fx-baby-pink) !important; }
        .text-baby-pink-deep { color: var(--fx-baby-pink-deep) !important; }
        .bg-purple-pastel { background-color: var(--fx-purple-pastel) !important; }
        .text-purple-deep { color: var(--fx-purple-deep) !important; }

        .shadow-soft { box-shadow: 0 10px 24px rgba(72, 83, 126, 0.12) !important; }
        .shadow-glass { box-shadow: 0 14px 30px rgba(96, 103, 168, 0.2) !important; }
        .shadow-glass-lg { box-shadow: 0 20px 45px rgba(96, 103, 168, 0.28) !important; }

        .animate-fade-up { animation: fadeUp .55s ease-out both; }
        .animate-float { animation: floatY 6s ease-in-out infinite; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px);} to { opacity:1; transform: translateY(0);} }
        @keyframes floatY { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-10px);} }
      `}</style>
    </div>
  );
}
