import React, { useState } from 'react';
import { Video, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { Pill } from '../../components/ui/Pill';
import { Gauge } from '../../components/ui/Gauge';
import { MetricBar } from '../../components/ui/MetricBar';

// Placeholder — in production this would come from the sessions table
const NEXT_SESSION_MEET_LINK = 'https://meet.google.com/abc-defg-hij';

export const StudentDashboardPage: React.FC = () => {
  const [justLeft, setJustLeft] = useState<boolean>(false);

  return (
    <div className="space-y-6">
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
          <a
            href={NEXT_SESSION_MEET_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-amber-500 hover:bg-amber-400 text-slate-900 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Join Google Meet
          </a>
          <button
            onClick={() => setJustLeft(true)}
            className="text-xs text-slate-400 underline underline-offset-2 cursor-pointer"
          >
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
};
