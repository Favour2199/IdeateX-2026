import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { Pill } from '../../components/ui/Pill';
import { PrimaryButton, GhostButton } from '../../components/ui/Button';
import type { ScheduleItem } from '../../types';

const SCHEDULE: (ScheduleItem & { meet_link?: string })[] = [
  { week: 1, title: 'Orientation & Problem Framing', date: 'Fri 19 · Sat 20 Sep', status: 'completed' },
  { week: 2, title: 'Discovery Fundamentals', date: 'Fri 26 · Sat 27 Sep', status: 'completed' },
  { week: 3, title: 'User Interviews', date: 'Fri 3 · Sat 4 Oct', status: 'completed' },
  { week: 4, title: 'Synthesis & Insight Mapping', date: 'Fri 10 · Sat 11 Oct', status: 'completed' },
  { week: 5, title: 'Problem-to-Solution Framing', date: 'Fri 17 · Sat 18 Oct', status: 'completed' },
  { week: 6, title: 'Discovery Interviews & Synthesis', date: 'Fri 14 · Sat 15 Nov', status: 'current', meet_link: 'https://meet.google.com/abc-defg-hij' },
  { week: 7, title: 'Prioritization & Roadmapping', date: 'Fri 21 · Sat 22 Nov', status: 'locked', reason: 'Unlocks once your Module 3 assignment shows Pass' },
  { week: 8, title: 'Stakeholder Communication', date: 'Fri 28 · Sat 29 Nov', status: 'upcoming' },
];

export const StudentSchedulePage: React.FC = () => {
  const [excused, setExcused] = useState<boolean>(false);
  const [showExcuseModal, setShowExcuseModal] = useState<boolean>(false);
  const [reason, setReason] = useState<string>('');
  const [excuseReason, setExcuseReason] = useState<string>('');

  const statusPill = (status: ScheduleItem['status']) => {
    if (status === 'completed') return <Pill tone="emerald">Completed</Pill>;
    if (status === 'current') return <Pill tone="amber">In progress</Pill>;
    if (status === 'locked') return <Pill tone="red">Locked</Pill>;
    return <Pill>Upcoming</Pill>;
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {showExcuseModal && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-30 p-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <Eyebrow>Advance excuse</Eyebrow>
            <h2 className="text-lg font-serif text-slate-900 mb-1">Why will you miss this session?</h2>
            <p className="text-xs text-slate-400 mb-3">Your coordinator reviews this before the session — approved excuses preserve your attendance credit.</p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Work travel conflict, family emergency…"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400 resize-none"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <GhostButton onClick={() => setShowExcuseModal(false)}>Cancel</GhostButton>
              <PrimaryButton
                onClick={() => {
                  if (reason.trim()) {
                    setExcuseReason(reason);
                    setExcused(true);
                    setShowExcuseModal(false);
                  }
                }}
                disabled={!reason.trim()}
              >
                Submit excuse
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      <div>
        <Eyebrow>Cohort 05</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">Full Schedule</h1>
      </div>

      <div className="space-y-3">
        {SCHEDULE.map((s) => (
          <Card key={s.week} className={s.status === 'locked' ? 'opacity-70' : ''}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {s.status === 'locked' ? (
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

            {s.status === 'current' && (
              <div className="flex items-center gap-3 mt-4 pl-[68px]">
                {s.meet_link ? (
                  <a
                    href={s.meet_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Join Google Meet
                  </a>
                ) : (
                  <button disabled className="bg-slate-100 text-slate-400 text-xs font-medium px-3 py-1.5 rounded-lg cursor-not-allowed">
                    Join Google Meet
                  </button>
                )}
                {!excused ? (
                  <button onClick={() => setShowExcuseModal(true)} className="text-xs text-slate-500 underline cursor-pointer">
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
};
