import React, { useState } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { Pill } from '../../components/ui/Pill';

export const StudentAssignmentsPage: React.FC = () => {
  const [submitted, setSubmitted] = useState<boolean>(false);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Eyebrow>Module 3</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">User Research Synthesis</h1>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Card>
          <Eyebrow>Due</Eyebrow>
          <p className="text-slate-800 font-medium mt-1">Sat, 14 Nov · 11:59pm</p>
          <p className="text-xs text-slate-400 mt-1">Locks Module 7 until submitted and passed</p>
        </Card>
        <Card>
          <Eyebrow>Status</Eyebrow>
          <p className="mt-1">
            {submitted ? <Pill tone="emerald">Submitted</Pill> : <Pill tone="red">Not submitted — 2 days left</Pill>}
          </p>
        </Card>
      </div>

      {!submitted ? (
        <Card className="border-dashed border-2 border-amber-300 bg-amber-50/40 text-center py-10">
          <UploadCloud className="mx-auto text-amber-500" size={32} />
          <p className="mt-3 text-slate-700 font-medium">Drag your file here, or</p>
          <button
            onClick={() => setSubmitted(true)}
            className="mt-3 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
          >
            Browse and submit
          </button>
          <p className="mt-3 text-xs text-slate-400">PDF, DOCX, PPTX, or a Figma link · max 25MB</p>
        </Card>
      ) : (
        <Card className="text-center py-10 border-emerald-200 bg-emerald-50/40">
          <CheckCircle2 className="mx-auto text-emerald-600" size={32} />
          <p className="mt-3 text-slate-800 font-medium">Submitted — Sat 12:04pm</p>
          <p className="text-sm text-slate-500 mt-1">David and the assigned tutor were notified. This timestamp is the system of record.</p>
        </Card>
      )}

      <Card>
        <Eyebrow>Submission history</Eyebrow>
        <div className="mt-2 space-y-2 text-sm text-slate-700">
          <div className="flex items-center justify-between">
            <span>Module 2 — submitted Wed 4:02pm</span>
            <Pill tone="emerald">Passed</Pill>
          </div>
          <div className="flex items-center justify-between">
            <span>Module 1 — submitted Fri 6:45pm</span>
            <Pill tone="emerald">Passed</Pill>
          </div>
        </div>
      </Card>
    </div>
  );
};
