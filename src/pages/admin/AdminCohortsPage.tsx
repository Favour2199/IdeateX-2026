import React, { useState, useEffect, type ChangeEvent } from 'react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { Pill } from '../../components/ui/Pill';
import { PrimaryButton, GhostButton } from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';

interface Cohort {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface NewCohortForm {
  name: string;
  start_date: string;
  end_date: string;
}

interface CohortMaterial {
  id: string;
  name: string;
  kind: 'document' | 'recording';
  status: 'Published' | 'Auto-attach in 24h';
}

const EMPTY_FORM: NewCohortForm = { name: '', start_date: '', end_date: '' };
const DEFAULT_MATERIALS: CohortMaterial[] = [
  { id: 'material-1', name: 'User Research.pptx', kind: 'document', status: 'Published' },
  { id: 'material-2', name: 'Session recording', kind: 'recording', status: 'Auto-attach in 24h' },
];

export const AdminCohortsPage: React.FC = () => {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<NewCohortForm>(EMPTY_FORM);
  const [materialsByCohort, setMaterialsByCohort] = useState<Record<string, CohortMaterial[]>>({});
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [pendingMaterialName, setPendingMaterialName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selected = cohorts.find((c) => c.id === selectedId) ?? null;
  const selectedMaterials = selected
    ? materialsByCohort[selected.id] ?? DEFAULT_MATERIALS
    : DEFAULT_MATERIALS;

  // ── Fetch cohorts ──────────────────────────────────────────────────────────
  const fetchCohorts = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchErr } = await supabase
        .from('cohorts')
        .select('*')
        .order('start_date', { ascending: true });

      if (fetchErr) throw fetchErr;
      const rows = data as Cohort[];
      setCohorts(rows);
      if (rows.length > 0 && !selectedId) {
        setSelectedId(rows[0].id);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load cohorts';
      setError(msg);
      // Graceful fallback: show a local placeholder so the page is still usable
      const fallback: Cohort[] = [
        { id: 'local-1', name: 'Cohort 5', start_date: '2026-10-04', end_date: '2026-12-20', status: 'active' },
        { id: 'local-2', name: 'Cohort 6', start_date: '2027-01-15', end_date: '2027-04-10', status: 'active' },
      ];
      setCohorts(fallback);
      if (!selectedId) setSelectedId(fallback[0].id);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchCohorts();
    }, 0);

    return () => window.clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Create cohort ─────────────────────────────────────────────────────────
  const createCohort = async () => {
    if (!form.name.trim() || !form.start_date || !form.end_date) return;
    setSaving(true);
    setError(null);
    try {
      const { data, error: insertErr } = await supabase
        .from('cohorts')
        .insert([{ name: form.name.trim(), start_date: form.start_date, end_date: form.end_date, status: 'active' }])
        .select()
        .single();

      if (insertErr) throw insertErr;
      const newCohort = data as Cohort;
      setCohorts((prev) => [...prev, newCohort]);
      setSelectedId(newCohort.id);
    } catch (err: unknown) {
      // Optimistic local fallback when Supabase RLS or table isn't set up yet
      const localCohort: Cohort = {
        id: `local-${Date.now()}`,
        name: form.name.trim(),
        start_date: form.start_date,
        end_date: form.end_date,
        status: 'active',
      };
      setCohorts((prev) => [...prev, localCohort]);
      setSelectedId(localCohort.id);
      const msg = err instanceof Error ? err.message : 'Saved locally (Supabase unavailable)';
      setError(msg);
    } finally {
      setForm(EMPTY_FORM);
      setShowForm(false);
      setSaving(false);
    }
  };

  const formatDate = (iso: string) => {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return iso;
    }
  };

  const uploadMaterial = () => {
    if (!selected || !pendingMaterialName.trim()) return;

    const currentMaterials = materialsByCohort[selected.id] ?? DEFAULT_MATERIALS;
    const nextMaterial: CohortMaterial = {
      id: `material-${Date.now()}`,
      name: pendingMaterialName.trim(),
      kind: 'document',
      status: 'Published',
    };

    setMaterialsByCohort((current) => ({
      ...current,
      [selected.id]: [...currentMaterials, nextMaterial],
    }));
    setPendingMaterialName('');
    setShowUploadForm(false);
  };

  return (
    <div className="grid grid-cols-[220px_1fr] gap-6">
      {/* Sidebar */}
      <div className="space-y-2">
        <Card className="p-3">
          <Eyebrow>Cohorts</Eyebrow>
          <div className="mt-2 space-y-1">
            {loading && <p className="text-xs text-slate-400 py-2">Loading…</p>}
            {cohorts.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                  selectedId === c.id
                    ? 'bg-amber-50 text-amber-800 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {c.name}
              </button>
            ))}
            <button
              onClick={() => setShowForm((s) => !s)}
              className="w-full mt-2 text-left text-sm px-3 py-2 rounded-lg text-slate-400 border border-dashed border-slate-200 hover:border-amber-300 hover:text-amber-700 transition-colors"
            >
              + New cohort
            </button>
          </div>
        </Card>

        {/* New Cohort form */}
        {showForm && (
          <Card className="p-3 bg-amber-50/40 border-amber-200">
            <Eyebrow>New cohort</Eyebrow>
            <div className="mt-2 space-y-2">
              <input
                placeholder="Cohort name (e.g. Cohort 7)"
                value={form.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
              />
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Start date</label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, start_date: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">End date</label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, end_date: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <PrimaryButton onClick={createCohort} disabled={saving || !form.name.trim()}>
                  {saving ? 'Creating…' : 'Create'}
                </PrimaryButton>
                <GhostButton onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}>
                  Cancel
                </GhostButton>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Detail panel */}
      {selected ? (
        <div className="space-y-5">
          {error && (
            <Card className="bg-amber-50 border-amber-200 text-amber-700 text-sm py-2">
              ⚠ {error}
            </Card>
          )}

          <div>
            <Eyebrow>Cohort detail</Eyebrow>
            <h1 className="text-2xl font-serif text-slate-900">{selected.name}</h1>
          </div>

          <Card>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Start</p>
                <p className="text-slate-800 font-medium">{formatDate(selected.start_date)}</p>
              </div>
              <div>
                <p className="text-slate-400">End</p>
                <p className="text-slate-800 font-medium">{formatDate(selected.end_date)}</p>
              </div>
              <div>
                <p className="text-slate-400">Status</p>
                <Pill tone={selected.status === 'active' ? 'emerald' : 'slate'}>
                  {selected.status}
                </Pill>
              </div>
            </div>
          </Card>

          <Card>
            <Eyebrow>Learning materials — Module 3</Eyebrow>
            <div className="mt-2 space-y-2 text-sm text-slate-700">
              {selectedMaterials.map((material) => (
                <div key={material.id} className="flex items-center justify-between">
                  <span>{material.kind === 'document' ? '📄' : '🎥'} {material.name}</span>
                  <Pill tone={material.status === 'Published' ? 'emerald' : 'amber'}>{material.status}</Pill>
                </div>
              ))}
            </div>
            {showUploadForm && (
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/40 p-3">
                <label className="mb-2 block text-xs font-medium text-slate-600">Upload material</label>
                <input
                  type="file"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPendingMaterialName(e.target.files?.[0]?.name ?? '')}
                  className="w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
                />
                {pendingMaterialName && <p className="mt-2 text-xs text-slate-500">Ready to upload: {pendingMaterialName}</p>}
                <div className="mt-3 flex gap-2">
                  <PrimaryButton onClick={uploadMaterial} disabled={!pendingMaterialName.trim()}>
                    Upload
                  </PrimaryButton>
                  <GhostButton onClick={() => { setShowUploadForm(false); setPendingMaterialName(''); }}>
                    Cancel
                  </GhostButton>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowUploadForm((current) => !current)}
              className="mt-3 text-sm text-amber-700 font-medium hover:text-amber-900 transition-colors"
            >
              + Upload material
            </button>
          </Card>

          <div className="flex gap-3">
            <GhostButton>Save draft</GhostButton>
            <PrimaryButton>Publish Schedule</PrimaryButton>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="flex items-center justify-center h-40">
            <p className="text-sm text-slate-400">Select a cohort to view details.</p>
          </div>
        )
      )}
    </div>
  );
};
