import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import type { ResourceModuleGroup, ResourceType } from '../../types';

const RESOURCE_MODULES: ResourceModuleGroup[] = [
  {
    module: 'Module 1 — Orientation',
    items: [
      { type: 'slide', title: 'Orientation Deck' },
      { type: 'recording', title: 'Session Recording' },
    ],
  },
  {
    module: 'Module 2 — Discovery Fundamentals',
    items: [
      { type: 'slide', title: 'Discovery Methods Deck' },
      { type: 'link', title: 'Reading: Interviewing Users' },
    ],
  },
  {
    module: 'Module 3 — User Interviews',
    items: [
      { type: 'slide', title: 'Interview Guide Template' },
      { type: 'recording', title: 'Session Recording' },
      { type: 'link', title: 'Reading: Discovery Interviews Guide' },
    ],
  },
];

const TYPE_ICON: Record<ResourceType, string> = { slide: '📄', recording: '🎥', link: '🔗' };

export const StudentResourcesPage: React.FC = () => {
  const [query, setQuery] = useState<string>('');

  const filtered = RESOURCE_MODULES.map((m) => ({
    ...m,
    items: m.items.filter((i) => i.title.toLowerCase().includes(query.toLowerCase())),
  })).filter((m) => m.items.length > 0);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Eyebrow>Cohort 05</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">My Resources</h1>
        <p className="text-sm text-slate-400 mt-1">Stays available on your dashboard for life — even after the cohort ends.</p>
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search resources…"
          className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-amber-400"
        />
      </div>

      {filtered.length === 0 && <p className="text-sm text-slate-400">No resources match "{query}".</p>}

      {filtered.map((m) => (
        <Card key={m.module}>
          <Eyebrow>{m.module}</Eyebrow>
          <ul className="mt-2 space-y-2 text-sm text-slate-700">
            {m.items.map((i) => (
              <li key={i.title} className="flex items-center gap-2">
                <span>{TYPE_ICON[i.type]}</span> {i.title}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
};
