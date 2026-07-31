import React, { useState } from 'react';
import { ThumbsUp, MessageCircle, Award, Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Eyebrow } from '../../components/ui/Eyebrow';
import { Pill } from '../../components/ui/Pill';
import { PrimaryButton, GhostButton } from '../../components/ui/Button';
import type { ForumPost, StudyGroup } from '../../types';

export const StudentCommunityPage: React.FC = () => {
  const [tab, setTab] = useState<'forum' | 'groups'>('forum');
  const [posts, setPosts] = useState<ForumPost[]>([
    { id: 1, title: 'How do you structure interview notes before synthesis?', module: 'Module 3', upvotes: 12, replies: 4, official: true },
    { id: 2, title: 'Anyone free to practice mock interviews this weekend?', module: 'Module 3', upvotes: 5, replies: 2, official: false },
  ]);
  const [draft, setDraft] = useState<string>('');
  const [groups, setGroups] = useState<StudyGroup[]>([
    { id: 1, name: 'Discovery Interviews Study Group', members: 6, joined: true },
    { id: 2, name: 'Portfolio Review Circle', members: 9, joined: false },
  ]);

  const upvote = (id: number) => setPosts((p) => p.map((x) => (x.id === id ? { ...x, upvotes: x.upvotes + 1 } : x)));
  const addPost = () => {
    if (!draft.trim()) return;
    setPosts((p) => [{ id: Date.now(), title: draft, module: 'Module 3', upvotes: 0, replies: 0, official: false }, ...p]);
    setDraft('');
  };
  const toggleGroup = (id: number) =>
    setGroups((g) => g.map((x) => (x.id === id ? { ...x, joined: !x.joined, members: x.members + (x.joined ? -1 : 1) } : x)));

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Eyebrow>Cohort 05</Eyebrow>
        <h1 className="text-2xl font-serif text-slate-900">Community</h1>
      </div>

      <div className="flex bg-slate-100 rounded-lg p-1 text-sm w-fit">
        <button
          onClick={() => setTab('forum')}
          className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${tab === 'forum' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
        >
          Forum
        </button>
        <button
          onClick={() => setTab('groups')}
          className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${tab === 'groups' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
        >
          Study groups
        </button>
      </div>

      {tab === 'forum' ? (
        <div className="space-y-4">
          <Card>
            <div className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask the cohort something…"
                className="flex-1 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-400"
              />
              <PrimaryButton onClick={addPost}>Post</PrimaryButton>
            </div>
          </Card>

          {posts.map((post) => (
            <Card key={post.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-800">{post.title}</p>
                    {post.official && (
                      <Pill tone="emerald">
                        <span className="inline-flex items-center gap-1">
                          <Award size={11} /> Official answer
                        </span>
                      </Pill>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{post.module}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button onClick={() => upvote(post.id)} className="flex items-center gap-1 text-xs text-slate-500 hover:text-amber-600 cursor-pointer">
                    <ThumbsUp size={13} /> {post.upvotes}
                  </button>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <MessageCircle size={13} /> {post.replies}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map((g) => (
            <Card key={g.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">{g.name}</p>
                <p className="text-xs text-slate-400 mt-0.5">{g.members} members</p>
              </div>
              {g.joined ? (
                <GhostButton onClick={() => toggleGroup(g.id)}>Joined ✓</GhostButton>
              ) : (
                <PrimaryButton onClick={() => toggleGroup(g.id)}>Join</PrimaryButton>
              )}
            </Card>
          ))}
          <button className="text-sm text-amber-700 font-medium flex items-center gap-1 cursor-pointer">
            <Plus size={14} /> New study group
          </button>
        </div>
      )}
    </div>
  );
};
