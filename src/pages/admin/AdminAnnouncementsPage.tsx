import React, { useState, type ChangeEvent } from 'react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { Pill } from '../../components/ui/Pill';
import { PrimaryButton } from '../../components/ui/Button';

interface Announcement {
  id: number;
  target: string;
  message: string;
  time: string;
  read: number;
  total: number;
}

const SEED_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 1,
    target: 'Cohort 5',
    message: 'Module 3 recordings are now live on your dashboard.',
    time: '2 days ago',
    read: 41,
    total: 62,
  },
];

export const AdminAnnouncementsPage: React.FC = () => {
  const [target, setTarget] = useState<string>('Cohort 5');
  const [message, setMessage] = useState<string>('');
  const [sent, setSent] = useState<Announcement[]>(SEED_ANNOUNCEMENTS);

  const send = () => {
    if (!message.trim()) return;
    const total = target === 'All cohorts' ? 175 : 60;
    setSent((prev) => [
      { id: Date.now(), target, message, time: 'just now', read: 0, total },
      ...prev,
    ]);
    setMessage('');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Eyebrow>Communication</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">Announcements</h1>
      </div>

      {/* Compose */}
      <Card>
        <div className="flex gap-2 mb-2">
          <select
            value={target}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setTarget(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
          >
            <option>Cohort 5</option>
            <option>Cohort 6</option>
            <option>All cohorts</option>
          </select>
        </div>
        <textarea
          value={message}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          placeholder="Write an announcement…"
          rows={3}
          className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 resize-none"
        />
        <PrimaryButton className="mt-3" onClick={send} disabled={!message.trim()}>
          Send announcement
        </PrimaryButton>
      </Card>

      {/* Sent feed */}
      <div className="space-y-3">
        {sent.length === 0 && (
          <p className="text-sm text-slate-400">No announcements sent yet.</p>
        )}
        {sent.map((s) => (
          <Card key={s.id}>
            <div className="flex items-center justify-between mb-1">
              <Pill>{s.target}</Pill>
              <span className="text-xs text-slate-400">{s.time}</span>
            </div>
            <p className="text-sm text-slate-700">{s.message}</p>
            <p className="text-xs text-slate-400 mt-2">
              {s.read} of {s.total} read
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
};
