import { useState, type ChangeEvent, type ReactNode } from "react";
import {
  LayoutDashboard, CalendarDays, BookOpen, ClipboardList, Users2,
  GraduationCap, BarChart3, MessageSquare, UploadCloud,
  CheckCircle2, Bell, Lock, Video, X, Search, ThumbsUp,
  MessageCircle, Plus, Download, Award, ShieldAlert, Megaphone,
  LogOut, Star, ChevronLeft, Paperclip, Link2, FileText,
  type LucideIcon,
} from "lucide-react";

// ============================================================
// Shared types
// ============================================================

type Role = "student" | "admin" | "facilitator";
type Tone = "slate" | "amber" | "emerald" | "red";

/** lucide-react's own icon component type — used for all nav/type icons in this file. */
type IconType = LucideIcon;

interface NavItem {
  key: string;
  label: string;
  icon: IconType;
}

interface NotificationItem {
  id: number;
  header: string;
  details: string;
}

interface ScheduleItem {
  week: number;
  title: string;
  date: string;
  status: "completed" | "current" | "locked" | "upcoming";
  reason?: string;
}

type ResourceType = "slide" | "recording" | "link";
interface ResourceItem {
  type: ResourceType;
  title: string;
}
interface ResourceModuleGroup {
  module: string;
  items: ResourceItem[];
}

interface ForumPost {
  id: number;
  title: string;
  module: string;
  upvotes: number;
  replies: number;
  official: boolean;
}
interface StudyGroup {
  id: number;
  name: string;
  members: number;
  joined: boolean;
}

interface PlatformUser {
  id: number;
  name: string;
  email: string;
  role: string;
  cohort: string;
  active: boolean;
}
interface NewUserForm {
  name: string;
  email: string;
  role: string;
  cohort: string;
}

interface LiveClassSession {
  id: number;
  title: string;
  date: string;
  facilitator: string;
}
interface NewSessionForm {
  title: string;
  date: string;
  facilitator: string;
  link: string;
}

interface AssignmentStudent {
  name: string;
  submitted?: boolean;
  attachment: string | null;
  grade: string;
}
interface Assignment {
  id: number;
  title: string;
  cohort: string;
  module: string;
  dueDate: string;
  attachment: string | null;
  students: AssignmentStudent[];
}
interface NewAssignmentForm {
  title: string;
  cohort: string;
  module: string;
  dueDate: string;
  attachment: string;
}

interface RankedStudent {
  name: string;
  score: number;
  attendance: number;
  assignments: number;
  feedback: number;
  status: "Good standing" | "At risk" | "Strike issued";
}
interface ExcuseRequest {
  id: number;
  student: string;
  session: string;
  reason: string;
}
interface AppealRequest {
  id: number;
  student: string;
  reason: string;
}

interface Announcement {
  id: number;
  target: string;
  message: string;
  time: string;
  read: number;
  total: number;
}

type ReportType = "Completion" | "Attendance" | "Assignment";
type ReportRow = [string, string, string];

interface FacilitatorSessionItem {
  id: number;
  title: string;
  cohort: string;
  date: string;
  status: "upcoming" | "completed";
}

type MaterialType = "pdf" | "article" | "link";
interface Material {
  id: number;
  type: MaterialType;
  title: string;
}
interface NewMaterialForm {
  type: MaterialType;
  title: string;
}

// ============================================================
// Nav configuration
// ============================================================

const STUDENT_NAV: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "schedule", label: "Schedule", icon: CalendarDays },
  { key: "resources", label: "Resources", icon: BookOpen },
  { key: "assignment", label: "Assignments", icon: ClipboardList },
  { key: "community", label: "Community", icon: MessageSquare },
];

const ADMIN_NAV: NavItem[] = [
  { key: "dashboard", label: "Overview", icon: LayoutDashboard },
  { key: "users", label: "Users", icon: Users2 },
  { key: "cohorts", label: "Cohorts", icon: GraduationCap },
  { key: "classes", label: "Classes", icon: CalendarDays },
  { key: "assignments", label: "Assignments", icon: ClipboardList },
  { key: "accountability", label: "Accountability", icon: ShieldAlert },
  { key: "announcements", label: "Announcements", icon: Megaphone },
  { key: "reports", label: "Reports", icon: BarChart3 },
];

const FACILITATOR_NAV: NavItem[] = [
  { key: "sessions", label: "My Sessions", icon: CalendarDays },
  { key: "assignments", label: "Assignments", icon: ClipboardList },
  { key: "materials", label: "Materials", icon: BookOpen },
  { key: "feedback", label: "My Feedback", icon: Star },
];

// ============================================================
// Shared components
// ============================================================

function Gauge({ value }: { value: number }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const pct = value / 100;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
      <circle cx="70" cy="70" r={r} fill="none" stroke="currentColor" className="text-slate-100" strokeWidth="12" />
      <circle
        cx="70" cy="70" r={r} fill="none" stroke="currentColor" className="text-amber-500"
        strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${c * pct} ${c}`}
      />
    </svg>
  );
}

function MetricBar({ label, value, tone }: { label: string; value: number; tone: Tone }) {
  const tones: Record<Tone, string> = { amber: "bg-amber-500", emerald: "bg-emerald-600", slate: "bg-slate-500", red: "bg-red-500" };
  return (
    <div>
      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
        <span>{label}</span>
        <span className="font-medium text-slate-700">{value}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-100">
        <div className={`h-1.5 rounded-full ${tones[tone]}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-1">{children}</p>;
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-white border border-slate-200 rounded-2xl p-5 ${className}`}>{children}</div>;
}

function Pill({ children, tone = "slate" }: { children: ReactNode; tone?: Tone }) {
  const tones: Record<Tone, string> = {
    slate: "bg-slate-100 text-slate-600",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-600",
  };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

function PrimaryButton({ children, onClick, className = "" }: ButtonProps) {
  return (
    <button onClick={onClick} className={`bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ${className}`}>
      {children}
    </button>
  );
}
function GhostButton({ children, onClick, className = "" }: ButtonProps) {
  return (
    <button onClick={onClick} className={`bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${className}`}>
      {children}
    </button>
  );
}

function AttachmentPreviewModal({ filename, onClose }: { filename: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-30 p-6" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <Paperclip size={14} className="text-slate-400" /> {filename}
          </span>
          <button onClick={onClose}><X size={15} className="text-slate-400" /></button>
        </div>
        <div className="p-8 bg-slate-50">
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-2">
            <div className="h-3 w-2/3 bg-slate-100 rounded" />
            <div className="h-3 w-full bg-slate-100 rounded" />
            <div className="h-3 w-5/6 bg-slate-100 rounded" />
            <div className="h-3 w-1/2 bg-slate-100 rounded" />
          </div>
          <p className="text-xs text-slate-400 text-center mt-4">Preview placeholder — the real build opens this from Supabase Storage.</p>
        </div>
      </div>
    </div>
  );
}

function AttachmentLink({ filename, onOpen }: { filename: string | null; onOpen: (filename: string) => void }) {
  if (!filename) return <span className="text-xs text-slate-300">—</span>;
  return (
    <button onClick={() => onOpen(filename)} className="flex items-center gap-1 text-xs text-amber-700 hover:underline">
      <Paperclip size={12} /> {filename}
    </button>
  );
}

function SubmissionOverview({ students }: { students: AssignmentStudent[] }) {
  const total = students.length;
  const submitted = students.filter((s) => s.submitted ?? !!s.attachment).length;
  const notSubmitted = total - submitted;
  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="text-center">
        <p className="text-xs text-slate-400">Expected</p>
        <p className="text-2xl font-serif text-slate-900 mt-1">{total}</p>
      </Card>
      <Card className="text-center bg-emerald-50/40 border-emerald-200">
        <p className="text-xs text-slate-400">Submitted</p>
        <p className="text-2xl font-serif text-emerald-700 mt-1">{submitted}</p>
      </Card>
      <Card className="text-center bg-red-50/40 border-red-200">
        <p className="text-xs text-slate-400">Not submitted</p>
        <p className="text-2xl font-serif text-red-600 mt-1">{notSubmitted}</p>
      </Card>
    </div>
  );
}

// ============================================================
// Auth: Login gate
// ============================================================

function LoginGate({ onLogin }: { onLogin: (role: Role) => void }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <p className="font-serif text-3xl text-white text-center tracking-tight mb-1">
          ideate<span className="text-amber-500">X</span>
        </p>
        <p className="text-slate-400 text-sm text-center mb-8">Log in to your cohort</p>

        <Card className="bg-slate-900 border-slate-800">
          <div className="space-y-3">
            <input placeholder="Email" defaultValue="david.a@example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-500" />
            <input placeholder="Password" type="password" defaultValue="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-amber-500" />
          </div>
          <div className="mt-5 space-y-2">
            <button onClick={() => onLogin("student")}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-medium py-2.5 rounded-lg transition-colors">
              Continue as Student
            </button>
            <button onClick={() => onLogin("facilitator")}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors border border-slate-700">
              Continue as Facilitator
            </button>
            <button onClick={() => onLogin("admin")}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors border border-slate-700">
              Continue as Admin
            </button>
          </div>
        </Card>
        <p className="text-slate-500 text-xs text-center mt-4">Demo login — each account has exactly one role. There's no switcher once you're in.</p>
      </div>
    </div>
  );
}

// ============================================================
// Notifications
// ============================================================

function NotificationBell({ items }: { items: NotificationItem[] }) {
  const [open, setOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<number | null>(null);

  const close = () => {
    setOpen(false);
    setSelected(null);
  };

  const active = items.find((n) => n.id === selected) ?? null;

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="relative">
        <Bell size={18} className="text-slate-400" />
        {items.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {items.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden">
          {!active ? (
            <>
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100">
                <Eyebrow>Notifications</Eyebrow>
                <button onClick={close}><X size={13} className="text-slate-400" /></button>
              </div>
              {items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelected(n.id)}
                  className="w-full text-left px-3 py-2.5 text-sm text-slate-700 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                >
                  {n.header}
                </button>
              ))}
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-100">
                <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600">
                  <ChevronLeft size={15} />
                </button>
                <p className="text-sm font-medium text-slate-900 flex-1">{active.header}</p>
                <button onClick={close}><X size={13} className="text-slate-400" /></button>
              </div>
              <div className="px-3 py-3 text-sm text-slate-600 leading-relaxed">
                {active.details}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Feedback modal (US-S05)
// ============================================================

type RatingField = "content" | "pace" | "clarity" | "engagement";
type Ratings = Record<RatingField, number>;

function FeedbackModal({ onClose }: { onClose: () => void }) {
  const [ratings, setRatings] = useState<Ratings>({ content: 0, pace: 0, clarity: 0, engagement: 0 });
  const [comment, setComment] = useState<string>("");
  const complete = Object.values(ratings).every((v) => v > 0);

  function RatingRow({ label, field }: { label: string; field: RatingField }) {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-sm text-slate-600">{label}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button key={n} onClick={() => setRatings((r) => ({ ...r, [field]: n }))}>
              <Star size={18} className={n <= ratings[field] ? "text-amber-500 fill-amber-500" : "text-slate-200"} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-30 p-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <Eyebrow>Required before you continue</Eyebrow>
        <h2 className="text-lg font-serif text-slate-900 mb-1">How was Synthesis Workshop?</h2>
        <p className="text-xs text-slate-400 mb-3">This takes 30 seconds and unlocks the rest of the platform.</p>
        <div className="divide-y divide-slate-50">
          <RatingRow label="Content" field="content" />
          <RatingRow label="Pace" field="pace" />
          <RatingRow label="Clarity" field="clarity" />
          <RatingRow label="Engagement" field="engagement" />
        </div>
        <textarea
          value={comment}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
          placeholder="Anything else you'd like to share? (optional)"
          className="w-full mt-3 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 resize-none"
          rows={2}
        />
        <button
          disabled={!complete}
          onClick={onClose}
          className={`w-full mt-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            complete ? "bg-amber-500 hover:bg-amber-400 text-slate-900" : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          {complete ? "Submit feedback" : "Rate all four to continue"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Student: Dashboard
// ============================================================

function StudentDashboard() {
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [justLeft, setJustLeft] = useState<boolean>(false);

  return (
    <div className="space-y-6">
      {showFeedback && <FeedbackModal onClose={() => { setShowFeedback(false); setJustLeft(true); }} />}

      <div>
        <Eyebrow>Cohort 05 · Week 6</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">Good evening, David</h1>
      </div>

      {justLeft && (
        <Card className="bg-emerald-50 border-emerald-200 flex items-center gap-2 text-emerald-700 text-sm">
          <CheckCircle2 size={16} /> Feedback received — thanks. Access to the next resource is unlocked.
        </Card>
      )}

      <Card className="bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Video size={18} className="text-amber-400" />
          <div>
            <p className="font-medium">Synthesis Workshop starts in 2 hours</p>
            <p className="text-sm text-slate-400">Sat 10:00am · Facilitator: Rashidat Raheem</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Join Google Meet
          </button>
          <button onClick={() => setShowFeedback(true)} className="text-xs text-slate-400 underline underline-offset-2">
            Simulate: leave session
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <Eyebrow>This week</Eyebrow>
          <div className="space-y-3 mt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700">Fri 6:00pm — Discovery Interviews</span>
              <Pill tone="emerald">Attended</Pill>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700">Sat 10:00am — Synthesis Workshop</span>
              <Pill tone="amber">Upcoming</Pill>
            </div>
          </div>
        </Card>

        <Card className="flex items-center gap-5">
          <Gauge value={82} />
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-2xl font-serif text-slate-900 leading-none">82</p>
              <p className="text-xs text-slate-400">Commitment Score</p>
            </div>
            <MetricBar label="Attendance" value={86} tone="amber" />
            <MetricBar label="Assignments" value={75} tone="emerald" />
            <MetricBar label="Feedback" value={92} tone="slate" />
          </div>
        </Card>

        <Card>
          <Eyebrow>Resources</Eyebrow>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            <li>📄 Module 3 Slides</li>
            <li>🎥 Recording — Week 5</li>
            <li>🔗 Reading: Discovery Interviews Guide</li>
          </ul>
        </Card>

        <Card>
          <Eyebrow>Assignments</Eyebrow>
          <div className="mt-2 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Module 3 — due in 2 days</span>
              <Pill tone="red">Not submitted</Pill>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-700">Module 2</span>
              <Pill tone="emerald">Passed</Pill>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// Student: Schedule (US-A02, US-S03, curriculum gating)
// ============================================================

const SCHEDULE: ScheduleItem[] = [
  { week: 1, title: "Orientation & Problem Framing", date: "Fri 19 · Sat 20 Sep", status: "completed" },
  { week: 2, title: "Discovery Fundamentals", date: "Fri 26 · Sat 27 Sep", status: "completed" },
  { week: 3, title: "User Interviews", date: "Fri 3 · Sat 4 Oct", status: "completed" },
  { week: 4, title: "Synthesis & Insight Mapping", date: "Fri 10 · Sat 11 Oct", status: "completed" },
  { week: 5, title: "Problem-to-Solution Framing", date: "Fri 17 · Sat 18 Oct", status: "completed" },
  { week: 6, title: "Discovery Interviews & Synthesis", date: "Fri 14 · Sat 15 Nov", status: "current" },
  { week: 7, title: "Prioritization & Roadmapping", date: "Fri 21 · Sat 22 Nov", status: "locked", reason: "Unlocks once your Module 3 assignment shows Pass" },
  { week: 8, title: "Stakeholder Communication", date: "Fri 28 · Sat 29 Nov", status: "upcoming" },
];

function ExcuseModal({ onCancel, onSubmit }: { onCancel: () => void; onSubmit: (reason: string) => void }) {
  const [reason, setReason] = useState<string>("");
  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-30 p-6">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <Eyebrow>Advance excuse</Eyebrow>
        <h2 className="text-lg font-serif text-slate-900 mb-1">Why will you miss this session?</h2>
        <p className="text-xs text-slate-400 mb-3">Your coordinator reviews this before the session — approved excuses preserve your attendance credit.</p>
        <textarea
          value={reason}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setReason(e.target.value)}
          placeholder="e.g. Work travel conflict, family emergency…"
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 resize-none"
          rows={3}
          autoFocus
        />
        <div className="flex gap-2 mt-4">
          <GhostButton onClick={onCancel}>Cancel</GhostButton>
          <PrimaryButton
            onClick={() => reason.trim() && onSubmit(reason)}
            className={!reason.trim() ? "opacity-40 cursor-not-allowed" : ""}
          >
            Submit excuse
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

function StudentSchedule() {
  const [excused, setExcused] = useState<boolean>(false);
  const [showExcuseModal, setShowExcuseModal] = useState<boolean>(false);
  const [excuseReason, setExcuseReason] = useState<string>("");

  const statusPill = (status: ScheduleItem["status"]) => {
    if (status === "completed") return <Pill tone="emerald">Completed</Pill>;
    if (status === "current") return <Pill tone="amber">In progress</Pill>;
    if (status === "locked") return <Pill tone="red">Locked</Pill>;
    return <Pill>Upcoming</Pill>;
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {showExcuseModal && (
        <ExcuseModal
          onCancel={() => setShowExcuseModal(false)}
          onSubmit={(reason) => {
            setExcuseReason(reason);
            setExcused(true);
            setShowExcuseModal(false);
          }}
        />
      )}

      <div>
        <Eyebrow>Cohort 05</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">Full Schedule</h1>
      </div>

      <div className="space-y-3">
        {SCHEDULE.map((s) => (
          <Card key={s.week} className={s.status === "locked" ? "opacity-70" : ""}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {s.status === "locked" ? (
                  <Lock size={16} className="text-slate-400 mt-1 shrink-0" />
                ) : (
                  <span className="text-xs font-medium text-slate-400 mt-1 w-14 shrink-0">Wk {s.week}</span>
                )}
                <div>
                  <p className="text-slate-800 font-medium text-sm">{s.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.date}</p>
                  {s.reason && <p className="text-xs text-red-500 mt-1">{s.reason}</p>}
                </div>
              </div>
              {statusPill(s.status)}
            </div>

            {s.status === "current" && (
              <div className="flex items-center gap-3 mt-4 pl-[68px]">
                <button className="bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-medium px-3 py-1.5 rounded-lg">
                  Join Google Meet
                </button>
                {!excused ? (
                  <button onClick={() => setShowExcuseModal(true)} className="text-xs text-slate-500 underline">
                    Submit advance excuse
                  </button>
                ) : (
                  <Pill tone="amber">Excuse pending coordinator approval — "{excuseReason}"</Pill>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Student: Resources (US-S02)
// ============================================================

const RESOURCE_MODULES: ResourceModuleGroup[] = [
  { module: "Module 1 — Orientation", items: [
    { type: "slide", title: "Orientation Deck" },
    { type: "recording", title: "Session Recording" },
  ]},
  { module: "Module 2 — Discovery Fundamentals", items: [
    { type: "slide", title: "Discovery Methods Deck" },
    { type: "link", title: "Reading: Interviewing Users" },
  ]},
  { module: "Module 3 — User Interviews", items: [
    { type: "slide", title: "Interview Guide Template" },
    { type: "recording", title: "Session Recording" },
    { type: "link", title: "Reading: Discovery Interviews Guide" },
  ]},
];

const TYPE_ICON: Record<ResourceType, string> = { slide: "📄", recording: "🎥", link: "🔗" };

function StudentResources() {
  const [query, setQuery] = useState<string>("");

  const filtered = RESOURCE_MODULES.map((m) => ({
    ...m,
    items: m.items.filter((i) => i.title.toLowerCase().includes(query.toLowerCase())),
  })).filter((m) => m.items.length > 0);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Eyebrow>Cohort 05</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">My Resources</h1>
        <p className="text-sm text-slate-400 mt-1">Stays available on your dashboard for life — even after the cohort ends.</p>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder="Search resources…"
          className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-amber-400"
        />
      </div>

      {filtered.length === 0 && <p className="text-sm text-slate-400">No resources match "{query}".</p>}

      {filtered.map((m) => (
        <Card key={m.module}>
          <Eyebrow>{m.module}</Eyebrow>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {m.items.map((i) => (
              <li key={i.title} className="flex items-center gap-2">
                <span>{TYPE_ICON[i.type]}</span> {i.title}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

// ============================================================
// Student: Assignment Submission (US-S04)
// ============================================================

function AssignmentSubmission() {
  const [submitted, setSubmitted] = useState<boolean>(false);
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Eyebrow>Module 3</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">User Research Synthesis</h1>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Card>
          <Eyebrow>Due</Eyebrow>
          <p className="text-slate-800 font-medium mt-1">Sat, 14 Nov · 11:59pm</p>
          <p className="text-xs text-slate-400 mt-1">Locks Module 7 until submitted and passed</p>
        </Card>
        <Card>
          <Eyebrow>Status</Eyebrow>
          <p className="mt-1">
            {submitted ? <Pill tone="emerald">Submitted</Pill> : <Pill tone="red">Not submitted — 2 days left</Pill>}
          </p>
        </Card>
      </div>

      {!submitted ? (
        <Card className="border-dashed border-2 border-amber-300 bg-amber-50/40 text-center py-10">
          <UploadCloud className="mx-auto text-amber-500" size={32} />
          <p className="mt-3 text-slate-700 font-medium">Drag your file here, or</p>
          <button
            onClick={() => setSubmitted(true)}
            className="mt-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            Browse and submit
          </button>
          <p className="mt-3 text-xs text-slate-400">PDF, DOCX, PPTX, or a Figma link · max 25MB</p>
        </Card>
      ) : (
        <Card className="text-center py-10 border-emerald-200 bg-emerald-50/40">
          <CheckCircle2 className="mx-auto text-emerald-600" size={32} />
          <p className="mt-3 text-slate-800 font-medium">Submitted — Sat 12:04pm</p>
          <p className="text-sm text-slate-500 mt-1">David and the assigned tutor were notified. This timestamp is the system of record.</p>
        </Card>
      )}

      <Card>
        <Eyebrow>Submission history</Eyebrow>
        <div className="mt-2 space-y-2 text-sm text-slate-700">
          <div className="flex items-center justify-between">
            <span>Module 2 — submitted Wed 4:02pm</span>
            <Pill tone="emerald">Passed</Pill>
          </div>
          <div className="flex items-center justify-between">
            <span>Module 1 — submitted Fri 6:45pm</span>
            <Pill tone="emerald">Passed</Pill>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// Student: Community (US-S09, Phase 2)
// ============================================================

function StudentCommunity() {
  const [tab, setTab] = useState<"forum" | "groups">("forum");
  const [posts, setPosts] = useState<ForumPost[]>([
    { id: 1, title: "How do you structure interview notes before synthesis?", module: "Module 3", upvotes: 12, replies: 4, official: true },
    { id: 2, title: "Anyone free to practice mock interviews this weekend?", module: "Module 3", upvotes: 5, replies: 2, official: false },
  ]);
  const [draft, setDraft] = useState<string>("");
  const [groups, setGroups] = useState<StudyGroup[]>([
    { id: 1, name: "Discovery Interviews Study Group", members: 6, joined: true },
    { id: 2, name: "Portfolio Review Circle", members: 9, joined: false },
  ]);

  const upvote = (id: number) => setPosts((p) => p.map((x) => (x.id === id ? { ...x, upvotes: x.upvotes + 1 } : x)));
  const addPost = () => {
    if (!draft.trim()) return;
    setPosts((p) => [{ id: Date.now(), title: draft, module: "Module 3", upvotes: 0, replies: 0, official: false }, ...p]);
    setDraft("");
  };
  const toggleGroup = (id: number) =>
    setGroups((g) => g.map((x) => (x.id === id ? { ...x, joined: !x.joined, members: x.members + (x.joined ? -1 : 1) } : x)));

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Eyebrow>Cohort 05</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">Community</h1>
      </div>

      <div className="flex bg-slate-100 rounded-lg p-1 text-sm w-fit">
        <button onClick={() => setTab("forum")} className={`px-3 py-1 rounded-md font-medium transition-colors ${tab === "forum" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>Forum</button>
        <button onClick={() => setTab("groups")} className={`px-3 py-1 rounded-md font-medium transition-colors ${tab === "groups" ? "bg-white shadow-sm text-slate-900" : "text-slate-500"}`}>Study groups</button>
      </div>

      {tab === "forum" ? (
        <div className="space-y-4">
          <Card>
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
                placeholder="Ask the cohort something…"
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
              />
              <PrimaryButton onClick={addPost}>Post</PrimaryButton>
            </div>
          </Card>

          {posts.map((post) => (
            <Card key={post.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-800">{post.title}</p>
                    {post.official && <Pill tone="emerald"><span className="inline-flex items-center gap-1"><Award size={11} /> Official answer</span></Pill>}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{post.module}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => upvote(post.id)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-amber-600">
                    <ThumbsUp size={13} /> {post.upvotes}
                  </button>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <MessageCircle size={13} /> {post.replies}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((g) => (
            <Card key={g.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">{g.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{g.members} members</p>
              </div>
              {g.joined ? (
                <GhostButton onClick={() => toggleGroup(g.id)}>Joined ✓</GhostButton>
              ) : (
                <PrimaryButton onClick={() => toggleGroup(g.id)}>Join</PrimaryButton>
              )}
            </Card>
          ))}
          <button className="text-sm text-amber-700 font-medium flex items-center gap-1">
            <Plus size={14} /> New study group
          </button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Admin: Dashboard
// ============================================================

function AdminDashboard() {
  const kpis: { label: string; value: string; tone: Tone }[] = [
    { label: "Total students", value: "842", tone: "slate" },
    { label: "Avg attendance", value: "88%", tone: "emerald" },
    { label: "Pending reviews", value: "37", tone: "amber" },
    { label: "At-risk students", value: "14", tone: "red" },
  ];
  const tones: Record<Tone, string> = { slate: "text-slate-900", emerald: "text-emerald-700", amber: "text-amber-700", red: "text-red-700" };
  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Program overview</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">Admin Overview</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <p className="text-xs text-slate-400">{k.label}</p>
            <p className={`text-3xl font-serif mt-1 ${tones[k.tone]}`}>{k.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <Eyebrow>Active cohorts</Eyebrow>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2 font-normal">Cohort</th>
              <th className="py-2 font-normal">Students</th>
              <th className="py-2 font-normal">Attendance</th>
              <th className="py-2 font-normal">Assignments</th>
              <th className="py-2 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            <tr className="border-b border-slate-50">
              <td className="py-2.5">Cohort 5</td><td>62</td><td>88%</td><td>80%</td>
              <td><Pill tone="emerald">Active</Pill></td>
            </tr>
            <tr className="border-b border-slate-50">
              <td className="py-2.5">Cohort 6</td><td>58</td><td>91%</td><td>74%</td>
              <td><Pill tone="emerald">Active</Pill></td>
            </tr>
            <tr>
              <td className="py-2.5">Cohort 4 · Alumni</td><td>55</td><td>—</td><td>—</td>
              <td><Pill>Completed</Pill></td>
            </tr>
          </tbody>
        </table>
      </Card>

      <div className="flex flex-wrap gap-3">
        <PrimaryButton>+ Create cohort</PrimaryButton>
        <GhostButton>+ Schedule live class</GhostButton>
        <GhostButton>+ Send announcement</GhostButton>
      </div>
    </div>
  );
}

// ============================================================
// Admin: Users (US-A01)
// ============================================================

const INITIAL_USERS: PlatformUser[] = [
  { id: 1, name: "David Adeleke", email: "david.a@example.com", role: "Student", cohort: "Cohort 5", active: true },
  { id: 2, name: "Rashidat Raheem", email: "rashidat@example.com", role: "Facilitator", cohort: "Cohort 5", active: true },
  { id: 3, name: "Aderonke Mercy", email: "aderonke@example.com", role: "Coordinator", cohort: "Cohort 6", active: true },
  { id: 4, name: "Emmanuel Kalasuwe", email: "emmanuel.k@example.com", role: "Student", cohort: "Cohort 4 · Alumni", active: false },
];

function AdminUsers() {
  const [users, setUsers] = useState<PlatformUser[]>(INITIAL_USERS);
  const [query, setQuery] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [form, setForm] = useState<NewUserForm>({ name: "", email: "", role: "Student", cohort: "Cohort 5" });

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase())
  );

  const addUser = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setUsers((u) => [{ id: Date.now(), ...form, active: true }, ...u]);
    setForm({ name: "", email: "", role: "Student", cohort: "Cohort 5" });
    setShowForm(false);
  };

  const toggleActive = (id: number) => setUsers((u) => u.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Eyebrow>Platform users</Eyebrow>
          <h1 className="text-2xl font-serif text-slate-900">Users</h1>
        </div>
        <PrimaryButton onClick={() => setShowForm((s) => !s)}>+ Add user</PrimaryButton>
      </div>

      {showForm && (
        <Card className="bg-amber-50/40 border-amber-200">
          <Eyebrow>New user</Eyebrow>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <input placeholder="Full name" value={form.name} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
            <input placeholder="Email" value={form.email} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
            <select value={form.role} onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, role: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400">
              <option>Student</option><option>Facilitator</option><option>Coordinator</option><option>Admin</option>
            </select>
            <select value={form.cohort} onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, cohort: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400">
              <option>Cohort 5</option><option>Cohort 6</option><option>Cohort 4 · Alumni</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <PrimaryButton onClick={addUser}>Create & send activation email</PrimaryButton>
            <GhostButton onClick={() => setShowForm(false)}>Cancel</GhostButton>
          </div>
        </Card>
      )}

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-amber-400"
        />
      </div>

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2 font-normal">Name</th>
              <th className="py-2 font-normal">Email</th>
              <th className="py-2 font-normal">Role</th>
              <th className="py-2 font-normal">Cohort</th>
              <th className="py-2 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5">{u.name}</td>
                <td className="text-slate-500">{u.email}</td>
                <td>{u.role}</td>
                <td>{u.cohort}</td>
                <td>
                  <button onClick={() => toggleActive(u.id)}>
                    {u.active ? <Pill tone="emerald">Active</Pill> : <Pill tone="red">Inactive</Pill>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ============================================================
// Admin: Cohorts (standalone)
// ============================================================

function AdminCohorts() {
  const [selected, setSelected] = useState<string>("Cohort 5");
  const cohorts = ["Cohort 5", "Cohort 6", "Cohort 4 · Alumni"];

  return (
    <div className="grid grid-cols-[220px_1fr] gap-6">
      <Card className="p-3">
        <Eyebrow>Cohorts</Eyebrow>
        <div className="mt-2 space-y-1">
          {cohorts.map((c) => (
            <button
              key={c}
              onClick={() => setSelected(c)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                selected === c ? "bg-amber-50 text-amber-800 font-medium" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <button className="w-full mt-2 text-left text-sm px-3 py-2 rounded-lg text-slate-400 border border-dashed border-slate-200">
          + New cohort
        </button>
      </Card>

      <div className="space-y-5">
        <div>
          <Eyebrow>Cohort detail</Eyebrow>
          <h1 className="text-2xl font-serif text-slate-900">{selected}</h1>
        </div>

        <Card>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-slate-400">Start</p><p className="text-slate-800 font-medium">04 Oct 2026</p></div>
            <div><p className="text-slate-400">End</p><p className="text-slate-800 font-medium">20 Dec 2026</p></div>
            <div><p className="text-slate-400">Instructors</p><p className="text-slate-800 font-medium">Rashidat Raheem, Faith Ojiakor</p></div>
            <div><p className="text-slate-400">Weekly schedule</p><p className="text-slate-800 font-medium">Fri 6:00pm · Sat 10:00am</p></div>
          </div>
        </Card>

        <Card>
          <Eyebrow>Learning materials — Module 3</Eyebrow>
          <div className="mt-2 space-y-2 text-sm text-slate-700">
            <div className="flex items-center justify-between">
              <span>📄 User Research.pptx</span>
              <Pill tone="emerald">Published</Pill>
            </div>
            <div className="flex items-center justify-between">
              <span>🎥 Session recording</span>
              <Pill tone="amber">Auto-attach in 24h</Pill>
            </div>
          </div>
          <button className="mt-3 text-sm text-amber-700 font-medium">+ Upload material</button>
        </Card>

        <div className="flex gap-3">
          <GhostButton>Save draft</GhostButton>
          <PrimaryButton>Publish Schedule</PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Admin: Classes (standalone — live class scheduling)
// ============================================================

function AdminClasses() {
  const [cohort, setCohort] = useState<string>("Cohort 5");
  const [sessions, setSessions] = useState<LiveClassSession[]>([
    { id: 1, title: "Synthesis Workshop", date: "Sat 15 Nov, 10:00am", facilitator: "Rashidat Raheem" },
    { id: 2, title: "Discovery Interviews", date: "Fri 14 Nov, 6:00pm", facilitator: "Rashidat Raheem" },
  ]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [form, setForm] = useState<NewSessionForm>({ title: "", date: "", facilitator: "Rashidat Raheem", link: "" });

  const addSession = () => {
    if (!form.title.trim() || !form.date.trim()) return;
    setSessions((s) => [...s, { id: Date.now(), title: form.title, date: form.date, facilitator: form.facilitator }]);
    setForm({ title: "", date: "", facilitator: "Rashidat Raheem", link: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <Eyebrow>Live class scheduling</Eyebrow>
          <h1 className="text-2xl font-serif text-slate-900">Classes</h1>
        </div>
        <select value={cohort} onChange={(e: ChangeEvent<HTMLSelectElement>) => setCohort(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400">
          <option>Cohort 5</option><option>Cohort 6</option><option>Cohort 4 · Alumni</option>
        </select>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-1">
          <Eyebrow>{cohort} — Scheduled Classes</Eyebrow>
          <button onClick={() => setShowForm((s) => !s)} className="text-xs text-amber-700 font-medium">+ Schedule</button>
        </div>
        {showForm && (
          <div className="grid grid-cols-2 gap-2 bg-amber-50/40 border border-amber-200 rounded-lg p-3 mb-3 mt-2">
            <input placeholder="Session title" value={form.title} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, title: e.target.value })}
              className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
            <input placeholder="Date & time (e.g. Sat 22 Nov, 10:00am)" value={form.date} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, date: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
            <select value={form.facilitator} onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, facilitator: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400">
              <option>Rashidat Raheem</option><option>Faith Ojiakor</option>
            </select>
            <input placeholder="Google Meet link" value={form.link} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, link: e.target.value })}
              className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
            <div className="col-span-2 flex gap-2">
              <PrimaryButton onClick={addSession}>Schedule & send reminders</PrimaryButton>
              <GhostButton onClick={() => setShowForm(false)}>Cancel</GhostButton>
            </div>
          </div>
        )}
        <div className="space-y-2 text-sm text-slate-700 mt-2">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between">
              <span>{s.title} — {s.date} · {s.facilitator}</span>
              <Pill tone="emerald">Reminders scheduled</Pill>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// Admin: Assignments (cohort, student, attachment, grade)
// ============================================================

const ADMIN_ASSIGNMENTS_SEED: Assignment[] = [
  {
    id: 1,
    title: "User Research Synthesis",
    cohort: "Cohort 5",
    module: "Module 3",
    dueDate: "Sat, 14 Nov",
    attachment: "brief_module3.pdf",
    students: [
      { name: "David Adeleke", submitted: true, attachment: "david_m3.pdf", grade: "" },
      { name: "Chidi Okafor", submitted: true, attachment: "chidi_m3.pdf", grade: "Pass" },
      { name: "Amaka Obi", submitted: false, attachment: null, grade: "" },
    ],
  },
];

function AdminAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>(ADMIN_ASSIGNMENTS_SEED);
  const [selectedId, setSelectedId] = useState<number>(ADMIN_ASSIGNMENTS_SEED[0].id);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [form, setForm] = useState<NewAssignmentForm>({ title: "", cohort: "Cohort 5", module: "", dueDate: "", attachment: "" });
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const selected = assignments.find((a) => a.id === selectedId) ?? null;

  const addAssignment = () => {
    if (!form.title.trim()) return;
    const newAssignment: Assignment = {
      id: Date.now(),
      title: form.title,
      cohort: form.cohort,
      module: form.module || "Unassigned",
      dueDate: form.dueDate || "TBD",
      attachment: form.attachment || null,
      students: [],
    };
    setAssignments((a) => [newAssignment, ...a]);
    setSelectedId(newAssignment.id);
    setForm({ title: "", cohort: "Cohort 5", module: "", dueDate: "", attachment: "" });
    setShowForm(false);
  };

  const setGrade = (studentName: string, grade: string) => {
    setAssignments((all) =>
      all.map((a) =>
        a.id !== selectedId ? a : { ...a, students: a.students.map((s) => (s.name === studentName ? { ...s, grade } : s)) }
      )
    );
  };

  return (
    <div className="grid grid-cols-[280px_1fr] gap-6">
      {previewFile && <AttachmentPreviewModal filename={previewFile} onClose={() => setPreviewFile(null)} />}

      <Card className="p-3">
        <div className="flex items-center justify-between mb-1">
          <Eyebrow>Assignments</Eyebrow>
          <button onClick={() => setShowForm((s) => !s)} className="text-xs text-amber-700 font-medium">+ Add</button>
        </div>
        {showForm && (
          <div className="space-y-2 bg-amber-50/40 border border-amber-200 rounded-lg p-3 mb-2">
            <input placeholder="Assignment title" value={form.title} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-amber-400" />
            <select value={form.cohort} onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, cohort: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-amber-400">
              <option>Cohort 5</option><option>Cohort 6</option><option>Cohort 4 · Alumni</option>
            </select>
            <input placeholder="Module (e.g. Module 4)" value={form.module} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, module: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-amber-400" />
            <input placeholder="Due date" value={form.dueDate} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-amber-400" />
            <button className="w-full flex items-center justify-center gap-1 border border-dashed border-slate-300 rounded-lg py-1.5 text-xs text-slate-500">
              <Paperclip size={12} /> Attach brief (PDF/DOCX/link)
            </button>
            <div className="flex gap-2">
              <PrimaryButton onClick={addAssignment} className="!py-1.5 !text-xs">Create</PrimaryButton>
              <GhostButton onClick={() => setShowForm(false)} className="!py-1.5 !text-xs">Cancel</GhostButton>
            </div>
          </div>
        )}
        <div className="space-y-1">
          {assignments.map((a) => (
            <button
              key={a.id}
              onClick={() => setSelectedId(a.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedId === a.id ? "bg-amber-50 text-amber-800 font-medium" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {a.title}
              <span className="block text-xs text-slate-400">{a.cohort} · {a.module}</span>
            </button>
          ))}
        </div>
      </Card>

      {selected && (
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Eyebrow>{selected.cohort} · {selected.module} · Due {selected.dueDate}</Eyebrow>
              <h1 className="text-2xl font-serif text-slate-900">{selected.title}</h1>
            </div>
            <Pill tone="amber">Gradable by Admin &amp; Facilitator</Pill>
          </div>

          <Card className="flex items-center gap-2 text-sm text-slate-600">
            <Paperclip size={14} className="text-slate-400" />
            {selected.attachment ? (
              <button onClick={() => setPreviewFile(selected.attachment)} className="text-amber-700 hover:underline">{selected.attachment}</button>
            ) : (
              "No brief attached"
            )}
          </Card>

          <SubmissionOverview students={selected.students} />

          <Card>
            <Eyebrow>Students · Attachments · Grade</Eyebrow>
            <table className="w-full text-sm mt-2">
              <thead>
                <tr className="text-left text-slate-400 border-b border-slate-100">
                  <th className="py-2 font-normal">Student</th>
                  <th className="py-2 font-normal">Submission</th>
                  <th className="py-2 font-normal">Attachment</th>
                  <th className="py-2 font-normal">Grade</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {selected.students.length === 0 && (
                  <tr><td colSpan={4} className="py-3 text-slate-400">No students enrolled on this assignment yet.</td></tr>
                )}
                {selected.students.map((s) => (
                  <tr key={s.name} className="border-b border-slate-50 last:border-0">
                    <td className="py-2.5">{s.name}</td>
                    <td>{s.submitted ? <Pill tone="emerald">Submitted</Pill> : <Pill tone="red">Not submitted</Pill>}</td>
                    <td><AttachmentLink filename={s.attachment} onOpen={setPreviewFile} /></td>
                    <td>
                      <select
                        value={s.grade}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setGrade(s.name, e.target.value)}
                        disabled={!s.submitted}
                        className="border border-slate-200 rounded-md px-2 py-1 text-xs outline-none focus:border-amber-400 disabled:opacity-40"
                      >
                        <option value="">— Grade —</option>
                        <option value="Pass">Pass</option>
                        <option value="Fail">Fail</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Admin: Accountability (US-A06)
// ============================================================

const RANKED_STUDENTS: RankedStudent[] = [
  { name: "Chidi Okafor", score: 94, attendance: 97, assignments: 100, feedback: 90, status: "Good standing" },
  { name: "David Adeleke", score: 82, attendance: 86, assignments: 75, feedback: 92, status: "Good standing" },
  { name: "Amaka Obi", score: 52, attendance: 58, assignments: 50, feedback: 60, status: "At risk" },
  { name: "Tunde Bakare", score: 38, attendance: 40, assignments: 30, feedback: 45, status: "Strike issued" },
];

function AdminAccountability() {
  const [excuses, setExcuses] = useState<ExcuseRequest[]>([
    { id: 1, student: "Chioma Nwosu", session: "Sat 15 Nov — Synthesis Workshop", reason: "Work travel conflict" },
  ]);
  const [appeals, setAppeals] = useState<AppealRequest[]>([
    { id: 1, student: "Tunde Bakare", reason: "Internet outage during the Module 2 deadline" },
  ]);
  const [note, setNote] = useState<string>("");

  const resolveExcuse = (id: number, approved: boolean) => {
    setExcuses((e) => e.filter((x) => x.id !== id));
    setNote(approved ? "Excuse approved — attendance credit preserved." : "Excuse rejected — absence stands.");
    setTimeout(() => setNote(""), 2500);
  };
  const resolveAppeal = (id: number, overturned: boolean) => {
    setAppeals((a) => a.filter((x) => x.id !== id));
    setNote(overturned ? "Strike overturned." : "Strike upheld.");
    setTimeout(() => setNote(""), 2500);
  };

  const statusTone = (s: RankedStudent["status"]): Tone => (s === "Good standing" ? "emerald" : s === "At risk" ? "amber" : "red");

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Cohort 05</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">Accountability</h1>
      </div>

      {note && <Card className="bg-emerald-50 border-emerald-200 text-emerald-700 text-sm py-2">✓ {note}</Card>}

      <Card>
        <Eyebrow>Commitment Score — ranked</Eyebrow>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2 font-normal">Student</th>
              <th className="py-2 font-normal">Score</th>
              <th className="py-2 font-normal">Attendance</th>
              <th className="py-2 font-normal">Assignments</th>
              <th className="py-2 font-normal">Feedback</th>
              <th className="py-2 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {RANKED_STUDENTS.map((s) => (
              <tr key={s.name} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5">{s.name}</td>
                <td className="font-medium">{s.score}</td>
                <td>{s.attendance}%</td>
                <td>{s.assignments}%</td>
                <td>{s.feedback}%</td>
                <td><Pill tone={statusTone(s.status)}>{s.status}</Pill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="grid grid-cols-2 gap-5">
        <Card>
          <Eyebrow>Pending excuses</Eyebrow>
          <div className="mt-2 space-y-3">
            {excuses.length === 0 && <p className="text-sm text-slate-400">Queue is clear.</p>}
            {excuses.map((e) => (
              <div key={e.id} className="text-sm border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                <p className="text-slate-800 font-medium">{e.student}</p>
                <p className="text-slate-500 text-xs mt-0.5">{e.session}</p>
                <p className="text-slate-500 text-xs italic mt-0.5">"{e.reason}"</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => resolveExcuse(e.id, true)} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-medium">Approve</button>
                  <button onClick={() => resolveExcuse(e.id, false)} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-md font-medium">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <Eyebrow>Pending strike appeals</Eyebrow>
          <div className="mt-2 space-y-3">
            {appeals.length === 0 && <p className="text-sm text-slate-400">Queue is clear.</p>}
            {appeals.map((a) => (
              <div key={a.id} className="text-sm border-b border-slate-50 last:border-0 pb-3 last:pb-0">
                <p className="text-slate-800 font-medium">{a.student}</p>
                <p className="text-slate-500 text-xs italic mt-0.5">"{a.reason}"</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => resolveAppeal(a.id, true)} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md font-medium">Overturn strike</button>
                  <button onClick={() => resolveAppeal(a.id, false)} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-md font-medium">Uphold strike</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================================
// Admin: Announcements (Phase 2)
// ============================================================

function AdminAnnouncements() {
  const [target, setTarget] = useState<string>("Cohort 5");
  const [message, setMessage] = useState<string>("");
  const [sent, setSent] = useState<Announcement[]>([
    { id: 1, target: "Cohort 5", message: "Module 3 recordings are now live on your dashboard.", time: "2 days ago", read: 41, total: 62 },
  ]);

  const send = () => {
    if (!message.trim()) return;
    setSent((s) => [{ id: Date.now(), target, message, time: "just now", read: 0, total: target === "All cohorts" ? 175 : 60 }, ...s]);
    setMessage("");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Eyebrow>Communication</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">Announcements</h1>
      </div>

      <Card>
        <div className="flex gap-2 mb-2">
          <select value={target} onChange={(e: ChangeEvent<HTMLSelectElement>) => setTarget(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400">
            <option>Cohort 5</option><option>Cohort 6</option><option>All cohorts</option>
          </select>
        </div>
        <textarea
          value={message}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          placeholder="Write an announcement…"
          rows={3}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 resize-none"
        />
        <PrimaryButton className="mt-3" onClick={send}>Send announcement</PrimaryButton>
      </Card>

      <div className="space-y-3">
        {sent.map((s) => (
          <Card key={s.id}>
            <div className="flex items-center justify-between mb-1">
              <Pill>{s.target}</Pill>
              <span className="text-xs text-slate-400">{s.time}</span>
            </div>
            <p className="text-sm text-slate-700">{s.message}</p>
            <p className="text-xs text-slate-400 mt-2">{s.read} of {s.total} read</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Admin: Reports (US-A10, Phase 2)
// ============================================================

function AdminReports() {
  const [cohort, setCohort] = useState<string>("Cohort 5");
  const [type, setType] = useState<ReportType>("Completion");
  const [generated, setGenerated] = useState<boolean>(false);
  const [downloadNote, setDownloadNote] = useState<string>("");

  const rows: Record<ReportType, ReportRow[]> = {
    Completion: [["David Adeleke", "On track", "86%"], ["Chidi Okafor", "On track", "94%"], ["Amaka Obi", "At risk", "52%"]],
    Attendance: [["David Adeleke", "Present", "86%"], ["Chidi Okafor", "Present", "97%"], ["Amaka Obi", "Absent x2", "58%"]],
    Assignment: [["David Adeleke", "3/4 passed", "75%"], ["Chidi Okafor", "4/4 passed", "100%"], ["Amaka Obi", "2/4 passed", "50%"]],
  };

  const download = (fmt: "csv" | "pdf") => {
    setDownloadNote(`${cohort.replace(/\s/g, "_")}_${type}_report.${fmt} downloaded`);
    setTimeout(() => setDownloadNote(""), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Program reports</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">Reports</h1>
      </div>

      <Card>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-slate-400 mb-1">Cohort</p>
            <select value={cohort} onChange={(e: ChangeEvent<HTMLSelectElement>) => { setCohort(e.target.value); setGenerated(false); }}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400">
              <option>Cohort 5</option><option>Cohort 6</option><option>Cohort 4 · Alumni</option>
            </select>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Report type</p>
            <select value={type} onChange={(e: ChangeEvent<HTMLSelectElement>) => { setType(e.target.value as ReportType); setGenerated(false); }}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400">
              <option>Completion</option><option>Attendance</option><option>Assignment</option>
            </select>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Date range</p>
            <div className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500">Cohort start — today</div>
          </div>
        </div>
        <PrimaryButton className="mt-4" onClick={() => setGenerated(true)}>Generate report</PrimaryButton>
      </Card>

      {generated && (
        <Card>
          <div className="flex items-center justify-between mb-3">
            <Eyebrow>{cohort} — {type} report</Eyebrow>
            <div className="flex gap-2">
              <GhostButton onClick={() => download("csv")}><span className="flex items-center gap-1"><Download size={13} /> CSV</span></GhostButton>
              <GhostButton onClick={() => download("pdf")}><span className="flex items-center gap-1"><Download size={13} /> PDF</span></GhostButton>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-400 border-b border-slate-100">
                <th className="py-2 font-normal">Student</th>
                <th className="py-2 font-normal">Status</th>
                <th className="py-2 font-normal">Rate</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {rows[type].map((r) => (
                <tr key={r[0]} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {downloadNote && <p className="text-xs text-emerald-600 mt-3">✓ {downloadNote}</p>}
        </Card>
      )}
    </div>
  );
}

// ============================================================
// Facilitator: My Sessions (restricted — own sessions only)
// ============================================================

function FacilitatorSessions() {
  const mySessions: FacilitatorSessionItem[] = [
    { id: 1, title: "Synthesis Workshop", cohort: "Cohort 5", date: "Sat 15 Nov, 10:00am", status: "upcoming" },
    { id: 2, title: "Discovery Interviews", cohort: "Cohort 5", date: "Fri 14 Nov, 6:00pm", status: "completed" },
    { id: 3, title: "Portfolio Review", cohort: "Cohort 6", date: "Fri 21 Nov, 6:00pm", status: "upcoming" },
  ];
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Eyebrow>Facilitator</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">My Sessions</h1>
        <p className="text-sm text-slate-400 mt-1">Only sessions you're assigned to — cohort management and scheduling belong to Admin.</p>
      </div>
      <div className="space-y-3">
        {mySessions.map((s) => (
          <Card key={s.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">{s.title}</p>
              <p className="text-xs text-slate-400 mt-0.5">{s.cohort} · {s.date}</p>
            </div>
            {s.status === "upcoming" ? (
              <button className="bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-medium px-3 py-1.5 rounded-lg">Join Google Meet</button>
            ) : (
              <Pill tone="emerald">Completed</Pill>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Facilitator: My Feedback (restricted — own ratings only)
// ============================================================

function FacilitatorFeedback() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Eyebrow>Facilitator</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">My Feedback</h1>
      </div>

      <Card className="flex items-center gap-6">
        <div>
          <p className="text-3xl font-serif text-slate-900">4.6<span className="text-base text-slate-400">/5</span></p>
          <p className="text-xs text-slate-400 mt-1">Average across Cohort 5</p>
        </div>
        <div className="flex-1 space-y-2">
          <MetricBar label="Content" value={94} tone="amber" />
          <MetricBar label="Pace" value={86} tone="emerald" />
          <MetricBar label="Clarity" value={90} tone="slate" />
          <MetricBar label="Engagement" value={88} tone="amber" />
        </div>
      </Card>

      <Card>
        <Eyebrow>Feedback not yet completed — Synthesis Workshop</Eyebrow>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          <li>Chioma Nwosu</li>
          <li>Tunde Bakare</li>
        </ul>
      </Card>
    </div>
  );
}

// ============================================================
// Facilitator: Assignments (grading — restricted to own cohort)
// ============================================================

const FACILITATOR_ASSIGNMENT_STUDENTS: AssignmentStudent[] = [
  { name: "David Adeleke", attachment: "david_m3.pdf", grade: "" },
  { name: "Chidi Okafor", attachment: "chidi_m3.pdf", grade: "Pass" },
  { name: "Amaka Obi", attachment: null, grade: "" },
];

function FacilitatorAssignments() {
  const [students, setStudents] = useState<AssignmentStudent[]>(FACILITATOR_ASSIGNMENT_STUDENTS);
  const [previewFile, setPreviewFile] = useState<string | null>(null);

  const setGrade = (name: string, grade: string) => {
    setStudents((all) => all.map((s) => (s.name === name ? { ...s, grade } : s)));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {previewFile && <AttachmentPreviewModal filename={previewFile} onClose={() => setPreviewFile(null)} />}

      <div>
        <Eyebrow>Cohort 5 · Module 3</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">User Research Synthesis</h1>
        <p className="text-sm text-slate-400 mt-1">Grading for the students assigned to your sessions.</p>
      </div>

      <SubmissionOverview students={students} />

      <Card>
        <Eyebrow>Students · Attachments · Grade</Eyebrow>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2 font-normal">Student</th>
              <th className="py-2 font-normal">Attachment</th>
              <th className="py-2 font-normal">Grade</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {students.map((s) => (
              <tr key={s.name} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5">{s.name}</td>
                <td><AttachmentLink filename={s.attachment} onOpen={setPreviewFile} /></td>
                <td>
                  <select
                    value={s.grade}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setGrade(s.name, e.target.value)}
                    disabled={!s.attachment}
                    className="border border-slate-200 rounded-md px-2 py-1 text-xs outline-none focus:border-amber-400 disabled:opacity-40"
                  >
                    <option value="">— Grade —</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ============================================================
// Facilitator: Materials (articles, links, PDFs)
// ============================================================

const MATERIAL_TYPE_META: Record<MaterialType, { icon: IconType; label: string }> = {
  pdf: { icon: FileText, label: "PDF" },
  article: { icon: FileText, label: "Article" },
  link: { icon: Link2, label: "Link" },
};

function FacilitatorMaterials() {
  const [materials, setMaterials] = useState<Material[]>([
    { id: 1, type: "pdf", title: "Interview Guide Template" },
    { id: 2, type: "article", title: "Writing Better Discovery Questions" },
    { id: 3, type: "link", title: "Reading: Discovery Interviews Guide" },
  ]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [form, setForm] = useState<NewMaterialForm>({ type: "pdf", title: "" });

  const addMaterial = () => {
    if (!form.title.trim()) return;
    setMaterials((m) => [{ id: Date.now(), type: form.type, title: form.title }, ...m]);
    setForm({ type: "pdf", title: "" });
    setShowForm(false);
  };

  const removeMaterial = (id: number) => setMaterials((m) => m.filter((x) => x.id !== id));

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <Eyebrow>Cohort 5 · Module 3</Eyebrow>
          <h1 className="text-2xl font-serif text-slate-900">Materials</h1>
        </div>
        <PrimaryButton onClick={() => setShowForm((s) => !s)}>+ Add material</PrimaryButton>
      </div>

      {showForm && (
        <Card className="bg-amber-50/40 border-amber-200">
          <div className="grid grid-cols-3 gap-2">
            <select value={form.type} onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, type: e.target.value as MaterialType })}
              className="border border-slate-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-amber-400">
              <option value="pdf">PDF</option>
              <option value="article">Article</option>
              <option value="link">Link</option>
            </select>
            <input placeholder="Title" value={form.title} onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, title: e.target.value })}
              className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400" />
          </div>
          <div className="flex gap-2 mt-3">
            <PrimaryButton onClick={addMaterial}>Add</PrimaryButton>
            <GhostButton onClick={() => setShowForm(false)}>Cancel</GhostButton>
          </div>
        </Card>
      )}

      <Card>
        <div className="space-y-2">
          {materials.length === 0 && <p className="text-sm text-slate-400">No materials yet.</p>}
          {materials.map((m) => {
            const meta = MATERIAL_TYPE_META[m.type];
            const Icon = meta.icon;
            return (
              <div key={m.id} className="flex items-center justify-between text-sm text-slate-700 border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                <span className="flex items-center gap-2"><Icon size={14} className="text-slate-400" /> {m.title}</span>
                <span className="flex items-center gap-2">
                  <Pill>{meta.label}</Pill>
                  <button onClick={() => removeMaterial(m.id)} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1">
                    <X size={12} /> Remove
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ============================================================
// Shell
// ============================================================

interface Identity {
  initials: string;
  name: string;
}

export default function IdeateXPrototype() {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [role, setRole] = useState<Role>("student");
  const [studentScreen, setStudentScreen] = useState<string>("dashboard");
  const [adminScreen, setAdminScreen] = useState<string>("dashboard");
  const [facilitatorScreen, setFacilitatorScreen] = useState<string>("sessions");
  const [noticeOpen, setNoticeOpen] = useState<boolean>(true);

  const NAV_BY_ROLE: Record<Role, NavItem[]> = { student: STUDENT_NAV, admin: ADMIN_NAV, facilitator: FACILITATOR_NAV };
  const SCREEN_BY_ROLE: Record<Role, string> = { student: studentScreen, admin: adminScreen, facilitator: facilitatorScreen };
  const SET_SCREEN_BY_ROLE: Record<Role, (screen: string) => void> = { student: setStudentScreen, admin: setAdminScreen, facilitator: setFacilitatorScreen };
  const IDENTITY_BY_ROLE: Record<Role, Identity> = {
    student: { initials: "DA", name: "David A." },
    admin: { initials: "RS", name: "Raphael S." },
    facilitator: { initials: "RR", name: "Rashidat R." },
  };

  const nav = NAV_BY_ROLE[role];
  const screen = SCREEN_BY_ROLE[role];
  const setScreen = SET_SCREEN_BY_ROLE[role];
  const identity = IDENTITY_BY_ROLE[role];

  const NOTIFICATIONS_BY_ROLE: Record<Role, NotificationItem[]> = {
    student: [
      { id: 1, header: "Class starting soon", details: "Synthesis Workshop starts in 2 hours — Sat 10:00am with Rashidat Raheem. Join from your Schedule page or the Dashboard banner." },
      { id: 2, header: "Assignment due soon", details: "Module 3 — User Research Synthesis is due in 2 days (Sat, 14 Nov, 11:59pm). This assignment gates Module 7, so submitting on time keeps your schedule unlocked." },
      { id: 3, header: "Facilitator profile published", details: "Rashidat Raheem's profile is now available ahead of Saturday's session — view her background and bio from the Schedule page." },
    ],
    admin: [
      { id: 1, header: "14 students flagged at-risk", details: "14 students across Cohort 5 and Cohort 6 have a Commitment Score below the 60-point threshold this week. Review them under Accountability." },
      { id: 2, header: "37 assignments pending review", details: "37 submissions across active cohorts are awaiting grading. The oldest submission has been waiting 3 days." },
      { id: 3, header: "New excuse request", details: "Chioma Nwosu requested an excuse for Synthesis Workshop (Sat 15 Nov) — reason given: work travel conflict. Approve or reject it under Accountability." },
    ],
    facilitator: [
      { id: 1, header: "Session starting soon", details: "Your Synthesis Workshop session starts in 2 hours — Cohort 5, Sat 10:00am. Find the join link under My Sessions." },
      { id: 2, header: "Feedback incomplete", details: "2 students haven't submitted feedback for Discovery Interviews yet: Chioma Nwosu and Tunde Bakare." },
    ],
  };

  const renderScreen = (): ReactNode => {
    if (role === "student") {
      if (screen === "dashboard") return <StudentDashboard />;
      if (screen === "schedule") return <StudentSchedule />;
      if (screen === "resources") return <StudentResources />;
      if (screen === "assignment") return <AssignmentSubmission />;
      if (screen === "community") return <StudentCommunity />;
    }
    if (role === "admin") {
      if (screen === "dashboard") return <AdminDashboard />;
      if (screen === "users") return <AdminUsers />;
      if (screen === "cohorts") return <AdminCohorts />;
      if (screen === "classes") return <AdminClasses />;
      if (screen === "assignments") return <AdminAssignments />;
      if (screen === "accountability") return <AdminAccountability />;
      if (screen === "announcements") return <AdminAnnouncements />;
      if (screen === "reports") return <AdminReports />;
    }
    if (role === "facilitator") {
      if (screen === "sessions") return <FacilitatorSessions />;
      if (screen === "assignments") return <FacilitatorAssignments />;
      if (screen === "materials") return <FacilitatorMaterials />;
      if (screen === "feedback") return <FacilitatorFeedback />;
    }
    return null;
  };

  if (!loggedIn) {
    return (
      <LoginGate
        onLogin={(chosenRole) => {
          setRole(chosenRole);
          setLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-full bg-slate-50 font-sans text-slate-800">
      {noticeOpen && (
        <div className="bg-slate-900 text-slate-200 text-xs px-4 py-2 flex items-center justify-between">
          <span>Click-through prototype — each login is locked to one role's screens, matching production RLS.</span>
          <button onClick={() => setNoticeOpen(false)}><X size={14} /></button>
        </div>
      )}

      <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="font-serif text-lg text-slate-900 tracking-tight">
            ideate<span className="text-amber-500">X</span>
          </p>
          <Pill>{role === "student" ? "Student" : role === "admin" ? "Admin" : "Facilitator"}</Pill>
        </div>
        <div className="flex items-center gap-4">
          <NotificationBell items={NOTIFICATIONS_BY_ROLE[role]} />
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-medium">
              {identity.initials}
            </div>
            {identity.name}
            <button onClick={() => setLoggedIn(false)} title="Log out">
              <LogOut size={14} className="text-slate-400 hover:text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        <nav className="w-56 shrink-0 border-r border-slate-200 bg-white min-h-[calc(100vh-64px)] p-4">
          <div className="space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = screen === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setScreen(item.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active ? "bg-amber-50 text-amber-800 font-medium border-l-2 border-amber-500" : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        <main className="flex-1 p-8">{renderScreen()}</main>
      </div>
    </div>
  );
}
