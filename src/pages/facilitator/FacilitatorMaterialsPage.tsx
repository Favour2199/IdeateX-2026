import React, { useState } from 'react';
import { FileText, Link2, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { Pill } from '../../components/ui/Pill';
import { PrimaryButton, GhostButton } from '../../components/ui/Button';
import type { Material, MaterialType, NewMaterialForm } from '../../types';

export const FacilitatorMaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([
    { id: 1, type: 'pdf', title: 'Interview Guide Template' },
    { id: 2, type: 'article', title: 'Writing Better Discovery Questions' },
    { id: 3, type: 'link', title: 'Reading: Discovery Interviews Guide' },
  ]);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [form, setForm] = useState<NewMaterialForm>({ type: 'pdf', title: '' });

  const addMaterial = () => {
    if (!form.title.trim()) return;
    setMaterials((m) => [{ id: Date.now(), type: form.type, title: form.title }, ...m]);
    setForm({ type: 'pdf', title: '' });
    setShowForm(false);
  };

  const removeMaterial = (id: number) => setMaterials((m) => m.filter((x) => x.id !== id));

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <Eyebrow>Cohort 5 · Module 3</Eyebrow>
          <h1 className="text-2xl font-serif text-slate-900">Materials</h1>
        </div>
        <PrimaryButton onClick={() => setShowForm((s) => !s)}>+ Add material</PrimaryButton>
      </div>

      {showForm && (
        <Card className="bg-amber-50/40 border-amber-200">
          <div className="grid grid-cols-3 gap-2">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as MaterialType })}
              className="border border-slate-200 rounded-lg px-2 py-2 text-sm outline-none focus:border-amber-400"
            >
              <option value="pdf">PDF</option>
              <option value="article">Article</option>
              <option value="link">Link</option>
            </select>
            <input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="col-span-2 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
          </div>
          <div className="flex gap-2 mt-3">
            <PrimaryButton onClick={addMaterial}>Add</PrimaryButton>
            <GhostButton onClick={() => setShowForm(false)}>Cancel</GhostButton>
          </div>
        </Card>
      )}

      <Card>
        <div className="space-y-2">
          {materials.length === 0 && <p className="text-sm text-slate-400">No materials yet.</p>}
          {materials.map((m) => (
            <div key={m.id} className="flex items-center justify-between text-sm text-slate-700 border-b border-slate-50 last:border-0 pb-2 last:pb-0">
              <span className="flex items-center gap-2">
                {m.type === 'link' ? <Link2 size={14} className="text-slate-400" /> : <FileText size={14} className="text-slate-400" />} {m.title}
              </span>
              <span className="flex items-center gap-2">
                <Pill>{m.type.toUpperCase()}</Pill>
                <button onClick={() => removeMaterial(m.id)} className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer">
                  <X size={12} /> Remove
                </button>
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
