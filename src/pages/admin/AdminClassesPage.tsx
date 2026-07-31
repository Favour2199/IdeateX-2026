import React, { useState, type ChangeEvent } from 'react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { Pill } from '../../components/ui/Pill';
import { PrimaryButton, GhostButton } from '../../components/ui/Button';

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

const INITIAL_SESSIONS: LiveClassSession[] = [
  { id: 1, title: 'Synthesis Workshop', date: 'Sat 15 Nov, 10:00am', facilitator: 'Rashidat Raheem' },
  { id: 2, title: 'Discovery Interviews', date: 'Fri 14 Nov, 6:00pm', facilitator: 'Rashidat Raheem' },
];

export const AdminClassesPage: React.FC = () => {
  const [cohort, setCohort] = useState<string>('Cohort 5');
  const [sessions, setSessions] = useState<LiveClassSession[]>(INITIAL_SESSIONS);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [form, setForm] = useState<NewSessionForm>({
    title: '',
    date: '',
    facilitator: 'Rashidat Raheem',
    link: '',
  });

  const addSession = () => {
    if (!form.title.trim() || !form.date.trim()) return;
    setSessions((s) => [
      ...s,
      { id: Date.now(), title: form.title, date: form.date, facilitator: form.facilitator },
    ]);
    setForm({ title: '', date: '', facilitator: 'Rashidat Raheem', link: '' });
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
            <input
              placeholder="Date & time (e.g. Sat 22 Nov, 10:00am)"
              value={form.date}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, date: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
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
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between">
              <span>
                {s.title} — {s.date} · {s.facilitator}
              </span>
              <Pill tone="emerald">Reminders scheduled</Pill>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
