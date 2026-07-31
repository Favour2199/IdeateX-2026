import React from 'react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';

export const AdminAccountabilityPage: React.FC = () => {
  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <Eyebrow>Accountability</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">Coming soon</h1>
      </div>
      <Card className="bg-slate-50/70">
        <p className="text-sm text-slate-600">
          The admin accountability dashboard is still being prepared. It will surface learner risk signals, follow-up
          workflows, and cohort accountability reporting here.
        </p>
      </Card>
    </div>
  );
};
