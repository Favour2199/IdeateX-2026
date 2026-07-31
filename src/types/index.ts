import type { LucideIcon } from 'lucide-react';

export type Role = 'student' | 'admin' | 'facilitator';
export type Tone = 'slate' | 'amber' | 'emerald' | 'red';

export type IconType = LucideIcon;

export interface NavItem {
  key: string;
  label: string;
  icon: IconType;
}

export interface NotificationItem {
  id: number;
  header: string;
  details: string;
}

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  cohort: string;
  active: boolean;
  created_at?: string;
}

export interface PlatformUser {
  id: number;
  name: string;
  email: string;
  role: string;
  cohort: string;
  active: boolean;
}

export interface NewUserForm {
  name: string;
  email: string;
  role: string;
  cohort: string;
}

export interface ScheduleItem {
  week: number;
  title: string;
  date: string;
  status: 'completed' | 'current' | 'locked' | 'upcoming';
  reason?: string;
}

export type ResourceType = 'slide' | 'recording' | 'link';
export interface ResourceItem {
  type: ResourceType;
  title: string;
}
export interface ResourceModuleGroup {
  module: string;
  items: ResourceItem[];
}

export interface ForumPost {
  id: number;
  title: string;
  module: string;
  upvotes: number;
  replies: number;
  official: boolean;
}

export interface StudyGroup {
  id: number;
  name: string;
  members: number;
  joined: boolean;
}

export interface LiveClassSession {
  id: number;
  title: string;
  date: string;
  facilitator: string;
}

export interface NewSessionForm {
  title: string;
  date: string;
  facilitator: string;
  link: string;
}

export interface AssignmentStudent {
  name: string;
  submitted?: boolean;
  attachment: string | null;
  grade: string;
}

export interface Assignment {
  id: number;
  title: string;
  cohort: string;
  module: string;
  dueDate: string;
  attachment: string | null;
  students: AssignmentStudent[];
}

export interface NewAssignmentForm {
  title: string;
  cohort: string;
  module: string;
  dueDate: string;
  attachment: string;
}

export interface RankedStudent {
  name: string;
  score: number;
  attendance: number;
  assignments: number;
  feedback: number;
  status: 'Good standing' | 'At risk' | 'Strike issued';
}

export interface ExcuseRequest {
  id: number;
  student: string;
  session: string;
  reason: string;
}

export interface AppealRequest {
  id: number;
  student: string;
  reason: string;
}

export interface Announcement {
  id: number;
  target: string;
  message: string;
  time: string;
  read: number;
  total: number;
}

export type ReportType = 'Completion' | 'Attendance' | 'Assignment';
export type ReportRow = [string, string, string];

export interface FacilitatorSessionItem {
  id: number;
  title: string;
  cohort: string;
  date: string;
  status: 'upcoming' | 'completed';
}

export type MaterialType = 'pdf' | 'article' | 'link';
export interface Material {
  id: number;
  type: MaterialType;
  title: string;
}

export interface NewMaterialForm {
  type: MaterialType;
  title: string;
}
