import React from 'react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { Pill } from '../../components/ui/Pill';
import type { FacilitatorSessionItem } from '../../types';

export const FacilitatorSessionsPage: React.FC = () => {
  const mySessions: (FacilitatorSessionItem & { meet_link?: string })[] = [
    { id: 1, title: 'Synthesis Workshop', cohort: 'Cohort 5', date: 'Sat 15 Nov, 10:00am', status: 'upcoming', meet_link: 'https://meet.google.com/abc-defg-hij' },
    { id: 2, title: 'Discovery Interviews', cohort: 'Cohort 5', date: 'Fri 14 Nov, 6:00pm', status: 'completed' },
    { id: 3, title: 'Portfolio Review', cohort: 'Cohort 6', date: 'Fri 21 Nov, 6:00pm', status: 'upcoming' },
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
            {s.status === 'upcoming' ? (
              s.meet_link ? (
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
              )
            ) : (
              <Pill tone="emerald">Completed</Pill>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
