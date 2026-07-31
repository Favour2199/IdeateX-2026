import React from 'react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';

export const AdminAssignmentsPage: React.FC = () => {
  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <Eyebrow>Assignments</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">Coming soon</h1>
      </div>
      <Card className="bg-slate-50/70">
        <p className="text-sm text-slate-600">
          Assignment management for admins is still in progress. This page will cover cohort-wide assignment setup,
          submission monitoring, and grading oversight.
        </p>
      </Card>
    </div>
  );
};
