import React, { useState, type ChangeEvent } from 'react';
import { Search } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { Pill } from '../../components/ui/Pill';
import { PrimaryButton, GhostButton } from '../../components/ui/Button';

interface PlatformUser {
  id: number;
  name: string;
  email: string;
  role: string;
  cohort: string;
  active: boolean;
}

interface NewUserForm {
  name: string;
  email: string;
  role: string;
  cohort: string;
}

const INITIAL_USERS: PlatformUser[] = [
  { id: 1, name: 'David Adeleke', email: 'david.a@example.com', role: 'Student', cohort: 'Cohort 5', active: true },
  { id: 2, name: 'Rashidat Raheem', email: 'rashidat@example.com', role: 'Facilitator', cohort: 'Cohort 5', active: true },
  { id: 3, name: 'Aderonke Mercy', email: 'aderonke@example.com', role: 'Coordinator', cohort: 'Cohort 6', active: true },
  { id: 4, name: 'Emmanuel Kalasuwe', email: 'emmanuel.k@example.com', role: 'Student', cohort: 'Cohort 4 · Alumni', active: false },
];

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<PlatformUser[]>(INITIAL_USERS);
  const [query, setQuery] = useState<string>('');
  const [showForm, setShowForm] = useState<boolean>(false);
  const [form, setForm] = useState<NewUserForm>({ name: '', email: '', role: 'Student', cohort: 'Cohort 5' });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase())
  );

  const addUser = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    setUsers((u) => [{ id: Date.now(), ...form, active: true }, ...u]);
    setForm({ name: '', email: '', role: 'Student', cohort: 'Cohort 5' });
    setShowForm(false);
  };

  const toggleActive = (id: number) =>
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Eyebrow>Platform users</Eyebrow>
          <h1 className="text-2xl font-serif text-slate-900">Users</h1>
        </div>
        <PrimaryButton onClick={() => setShowForm((s) => !s)}>
          + Add user
        </PrimaryButton>
      </div>

      {/* Add-user form */}
      {showForm && (
        <Card className="bg-amber-50/40 border-amber-200">
          <Eyebrow>New user</Eyebrow>
          <div className="grid grid-cols-2 gap-3 mt-2">
            <input
              placeholder="Full name"
              value={form.name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, email: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            />
            <select
              value={form.role}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, role: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            >
              <option>Student</option>
              <option>Facilitator</option>
              <option>Coordinator</option>
              <option>Admin</option>
            </select>
            <select
              value={form.cohort}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm({ ...form, cohort: e.target.value })}
              className="border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
            >
              <option>Cohort 5</option>
              <option>Cohort 6</option>
              <option>Cohort 4 · Alumni</option>
            </select>
          </div>
          <div className="flex gap-2 mt-3">
            <PrimaryButton onClick={addUser}>
              Create &amp; send activation email
            </PrimaryButton>
            <GhostButton onClick={() => setShowForm(false)}>
              Cancel
            </GhostButton>
          </div>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-amber-400"
        />
      </div>

      {/* Users table */}
      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-100">
              <th className="py-2 font-normal">Name</th>
              <th className="py-2 font-normal">Email</th>
              <th className="py-2 font-normal">Role</th>
              <th className="py-2 font-normal">Cohort</th>
              <th className="py-2 font-normal">Status</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-4 text-slate-400 text-center">
                  No users found.
                </td>
              </tr>
            )}
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 last:border-0">
                <td className="py-2.5 font-medium">{u.name}</td>
                <td className="text-slate-500">{u.email}</td>
                <td>{u.role}</td>
                <td>{u.cohort}</td>
                <td>
                  <button onClick={() => toggleActive(u.id)}>
                    {u.active ? (
                      <Pill tone="emerald">Active</Pill>
                    ) : (
                      <Pill tone="red">Inactive</Pill>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
