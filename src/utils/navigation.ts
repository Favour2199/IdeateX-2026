import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  ClipboardList,
  Users2,
  GraduationCap,
  ShieldAlert,
  Megaphone,
  BarChart3,
  Star,
  MessageSquare,
} from 'lucide-react';
import type { NavItem, NotificationItem, Role } from '../types';

export const STUDENT_NAV: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'schedule', label: 'Schedule', icon: CalendarDays },
  { key: 'resources', label: 'Resources', icon: BookOpen },
  { key: 'assignments', label: 'Assignments', icon: ClipboardList },
  { key: 'community', label: 'Community', icon: MessageSquare },
];

export const ADMIN_NAV: NavItem[] = [
  { key: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { key: 'users', label: 'Users', icon: Users2 },
  { key: 'cohorts', label: 'Cohorts', icon: GraduationCap },
  { key: 'classes', label: 'Classes', icon: CalendarDays },
  { key: 'assignments', label: 'Assignments', icon: ClipboardList },
  { key: 'accountability', label: 'Accountability', icon: ShieldAlert },
  { key: 'announcements', label: 'Announcements', icon: Megaphone },
  { key: 'reports', label: 'Reports', icon: BarChart3 },
];

export const FACILITATOR_NAV: NavItem[] = [
  { key: 'sessions', label: 'My Sessions', icon: CalendarDays },
  { key: 'assignments', label: 'Assignments', icon: ClipboardList },
  { key: 'materials', label: 'Materials', icon: BookOpen },
  { key: 'feedback', label: 'My Feedback', icon: Star },
];

export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  student: STUDENT_NAV,
  admin: ADMIN_NAV,
  facilitator: FACILITATOR_NAV,
};

export const NOTIFICATIONS_BY_ROLE: Record<Role, NotificationItem[]> = {
  student: [
    {
      id: 1,
      header: 'Class starting soon',
      details:
        'Synthesis Workshop starts in 2 hours — Sat 10:00am with Rashidat Raheem. Join from your Schedule page or the Dashboard banner.',
    },
    {
      id: 2,
      header: 'Assignment due soon',
      details:
        'Module 3 — User Research Synthesis is due in 2 days (Sat, 14 Nov, 11:59pm). This assignment gates Module 7, so submitting on time keeps your schedule unlocked.',
    },
    {
      id: 3,
      header: 'Facilitator profile published',
      details:
        "Rashidat Raheem's profile is now available ahead of Saturday's session — view her background and bio from the Schedule page.",
    },
  ],
  admin: [
    {
      id: 1,
      header: '14 students flagged at-risk',
      details:
        '14 students across Cohort 5 and Cohort 6 have a Commitment Score below the 60-point threshold this week. Review them under Accountability.',
    },
    {
      id: 2,
      header: '37 assignments pending review',
      details:
        '37 submissions across active cohorts are awaiting grading. The oldest submission has been waiting 3 days.',
    },
    {
      id: 3,
      header: 'New excuse request',
      details:
        'Chioma Nwosu requested an excuse for Synthesis Workshop (Sat 15 Nov) — reason given: work travel conflict. Approve or reject it under Accountability.',
    },
  ],
  facilitator: [
    {
      id: 1,
      header: 'Session starting soon',
      details:
        'Your Synthesis Workshop session starts in 2 hours — Cohort 5, Sat 10:00am. Find the join link under My Sessions.',
    },
    {
      id: 2,
      header: 'Feedback incomplete',
      details:
        "2 students haven't submitted feedback for Discovery Interviews yet: Chioma Nwosu and Tunde Bakare.",
    },
  ],
};
