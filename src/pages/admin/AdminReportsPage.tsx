import React from 'react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';

export const AdminReportsPage: React.FC = () => {
  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <Eyebrow>Reports</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">Coming soon</h1>
      </div>
      <Card className="bg-slate-50/70">
        <p className="text-sm text-slate-600">
          The admin reports dashboard is still in progress. This page will bring together cohort reporting, completion
          metrics, and export-ready summaries.
        </p>
      </Card>
    </div>
  );
};
