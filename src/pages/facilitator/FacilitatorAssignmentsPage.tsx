import React, { useState } from 'react';
import { Paperclip } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import type { AssignmentStudent } from '../../types';

const normalizeGrade = (value: string) => {
  if (value.trim() === '') return '';

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return '';

  return String(Math.min(100, Math.max(0, numericValue)));
};

export const FacilitatorAssignmentsPage: React.FC = () => {
  const [students, setStudents] = useState<AssignmentStudent[]>([
    { name: 'David Adeleke', attachment: 'david_m3.pdf', grade: '' },
    { name: 'Chidi Okafor', attachment: 'chidi_m3.pdf', grade: '84' },
    { name: 'Amaka Obi', attachment: null, grade: '' },
  ]);

  const total = students.length;
  const submitted = students.filter((s) => s.submitted ?? !!s.attachment).length;
  const notSubmitted = total - submitted;

  const setGrade = (name: string, grade: string) => {
    const normalizedGrade = normalizeGrade(grade);
    setStudents((all) => all.map((s) => (s.name === name ? { ...s, grade: normalizedGrade } : s)));
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Eyebrow>Cohort 5 · Module 3</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">User Research Synthesis</h1>
        <p className="text-sm text-slate-400 mt-1">Grading for the students assigned to your sessions.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-xs text-slate-400">Expected</p>
          <p className="text-2xl font-serif text-slate-900 mt-1">{total}</p>
        </Card>
        <Card className="text-center bg-emerald-50/40 border-emerald-200">
          <p className="text-xs text-slate-400">Submitted</p>
          <p className="text-2xl font-serif text-emerald-700 mt-1">{submitted}</p>
        </Card>
        <Card className="text-center bg-red-50/40 border-red-200">
          <p className="text-xs text-slate-400">Not submitted</p>
          <p className="text-2xl font-serif text-red-600 mt-1">{notSubmitted}</p>
        </Card>
      </div>

      <Card>
        <Eyebrow>Students · Attachments · Grade</Eyebrow>
        <table className="w-full text-sm mt-2">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2 font-normal">Student</th>
              <th className="py-2 font-normal">Attachment</th>
              <th className="py-2 font-normal">Grade</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {students.map((s) => (
              <tr key={s.name} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5">{s.name}</td>
                <td>
                  {s.attachment ? (
                    <span className="flex items-center gap-1 text-xs text-amber-700">
                      <Paperclip size={12} /> {s.attachment}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-300">—</span>
                  )}
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      inputMode="numeric"
                      placeholder="0"
                      value={s.grade}
                      onChange={(e) => setGrade(s.name, e.target.value)}
                      disabled={!s.attachment}
                      aria-label={`${s.name} grade percentage`}
                      className="w-20 border border-slate-200 rounded-md px-2 py-1 text-xs outline-none focus:border-amber-400 disabled:opacity-40"
                    />
                    <span className="text-xs text-slate-500">%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
