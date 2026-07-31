import React from 'react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { Pill } from '../../components/ui/Pill';
import { PrimaryButton, GhostButton } from '../../components/ui/Button';
import type { Tone } from '../../types';

export const AdminOverviewPage: React.FC = () => {
  const kpis: { label: string; value: string; tone: Tone }[] = [
    { label: 'Total students', value: '842', tone: 'slate' },
    { label: 'Avg attendance', value: '88%', tone: 'emerald' },
    { label: 'Pending reviews', value: '37', tone: 'amber' },
    { label: 'At-risk students', value: '14', tone: 'red' },
  ];
  const tones: Record<Tone, string> = {
    slate: 'text-slate-900',
    emerald: 'text-emerald-700',
    amber: 'text-amber-700',
    red: 'text-red-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <Eyebrow>Program overview</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">Admin Overview</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <p className="text-xs text-slate-400">{k.label}</p>
            <p className={`text-3xl font-serif mt-1 ${tones[k.tone]}`}>{k.value}</p>
          </Card>
        ))}
      </div>

      <Card>
        <Eyebrow>Active cohorts</Eyebrow>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2 font-normal">Cohort</th>
              <th className="py-2 font-normal">Students</th>
              <th className="py-2 font-normal">Attendance</th>
              <th className="py-2 font-normal">Assignments</th>
              <th className="py-2 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            <tr className="border-b border-slate-50">
              <td className="py-2.5">Cohort 5</td>
              <td>62</td>
              <td>88%</td>
              <td>80%</td>
              <td><Pill tone="emerald">Active</Pill></td>
            </tr>
            <tr className="border-b border-slate-50">
              <td className="py-2.5">Cohort 6</td>
              <td>58</td>
              <td>91%</td>
              <td>74%</td>
              <td><Pill tone="emerald">Active</Pill></td>
            </tr>
            <tr>
              <td className="py-2.5">Cohort 4 · Alumni</td>
              <td>55</td>
              <td>—</td>
              <td>—</td>
              <td><Pill>Completed</Pill></td>
            </tr>
          </tbody>
        </table>
      </Card>

      <div className="flex flex-wrap gap-3">
        <PrimaryButton>+ Create cohort</PrimaryButton>
        <GhostButton>+ Schedule live class</GhostButton>
        <GhostButton>+ Send announcement</GhostButton>
      </div>
    </div>
  );
};
