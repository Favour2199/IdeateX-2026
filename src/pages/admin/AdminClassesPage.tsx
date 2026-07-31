import React, { useState, type ChangeEvent } from 'react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { Pill } from '../../components/ui/Pill';
import { PrimaryButton, GhostButton } from '../../components/ui/Button';

const SESSION_MONTH_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'short' });
const SESSION_DAY_FORMATTER = new Intl.DateTimeFormat('en-US', { day: 'numeric' });
const SESSION_DETAILS_FORMATTER = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});

interface LiveClassSession {
  id: number;
  title: string;
  date: string;
  facilitator: string;
}

interface NewSessionForm {
  title: string;
  date: string;
  time: string;
  facilitator: string;
  link: string;
}

const DEFAULT_FACILITATOR = 'Rashidat Raheem';

const INITIAL_SESSIONS: LiveClassSession[] = [
  { id: 1, title: 'Synthesis Workshop', date: '2026-11-15T10:00', facilitator: 'Rashidat Raheem' },
  { id: 2, title: 'Discovery Interviews', date: '2026-11-14T18:00', facilitator: 'Rashidat Raheem' },
];

const parseSessionDate = (value: string): Date | null => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const AdminClassesPage: React.FC = () => {
  const [cohort, setCohort] = useState<string>('Cohort 5');
  const [sessions, setSessions] = useState<LiveClassSession[]>(INITIAL_SESSIONS);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [form, setForm] = useState<NewSessionForm>({
    title: '',
    date: '',
    time: '',
    facilitator: DEFAULT_FACILITATOR,
    link: '',
  });

  const addSession = () => {
    if (!form.title.trim() || !form.date.trim() || !form.time.trim()) return;
    setSessions((s) => [
      ...s,
      { id: Date.now(), title: form.title, date: `${form.date}T${form.time}`, facilitator: form.facilitator },
    ]);
    setForm({ title: '', date: '', time: '', facilitator: DEFAULT_FACILITATOR, link: '' });
    setShowForm(false);
  };

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header + cohort selector */}
      <div className="flex items-center justify-between">
        <div>
          <Eyebrow>Live class scheduling</Eyebrow>
          <h1 className="text-2xl font-serif text-slate-900">Classes</h1>
        </div>
        <select
          value={cohort}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setCohort(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
        >
          <option>Cohort 5</option>
          <option>Cohort 6</option>
          <option>Cohort 4 · Alumni</option>
        </select>
      </div>

      {/* Scheduled classes card */}
      <Card>
        <div className="flex items-center justify-between mb-1">
          <Eyebrow>{cohort} — Scheduled Classes</Eyebrow>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="text-xs text-amber-700 font-medium hover:text-amber-900 transition-colors"
          >
            + Schedule
          </button>
        </div>

        {/* Schedule new session form */}
        {showForm && (
          <div className="grid grid-cols-2 gap-2 bg-amber-50/40 border border-amber-200 rounded-lg p-3 mb-3 mt-2">
            <input
              placeholder="Session title"
              value={form.title}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, title: e.target.value })}
              className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
            <div className="space-y-1">
              <label htmlFor="session-date" className="text-xs font-medium text-slate-600">
                Date
              </label>
              <input
                id="session-date"
                type="date"
                aria-label="Session date"
                value={form.date}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="session-time" className="text-xs font-medium text-slate-600">
                Time
              </label>
              <input
                id="session-time"
                type="time"
                aria-label="Session time"
                value={form.time}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, time: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
              />
            </div>
            <select
              value={form.facilitator}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, facilitator: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            >
              <option>Rashidat Raheem</option>
              <option>Faith Ojiakor</option>
            </select>
            <input
              placeholder="Google Meet link"
              value={form.link}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, link: e.target.value })}
              className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
            <div className="col-span-2 flex gap-2">
              <PrimaryButton onClick={addSession}>Schedule &amp; send reminders</PrimaryButton>
              <GhostButton onClick={() => setShowForm(false)}>Cancel</GhostButton>
            </div>
          </div>
        )}

        {/* Sessions list */}
        <div className="space-y-2 text-sm text-slate-700 mt-2">
          {sessions.length === 0 && (
            <p className="text-slate-400">No classes scheduled yet for {cohort}.</p>
          )}
          {sessions.map((s) => {
            const sessionDate = parseSessionDate(s.date);
            const monthLabel = sessionDate ? SESSION_MONTH_FORMATTER.format(sessionDate).toUpperCase() : 'TBD';
            const dayLabel = sessionDate ? SESSION_DAY_FORMATTER.format(sessionDate) : '--';
            const detailsLabel = sessionDate ? SESSION_DETAILS_FORMATTER.format(sessionDate) : s.date;

            return (
              <div
                key={s.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-16 overflow-hidden rounded-lg border border-slate-200 bg-white text-center">
                    <p className="border-b border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-semibold tracking-[0.2em] text-slate-500">
                      {monthLabel}
                    </p>
                    <p className="px-2 py-2 text-2xl font-semibold text-slate-900">{dayLabel}</p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{s.title}</p>
                    <p className="text-xs text-slate-500">{detailsLabel}</p>
                    <p className="text-xs text-slate-500">{s.facilitator}</p>
                  </div>
                </div>
                <Pill tone="emerald">Reminders scheduled</Pill>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
