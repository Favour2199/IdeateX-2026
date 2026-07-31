import React from 'react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { MetricBar } from '../../components/ui/MetricBar';

export const FacilitatorFeedbackPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Eyebrow>Facilitator</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">My Feedback</h1>
      </div>

      <Card className="flex items-center gap-6">
        <div>
          <p className="text-3xl font-serif text-slate-900">
            4.6<span className="text-base text-slate-400">/5</span>
          </p>
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
};
